<div align="center">
  <h1>SAT AI Tutor</h1>
  <p>A full-stack SAT practice platform with adaptive study plans, AI explanations, PDF import, analytics, and admin tools.</p>

  <p>
    <a href="README.zh-CN.md">Chinese</a>
    &middot;
    <a href="#quickstart">Quickstart</a>
    &middot;
    <a href="#tech-stack">Tech Stack</a>
  </p>

  <p>
    <img alt="Next.js: 16" src="https://img.shields.io/badge/Next.js-16-111111?style=for-the-badge&logo=nextdotjs&logoColor=white" />
    <img alt="React: 19" src="https://img.shields.io/badge/React-19-61DAFB?style=for-the-badge&logo=react&logoColor=white" />
    <img alt="Flask: 3" src="https://img.shields.io/badge/Flask-3-000000?style=for-the-badge&logo=flask&logoColor=white" />
    <a href="https://github.com/Ha22yX/SAT-AI-Tutor/pkgs/container/sat-ai-tutor-backend"><img alt="Backend Docker image" src="https://img.shields.io/badge/GHCR-backend-2496ED?style=for-the-badge&logo=docker&logoColor=white" /></a>
    <a href="https://github.com/Ha22yX/SAT-AI-Tutor/pkgs/container/sat-ai-tutor-frontend"><img alt="Frontend Docker image" src="https://img.shields.io/badge/GHCR-frontend-2496ED?style=for-the-badge&logo=docker&logoColor=white" /></a>
    <img alt="AI: explanations" src="https://img.shields.io/badge/AI-explanations-7d73b7?style=for-the-badge" />
  </p>
</div>

<p align="center">
  <img src=".github/assets/readme-hero.svg" alt="SAT AI Tutor overview image" width="100%" />
</p>

<p align="center">
  <img src="docs/images/sat-ai-tutor-dashboard.png" alt="SAT AI Tutor learning dashboard screenshot" width="100%" />
</p>

## Why This Exists

Students need more than an answer key after missing a question. This platform turns practice attempts into guided review: visual explanations, mastery tracking, adaptive planning, and admin-managed SAT-style content.

## Workflow

- Students complete SAT-style practice sessions.
- The backend tracks mastery, session history, and review timing.
- AI explanations are generated as structured steps with highlights and notes.
- Admins import and review question content from PDFs.
- Analytics and plans guide the next practice session.

## Features

- Student dashboard, practice sessions, review history, analytics, and study plans.
- Structured AI explanations with visual highlights, board notes, math rendering, and bilingual output.
- PDF ingestion and admin review workflow for SAT-style questions.
- Backend tests, migrations, metrics, memberships, and support flows.

## Quickstart

```bash
git clone https://github.com/Ha22yX/SAT-AI-Tutor.git
cd SAT-AI-Tutor/sat_platform
python -m venv .venv
.venv\Scripts\activate
pip install -r requirements.txt
python app.py

cd ../frontend
npm install
npm run dev
```

Configure backend `.env` values before using OpenAI, email, or production database features.

## Docker / GHCR

This project publishes two GitHub Container Registry images:

- `ghcr.io/ha22yx/sat-ai-tutor-backend:latest` - Flask API, database, auth, AI services, PDF import.
- `ghcr.io/ha22yx/sat-ai-tutor-frontend:latest` - Next.js student/admin UI.

Minimal Docker Compose example:

```yaml
services:
  backend:
    image: ghcr.io/ha22yx/sat-ai-tutor-backend:latest
    ports:
      - "5080:5080"
    volumes:
      - sat-data:/data
    environment:
      FLASK_CONFIG: production
      DATABASE_URL: sqlite+pysqlite:////data/sat_ai_tutor.db
      JWT_SECRET_KEY: change-this-to-a-long-random-value
      ROOT_ADMIN_PASSWORD: change-this-root-password
      ADMIN_DEFAULT_PASSWORD: change-this-admin-password
      SEED_STUDENT_PASSWORD: change-this-student-password
      OPENAI_API_KEY: ${OPENAI_API_KEY}

  frontend:
    image: ghcr.io/ha22yx/sat-ai-tutor-frontend:latest
    ports:
      - "3000:3000"
    environment:
      API_BASE: http://backend:5080
      NEXT_PUBLIC_API_BASE: /api
    depends_on:
      - backend

volumes:
  sat-data:
```

Do not bake `.env`, OpenAI keys, mail passwords, JWT secrets, admin passwords, uploaded PDFs, or local SQLite files into the image. Pass secrets through runtime environment variables, Docker Compose secrets, or your deployment platform.

## Tech Stack

| Layer | Technology | Role |
| --- | --- | --- |
| Frontend | Next.js, React, TypeScript, Tailwind | Student/admin UI and explanation viewer. |
| Backend | Flask, SQLAlchemy, Alembic | API, auth, learning data, and migrations. |
| AI | OpenAI-compatible API | Explanations, import assistance, and review content. |
| Content | pdfplumber, python-docx, unstructured | Question import and document parsing. |

## Project Map

```text
frontend/                 Next.js student/admin UI
sat_platform/             Flask backend, models, services, migrations, tests
docs/images/              README dashboard screenshot
Others/                   planning notes, scripts, SAT PDF samples
pytest.ini                backend test configuration
```

## Notes

This is one of the larger full-stack projects in the portfolio. Deeper implementation plans live under `Others/` and `docs/`.
