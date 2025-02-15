- ### **System Architecture Document for Image Processing Application**

  ------

  ## 1. **Introduction**

  ### 1.1 **Purpose**

  The purpose of this document is to define the system architecture for the Image Processing Application based on a microservices architecture. This document will cover the design of individual microservices and their interactions.

  ### 1.2 **Scope**

  The system architecture will include:

  - Definition of individual microservices.
  - Communication patterns between services.
  - Message flows and integration.
  - Deployment strategies for scalability and resilience.

  ------

  ## 2. **System Overview**

  The Image Processing Application is a distributed system built using a microservices architecture. Each microservice is responsible for a specific functionality, and they communicate using asynchronous messaging via RabbitMQ. The system is designed for high availability, fault tolerance, and scalability.

  ------

  ## 3. **Microservices Overview**

  ### 3.1 **List of Microservices**

  The application will be divided into the following core microservices:

  1. **API Gateway Service**
     - **Responsibilities**: Routes client requests to the appropriate microservice, handles authentication and authorization.
     - **Technologies**: Node.js, Express.js, JWT for authentication, Nginx as a gateway.
  2. **User Service**
     - **Responsibilities**: Manages user registration, authentication, and user profile management.
     - **Technologies**: Node.js, PostgreSQL (for user metadata), JWT for session management.
  3. **Image Upload Service**
     - **Responsibilities**: Accepts image uploads, validates the file format, stores the image in a storage service (e.g., local, AWS S3), and generates metadata.
     - **Technologies**: Node.js, Local storage, PostgreSQL (for image metadata).
  4. **Image Processing Service**
     - **Responsibilities**: Retrieves images and metadata from storage, performs image processing tasks (resize, filter, watermark, convert format), and stores processed images back.
     - **Technologies**: Node.js, Sharp (for image processing).
  5. **Notification Service**
     - **Responsibilities**: Sends notifications (email, SMS, push notifications) to users when they register or when their image processing is complete.
     - **Technologies**: Node.js, external notification providers (e.g., SendGrid for email).
  6. **Logging and Monitoring**
     - **Responsibilities**: Each service uses Winston for logging, and logs are forwarded to a centralized logging system (ELK Stack: Elasticsearch, Logstash, Kibana) for monitoring and debugging.
     - **Technologies**: Winston, ELK Stack.
  7. **Queue Service (RabbitMQ)**
     - **Responsibilities**: Manages message queues for asynchronous processing of tasks (e.g., queuing image processing jobs).
     - **Technologies**: RabbitMQ.

  ------

  ## 4. **Service Interactions and Message Flow**

  ### 4.1 **API Gateway to Microservices**

  The **API Gateway** is the entry point for client requests. It routes them to the appropriate microservice:

  - **Image Upload**: The API Gateway routes image upload requests to the **Image Upload Service**.
  - **User Authentication**: Routes user login and registration requests to the **User Service**.
  - **Image Processing Request**: When an image upload is successful, the **Image Upload Service** will send a message to the **Queue Service** for processing.

  ### 4.2 **Message Flow**

  - **Step 1**: User uploads an image via the API Gateway.
    - The **API Gateway** routes the image upload request to the **Image Upload Service**.
    - **Image Upload Service** stores the image on disk, generates metadata, and stores it in PostgreSQL.
    - The **Image Upload Service** then sends a message to the **Queue Service** (RabbitMQ) for image processing.
  - **Step 2**: The Queue Service places the task in a queue and triggers the Image Processing Service.
    - The **Image Processing Service** retrieves the image from local storage using the metadata, processes it, and stores the processed image back locally.
  - **Step 3**: After processing, the Image Processing Service sends a message to the Image Upload Service with the new metadata.
    - The **Image Upload Service** updates the status of the image to 'completed,' allowing the user to retrieve the response from their long polling request.

  ### 4.3 **Data Flow**

  - **User Service** stores user credentials in PostgreSQL.
  - **Notification Service** sends email notifications for user registration and completed image processing.
  - **Image Upload Service** stores image metadata in PostgreSQL and image files in local storage.
  - **Image Processing Service** uses local storage for storing processed images and PostgreSQL for metadata storage.

  ------

  ## 5. **Deployment Strategy**

  ### 5.1 **Containerization**

  Each microservice will be deployed in a **Docker container** to ensure isolation, consistency, and portability. Containers allow for easy scaling, testing, and deployment across different environments.

  ### 5.2 **Orchestration with Docker Compose & Kubernetes**

  - **Docker Compose** will be used for local development, ensuring seamless communication between microservices.
  - **Kubernetes** will be used for production deployments on **AWS EC2**, ensuring high availability and auto-scaling of microservices.

  ### 5.3 **Cloud Infrastructure**

  - **AWS EC2** for hosting the Kubernetes cluster and microservices.
  - **AWS S3** for storing images in production.
  - **AWS RDS** for managed PostgreSQL database services.
  - **RabbitMQ** hosted on AWS (or use AWS managed service for MQ).

  ### 5.4 **CI/CD Pipeline**

  - **GitHub Actions** or **GitLab CI** will be used for Continuous Integration and Continuous Deployment.
  - Automated tests will be run for each service before deployment, and code will be automatically pushed to production upon successful tests.

  ------

  ## 6. **Security Considerations**

  - **Authentication and Authorization**: JWT (JSON Web Token) will be used to secure user sessions and ensure proper access control between services.
  - **Data Encryption**: HTTPS (TLS) will be enforced for all communication between services, and sensitive data (e.g., user passwords) will be stored securely with encryption.
  - **Logging**: Winston will aggregate logs for monitoring system behavior and identifying potential security issues.
  - **Tracing and Monitoring**: OpenTelemetry is used for distributed tracing with **Jaeger**, and **Prometheus** is used for collecting system metrics.

  ------

  ## 7. **Scalability and Fault Tolerance**

  - **Horizontal Scaling**: All microservices will be designed to scale horizontally, with Kubernetes managing the scaling process.
  - **Resilience**: Each service is independent, so failure in one service (e.g., image processing) will not affect others (e.g., user service, notification service).
  - **Load Balancing**: The **API Gateway** will distribute incoming requests evenly across available instances of each service.

  ------