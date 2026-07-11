<div align="center">
  <h1>SAT AI Tutor</h1>
  <p>A full-stack SAT practice platform with adaptive study plans, AI explanations, PDF import, analytics, and admin tools.</p>

  <p>
    <a href="README.zh-CN.md">中文版本</a>
    &middot;
    <a href="#quickstart">Quickstart</a>
    &middot;
    <a href="#docker--ghcr">Docker</a>
    &middot;
    <a href="#features">Features</a>
  </p>

  <p>
    <img alt="Next.js: 16" src="https://img.shields.io/badge/Next.js-16-111111?style=for-the-badge&logo=nextdotjs&logoColor=white" />
    <img alt="React: 19" src="https://img.shields.io/badge/React-19-61DAFB?style=for-the-badge&logo=react&logoColor=white" />
    <img alt="Flask: 3" src="https://img.shields.io/badge/Flask-3-000000?style=for-the-badge&logo=flask&logoColor=white" />
    <a href="https://github.com/Ha22yX/SAT-AI-Tutor/pkgs/container/sat-ai-tutor"><img alt="Docker image" src="https://img.shields.io/badge/GHCR-single%20image-2496ED?style=for-the-badge&logo=docker&logoColor=white" /></a>
    <img alt="License: MIT" src="https://img.shields.io/badge/License-MIT-2e7d5b?style=for-the-badge" />
  </p>
</div>

<p align="center">
  <img src=".github/assets/readme-hero.svg" alt="SAT AI Tutor overview image" width="100%" />
</p>

<p align="center">
  <img src="docs/images/sat-ai-tutor-dashboard.png" alt="SAT AI Tutor learning dashboard screenshot" width="100%" />
</p>

## Overview

SAT AI Tutor is a learning-platform project for SAT practice, review, and content operations. The student UI helps learners practice and review missed questions; the Flask backend manages users, mastery data, explanations, imports, analytics, and admin workflows.

The core idea is simple: a wrong answer should become guided review, not just an answer-key lookup.

## Features

- Student dashboard, practice sessions, review history, analytics, and study plans.
- Structured AI explanations with highlights, notes, math rendering, and bilingual output.
- PDF ingestion and admin review workflow for SAT-style question banks.
- Backend auth, migrations, metrics, membership, support flows, and tests.
- One GHCR image that runs the Next.js frontend and Flask backend together.

## Quickstart

Run the backend and frontend locally during development:

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

The project now ships as one container image:

```bash
docker pull ghcr.io/ha22yx/sat-ai-tutor:latest

docker run -d --name sat-ai-tutor \
  -p 3000:3000 \
  -v sat-ai-tutor-data:/data \
  -e JWT_SECRET_KEY=change-this-to-a-long-random-value \
  -e ROOT_ADMIN_PASSWORD=change-this-root-password \
  -e ADMIN_DEFAULT_PASSWORD=change-this-admin-password \
  -e SEED_STUDENT_PASSWORD=change-this-student-password \
  -e OPENAI_API_KEY=$OPENAI_API_KEY \
  ghcr.io/ha22yx/sat-ai-tutor:latest
```

Open `http://localhost:3000`. The frontend is public on port `3000`; the Flask backend stays inside the container on `127.0.0.1:5080` and is reached through the same-origin `/api` route.

Do not bake `.env`, OpenAI keys, mail passwords, JWT secrets, admin passwords, uploaded PDFs, or SQLite files into the image. Keep runtime data in `/data` through a Docker volume.

## Configuration

| Variable | Purpose |
| --- | --- |
| `JWT_SECRET_KEY` | Required production JWT signing secret. |
| `ROOT_ADMIN_PASSWORD` | Initial root admin password. |
| `ADMIN_DEFAULT_PASSWORD` | Default admin account password used by seed/setup flows. |
| `SEED_STUDENT_PASSWORD` | Default seeded student password. |
| `OPENAI_API_KEY` | Enables AI explanations and import assistance. |
| `DATABASE_URL` | Defaults to `sqlite+pysqlite:////data/sat_ai_tutor.db`. |
| `FRONTEND_PORT` | Defaults to `3000`. |
| `BACKEND_PORT` | Internal backend port, defaults to `5080`. |

## Tech Stack

| Layer | Technology | Role |
| --- | --- | --- |
| Frontend | Next.js, React, TypeScript, Tailwind | Student/admin UI and explanation viewer. |
| Backend | Flask, SQLAlchemy, Alembic | API, auth, learning data, and migrations. |
| AI | OpenAI-compatible API | Explanations, import assistance, review content. |
| Content | pdfplumber, python-docx, unstructured | Question import and document parsing. |
| Deployment | Docker, GHCR, GitHub Actions | Single-image build, smoke test, and publish flow. |

## Project Layout

```text
frontend/                 Next.js student/admin UI
sat_platform/             Flask backend, models, services, migrations, tests
docs/images/              README dashboard screenshot
Others/                   Planning notes, scripts, and SAT PDF samples
scripts/docker-entrypoint.sh
Dockerfile                Single image for frontend + backend
pytest.ini                Backend test configuration
```

## Status

Active full-stack learning-platform project. Deeper implementation plans live under `Others/` and `docs/`; credentials and API keys must stay as runtime secrets.

## License

Released under the MIT License. See [LICENSE](LICENSE).
