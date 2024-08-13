# Deploy by running sh ./deploy.sh
#!/bin/bash
echo Deploying KeyClash backend to ECS
echo Attempting Login.
aws ecr-public get-login-password --region us-east-1 | docker login --username AWS --password-stdin public.ecr.aws/c5f7s8w5

echo Attempgin build.
docker build -t keyclash-back . -f Dockerfile.backend

echo Tagging backend image.
docker tag keyclash-back:latest public.ecr.aws/c5f7s8w5/keyclash-back:latest

echo Pushing backend.
docker push public.ecr.aws/c5f7s8w5/keyclash-back:latest


echo Deploying KeyClash frontend to ECS
echo Attempting Login.
aws ecr-public get-login-password --region us-east-1 | docker login --username AWS --password-stdin public.ecr.aws/c5f7s8w5

echo Attempgin build.
docker build -t keyclash-front . -f Dockerfile.frontend

echo Tagging backend image.
docker tag keyclash-front:latest public.ecr.aws/c5f7s8w5/keyclash-front:latest

echo Pushing backend.
docker push public.ecr.aws/c5f7s8w5/keyclash-front:latest