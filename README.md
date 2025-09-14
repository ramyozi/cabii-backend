# Cabii Backend

The **Cabii Backend** is the core API service powering the Cabii platform.  
It is built with [NestJS](https://nestjs.com/) and [TypeORM](https://typeorm.io/) for robust, scalable, and maintainable server-side development.

---

## Features
- **NestJS (TypeScript)** for modular and maintainable architecture
- **TypeORM** for database interactions and migrations
- **PostgreSQL** as the primary database (configurable via `.env`)
- **Authentication & Authorization** (JWT-based)
- **Scalable project structure** for microservices or monolith use
- **Yarn** as the package manager
- **Testing setup** (Jest: unit & e2e)

---
## Project setup

```bash
$ yarn install
```

## Compile and run the project

```bash
# development
$ yarn run start

# watch mode
$ yarn run start:dev

# production mode
$ yarn run start:prod
```

## Run tests

```bash
# unit tests
$ yarn run test

# e2e tests
$ yarn run test:e2e

# test coverage
$ yarn run test:cov
```