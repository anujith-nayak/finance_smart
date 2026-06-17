from pydantic import BaseModel, EmailStr, Field
from typing import Optional
from datetime import datetime


# ─── Auth / User ───────────────────────────────────────────────────────────────
class UserCreate(BaseModel):
    name: str = Field(..., min_length=2, max_length=100)
    email: EmailStr
    password: str = Field(..., min_length=6)
    monthly_budget: Optional[float] = None


class UserUpdate(BaseModel):
    name: Optional[str] = Field(None, min_length=2, max_length=100)
    email: Optional[EmailStr] = None


class UserResponse(BaseModel):
    id: str
    name: str
    email: str
    monthly_budget: Optional[float]
    created_at: datetime

    model_config = {"from_attributes": True}


class Token(BaseModel):
    access_token: str
    token_type: str = "bearer"


# ─── Expense ───────────────────────────────────────────────────────────────────
class ExpenseCreate(BaseModel):
    amount: float = Field(..., gt=0)
    category: str
    description: str = Field(..., min_length=1, max_length=200)
    date: str  # YYYY-MM-DD
    is_need: bool = False
    is_impulse: bool = False


class ExpenseUpdate(BaseModel):
    amount: Optional[float] = None
    category: Optional[str] = None
    description: Optional[str] = None
    date: Optional[str] = None
    is_need: Optional[bool] = None
    is_impulse: Optional[bool] = None


class ExpenseResponse(BaseModel):
    id: str
    user_id: str
    amount: float
    category: str
    description: str
    date: str
    is_need: bool
    is_impulse: bool
    created_at: datetime

    model_config = {"from_attributes": True}


# ─── Budget ────────────────────────────────────────────────────────────────────
class BudgetCreate(BaseModel):
    total_budget: float = Field(..., gt=0)
    month: int = Field(..., ge=1, le=12)
    year: int


class BudgetResponse(BaseModel):
    id: str
    user_id: str
    total_budget: float
    month: int
    year: int
    created_at: datetime

    model_config = {"from_attributes": True}


class CategoryBudgetCreate(BaseModel):
    category: str
    amount: float = Field(..., gt=0)
    month: int = Field(..., ge=1, le=12)
    year: int


class CategoryBudgetUpdate(BaseModel):
    amount: float = Field(..., gt=0)


class CategoryBudgetResponse(BaseModel):
    id: str
    user_id: str
    category: str
    amount: float
    month: int
    year: int
    created_at: datetime

    model_config = {"from_attributes": True}


# ─── Goals ─────────────────────────────────────────────────────────────────────
class GoalCreate(BaseModel):
    name: str = Field(..., min_length=1, max_length=100)
    target_amount: float = Field(..., gt=0)
    current_amount: float = 0.0
    deadline: Optional[str] = None
    emoji: Optional[str] = None


class GoalUpdate(BaseModel):
    name: Optional[str] = None
    target_amount: Optional[float] = None
    current_amount: Optional[float] = None
    deadline: Optional[str] = None
    emoji: Optional[str] = None


class AddFundsRequest(BaseModel):
    amount: float = Field(..., gt=0)


class GoalResponse(BaseModel):
    id: str
    user_id: str
    name: str
    target_amount: float
    current_amount: float
    deadline: Optional[str]
    emoji: Optional[str]
    created_at: datetime

    model_config = {"from_attributes": True}


# ─── Debts ─────────────────────────────────────────────────────────────────────
class DebtCreate(BaseModel):
    type: str  # "lent" | "borrowed"
    person_name: str = Field(..., min_length=1, max_length=100)
    amount: float = Field(..., gt=0)
    paid_amount: float = 0.0
    due_date: Optional[str] = None
    notes: Optional[str] = None


class DebtUpdate(BaseModel):
    person_name: Optional[str] = None
    amount: Optional[float] = None
    paid_amount: Optional[float] = None
    due_date: Optional[str] = None
    notes: Optional[str] = None


class DebtResponse(BaseModel):
    id: str
    user_id: str
    type: str
    person_name: str
    amount: float
    paid_amount: float
    due_date: Optional[str]
    notes: Optional[str]
    status: str
    created_at: datetime

    model_config = {"from_attributes": True}
