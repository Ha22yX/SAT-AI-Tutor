# SAT AI Tutor

[English](README.md)

![SAT AI Tutor 学习仪表盘](docs/images/sat-ai-tutor-dashboard.png)

SAT AI Tutor 是一个面向 SAT 备考的全栈 AI 学习网站。它把自适应练习、每日学习计划、详细 AI 讲解、可视化讲解播放、PDF 题目导入、题目生成、学习数据分析和后台管理整合在一起。

这个项目的重点不是做一个普通题库，而是把每一道题都变成一次清晰的教学过程。平台不仅给出答案，还可以生成结构化的分步讲解，配合文本高亮、板书提示、动画标记、图像引用和中英文支持，帮助学生理解为什么正确答案成立、为什么干扰项错误，以及下次遇到类似题型该怎么想。

## 项目特色

- 不是短答案，而是细致的 SAT 解题推理。
- 可视化讲解协议，可以高亮 passage、题干、选项和图表区域。
- 数学题会根据题型选择画图、代入、代数、估算和自检策略。
- 阅读与写作题会强调关键词、证据句、语法逻辑和干扰项陷阱。
- 自适应练习会根据掌握度、最近表现、间隔复习和学习计划历史调整。
- 后台支持 PDF 导入、AI 解析、草稿审查、图像裁剪、题目验证和发布。
- 支持英文和中文界面/讲解，方便双语学习者使用。

## 核心功能

### 学生端

- 学习仪表盘：每日目标、学习分钟数、题目数、进度、连续学习、AI tutor notes 和掌握度摘要。
- SAT 风格练习：支持选择题和填空题。
- AI 讲解历史和详细复盘页面。
- 学习分析页面：表现趋势、技能掌握度和诊断信息。
- 设置、会员状态、建议/支持和登录注册流程。

### AI 讲解

后端会生成结构化讲解协议 `tutor.anim.v1`。每份讲解可以包含：

- 简短总结。
- 5-7 个分步讲解。
- 老师式 narration。
- 板书提示和 takeaway。
- 高亮、下划线、圈出、划掉、注释、颜色和字体提示。
- passage / stem / choices / figure 的精确定位。
- 数学和阅读写作各自的策略提示。
- 英文或中文输出，并在需要时保留关键 SAT 英文词句。

前端会用交互式 viewer 播放这些步骤，并把相关文本或图像区域可视化标出来。

### 自适应学习

- 按 SAT 技能领域追踪掌握度。
- 根据掌握度差距、最近练习、历史答案和复习到期情况选题。
- 生成每日学习计划，包含 block、目标题数、学习时间和重点技能。
- 支持诊断流程。
- 支持间隔复习、分数预测和学习分析服务。

### 后台与内容生产

- 题目 CRUD 和验证。
- PDF 上传与导入。
- AI 辅助题目标准化和求解。
- 草稿题目审查与发布。
- 图像提取、裁剪和安全图像链接。
- OpenAI/API 调用日志。
- 多语言题目讲解缓存。

## 技术栈

### 前端

- Next.js 16 App Router
- React 19
- TypeScript
- Tailwind CSS 4
- React Query
- Zustand
- Axios
- KaTeX / markdown math rendering
- Lucide React

### 后端

- Flask 3
- SQLAlchemy 2
- Flask-Migrate / Alembic
- Flask-JWT-Extended
- Flask-CORS
- Flask-Limiter
- Marshmallow / Pydantic
- pdfplumber / python-docx / unstructured
- Celery / Redis 后台任务接口
- Prometheus metrics
- OpenAI-compatible API integration

## 项目结构

```text
frontend/
  src/
    app/          Next.js 路由：dashboard、practice、AI explain、analytics、admin、auth。
    components/   App shell、dashboard、practice、explanation viewer、admin import UI。
    services/     auth、learning、admin、analytics、AI explain、support API 客户端。
    hooks/         Auth、i18n、dashboard data。
    stores/        Zustand 登录/会话状态。
    types/         TypeScript 响应类型。
    lib/           HTTP client、env、image helpers、auth storage。

sat_platform/
  app.py          Flask 入口。
  config.py       后端配置和环境变量。
  sat_app/
    blueprints/   Auth、admin、learning、AI、analytics、diagnostic、support API。
    services/     AI explainer、adaptive engine、PDF ingest、plan、session、analytics。
    models/       用户、题目、练习、导入、分析、会员等模型。
    schemas/      请求/响应 schema。
    utils/        安全、签名 URL、文件解析。
    tasks/        题目/导入任务辅助逻辑。
  migrations/     Alembic 数据库迁移。
  tests/          后端测试。

Others/
  BackEndPlans/   后端实现笔记和 SAT PDF 样例。
  FrontEndPlans/  前端实现笔记。
  scripts/        开发和导入脚本。

docs/images/      README 截图和文档图片。
```

## 快速启动

### 1. 后端

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

创建 `sat_platform/.env`：

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

运行迁移并启动 API：

```bash
flask --app app db upgrade
flask --app app run --host 0.0.0.0 --port 5080
```

### 2. 前端

```bash
cd frontend
npm install
```

创建 `frontend/.env.local`：

```env
NEXT_PUBLIC_APP_NAME=SAT AI Tutor
NEXT_PUBLIC_API_BASE=http://127.0.0.1:5080
NEXT_PUBLIC_GAMIFICATION_COPY=Complete a block to keep your streak alive!
```

启动网页：

```bash
npm run dev
```

打开 `http://localhost:3000`。

## 常用命令

后端：

```bash
cd sat_platform
pytest
flask --app app db migrate -m "message"
flask --app app db upgrade
```

前端：

```bash
cd frontend
npm run lint
npm run build
npm run start
```

## 主要 API 模块

- Auth: `/api/auth/register`, `/api/auth/login`, `/api/auth/me`
- Learning plan: `/api/learning/plan/today`, `/api/learning/plan/regenerate`
- Practice sessions: `/api/learning/session/start`, `/api/learning/session/answer`, `/api/learning/session/end`
- AI explain: `/api/ai/explain`
- Analytics: `/api/analytics/*`
- Diagnostic: `/api/diagnostic/*`
- Admin questions/imports: `/api/admin/questions`, `/api/admin/questions/upload`, `/api/admin/questions/parse`
- Support: `/api/support/*`
- Metrics: `/metrics`

## 配置说明

- `OPENAI_API_KEY` 用于 AI 讲解、诊断反馈、题目解析、PDF 标准化和题目生成。
- `AI_MODEL_NAME` 是多个 AI 功能默认共用的模型配置。
- `PLAN_*` 控制每日计划大小和 block 时间。
- `ADAPTIVE_*` 控制掌握度更新。
- `AI_EXPLAIN_FREE_DAILY_LIMIT` 和会员变量控制 AI 讲解额度。
- `MAIL_*` 用于邮箱验证、密码重置和邮箱更改流程。
- 本地默认使用 SQLite；生产环境可通过 `DATABASE_URL` 使用 PostgreSQL。

## 测试

后端测试覆盖：

- App factory 和 auth
- 后台题目流程
- AI 讲解
- 自适应引擎
- 学习分析
- 练习 session 和学习计划
- 会员与邮件服务
- Metrics 和 support 流程
- PDF/题目导入行为

运行：

```bash
cd sat_platform
pytest
```

## 开发说明

- 前端本地运行时会默认把 API 指向 `http://127.0.0.1:5080`。
- 讲解 viewer 支持 markdown、数学公式、KaTeX、步骤播放和可视化 directive。
- 导入/生成的题目会经过验证，缺少题干、答案、选项或填空 schema 的题目不会被分配给学生。
- 图像链接使用签名 URL，并对预览/练习用途做限流。
- `Others/` 中保留了规划文档和开发脚本，作为实现历史和工具集合。

## License

当前仓库暂未包含 license 文件。
