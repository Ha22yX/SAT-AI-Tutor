<div align="center">
  <h1>SAT AI Tutor</h1>
  <p>一个全栈 SAT 练习平台，包含自适应学习计划、AI 讲解、PDF 导入、学习分析和后台管理工具。</p>

  <p>
    <a href="README.md">English</a>
    &middot;
    <a href="https://sat.rosebeg.com/auth/login?demo=1">在线案例</a>
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

## 在线案例

访问案例页面：[https://sat.rosebeg.com/auth/login?demo=1](https://sat.rosebeg.com/auth/login?demo=1)。这个链接会打开已自动填入演示账号的登录页，你可以继续测试学生仪表盘、SAT 做题流程和 AI 答案分析功能。

| 角色 | 账号 | 密码 |
| --- | --- | --- |
| Demo 学生 | `demo` | `demo` |

## 产品截图

### 学生主界面

主界面集中展示每日学习计划、练习进度、掌握度趋势和下一步推荐，让学生打开网站后就能知道今天该做什么。

<p align="center">
  <img src="docs/images/sat-ai-tutor-home.png" alt="SAT AI Tutor 网站主界面截图" width="100%" />
</p>

### 做题界面

做题界面围绕单道 SAT 风格题目展开，把作答、进度、图表题信息和复盘操作放在同一个学习空间里。

<p align="center">
  <img src="docs/images/sat-ai-tutor-practice.png" alt="SAT AI Tutor 做题界面截图" width="100%" />
</p>

### AI 分析

AI 分析页面会把一次作答转化为结构化反馈，展示推理步骤、讲解重点和个性化复盘建议。

<p align="center">
  <img src="docs/images/sat-ai-tutor-ai-analysis.png" alt="SAT AI Tutor AI 分析截图" width="100%" />
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

## 最近生产修复

- 将前端运行时升级到已修复安全问题的 Next.js 版本，并刷新存在风险的客户端依赖。
- 增加 Next.js 构建后静态资源保留机制，避免重新构建后旧标签页请求旧 chunk 文件时出现 404。
- 对 GPT-5 Responses API 请求做兼容处理，移除不支持的 `temperature` 字段，并增强 OpenAI 错误日志。
- 修复 Responses 输出解析逻辑，能从第一个文本内容块读取讲解，而不是只检查第一个 response block。
- 发布题目时不再被 AI 讲解生成阻塞，并在自动发布检查前先提交草稿，提升后台发布稳定性。
- 禁止 vision PDF 导入自动发布，让提取出的题目先经过人工审核再进入正式题库。
- 规范同源部署下的 API URL 生成，避免 SSE 和后台导入流程出现重复的 `/api/api` 路径。

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

项目发布为一个容器镜像：

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
| `ADMIN_DEFAULT_PASSWORD` | 初始化种子流程使用的默认管理员密码。 |
| `SEED_STUDENT_PASSWORD` | 初始化学生账号默认密码。 |
| `OPENAI_API_KEY` | 启用 AI 讲解和导入辅助。 |
| `DATABASE_URL` | 默认是 `sqlite+pysqlite:////data/sat_ai_tutor.db`。 |
| `FRONTEND_PORT` | 默认 `3000`。 |
| `BACKEND_PORT` | 容器内部后端端口，默认 `5080`。 |

## 技术栈

| 层级 | 技术 | 作用 |
| --- | --- | --- |
| 前端 | Next.js, React, TypeScript, Tailwind | 学生端和管理端 UI、讲解页面。 |
| 后端 | Flask, SQLAlchemy, Alembic | API、认证、学习数据和迁移。 |
| AI | OpenAI-compatible API | 讲解、导入辅助和复盘内容。 |
| 内容处理 | pdfplumber, python-docx, unstructured | 题目导入和文档解析。 |
| 部署 | Docker, GHCR, GitHub Actions | 单镜像构建、启动检查和发布。 |

## 项目结构

```text
frontend/                 Next.js 学生端和管理端 UI
sat_platform/             Flask 后端、模型、服务、迁移和测试
docs/images/              README 产品截图
Others/                   规划笔记、脚本和 SAT PDF 示例
scripts/docker-entrypoint.sh
Dockerfile                前端 + 后端单镜像
pytest.ini                后端测试配置
```

## 项目状态

这是一个持续完善中的全栈学习平台项目。更深入的实现计划在 `Others/` 和 `docs/` 中；管理员密码和 API Key 必须作为运行时密钥处理。

## 许可证

本项目使用 MIT License。详见 [LICENSE](LICENSE)。
