# Social Activity Feed API

A robust social networking API with role-based permissions, activity tracking, and user interactions (posts, likes, follows, blocks).

## 🚀 Features

### User Management
- ✅ User registration and authentication (JWT)
- ✅ Profile management
- ✅ Role-based access control (USER, ADMIN, OWNER)

### Social Interactions
- ✅ Create, read, and delete posts
- ✅ Like/unlike posts
- ✅ Follow/unfollow users
- ✅ Block/unblock users

### Activity Feed
- ✅ Real-time activity tracking
- ✅ Privacy-aware feed (respects blocks)
- ✅ Activity types: post created, post liked, user followed, deletions

### Admin Features
- ✅ Admins can delete users, posts, and likes
- ✅ Owners can promote/demote admins
- ✅ Activity logging for admin actions

## 📋 Tech Stack

- **Runtime**: Node.js + TypeScript
- **Framework**: Express.js
- **Database**: PostgreSQL
- **ORM**: Prisma
- **Authentication**: JWT + bcrypt
- **Validation**: express-validator

## 🛠️ Local Development Setup

### Prerequisites

- Node.js (v18+)
- PostgreSQL (v14+) or a cloud database (Supabase/Neon)
- Git
- Postman (for API testing)

### Step-by-Step Setup

1. **Clone the repository**
```bash
git clone https://github.com/RBalajisrinath/Inkle-Backend-Internship-Assignment.git
cd Inkle-Backend-Internship-Assignment
```

2. **Install dependencies**
```bash
npm install
```

3. **Database Setup Options**

#### Option A: Local PostgreSQL (Recommended for Development)

Install PostgreSQL locally:
- **Windows**: Download from [postgresql.org](https://www.postgresql.org/download/windows/)
- **macOS**: `brew install postgresql` or use [Postgres.app](https://postgresapp.com/)
- **Linux**: `sudo apt-get install postgresql postgresql-contrib`

Create database:
```bash
# Start PostgreSQL service
# Windows: Start from Services or pgAdmin
# macOS/Linux: sudo service postgresql start

# Connect to PostgreSQL
psql -U postgres

# Create database
CREATE DATABASE social_feed_db;
\q
```

#### Option B: Cloud Database (Easier Setup)

**Supabase (Recommended)**:
1. Go to [supabase.com](https://supabase.com)
2. Create new project
3. Go to Settings → Database
4. Copy connection string

**Neon**:
1. Go to [neon.tech](https://neon.tech)
2. Create new project
3. Copy connection string

4. **Configure environment variables**

Create a `.env` file in the project root:

```env
# Server Configuration
PORT=3000
NODE_ENV=development

# Database Configuration (Choose one based on your setup)

# Option A: Local PostgreSQL
DATABASE_URL="postgresql://postgres:yourpassword@localhost:5432/social_feed_db"

# Option B: Supabase
# DATABASE_URL="postgresql://postgres.[PASSWORD]@db.[PROJECT-REF].supabase.co:5432/postgres"

# Option C: Neon
# DATABASE_URL="postgresql://[user]:[password]@[hostname]/[dbname]"

# JWT Configuration
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
JWT_EXPIRE=7d

# CORS (allow all origins for development)
CORS_ORIGIN=*
```

5. **Initialize Database**

```bash
# Generate Prisma Client
npx prisma generate

# Run database migrations
npx prisma migrate dev

# Seed database with test data (optional but recommended)
npm run seed
```

6. **Start Development Server**

```bash
# Start with hot reload
npm run dev

# Or build and start production version locally
npm run build
npm start
```

### 🔍 Verify Local Setup

1. **Check if server is running**:
   - Open browser: `http://localhost:3000`
   - Should see: `{"message": "Social Activity Feed API", "version": "1.0.0", "status": "running"}`

2. **Check health endpoint**:
   - Open browser: `http://localhost:3000/health`
   - Should see: `{"status": "ok", "timestamp": "..."}`

3. **Test API endpoint**:
   ```bash
   # Using curl (if available)
   curl http://localhost:3000/api/posts
   
   # Should return authentication required error (which means API is working)
   ```

### 🧪 Testing with Sample Data

After running `npm run seed`, you can test with these accounts:

```
OWNER ACCOUNT:
  Email: owner@example.com
  Password: owner123

ADMIN ACCOUNT:
  Email: admin@example.com  
  Password: admin123

REGULAR USER ACCOUNTS:
  Email: alice@example.com | Password: user123
  Email: bob@example.com | Password: user123
  Email: charlie@example.com | Password: user123
```

### 📡 Testing API Endpoints Locally

1. **Import Postman Collection**:
   - Open Postman
   - Click "Import" → Select `postman_collection.json`
   - Set base URL to `http://localhost:3000`

2. **Manual Testing Steps**:
   ```bash
   # 1. Login to get token
   POST http://localhost:3000/api/auth/login
   {
     "email": "alice@example.com",
     "password": "user123"
   }
   
   # 2. Copy the returned token
   # 3. Add to headers for protected routes:
   Authorization: Bearer <your-token>
   
   # 4. Test protected endpoint
   GET http://localhost:3000/api/users/profile
   ```

### 🔧 Development Commands

```bash
# Development with auto-reload
npm run dev

# Type checking
npm run build

# Database management
npx prisma studio          # Visual database browser
npx prisma migrate reset   # Reset database
npx prisma db seed        # Re-run seed data

# View logs
# Logs appear in terminal where you ran npm run dev
```

### 🐛 Troubleshooting Local Setup

**Database Connection Issues**:
```bash
# Check if PostgreSQL is running
# Windows: Check Services
# macOS/Linux: sudo service postgresql status

# Test database connection
npx prisma db pull
```

**Port Already in Use**:
```bash
# Check what's using port 3000
# Windows: netstat -ano | findstr :3000
# macOS/Linux: lsof -i :3000

# Change port in .env file
PORT=3001
```

**Migration Issues**:
```bash
# Reset and recreate database
npx prisma migrate reset
npx prisma migrate dev
npm run seed
```

## 🛠️ Production Deployment

### Prerequisites

- Node.js (v18+)
- PostgreSQL (v14+) or a cloud database (Supabase/Neon)
- Postman (for API testing)

### Installation

1. **Clone the repository**
```bash
git clone <your-repo-url>
cd "Inkle Assignment Backend Intern"
```

2. **Install dependencies**
```bash
npm install
```

3. **Configure environment variables**

Create a `.env` file in the root directory:

```env
# Server Configuration
PORT=3000
NODE_ENV=development

# Database Configuration (Choose one)

# Option 1: Local PostgreSQL
DATABASE_URL="postgresql://postgres:yourpassword@localhost:5432/social_feed_db"

# Option 2: Supabase (Recommended for easy setup)
# DATABASE_URL="postgresql://postgres:[PASSWORD]@db.[PROJECT-REF].supabase.co:5432/postgres"

# Option 3: Neon
# DATABASE_URL="postgresql://[user]:[password]@[hostname]/[dbname]"

# JWT Configuration
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
JWT_EXPIRE=7d

# CORS
CORS_ORIGIN=*
```

4. **Setup database**

```bash
# Generate Prisma Client
npm run prisma:generate

# Run database migrations
npm run prisma:migrate

# Seed database with test data
npm run seed
```

5. **Start the server**

```bash
# Development mode with hot reload
npm run dev

# Production build
npm run build
npm start
```

The server will start on `http://localhost:3000`

## 📡 API Endpoints

### Authentication (`/api/auth`)

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| POST | `/api/auth/signup` | Register new user | No |
| POST | `/api/auth/login` | Login user | No |
| GET | `/api/auth/me` | Get current user | Yes |

### Users (`/api/users`)

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | `/api/users/profile` | Get own profile | Yes |
| GET | `/api/users/:id` | Get user by ID | Yes |
| PUT | `/api/users/profile` | Update profile | Yes |
| POST | `/api/users/follow/:id` | Follow user | Yes |
| DELETE | `/api/users/unfollow/:id` | Unfollow user | Yes |
| POST | `/api/users/block/:id` | Block user | Yes |
| DELETE | `/api/users/unblock/:id` | Unblock user | Yes |

### Posts (`/api/posts`)

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| POST | `/api/posts` | Create post | Yes |
| GET | `/api/posts` | Get all posts (paginated) | Yes |
| GET | `/api/posts/:id` | Get post by ID | Yes |
| DELETE | `/api/posts/:id` | Delete post (admin only) | Yes |
| POST | `/api/posts/:id/like` | Like post | Yes |
| DELETE | `/api/posts/:id/unlike` | Unlike post | Yes |

### Activities (`/api/activities`)

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | `/api/activities/feed` | Get activity feed | Yes |

### Admin (`/api/admin`)

| Method | Endpoint | Description | Auth Required | Role |
|--------|----------|-------------|---------------|------|
| DELETE | `/api/admin/users/:id` | Delete user | Yes | ADMIN/OWNER |
| DELETE | `/api/admin/likes/:id` | Delete like | Yes | ADMIN/OWNER |
| POST | `/api/admin/promote/:id` | Promote to admin | Yes | OWNER |
| DELETE | `/api/admin/demote/:id` | Demote admin | Yes | OWNER |

## 🧪 Test Accounts (After Running Seed)

```
OWNER:
  Email: owner@example.com
  Password: owner123

ADMIN:
  Email: admin@example.com
  Password: admin123

REGULAR USERS:
  Email: alice@example.com | Password: user123
  Email: bob@example.com | Password: user123
  Email: charlie@example.com | Password: user123
```

## 📮 Postman Collection

Import the Postman collection to test all endpoints:

1. Open Postman
2. Click "Import"
3. Select `postman_collection.json` from the project root
4. Configure environment variables:
   - `base_url`: `http://localhost:3000`
   - `token`: (auto-populated after login)

## 🔐 Authentication Flow

1. **Signup/Login** → Receive JWT token
2. **Add token to headers** for protected routes:
   ```
   Authorization: Bearer <your-token>
   ```
3. Token expires in 7 days (configurable)

## 🔧 Available Scripts

```bash
npm run dev           # Start development server
npm run build         # Build for production
npm start             # Start production server
npm run prisma:generate    # Generate Prisma client
npm run prisma:migrate     # Run database migrations
npm run prisma:studio      # Open Prisma Studio
npm run seed          # Seed database with test data
```

## 🚀 Deployment

### Quick Deploy to Render (Free)

1. **Push to GitHub**
```bash
git init
git add .
git commit -m "Social Activity Feed API"
git branch -M main
git remote add origin <your-github-repo-url>
git push -u origin main
```

2. **Create Database**
- Go to [render.com](https://render.com)
- Click "New +" → "PostgreSQL"
- Name: `social-feed-db`
- Copy the "Internal Database URL"

3. **Deploy API**
- Click "New +" → "Web Service"
- Connect your GitHub repo
- Configure:
  - **Build Command**: `npm install && npm run build && npx prisma generate && npx prisma migrate deploy`
  - **Start Command**: `npm start`

4. **Environment Variables**
```env
NODE_ENV=production
DATABASE_URL=<paste-database-url>
JWT_SECRET=<random-secret>
JWT_EXPIRE=7d
CORS_ORIGIN=*
```

5. **Seed Database**
- Go to service → "Shell" → Run: `npm run seed`
