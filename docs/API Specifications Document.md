### **1. User Authentication Service**

- **POST /api/auth/register** – Register a new user.
- **POST /api/auth/login** – Authenticate a user and return a JWT token.

### **2. Image Upload Service**

- **POST /api/images/upload** – Upload an image for processing.
- **GET /api/images/{imageId}/status** – Get the processing status of an image.
- **GET /api/images/{imageId}/download** – Download the processed image.



------

## **API Specifications Document**

### 1. **Introduction**

The API Specifications Document outlines the detailed API endpoints for the **Image Processing Application**, including request formats, response formats, authentication mechanisms, and error handling. This document is designed to guide developers in integrating with the API and ensuring seamless communication between the various microservices of the application.

### 2. **API Authentication and Authorization**

#### 2.1 **Authentication Mechanism**

- The application uses **JWT (JSON Web Tokens)** for secure user authentication.
- **Login**: Users authenticate by providing their email and password. If the credentials are valid, a JWT is issued.
- **Authorization**: The JWT token must be included in the **Authorization** header as `Bearer <token>` for accessing protected endpoints. The token is used to verify the identity of the user and enforce role-based access control (RBAC).

#### 2.3 **Session Management**

- JWT tokens are valid for a predefined period (e.g., 22hour).
- If the token is expired, the user will need to authenticate again.

------

### 3. **API Endpoints**

#### 3.1 **User Authentication Service**

1. **POST /api/user/signup**

   - **Description**: Registers a new user with an email and password.

   - Request Body:

     ```json
     {
       "name": "Jon Doe",
       "email": "jon.doe@example.com",
       "password": "J@dododo111"
     }
     
     ```

   - Response:

     - 200 OK: Successfully registered the user.

       ```json
       {
         "msg": "User signed up successfully",
         "data": {
           "user": "user info",
           "status": true
         }
       }
       
       ```
     
     - 400 Bad Request: Invalid input.
     
       ```json
       {
         "error": "Invalid email or password format."
       }
       ```

2. **POST /api/user/login**

   - **Description**: Authenticates a user and returns a JWT token.

   - Request Body:

     ```json
     {
       "email": "jon.doe@example.com",
       "password": "J@dododo111"
     }
     
     ```

   - Response:

     - 200 OK: Authentication successful, JWT token returned.

       ```json
       {
         "msg": "User logged in successfully",
         "data": {
           "token": "your_token_value_here",
           "status": true
         }
       }
       
       ```
     
     - 401 Unauthorized
     
       : Incorrect credentials.
     
       ```json
       {
         "msg": "Invalid email or password",
         "status": 401,
         "error": "login"
       }
       ```

   

------

#### 3.2 **Image Upload Service**

1. **POST /api/images/upload**

   - **Description**: Allows users to upload an image for processing.

   - Request Headers:

     - **Authorization**: `Bearer <jwt_token>`
     - **Content-Type**: multipart/form-data
     
   - Request Body:

     - Multipart form-data with the image file and processing options.

     ```json
     {
       "image": "<image_file>",
       "processingOptions": [
         { "type": "resize", "width": 500, "height": 400 },
         { "type": "compress", "quality": 50 }
       ]
     }
     
     ```

   - Response:

     - 201 Created: Image successfully uploaded and queued for processing.

       ```json
       {
         "message": "Image uploaded successfully.",
         "imageId": "12"
       }
       ```
       
     - 400 Bad Request: Invalid image format or size.
     
       ```json
       {
         "error": "Unsupported image format or file size too large."
       }
       ```
       
     - 401 Unauthorized: Missing or invalid token.
     
       ```json
       {
         "error": "Unauthorized. Please log in."
       }
       ```

2. **GET /api/images/status/{imageId}**

   - **Description**: Retrieves the processing status of an image.

   - Request Headers

     - **Authorization**: `Bearer <jwt_token>`

   - Response:

     - 200 OK: Status information.

       ```json
    {
         "status": "in progress",
      "imageId": "abc123"
       }
    ```
       
     - 404 Not Found: Image ID does not exist.
     
       ```json
       {
         "error": "Image not found."
    }
       ```

3. **GET /api/images/{imageId}/download**

   - **Description**: Allows the user to download the processed image.

   - Request Headers:

     - **Authorization**: `Bearer <jwt_token>`

   - Response:

     - 200 OK: Direct URL for downloading the image.

       ```json
       {
         "downloadUrl": "https://s3.amazonaws.com/bucket/processed_image.jpg"
       }
       ```
       
     - 404 Not Found: Image not found or not processed yet.
     
       ```json
       {
         "error": "Processed image not available."
       }
       ```

------

