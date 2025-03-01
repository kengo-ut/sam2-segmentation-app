from pydantic import BaseModel


class VideoName(BaseModel):
    name: str


class VideoInfo(BaseModel):
    total: int
    width: int
    height: int
