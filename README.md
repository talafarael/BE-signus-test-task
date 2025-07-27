# BE Signus Test Task

A robust NestJS application featuring user authentication, JWT tokens, PostgreSQL database with Drizzle ORM, Redis caching, and comprehensive API documentation.

## 🚀 Features

- **User Authentication**: Registration and login with JWT tokens
- **Database**: PostgreSQL with Drizzle ORM for migrations and queries
- **Caching**: Redis integration for performance optimization
- **API Documentation**: Auto-generated Swagger/OpenAPI documentation
- **Validation**: Input validation with class-validator
- **Testing**: Unit tests and E2E testing with Jest
- **Containerization**: Docker and Docker Compose setup
- **Security**: Password hashing with bcrypt
- **Type Safety**: Full TypeScript support

## 🛠 Tech Stack

- **Framework**: NestJS
- **Database**: PostgreSQL 15
- **ORM**: Drizzle ORM
- **Cache**: Redis 7
- **Authentication**: Passport JWT
- **Validation**: class-validator, class-transformer
- **Documentation**: Swagger/OpenAPI
- **Testing**: Jest
- **Containerization**: Docker, Docker Compose

## 📋 Prerequisites

- Node.js 18+ 
- npm or yarn
- Docker and Docker Compose
- Git

## ⚙️ Installation & Setup

### 1. Clone the Repository

```bash
git clone <repository-url>
cd be-signus-test-task
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Environment Configuration

Create a `.env` file in the root directory:

```bash
# ==============================================
# DATABASE CONFIGURATION
# ==============================================
POSTGRES_DB=signus_db
POSTGRES_USER=signus_user
POSTGRES_PASSWORD=StrongPassword123!
DATABASE_URL=postgresql://signus_user:StrongPassword123!@localhost:5432/signus_db

# ==============================================
# REDIS CONFIGURATION  
# ==============================================
REDIS_HOST=localhost
REDIS_PORT=6379
REDIS_USERNAME=
REDIS_PASSWORD=RedisPass123!
REDIS_DB=0

# ==============================================
# APPLICATION CONFIGURATION
# ==============================================
NODE_ENV=development
PORT=3000

# ==============================================
# JWT CONFIGURATION
# ==============================================
# Generate a strong secret: node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production-2024
JWT_EXPIRES_IN=7d
```

> **Security Note**: Change all passwords and secrets before deploying to production!

### 4. Start Infrastructure Services

```bash
# Start PostgreSQL and Redis
docker-compose up postgres redis -d
```

### 5. Run Database Migrations

```bash
npm run migrate
```

### 6. Start the Application

```bash
# Development mode with hot reload
npm run start:dev

# Production mode
npm run start:prod
```

The application will be available at `http://localhost:3000`

## 🐳 Docker Setup

### Full Docker Deployment

```bash
# Start all services (app, database, redis)
docker-compose up -d

# View logs
docker-compose logs -f

# Stop all services
docker-compose down
```

### Infrastructure Only

```bash
# Start only PostgreSQL and Redis
docker-compose up postgres redis -d
```

## 📖 API Documentation

Once the application is running, visit:
- **Swagger UI**: `http://localhost:3000/api`
- **OpenAPI JSON**: `http://localhost:3000/api-json`

### API Endpoints

#### Authentication

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| POST | `/auth/registration` | Register a new user | No |
| POST | `/auth/login` | Login user | No |

#### Users

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | `/users/me` | Get current user profile | Yes (JWT) |

### Example Requests

#### Register User
```bash
curl -X POST http://localhost:3000/auth/registration \
  -H "Content-Type: application/json" \
  -d '{
    "username": "john_doe",
    "fullName": "John Doe",
    "password": "securePassword123"
  }'
```

#### Login
```bash
curl -X POST http://localhost:3000/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "username": "john_doe",
    "password": "securePassword123"
  }'
```

#### Get Profile (Protected)
```bash
curl -X GET http://localhost:3000/users/me \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

## 🗄️ Database Schema

### Users Table
```sql
CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  username TEXT NOT NULL,
  "full-name" TEXT NOT NULL,
  password TEXT NOT NULL
);
```

## 🔧 Development

### Available Scripts

```bash
# Database & Migrations
npm run generate    # Generate new migration
npm run migrate     # Run pending migrations
npm run studio      # Open Drizzle Studio (database GUI)

# Development
npm run start:dev   # Start with hot reload
npm run start:debug # Start in debug mode
npm run build       # Build for production
npm run start:prod  # Start production build

# Code Quality
npm run lint        # Lint and fix code
npm run format      # Format code with Prettier

# Testing
npm run test        # Run unit tests
npm run test:watch  # Run tests in watch mode
npm run test:cov    # Run tests with coverage
npm run test:e2e    # Run end-to-end tests
npm run test:debug  # Debug tests
```

### Project Structure

```
src/
├── auth/              # Authentication module
│   ├── dto/           # Data Transfer Objects
│   ├── guards/        # Auth guards (JWT, Local)
│   ├── strategies/    # Passport strategies
│   └── ...
├── users/             # Users module
│   ├── dto/           # User DTOs
│   ├── cache/         # User caching service
│   └── ...
├── config/            # Configuration files
├── drizzle/           # Database schema and provider
├── redis/             # Redis module and service
├── common/            # Shared utilities and validators
└── main.ts            # Application entry point
```

## 🧪 Testing

### Run Tests

```bash
# All tests
npm run test

# Watch mode
npm run test:watch

# Coverage report
npm run test:cov

# E2E tests
npm run test:e2e
```

### Test Structure
- **Unit Tests**: `*.spec.ts` files alongside source code
- **E2E Tests**: `test/` directory
- **Test Configuration**: `jest` configuration in `package.json`

## 🔍 Monitoring & Debugging

### Health Checks
- **Application**: `http://localhost:3000/health` (if implemented)
- **PostgreSQL**: Docker health check included
- **Redis**: Docker health check included

### Logs
```bash
# Application logs
docker-compose logs app

# Database logs  
docker-compose logs postgres

# Redis logs
docker-compose logs redis
```

## 🚀 Production Deployment

### Environment Variables for Production

```bash
NODE_ENV=production
JWT_SECRET=<generate-strong-64-char-secret>
POSTGRES_PASSWORD=<strong-database-password>
REDIS_PASSWORD=<strong-redis-password>
```

### Security Recommendations

1. **Secrets Management**: Use environment-specific secret management
2. **JWT Secret**: Generate cryptographically secure secrets
3. **Database**: Enable SSL/TLS connections
4. **Redis**: Enable authentication and SSL
5. **Monitoring**: Implement logging and monitoring solutions
6. **Updates**: Keep dependencies updated

### Production Checklist

- [ ] Update all default passwords
- [ ] Configure proper JWT secret rotation
- [ ] Set up SSL/TLS certificates
- [ ] Configure logging and monitoring
- [ ] Set up backup strategies
- [ ] Configure reverse proxy (nginx/traefik)
- [ ] Set resource limits in Docker
- [ ] Configure health checks
- [ ] Set up CI/CD pipeline

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the UNLICENSED License.

## 📞 Support

For questions or issues, please open an issue in the repository or contact the development team.

---

**Happy Coding! 🎉**
