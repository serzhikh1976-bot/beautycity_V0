# BeautyCity

Мультитенантный Telegram-бот маркетплейса бьюти-услуг.

## Структура

- `apps/bot` — Fastify + Grammy, единый webhook-приёмник для всех городов
- `apps/worker` — BullMQ, таймеры и рассылки
- `apps/admin` — Next.js, веб-панель менеджера и главного админа
- `packages/db` — Drizzle ORM, схема и миграции
- `packages/shared` — Zod-схемы, типы, константы
- `packages/config` — общие конфиги ESLint и TypeScript

## Быстрый старт

```bash
# Установка зависимостей
pnpm install

# Запуск базы (через Supabase CLI или собственный Postgres)
# и Redis

cp .env.example .env
# заполни .env

# Генерация миграций
pnpm db:generate

# Запуск dev-серверов
pnpm dev
```

## Стек

- TypeScript (strict)
- Turborepo + pnpm
- Fastify + Grammy (Telegram бот)
- Next.js App Router + shadcn/ui (админка)
- Supabase (Postgres)
- Drizzle ORM
- BullMQ + Redis
- Zod
- Pino
- Docker
