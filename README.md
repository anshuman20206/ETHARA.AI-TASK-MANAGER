# Team Task Manager (Full-Stack)

A full-stack web application designed to help teams manage projects, assign tasks, and track progress with role-based access control.

This project demonstrates practical full-stack development skills including backend architecture, authentication, database design, and a clean, responsive frontend.

---

## Live Demo

Frontend (Vercel): https://ethara-ai-task-manager-one.vercel.app
Backend (Render): https://ethara-ai-task-manager.onrender.com

---

## Features

### Authentication and Authorization

* Secure signup and login system
* JWT-based authentication
* Role-based access:

  * Admin: can manage projects and tasks
  * Member: can view and update assigned tasks

---

### Project Management

* Create and manage projects
* Add or remove team members
* View all projects associated with a user

---

### Task Management

* Create tasks within projects
* Assign tasks to users
* Update task status:

  * TODO
  * IN_PROGRESS
  * DONE
* Set task priority:

  * LOW
  * MEDIUM
  * HIGH
* Set due dates
* Filter and sort tasks
* Highlight overdue tasks

---

### Dashboard

* Overview of:

  * Total tasks
  * Completed tasks
  * Pending tasks
  * Overdue tasks
* Recent tasks display for quick tracking

---

## Tech Stack

### Backend

* Java Spring Boot
* Spring Security with JWT
* JPA / Hibernate
* MySQL (Railway)

### Frontend

* React (Vite)
* Tailwind CSS
* Axios
* React Router

### Deployment

* Backend: Render
* Frontend: Vercel
* Database: Railway MySQL

---

## Project Structure

```
team-task-manager/
│
├── backend/
│   ├── controller/
│   ├── service/
│   ├── repository/
│   ├── entity/
│   ├── dto/
│   ├── config/
│   └── security/
│
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── services/
│   │   ├── routes/
│   │   └── utils/
│   └── public/
│
└── README.md
```

---

## Environment Variables

### Backend (Render)

```
MYSQL_URL=jdbc:mysql://tramway.proxy.rlwy.net:33665/railway
MYSQL_USER=root
MYSQL_PASSWORD=your_password
JWT_SECRET=your_secret_key
PORT=8080
```

In `application.properties`:

```
spring.datasource.url=${MYSQL_URL}
spring.datasource.username=${MYSQL_USER}
spring.datasource.password=${MYSQL_PASSWORD}

spring.jpa.hibernate.ddl-auto=update
spring.jpa.show-sql=true
server.port=${PORT:8080}
```

---

### Frontend (Vercel)

```
VITE_API_BASE_URL=https://ethara-ai-task-manager.onrender.com/api
```

---

## Installation and Setup

### Backend

1. Navigate to backend folder:

```
cd backend
```

2. Build and run:

```
mvn clean install
mvn spring-boot:run
```

---

### Frontend

1. Navigate to frontend folder:

```
cd frontend
```

2. Install dependencies:

```
npm install
```

3. Start development server:

```
npm run dev
```

---

## API Endpoints

### Authentication

* POST /api/auth/signup
* POST /api/auth/login

### Projects

* POST /api/projects
* GET /api/projects
* POST /api/projects/{id}/members

### Tasks

* POST /api/tasks
* GET /api/tasks
* PUT /api/tasks/{id}
* GET /api/tasks/overdue

---

## Deployment

### Backend (Render)

* Connected via GitHub repository
* Environment variables configured for database and JWT
* Runs on dynamic port assigned by Render

### Frontend (Vercel)

* Connected via GitHub repository
* Uses environment variable for API base URL
* Built using Vite and deployed as static assets

---

## Key Highlights

* Clean and modular backend architecture
* Secure authentication using JWT
* Proper relational database design
* Role-based access control enforced on backend
* Responsive and modern UI using Tailwind CSS
* Fully deployed and accessible online

---

## Future Improvements

* Notifications for deadlines
* Email integration
* File attachments in tasks
* Activity logs for projects
* Pagination and search optimization

---

## Author

Anshuman Singh
B.Tech Student | Full Stack Developer

---
