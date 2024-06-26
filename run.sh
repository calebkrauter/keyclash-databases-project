#!/bin/bash

set -e

IMAGE_NAME="vue-game"
CONTAINER_NAME="vue-game-container"

echo "Building Docker image..."
docker build -t $IMAGE_NAME .