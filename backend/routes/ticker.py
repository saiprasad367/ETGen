from fastapi import APIRouter
from data.nse_fetcher import get_market_data

router = APIRouter()

@router.get("/ticker")
async def get_ticker():
    return get_market_data()
