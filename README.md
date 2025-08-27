# 🏫 School Management API

A robust RESTful API built with Express.js, TypeScript, PostgreSQL, and Prisma for managing school operations including students, classes, and user authentication.

## ✨ Features

### Core Functionality

- **JWT Authentication** with access & refresh tokens
- **Role-based Authorization** (Admin, Teacher, Student)
- **Student Management** - CRUD operations with role-based access
- **Class Management** - Create classes and enroll students
- **Data Validation** using DTOs with class-validator
- **Pagination** for large datasets
- **Error Handling** with standardized responses

### Security Features

- Password hashing with bcryptjs
- JWT token-based authentication
- Role-based route protection

### Developer Experience

- Full TypeScript implementation
- Prisma ORM with type safety
- Database seeding scripts
- Comprehensive error handling
- API documentation ready

## 🛠 Tech Stack

- **Backend**: Express.js with TypeScript
- **Database**: PostgreSQL
- **ORM**: Prisma
- **Authentication**: JWT (JSON Web Tokens)
- **Validation**: class-validator & class-transformer
- **Security**: bcryptjs, helmet, cors
- **Containerization**: Docker & Docker Compose
- **Development**: nodemon, ts-node

## 🚀 Getting Started

### Prerequisites

- Node.js (v16 or higher)
- PostgreSQL (v12 or higher)
- npm or pnpm

### Installation

1. **Clone the repository**

   ```bash
   git clone <repository-url>
   cd school-management-api
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Set up environment variables**

   ```bash
   cp .env.example .env
   ```

   Update `.env` with your database credentials:

   ```env
   DATABASE_URL="postgresql://username:password@localhost:5432/school_management"
   JWT_SECRET="your-super-secret-jwt-key-change-in-production"
   JWT_REFRESH_SECRET="your-super-secret-refresh-key-change-in-production"
   PORT=3000
   ```

4. **Set up the database**

   ```bash
   # Generate Prisma client
   npx prisma generate

   # Push schema to database
   npx prisma db push

   ```

5. **Start the development server**
   ```bash
   npm run dev
   ```

The API will be available at `http://localhost:3000`

## 📊 Database Schema

### Users Table

- `id` (String, Primary Key)
- `name` (String)
- `email` (String, Unique)
- `password_hash` (String)
- `role` (Enum: ADMIN, TEACHER, STUDENT)
- `created_at`, `updated_at` (DateTime)

### Students Table

- `id` (String, Primary Key)
- `name` (String)
- `age` (Integer)
- `user_id` (String, Foreign Key → Users)
- `class_id` (String, Optional, Foreign Key → Classes)

### Classes Table

- `id` (String, Primary Key)
- `name` (String)
- `section` (String)
- Unique constraint on (name, section)

### Relationships

- User ↔ Student (One-to-One)
- Class ↔ Students (One-to-Many)

## 🔐 Authentication

### User Roles

- **ADMIN**: Full access to all resources
- **TEACHER**: Can view students and manage class enrollments
- **STUDENT**: Can only view their own information

### Token System

- **Access Token**: Short-lived (15 minutes) for API requests
- **Refresh Token**: Long-lived (7 days) for token renewal

### Authorization Headers

```
Authorization: Bearer <access_token>
```

## 🌐 API Endpoints

### Authentication Endpoints

#### Sign Up

```http
POST /api/auth/register
Content-Type: application/json

{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123",
  "role": "student"
}
```

#### Login

```http
POST /api/auth/login
Content-Type: application/json

{
  "email": "john@example.com",
  "password": "password123"
}
```

**Response:**

```json
{
  "accessToken": "jwt-access-token",
  "refreshToken": "jwt-refresh-token"
}
```

### Student Endpoints

#### Create Student (Admin Only)

```http
POST /api/students
Authorization: Bearer <admin-token>
Content-Type: application/json

{
  "name": "Alice Johnson",
  "age": 16,
  "classId": "class-id-optional"
}
```

#### Get All Students (Admin/Teacher)

```http
GET /api/students?page=1&limit=10
Authorization: Bearer <token>
```

**Response:**

```json
{
  "students": [
    {
      "id": "student-id",
      "name": "Alice Johnson",
      "age": 16,
      "userId": "user-id",
      "classId": "class-id",
      "class": {
        "id": "class-id",
        "name": "Mathematics",
        "section": "A"
      },
      "user": {
        "id": "user-id",
        "name": "Alice Johnson",
        "email": "alice.johnson@school.edu",
        "role": "STUDENT"
      }
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 10,
    "total": 25,
    "totalPages": 3
  }
}
```

#### Get Student Details

```http
GET /api/students/:id
Authorization: Bearer <token>
```

### Class Endpoints

#### Create Class (Admin Only)

```http
POST /api/classes
Authorization: Bearer <admin-token>
Content-Type: application/json

{
  "name": "Mathematics",
  "section": "A"
}
```

#### Enroll Student in Class (Admin/Teacher)

```http
POST /api/classes/:classId/enroll
Authorization: Bearer <token>
Content-Type: application/json

{
  "studentId": "student-id"
}
```

#### Get Students of a Class (Admin/Teacher)

```http
GET /api/classes/:classId/students
Authorization: Bearer <token>
```

## 🔧 Development Scripts

```bash
# Development
npm run dev          # Start development server with hot reload
npm run build        # Build TypeScript to JavaScript
npm start            # Start production server

# Database
npm run db:generate  # Generate Prisma client
npm run db:push      # Push schema changes to database
```

## 🚀 Deployment

### Environment Variables for Production

```env
DATABASE_URL="your-production-database-url"
JWT_SECRET="your-strong-jwt-secret"
JWT_REFRESH_SECRET="your-strong-refresh-secret"
PORT=3000
NODE_ENV=production
```

### Build for Production

```bash
npm run build
npm start
```

---
