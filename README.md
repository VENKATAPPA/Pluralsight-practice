# SocialMediaApp

A complete starter solution for building a social media platform with ASP.NET Core, Angular, and SQL Server.

## 📁 Repository Structure

```
SocialMediaApp/
├── src/
│   ├── api/                          # ASP.NET Core 8 Web API
│   │   ├── Controllers/              # Auth, Users, Posts, Comments, Likes
│   │   ├── Data/                     # AppDbContext (EF Core)
│   │   ├── Models/                   # User, Post, Comment, Like, Follow entities
│   │   ├── DTOs/                     # Data transfer objects
│   │   ├── appsettings.json
│   │   ├── Program.cs                # DI & middleware configuration
│   │   └── SocialMediaApp.Api.csproj
│   ├── web/                          # Angular 17 SPA
│   │   ├── src/
│   │   │   ├── app/
│   │   │   │   ├── components/       # Login, Register, Feed, Profile, etc.
│   │   │   │   ├── services/         # Auth, Posts, Users, Comments
│   │   │   │   ├── guards/           # Auth guard for protected routes
│   │   │   │   ├── interceptors/     # JWT token injection
│   │   │   │   ├── app.module.ts
│   │   │   │   └── app-routing.module.ts
│   │   │   ├── environments/         # dev & prod configs
│   │   │   └── main.ts
│   │   ├── angular.json
│   │   ├── tsconfig.json
│   │   └── package.json
│   └── dbup/                         # DbUp database migrations
│       ├── Scripts/
│       │   ├── 001_Create_Users_Posts_Comments_Likes_Follows.sql
│       │   └── 002_Add_Indexes.sql
│       ├── Program.cs
│       └── SocialMedia.DbUp.csproj
├── docker/
│   ├── api.Dockerfile               # Multi-stage ASP.NET Core build
│   ├── web.Dockerfile               # Multi-stage Angular + Nginx build
│   └── nginx.conf                   # Nginx configuration for SPA routing
└── README.md
```

## 🚀 Quick Start

### Prerequisites

- **.NET 8 SDK** (for backend & dbup)
- **Node.js 20+** (for Angular frontend)
- **SQL Server** (local or remote)
- **Docker & Docker Compose** (optional, for containerized deployment)

### 1. Backend Setup

#### Install & Build

```bash
cd src/api
dotnet restore
dotnet build
```

#### Initialize Database

First, ensure SQL Server is running, then run the DbUp migrations:

```bash
cd src/dbup
dotnet run -- "Server=localhost;Database=SocialMediaDb;User Id=sa;Password=YourPassword!;TrustServerCertificate=True;"
```

Or set environment variable instead:

```bash
export DB_CONNECTION_STRING="Server=localhost;Database=SocialMediaDb;User Id=sa;Password=YourPassword!;TrustServerCertificate=True;"
dotnet run
```

#### Run API Server

```bash
cd src/api
dotnet run
```

API will be available at `http://localhost:5000`

### 2. Frontend Setup

```bash
cd src/web
npm install
npm start
```

Frontend will be available at `http://localhost:4200`

Update `src/environments/environment.ts` if your API runs on a different port.

## 🛠️ Architecture & Features

### Backend (ASP.NET Core Web API)

**Entities:**
- **User** – Username, email, password hash, display name, bio, created date
- **Post** – Content, image URL, creator, created date
- **Comment** – Content, post reference, creator, created date
- **Like** – Post reference, creator, unique constraint on (PostId, UserId)
- **Follow** – Follower, following, unique constraint on (FollowerId, FollowingId)

**Controllers:**
- **AuthController** – Register, login (JWT token generation)
- **UsersController** – Get profile, follow/unfollow users
- **PostsController** – Create, read, update, delete posts; get feed from followed users
- **CommentsController** – Create comments, list comments per post
- **LikesController** – Like/unlike posts

**Authentication:**
- JWT bearer token-based authentication
- Tokens configurable via `appsettings.json` or `JWT_KEY` environment variable
- All protected endpoints require valid token in `Authorization: Bearer <token>` header

**Database:**
- EF Core with SQL Server
- Code-first models with configured relationships
- DbUp for schema migrations (no EF migrations used)

### Frontend (Angular)

**Components:**
- **LoginComponent** – User authentication
- **RegisterComponent** – New user registration
- **FeedComponent** – Posts from followed users
- **CreatePostComponent** – Create new posts
- **PostDetailComponent** – Single post view
- **ProfileComponent** – User profile, follow/unfollow actions

**Services:**
- **AuthService** – Login, register, token storage, JWT parsing
- **PostsService** – CRUD operations, feed, likes
- **UsersService** – Profile, follow/unfollow
- **CommentsService** – Comments on posts

**Security:**
- JWT tokens stored in localStorage
- **AuthGuard** protects routes like `/feed`, `/create-post`
- **AuthInterceptor** automatically attaches JWT to all HTTP requests

**Routing:**
- `/login` – Login page
- `/register` – Registration page
- `/feed` – Feed (protected)
- `/create-post` – Create post page (protected)
- `/post/:id` – Post detail
- `/profile/:id` – User profile

## 📦 API Endpoints

### Authentication
- `POST /api/auth/register` – Register new user
- `POST /api/auth/login` – Login (returns JWT token)

### Users
- `GET /api/users/me` – Get current user profile (protected)
- `GET /api/users/{id}` – Get user by ID
- `POST /api/users/{id}/follow` – Follow user (protected)
- `POST /api/users/{id}/unfollow` – Unfollow user (protected)

### Posts
- `GET /api/posts/feed` – Get feed from followed users (protected, paginated)
- `GET /api/posts/{id}` – Get post by ID
- `POST /api/posts` – Create post (protected)
- `PUT /api/posts/{id}` – Update post (protected, must be owner)
- `DELETE /api/posts/{id}` – Delete post (protected, must be owner)

### Comments
- `GET /api/posts/{postId}/comments` – List comments on post
- `POST /api/posts/{postId}/comments` – Create comment (protected)

### Likes
- `POST /api/posts/{postId}/likes/like` – Like post (protected)
- `POST /api/posts/{postId}/likes/unlike` – Unlike post (protected)

## 🐳 Docker Deployment

### Build Images

```bash
# Build API image
docker build -f docker/api.Dockerfile -t socialmediaapp-api:latest .

# Build Frontend image
docker build -f docker/web.Dockerfile -t socialmediaapp-web:latest .
```

### Run with Docker Compose

Create a `docker-compose.yml`:

```yaml
version: '3.8'

services:
  sqlserver:
    image: mcr.microsoft.com/mssql/server:2022-latest
    environment:
      SA_PASSWORD: YourPassword!
      ACCEPT_EULA: Y
    ports:
      - "1433:1433"

  api:
    build:
      context: .
      dockerfile: docker/api.Dockerfile
    environment:
      DB_CONNECTION_STRING: "Server=sqlserver;Database=SocialMediaDb;User Id=sa;Password=YourPassword!;TrustServerCertificate=True;"
    ports:
      - "8080:8080"
    depends_on:
      - sqlserver

  web:
    build:
      context: .
      dockerfile: docker/web.Dockerfile
    ports:
      - "80:80"
    depends_on:
      - api
```

Run:

```bash
docker-compose up
```

Access:
- **Frontend:** http://localhost
- **API:** http://localhost:8080

## ⚙️ Configuration

### Backend (appsettings.json)

```json
{
  "ConnectionStrings": {
    "DefaultConnection": "Server=localhost;Database=SocialMediaDb;..."
  },
  "Jwt": {
    "Key": "ChangeThisSecretToAStrongOne",
    "Issuer": "SocialMediaApp",
    "Audience": "SocialMediaAppUsers",
    "ExpireMinutes": 60
  }
}
```

Override with environment variables:
- `DB_CONNECTION_STRING` – Database connection
- `JWT_KEY` – JWT signing key

### Frontend (environment.ts)

```typescript
export const environment = {
  production: false,
  apiBaseUrl: 'http://localhost:5000/api'
};
```

Update `apiBaseUrl` to match your API endpoint.

## 🔒 Security Considerations

⚠️ **This is a starter template. For production:**

1. Change the default JWT key in `appsettings.json`
2. Use HTTPS/TLS for all endpoints
3. Implement password hashing (use bcrypt, Argon2, etc.)
4. Add rate limiting on login/registration endpoints
5. Implement CORS properly (currently allows all origins)
6. Add input validation & sanitization
7. Use parameterized SQL queries (EF Core does this)
8. Add authorization checks for all protected endpoints
9. Implement refresh token rotation
10. Add audit logging

## 🧪 Testing

### Backend

```bash
cd src/api
dotnet test
```

### Frontend

```bash
cd src/web
npm test
```

## 📝 Notes

- The API uses **EF Core** for data access but database schema is managed via **DbUp** SQL scripts (not EF migrations)
- JWT tokens expire after 60 minutes (configurable)
- Follow/Like operations use unique constraints to prevent duplicates
- Cascading deletes ensure referential integrity

## 🤝 Contributing

This is a starter template. Feel free to customize models, add features, and extend functionality.

## 📄 License

MIT License - feel free to use this as a template for your projects.

