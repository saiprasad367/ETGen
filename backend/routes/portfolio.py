from fastapi import APIRouter

router = APIRouter()

@router.post("/portfolio/impact")
async def simulate_impact(holdings: list = []):
    # Will calculate portfolio impact from signals
    return {"impact": 0, "holdings": holdings}
