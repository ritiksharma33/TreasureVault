# File: backend/main.py

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware




# --- NEW IMPORTS ---
from app.db.base_class import Base
from app.db.session import engine
from app.models.vaults import Vault as DBVault
 # This import ensures the model is loaded
# ---------------------
from app.models import user as user_model # <-- Import user model
from app.api.routes import vaults

# --- NEW CODE ---
# This line tells SQLAlchemy to create all tables 
# (defined in models) that don't exist yet.
Base.metadata.create_all(bind=engine)
# ----------------

app = FastAPI(title="TreasureVault API")

# ... (Your CORS middleware code stays exactly the same) ...
origins = [
    "http://localhost",
    "http://localhost:5500",      # <-- MUST be present
    "http://127.0.0.1:5500",    # <-- MUST be present
    # If your live server uses a different port (e.g., 5501, 8080), add it here!
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],       # <-- This must pass your list
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


app.include_router(vaults.router)
# Include Routers

# <-- THIS LINE MUST BE PRESENT

@app.get("/")
def read_root():
    return {"message": "Welcome to the TreasureVault API"}