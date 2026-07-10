<div align="center">
  <h1>SAT AI Tutor</h1>
  <p>一个全栈 SAT 练习平台，包含自适应学习计划、AI 讲解、PDF 导入、学习分析和后台工具。</p>

  <p>
    <a href="README.md">English</a>
    &middot;
    <a href="#快速开始">快速开始</a>
    &middot;
    <a href="#核心能力">核心能力</a>
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

## 项目概览

这是作品集中较大的全栈项目之一。它把学生端 SAT 练习界面与 Flask 后端结合起来，后端负责掌握度、练习会话、AI 讲解、导入、分析、会员和后台流程。

项目的核心想法是：做错一道题后，学生需要的是可复盘的引导，而不是只看到答案。

## 核心能力

- 学生仪表盘、练习会话、复盘历史、学习分析和学习计划。
- 结构化 AI 讲解，支持高亮、笔记、数学渲染和双语输出。
- SAT 风格题目的 PDF 导入和后台审核流程。
- 后端迁移、测试、指标、会员和支持流程。
- 已发布后端和前端 GHCR 镜像，便于部署实验。

## 工作方式

1. 学生完成 SAT 风格练习。
2. 后端记录答案、掌握度、练习历史和复习时机。
3. AI 服务生成讲解、诊断和导入辅助内容。
4. 管理员导入/审核题目并运营平台。
5. 前端展示学习计划、分析和讲解页面。

## 快速开始

可以用下面的命令在本地运行项目。

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

本项目发布两个 GitHub Container Registry 镜像：

- `ghcr.io/ha22yx/sat-ai-tutor-backend:latest`：Flask API、数据库、认证、AI 服务和 PDF 导入。
- `ghcr.io/ha22yx/sat-ai-tutor-frontend:latest`：Next.js 学生端/管理端 UI。

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

不要把 `.env`、OpenAI Key、邮箱密码、JWT 密钥、管理员密码、上传 PDF 或本地 SQLite 文件打进镜像。

## 配置项

| 项目 | 作用 |
| --- | --- |
| 后端密钥 | `JWT_SECRET_KEY`、管理员密码、OpenAI Key、邮件凭据。 |
| 数据库 | 本地可用 SQLite；部署时通过 `DATABASE_URL` 配置。 |
| 前端 API | 设置 `API_BASE` / `NEXT_PUBLIC_API_BASE` 以匹配后端路由。 |
| PDF 导入 | 分配给学生前应人工复核生成/导入的题目。 |

## 技术栈

| 层级 | 技术 | 作用 |
| --- | --- | --- |
| 前端 | Next.js, React, TypeScript, Tailwind | 学生端/后台 UI 和讲解播放器。 |
| 后端 | Flask, SQLAlchemy, Alembic | API、认证、学习数据和迁移。 |
| AI | OpenAI-compatible API | 讲解、导入辅助和复盘内容。 |
| 内容处理 | pdfplumber, python-docx, unstructured | 题目导入和文档解析。 |

## 项目结构

```text
frontend/                 Next.js 学生端/后台 UI
sat_platform/             Flask 后端、模型、服务、迁移和测试
docs/images/              README 仪表盘截图
Others/                   规划笔记、脚本和 SAT PDF 样例
Dockerfile.*              后端/前端 Docker 镜像
pytest.ini                后端测试配置
```

## 项目状态

活跃的全栈学习平台项目。更深入的实现计划在 `Others/` 和 `docs/` 中；管理员密码和 API Key 必须作为运行时密钥处理。

## 许可证

当前仓库尚未声明项目级开源许可证；公开复用或分发前建议先补充 License。
