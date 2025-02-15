# **Database Design Document**

## **1. Introduction**

### **1.1 Purpose**

The purpose of this document is to outline the database design for the Image Processing Application. The design is focused on PostgreSQL, which will be used for storing metadata about images, user information, and logs. The database design will facilitate efficient data access, management, and scalability within a microservices architecture.

### **1.2 Scope**

This document will cover the design of the database schema, data models, relationships, data access patterns, and performance considerations. It will also address storage strategies for image data and logs, ensuring high availability, reliability, and performance.

------

## **2. Database Schema Overview**

The database will consist of the following primary entities:

- **Images**: Contains metadata related to each image uploaded by users.
- **Users**: Stores information about the users, including authentication and roles.
- These entities are designed to be highly normalized, ensuring data integrity and efficient querying. PostgreSQL’s relational model will be leveraged for complex queries and transactions.

------

## **3. Data Model**

### **3.1 Images Table**

The **Images** table stores metadata related to the images uploaded by users. This table tracks the state of each image as it undergoes processing.

#### **Table Definition:**

```sql
CREATE TYPE image_status AS ENUM ('failed', 'processing', 'completed');

CREATE TABLE images (
    image_id SERIAL PRIMARY KEY,                
    user_id UUID NOT NULL,
    image_hash VARCHAR(64) UNIQUE,                      
    file_name VARCHAR(255) NOT NULL,            
    file_path VARCHAR(512) NOT NULL, 
    processed_path VARCHAR(512),         
    status image_status NOT NULL,               
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,  
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP   
);

```

#### **Key Fields:**

- **image_id**: The primary key, uniquely identifies each image in the system.
- **user_id**: A reference to the user who uploaded the image, establishing a relationship between the image and the user.
- **image_hash**: hashing the user ID with the file_name to prevent the duplication.
- **file_name**: The original name of the image file, allowing for reference and potential download.
- **file_path**: The location in cloud storage (e.g., AWS S3) where the image is stored.
- **processed_path**: the path of processed image
- **status**: Represents the processing status of the image, such as ‘pending’, ‘in progress’, or ‘completed’.
- **created_at**: Automatically set when the image is uploaded.
- **updated_at**: Automatically updated when the image’s status is changed.

### **3.2 Users Table**

The **Users** table stores authentication information and user roles.

#### **Table Definition:**

```sql
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email VARCHAR(255) UNIQUE NOT NULL,
    name VARCHAR(255),
    password_hash TEXT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

```

#### **Key Fields:**

- **id**: The primary key, uniquely identifies each user in the system.
- **email**: Unique identifier for the user, used for login.
- **name**: name of the user.
- **password_hash**: A securely hashed password for user authentication.
- **created_at**: The timestamp when the user was first created.
- **updated_at**: The timestamp when the user’s details were last updated.

------

## **4. Relationships**

### **4.1 One-to-Many Relationship (User to Images)**

- A **User** can upload many **Images**, but each **Image** belongs to a single **User**. This relationship is established through the `user_id` foreign key in the **Images** table.
- **On Delete Cascade**: If a user is deleted, all associated images will also be deleted automatically.

------

### **5. Data Access Patterns**

#### **5.1 Common Queries:**

- Fetch image metadata by image ID:

  ```sql
  Copy code
  SELECT * FROM images WHERE image_id = <image_id>;
  ```

- Fetch all images by user ID:

  ```sql
  Copy code
  SELECT * FROM images WHERE user_id = <user_id>;
  ```

#### **5.2 Indexing Strategy:**

- Index on `user_id` in the **Images** table

  : This will optimize queries that fetch images by user.

  ```sql
  Copy code
  CREATE INDEX idx_user_id ON images(user_id);
  ```

## **6. Storage and Performance Considerations**

### **6.1 Performance Considerations**

- **Indexes**: To ensure optimal performance, indexes will be used on commonly queried fields like `user_id` in the **Images** table and `timestamp` in the **Logs** table. This will improve query performance when fetching images by user or retrieving logs by service.
- **Caching**: For frequently accessed image metadata, a caching layer (e.g., Redis) may be used to reduce database load and improve performance.





## 
