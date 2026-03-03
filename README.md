# Build an LMS Platform: Next.js 13, React, PhonePe, UploadThing, Prisma, MySQL

![Copy of Copy of Copy of Copy of Fullstack Twitter Clone (9)](https://github.com/AntonioErdeljac/next13-lms-platform/assets/23248726/fa077fca-bb74-419a-84de-54ac103bb026)


This is a repository for Build an LMS Platform: Next.js 13, React, PhonePe, UploadThing, Prisma, Tailwind, and MySQL.

[VIDEO TUTORIAL](https://www.youtube.com/watch?v=Big_aFLmekI)

Key Features:

- Browse & Filter Courses
- Purchase Courses using PhonePe
- Mark Chapters as Completed or Uncompleted
- Progress Calculation of each Course
- Student Dashboard
- Teacher mode
- Create new Courses
- Create new Chapters
- Easily reorder chapter position with drag n’ drop
- Upload thumbnails and attachments using UploadThing
- YouTube video playback for chapters
- Rich text editor for chapter description
- Authentication using Clerk
- ORM using Prisma
- PostgreSQL database using Neon

### Prerequisites

**Node version 18.x.x**

### Cloning the repository

```shell
git clone https://github.com/AntonioErdeljac/next13-lms-platform.git
```

### Install packages

```shell
npm i
```

### Setup .env file


```js
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=
CLERK_SECRET_KEY=
NEXT_PUBLIC_CLERK_SIGN_IN_URL=
NEXT_PUBLIC_CLERK_SIGN_UP_URL=
NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL=
NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL=

DATABASE_URL=
DATABASE_URL_DEV=
DIRECT_URL=

UPLOADTHING_TOKEN=

PHONEPE_CLIENT_ID=
PHONEPE_CLIENT_SECRET=
PHONEPE_CLIENT_VERSION=1
PHONEPE_BASE_URL=https://api-preprod.phonepe.com/apis/pg-sandbox
PHONEPE_AUTH_URL=https://api-preprod.phonepe.com/apis/pg-sandbox/v1/oauth/token
NEXT_PUBLIC_APP_URL=http://localhost:3000

NEXT_PUBLIC_TEACHER_ID=
```

### PhonePe Setup (Sandbox, required for Enroll button)

1. Create a PhonePe PG merchant account and complete business onboarding in PhonePe Business.
2. In PhonePe Business dashboard, go to Developer settings and create sandbox credentials.
2. Set these in `.env`:
   - `PHONEPE_CLIENT_ID`
   - `PHONEPE_CLIENT_SECRET`
   - `PHONEPE_CLIENT_VERSION` (usually `1`)
   - `PHONEPE_BASE_URL=https://api-preprod.phonepe.com/apis/pg-sandbox`
   - `PHONEPE_AUTH_URL=https://api-preprod.phonepe.com/apis/pg-sandbox/v1/oauth/token`
3. Keep `NEXT_PUBLIC_APP_URL=http://localhost:3000` for local development.
4. Restart `npm run dev` after updating environment variables.

Without these variables, checkout requests will fail and enrollment will not complete.

### Local Dev Database (Recommended for faster localhost UX)

If your cloud database adds latency during development, set `DATABASE_URL_DEV` to a local MySQL/TiDB instance.  
When `NODE_ENV=development`, the app will prefer `DATABASE_URL_DEV` over `DATABASE_URL`.

### Setup Prisma (Neon PostgreSQL)

Add a Neon PostgreSQL database and set:
- `DATABASE_URL`: pooled connection string
- `DIRECT_URL`: direct (non-pooled) connection string for migrations

```shell
npx prisma migrate dev --name init_postgres
npx prisma generate
npm run db:seed

```

### Start the app

```shell
npm run dev
```

## Available commands

Running commands with npm `npm run [command]`

| command         | description                              |
| :-------------- | :--------------------------------------- |
| `dev`           | Starts a development instance of the app |
| `db:migrate`    | Runs Prisma migrations                   |
| `db:seed`       | Seeds baseline categories                |
