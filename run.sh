#!/bin/bash
echo "Building Docker container"

docker-compose down
docker-compose up
