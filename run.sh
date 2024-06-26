#!/bin/bash

set -e

IMAGE_NAME="vue-game"
CONTAINER_NAME="vue-game-container"
HOST_PORT=8080
CONTAINER_PORT=8080

echo "Building Docker image..."
docker build -t $IMAGE_NAME .

docker run -d -p $HOST_PORT:$CONTAINER_PORT --name $CONTAINER_NAME $IMAGE_NAME
echo "Your app should be running at http://localhost:$HOST_PORT"