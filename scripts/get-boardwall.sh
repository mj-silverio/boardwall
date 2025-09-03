#!/bin/bash
VERSION=v1.1.1
echo "get-boardwall.sh version $VERSION"

# Starting clean
rm -rf *

# Check for docker
if ! command -v docker &> /dev/null; then
    echo "Docker is not installed. Please install Docker and try again."
    exit 1
fi

# Check for docker compose (docker-compose or docker compose)
if ! command -v docker-compose &> /dev/null && ! docker compose version &> /dev/null; then
    echo "Docker Compose is not installed. Please install Docker Compose and try again."
    exit 1
fi

# Check for docker buildx
if ! docker buildx version &> /dev/null; then
    echo "Warning: Docker Buildx is not installed. Some advanced build features may not be available."
fi

# Pull images
echo "Pulling postgres:15..."
docker pull postgres:15 || { echo "Failed to pull postgres:15"; exit 1; }

# Create docker network 'pnet' if it doesn't exist
if ! docker network ls --format '{{.Name}}' | grep -wq pnet; then
    echo "Creating docker network 'pnet'..."
    docker network create pnet || { echo "Failed to create network 'pnet'"; exit 1; }
else
    echo "Docker network 'pnet' already exists. Skipping creation."
fi

# Attempt to automatically detect HOST_IP if not set

if [ -z "$HOST_IP" ]; then
    HOST_IP=$(hostname -I | awk '{print $1}')
    if [ -z "$HOST_IP" ]; then
        # Fallback for macOS or if hostname -I fails
        HOST_IP=$(ipconfig getifaddr en0 2>/dev/null)
    fi
    if [ -z "$HOST_IP" ]; then
        echo "Could not automatically determine HOST_IP."
    else
        echo "Detected HOST_IP: $HOST_IP"
    fi
fi

# Ensure HOST_IP is set
if [ -z "$HOST_IP" ]; then
    echo "HOST_IP is not set. Please set the HOST_IP environment variable or provide it interactively."
    exit 1
fi

# Create .env.1 file with specified contents
cat > .env.1 <<EOF
# SERVER_PORT=8080
DB_HOST=db
DB_PORT=5432
DB_USERNAME=postgres
DB_PASSWORD=postgres
BASE_FRONTEND_URLS=http://localhost:4221,http://$HOST_IP:4221
API_URL=http://$HOST_IP:8888/api/v1
EOF

echo ".env.1 file created with database and HOST_IP configuration."

# Create docker volume 'db_data' if it doesn't exist
if ! docker volume ls --format '{{.Name}}' | grep -wq db_data; then
    echo "Creating docker volume 'db_data'..."
    docker volume create db_data || { echo "Failed to create volume 'db_data'"; exit 1; }
else
    echo "Docker volume 'db_data' already exists. Skipping creation."
fi
# Stop and remove existing containers if they exist
if docker ps -a --format '{{.Names}}' | grep -wq boardwall-postgres; then
    echo "Stopping existing boardwall-postgres container..."
    docker stop boardwall-postgres || { echo "Failed to stop boardwall-postgres"; exit 1; }
    echo "Removing existing boardwall-postgres container..."
    docker rm -f boardwall-postgres || { echo "Failed to remove boardwall-postgres"; exit 1; }
fi

if docker ps -a --format '{{.Names}}' | grep -wq boardwall-app; then
    echo "Stopping existing boardwall-app container..."
    docker stop boardwall-app || { echo "Failed to stop boardwall-app"; exit 1; }
    echo "Removing existing boardwall-app container..."
    docker rm -f boardwall-app || { echo "Failed to remove boardwall-app"; exit 1; }
fi

# Run containers interactively (customize as needed)
echo "Running postgres:15 container..."
docker run -d \
    --name boardwall-postgres \
    --hostname db \
    -p 8432:5432 \
    -v db_data:/var/lib/postgresql/data \
    --env POSTGRES_USER=postgres \
    --env POSTGRES_PASSWORD=postgres \
    --env POSTGRES_DB=boardwall \
    --network pnet \
    --restart always \
    postgres:15

# Clone the public git repository
REPO_URL="https://github.com/mj-silverio/boardwall.git"
TARGET_DIR="boardwall"

if [ -d "$TARGET_DIR" ]; then
    echo "Directory '$TARGET_DIR' already exists. Skipping clone."
else
    echo "Cloning repository from $REPO_URL into $TARGET_DIR..."
    git clone "$REPO_URL" "$TARGET_DIR" || { echo "Failed to clone repository."; exit 1; }
fi

cd $TARGET_DIR

echo "Copying .env.1 to project directory..."
cp ../.env.1 .env
cp ../.env.1 .env.1

echo y | docker image prune

# Create and bootstrap buildx builder if it doesn't exist
if ! docker buildx ls | grep -q mybuilder; then
    echo "Creating and bootstrapping buildx builder 'mybuilder'..."
    docker buildx create --name mybuilder --use || { echo "Failed to create buildx builder"; exit 1; }
    docker buildx inspect mybuilder --bootstrap || { echo "Failed to bootstrap buildx builder"; exit 1; }
else
    echo "Buildx builder 'mybuilder' already exists. Skipping creation."
fi

ARCH="amd64"
IMAGE_NAME="boardwall-aio"
docker buildx build \
    --platform linux/${ARCH} \
    --load \
    -t ${IMAGE_NAME}:latest-${ARCH} \
    -t ${IMAGE_NAME}:$VERSION-${ARCH}
    -f Dockerfile .

sleep 5

echo "Running boardwall-aio container..."
# docker run -d \
#     --name boardwall-app \
#     --hostname boardwall-1 \
#     -p 4221:80 \
#     -p 8888:8080 \
#     --env-file ./.env.1 \
#     --network pnet \
#     --restart always \
#     ${IMAGE_NAME}
docker compose -f docker-compose-1.yml up -d

echo "Boardwall containers are now running."
echo "You can access the Boardwall application at http://$HOST_IP:4221"

echo "Postgres is running on port 8432. You can connect to it using the credentials in .env.1."
echo "To stop the containers, use 'docker stop boardwall-postgres boardwall-app'."
echo "To remove the containers, use 'docker rm boardwall-postgres boardwall-app'."
echo "To remove the network, use 'docker network rm pnet'."
echo "To remove the volume, use 'docker volume rm db_data'."
echo "To remove the .env.1 file, use 'rm .env.1'."
echo "To view logs, use 'docker logs -f boardwall-postgres' and 'docker logs -f boardwall-app'."
echo "To view all containers (including stopped), use 'docker ps -a'."

sleep 5
docker ps -a | grep boardwall
docker logs -f boardwall-app
echo "Script completed successfully."
