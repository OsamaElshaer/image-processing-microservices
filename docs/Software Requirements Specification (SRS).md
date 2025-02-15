1. # Software Requirements Specification (SRS)

   **Project Title:** Image Processing Application
    **Prepared By:** Osama Elshaer
    **Date:** 02/15/2025

   ------

   ## 1. Introduction

   ### 1.1 Purpose

   This document defines the software requirements for the Image Processing Application, designed using a microservices architecture. The application provides a scalable, modular solution for users to upload, process, and retrieve images, supporting various operations such as resizing, filtering, watermarking, and format conversion. This SRS outlines the functional, non-functional, and system architecture requirements, providing the necessary guidance for development, testing, and deployment.

   ### 1.2 Scope

   The Image Processing Application is a cloud-based service that facilitates asynchronous image processing. Users interact with the system through an API to upload images and specify processing tasks. The backend leverages microservices for scalability and fault tolerance, ensuring high availability and efficient processing. Key features include:

   - Image upload and storage
   - Image processing (resize, filters, watermarking, format conversion)
   - Task notification
   - User management

   This application is deployed in a distributed environment using Docker and Docker Compose. The system components include PostgreSQL for metadata storage, RabbitMQ for messaging, Redis for caching, and the ELK stack for centralized logging.

   ------

   ## 2. Overall Description

   ### 2.1 Product Perspective

   The Image Processing Application is built on a microservices architecture, ensuring modularity and scalability. Each service performs a specific function, such as handling image uploads, processing tasks, sending notifications, or managing user data. The system is designed to operate independently, allowing for easy scaling of individual services based on demand.

   ### 2.2 Product Features

   1. **Image Upload**: Users can upload images via an API.

   2. **Asynchronous Image Processing**: Tasks such as resizing, filtering, watermarking, and format conversion are queued and executed asynchronously.

   3. Image Processing Tasks

      :

      - Resize
      - Apply filters (e.g., grayscale, blur, sharpen)
      - Watermark images
      - Convert image formats (e.g., PNG to JPEG)

   4. **User Notifications**: Notifications are sent to users upon task completion via email.

   5. **Logging**: Logs are maintained for monitoring, debugging, and auditing purposes.

   6. **User Authentication and Management**: Users can register, authenticate, and manage their profiles.

   ### 2.3 User Classes and Characteristics

   The system serves two primary user classes:

   - **End Users**: Users who upload images, process them, and receive notifications upon task completion.
   - **Admin Users**: Users who manage system performance, review logs, monitor system health, and handle user accounts.

   ### 2.4 Operating Environment

   - **Backend**: Node.js microservices containerized with Docker.
   - **Storage**: Local storage in `upload-image-service`.
   - **Database**: PostgreSQL for metadata storage.
   - **Message Queue**: RabbitMQ for handling high-concurrency tasks.
   - **Caching**: Redis for storing image processing statuses.
   - **Logging**: ELK Stack (Elasticsearch, Logstash, Kibana) for centralized logging.
   - **Monitoring**: OpenTelemetry for tracing and Prometheus for metrics.

   ### 2.5 Assumptions and Dependencies

   - Users must have reliable internet connectivity.
   - RabbitMQ must handle high concurrency without performance degradation.
   - Secure HTTPS connections are required for all communications.

   ------

   ## 3. Functional Requirements

   ### 3.1 User Service

   - **FR1**: Users can register and log in using email and password.
   - **FR2**: The service authenticates users using JWT tokens.
   - **FR3**: User profile management functionalities.

   ### 3.2 Upload Image Service

   - **FR4**: Accepts image files via the API (`/api/images/upload`).
   - **FR5**: Validates image formats (JPEG, PNG) and file sizes.
   - **FR6**: Stores images locally.
   - **FR7**: Enqueues processing tasks in RabbitMQ.
   - **FR8**: Exposes an API (`/api/images/status/:id`) for retrieving image processing status (using long polling with Redis).

   ### 3.3 Process Image Service

   - **FR9**: Retrieves image metadata from storage.
   - **FR10**: Processes images using Sharp.
   - **FR11**: Sends status updates to Redis and Upload Image Service.

   ### 3.4 Notification Service

   - **FR12**: Sends email notifications when processing is completed.

   ### 3.5 API Gateway (Nginx)

   - **FR13**: Routes requests to the appropriate microservices.
   - **FR14**: Enforces authentication and authorization using JWT tokens.

   ### 3.6 Logging and Monitoring

   - **FR15**: All logs are forwarded to the ELK stack.
   - **FR16**: OpenTelemetry collects distributed traces, and Prometheus monitors system metrics.

   ------

   ## 4. Non-Functional Requirements

   ### 4.1 Performance Requirements

   - The system shall support up to 1,000 concurrent image uploads.
   - Image processing tasks shall be completed within 5 seconds for standard operations.

   ### 4.2 Scalability Requirements

   - The architecture shall be horizontally scalable, allowing additional instances of microservices to handle increased load.

   ### 4.3 Security Requirements

   - All communication between services shall be encrypted using HTTPS.
   - JWT-based authentication ensures secure access control.

   ### 4.4 Availability Requirements

   - The system shall achieve an uptime of 99.9%.
   - Failed tasks shall be retried with an exponential backoff strategy.

   ### 4.5 Logging and Monitoring

   - System logs shall be centralized and queryable in real time.
   - Critical failures shall trigger alerts for proactive resolution.

   ------

   ## 5. System Models

   ### 5.1 Architecture Diagram

   The system follows a microservices-based architecture, comprising the following components:

   - **API Gateway (Nginx)**
   - **User Service**
   - **Upload Image Service**
   - **Process Image Service**
   - **Notification Service**
   - **Message Queue (RabbitMQ)**
   - **Redis (for caching image processing status)**
   - **PostgreSQL (for metadata storage)**
   - **Logging (ELK Stack)**
   - **Monitoring (OpenTelemetry, Prometheus)**

   ### 5.2 Sequence Diagram

   1. The user uploads an image via the API Gateway.
   2. The API Gateway routes the request to the Upload Image Service.
   3. The Upload Image Service stores the image locally and enqueues a processing task in RabbitMQ.
   4. The Process Image Service retrieves the task and processes the image.
   5. The processed image status is updated in Redis.
   6. The Notification Service sends an email notification to the user upon task completion.
   7. The user retrieves the image processing status via the API (`/api/images/status/:id`).

   ------

   ## 6. Future Enhancements

   - Support for additional image processing features.
   - WebSocket-based real-time status updates.
   - Multi-user role-based access control.

   ------

   This updated SRS aligns with your current microservices implementation, including Redis caching, OpenTelemetry, and Prometheus. Let me know if any further refinements are needed!
