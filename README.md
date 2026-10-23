# PawFind — Pet Adoption Platform

Full-stack pet adoption platform (Java Spring Boot + React). Built in phases to keep each
working session focused and self-contained.

## Stack
- **Backend:** Java 21, Spring Boot 3.3, Spring Security, Spring Data JPA/Hibernate, JWT, Java Mail Sender, Maven
- **Frontend:** React (Vite), React Router, Tailwind CSS, Axios, React Hook Form, Leaflet, React Signature Canvas
- **DB:** MySQL
- **Cloud:** Cloudinary (images), OpenPDF (agreement/certificate PDFs)

## Project Structure
```
pawfind/
├── backend/     Spring Boot app (clean layering: entity → repository → service → controller)
└── frontend/    React (Vite) app
```

## Local Setup

### Backend
1. Create a MySQL database (or let `application.yml`'s `createDatabaseIfNotExist=true` do it).
2. Set env vars (or edit `application.yml` directly): `DB_USERNAME`, `DB_PASSWORD`,
   `MAIL_USERNAME`, `MAIL_PASSWORD`, `JWT_SECRET`, `CLOUDINARY_CLOUD_NAME`,
   `CLOUDINARY_API_KEY`, `CLOUDINARY_API_SECRET`.
3. `cd backend && ./mvnw spring-boot:run` (or `mvn spring-boot:run` if you don't have the wrapper yet).
4. Runs on `http://localhost:8080`.

### Frontend
1. `cd frontend && npm install`
2. `npm run dev`
3. Runs on `http://localhost:5173` (Vite dev server proxies `/api` calls to the backend).

Hibernate is set to `ddl-auto: update`, so tables are created/updated automatically from these
entities on app startup — no manual SQL needed for now.
