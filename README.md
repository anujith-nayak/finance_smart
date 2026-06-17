# 🛡️ Pocket Guardian

> **Your AI-powered personal finance companion** — track expenses, manage budgets, save for goals, and get hilariously dramatic spending warnings.

[![Frontend](https://img.shields.io/badge/Frontend-React%20%2B%20Vite-61DAFB?logo=react)](https://vitejs.dev)
[![Backend](https://img.shields.io/badge/Backend-FastAPI-009688?logo=fastapi)](https://fastapi.tiangolo.com)
[![Database](https://img.shields.io/badge/Database-Supabase%20PostgreSQL-3ECF8E?logo=supabase)](https://supabase.com)

---

## ✨ Features

| Feature | Description |
|---|---|
| **Expense Tracking** | Add, edit, delete expenses with categories, need/want tagging |
| **Smart Budget Manager** | Monthly + category budgets with real-time progress |
| **Savings Goals** | Create goals with emoji, track progress visually |
| **Borrow & Lend Tracker** | Track who owes you and who you owe |
| **Impulse Dialog System** | Funny, dramatic warnings before impulse purchases |
| **Regret Mode** | Personalized regret messages after overspending |
| **Analytics Dashboard** | Charts for spending trends, need vs want, category breakdown |
| **Notification Center** | Smart alerts for budget limits, debts, goal milestones |
| **Finance Companion** | Personalized messages using your name throughout |

---

## 🏗️ Tech Stack

**Frontend**
- React 19 + Vite + TypeScript
- Tailwind CSS (glassmorphism design)
- Framer Motion (animations)
- Zustand (state management)
- React Hook Form + Zod (form validation)
- Recharts (interactive charts)
- Lucide React (icons)
- React Router DOM

**Backend**
- FastAPI + Uvicorn
- SQLAlchemy ORM
- Pydantic v2
- python-jose (JWT auth)
- passlib + bcrypt (password hashing)
- Alembic (database migrations)

**Database & Hosting**
- Supabase PostgreSQL
- Frontend → Vercel
- Backend → Render

---

## 🚀 Local Setup

### Prerequisites
- Node.js 18+
- Python 3.11+
- A [Supabase](https://supabase.com) account (free tier works)

---

### 1. Clone the repo

```bash
git clone https://github.com/YOUR_USERNAME/pocket-guardian.git
cd pocket-guardian
```

---

### 2. Set up the Backend

```bash
cd backend

# Create virtual environment
python -m venv venv

# Activate it
# Windows:
venv\Scripts\activate
# Mac/Linux:
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt

# Copy .env and fill in your values
cp .env.example .env
```

**Edit `backend/.env`:**

```env
DATABASE_URL=postgresql://postgres:[YOUR-PASSWORD]@db.[PROJECT-REF].supabase.co:5432/postgres
SECRET_KEY=your-random-secret-key-here
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=1440
ALLOWED_ORIGINS=http://localhost:5173
```

> **Get your DATABASE_URL:** Supabase Dashboard → Project Settings → Database → Connection String → URI

**Start the backend:**

```bash
python main.py
# API is now running at http://localhost:8000
# Docs at http://localhost:8000/docs
```

> Tables are created automatically on first run via SQLAlchemy `create_all`.

---

### 3. Set up the Frontend

```bash
cd frontend
npm install

# Copy .env
cp .env.example .env
# Leave VITE_API_URL as /api (Vite will proxy to localhost:8000)
```

**Start the frontend:**

```bash
npm run dev
# App is now running at http://localhost:5173
```

---

## 🌐 Deployment

### Deploy Backend to Render

1. Push your code to GitHub
2. Go to [render.com](https://render.com) → New Web Service
3. Connect your GitHub repo
4. Set:
   - **Root Directory:** `backend`
   - **Build Command:** `pip install -r requirements.txt`
   - **Start Command:** `uvicorn app.main:app --host 0.0.0.0 --port $PORT`
5. Add environment variables (same as `.env` but with your production `DATABASE_URL`)
6. Set `ALLOWED_ORIGINS` to your Vercel URL

### Deploy Frontend to Vercel

1. Go to [vercel.com](https://vercel.com) → New Project
2. Import your GitHub repo
3. Set:
   - **Framework Preset:** Vite
   - **Root Directory:** `frontend`
4. Add environment variable:
   - `VITE_API_URL` = `https://your-backend.onrender.com/api`
5. Deploy!

---

## 📁 Project Structure

```
pocket-guardian/
├── frontend/                  # React + Vite frontend
│   ├── src/
│   │   ├── components/        # Reusable UI components
│   │   │   ├── ui/            # Primitives (Button, Card, Input, Modal...)
│   │   │   ├── layout/        # Sidebar, TopBar, BottomNav, AppLayout
│   │   │   ├── AddExpenseForm.tsx
│   │   │   ├── ImpulseDialog.tsx   # ⭐ Signature feature
│   │   │   └── RegretToast.tsx
│   │   ├── pages/             # Route pages
│   │   │   ├── auth/          # Login, Register
│   │   │   ├── DashboardPage.tsx
│   │   │   ├── ExpensesPage.tsx
│   │   │   ├── BudgetPage.tsx
│   │   │   ├── GoalsPage.tsx
│   │   │   ├── DebtsPage.tsx
│   │   │   ├── AnalyticsPage.tsx
│   │   │   ├── NotificationsPage.tsx
│   │   │   └── SettingsPage.tsx
│   │   ├── store/             # Zustand stores
│   │   ├── data/              # Messages, categories data
│   │   ├── types/             # TypeScript types
│   │   └── lib/               # API client, utilities
│   └── package.json
│
└── backend/                   # FastAPI backend
    ├── app/
    │   ├── main.py            # FastAPI app entry
    │   ├── models.py          # SQLAlchemy models
    │   ├── schemas.py         # Pydantic schemas
    │   ├── auth.py            # JWT authentication
    │   ├── database.py        # DB connection
    │   ├── config.py          # Settings
    │   └── routers/           # API route handlers
    │       ├── auth.py
    │       ├── expenses.py
    │       ├── budgets.py
    │       ├── goals.py
    │       └── debts.py
    ├── alembic/               # Database migrations
    ├── requirements.txt
    └── main.py                # Dev server entry
```

---

## 🔌 API Reference

All endpoints are prefixed with `/api`.

| Method | Endpoint | Description |
|---|---|---|
| POST | `/api/auth/register` | Register new user |
| POST | `/api/auth/login` | Login (returns JWT) |
| GET | `/api/auth/me` | Get current user |
| PATCH | `/api/auth/me` | Update profile |
| GET | `/api/expenses` | List expenses (with month/year filter) |
| POST | `/api/expenses` | Create expense |
| PATCH | `/api/expenses/:id` | Update expense |
| DELETE | `/api/expenses/:id` | Delete expense |
| GET | `/api/budgets` | Get monthly budget |
| POST | `/api/budgets` | Set/update monthly budget |
| GET | `/api/budgets/categories` | List category budgets |
| POST | `/api/budgets/categories` | Create category budget |
| GET | `/api/goals` | List savings goals |
| POST | `/api/goals` | Create goal |
| POST | `/api/goals/:id/add` | Add funds to goal |
| GET | `/api/debts` | List debt records |
| POST | `/api/debts` | Create debt record |
| POST | `/api/debts/:id/settle` | Mark as settled |

Full interactive docs at `/docs` (Swagger UI) when running locally.

---

## 🎨 Design System

- **Color palette:** Dark gray base (`gray-950`) with purple accents
- **Glass cards:** `backdrop-blur` with subtle borders
- **Typography:** System font stack with size scale
- **Animations:** Framer Motion for page transitions and micro-interactions
- **Mobile-first:** Bottom nav for mobile, sidebar for desktop

---

## 🤝 Contributing

Pull requests welcome! Please open an issue first for major changes.

---

## 📄 License

MIT
