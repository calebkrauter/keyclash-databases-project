#Build stage
FROM node:20 AS build
WORKDIR /app
COPY package.json ./
RUN npm ci
COPY . .
RUN npm run build

#Production stage
FROM node:20-alpine
WORKDIR /app
COPY --from=build /app/dist ./dist
COPY --from=build /app/package.json ./
COPY --from=build /app/server.js ./
RUN npm ci --only=production
EXPOSE 8080
CMD ["node", "server.js"]