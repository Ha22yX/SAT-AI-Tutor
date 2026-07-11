<div align="center">
  <h1>SAT AI Tutor</h1>
  <p>一个全栈 SAT 练习平台，包含自适应学习计划、AI 讲解、PDF 导入、学习分析和后台管理工具。</p>

  <p>
    <a href="README.md">English</a>
    &middot;
    <a href="#快速开始">快速开始</a>
    &middot;
    <a href="#docker--ghcr">Docker</a>
    &middot;
    <a href="#核心功能">核心功能</a>
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
  <img src=".github/assets/readme-hero.svg" alt="SAT AI Tutor 项目概览图" width="100%" />
</p>

<p align="center">
  <img src="docs/images/sat-ai-tutor-dashboard.png" alt="SAT AI Tutor 学习仪表盘截图" width="100%" />
</p>

## 项目概览

SAT AI Tutor 是一个面向 SAT 练习、复盘和内容运营的学习平台。学生端负责练习、复盘错题和查看学习进度；Flask 后端负责用户、掌握度数据、AI 讲解、题目导入、学习分析和后台流程。

项目的核心想法是：错题不应该只是一个答案，而应该变成可以继续学习的讲解和复盘路径。

## 核心功能

- 学生仪表盘、练习会话、复盘历史、学习分析和学习计划。
- 结构化 AI 讲解，支持高亮、笔记、数学渲染和中英文输出。
- SAT 风格题库的 PDF 导入和后台审核流程。
- 后端认证、迁移、指标、会员、支持流程和测试。
- 单个 GHCR 镜像同时运行 Next.js 前端和 Flask 后端。

## 快速开始

开发环境可以分别启动后端和前端：

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

项目现在发布为一个容器镜像：

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

访问 `http://localhost:3000`。前端对外暴露 `3000` 端口；Flask 后端只在容器内部监听 `127.0.0.1:5080`，由前端同源 `/api` 路由转发。

不要把 `.env`、OpenAI Key、邮箱密码、JWT 密钥、管理员密码、上传的 PDF 或 SQLite 文件打进镜像。运行数据应通过 Docker volume 挂载到 `/data`。

## 配置项

| 变量 | 作用 |
| --- | --- |
| `JWT_SECRET_KEY` | 生产环境 JWT 签名密钥。 |
| `ROOT_ADMIN_PASSWORD` | 初始 root 管理员密码。 |
| `ADMIN_DEFAULT_PASSWORD` | 初始化/种子流程使用的默认管理员密码。 |
| `SEED_STUDENT_PASSWORD` | 初始化学生账号默认密码。 |
| `OPENAI_API_KEY` | 启用 AI 讲解和导入辅助。 |
| `DATABASE_URL` | 默认是 `sqlite+pysqlite:////data/sat_ai_tutor.db`。 |
| `FRONTEND_PORT` | 默认 `3000`。 |
| `BACKEND_PORT` | 容器内部后端端口，默认 `5080`。 |

## 技术栈

| 层级 | 技术 | 作用 |
| --- | --- | --- |
| 前端 | Next.js, React, TypeScript, Tailwind | 学生端/管理端 UI 和讲解页面。 |
| 后端 | Flask, SQLAlchemy, Alembic | API、认证、学习数据和迁移。 |
| AI | OpenAI-compatible API | 讲解、导入辅助和复盘内容。 |
| 内容处理 | pdfplumber, python-docx, unstructured | 题目导入和文档解析。 |
| 部署 | Docker, GHCR, GitHub Actions | 单镜像构建、启动检查和发布。 |

## 项目结构

```text
frontend/                 Next.js 学生端/管理端 UI
sat_platform/             Flask 后端、模型、服务、迁移和测试
docs/images/              README 仪表盘截图
Others/                   规划笔记、脚本和 SAT PDF 样例
scripts/docker-entrypoint.sh
Dockerfile                前端 + 后端单镜像
pytest.ini                后端测试配置
```

## 项目状态

这是一个仍在持续完善的全栈学习平台项目。更深入的实现计划在 `Others/` 和 `docs/` 中；管理员密码和 API Key 必须作为运行时密钥处理。

## 许可证

本项目使用 MIT License。详见 [LICENSE](LICENSE)。
