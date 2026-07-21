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

## Phase Roadmap

| Phase | Status | Scope |
|---|---|---|
| 1 | ✅ Done | Project setup, folder structure, DB schema, JPA entities & repositories |
| 2 | ⬜ Next | Core auth — register/login, JWT, BCrypt |
| 3 | ⬜ | Email OTP verification + forgot password |
| 4 | ⬜ | NGO registration + admin approval workflow |
| 5 | ⬜ | Pet CRUD (NGO side) + Cloudinary image upload |
| 6 | ⬜ | Pet browsing, search & filters |
| 7 | ⬜ | Map integration (Leaflet, nearby pets/NGOs) |
| 8 | ⬜ | Pet details page + public Q&A |
| 9 | ⬜ | Favourites |
| 10 | ⬜ | Adoption application submission + NGO review |
| 11 | ⬜ | Digital signature + adoption agreement PDF |
| 12 | ⬜ | Adoption certificate PDF generation |
| 13 | ⬜ | Success stories |
| 14 | ⬜ | Dashboards — NGO, Adopter, Admin |
| 15 | ⬜ | Homepage + UI/UX polish, responsiveness |
| 16 | ⬜ | Security hardening, validation, exception handling, deployment prep |

To continue in a new conversation: mention "PawFind Phase X" and paste the relevant row above —
no need to re-paste the full original spec.

## Entities (Phase 1)
`User`, `Otp`, `Ngo`, `Pet`, `PetImage`, `Question`, `Application`, `Certificate`,
`SuccessStory`, `Favorite` — all under `backend/src/main/java/com/pawfind/entity`,
with enums (`Role`, `Gender`, `PetStatus`, `ApplicationStatus`) in `entity/enums`.

Hibernate is set to `ddl-auto: update`, so tables are created/updated automatically from these
entities on app startup — no manual SQL needed for now.
