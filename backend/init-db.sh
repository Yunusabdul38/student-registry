#!/usr/bin/env bash
set -x
set -eo pipefail

# Check for sqlx installation
if ! [ -x "$(command -v sqlx)" ]; then
  echo >&2 "Error: sqlx is not installed."
  echo >&2 "Use:"
  echo >&2 " cargo install --version='~0.8' sqlx-cli --no-default-features --features rustls,postgres"
  echo >&2 "to install it."
  exit 1
fi

# Set default values for database configuration
DB_PORT="${DB_PORT:=5432}"
SUPERUSER="${SUPERUSER:=postgres}"
SUPERUSER_PWD="${SUPERUSER_PWD:=fanofafan}"
APP_DB_NAME="${APP_DB_NAME:=student-registry}"
CONTAINER_NAME="${CONTAINER_NAME:=student-registry}"
POSTGRES_VERSION="${POSTGRES_VERSION:=15}"

if [[ -z "${SKIP_DOCKER}" ]]
then
  # Check if a container with the same name already exists
  EXISTING_CONTAINER=$(docker ps -a --filter "name=${CONTAINER_NAME}" --format '{{.ID}}')

  if [[ -n $EXISTING_CONTAINER ]]; then
    # Check if the container is running
    RUNNING_CONTAINER=$(docker ps --filter "name=${CONTAINER_NAME}" --format '{{.ID}}')

    if [[ -n $RUNNING_CONTAINER ]]; then
      echo >&2 "Container ${CONTAINER_NAME} is already running with ID ${RUNNING_CONTAINER}"
      echo >&2 "Reusing existing container..."
    else
      echo >&2 "Container ${CONTAINER_NAME} exists but is not running. Starting it..."
      docker start ${CONTAINER_NAME}
    fi
  else
    # If no container exists with this name, create a new one
    echo >&2 "Creating new container ${CONTAINER_NAME}..."
    docker run \
      --name "${CONTAINER_NAME}" \
      --env POSTGRES_USER=${SUPERUSER} \
      --env POSTGRES_PASSWORD=${SUPERUSER_PWD} \
      --env POSTGRES_DB=${APP_DB_NAME} \
      --health-cmd="pg_isready -U ${SUPERUSER} || exit 1" \
      --health-interval=1s \
      --health-timeout=5s \
      --health-retries=5 \
      --publish "${DB_PORT}":5432 \
      --detach \
      postgres:${POSTGRES_VERSION} -N 1000
  fi

  # Wait for container to be healthy
  until [ \
    "$(docker inspect -f "{{.State.Health.Status}}" ${CONTAINER_NAME} 2>/dev/null)" == \
    "healthy" \
  ]; do
    # Check if the container is running at all
    if ! docker ps --filter "name=${CONTAINER_NAME}" --format '{{.ID}}' | grep -q .; then
      echo >&2 "Container ${CONTAINER_NAME} is not running. There might be an issue with starting it."
      exit 1
    fi

    echo >&2 "Postgres is still unavailable - sleeping"
    sleep 1
  done
fi

echo >&2 "Postgres is up and running on port ${DB_PORT} - running migrations now!"

# Set up DATABASE_URL and run migrations
DATABASE_URL=postgres://${SUPERUSER}:${SUPERUSER_PWD}@localhost:${DB_PORT}/${APP_DB_NAME}
export DATABASE_URL

# Create database if it doesn't exist
sqlx database create

# Run migrations
sqlx migrate run

# Get the container ID to provide in the completion message
CONTAINER_ID=$(docker ps --filter "name=${CONTAINER_NAME}" --format '{{.ID}}')

echo >&2 "Postgres has been migrated, ready to go!"
echo >&2 "To stop the PostgreSQL instance, use the command:"
echo >&2 " docker kill ${CONTAINER_ID}"
