# Architecture

Full-Stack Authentication System using RBAC

Written By:         Team AuthSys
Document Version:   1.0
Last Revised Date:  June 15, 2023

---

## DOCUMENT CONTROL

### Change Record

Version | Date        | Author                      | Comments
--------|-------------|-----------------------------|------------------------------------
0.1     | May 20, 2023 | Team AuthSys               | Initial draft
0.2     | June 1, 2023 | Team AuthSys               | Added component details
0.3     | June 10, 2023 | Team AuthSys              | Updated authentication flow
1.0     | June 15, 2023 | Team AuthSys              | Final review and approval

---

## CONTENTS

1. [Introduction](#1-introduction)
   1.1 [What is Low-Level design document?](#11-what-is-low-level-design-document)
   1.2 [Scope](#12-scope)

2. [Architecture](#2-architecture)
   2.1 [System Architecture Overview](#21-system-architecture-overview)
   2.2 [Component Diagram](#22-component-diagram)
   2.3 [Data Flow Diagram](#23-data-flow-diagram)

3. [Architecture Description](#3-architecture-description)
   3.1 [Frontend Components](#31-frontend-components)
     3.1.1 [Authentication Components](#311-authentication-components)
     3.1.2 [User Management Components](#312-user-management-components)
     3.1.3 [Privilege Control Components](#313-privilege-control-components)
     3.1.4 [UI Components and Styling](#314-ui-components-and-styling)
   3.2 [Backend Components](#32-backend-components)
     3.2.1 [API Endpoints](#321-api-endpoints)
     3.2.2 [Middleware](#322-middleware)
     3.2.3 [Controllers](#323-controllers)
     3.2.4 [Models](#324-models)
   3.3 [Authentication and Authorization Flow](#33-authentication-and-authorization-flow)
     3.3.1 [Registration Process](#331-registration-process)
     3.3.2 [Login Process](#332-login-process)
     3.3.3 [JWT Token Handling](#333-jwt-token-handling)
     3.3.4 [Role-Based Access Control](#334-role-based-access-control)
   3.4 [Database Design](#34-database-design)
     3.4.1 [User Schema](#341-user-schema)
     3.4.2 [PrivilegeRequest Schema](#342-privilegerequest-schema)
     3.4.3 [Privilege Schema](#343-privilege-schema)
   3.5 [Security Considerations](#35-security-considerations)
     3.5.1 [Password Hashing](#351-password-hashing)
     3.5.2 [Token-Based Authentication](#352-token-based-authentication)
     3.5.3 [RBAC Implementation](#353-rbac-implementation)
     3.5.4 [API Security](#354-api-security)

4. [Unit Test Cases](#4-unit-test-cases)
   4.1 [Authentication Tests](#41-authentication-tests)
   4.2 [Authorization Tests](#42-authorization-tests)
   4.3 [User Management Tests](#43-user-management-tests)
   4.4 [Privilege Control Tests](#44-privilege-control-tests)

---

## 1. INTRODUCTION

### 1.1 What is Low-Level design document?

This Low-Level Design (LLD) document provides detailed specifications for
implementing the MERN Stack Authentication & Role-Based Access Control
System. While a High-Level Design (HLD) focuses on the overall system
architecture and components, this LLD provides a granular view of the
implementation details, including component interactions, data structures,
specific algorithms, interfaces, and detailed workflows.

The purpose of this document is to serve as a blueprint for developers
implementing the system, detailing how individual components should be built,
how they interact, and how the various features of the system should
function. It includes information about specific React components, Express
routes, MongoDB schemas, middleware implementations, and authentication flows.


### 1.2 Scope

This Low-Level Design document covers the detailed implementation aspects of:

- User Authentication: Registration, login, password handling, JWT token
  generation and verification
- Role-Based Access Control (RBAC): Role hierarchy, privilege management,
  access control implementation
- User Management: User CRUD operations, role assignment, account management
- Privilege Control: Temporary privilege requests, approval workflow,
  privilege expiration
- Security Implementation: Password hashing, JWT security, input validation,
  API security
- Frontend Components: React component structure, state management, UI/UX
  implementation
- Backend APIs: Endpoints, controllers, middleware, data validation
- Database Models: MongoDB schemas, relationships, and data integrity
  constraints

The document does not cover operational aspects like deployment,
infrastructure setup, or system monitoring, which would be addressed in
separate documentation.

## 2. ARCHITECTURE

### 2.1 System Architecture Overview

The system architecture is designed to provide a robust and scalable
authentication and role-based access control system using the MERN stack.
The architecture consists of the following components:

- Frontend: Built with React, it provides a responsive and user-friendly
  interface for authentication, user management, and privilege control.
- Backend: Implemented with Express.js, it handles API requests,
  authentication, authorization, and business logic.
- Database: MongoDB is used to store user data, roles, privileges, and other
  related information.
- Authentication: JWT (JSON Web Tokens) are used for secure authentication and
  session management.
- Authorization: Role-based access control (RBAC) is implemented to manage
  user permissions and access levels.

### 2.2 Component Diagram

The component diagram illustrates the main components of the system and
their interactions:

```
+-------------------+       +-------------------+
|                   |       |                   |
|     Frontend      |       |     Backend       |
|                   |       |                   |
+--------+----------+       +---------+---------+
         |                            |
         |                            |
         v                            v
+-------------------+       +-------------------+
|                   |       |                   |
|   Authentication  |<----->|   Authorization   |
|                   |       |                   |
+-------------------+       +-------------------+
         |                            |
         v                            v
+-------------------+       +-------------------+
|                   |       |                   |
|     Database      |<----->|     API Endpoints |
|                   |       |                   |
+-------------------+       +-------------------+
```

### 2.3 Data Flow Diagram

The data flow diagram provides an overview of the data flow within the system:

1. User registers or logs in through the frontend.
2. The frontend sends the request to the backend API.
3. The backend handles authentication and authorization.
4. The backend interacts with the database to store or retrieve data.
5. The backend sends the response back to the frontend.
6. The frontend updates the UI based on the response.

## 3. ARCHITECTURE DESCRIPTION

### 3.1 Frontend Components

#### 3.1.1 Authentication Components

The authentication components handle user registration, login, and
password management. They include:

- RegistrationForm: A form for new users to register.
- LoginForm: A form for existing users to log in.
- PasswordResetForm: A form for users to reset their passwords.

#### 3.1.2 User Management Components

The user management components allow administrators to manage user
accounts. They include:

- UserList: A list of all users in the system.
- UserDetails: A detailed view of a user's information.
- UserEditForm: A form for editing user information.

#### 3.1.3 Privilege Control Components

The privilege control components handle the management of user
privileges. They include:

- PrivilegeRequestForm: A form for users to request additional privileges.
- PrivilegeApprovalList: A list of privilege requests awaiting approval.
- PrivilegeDetails: A detailed view of a privilege request.

#### 3.1.4 UI Components and Styling

The system uses Material-UI components with custom styling:

- Responsive layout using MUI Grid system
- Custom theme configuration
- Consistent color scheme from colors.css
- Animated transitions and loading states
- Form validation feedback
- Error/success notifications

### 3.2 Backend Components

#### 3.2.1 API Endpoints

Authentication Routes:
router.post('/api/auth/register', register);
router.post('/api/auth/login', login);
router.get('/api/auth/profile', authenticateToken, getProfile);

User Management Routes:
router.get('/api/users', authenticateToken, authorize('admin', 'superadmin'));
router.put('/api/users/:id', authenticateToken, authorize('admin', 'superadmin'));
router.delete('/api/users/:id', authenticateToken, authorize('admin', 'superadmin'));

#### 3.2.2 Middleware Components

- JWT authentication middleware
- Role-based authorization
- Request validation
- Error handling
- Rate limiting

#### 3.2.3 Controllers

The controllers handle the business logic for the API endpoints. They
include:

- AuthController: Handles user registration, login, and profile retrieval.
- UserController: Handles user management operations such as listing,
  updating, and deleting users.
- PrivilegeController: Handles privilege requests and approvals.

#### 3.2.4 Models

The models define the data structures used in the system. They include:

- User Model: Represents a user in the system.
- PrivilegeRequest Model: Represents a privilege request made by a user.
- Privilege Model: Represents a privilege that can be assigned to a user.

### 3.3 Authentication and Authorization Flow

#### 3.3.1 Registration Process

1. User submits the registration form.
2. The frontend sends the registration data to the backend API.
3. The backend validates the data and creates a new user in the database.
4. The backend generates a JWT token and sends it back to the frontend.
5. The frontend stores the token and redirects the user to the dashboard.

#### 3.3.2 Login Process

1. User submits the login form.
2. The frontend sends the login data to the backend API.
3. The backend validates the data and checks the user's credentials.
4. The backend generates a JWT token and sends it back to the frontend.
5. The frontend stores the token and redirects the user to the dashboard.

#### 3.3.3 JWT Token Handling

1. The frontend includes the JWT token in the Authorization header of API
   requests.
2. The backend verifies the token and extracts the user information.
3. The backend processes the request and sends the response back to the
   frontend.

#### 3.3.4 Role-Based Access Control

1. The backend checks the user's role and permissions for each API request.
2. If the user has the required permissions, the request is processed.
3. If the user does not have the required permissions, an error response
   is sent.

### 3.4 Database Design

#### 3.4.1 User Schema

```
{
  name: String,
  email: String,
  password: String, // Hashed
  role: String,     // user, manager, admin, superadmin
  isActive: Boolean,
  lastLogin: Date
}
```

#### 3.4.2 PrivilegeRequest Schema

```
{
  userId: ObjectId,
  privileges: [String],
  reason: String,
  status: String,    // pending, approved, rejected
  reviewedBy: ObjectId,
  reviewedAt: Date,
  expiresAt: Date
}
```

#### 3.4.3 Privilege Schema

```
{
  name: String,
  description: String,
  createdAt: Date,
  updatedAt: Date
}
```

### 3.5 Security Considerations

#### 3.5.1 Password Hashing

- Passwords are hashed using bcrypt before being stored in the database.
- A salt is added to each password to prevent rainbow table attacks.

#### 3.5.2 Token-Based Authentication

- JWT tokens are used for authentication and session management.
- Tokens are signed with a secret key and have an expiration time.

#### 3.5.3 RBAC Implementation

- Roles and permissions are defined in the database.
- The backend checks the user's role and permissions for each API request.

#### 3.5.4 API Security

- Input validation is performed on all API requests to prevent SQL
  injection and other attacks.
- Rate limiting is implemented to prevent abuse of the API.

## 4. UNIT TEST CASES

### 4.1 Authentication Tests

Test Case             | Pre-Condition          | Expected Result
----------------------|------------------------|------------------------------
Valid Registration    | New email              | User created, token returned
Duplicate Email       | Email exists           | Error 400
Valid Login           | User exists            | Token returned
Invalid Password      | User exists            | Error 401

### 4.2 Authorization Tests

Test Case                | Pre-Condition          | Expected Result
-------------------------|------------------------|------------------------------
Access Admin Route       | User role              | Error 403
Modify User as Admin     | Admin role             | Success
Delete User as Manager   | Manager role           | Error 403

### 4.3 User Management Tests

Test Case                | Pre-Condition          | Expected Result
-------------------------|------------------------|------------------------------
Create User              | Admin role             | User created
Update User              | Admin role             | User updated
Delete User              | Admin role             | User deleted

### 4.4 Privilege Control Tests

Test Case                | Pre-Condition          | Expected Result
-------------------------|------------------------|------------------------------
Request Privilege        | Valid user             | Request created
Approve Request          | Admin role             | Request approved
Request as Admin         | Admin role             | Error 400
