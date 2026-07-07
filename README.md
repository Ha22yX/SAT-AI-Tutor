# SAT AI Tutor

[中文说明](README.zh-CN.md)

![SAT AI Tutor learning dashboard](docs/images/sat-ai-tutor-dashboard.png)

SAT AI Tutor is a full-stack SAT practice and review platform. It includes adaptive practice, daily study planning, explanation playback, PDF question ingestion, analytics, and admin tools for managing question content.

The project focuses on turning completed questions into review material. Explanations can include step-by-step reasoning, highlighted evidence, board notes, figure references, and bilingual output. The goal is practical: help students understand the answer they just missed and give admins a workflow for importing and reviewing new SAT-style questions.

## Project Focus

- SAT-style explanations that go beyond a short answer key.
- A visual explanation format for passages, stems, choices, and figures.
- Math review paths for graphing, substitution, algebra, estimation, and self-checking.
- Reading and Writing review paths for evidence, grammar logic, and distractor traps.
- Adaptive practice based on mastery, recent performance, review timing, and study-plan history.
- Admin workflows for PDF import, draft review, figure cropping, validation, and publishing.
- English and Chinese UI/explanation support.

## Core Features

### Student Experience

- Learning dashboard with daily goals, target minutes, question count, progress, streak, tutor notes, and mastery summaries.
- Practice sessions with multiple-choice and fill-in SAT-style questions.
- AI explanation history and detailed review surfaces.
- Analytics pages for performance, skill mastery, and learning diagnostics.
- Settings, membership status, support/suggestions, and authenticated user flows.

### AI Explanations

The backend generates explanations using a structured animation protocol (`tutor.anim.v1`). Each explanation can include:

- A concise summary.
- 5-7 guided steps.
- Teacher-style narration.
- Board notes and takeaway rules.
- Highlight, underline, circle, strike, note, color, and font cues.
- Passage/stem/choice/figure targeting.
- Math and Reading/Writing-specific strategy prompts.
- English or Chinese output, with key SAT wording preserved when useful.

The frontend renders these explanations through an interactive viewer that plays the steps and visually highlights the relevant text.

### Adaptive Learning

- Skill mastery tracking by SAT domain.
- Question selection based on mastery gaps, recency, past answers, and due review.
- Daily study plan generation with blocks, target questions, minutes, and focus skills.
- Diagnostic flow before plan generation.
- Spaced repetition and score/analytics services.

### Admin & Content Pipeline

- Question CRUD and validation.
- PDF upload and ingestion.
- AI-assisted question normalization and solving.
- Draft question review and publishing.
- Figure extraction/cropping and secure figure URLs.
- OpenAI/API event logging for import jobs.
- Question explanation caching in multiple languages.

## Tech Stack

### Frontend

- Next.js 16 App Router
- React 19
- TypeScript
- Tailwind CSS 4
- React Query
- Zustand
- Axios
- KaTeX / markdown math rendering
- Lucide React

### Backend

- Flask 3
- SQLAlchemy 2
- Flask-Migrate / Alembic
- Flask-JWT-Extended
- Flask-CORS
- Flask-Limiter
- Marshmallow / Pydantic
- pdfplumber / python-docx / unstructured
- Celery / Redis hooks for background work
- Prometheus metrics
- OpenAI-compatible API integration

## Repository Structure

```text
frontend/
  src/
    app/          Next.js routes: dashboard, practice, AI explain, analytics, admin, auth.
    components/   App shell, dashboard, practice, explanation viewer, admin import UI.
    services/     API clients for auth, learning, admin, analytics, AI explain, support.
    hooks/         Auth, i18n, dashboard data.
    stores/        Zustand auth/session state.
    types/         Shared TypeScript response types.
    lib/           HTTP client, env, image helpers, auth storage.

sat_platform/
  app.py          Flask entry point.
  config.py       Backend configuration and environment variables.
  sat_app/
    blueprints/   Auth, admin, learning, AI, analytics, diagnostic, support APIs.
    services/     AI explainer, adaptive engine, PDF ingest, plans, sessions, analytics.
    models/       Users, questions, learning sessions, imports, analytics, memberships.
    schemas/      Marshmallow/Pydantic request and response schemas.
    utils/        Security, signed URLs, file parsing.
    tasks/        Question/import task helpers.
  migrations/     Alembic database migrations.
  tests/          Backend test suite.

Others/
  BackEndPlans/   Backend implementation notes and SAT PDF samples.
  FrontEndPlans/  Frontend implementation notes.
  scripts/        Development and ingestion scripts.

docs/images/      README screenshots and documentation images.
```

## Quick Start

### 1. Backend

```bash
cd sat_platform
python -m venv .venv

# Windows
.venv\Scripts\activate

# macOS/Linux
source .venv/bin/activate

pip install --upgrade pip
pip install -r requirements.txt
```

Create `sat_platform/.env`:

```env
FLASK_APP=app
FLASK_ENV=development
DATABASE_URL=sqlite+pysqlite:///sat_dev.db
JWT_SECRET_KEY=change-this-secret
CORS_ORIGINS=http://localhost:3000
OPENAI_API_KEY=
AI_MODEL_NAME=gpt-4o-mini
AI_EXPLAINER_ENABLE=true
AI_PARSER_ENABLE=true
AI_DIAGNOSTIC_ENABLE=true
FRONTEND_BASE_URL=http://localhost:3000
MAIL_ENABLED=false
```

Run migrations and start the API:

```bash
flask --app app db upgrade
flask --app app run --host 0.0.0.0 --port 5080
```

### 2. Frontend

```bash
cd frontend
npm install
```

Create `frontend/.env.local`:

```env
NEXT_PUBLIC_APP_NAME=SAT AI Tutor
NEXT_PUBLIC_API_BASE=http://127.0.0.1:5080
NEXT_PUBLIC_GAMIFICATION_COPY=Complete a block to keep your streak alive!
```

Run the web app:

```bash
npm run dev
```

Open `http://localhost:3000`.

## Common Commands

Backend:

```bash
cd sat_platform
pytest
flask --app app db migrate -m "message"
flask --app app db upgrade
```

Frontend:

```bash
cd frontend
npm run lint
npm run build
npm run start
```

## Important API Areas

- Auth: `/api/auth/register`, `/api/auth/login`, `/api/auth/me`
- Learning plan: `/api/learning/plan/today`, `/api/learning/plan/regenerate`
- Practice sessions: `/api/learning/session/start`, `/api/learning/session/answer`, `/api/learning/session/end`
- AI explain: `/api/ai/explain`
- Analytics: `/api/analytics/*`
- Diagnostic: `/api/diagnostic/*`
- Admin questions/imports: `/api/admin/questions`, `/api/admin/questions/upload`, `/api/admin/questions/parse`
- Support: `/api/support/*`
- Metrics: `/metrics`

## Configuration Notes

- `OPENAI_API_KEY` enables AI explanations, diagnostic feedback, parsing, PDF normalization, and question generation.
- `AI_MODEL_NAME` is the shared model knob used by explainer, parser, PDF, tutor notes, and diagnostic services unless more specific variables are added.
- `PLAN_*` variables control daily plan size and block length.
- `ADAPTIVE_*` variables control mastery updates.
- `AI_EXPLAIN_FREE_DAILY_LIMIT` and membership variables control explain quota behavior.
- `MAIL_*` variables enable verification, password reset, and email-change flows.
- SQLite is the default local database; production can use PostgreSQL through `DATABASE_URL`.

## Testing

The backend includes tests for:

- App factory and auth
- Admin question workflows
- AI explanations
- Adaptive engine
- Analytics
- Learning sessions and plans
- Membership and mail services
- Metrics and support flows
- PDF/question import behavior

Run:

```bash
cd sat_platform
pytest
```

## Development Notes

- The frontend automatically falls back to `http://127.0.0.1:5080` for API calls when running locally.
- The explanation viewer supports markdown, math, KaTeX, step playback, and active visual directives.
- Imported/generated questions are validated so invalid stems, answers, choices, or fill-in schemas are filtered before assignment.
- Figure URLs are signed and rate-limited for preview/practice usage.
- Some planning notes and scripts are intentionally kept in `Others/` as implementation history and development utilities.

## License

No license file is currently included.
