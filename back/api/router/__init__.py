from fastapi import APIRouter

from .video import router as video_router

router = APIRouter()
router.include_router(video_router)

__all__ = ["router"]
