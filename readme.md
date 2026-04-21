# Authify => (Advanced JWT Authentication & Session Management System)

A powerful **secure authentication system** built using **Node.js, Express, and MongoDB**, implementing **Access & Refresh Token architecture** with **session management, token rotation, and multi-device control**.

This project demonstrates how modern backend systems handle **secure authentication, session tracking, and scalable user management** using industry best practices.

---

## Overview =>

Authify is a backend system designed to simulate a **production-grade authentication service** used in real-world applications.

It leverages :-

* **JWT (JSON Web Tokens)** for stateless authentication
* **Refresh Token Rotation** for secure session lifecycle
* **MongoDB (Mongoose)** for persistent session storage
* **HTTP-only Cookies** for secure token handling
* **Express.js** for scalable API architecture

It solves a key problem in backend systems :-

> *Managing secure authentication across multiple devices while preventing token misuse*

Authify ensures **secure, scalable, and production-ready authentication flows**.

---

## Features =>

* JWT-based authentication (Access + Refresh Tokens)
* Secure cookie-based session handling
* Refresh token rotation (prevents replay attacks)
* Session storage with IP & User-Agent tracking
* Logout from current device
* Logout from all devices
* Hashed refresh tokens in database
* Modular backend architecture
* Scalable and secure design

---

## Project Architecture =>

```
Client (Browser / Postman)
        ↓
HTTP Request (Auth APIs)
        ↓
Express Server
        ↓
Routes → Controller
        ↓
Authentication Logic
        ↓
JWT Generation (Access + Refresh)
        ↓
MongoDB (User + Session Storage)
        ↓
Cookie Handling (HTTP-only)
        ↓
Response (Access Token + Status)
```

---

## Tech Stack =>

| Technology     | Purpose                   |
| -------------- | ------------------------- |
| Node.js        | Runtime environment       |
| Express.js     | Backend framework         |
| MongoDB        | Database                  |
| Mongoose       | ODM for MongoDB           |
| JSON Web Token | Authentication mechanism  |
| cookie-parser  | Cookie handling           |
| Morgan         | Request logging           |
| dotenv         | Environment configuration |

---

## Installation & Setup =>

```bash
# Clone the repository
git clone https://github.com/Akshay-Deshmane/authify.git

# Navigate to project directory
cd authify
```

---

### Setup Environment Variables =>

Create a `.env` file:

```env
MONGO_URI=your_mongodb_connection
JWT_SECRET=your_secret_key
```

---

### Run the Server =>

```bash
npm install
npm run dev
```

Server runs on:

```
http://localhost:3000
```

---

## Workflow Of Authify =>

### 1. User Registration :-

* User submits username, email, password
* Password is hashed and stored
* Refresh token generated and stored in cookie
* Session created in database

---

### 2. User Login :-

* User provides credentials
* Server validates user
* Generates:

  * Access Token (15 min)
  * Refresh Token (7 days)
* Refresh token stored in **HTTP-only cookie**
* Session stored in DB

---

### 3. Access Protected Routes :-

```js
Authorization: Bearer <accessToken>
```

* Server verifies JWT
* Returns user data

---

### 4. Refresh Token Flow :-

* Client sends refresh token via cookie
* Server:

  * Verifies token
  * Matches hashed token in DB
  * Generates new access token
  * Rotates refresh token
* Updates session in database

---

### 5. Logout (Single Device) :-

* Marks session as revoked
* Clears cookie

---

### 6. Logout From All Devices :-

* Revokes all sessions of user
* Clears cookie
* Forces re-login on all devices

---

## API Endpoints =>

| Method | Endpoint                | Description           |
| ------ | ----------------------- | --------------------- |
| POST   | /api/auth/register      | Register new user     |
| POST   | /api/auth/login         | Login user            |
| GET    | /api/auth/get-me        | Get logged-in user    |
| GET    | /api/auth/refresh-token | Refresh access token  |
| GET    | /api/auth/logout        | Logout current device |
| GET    | /api/auth/logout-all    | Logout all devices    |

---

## Key Engineering Concepts =>

### 1. Token-Based Authentication :-

* Stateless authentication using JWT
* Access token for authorization
* Refresh token for session continuity

---

### 2. Refresh Token Rotation :-

* New refresh token generated on each request
* Old token invalidated
* Prevents replay attacks

---

### 3. Session Management :-

* Each login creates a DB session
* Tracks:

  * User ID
  * Refresh token hash
  * Device info

---

### 4. Secure Token Storage :-

* Refresh token stored in **HTTP-only cookies**
* Prevents access via JavaScript (XSS protection)

---

### 5. Session Revocation :-

* Supports:

  * Single-device logout
  * Multi-device logout

---

## Project Structure =>

```
Authify/
│
├── src/
│   ├── config/
│   │   ├── config.js
│   │   └── database.js
│   │
│   ├── controllers/
│   │   └── auth.controller.js
│   │
│   ├── models/
│   │   ├── user.model.js
│   │   └── session.model.js
│   │
│   ├── routes/
│   │   └── auth.routes.js
│
├── .env
├── package.json
└── server.js
└── readme.md
```

---

## Example Usage =>

```
User: Logs in

Response:

{
  "message": "User logged in successfully",
  "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

---

## Limitations Of Authify =>

* No password hashing using bcrypt (currently SHA256)
* No role-based access control (RBAC)
* No email verification system
* No rate limiting implemented

---

## Future Enhancements / Future Scope =>

* Bcrypt-based password hashing
* Role-Based Access Control (RBAC)
* OAuth (Google / GitHub login)
* Rate limiting & brute-force protection
* Email verification & password reset
* Session dashboard for users
* Microservices-based auth system
* Docker & cloud deployment

---
