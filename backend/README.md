# Server (Backend)

The server is running at [http://localhost:8000](http://localhost:8000)

## Installation

1. After pulling the repo, install the dependencies by running:
   ```
   npm install
   ```

2. Start the server by running:
   ```
   npm run dev
   ```

## Routes

### 1. Registration Route

- **Endpoint**: `http://localhost:8000/api/register`
- **Method**: POST

#### Success Response

- **Status**: 201
- **JSON**:
  ```json
  {
      "success": true,
      "message": "User created successfully"
  }
  ```

#### Error Response

- **Status**: 500
- **JSON**:
  ```json
  {
      "success": false,
      "error": "Internal server error"
  }
  ```

### 2. Login Route

- **Endpoint**: `http://localhost:8000/api/login`
- **Method**: POST

#### Success Response

- **Status**: 200
- **JSON**:
  ```json
  {
      "success": true,
      "message": "Logged in successfully"
  }
  ```

#### Error Response

- **Status**: 500
- **JSON**:
  ```json
  {
      "success": false,
      "error": "Internal server error"
  }
  ```

### 3. Logout Route (requires userAuth)

- **Endpoint**: `http://localhost:8000/api/logout`
- **Method**: GET

#### Success Response

- **Status**: 200
- **JSON**:
  ```json
  {
      "success": true,
      "message": "Logged out successfully"
  }
  ```

#### Error Response

- **Status**: 500
- **JSON**:
  ```json
  {
      "success": false,
      "error": "Internal server error"
  }
  ```

### 4. Get Users Route (requires userAuth)

- **Endpoint**: `http://localhost:8000/api/users`
- **Method**: GET

#### Success Response

- **Status**: 200
- **JSON**:
  ```json
  {
      "success": true,
      "users": ["List of users"]
  }
  ```

#### Error Response

- **Status**: 500
- **JSON**:
  ```json
  {
      "success": false,
      "error": "Internal server error"
  }
  ```

  ### 5. Get User profile Route (requires userAuth)

- **Endpoint**: `http://localhost:8000/api/profile`
- **Method**: GET

#### Success Response

- **Status**: 200
- **JSON**:
  ```json
  {
      "success": true,
      "user": {
      "id": "user_id",
      "username": "user_username",
      "email": "user_email",
      "bloodType": "user_bloodType",
      "location": "user_location"
      }
  }
  ```

### User not found Response

- **Status**: 404
- **JSON**:
```json
  {
      "success": false,
      "error": "User not found"
  }
```

#### Error Response

- **Status**: 500
- **JSON**:
  ```json
  {
      "success": false,
      "error": "Internal server error"
  }
  ```

### 6. Update user profile Route (requires userAuth)

- **Endpoint**: `http://localhost:8000/api/users`
- **Method**: PUT

#### Success Response

- **Status**: 200
- **JSON**:
  ```json
  {
      "success": true,
      "message": "User profile updated successfully"
  }
  ```

#### Error Response

- **Status**: 500
- **JSON**:
  ```json
  {
      "success": false,
      "error": "Internal server error"
  }
  ```

## Additional Information

- **User Authentication**: Some routes require user authentication (`userAuth`).
- **API Base URL**: The base URL for all API endpoints is [http://localhost:8000/api](http://localhost:8000/api).

## API Versioning

The current version of the API is v1.

## Environment Configuration

Environment variables can be configured in a .env file. Refer to the provided .env.example file for the required variables.

## Testing Endpoints

To test the endpoints, you can use tools like Postman or CURL commands. Ensure proper authentication by including the generated token in the **Authorization** header for routes that require user authentication.
Here are examples of how you can test the created endpoints using cURL commands. Please replace placeholder values with actual data:

### 1. Registration Route

```bash
curl -X POST \
  http://localhost:8000/api/register \
  -H 'Content-Type: application/json' \
  -d '{
    "username": "your_username",
    "email": "your_email@example.com",
    "password": "your_password",
    "bloodType": "A-"
}'
```

### 2. Login Route

```bash
curl -X POST \
  http://localhost:8000/api/login \
  -H 'Content-Type: application/json' \
  -d '{
    "email": "your_email@example.com",
    "password": "your_password"
}'
```

### 3. Logout Route (requires userAuth)

```bash
curl -X GET \
  http://localhost:8000/api/logout \
  -H 'Authorization: Bearer your_access_token'
```

### 4. Get Users Route (requires userAuth)

```bash
curl -X GET \
  http://localhost:8000/api/users \
  -H 'Authorization: Bearer your_access_token'
```

### 5. Get User Profile Route (requires userAuth)

```bash
curl -X GET \
  http://localhost:8000/api/profile \
  -H 'Authorization: Bearer your_access_token'
```

### 6. Update User Profile Route (requires userAuth)

```bash
curl -X PUT \
  http://localhost:8000/api/profile \
  -H 'Content-Type: application/json' \
  -H 'Authorization: Bearer your_access_token' \
  -d '{
    "username": "updated_username",
    "email": "updated_email@example.com",
    "bloodType": "B+",
    "location": [longitude, latitude]
}'
```

Make sure to replace "your_username", "your_email@example.com", "your_password", "your_access_token", "updated_username", "updated_email@example.com", and [longitude latitude] with actual values.