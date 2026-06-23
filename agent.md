# APIForge Frontend Development Guide

You are working on the frontend of **APIForge**, a Postman-inspired API testing platform.

Your goal is to build a production-quality frontend using React, TypeScript, Vite, Bun, TailwindCSS, and Shadcn/UI.

---

# Project Overview

APIForge allows users to:

* Authenticate
* Create workspaces
* Create collections
* Organize API requests
* Execute requests
* Manage environments
* View request history
* Collaborate with teammates

This repository contains ONLY the frontend.

Backend APIs may be mocked initially.

---

# Tech Stack

## Core

* React 19+
* TypeScript
* Vite
* Bun

## UI

* TailwindCSS
* Shadcn/UI
* Lucide Icons

## Routing

* React Router

## State Management

* Zustand

## Data Fetching

* TanStack Query

## Forms

* React Hook Form
* Zod

---

# Design Principles

The UI should feel like:

VSCode + Postman

Requirements:

* Dark mode first
* Minimal visual clutter
* Developer-centric
* Keyboard-friendly
* Responsive
* Accessible

Avoid:

* Marketing-style pages
* Excessive animations
* Large gradients
* Unnecessary modals

---

# Folder Structure

src/

├── app/

├── components/

├── features/

├── hooks/

├── layouts/

├── pages/

├── routes/

├── services/

├── stores/

├── types/

├── utils/

└── main.tsx

---

# Feature Structure

Each feature should follow:

features/

└── collections/

├── api/

├── components/

├── hooks/

├── pages/

├── store/

└── types/

Feature code should remain isolated.

Avoid cross-feature coupling.

---

# Global Layout

The application uses a 3-panel layout.

---

Sidebar

Collections Tree

## Request Builder

Response Panel

---

Layout Breakdown:

Left Sidebar:

* Workspaces
* History
* Settings

Middle:

* Collections
* Folders
* Requests

Main:

* Request Builder
* Tabs
* Response Viewer

---

# Pages To Build

## Authentication

### Login Page

Route:

/login

Components:

* Email Input
* Password Input
* Login Button
* Create Account Link

---

### Register Page

Route:

/register

Components:

* Name
* Email
* Password
* Confirm Password

---

## Dashboard

Route:

/

Purpose:

Workspace selector and overview.

Show:

* Recent Collections
* Recent Requests
* Workspace List

---

## Request Builder

Route:

/workspace/:workspaceId/request/:requestId

Core page of application.

Contains:

* Request Method Selector
* URL Input
* Send Button
* Params Tab
* Headers Tab
* Auth Tab
* Body Tab

Response Area:

* Status Code
* Response Time
* Headers
* JSON Viewer

This page receives the most attention.

---

## Collections Page

Route:

/workspace/:workspaceId

Contains:

* Collection Tree
* Folder Tree
* Request Tree

Supports:

* Create Collection
* Create Folder
* Create Request

---

## Environment Page

Route:

/workspace/:workspaceId/environments

Contains:

Editable variable table.

Columns:

* Variable
* Value

Actions:

* Add
* Edit
* Delete

---

## History Page

Route:

/history

Displays:

* Method
* URL
* Status
* Timestamp

---

## Workspace Settings

Route:

/workspace/:workspaceId/settings

Sections:

* Members
* Roles
* Invitations

---

# UI Component Standards

Always use Shadcn components.

Prefer:

* Card
* Sheet
* Dialog
* DropdownMenu
* Tabs
* Table
* Tooltip

Avoid custom UI implementations when a Shadcn component exists.

---

# Data Layer

Create centralized API services.

Example:

services/

api.ts

services/

collections.ts

services/

requests.ts

services/

workspaces.ts

Do NOT perform fetches directly inside components.

---

# Query Strategy

Use TanStack Query.

Queries:

* Workspaces
* Collections
* Requests
* Environments
* History

Mutations:

* Create
* Update
* Delete

Use optimistic updates where appropriate.

---

# Zustand Stores

Use Zustand ONLY for client state.

Examples:

uiStore

* sidebarCollapsed
* activeWorkspace

requestStore

* currentRequest
* unsavedChanges

Do not duplicate server state.

Server state belongs in TanStack Query.

---

# TypeScript Rules

Never use:

any

Always create explicit types.

Example:

RequestModel

CollectionModel

WorkspaceModel

EnvironmentModel

HistoryItem

Keep all types in feature folders.

---

# Mock Data Strategy

If backend endpoints do not exist:

Create mock services.

Location:

src/mocks/

Use realistic API data.

Do not block development waiting for backend.

---

# Request Builder Requirements

This is the most important feature.

Must support:

## Method Selector

GET
POST
PUT
PATCH
DELETE

---

## URL Input

Example:

https://api.example.com/users

---

## Query Params

Editable key/value table.

---

## Headers

Editable key/value table.

---

## Authentication

Support:

* None
* Bearer Token

Only these two for MVP.

---

## Body

Support:

* JSON

Syntax-highlighted editor preferred.

Simple textarea acceptable initially.

---

## Response Viewer

Display:

* Status Code
* Duration
* Response Size
* Headers
* JSON Response

---

# Collections Tree Requirements

Support:

Workspace
→ Collection
→ Folder
→ Request

Tree must be collapsible.

Use recursive rendering.

---

# Environment Variables

Users can create:

base_url

token

client_id

Variables appear as:

{{base_url}}

Future backend resolves variables.

Frontend should highlight variables visually.

---

# Error Handling

Every API call must handle:

* Loading
* Error
* Success

Use:

* Skeletons
* Empty States
* Error Components

Avoid blank screens.

---

# Accessibility

All forms require:

* Labels
* Keyboard Navigation
* Focus States

Every interactive element must be reachable via keyboard.

---

# Performance

Avoid unnecessary re-renders.

Use:

* React.memo
* useMemo
* useCallback

only when justified.

Do not prematurely optimize.

---

# Styling Rules

Prefer:

Tailwind utility classes

Use:

max-w-*
gap-*
space-y-*

Avoid:

inline styles

Avoid hardcoded colors.

Use theme variables.

---

# Development Order

Phase 1

* Routing
* Layout
* Authentication Pages

Phase 2

* Dashboard
* Workspace System

Phase 3

* Collections Tree

Phase 4

* Request Builder

Phase 5

* Response Viewer

Phase 6

* Environment Manager

Phase 7

* History

Phase 8

* Workspace Settings

Phase 9

* Polish
* Accessibility
* Error States

---

# Definition Of Done

A feature is complete only when:

✓ Responsive

✓ Accessible

✓ Fully typed

✓ Uses TanStack Query correctly

✓ Uses Shadcn components

✓ Has loading state

✓ Has error state

✓ Has empty state

✓ Matches overall APIForge design language

If a feature does not meet all criteria, it is not complete.
