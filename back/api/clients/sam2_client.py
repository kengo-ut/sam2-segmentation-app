import os
import re
import shutil
import subprocess
from collections import defaultdict
from pathlib import Path

import numpy as np
import torch
from core import apply_mask_pil
from fastapi import APIRouter, HTTPException
from models import Prompt, VideoInfo
from PIL import Image
from sam2.build_sam import build_sam2_video_predictor


class SAM2Client:
    def __init__(self, ckpt_path: str, cfg_path: str):
        self.device = torch.device(
            "cuda"
            if torch.cuda.is_available()
            else "mps" if torch.backends.mps.is_available() else "cpu"
        )

        if self.device.type == "cuda":
            torch.backends.cuda.matmul.allow_tf32 = True
            torch.backends.cudnn.allow_tf32 = True

        self.predictor = build_sam2_video_predictor(
            cfg_path, ckpt_path, device=str(self.device)
        )
        self.inference_state = None
        self.video_info: VideoInfo = VideoInfo(width=0, height=0, num_frames=0)

    def _split_video_into_frames(self, video_path: Path):
        filename = video_path.stem
        self.frame_dir = video_path.parent.parent / "processed" / filename
        self.raw_dir = self.frame_dir / "raw"
        self.state_dir = self.frame_dir / "state"
        self.over_dir = self.frame_dir / "over"

        for directory in [self.frame_dir, self.raw_dir, self.state_dir, self.over_dir]:
            directory.mkdir(parents=True, exist_ok=True)

        subprocess.run(
            [
                "ffmpeg",
                "-i",
                str(video_path),
                "-q:v",
                "2",
                "-start_number",
                "0",
                f"{self.raw_dir}/%05d.jpg",
            ],
            check=True,
        )
        shutil.copytree(self.raw_dir, self.state_dir, dirs_exist_ok=True)

    def _manage_video_fps(self, video_path: Path):
        fps = subprocess.check_output(
            [
                "ffprobe",
                "-v",
                "error",
                "-select_streams",
                "v:0",
                "-show_entries",
                "stream=r_frame_rate",
                "-of",
                "default=noprint_wrappers=1:nokey=1",
                str(video_path),
            ]
        )
        fps_match = re.match(r"(\d+)/(\d+)", fps.decode().strip())
        if fps_match is None:
            raise ValueError("Could not determine video FPS")

        self.fps = int(fps_match.group(1)) / int(fps_match.group(2))

    def register_video(self, video_path: Path) -> VideoInfo:
        self._split_video_into_frames(video_path)
        self._manage_video_fps(video_path)
        self.frame_names = sorted([f.name for f in self.raw_dir.glob("*.jpg")])
        frame = Image.open(self.raw_dir / self.frame_names[0])
        self.video_info = VideoInfo(
            width=frame.width, height=frame.height, num_frames=len(self.frame_names)
        )
        self.inference_state = self.predictor.init_state(str(self.raw_dir))
        return self.video_info

    def reset_state(self):
        self.predictor.reset_state(self.inference_state)
        shutil.copytree(self.raw_dir, self.state_dir, dirs_exist_ok=True)

    def apply_prompts(self, prompts: list[Prompt]):
        grouped_prompts: defaultdict[tuple[int, int], dict] = defaultdict(
            lambda: {"points": [], "labels": []}
        )
        for prompt in prompts:
            point_x = min(
                prompt.point.x * self.video_info.width, self.video_info.width - 1
            )
            point_y = min(
                prompt.point.y * self.video_info.height, self.video_info.height - 1
            )
            point = [point_x, point_y]
            grouped_prompts[(prompt.obj_id, prompt.frame_idx)]["points"].append(point)
            grouped_prompts[(prompt.obj_id, prompt.frame_idx)]["labels"].append(
                prompt.label
            )

        for (obj_id, frame_idx), data in grouped_prompts.items():
            point_array = np.array(data["points"], dtype=np.float32)
            label_array = np.array(data["labels"], dtype=np.int32)
            _, out_obj_ids, out_mask_logits = self.predictor.add_new_points_or_box(
                inference_state=self.inference_state,
                frame_idx=frame_idx,
                obj_id=obj_id,
                points=point_array,
                labels=label_array,
            )
            mask_dict = {
                obj_id: (mask > 0.0).cpu().numpy()
                for obj_id, mask in zip(out_obj_ids, out_mask_logits)
            }
            apply_mask_pil(
                Image.open(self.raw_dir / self.frame_names[frame_idx]),
                mask_dict,
                "color",
            ).save(self.state_dir / self.frame_names[frame_idx])

    def propagate_prompts(self, effect="color"):
        video_segments = {
            out_frame_idx: {
                out_obj_id: (out_mask_logits[i] > 0.0).cpu().numpy()
                for i, out_obj_id in enumerate(out_obj_ids)
            }
            for out_frame_idx, out_obj_ids, out_mask_logits in self.predictor.propagate_in_video(
                self.inference_state
            )
        }

        for frame_idx, masks in video_segments.items():
            apply_mask_pil(
                Image.open(self.raw_dir / self.frame_names[frame_idx]), masks, effect
            ).save(self.state_dir / self.frame_names[frame_idx])

    def export_frames_to_video(self, output_path: Path):
        subprocess.run(
            [
                "ffmpeg",
                "-y",
                "-framerate",
                str(self.fps),
                "-i",
                str(self.state_dir / "%05d.jpg"),
                "-vf",
                "pad=ceil(iw/2)*2:ceil(ih/2)*2",
                "-c:v",
                "libx264",
                "-crf",
                "18",
                "-pix_fmt",
                "yuv420p",
                str(output_path),
            ],
            check=True,
        )


sam2_client = SAM2Client(
    "checkpoints/sam2.1_hiera_large.pt", "configs/sam2.1/sam2.1_hiera_l.yaml"
)
