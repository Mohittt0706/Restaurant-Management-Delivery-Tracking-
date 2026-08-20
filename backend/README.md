# CULT Backend

Node.js + Express + Prisma (PostgreSQL) backend for the CULT Restaurant Management & Delivery Tracking project.

## Structure

- `src/config/` – Prisma client singleton and env configuration
- `src/controllers/` – request handlers
- `src/routes/` – API route definitions
- `src/middleware/` – auth, role, validation, and error middleware
- `src/services/` – business logic and external integrations (payment, maps, weather, invoice)
- `src/utils/` – shared helpers and constants
- `src/validators/` – request validation schemas
- `prisma/` – Prisma schema and database seed script

## Roles

- `ADMIN` – admin dashboard
- `KITCHEN` – kitchen dashboard
- `DELIVERY` – delivery dashboard
- `CUSTOMER` – customer app

## Prisma

Prisma is the only ORM. All models live exclusively in `prisma/schema.prisma` (to be added).

## Setup

Prisma schema, seed, and API implementation to be added in upcoming steps.