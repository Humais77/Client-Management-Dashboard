# NexManage

A production-style Client Management Dashboard built as part of the NexElite Full-Stack Developer Practical Assessment.

NexManage allows authenticated users to manage clients and their associated projects through a responsive dashboard. The application includes authentication, project and client CRUD operations, project search and filtering, server-side validation, authorization, and security-focused backend architecture.

---

## Overview

NexManage is a full-stack client and project management application designed around a simple multi-user architecture.

Each registered user has their own clients and projects. Projects are associated with clients, and all client/project operations are restricted to the authenticated user.

### Core capabilities

* User registration and login
* Secure logout
* Protected dashboard
* Client management
* Project management
* Client-project relationships
* Project status management
* Project search
* Project status filtering
* Responsive interface
* Server-side validation
* Authentication and authorization
* Secure password hashing
* HTTP-only JWT authentication cookies
* API rate limiting
* Security headers
* Production-oriented error handling

---

## Features

### Authentication

* User signup
* User login
* User logout
* Persistent authentication using an HTTP-only cookie
* Protected application routes
* Current authenticated user endpoint
* Password hashing using bcrypt
* JWT-based authentication
* Seven-day authentication session

### Dashboard

The dashboard provides access to the user's projects and clients.

Projects support the following statuses:

* Pending
* In Progress
* Completed

Users can search projects and filter them by status.

### Client Management

Users can:

* Create clients
* View clients
* Edit clients
* Delete clients

Each client contains:

* Name
* Email
* Company

When a client is deleted, its associated projects are also deleted. This behavior is intentional and is described further in the assumptions section.

### Project Management

Users can:

* Create projects
* View projects
* View project details
* Edit projects
* Delete projects
* Search projects
* Filter projects by status

Each project contains:

* Project name
* Description
* Status
* Associated client

### Responsive UI

The frontend is designed to work across:

* Desktop
* Tablet
* Mobile

The dashboard includes responsive navigation and layouts for smaller screens.

---

## Technology Stack

### Frontend

| Technology      | Purpose                         |
| --------------- | ------------------------------- |
| React           | UI development                  |
| TypeScript      | Static typing                   |
| Vite            | Frontend build tooling          |
| React Router    | Client-side routing             |
| Tailwind CSS    | Responsive UI styling           |
| Axios           | HTTP API communication          |
| React Hot Toast | User feedback and notifications |

### Backend

| Technology         | Purpose                            |
| ------------------ | ---------------------------------- |
| Node.js            | Backend runtime                    |
| Express.js         | REST API framework                 |
| TypeScript         | Static typing                      |
| Mongoose           | MongoDB object modeling            |
| Zod                | Server-side request validation     |
| bcryptjs           | Password hashing                   |
| jsonwebtoken       | JWT authentication                 |
| cookie-parser      | HTTP cookie handling               |
| Helmet             | Security headers                   |
| CORS               | Cross-origin request configuration |
| express-rate-limit | API abuse protection               |
| dotenv             | Environment configuration          |

### Database

**MongoDB**

MongoDB is used because the application has a relatively simple document-based data model while still requiring relationships between users, clients, and projects. Mongoose provides schema definitions, validation, and convenient querying.

---

## Why These Technologies?

### React + TypeScript

React provides a component-based approach for building the dashboard, while TypeScript improves maintainability and reduces common type-related errors.

### Vite

Vite provides a fast development experience and a straightforward production build process for the React application.

### Tailwind CSS

Tailwind CSS was chosen to build a responsive and consistent interface without introducing unnecessary UI framework complexity.

### Node.js + Express

Express provides a lightweight and flexible foundation for implementing REST API endpoints and middleware.

### MongoDB + Mongoose

MongoDB fits the application's document-oriented data structure, while Mongoose provides schema definitions, relationships through ObjectIds, validation, and database querying.

### JWT + HTTP-only Cookies

JWT is used for stateless authentication. The token is stored in an HTTP-only cookie so that client-side JavaScript cannot directly access the authentication token.

### Zod

Zod is used for server-side request validation before data is processed or stored.

---

# Architecture

NexManage follows a separated frontend/backend architecture.


                    ┌─────────────────────┐
                    │   React + TypeScript │
                    │       Frontend       │
                    └──────────┬──────────┘
                               │
                               │ HTTP / JSON
                               │ HTTP-only Cookie
                               ▼
                    ┌─────────────────────┐
                    │   Express + Node.js │
                    │       Backend       │
                    └──────────┬──────────┘
                               │
                               │ Mongoose
                               ▼
                    ┌─────────────────────┐
                    │       MongoDB       │
                    └─────────────────────┘

The frontend communicates with the Express REST API.

Authentication is handled using a JWT stored in an HTTP-only cookie.

The backend verifies the cookie before allowing access to protected client and project endpoints.

---

# Project Structure


nexmanage/
│
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── Button.tsx
│   │   │   ├── Input.tsx
│   │   │   ├── Modal.tsx
│   │   │   ├── Navbar.tsx
│   │   │   ├── ProjectCard.tsx
│   │   │   ├── ProtectedRoute.tsx
│   │   │   └── ToastProvider.tsx
│   │   │
│   │   ├── context/
│   │   │   └── AuthContext.tsx
│   │   │
│   │   ├── layouts/
│   │   │   └── DashboardLayout.tsx
│   │   │
│   │   ├── pages/
│   │   │   ├── Login.tsx
│   │   │   ├── Signup.tsx
│   │   │   ├── Dashboard.tsx
│   │   │   ├── Clients.tsx
│   │   │   ├── ClientForm.tsx
│   │   │   ├── Projects.tsx
│   │   │   ├── ProjectDetails.tsx
│   │   │   ├── ProjectForm.tsx
│   │   │   └── NotFound.tsx
│   │   │
│   │   ├── services/
│   │   │   └── api.ts
│   │   │
│   │   ├── utils/
│   │   │   └── apiError.ts
│   │   │
│   │   ├── App.tsx
│   │   ├── index.css
│   │   └── main.tsx
│   │
│   └── ...
│
├── backend/
│   ├── src/
│   │   ├── config/
│   │   │   ├── db.ts
│   │   │   └── env.ts
│   │   │
│   │   ├── controllers/
│   │   │   ├── auth.controller.ts
│   │   │   ├── client.controller.ts
│   │   │   └── project.controller.ts
│   │   │
│   │   ├── middleware/
│   │   │   ├── auth.middleware.ts
│   │   │   └── error.middleware.ts
│   │   │
│   │   ├── models/
│   │   │   ├── User.ts
│   │   │   ├── Client.ts
│   │   │   └── Project.ts
│   │   │
│   │   ├── routes/
│   │   │   ├── auth.routes.ts
│   │   │   ├── client.routes.ts
│   │   │   └── project.routes.ts
│   │   │
│   │   ├── schemas/
│   │   │   ├── auth.schema.ts
│   │   │   ├── client.schema.ts
│   │   │   └── project.schema.ts
│   │   │
│   │   ├── types/
│   │   │   └── express.d.ts
│   │   │
│   │   ├── utils/
│   │   │   ├── jwt.ts
│   │   │   ├── password.ts
│   │   │   └── validation.ts
│   │   │
│   │   ├── app.ts
│   │   └── server.ts
│   │
│   ├── .env
│    
│  
│
└── README.md


---

# Database Structure

NexManage uses three primary collections:


User
  │
  ├───────────────┐
  │               │
  ▼               ▼
Client          Project
                  │
                  ▼
                Client


## User

User
├── _id
├── name
├── email
├── password
├── createdAt
└── updatedAt


Passwords are never stored in plaintext. They are hashed using bcrypt before being stored.

The password field is also excluded from normal Mongoose queries.

---

## Client

Client
├── _id
├── user
├── name
├── email
├── company
├── createdAt
└── updatedAt

`user` references the owner of the client.

This allows the backend to ensure users can only access their own clients.

---

## Project


Project
├── _id
├── user
├── client
├── name
├── description
├── status
├── createdAt
└── updatedAt


`user` identifies the project owner.

`client` references the associated client.

The project status is restricted to:

Pending
In Progress
Completed


---

# Relationships

The relationships are implemented using MongoDB ObjectIds.


User
 │
 ├── has many Clients
 │
 └── has many Projects

Client
 │
 └── has many Projects

Project
 │
 └── belongs to one Client


Every client and project is also associated with the authenticated user.

This provides an additional authorization boundary.

For example, a user cannot create a project using another user's client ID because the backend verifies that the selected client belongs to the authenticated user.

---

# API Structure

Base URL:


/api


## Authentication

### Sign Up


POST /api/auth/signup


Request:


{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123"
}


---

### Login


POST /api/auth/login


Request:


{
  "email": "john@example.com",
  "password": "password123"
}


A successful login sets an HTTP-only authentication cookie.

---

### Current User


GET /api/auth/me


Requires authentication.

Returns the currently authenticated user.

---

### Logout


POST /api/auth/logout


Clears the authentication cookie.

---

# Client API

All client endpoints require authentication.

### Get Clients


GET /api/clients


---

### Get Client


GET /api/clients/:id


---

### Create Client


POST /api/clients


Request:


{
  "name": "John Doe",
  "email": "john@example.com",
  "company": "Example Company"
}

---

### Update Client


PUT /api/clients/:id


---

### Delete Client


DELETE /api/clients/:id


Deleting a client also deletes its associated projects.

---

# Project API

All project endpoints require authentication.

### Get Projects


GET /api/projects


Supports search and status filtering.

Example:


GET /api/projects?search=website


Example:


GET /api/projects?status=Completed


---

### Get Project


GET /api/projects/:id


---

### Create Project


POST /api/projects


Request:


{
  "name": "Company Website",
  "description": "Build a responsive company website",
  "client": "CLIENT_ID",
  "status": "Pending"
}


---

### Update Project


PUT /api/projects/:id


---

### Delete Project


DELETE /api/projects/:id


---

# Health Check

The backend exposes a health endpoint:


GET /api/health


Successful response:


{
  "success": true,
  "message": "NexManage API is running"
}


---

# Authentication Approach

NexManage uses JWT-based authentication.

The authentication flow is:


User
 │
 │ Login
 ▼
Backend
 │
 ├── Validate credentials
 │
 ├── Compare password using bcrypt
 │
 ├── Generate JWT
 │
 └── Set HTTP-only cookie
 │
 ▼
Browser
 │
 │ Subsequent API requests
 ▼
Backend
 │
 ├── Read authentication cookie
 │
 ├── Verify JWT
 │
 ├── Validate user
 │
 └── Attach user ID to request


The authentication token is not stored in localStorage or sessionStorage.

Instead, it is stored in an HTTP-only cookie.

This prevents normal frontend JavaScript from directly accessing the authentication token.

---

# Authorization

Authentication and authorization are treated separately.

Authentication determines whether the user is logged in.

Authorization determines whether the authenticated user owns the requested resource.

For example, client queries use the authenticated user ID:


Client.find({
  user: req.userId
})


Projects are similarly scoped:


Project.find({
  user: req.userId
})


Project creation also verifies that the selected client belongs to the current user.

This prevents users from accessing another user's clients or projects by manually changing resource IDs.

---

# Security Considerations

Several security measures were implemented.

## Password Hashing

Passwords are hashed using bcrypt with a salt round configuration of 12.

Plaintext passwords are never stored.

---

## HTTP-only Authentication Cookie

The JWT is stored in an HTTP-only cookie.

This prevents client-side JavaScript from reading the authentication token.

---

## Secure Production Cookies

In production, cookies are configured with secure settings appropriate for HTTPS deployment.

---

## Input Validation

The backend validates incoming request data using Zod.

Validation is performed server-side rather than relying exclusively on frontend validation.

---

## ObjectId Validation

Resource IDs are validated before database operations to prevent malformed IDs from reaching MongoDB queries.

---

## Authorization / User Isolation

Every protected client and project operation is scoped to the authenticated user.

This prevents horizontal privilege escalation between users.

---

## Helmet

Helmet is used to add common security-related HTTP headers.

---

## CORS

The API uses an explicitly configured frontend origin and credentials support.

This prevents arbitrary origins from accessing authenticated API resources.

---

## Rate Limiting

API requests are rate limited.

Authentication endpoints use a stricter rate limit to reduce brute-force login/signup attempts.

---

## Request Body Size Limit

JSON request bodies are limited to 1 MB to reduce unnecessary resource consumption.

---

## Error Handling

A centralized Express error handler handles:

* Mongoose validation errors
* Invalid MongoDB IDs
* Duplicate key errors
* Unexpected server errors

Production responses avoid exposing internal error details.

---

## Environment Variables

Secrets and environment-specific configuration are stored in environment variables.

Sensitive credentials are not included in the frontend application.

The `.env` file should never be committed to Git.

---

# Environment Variables

## Backend

Create:


backend/.env


Example:


PORT=5000
MONGODB_URI=mongodb://127.0.0.1:27017/nexmanage
JWT_SECRET=your_long_random_secret
FRONTEND_URL=http://localhost:5173
NODE_ENV=development


For production, replace the local MongoDB URI with the MongoDB Atlas connection string and use the production frontend URL.

---

## Frontend

Create:


frontend/.env


Example:


VITE_API_URL=http://localhost:5000/api


For production:


VITE_API_URL=https://your-production-backend-url/api


Only variables prefixed with `VITE_` are exposed to the Vite frontend. No secret credentials should be placed in frontend environment variables.

---

# Local Setup

## Prerequisites

Make sure the following are installed:

* Node.js
* npm
* MongoDB

Alternatively, MongoDB Atlas can be used instead of a local MongoDB instance.

---

## Clone the Repository


git clone <YOUR_GITHUB_REPOSITORY_URL>
cd nexmanage


---

# Backend Setup


cd backend
npm install


Create the environment file:


.env


Configure:


PORT=5000
MONGODB_URI=mongodb://127.0.0.1:27017/nexmanage
JWT_SECRET=your_long_random_secret
FRONTEND_URL=http://localhost:5173
NODE_ENV=development


Start the development server:


npm run dev


The API will run on:

http://localhost:5000


---

# Frontend Setup

Open another terminal:


cd frontend
npm install


Create:


.env


Add:


VITE_API_URL=http://localhost:5000/api


Start the development server:


npm run dev


The frontend will normally be available at:


http://localhost:5173


---

# Production Build

## Backend


cd backend
npm run build


Start the production build:

npm start


## Frontend


cd frontend
npm run build


The generated production files will be created by Vite.

---

# Testing

The application was tested locally for the primary assessment requirements.

### Authentication

* Sign up
* Login
* Logout
* Protected routes
* Session persistence
* Invalid credentials
* Invalid input

### Clients

* Create client
* View clients
* Edit client
* Delete client
* Client validation
* User ownership

### Projects

* Create project
* View projects
* View project details
* Edit project
* Delete project
* Search projects
* Filter by status
* Associate projects with clients
* Validate client ownership

### Security

* Password hashing
* HTTP-only authentication cookie
* Protected API endpoints
* User isolation
* Input validation
* Invalid ObjectId handling
* Rate limiting
* CORS
* Helmet
* Production error handling

### Responsive UI

The interface was tested across desktop and mobile layouts.

---

# Assumptions

The following design assumptions were made during development.

### One user owns their own clients and projects

Users can only access resources belonging to their own account.

### A project belongs to one client

Each project has one associated client.

### A client can have multiple projects

There is a one-to-many relationship between clients and projects.

### Deleting a client deletes its projects

When a client is deleted, all projects associated with that client are also deleted.

This was chosen to prevent orphaned projects.

### Project status is limited

Only the following statuses are supported:


Pending
In Progress
Completed


### Authentication session duration

JWT authentication sessions are configured to expire after seven days.

---

# Improvements With Additional Time

Given additional development time, the following improvements could be considered:

### Pagination

Projects and clients could use server-side pagination for larger datasets.

### Dashboard Analytics

The dashboard could include statistics such as:

* Total projects
* Pending projects
* In-progress projects
* Completed projects
* Total clients

### Advanced Search

Search could be expanded to include:

* Client name
* Company
* Project status
* Project date
* Multiple filters

### Client Details

A dedicated client details page could display:

* Client information
* Associated projects
* Project statistics
* Activity history

### Project Dates

Projects could include:

* Start date
* Due date
* Completion date

### Activity / Audit Logs

An activity history could track important changes such as:

* Project creation
* Status changes
* Client updates
* Project deletion

### Password Reset

Authentication could be extended with:

* Forgot password
* Password reset emails
* Password change functionality

### Email Verification

Email verification could be added during account registration.

### Automated Testing

The project could be expanded with:

* Unit tests
* API integration tests
* End-to-end tests

### CI/CD

GitHub Actions could automatically:

* Run TypeScript checks
* Run tests
* Build frontend
* Build backend
* Validate pull requests

---

# Production Deployment

The application is designed to support separate frontend and backend deployments.

Recommended production architecture:


React + Vite
     │
     ▼
Frontend Hosting
     │
     │ HTTPS
     ▼
Express API
     │
     ▼
MongoDB Atlas


Production environment variables must be configured on the hosting platforms rather than committed to the repository.

The backend CORS configuration must point to the deployed frontend URL.

The frontend API URL must point to the deployed backend URL.

Authentication cookies must use secure production settings when deployed over HTTPS.

---

# API Error Format

Successful responses generally follow:


{
  "success": true
}


Errors generally follow:


{
  "success": false,
  "message": "Error message"
}


Validation errors may additionally include:


{
  "success": false,
  "message": "Invalid input",
  "errors": {}
}


---

# Design Decisions

The project intentionally avoids unnecessary architectural complexity.

The backend is organized around:


Routes
   ↓
Controllers
   ↓
Validation
   ↓
Models
   ↓
MongoDB


Authentication and security concerns are handled through middleware and utility modules.

This structure keeps the application understandable and maintainable while remaining appropriate for the scope of the assessment.

---

# Development Scripts

## Backend

npm run dev


Runs the development server with automatic restart.


npm run build


Compiles the TypeScript backend.

npm start


Runs the compiled production backend.

## Frontend

npm run dev


Starts the Vite development server.

npm run build


Creates the production frontend build.

---

# Assessment Requirement Checklist

| Requirement                       | Status |
| --------------------------------- | ------ |
| Sign up / Login                   | ✅      |
| Logout                            | ✅      |
| Protected dashboard               | ✅      |
| Display projects                  | ✅      |
| Pending status                    | ✅      |
| In Progress status                | ✅      |
| Completed status                  | ✅      |
| Search projects                   | ✅      |
| Filter projects                   | ✅      |
| Create project                    | ✅      |
| Edit project                      | ✅      |
| Delete project                    | ✅      |
| View project details              | ✅      |
| Add client                        | ✅      |
| Client name                       | ✅      |
| Client email                      | ✅      |
| Client company                    | ✅      |
| Associate projects with clients   | ✅      |
| REST API                          | ✅      |
| Server-side validation            | ✅      |
| Error handling                    | ✅      |
| Database persistence              | ✅      |
| User/client/project relationships | ✅      |
| Responsive frontend               | ✅      |
| Secure password handling          | ✅      |
| Authentication & authorization    | ✅      |
| Input validation                  | ✅      |
| Secrets protected                 | ✅      |
| Production configuration          | ✅      |
| Live deployment                   | ✅      |
| README                            | ✅      |

---

# Author

**Humais**

Full-Stack Developer

---

# License

This project was developed as a technical assessment project for evaluation purposes.

It should not be represented as a commercial NexElite client project.
