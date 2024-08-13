#!/bin/bash
echo "Running Docker container"
docker-compose build
docker-compose down
docker-compose up
