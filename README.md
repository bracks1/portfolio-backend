# Digital Business Card Backend API (Цифровая визитка специалиста)

[![TypeScript](https://img.shields.io/badge/TypeScript-5.x%20%7C%206.x-blue.svg)](https://www.typescriptlang.org/)
[![NestJS](https://img.shields.io/badge/NestJS-12.x-red.svg)](https://nestjs.com/)
[![GraphQL](https://img.shields.io/badge/GraphQL-Apollo%20Server-e10098.svg)](https://graphql.org/)
[![Prisma](https://img.shields.io/badge/Prisma%20ORM-7.x-2D3748.svg)](https://www.prisma.io/)
[![Docker](https://img.shields.io/badge/Docker-Multi--stage-2496ED.svg)](https://www.docker.com/)
[![Vercel](https://img.shields.io/badge/Deployed-Vercel-black.svg)](https://vercel.com/)
[![Vitest](https://img.shields.io/badge/Tested%20with-Vitest-729B1B.svg)](https://vitest.dev/)

Backend-приложение цифровой визитки разработчика (**Alisevich Stanislau**), разработанное по техническому заданию с использованием **NestJS**, **TypeScript**, **Prisma ORM**, **GraphQL (Apollo Server & Sandbox)** и **Docker**.

---

## 🌐 Ссылки на проект

- **Live Production URL (Apollo Sandbox / Playground)**: [https://portfolio-backend-eta-blond.vercel.app/graphql](https://portfolio-backend-eta-blond.vercel.app/graphql)
- **Production API Health endpoint**: [https://portfolio-backend-eta-blond.vercel.app/](https://portfolio-backend-eta-blond.vercel.app/)
- **GitHub Repository**: [https://github.com/bracks1/portfolio-backend](https://github.com/bracks1/portfolio-backend)

---

## 🚀 Стек технологий

| Технология | Назначение |
|---|---|
| **TypeScript (v6)** | Строгая типизация моделей, DTO и сервисов |
| **Node.js (v22)** | Серверная среда выполнения |
| **NestJS (v12)** | Модульный корпоративный фреймворк архитектуры бэкенда |
| **Prisma ORM (v7)** | Современный ORM для типизированной работы с базой данных |
| **GraphQL / Apollo Server** | Code-first GraphQL API со встроенным интерактивным Apollo Sandbox |
| **DataLoader** | Пакетная загрузка и кэширование вложенных сущностей (защита от N+1) |
| **SQLite / PostgreSQL** | Хранилище данных с автоматическим созданием схемы и сидингом |
| **Docker & Docker Compose** | Мультистейдж-сборка и изолированный запуск сервиса |
| **Vitest & Supertest** | Высокоскоростные модульные и сквозные (E2E) автотесты |
| **Vercel Serverless** | Продакшн-развертывание серверлесс API |

---

## 🏛 Архитектура и инженерные решения

### 1. Разделение ответственности (Separation of Concerns)
Архитектура приложения построена по модульному принципу:
```
src/
├── app.module.ts              # Корневой модуль: конфигурация Config, GraphQL и доменных модулей
├── main.ts                    # Bootstrap: валидация, CORS, хуки жизненного цикла
├── common/
│   └── dataloader/            # Request-scoped DataLoader для батчинга вложенных выборок
├── database/
│   ├── prisma.service.ts      # Инкапсуляция подключения PrismaClient и хуков завершения
│   ├── prisma.module.ts       # Глобальный модуль базы данных
│   └── seed/
│       ├── seed.data.ts       # Достоверные структурированные данные профиля
│       └── seed.service.ts    # Автоматическая инициализация БД на старте (OnApplicationBootstrap)
└── modules/
    ├── profile/               # Модуль профиля (ProfileResolver, ProfileService, модели)
    ├── skills/                # Модуль навыков (SkillsResolver, SkillsService, модели)
    ├── experience/            # Модуль опыта работы (ExperienceResolver, ExperienceService, модели)
    └── projects/              # Модуль проектов (ProjectsResolver, ProjectsService, модели)
```

### 2. Решение проблемы N+1 запросов в GraphQL (DataLoader)
При запросах вложенных сущностей (`profile { skills { ... } experience { ... } projects { ... } }`) резолверы вызывают `DataloaderService`:
- Сервис имеет область видимости **`Scope.REQUEST`**, что обеспечивает изоляцию кэша между разными HTTP-запросами.
- Идентификаторы профилей агрегируются и запрашиваются из БД одним SQL-запросом с оператором `IN (...)`.
- Резолверы полей `@ResolveField()` вызываются только при фактическом запросе клиентом соответствующих полей, исключая избыточную выборку.

### 3. Автоматическая подготовка и сидинг базы данных
При старте приложения (`OnApplicationBootstrap`) сервис `SeedService`:
1. Проверяет наличие профиля в базе данных (`prisma.profile.count()`).
2. Если база пуста — запускается атомарная транзакция (`prisma.$transaction`), заполняющая профиль, ссылки, навыки, опыт работы с достижениями и проекты.
3. Если данные уже существуют — повторный сидинг пропускается, исключая дублирование.

---

## 📋 Примеры GraphQL-запросов

Вы можете протестировать эти запросы прямо в интерактивном **Apollo Sandbox** по адресу:
👉 **[https://portfolio-backend-eta-blond.vercel.app/graphql](https://portfolio-backend-eta-blond.vercel.app/graphql)**

### 1. Основной запрос из технического задания:
```graphql
query GetProfileSummary {
  profile {
    name
    description
    skills {
      name
    }
    experience {
      company
      position
    }
    projects {
      name
    }
  }
}
```

### 2. Полный запрос профиля со всеми связями:
```graphql
query GetFullProfile {
  profile {
    id
    name
    title
    description
    email
    location
    links {
      platform
      url
    }
    skills {
      id
      name
      category
    }
    experience {
      id
      company
      position
      period
      achievements
    }
    projects {
      id
      name
      description
      url
      technologies
    }
  }
}
```

### 3. Отдельные запросы сущностей:
```graphql
query GetIndividualEntities {
  skills(category: "Programming Languages") {
    name
    category
  }
  experience {
    company
    position
    period
    achievements
  }
  projects {
    name
    description
    url
    technologies
  }
}
```

---

## 🛠 Запуск проекта

### Вариант 1. Запуск через Docker (рекомендуемый для локального тестирования)
```bash
# Клонирование репозитория
git clone https://github.com/bracks1/portfolio-backend.git
cd portfolio-backend

# Сборка и запуск контейнера
docker compose up --build
```
После запуска Apollo Sandbox будет доступен по адресу: **`http://localhost:3000/graphql`**.

---

### Вариант 2. Локальный запуск через Node.js
```bash
# Установка зависимостей
npm install

# Генерация Prisma Client и применение схемы БД
npx prisma generate
npx prisma db push

# Запуск в режиме разработки
npm run start:dev
```

---

## 🧪 Автоматическое тестирование

В проект включен полный набор модульных (Unit) и сквозных (E2E) тестов на фреймворке **Vitest**:

```bash
# Запуск модульных тестов (Unit tests: сервисы и резолверы)
npm run test

# Запуск интеграционных E2E-тестов (E2E GraphQL queries)
npm run test:e2e
```

### Результаты тестирования:
- **Unit тесты**: 6 тестовых наборов, 20 тестов успешно пройдено.
- **E2E тесты**: проверка HTTP статус-кодов, соответствия GraphQL спецификации ТЗ, вложенных связей и фильтрации.

---

## 👨‍💻 Об авторе

- **Специалист**: Alisevich Stanislau
- **Роль**: Full-Stack & Backend Engineer (Node.js, TypeScript, Python)
- **GitHub**: [@bracks1](https://github.com/bracks1)
- **Email**: alisevics558@gmail.com
