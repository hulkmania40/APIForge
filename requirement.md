# APIForge - Postman Clone

## Project Overview

APIForge is a collaborative API testing and management platform inspired by Postman. It enables developers to create requests, organize them into collections, manage environments, execute API calls, and collaborate with team members inside shared workspaces.

**Tech Stack**

### Frontend

* React
* TypeScript
* Vite
* React Router
* TanStack Query
* Zustand
* TailwindCSS
* Shadcn/UI

### Backend

* FastAPI
* PostgreSQL
* SQLAlchemy
* Alembic
* Redis
* JWT Authentication
* Celery

---

# 1. Product Requirements Document (PRD)

## Problem Statement

Developers frequently need to:

* Test APIs
* Save requests
* Reuse environments
* Share collections
* Manage team collaboration

Existing tools are often complex and overloaded with features. APIForge focuses on simplicity while preserving core productivity features.

---

## Target Users

### Primary Users

* Backend Developers
* Frontend Developers

### Secondary Users

* QA Engineers
* Students Learning APIs

---

## Core Features

### Authentication

Users can:

* Register
* Login
* Logout
* Reset Password

---

### Workspaces

Users can:

* Create workspaces
* Invite team members
* Assign roles

Example:

Workspace
├── Backend Team
├── Frontend Team
└── QA Team

---

### Collections

Users can:

* Create collections
* Organize requests
* Share collections

Example:

User Service
├── Create User
├── Get User
├── Update User
└── Delete User

---

### Request Builder

Supported Methods:

* GET
* POST
* PUT
* PATCH
* DELETE

Request Components:

* URL
* Query Parameters
* Headers
* Authentication
* Request Body

---

### Request Execution

Users can:

* Send requests
* View responses
* Inspect headers
* Analyze performance

Response Details:

* Status Code
* Response Headers
* Response Body
* Response Time

---

### Environment Variables

Example:

base_url=https://api.company.com
token=xyz123

Usage:

{{base_url}}/users

---

### Request History

Store:

* Request Method
* URL
* Timestamp
* Status Code
* Response Time

---

### Team Collaboration

Users can:

* Comment on requests
* Share collections
* Invite teammates

---

## MVP Scope

### Included

* Authentication
* Workspaces
* Collections
* Request Builder
* Request Execution
* Request History
* Environment Variables

### Excluded

* GraphQL
* Mock Servers
* API Monitoring
* AI Features

---

# 2. Technical Requirements Document (TRD)

## System Architecture

React SPA
↓
FastAPI Backend
↓
PostgreSQL
↓
Redis

---

## Frontend Modules

### Authentication Module

Responsibilities:

* Login
* Registration
* Session Handling

---

### Workspace Module

Responsibilities:

* Workspace CRUD
* Member Management

---

### Collection Module

Responsibilities:

* Collection CRUD
* Folder Management
* Request Organization

---

### Request Builder Module

Responsibilities:

* Request Editing
* Header Management
* Body Management

---

### Environment Module

Responsibilities:

* Variable Management
* Variable Substitution

---

### History Module

Responsibilities:

* Execution Logs
* Recent Requests

---

## Backend Modules

### Auth Service

* JWT Generation
* User Verification

### Workspace Service

* Workspace Management
* Membership Permissions

### Collection Service

* Collection Storage

### Request Service

* Request Persistence

### Execution Service

* External API Execution
* Metadata Collection

### History Service

* Request Logging

---

## Non-Functional Requirements

### Performance

* API Overhead < 500ms

### Security

* JWT Authentication
* Input Validation
* Rate Limiting

### Scalability

* 10,000 Users
* 100,000 Requests Daily

### Reliability

* Error Logging
* Monitoring
* Automated Backups

---

## REST API Endpoints

### Auth

POST /auth/register
POST /auth/login
GET /auth/me

---

### Workspaces

POST /workspaces
GET /workspaces
GET /workspaces/{id}
DELETE /workspaces/{id}

---

### Collections

POST /collections
GET /collections
PUT /collections/{id}
DELETE /collections/{id}

---

### Requests

POST /requests
GET /requests/{id}
PUT /requests/{id}
DELETE /requests/{id}

---

### Execute

POST /execute

---

# 3. UI/UX Design Brief

## Design Principles

* Dark Mode First
* VSCode-Inspired Layout
* Minimal Distractions
* Developer-Centric Experience

---

## Login Screen

Components:

* Logo
* Email Input
* Password Input
* Login Button
* Register Link

Layout:

Centered authentication card.

---

## Dashboard Screen

Layout:

Left Sidebar
Main Content Area

Sidebar:

* Workspaces
* Collections
* History

Main Area:

* Recent Requests
* Recent Collections

---

## Request Builder Screen

Three-Panel Layout

### Left Panel

Collection Tree

### Center Panel

Request Editor

Contains:

* Method Dropdown
* URL Input
* Params Tab
* Headers Tab
* Auth Tab
* Body Tab

### Bottom Panel

Response Viewer

Contains:

* Status Code
* Response Time
* Response Headers
* JSON Viewer

---

## Environment Screen

Table-Based Editor

Columns:

* Variable Name
* Variable Value

Actions:

* Add Variable
* Edit Variable
* Delete Variable

---

## History Screen

List View

Each Entry Displays:

* Method
* URL
* Status Code
* Timestamp
* Response Time

---

## Workspace Settings Screen

Sections:

* Members
* Roles
* Invitations

Roles:

* Admin
* Editor
* Viewer

---

# 4. User Flow (App Flow)

## New User Journey

Register
→ Login
→ Create Workspace
→ Create Collection
→ Create Request
→ Execute Request
→ Save Request

---

## Existing User Journey

Login
→ Select Workspace
→ Open Collection
→ Open Request
→ Execute Request

---

## Collaboration Journey

Invite User
→ User Accepts Invite
→ Access Workspace
→ Edit Collection
→ Leave Comments

---

## Environment Workflow

Create Environment
→ Add Variables
→ Reference Variables
→ Execute Request

---

## Request Execution Workflow

Create Request
→ Configure Headers
→ Configure Body
→ Click Send
→ Backend Executes Request
→ Display Response

---

# 5. Backend Database Schema

## users

| Column        | Type      |
| ------------- | --------- |
| id            | UUID      |
| email         | VARCHAR   |
| name          | VARCHAR   |
| password_hash | TEXT      |
| created_at    | TIMESTAMP |

---

## workspaces

| Column     | Type      |
| ---------- | --------- |
| id         | UUID      |
| name       | VARCHAR   |
| owner_id   | UUID      |
| created_at | TIMESTAMP |

---

## workspace_members

| Column       | Type    |
| ------------ | ------- |
| id           | UUID    |
| workspace_id | UUID    |
| user_id      | UUID    |
| role         | VARCHAR |

Roles:

* admin
* editor
* viewer

---

## collections

| Column       | Type    |
| ------------ | ------- |
| id           | UUID    |
| workspace_id | UUID    |
| name         | VARCHAR |
| description  | TEXT    |

---

## folders

| Column           | Type    |
| ---------------- | ------- |
| id               | UUID    |
| collection_id    | UUID    |
| parent_folder_id | UUID    |
| name             | VARCHAR |

---

## requests

| Column        | Type      |
| ------------- | --------- |
| id            | UUID      |
| collection_id | UUID      |
| folder_id     | UUID      |
| name          | VARCHAR   |
| method        | VARCHAR   |
| url           | TEXT      |
| headers       | JSONB     |
| params        | JSONB     |
| body          | JSONB     |
| created_by    | UUID      |
| updated_at    | TIMESTAMP |

---

## environments

| Column       | Type    |
| ------------ | ------- |
| id           | UUID    |
| workspace_id | UUID    |
| name         | VARCHAR |
| variables    | JSONB   |

---

## request_history

| Column        | Type      |
| ------------- | --------- |
| id            | UUID      |
| user_id       | UUID      |
| method        | VARCHAR   |
| url           | TEXT      |
| status_code   | INTEGER   |
| response_time | INTEGER   |
| executed_at   | TIMESTAMP |

---

## comments

| Column     | Type      |
| ---------- | --------- |
| id         | UUID      |
| request_id | UUID      |
| user_id    | UUID      |
| content    | TEXT      |
| created_at | TIMESTAMP |

---

## Entity Relationship Summary

Users
│
├── Workspace Members
│   └── Workspaces
│       ├── Collections
│       │   ├── Folders
│       │   └── Requests
│       │       └── Comments
│       └── Environments
│
└── Request History

---

# 6. Implementation Plan

## Phase 1 — Project Setup (Week 1)

Backend:

* FastAPI Setup
* PostgreSQL Setup
* SQLAlchemy
* Alembic

Frontend:

* React Setup
* TypeScript Setup
* Routing
* Layout System

Deliverable:
Authentication foundation ready.

---

## Phase 2 — Authentication (Week 1)

Backend:

* Register API
* Login API
* JWT Authentication

Frontend:

* Login Screen
* Register Screen
* Protected Routes

Deliverable:
Users can authenticate.

---

## Phase 3 — Workspaces (Week 2)

Backend:

* Workspace CRUD
* Membership Management

Frontend:

* Workspace Dashboard
* Workspace Settings

Deliverable:
Users can create teams.

---

## Phase 4 — Collections & Requests (Week 3)

Backend:

* Collection CRUD
* Folder CRUD
* Request CRUD

Frontend:

* Collection Tree
* Request Editor

Deliverable:
Users can organize APIs.

---

## Phase 5 — Request Execution Engine (Week 4)

Backend:

* HTTPX Integration
* Request Proxy
* Execution Logging

Frontend:

* Response Viewer
* Status Display
* JSON Formatter

Deliverable:
Core Postman functionality operational.

---

## Phase 6 — Environment Variables (Week 5)

Backend:

* Environment CRUD

Frontend:

* Variable Editor

Deliverable:
Variable substitution working.

---

## Phase 7 — Collaboration Features (Week 6)

Backend:

* Invitations
* Comments

Frontend:

* Member Management
* Comment Sidebar

Deliverable:
Team collaboration enabled.

---

## Phase 8 — Production Readiness (Weeks 7-8)

Backend:

* Redis
* Rate Limiting
* Caching
* Logging
* Unit Tests

Frontend:

* Error Handling
* Loading States
* Optimistic Updates

Infrastructure:

* Docker
* CI/CD Pipeline
* Deployment

---

# Stretch Goals

## Advanced Features

### Collection Runner

Run multiple requests sequentially.

### WebSocket Collaboration

Real-time editing and synchronization.

### Version Control

Collection version history.

### Import/Export

Support Postman Collection format.

### Documentation Generator

Generate API documentation automatically.

### Mock Server

Generate mock endpoints from collections.

### Public Collections

Share collections publicly via URL.

---

## Final Goal

Build a production-grade Postman-inspired developer platform that demonstrates:

* React Expertise
* FastAPI Expertise
* Database Design
* API Design
* Team Collaboration Features
* Real-World Product Architecture
