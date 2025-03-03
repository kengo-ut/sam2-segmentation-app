from typing import Literal

from pydantic import BaseModel


class VideoInfo(BaseModel):
    width: int
    height: int
    num_frames: int


class Point(BaseModel):
    x: float
    y: float


class Prompt(BaseModel):
    point: Point
    label: int
    frame_idx: int
    obj_id: int


Effect = Literal["color", "blur", "pixelate", "grayscale", "invert", "edge", "glow"]
