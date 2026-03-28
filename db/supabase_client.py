import os
import asyncio
from supabase import create_client, Client
from datetime import datetime

class SupabaseManager:
    _instance = None

    def __new__(cls):
        if cls._instance is None:
            cls._instance = super(SupabaseManager, cls).__new__(cls)
            cls._instance.url = os.getenv("SUPABASE_URL")
            cls._instance.key = os.getenv("SUPABASE_KEY")
            if cls._instance.url and cls._instance.key:
                cls._instance.client: Client = create_client(cls._instance.url, cls._instance.key)
            else:
                cls._instance.client = None
                print("[SupabaseManager] WARNING: SUPABASE_URL or SUPABASE_KEY missing.")
        return cls._instance

    async def save_signal(self, data: dict):
        if not self.client:
            return None
        
        try:
            # Flatten or adapt data for the 'signals' table
            payload = {
                "symbol": data.get("ticker", "UNKNOWN"),
                "event_type": "MARKET_SIGNAL",
                "pattern_name": data.get("pattern_type", ""),
                "confidence": float(data.get("confidence", 0)),
                "bias_rating": "PASS" if data.get("bias_ok") else "FAIL",
                "alert_en": data.get("signal_body", ""),
                "alert_hi": data.get("hindi_summary", ""),
                "timestamp": datetime.now().isoformat()
            }
            
            # Using to_thread because supabase-py's table().insert() is synchronous
            res = await asyncio.to_thread(
                lambda: self.client.table("signals").insert(payload).execute()
            )
            return res
        except Exception as e:
            print(f"[SupabaseManager] Error saving signal: {e}")
            return None

supabase_manager = SupabaseManager()
