import os
from pathlib import Path

from clients import sam2_client
from fastapi import APIRouter, HTTPException
from models import Effect, Prompt, VideoInfo

router = APIRouter(prefix="/segmentation", tags=["segmentation"])
public_dir = os.getenv("PUBLIC_DIR", "")


@router.post("/initialize", response_model=VideoInfo)
async def initialize_video(filename: str):
    try:
        video_dir = Path(public_dir) / "videos"
        video_path = video_dir / f"{filename}.mp4"
        if not video_path.exists():
            raise HTTPException(status_code=404, detail=f"File not found: {video_path}")
        return sam2_client.register_video(video_path)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.post("/apply", response_model=dict)
async def apply_prompts(prompts: list[Prompt]):
    try:
        sam2_client.apply_prompts(prompts)
        return {"message": "Prompts applied successfully"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.post("/propagate", response_model=dict)
async def propagate_prompts(effect: Effect):
    try:
        sam2_client.propagate_prompts(effect)
        return {"message": "Prompts propagated successfully"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.put("/reset", response_model=dict)
async def reset_state():
    try:
        sam2_client.reset_state()
        return {"message": "State reset successfully"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.post("/export", response_model=dict)
async def export_video(filename: str):
    try:
        video_dir = Path(public_dir) / "videos"
        video_path = video_dir / f"{filename}.mp4"
        sam2_client.export_frames_to_video(video_path)
        return {"message": "Video exported successfully"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
