# Interview Practice Analyzer

Track DSA practice, identify weak topics, and get rule-based improvement suggestions.

## Step-by-step generation

1. Folder structure ✅
2. Backend (Express + PostgreSQL + Prisma + JWT) ✅
3. Frontend (React pages: Login, Dashboard, Add Problem) ✅

## Tech

- Frontend: React (Vite)
- Backend: Node.js + Express
- DB: PostgreSQL
- ORM: Prisma
- Auth: JWT

## Setup

### 1) Database (Postgres)

Create a database (example):

```bash
createdb interview_practice_analyzer
```

### 2) Backend

```bash
cd InterviewPracticeAnalyzer/backend
cp .env.example .env
```

Edit `backend/.env`:

- `DATABASE_URL`: your Postgres connection string
- `JWT_SECRET`: long random string

Run:

```bash
npm install
npx prisma migrate dev --name init
npm run dev
```

Backend runs on `http://localhost:4000`.

### 3) Frontend

```bash
cd InterviewPracticeAnalyzer/frontend
cp .env.example .env
npm install
npm run dev
```

Frontend runs on `http://localhost:5173`.

## API overview

Base URL: `http://localhost:4000`

- `POST /api/auth/signup` body: `{ email, password }`
- `POST /api/auth/login` body: `{ email, password }`

- `GET /api/problems` (auth)
- `POST /api/problems` (auth) body:
  - `{ title, platform, difficulty, topic, time_taken, status }`
  - `difficulty`: `EASY | MEDIUM | HARD`
  - `status`: `SOLVED | UNSOLVED`

- `GET /api/analytics/dashboard` (auth)
- `GET /api/analytics` (auth)
- `GET /api/analytics/recommendations` (auth)

