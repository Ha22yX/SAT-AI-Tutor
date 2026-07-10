<div align="center">
  <h1>SAT AI Tutor</h1>
  <p>一个 SAT 练习平台，包含自适应学习计划、AI 讲解、PDF 导入、学习分析和后台工具。</p>

  <p>
    <a href="README.md">English</a>
    &middot;
    <a href="#快速开始">快速开始</a>
    &middot;
    <a href="#技术栈">技术栈</a>
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
  <img src=".github/assets/readme-hero.svg" alt="SAT AI Tutor 项目概览图" width="100%" />
</p>

<p align="center">
  <img src="docs/images/sat-ai-tutor-dashboard.png" alt="SAT AI Tutor 学习仪表盘截图" width="100%" />
</p>

## 项目价值

学生做错题后需要的不只是答案。本平台把练习结果转成可复盘的学习材料：视觉化讲解、掌握度追踪、自适应计划和后台题库管理。

## 工作流

- 学生完成 SAT 风格练习。
- 后端追踪掌握度、练习历史和复习时机。
- AI 讲解以结构化步骤、高亮和板书形式生成。
- 管理员从 PDF 导入并审核题目内容。
- 学习分析和计划引导下一次练习。

## 核心功能

- 学生仪表盘、练习、复盘历史、学习分析和学习计划。
- 结构化 AI 讲解，支持视觉高亮、板书、数学渲染和双语输出。
- SAT 风格题目的 PDF 导入与后台审核流程。
- 后端测试、迁移、指标、会员和支持流程。

## 快速开始

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

使用 OpenAI、邮件或生产数据库功能前，请先配置后端 `.env`。

## Docker / GHCR

这个项目会发布两个 GitHub Container Registry 镜像：

- `ghcr.io/ha22yx/sat-ai-tutor-backend:latest`：Flask API、数据库、认证、AI 服务和 PDF 导入。
- `ghcr.io/ha22yx/sat-ai-tutor-frontend:latest`：Next.js 学生端/管理端界面。

最小 Docker Compose 示例：

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

不要把 `.env`、OpenAI Key、邮箱密码、JWT 密钥、管理员密码、上传的 PDF 或本地 SQLite 数据库打进镜像。请通过运行时环境变量、Docker Compose secrets 或部署平台的密钥管理来提供这些配置。

## 技术栈

| 层级 | 技术 | 作用 |
| --- | --- | --- |
| 前端 | Next.js, React, TypeScript, Tailwind | 学生/后台界面和讲解播放器。 |
| 后端 | Flask, SQLAlchemy, Alembic | API、认证、学习数据和迁移。 |
| AI | OpenAI-compatible API | 讲解、导入辅助和复盘内容。 |
| 内容 | pdfplumber, python-docx, unstructured | 题目导入和文档解析。 |

## 项目结构

```text
frontend/                 Next.js student/admin UI
sat_platform/             Flask backend, models, services, migrations, tests
docs/images/              README dashboard screenshot
Others/                   planning notes, scripts, SAT PDF samples
pytest.ini                backend test configuration
```

## 项目说明

这是作品集中较大的全栈项目之一。更详细的实现计划在 `Others/` 和 `docs/` 中。
