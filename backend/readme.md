# Student Registry Database Setup

This project uses Docker to set up a PostgreSQL database for the Student Registry application.

## 🚀 Quick Start

### Prerequisites

- [Docker](https://docs.docker.com/get-docker/)
- [Docker Compose](https://docs.docker.com/compose/install/)

### 1. Clone and Setup

```bash
# Make the scripts executable
chmod +x start-db.sh stop-db.sh

# Start the database
./start-db.sh
```

### 2. Run Your Rust Application

```bash
cargo run
```

## 📋 Database Details

- **Connection URL**: `postgres://postgres:fanofafan@localhost:5432/student-registry`
- **Host**: `localhost`
- **Port**: `5432`
- **Username**: `postgres`
- **Password**: `fanofafan`
- **Database**: `student-registry`

## 🛠️ Available Scripts

### Start Database
```bash
./start-db.sh
```
- Starts PostgreSQL in Docker
- Creates the database and user
- Runs initialization scripts
- Shows connection information

### Stop Database
```bash
# Just stop (data preserved)
./stop-db.sh

# Stop and remove containers (data preserved)
./stop-db.sh down

# Stop and delete ALL data (⚠️ destructive)
./stop-db.sh clean
```

## 🔧 Useful Commands

### Check Database Status
```bash
docker-compose ps
```

### View Database Logs
```bash
docker-compose logs postgres
```

### Connect to Database
```bash
# Using Docker
docker-compose exec postgres psql -U postgres -d student-registry

# Using local psql (if installed)
psql "postgres://postgres:fanofafan@localhost:5432/student-registry"
```

### Run SQL Commands
```bash
# Example: List all tables
docker-compose exec postgres psql -U postgres -d student-registry -c "\dt"
```

## 📁 Project Structure

```
your-project/
├── docker-compose.yml          # Docker Compose configuration
├── start-db.sh                # Database startup script
├── stop-db.sh                 # Database stop script
├── scripts/
│   └── init.sql               # Database initialization script
├── .env                       # Environment variables
└── src/                       # Your Rust application
```

## 🔄 Environment Variables

The `.env` file should contain:

```env
DATABASE_URL="postgres://postgres:fanofafan@localhost:5432/student-registry"
DATABASE_NAME="student-registry"
DATABASE_POOL_MAX_SIZE="10"
POSTGRES_PASSWORD="fanofafan"
APP_ENVIRONMENT="development"
PORT="8080"
```

## 🐛 Troubleshooting

### Database Connection Issues
1. Check if Docker is running: `docker ps`
2. Check container status: `docker-compose ps`
3. View logs: `docker-compose logs postgres`
4. Restart: `./stop-db.sh && ./start-db.sh`

### Port Already in Use
If port 5432 is already in use, modify `docker-compose.yml`:
```yaml
ports:
  - "5433:5432"  # Use different external port
```

Then update your connection URL:
```env
DATABASE_URL="postgres://postgres:fanofafan@localhost:5433/student-registry"
```

### Permission Issues on Scripts
```bash
chmod +x start-db.sh stop-db.sh
```

## 🏗️ Customization

### Adding Your Own Database Schema
Edit `scripts/init.sql` to add your tables:

```sql
CREATE TABLE students (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### Changing Database Credentials
1. Update `docker-compose.yml` environment variables
2. Update your `.env` file
3. Restart: `./stop-db.sh clean && ./start-db.sh`

## 📦 Running Everything in Docker

To run your Rust app in Docker too, uncomment the `student-api` service in `docker-compose.yml` and create a `Dockerfile`:

```dockerfile
FROM rust:1.70 as builder
WORKDIR /app
COPY . .
RUN cargo build --release

FROM debian:bookworm-slim
WORKDIR /app
COPY --from=builder /app/target/release/your-app-name .
EXPOSE 2005
CMD ["./your-app-name"]
```

## 🤝 Contributing

1. Fork the project
2. Create your feature branch
3. Test with the provided scripts
4. Submit a pull request

## 📝 License

Add your license information here.