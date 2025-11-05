# Task Manager — Full Stack Application

A full-stack **Task Management System** built with:
- **Backend:** Spring Boot (Java 21, Maven, PostgreSQL)
- **Frontend:** Angular 20
- **Database:** PostgreSQL

This app allows users to **create, read, update, and delete (CRUD)** tasks with **status management** (PENDING → TODO → IN_PROGRESS → COMPLETED) and rich UI components.

---

## Project Structure

```Directory structure:
└── ekanth-sai-p3_test/
    ├── backend/
    │   ├── mvnw
    │   ├── mvnw.cmd
    │   ├── pom.xml
    │   ├── src/
    │   │   ├── main/
    │   │   │   ├── java/
    │   │   │   │   └── com/
    │   │   │   │       └── example/
    │   │   │   │           └── demo/
    │   │   │   │               ├── DemoApplication.java
    │   │   │   │               ├── config/
    │   │   │   │               │   └── CorsConfig.java
    │   │   │   │               ├── controller/
    │   │   │   │               │   └── TaskController.java
    │   │   │   │               ├── dto/
    │   │   │   │               │   ├── StatusUpdateRequest.java
    │   │   │   │               │   ├── TaskRequest.java
    │   │   │   │               │   ├── TaskResponse.java
    │   │   │   │               │   └── TaskUpdateRequest.java
    │   │   │   │               ├── entity/
    │   │   │   │               │   └── Task.java
    │   │   │   │               ├── enums/
    │   │   │   │               │   └── TaskStatus.java
    │   │   │   │               ├── exception/
    │   │   │   │               │   ├── ErrorResponse.java
    │   │   │   │               │   ├── GlobalExceptionHandler.java
    │   │   │   │               │   ├── InvalidStatusTransitionException.java
    │   │   │   │               │   └── ResourceNotFoundException.java
    │   │   │   │               ├── repository/
    │   │   │   │               │   └── TaskRepository.java
    │   │   │   │               └── service/
    │   │   │   │                   ├── TaskService.java
    │   │   │   │                   └── TaskServiceImpl.java
    │   │   │   └── resources/
    │   │   │       └── application.properties
    │   │   └── test/
    │   │       └── java/
    │   │           └── com/
    │   │               └── example/
    │   │                   └── demo/
    │   │                       └── DemoApplicationTests.java
    │   └── .mvn/
    │       └── wrapper/
    │           └── maven-wrapper.properties
    └── frontend/
        ├── README.md
        ├── angular.json
        ├── package.json
        ├── tsconfig.app.json
        ├── tsconfig.json
        ├── tsconfig.spec.json
        ├── .editorconfig
        └── src/
            ├── index.html
            ├── main.ts
            ├── styles.css
            └── app/
                ├── app.config.ts
                ├── app.css
                ├── app.html
                ├── app.routes.ts
                ├── app.spec.ts
                ├── app.ts
                ├── components/
                │   ├── task-form/
                │   │   ├── task-form.css
                │   │   ├── task-form.html
                │   │   ├── task-form.spec.ts
                │   │   └── task-form.ts
                │   ├── task-item/
                │   │   ├── task-item.css
                │   │   ├── task-item.html
                │   │   ├── task-item.spec.ts
                │   │   └── task-item.ts
                │   └── task-list/
                │       ├── task-list.css
                │       ├── task-list.html
                │       ├── task-list.spec.ts
                │       └── task-list.ts
                ├── models/
                │   ├── task-status.ts
                │   └── task.ts
                └── services/
                    ├── task.service.ts
                    ├── task.spec.ts
                    └── task.ts
```
---

## Backend Setup (Spring Boot + PostgreSQL)

### 1 Prerequisites
- Java 21+
- Maven 3.9+
- PostgreSQL running locally (or Docker)
- Port `8081` available

### 2 Configure Database

Create a PostgreSQL database and user:

```sql
CREATE DATABASE todo_db;
CREATE USER todo_user WITH ENCRYPTED PASSWORD 'todo_password';
GRANT ALL PRIVILEGES ON DATABASE todo_db TO todo_user;
```

### 3 Verify application.properties
server.port=8081
spring.datasource.url=jdbc:postgresql://localhost:5432/todo_db
spring.datasource.username=todo_user
spring.datasource.password=todo_password
spring.jpa.hibernate.ddl-auto=update
spring.jpa.properties.hibernate.dialect=org.hibernate.dialect.PostgreSQLDialect

### 4 Run Backend
```bash
cd backend
./mvnw clean spring-boot:run
```

## Frontend Setup
### 1 Prerequisites 
- Node.js >= 18
- Angular CLI >= 20

### 2 Install Dependencies 
```bash
cd frontend
npm install
```

### 3 Start Development Server
```bash
npm start
```