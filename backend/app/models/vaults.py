# File: backend/app/models/vault.py

from sqlalchemy import Column, Integer, String, DateTime, Text, JSON
from sqlalchemy.sql import func

from app.db.base_class import Base

class Vault(Base):
    __tablename__ = "vaults"

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String, index=True)
    ideas = Column(Text)
    actions = Column(Text)
    tags = Column(JSON, default=[]) # Use JSON to store the list of tags
    
    # This sets the default value on the database side
    created_date = Column(DateTime(timezone=True), server_default=func.now())