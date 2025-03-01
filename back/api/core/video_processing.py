from pathlib import Path
from typing import List

from PIL import Image
from schema import VideoInfo


def get_video_info(dirname: str) -> VideoInfo:
    """
    指定されたディレクトリ内の .jpg 画像の情報を取得する関数
    """
    dirpath = (
        Path(__file__).parent.parent.parent.parent
        / "front"
        / "public"
        / "videos"
        / dirname
        / "frames"
    )
    print(dirpath)
    jpg_files = list(dirpath.glob("*.jpg"))

    if not jpg_files:
        raise FileNotFoundError(f"No .jpg files in {dirpath}")

    img = Image.open(jpg_files[0])
    width, height = img.size

    return VideoInfo(total=len(jpg_files), width=width, height=height)
