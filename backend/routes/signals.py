from fastapi import APIRouter

router = APIRouter()

@router.get("/signals")
async def get_signals():
    # Will be connected to DB in production
    return {"signals": []}
