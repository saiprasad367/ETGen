from fastapi import APIRouter
from data.nse_fetcher import get_heatmap_data

router = APIRouter()

@router.get("/heatmap")
async def get_heatmap():
    return get_heatmap_data()
