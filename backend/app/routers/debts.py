from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from ..database import get_db
from ..models import User, DebtRecord
from ..schemas import DebtCreate, DebtUpdate, DebtResponse
from ..auth import get_current_user

router = APIRouter(prefix="/debts", tags=["debts"])


@router.get("", response_model=list[DebtResponse])
def list_debts(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    return db.query(DebtRecord).filter(
        DebtRecord.user_id == current_user.id
    ).order_by(DebtRecord.created_at.desc()).all()


@router.post("", response_model=DebtResponse, status_code=status.HTTP_201_CREATED)
def create_debt(
    payload: DebtCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    debt = DebtRecord(user_id=current_user.id, **payload.model_dump())
    db.add(debt)
    db.commit()
    db.refresh(debt)
    return debt


@router.patch("/{debt_id}", response_model=DebtResponse)
def update_debt(
    debt_id: str,
    payload: DebtUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    debt = db.query(DebtRecord).filter(
        DebtRecord.id == debt_id, DebtRecord.user_id == current_user.id
    ).first()
    if not debt:
        raise HTTPException(status_code=404, detail="Debt record not found")
    for k, v in payload.model_dump(exclude_none=True).items():
        setattr(debt, k, v)
    # Update status based on paid amount
    if debt.paid_amount >= debt.amount:
        debt.status = "settled"
    elif debt.paid_amount > 0:
        debt.status = "partial"
    db.commit()
    db.refresh(debt)
    return debt


@router.post("/{debt_id}/settle", response_model=DebtResponse)
def settle_debt(
    debt_id: str,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    debt = db.query(DebtRecord).filter(
        DebtRecord.id == debt_id, DebtRecord.user_id == current_user.id
    ).first()
    if not debt:
        raise HTTPException(status_code=404, detail="Debt record not found")
    debt.status = "settled"
    debt.paid_amount = debt.amount
    db.commit()
    db.refresh(debt)
    return debt


@router.delete("/{debt_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_debt(
    debt_id: str,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    debt = db.query(DebtRecord).filter(
        DebtRecord.id == debt_id, DebtRecord.user_id == current_user.id
    ).first()
    if not debt:
        raise HTTPException(status_code=404, detail="Debt record not found")
    db.delete(debt)
    db.commit()
