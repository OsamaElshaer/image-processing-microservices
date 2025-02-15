# Image Processing Application

## Overview

This application is a microservices-based system that handles user authentication, image uploads, image processing, and notifications. It utilizes RabbitMQ for inter-service communication, Redis for caching, and OpenTelemetry for distributed tracing and ELK Stack (Elasticsearch, Logstash, Kibana) for distributed logging and nginx as gateway.

## Architecture

The application consists of the following microservices:

1. **User Service** - Handles authentication and user management.
2. **Notification Service** - Sends email notifications.
3. **Upload Image Service** - Manages image uploads and status tracking.
4. **Process Image Service** - Processes uploaded images asynchronously.

## Tech Stack

-   **Backend:** Node.js
-   **Database:** PostgreSQL
-   **Caching:** Redis
-   **Messaging Queue:** RabbitMQ
-   **Gateway:** Nginx
-   **Logging & Monitoring:** Winston, ELK Stack (Elasticsearch, Logstash, Kibana), OpenTelemetry
-   **Containerization:** Docker & Docker Compose

## Services

### 1. User Service

-   **Endpoints:**
    -   `POST /api/users/signup` - Register a new user
    -   `POST /api/users/login` - Authenticate a user
-   **Communicates with:** Notification Service via RabbitMQ

### 2. Notification Service

-   **Listens for:** Messages from User Service
-   **Function:** Sends emails

### 3. Upload Image Service

-   **Endpoints:**
    -   `POST /api/images/upload` - Upload an image
    -   `GET /api/images/status/:id` - Check image processing status (Uses long polling)
-   **Stores:** Images locally
-   **Communicates with:** Process Image Service via RabbitMQ

### 4. Process Image Service

-   **Listens for:** Image upload events from Upload Image Service
-   **Processes:** Images asynchronously
-   **Sends updates to:** Upload Image Service via RabbitMQ

## Installation & Setup

### Prerequisites

-   Docker & Docker Compose
-   Node.js & npm

### Steps

1. Clone the repository:
    ```bash
    git clone https://github.com/OsamaElshaer/image-processing-microservices
    ```
2. Navigate to the project directory:
    ```bash
    cd your-project
    ```
3. Configure environment variables for each service.
4. Start the application:
    ```bash
    docker-compose up -d
    ```

## Logging & Monitoring

-   **Winston** for local logging
-   **ELK Stack** for centralized log aggregation
-   **OpenTelemetry** for distributed tracing
-   **Jeager** serve as the backend storage and UI for visualizing traces.

## License

This project is licensed under MIT.
