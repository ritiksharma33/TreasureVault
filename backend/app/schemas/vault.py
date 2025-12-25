# File: backend/app/schemas/vault.py

from pydantic import BaseModel, ConfigDict
from datetime import datetime
from typing import List, Optional

# Base properties for a vault
class VaultBase(BaseModel):
    title: str
    ideas: str
    actions: str
    tags: Optional[List[str]] = []

# Properties to receive on vault creation (from the API)
class VaultCreate(VaultBase):
    pass

# --- NEW CLASS FOR UPDATING ---
class VaultUpdate(VaultBase):
    pass
# -----------------------------

# Properties to return to the client (includes DB-generated fields)
class Vault(VaultBase):
    id: int
    created_date: datetime

    # This is the NEW Pydantic V2 way
    model_config = ConfigDict(from_attributes=True)