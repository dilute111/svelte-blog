# Svelte Blog

Блог на SvelteKit с PostgreSQL.

## Запуск проекта

### 1. Запусти Docker (PostgreSQL)

```bash
docker run -d --name svelte-blog-db \
-e POSTGRES_PASSWORD=password \
-e POSTGRES_DB=svelte_blog \
-p 5432:5432 postgres
```
### 2. Создай таблицу

Сначала подключись к базе данных:

```bash
docker exec -it svelte-blog-db psql -U postgres -d svelte_blog
```
После подключения (появится приглашение svelte_blog=#), выполни:

```bash (sql)
CREATE TABLE IF NOT EXISTS posts (
id SERIAL PRIMARY KEY,
title VARCHAR(255) NOT NULL,
body TEXT NOT NULL,
user_id INTEGER NOT NULL,
created_at TIMESTAMP DEFAULT NOW()
);
```
### 3. Запусти проект

```bash
npm install
npm run dev
```
Проект будет доступен на http://localhost:5173

## Структура

src/lib/server/db/db.ts - подключение к PostgreSQL

src/lib/server/repo/postsRepo.ts - репозиторий

src/lib/server/services/postsService.ts - сервис

src/lib/__tests__/ - тесты

## Технологии

- SvelteKit
- PostgreSQL
- Zod (валидация)