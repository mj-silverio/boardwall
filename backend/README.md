# Boardwall Backend

Type: `Springboot Application - Java 17, jar file`

1. DB: `Postgres`
2. JDBC DB driver: `postgres-driver`
3. PORT: `8001`

## Swagger UI / Open API 3 Springdocs

Go to: `http://localhost:8080/swagger-ui/index.html`

## Design

![Backend Entities](../design/backend-entities.png)

## Todos in Gantt

```mermaid
gantt
    title Backend Todos
    dateFormat  YYYY-MM-DD

    section Database
    Design schema          :done    des1, 2025-04-19,2025-04-20
    Implement migrations   :done,   des2, 2025-04-19,2025-04-20

    section API
    Define endpoints       :done     api1, 2025-04-19,2025-04-20
    Implement controllers  :active,  api2, 2025-04-20,2025-04-21

    section Testing
    Write unit tests       :         test1, 2025-04-21,2025-04-22
    Perform integration tests :      test2, 2025-04-21,2025-04-22

```

## Done:

1. Apply Openapi Swagger for java app

## Continue:

1. Fix Cors, learn from orange-moon
2. Adjustments in zoned date time
3. Apply Redis caching for pagination
