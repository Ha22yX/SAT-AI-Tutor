FROM node:24-bookworm-slim AS frontend-build

WORKDIR /build/frontend

ARG NEXT_PUBLIC_API_BASE=/api
ARG API_BASE=http://127.0.0.1:5080
ENV NEXT_PUBLIC_API_BASE=${NEXT_PUBLIC_API_BASE}
ENV API_BASE=${API_BASE}

COPY frontend/package*.json ./
RUN npm ci

COPY frontend ./
RUN npm run build
RUN npm prune --omit=dev

FROM python:3.12-slim-bookworm AS runner

ENV NODE_ENV=production \
    FLASK_CONFIG=production \
    HOST=0.0.0.0 \
    FRONTEND_PORT=3000 \
    BACKEND_PORT=5080 \
    DATABASE_URL=sqlite+pysqlite:////data/sat_ai_tutor.db \
    NEXT_PUBLIC_API_BASE=/api \
    API_BASE=http://127.0.0.1:5080 \
    PYTHONDONTWRITEBYTECODE=1 \
    PYTHONUNBUFFERED=1

WORKDIR /app

COPY --from=frontend-build /usr/local/bin/node /usr/local/bin/node
COPY --from=frontend-build /usr/local/lib/node_modules /usr/local/lib/node_modules

RUN apt-get update \
    && apt-get install -y --no-install-recommends \
      bash \
      build-essential \
      ca-certificates \
      curl \
      libmagic1 \
      poppler-utils \
      tini \
    && ln -sf ../lib/node_modules/npm/bin/npm-cli.js /usr/local/bin/npm \
    && ln -sf ../lib/node_modules/npm/bin/npx-cli.js /usr/local/bin/npx \
    && rm -rf /var/lib/apt/lists/*

RUN python -m venv /opt/venv
ENV PATH="/opt/venv/bin:${PATH}"

COPY sat_platform/requirements.txt /app/sat_platform/requirements.txt
RUN pip install --no-cache-dir -r /app/sat_platform/requirements.txt

COPY sat_platform /app/sat_platform
COPY --from=frontend-build /build/frontend /app/frontend
COPY scripts/docker-entrypoint.sh /app/scripts/docker-entrypoint.sh

RUN chmod +x /app/scripts/docker-entrypoint.sh \
    && mkdir -p /data

VOLUME ["/data"]
EXPOSE 3000

HEALTHCHECK --interval=30s --timeout=5s --start-period=30s --retries=3 \
  CMD curl -fsS "http://127.0.0.1:${FRONTEND_PORT}/auth/login" >/dev/null || exit 1

ENTRYPOINT ["tini", "--"]
CMD ["/app/scripts/docker-entrypoint.sh"]
