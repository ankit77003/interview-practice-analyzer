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


## 📁 Folder Structure

```
interview-practice-analyzer/
├── frontend/
│   ├── public/
│   │   └── index.html
│   ├── src/
│   │   ├── lib/
│   │   │   ├── api.js            ← apiFetch utility
│   │   │   └── auth.js           ← token helpers
│   │   ├── pages/
│   │   │   ├── LoginPage.jsx
│   │   │   ├── DashboardPage.jsx
│   │   │   └── AddProblemPage.jsx
│   │   ├── styles/
│   │   │   ├── index.css
│   │   │   ├── add-problem.css
│   │   │   └── login.css
│   │   ├── App.jsx
│   │   └── main.jsx
│   ├── .env
│   ├── vite.config.js
│   └── package.json
│
├── backend/
│   ├── prisma/
│   │   ├── schema.prisma
│   │   └── migrations/
│   ├── src/
│   │   ├── routes/
│   │   │   ├── auth.js
│   │   │   ├── problems.js
│   │   │   └── analytics.js
│   │   ├── middleware/
│   │   │   └── auth.js
│   │   ├── lib/
│   │   │   └── prisma.js
│   │   └── server.js
│   ├── .env
│   └── package.json
│
└── README.md
```

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

<img width="482" height="627" alt="Screenshot 2026-05-05 at 4 35 32 PM" src="https://github.com/user-attachments/assets/d36d3505-1465-4280-988a-387cf92526e4" />

<img width="546" height="627" alt="Screenshot 2026-05-05 at 4 36 11 PM" src="https://github.com/user-attachments/assets/4dc69885-a8be-4691-ab81-6c66897a0e85" />

<img width="1218" height="661" alt="Screenshot 2026-05-05 at 4 36 31 PM" src="https://github.com/user-attachments/assets/33381d3f-c017-49d2-ab90-ef73cac9652c" />

<img width="1059" height="668" alt="Screenshot 2026-05-05 at 4 36 39 PM" src="https://github.com/user-attachments/assets/74a4cd6d-a1ed-4184-88df-a8c6968b0d20" />

<img width="1022" height="608" alt="Screenshot 2026-05-05 at 4 36 46 PM" src="https://github.com/user-attachments/assets/f920c107-cf95-4fb3-945b-038a42d08951" />

<img width="1125" height="605" alt="Screenshot 2026-05-05 at 4 37 47 PM" src="https://github.com/user-attachments/assets/422c4a00-2cd6-49ea-8e4b-9fa01a8af772" />







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

