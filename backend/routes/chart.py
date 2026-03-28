from fastapi import APIRouter
from data.nse_fetcher import get_ohlcv

router = APIRouter()

@router.get("/chart/{ticker}")
async def get_chart(ticker: str, days: int = 90):
    return get_ohlcv(ticker, days)
