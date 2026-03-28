import os, json
from datetime import datetime
from typing import Optional

class AuditLogger:
    _log = []  # in-memory for demo; replace with PostgreSQL in production

    @classmethod
    def log_step(cls, signal_id: str, agent: str, status: str, ticker: str, details: str = ""):
        entry = {
            "signal_id": signal_id,
            "agent": agent,
            "status": status,
            "ticker": ticker,
            "details": details,
            "timestamp": datetime.now().isoformat()
        }
        cls._log.append(entry)
        # TODO in production: INSERT INTO signal_audit_log VALUES (...)
        print(f"[AUDIT] {agent:25} | {status:12} | {ticker} | {details[:60]}")

    @classmethod
    def log(cls, data: dict):
        cls._log.append({**data, "timestamp": datetime.now().isoformat()})

    @classmethod
    def get_recent(cls, limit: int = 50):
        return cls._log[-limit:]
