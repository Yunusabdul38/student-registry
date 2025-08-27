#!/bin/bash

# Student Registry Database Stop Script
# This script stops the PostgreSQL Docker containers

set -e  # Exit on any error

echo "🛑 Stopping Student Registry Database..."

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

print_status() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

print_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

# Check what to do based on command line arguments
case "${1:-stop}" in
    "stop")
        print_status "Stopping containers..."
        docker-compose stop
        print_success "Containers stopped. Data is preserved."
        print_status "To start again, run: ./start-db.sh"
        ;;
    "down")
        print_status "Stopping and removing containers..."
        docker-compose down
        print_success "Containers stopped and removed. Data is preserved."
        print_status "To start again, run: ./start-db.sh"
        ;;
    "clean")
        print_warning "This will stop containers AND delete all data!"
        read -p "Are you sure? (y/N): " -n 1 -r
        echo
        if [[ $REPLY =~ ^[Yy]$ ]]; then
            print_status "Stopping containers and removing all data..."
            docker-compose down -v
            print_success "Everything cleaned up!"
        else
            print_status "Cancelled."
        fi
        ;;
    *)
        echo "Usage: $0 [stop|down|clean]"
        echo ""
        echo "Commands:"
        echo "  stop  - Stop containers (default)"
        echo "  down  - Stop and remove containers"
        echo "  clean - Stop containers and delete ALL data"
        echo ""
        exit 1
        ;;
esac