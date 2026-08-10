# Student Management System

💡 Why I Built This

This project started as a way to understand how a real full-stack application fits together — from React UI → REST APIs → authentication → business logic → database.

Rather than trying to build everything at once, the project is designed to grow feature by feature while keeping the architecture clean and understandable.

Made with ☕, curiosity & a little aesthetic energy ✨

Aliza Qadri


## Run the backend

```bash
cd backend
mvn spring-boot:run
```

Runs on `http://localhost:8080`. Config is in `src/main/resources/application.yml` —
Mongo URI, JWT secret, JWT expiry, and allowed CORS origin all live there.

**Before doing anything else in production**, change `app.jwt.secret` to a real random
value and move it out of the committed file (environment variable or secrets manager).

##  Run the frontend

```bash
cd frontend
npm install
npm run dev
```

Runs on `http://localhost:5173`. `.env` has `VITE_API_BASE_URL` pointing at the backend.


Planned improvements:

Swagger / OpenAPI documentation
JUnit & integration testing
Docker Compose
GitHub Actions CI
Redis caching
Attendance and grading
Refresh tokens
File uploads
Elasticsearch-based search
WebSocket-based live updates

The goal is to gradually evolve the project from a learning application into a more production-oriented system.

