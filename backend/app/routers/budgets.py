from fastapi import APIRouter, Depends, HTTPException, status, Query
from sqlalchemy.orm import Session
from ..database import get_db
from ..models import User, Budget, CategoryBudget
from ..schemas import (
    BudgetCreate, BudgetResponse,
    CategoryBudgetCreate, CategoryBudgetUpdate, CategoryBudgetResponse,
)
from ..auth import get_current_user

router = APIRouter(prefix="/budgets", tags=["budgets"])


@router.get("", response_model=BudgetResponse)
def get_budget(
    month: int = Query(..., ge=1, le=12),
    year: int = Query(...),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    budget = db.query(Budget).filter(
        Budget.user_id == current_user.id,
        Budget.month == month,
        Budget.year == year,
    ).first()
    if not budget:
        raise HTTPException(status_code=404, detail="Budget not found")
    return budget


@router.post("", response_model=BudgetResponse)
def upsert_budget(
    payload: BudgetCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    existing = db.query(Budget).filter(
        Budget.user_id == current_user.id,
        Budget.month == payload.month,
        Budget.year == payload.year,
    ).first()
    if existing:
        existing.total_budget = payload.total_budget
        db.commit()
        db.refresh(existing)
        return existing
    budget = Budget(user_id=current_user.id, **payload.model_dump())
    db.add(budget)
    db.commit()
    db.refresh(budget)
    return budget


# ─── Category Budgets ──────────────────────────────────────────────────────────

@router.get("/categories", response_model=list[CategoryBudgetResponse])
def list_category_budgets(
    month: int = Query(..., ge=1, le=12),
    year: int = Query(...),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    return db.query(CategoryBudget).filter(
        CategoryBudget.user_id == current_user.id,
        CategoryBudget.month == month,
        CategoryBudget.year == year,
    ).all()


@router.post("/categories", response_model=CategoryBudgetResponse, status_code=status.HTTP_201_CREATED)
def create_category_budget(
    payload: CategoryBudgetCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    cb = CategoryBudget(user_id=current_user.id, **payload.model_dump())
    db.add(cb)
    db.commit()
    db.refresh(cb)
    return cb


@router.patch("/categories/{cb_id}", response_model=CategoryBudgetResponse)
def update_category_budget(
    cb_id: str,
    payload: CategoryBudgetUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    cb = db.query(CategoryBudget).filter(
        CategoryBudget.id == cb_id, CategoryBudget.user_id == current_user.id
    ).first()
    if not cb:
        raise HTTPException(status_code=404, detail="Category budget not found")
    cb.amount = payload.amount
    db.commit()
    db.refresh(cb)
    return cb


@router.delete("/categories/{cb_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_category_budget(
    cb_id: str,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    cb = db.query(CategoryBudget).filter(
        CategoryBudget.id == cb_id, CategoryBudget.user_id == current_user.id
    ).first()
    if not cb:
        raise HTTPException(status_code=404, detail="Category budget not found")
    db.delete(cb)
    db.commit()
