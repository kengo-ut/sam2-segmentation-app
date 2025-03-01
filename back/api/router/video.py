from core import get_video_info
from fastapi import APIRouter, HTTPException
from schema import VideoInfo, VideoName

router = APIRouter(prefix="/video", tags=["video"])


@router.get("/info/", response_model=VideoInfo)
async def fetch_video_info(dirname: str):
    """
    指定されたディレクトリ内の .jpg 画像の情報を取得するエンドポイント
    """
    try:
        video_info = get_video_info(dirname)
        return video_info
    except FileNotFoundError as e:
        raise HTTPException(status_code=404, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
