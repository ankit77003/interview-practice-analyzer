![React](https://img.shields.io/badge/Frontend-React-blue)
![Node.js](https://img.shields.io/badge/Backend-Node.js-green)
![MongoDB](https://img.shields.io/badge/Database-MongoDB-brightgreen)

# Interview Practice Analyzer

A full-stack web application that helps students track DSA progress, identify weak topics, and get personalized improvement suggestions based on their solving patterns.
> 🚀 Built with a focus on performance analytics and structured interview preparation.

## Why this project?

Many students solve DSA problems but fail to track patterns in their mistakes and performance.  
This project helps convert raw practice into structured insights and actionable improvement plans.

## Features

- User authentication (JWT-based login/signup)
- Add and track DSA problems
- Filter by topic, difficulty, and platform
- Track time taken per problem
- Dashboard with analytics
- Weak topic identification
- Rule-based recommendations for improvement

## How it works

- Users log their solved/unsolved problems
- System analyzes:
  - Time taken
  - Difficulty level
  - Topic frequency
- Generates insights like:
  - Weak topics
  - Slow problem-solving areas
- Provides suggestions to improve performance


## Development Overview

1. Folder structure ✅
2. Backend (Express + PostgreSQL + Prisma + JWT) ✅
3. Frontend (React pages: Login, Dashboard, Add Problem) ✅

## Tech

- Frontend: React (Vite)
- Backend: Node.js + Express
- DB: PostgreSQL
- ORM: Prisma
- Auth: JWT

## Challenges & Learnings

- Implemented JWT authentication securely
- Designed relational schema using Prisma
- Built analytics logic for tracking performance
- Handled state management in frontend
  

## Future Improvements

- AI-based feedback on answers
- Interview simulation mode
- Leaderboard system
- Streak tracking (consistency Score)

## Screenshots

<img width="1243" height="670" alt="Screenshot 2026-03-26 at 6 14 37 PM" src="https://github.com/user-attachments/assets/90f8d398-4655-4c94-84a1-67bb9c7a7f3e" />
<img width="1247" height="674" alt="Screenshot 2026-03-26 at 6 16 09 PM" src="https://github.com/user-attachments/assets/c74b9c12-1c59-478d-8f62-49250ccf249b" />
<img width="1169" height="330" alt="Screenshot 2026-03-26 at 6 16 24 PM" src="https://github.com/user-attachments/assets/9fe6a6ee-16df-40b4-841d-796fa3843faf" />
<img width="1215" height="585" alt="Screenshot 2026-03-26 at 6 17 02 PM" src="https://github.com/user-attachments/assets/75de384a-17e9-40a0-9c57-59215ba7427e" />


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

