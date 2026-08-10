# Student Management System

Spring Boot + MongoDB backend, React (Vite) frontend, JWT auth with role-based access
(ADMIN / TEACHER / STUDENT). Built as a layered, scalable starting point — see "Where
to go next" at the bottom for how to grow it.

```
sms/
├── backend/     Spring Boot API (Java 21, Maven)
├── frontend/    React + Vite SPA
└── init-mongo.js   mongosh script to create collections + indexes
```

## 1. Set up MongoDB (collections)

You said MongoDB is already running locally. Create the database and collections:

```bash
mongosh < init-mongo.js
```

This creates `sms_db` with three collections — `users`, `students`, `courses` — each
with schema validation and indexes (unique email/username/course code, etc). You don't
strictly need this: Spring Data MongoDB will auto-create collections on first save. But
running it first means indexes and validation exist from day one, which matters once
you have real data volume.

Useful commands to know your way around the collections afterward:

```bash
mongosh
> use sms_db
> show collections
> db.students.find().pretty()
> db.students.countDocuments()
> db.users.find({}, { password: 0 })   # hide password hashes
> db.students.createIndex({ email: 1 }, { unique: true })   # already done by the script
```

## 2. Run the backend

```bash
cd backend
mvn spring-boot:run
```

Runs on `http://localhost:8080`. Config is in `src/main/resources/application.yml` —
Mongo URI, JWT secret, JWT expiry, and allowed CORS origin all live there.

**Before doing anything else in production**, change `app.jwt.secret` to a real random
value and move it out of the committed file (environment variable or secrets manager).

## 3. Run the frontend

```bash
cd frontend
npm install
npm run dev
```

Runs on `http://localhost:5173`. `.env` has `VITE_API_BASE_URL` pointing at the backend.

## 4. Try it out

1. Go to `http://localhost:5173/register`, create an account (pick a role — try ADMIN
   first so you can do everything).
2. You're logged in immediately (register returns a token, same as login).
3. Go to **Courses**, add a course or two.
4. Go to **Students**, add a student and enroll them in a course.
5. Log out, register a second account as STUDENT — notice the Delete buttons disappear
   (only ADMIN can delete; see `SecurityConfig.java`).

## How the pieces fit together

**Backend — layered architecture:**
```
Controller  → HTTP in/out, validation triggers, status codes
Service     → business rules (uniqueness checks, enrollment logic)
Repository  → MongoRepository interfaces, no hand-written queries needed
Model       → @Document classes, one per Mongo collection
DTO         → request/response shapes, decoupled from the DB model
Security    → JWT filter + Spring Security filter chain, stateless
Exception   → @RestControllerAdvice turns exceptions into consistent JSON errors
```
This separation is what makes it scalable later: you can swap MongoDB for another
store, add gRPC or GraphQL alongside REST, or split services out — without rewriting
controllers, because nothing outside the repository layer knows it's Mongo.

**Auth flow:** `/api/auth/register` and `/api/auth/login` are the only public endpoints.
Everything else requires `Authorization: Bearer <token>`. `JwtAuthFilter` runs once per
request, reads the token, and populates Spring Security's context — from there, normal
Spring Security role checks (`hasRole`, `@PreAuthorize`) apply. Role rules currently:
GET → any logged-in role, POST/PUT → ADMIN or TEACHER, DELETE → ADMIN only.

**Frontend:** `AuthContext` holds the logged-in user and token (in `localStorage`) and
exposes `login`, `register`, `logout`, `hasRole`. `axiosClient` attaches the token to
every request automatically and redirects to `/login` on a 401. `ProtectedRoute` guards
pages; pass `requireRole="ADMIN"` to lock a route to a role.

## Where to go next (roughly in order of learning value)

**Solidify what's here**
- Write tests: `@DataMongoTest` for repositories, `@WebMvcTest` for controllers,
  `MockMvc` for full request/response cycles. You have zero tests right now — that's
  the single highest-value next step.
- Add **Swagger/OpenAPI** (`springdoc-openapi-starter-webmvc-ui`) so you get interactive
  API docs at `/swagger-ui.html` instead of testing everything through the frontend.
- Add **pagination + sorting** to the courses endpoint too (students already has it).
- Add **DTO validation edge cases**: duplicate enrollment, deleting a course that still
  has enrolled students (currently allowed — decide if it should cascade or block).

**Grow the domain**
- **Attendance** — a new `Attendance` collection keyed by `studentId + courseId + date`.
- **Grades / transcripts** — `Grade` collection, plus a computed GPA endpoint.
- **File uploads** — student photos or ID cards via `GridFS` (Mongo's file storage) or
  S3-compatible storage; good intro to handling multipart requests in Spring.
- **Refresh tokens** — right now tokens just expire and force re-login. Add a refresh
  token flow so sessions can extend without re-entering a password.

**Make it feel production-grade**
- **Docker Compose** — one file running Mongo + backend + frontend together. Natural
  next step once you're comfortable with the manual run.
- **CI** — GitHub Actions running `mvn test` and `npm run build` on every push.
- **Rate limiting** on `/api/auth/login` (brute-force protection) — try Bucket4j.
- **Structured logging + request IDs**, so you can trace a request across layers.
- **Caching** — Redis in front of course lookups (courses change rarely, read often) —
  a good intro to cache invalidation problems.

**Scale-oriented (further out, but worth knowing the shape of)**
- Split into services once one part outgrows the rest (e.g. a notifications service).
- Add **React Query** on the frontend instead of manual `useEffect` fetching — better
  caching, retries, and background refresh for free.
- Convert the frontend to **TypeScript** — this codebase is a good size to practice on.
- **Elasticsearch** if free-text search across students/courses needs to get serious.
- **WebSockets** for live updates (e.g. a teacher sees enrollment changes in real time).

Pick based on what you're trying to learn — testing and Swagger are the best return on
time right now; Docker and CI are the best "make this feel like a real job" next steps.
