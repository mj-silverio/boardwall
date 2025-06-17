# Stage 1: Build Angular app # ng and yarn included
FROM node:24-alpine AS angular-build 
WORKDIR /app
COPY frontend/package*.json ./
COPY frontend/ .
COPY .env .
RUN yarn install
RUN yarn run prebuild
RUN yarn run build:prod
RUN rm .env

# Stage 2: Build Spring Boot app
FROM maven:3.8.5-openjdk-17 AS springboot-build
WORKDIR /app
COPY backend/pom.xml .
RUN mvn dependency:go-offline
COPY backend/ .
RUN mvn clean package -DskipTests

# Stage 3: Combine Angular and Spring Boot
FROM node:24-alpine
RUN apk add --no-cache openjdk17 curl iputils-ping
RUN npm i -g pm2
WORKDIR /app/backend/
COPY --from=springboot-build /app/target/*.jar boardwall.jar
WORKDIR /app/frontend/
COPY --from=angular-build /app/dist/boardwall/browser .
COPY package.json .
EXPOSE 80 8080
ENTRYPOINT ["yarn", "run", "run-services"]