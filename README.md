<div align="center">
  <h1>SAT AI Tutor</h1>
  <p>A full-stack SAT practice platform with adaptive study plans, AI explanations, PDF import, analytics, and admin tools.</p>

  <p>
    <a href="README.zh-CN.md">Chinese</a>
    &middot;
    <a href="#quickstart">Quickstart</a>
    &middot;
    <a href="#features">Features</a>
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

## Overview

This is one of the larger full-stack projects in the portfolio. It combines a student-facing SAT practice interface with a Flask backend that tracks mastery, sessions, explanations, imports, analytics, membership, and admin workflows.

The project is designed around the idea that a missed question should become guided review, not just an answer-key lookup.

## Features

- Student dashboard, practice sessions, review history, analytics, and study plans.
- Structured AI explanations with highlights, notes, math rendering, and bilingual output.
- PDF ingestion and admin review workflow for SAT-style questions.
- Backend migrations, tests, metrics, membership, and support flows.
- Published backend and frontend GHCR images for deployment experiments.

## How It Works

1. Students complete SAT-style practice sessions.
2. The backend records answers, mastery, session history, and review timing.
3. AI services generate explanations, diagnostics, and import assistance.
4. Admins import/review content and operate the platform.
5. The frontend presents plans, analytics, and explanation views.

## Quickstart

Run the project locally with the commands below.

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

Do not bake `.env`, OpenAI keys, mail passwords, JWT secrets, admin passwords, uploaded PDFs, or local SQLite files into the image.

## Configuration

| Item | Purpose |
| --- | --- |
| Backend secrets | `JWT_SECRET_KEY`, admin passwords, OpenAI key, mail credentials. |
| Database | SQLite for local work; configure `DATABASE_URL` for deployment. |
| Frontend API | Set `API_BASE` / `NEXT_PUBLIC_API_BASE` to match backend routing. |
| PDF import | Review generated/imported questions before assigning them to students. |

## Tech Stack

| Layer | Technology | Role |
| --- | --- | --- |
| Frontend | Next.js, React, TypeScript, Tailwind | Student/admin UI and explanation viewer. |
| Backend | Flask, SQLAlchemy, Alembic | API, auth, learning data, and migrations. |
| AI | OpenAI-compatible API | Explanations, import assistance, review content. |
| Content | pdfplumber, python-docx, unstructured | Question import and document parsing. |

## Project Layout

```text
frontend/                 Next.js student/admin UI
sat_platform/             Flask backend, models, services, migrations, tests
docs/images/              README dashboard screenshot
Others/                   planning notes, scripts, SAT PDF samples
Dockerfile.*              backend/frontend Docker images
pytest.ini                backend test configuration
```

## Status

Active full-stack learning-platform project. Deeper implementation plans live under `Others/` and `docs/`; treat admin credentials and API keys as runtime secrets.

## License

No project-wide open-source license has been declared yet.
