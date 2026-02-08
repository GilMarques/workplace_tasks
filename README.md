# CRUD Application (Angular / .NET)

## Requirements

- Node
- Angular CLI
- Docker

## Steps to Run

### Frontend

```bash
cd ./frontend
npm install
ng serve
```

### Backend

```bash
cd ./backend
docker compose -d --build
```

## Technical Decisions

### Frontend

- Auth Resolver
  - For the `/tasks` and `/users` pages I require that a logged user must exist before the page is rendered
- Auth Guards
  - For `/tasks` redirect to `/login` if no user is logged in, as for `/users` user must be a admin.
- Auth Interceptors
  - Once user authenticates following http requests send jwt token
  - If user fails authentication redirect to `/login`
- Features separate from pages
  - I have 4 main folders for the app: core, features, pages, shared. Features folder works as Domain level and it holds api services and models
- Pages is route-based so folders that start with `_` dont count for routing (for example `_components`), for route params use `[param]` convention in a subfolder (for example: `pages/tasks/[id]/task-item.page.ts` maps to `/tasks/:id`)

### Backend

- Layered architecture
  - Api layer holds DTOs, handles validation, authentication and authorization.
  - Application layer holds services with business logic
  - Domain layer holds the entities, it doesn't depend on anything
  - Infrastructure holds EF configurations and repository implementations
- DDD
  - Entities are only mutable by available methods
- Exception Middleware
  - Common exceptions are handled through middleware for better status codes and removes the need of try/catch
- User role is extracted from the JWT claims instead of querying the database
  - This avoids extra database calls, but wont work if user needs to validate account

## Room for Improvement

### Frontend

- Stricter form validation using custom validators, for example whitespace is valid in both email and password
- Error specific error dialogs
- HTTP Client helper functions

### Backend

- Stricter validation using FluentValidation
  - Right now, email and password can have whitespace
  - Enum validation, I used Range() but this does not scale and can cause confusion if Enum changes later on
- For relationships, I only set that if a user that has assigned tasks and gets deleted these tasks are also deleted. Possible improvement by also being able to have tasks with no assigned user.
- Improve JWT authentication by introducing short-lived access tokens and refresh tokens

## RBAC Testing

Three test accounts are seeded into the database on startup, one for each role:

- **Admin**
  - Email: `admin@example.com`
  - Password: `adminadmin`

- **Manager**
  - Email: `manager@example.com`
  - Password: `managermanager`

- **Member**
  - Email: `member@example.com`
  - Password: `membermember`

- Login Endpoint `/login` payload `{email : ... , password : ...}`
- Signup Endpoint `/signup` payload `{email : ... , password : ...}`
