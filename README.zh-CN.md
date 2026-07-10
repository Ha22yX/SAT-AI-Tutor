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
    <img alt="AI: explanations" src="https://img.shields.io/badge/AI-explanations-7d73b7?style=for-the-badge" />
  </p>
</div>

<p align="center">
  <img src=".github/assets/readme-hero.svg" alt="SAT AI Tutor 项目概览图" width="100%" />
</p>

## 项目价值

学生做错题后需要的不只是答案。本平台把练习结果转成可复盘的学习材料：讲解、高亮、掌握度追踪和后台题库管理。

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

## 核心功能

- 学生仪表盘、练习、复盘历史、掌握度分析和学习计划。
- 结构化 AI 讲解，支持高亮、板书、数学渲染和双语输出。
- SAT 风格题目的 PDF 导入与后台审核流程。
- 包含后端测试、迁移、指标、会员和支持流程。

## 技术栈

| Layer | Technology | Role |
| --- | --- | --- |
| 前端 | Next.js, React, TypeScript, Tailwind | 学生/后台界面和讲解播放器。 |
| 后端 | Flask, SQLAlchemy, Alembic | API、认证、学习数据和迁移。 |
| AI | OpenAI-compatible API | 讲解、导入辅助和复盘内容。 |
| 内容 | pdfplumber, python-docx, unstructured | 题目导入和文档解析。 |


## 项目说明

这是作品集中较大的全栈项目之一。README 保持短版，更详细的前后端计划在 `Others/` 和 `docs/` 中。
