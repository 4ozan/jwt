# JWT Authentication API

A TypeScript-based JWT authentication API built with Express, Drizzle ORM, and PostgreSQL.

## Features

- User registration and authentication
- JWT token-based authentication
- Password hashing with bcrypt
- PostgreSQL database with Drizzle ORM
- Input validation with Zod
- TypeScript for type safety

## Tech Stack

- **Runtime**: Bun
- **Framework**: Express.js
- **Database**: PostgreSQL
- **ORM**: Drizzle ORM
- **Authentication**: JWT + bcrypt
- **Validation**: Zod
- **Language**: TypeScript

## Installation

```bash
bun install
```

## Environment Setup

Copy `.env.example` to `.env` and configure your database connection:

```bash
cp .env.example .env
```

## Database Setup

Run database migrations:

```bash
bun run drizzle-kit migrate
```

## Running the Server

```bash
bun run index.ts
```

The server will start on `http://localhost:3000`

## API Endpoints

### Base URL
```
http://localhost:3000
```

### Health Check

#### GET `/`
Check if the server is running.

**Response:**
```json
"server started"
```

### Authentication Endpoints

#### POST `/auth/signup`
Register a new user account.

**Request Body:**
```json
{
  "name": "string",
  "email": "string",
  "password": "string"
}
```

**Response:**
```json
{
  "message": "user successfully created",
  "token": "jwt_token_here"
}
```

**Status Codes:**
- `201` - User created successfully
- `400` - Invalid input data
- `409` - Email already exists

#### POST `/auth/login`
Authenticate an existing user.

**Request Body:**
```json
{
  "email": "string",
  "password": "string"
}
```

**Response:**
```json
{
  "message": "Login successful",
  "token": "jwt_token_here",
  "user": {
    "id": "number",
    "name": "string",
    "email": "string"
  }
}
```

**Status Codes:**
- `200` - Login successful
- `400` - Invalid input data
- `401` - Invalid credentials
- `404` - User not found

### Protected Endpoints

For protected endpoints, include the JWT token in the Authorization header:

```
Authorization: Bearer <your_jwt_token>
```

#### GET `/auth/profile`
Get current user profile (protected route).

**Headers:**
```
Authorization: Bearer <jwt_token>
```

**Response:**
```json
{
  "user": {
    "id": "number",
    "name": "string",
    "email": "string"
  }
}
```

**Status Codes:**
- `200` - Profile retrieved successfully
- `401` - Invalid or missing token
- `404` - User not found

## Database Schema

### Users Table
```sql
CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL UNIQUE,
  password VARCHAR(255) NOT NULL
);
```

## Error Responses

All error responses follow this format:

```json
{
  "error": "Error message",
  "details": "Additional error details (optional)"
}
```

## Example Usage

### Register a new user
```bash
curl -X POST http://localhost:3000/auth/signup \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John Doe",
    "email": "john@example.com",
    "password": "securepassword123"
  }'
```

### Login
```bash
curl -X POST http://localhost:3000/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "john@example.com",
    "password": "securepassword123"
  }'
```

### Access protected route
```bash
curl -X GET http://localhost:3000/auth/profile \
  -H "Authorization: Bearer <your_jwt_token>"
```

## Development

This project was created using `bun init` in bun v1.2.4. [Bun](https://bun.sh) is a fast all-in-one JavaScript runtime.

### Project Structure
```
├── auth/           # Authentication middleware
├── config/         # Configuration files
├── controllers/    # Route controllers
├── routes/         # API routes
├── src/
│   └── db/        # Database schema and connection
├── index.ts       # Main server file
└── package.json   # Dependencies
```
