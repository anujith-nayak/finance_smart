from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from .database import engine, Base
from .routers import auth, expenses, budgets, goals, debts
from .config import get_settings

settings = get_settings()

# Create all tables on startup (SQLAlchemy auto-migrate for simple cases)
Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="Pocket Guardian API",
    description="AI-powered personal finance companion backend",
    version="1.0.0",
)

# ─── CORS ──────────────────────────────────────────────────────────────────────
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.origins_list,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ─── Routers ───────────────────────────────────────────────────────────────────
app.include_router(auth.router, prefix="/api")
app.include_router(expenses.router, prefix="/api")
app.include_router(budgets.router, prefix="/api")
app.include_router(goals.router, prefix="/api")
app.include_router(debts.router, prefix="/api")


@app.get("/")
def root():
    return {"message": "Pocket Guardian API is running 🛡️", "version": "1.0.0"}


@app.get("/health")
def health():
    return {"status": "healthy"}
