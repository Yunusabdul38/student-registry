# Student Registry Makefile
# Convenient commands for managing the development environment

.PHONY: help setup start stop clean logs connect test dev build

# Default target
help: ## Show this help message
	@echo "Student Registry Development Commands"
	@echo "====================================="
	@awk 'BEGIN {FS = ":.*##"} /^[a-zA-Z_-]+:.*?##/ { printf "  \033[36m%-15s\033[0m %s\n", $$1, $$2 }' $(MAKEFILE_LIST)

setup: ## Initial setup - make scripts executable and start database
	@echo "🔧 Setting up development environment..."
	chmod +x init-db.sh stop-db.sh
	./init-db.sh

start: ## Start the database
	@echo "🚀 Starting database..."
	./init-db.sh

stop: ## Stop the database (preserve data)
	@echo "🛑 Stopping database..."
	./init-db.sh

down: ## Stop and remove containers (preserve data)
	@echo "🛑 Stopping and removing containers..."
	./stop-db.sh down

clean: ## Stop and remove everything including data (⚠️  destructive)
	@echo "🧹 Cleaning up everything..."
	./stop-db.sh clean

logs: ## Show database logs
	@echo "📝 Showing database logs..."
	docker-compose logs -f postgres

connect: ## Connect to the database
	@echo "🔌 Connecting to database..."
	docker-compose exec postgres psql -U postgres -d student-registry

status: ## Check database status
	@echo "📊 Database status:"
	docker-compose ps

test: ## Test database connection
	@echo "🧪 Testing database connection..."
	docker-compose exec postgres pg_isready -U postgres -d student-registry && echo "✅ Database is ready!" || echo "❌ Database is not ready"

dev: start ## Start database and run the Rust application
	@echo "🏃 Starting development environment..."
	cargo run

build: ## Build the Rust application
	@echo "🔨 Building application..."
	cargo build --release

check: ## Run cargo check
	@echo "🔍 Checking code..."
	cargo check

format: ## Format the code
	@echo "🎨 Formatting code..."
	cargo fmt

lint: ## Run clippy lints
	@echo "🔍 Running lints..."
	cargo clippy -- -D warnings

migrate: ## Run database migrations (if you have sqlx-cli)
	@echo "🔄 Running migrations..."
	sqlx migrate run --database-url "postgres://postgres:fanofafan@localhost:5432/student-registry"

reset-db: clean start ## Reset database (clean + start)
	@echo "🔄 Database reset complete!"

# Development workflow targets
install-deps: ## Install development dependencies
	@echo "📦 Installing dependencies..."
	cargo install sqlx-cli --no-default-features --features rustls,postgres

backup: ## Backup database data
	@echo "💾 Creating database backup..."
	docker-compose exec -T postgres pg_dump -U postgres student-registry > backup_$(shell date +%Y%m%d_%H%M%S).sql

restore: ## Restore database from backup (usage: make restore BACKUP=filename.sql)
	@echo "📥 Restoring database from $(BACKUP)..."
	docker-compose exec -T postgres psql -U postgres -d student-registry < $(BACKUP)