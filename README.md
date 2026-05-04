# Team Task Manager

A production-ready full-stack task management app with Spring Boot REST APIs, JWT authentication, role-based access control, React + Vite, Tailwind CSS, and MySQL.

## Structure

```text
backend/   Spring Boot API for auth, projects, tasks, users
frontend/  React Vite app with Tailwind UI
```

## Backend Setup

Requirements: Java 17 and Maven.

```bash
cd backend
mvn spring-boot:run
```

Environment variables:

```env
MYSQL_URL=jdbc:mysql://tramway.proxy.rlwy.net:33665/railway
MYSQL_USER=root
MYSQL_PASSWORD=JjBsmlBrkChhvxvoYghUdrHgoroAeUyc
JWT_SECRET=replace-with-a-long-random-secret-at-least-32-chars
JWT_EXPIRATION_MS=86400000
CORS_ALLOWED_ORIGINS=http://localhost:5173,https://*.vercel.app
PORT=8080
```

The backend uses `server.port=${PORT:8080}` for Render dynamic ports.

## Frontend Setup

Requirements: Node.js 18+.

```bash
cd frontend
npm install
npm run dev
```

Create `frontend/.env`:

```env
VITE_API_BASE_URL=http://localhost:8080/api
```

For Vercel production:

```env
VITE_API_BASE_URL=https://your-backend.onrender.com/api
```

## API Endpoints

Auth:

```text
POST /api/auth/signup
POST /api/auth/login
```

Projects:

```text
POST /api/projects
GET /api/projects
POST /api/projects/{id}/members
```

Tasks:

```text
POST /api/tasks
GET /api/tasks?status=TODO&priority=HIGH&projectId=1
PUT /api/tasks/{id}
GET /api/tasks/overdue
```

Users:

```text
GET /api/users
```

## Role Rules

Admins can create projects, add members, create tasks, assign users, and view all project tasks.

Members can view their assigned tasks and update task status only. These checks are enforced in the Spring service layer, not only in the UI.

## Deployment

### Backend on Render

Use the included `backend/Dockerfile`, or connect the repo and point Render at the backend Dockerfile. Set:

```env
MYSQL_URL=jdbc:mysql://tramway.proxy.rlwy.net:33665/railway
MYSQL_USER=root
MYSQL_PASSWORD=JjBsmlBrkChhvxvoYghUdrHgoroAeUyc
JWT_SECRET=replace-with-a-long-random-production-secret
CORS_ALLOWED_ORIGINS=https://your-frontend.vercel.app,https://*.vercel.app
```

Do not use `mysql://` or `mysql.railway.internal`.

### Frontend on Vercel

Set the project root to `frontend`, build command to `npm run build`, output directory to `dist`, and configure:

```env
VITE_API_BASE_URL=https://your-backend.onrender.com/api
```

`frontend/vercel.json` rewrites routes to `index.html` for React Router.
