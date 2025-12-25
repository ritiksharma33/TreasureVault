from app.services.transcript_service import get_video_transcript, TranscriptError,get_video_metadata

from fastapi import APIRouter, Depends, HTTPException, status
from typing import List
from sqlalchemy.orm import Session
from datetime import datetime # Needed for testing/debugging purposes

# --- DB & MODEL IMPORTS ---
from app.db.session import SessionLocal
from app.models.vaults import Vault as DBVault
# --------------------------

# --- SCHEMA IMPORTS ---
from app.schemas.vault import Vault, VaultCreate, VaultUpdate
from app.schemas.transcript import URLRequest, TranscriptResponse
# --------------------------

# --- SERVICE IMPORTS ---
# File: backend/app/api/routes/vaults.py 
# (Ensure this line exists at the top of the file)

# -----------------------

router = APIRouter()

# Dependency to get DB session
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

# --- HELPER FUNCTION ---
def get_vault_by_id(db: Session, vault_id: int):
    db_vault = db.query(DBVault).filter(DBVault.id == vault_id).first()
    if db_vault is None:
        raise HTTPException(status_code=404, detail="Vault not found")
    return db_vault

# ==========================================================
# 1. VAULT CRUD ENDPOINTS
# ==========================================================

@router.get("/api/vaults", response_model=List[Vault])
def get_vaults(db: Session = Depends(get_db)):
    """Returns a list of all vaults from the database, newest first."""
    vaults = db.query(DBVault).order_by(DBVault.created_date.desc()).all()
    return vaults

@router.post("/api/vaults", response_model=Vault)
def create_vault(vault: VaultCreate, db: Session = Depends(get_db)):
    """Receives manual vault data and saves it to the database."""
    
    # In a real app, you might want to sanitize the input data before creating the DB object
    db_vault = DBVault(
        title=vault.title,
        ideas=vault.ideas,
        actions=vault.actions,
        tags=vault.tags
    )
    db.add(db_vault)
    db.commit()
    db.refresh(db_vault)
    return db_vault

@router.get("/api/vaults/{vault_id}", response_model=Vault)
def get_single_vault(vault_id: int, db: Session = Depends(get_db)):
    """Gets a single vault by its ID."""
    db_vault = get_vault_by_id(db, vault_id)
    return db_vault

@router.put("/api/vaults/{vault_id}", response_model=Vault)
def update_vault(vault_id: int, vault_in: VaultUpdate, db: Session = Depends(get_db)):
    """Updates an existing vault."""
    db_vault = get_vault_by_id(db, vault_id)
    
    # Update the fields
    db_vault.title = vault_in.title
    db_vault.ideas = vault_in.ideas
    db_vault.actions = vault_in.actions
    db_vault.tags = vault_in.tags
    
    db.commit()
    db.refresh(db_vault)
    return db_vault

@router.delete("/api/vaults/{vault_id}", response_model=dict)
def delete_vault(vault_id: int, db: Session = Depends(get_db)):
    """Deletes a vault by its ID."""
    db_vault = get_vault_by_id(db, vault_id)
    
    db.delete(db_vault)
    db.commit()
    
    return {"message": "Vault deleted successfully"}

# ==========================================================
# 2. TRANSCRIPT SERVICE ENDPOINT
# ==========================================================

# File: backend/app/api/routes/vaults.py (Modified fetch_transcript_api)

# ... (Around line 98, update the function signature and body) ...

# We change the response model to 'Vault' because it's returning the saved vault object
# File: backend/app/api/routes/vaults.py 
# (This replaces the entire fetch_transcript_api block you provided)

# File: backend/app/api/routes/vaults.py 
# (This replaces the current fetch_transcript_api function entirely)

@router.post("/api/transcript", response_model=Vault, status_code=status.HTTP_201_CREATED)
def fetch_transcript_api(request: URLRequest, db: Session = Depends(get_db)):
    """
    Fetches metadata and transcript, then saves the resulting vault directly to the DB,
    using the video's title and channel for context and tagging.
    """
    try:
        # 1. GET METADATA (NEW STEP: Uses the stable requests-based function)
        metadata = get_video_metadata(request.url)
        video_title = metadata['title']
        channel_name = metadata['channel']
        
        # 2. GET TRANSCRIPT
        transcript_text = get_video_transcript(request.url)
        
        # 3. CONSTRUCT the Vault content and title
        vault_title = video_title
        
        # 4. CONSTRUCT and SAVE THE VAULT
        db_vault = DBVault(
            title=vault_title, # The main title is the video title
            
            # Prepend the Channel and Title to the ideas field for context
            # This is the line that ADDS the tagging and channel name to the visible content
            ideas=f"📺 **Channel:** {channel_name}\n**Video:** {video_title}\n\n---\n\n{transcript_text}", 
            actions="Review and extract key actions.", 
            
            # Tag the vault with the Channel name and source type
            tags=[channel_name, "YouTube", "Raw"], 
        )
        
        # 5. SAVE THE VAULT to the database
        db.add(db_vault)
        db.commit()
        db.refresh(db_vault)

        # 6. Return the full saved Vault object
        return db_vault
    
    except TranscriptError as e:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST, 
            detail=str(e)
        )
    
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"An unexpected internal error occurred: {e}"
        )