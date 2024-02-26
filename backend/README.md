# Server (Backend)
## Getting Started
#### Backend
1. Make sure your database (postgres) is running
2. Create a `.env` file in the root directory and add the following variables
```bash
# server conf
PORT=2000 # preferable, if not configure also in test/curl-tests.txt as well
SECRET=your_secret_text
CLIENT_URL=http://localhost:3000
SERVER_URL=http://localhost:2000 # mind port number
# db conf
DB_USER=your_db_user
DB_PASSWORD=your_db_password
DB_HOST=your_db_host
DB_PORT=your_db_port
DB_NAME=your_db_name
```
3. Create user from the `dbuser.sql` script
```bash
psql -U your_db_user -d your_db_name -a -f dbuser.sql
# mind your current working directory
```

4. Create database from the `database.sql` script
```bash
psql -U your_db_user -d your_db_name -a -f database.sql
# mind your current working directory
```

5. All check? Great. Now install dependencies
```bash
npm install
```

6. Run the server
```bash
npm run dev
```

7. Run tests
> _if you have `curl` installed_
> go to test/curl-tests.txt and run the commands by copying and pasting into your terminal

_if you don't, you can visit the url from your browser_
```
http://localhost:2000/api/users
```
NB: you may not be able to make POST requests which are relevant for login, register, etc.

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

- **Endpoint**: `http://localhost:8000/api/profile`
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

### 7. Email Verification Route

- **Endpoint**: [http://localhost:8000/api/verifyEmail/:code](http://localhost:8000/api/verifyEmail/:code)
- **Method**: GET

#### Success Response

- **Status**: 200
- **JSON**:
  ```json
  {
      "success": true,
      "message": "Email verified successfully"
  }

#### Error Response

- **Status**: 404
- **JSON**:
  ```json
  {
      "success": false,
      "error": "Invalid verification code"
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
### 8. Create DonationRequest Route (requires userAuth)

- **Endpoint**: `http://localhost:8000/api/donationRequest`
- **Method**: POST

#### Success Response

- **Status**: 201
- **JSON**:
  ```json
  {
      "success": true,
      "message": "Donation request created successfully",
      "donationRequest": createdDonationRequest,
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

### 9. Get DonationRequest Route (requires userAuth)

- **Endpoints**: `http://localhost:8000/api/donationRequests` (fetch all donation requests)
              `http://localhost:8000/api/donationRequests?isFulFilled=true` (fetch those which are fulfilled)
              `http://localhost:8000/api/donationRequests?isFulfilled=false` (fetch those which are not yet fulfilled)
- **Method**: GET

#### Success Response

- **Status**: 200
- **JSON**:
  ```json
  {
      "success": true,
      "donationRequests": donationRequests
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

### 10. Update Donation request Route (requires userAuth)

- **Endpoint**: `http://localhost:8000/api/donationRequest/:requestID`
- **Method**: PUT

#### Success Response

- **Status**: 200
- **JSON**:
  ```json
  {
      "success": true,
      "message": "'Donation request updated successfully",
      "updatedRequest": updatedRequest,
  }
  ```

### Donation request not found Response

- **Status**: 404
- **JSON**:
```json
  {
      "success": false,
      "error": "Donation request not found"
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

### 11. Update user location Route (requires userAuth)

- **Endpoint**: `http://localhost:8000/api/user/location`
- **Method**: PUT

#### Success Response

- **Status**: 200
- **JSON**:
  ```json
  {
      "success": true,
      "message": "User location updated successfully"
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

### 12. Find Nearby donors (requires userAuth)

- **Endpoint**: `http://localhost:8000/api/donors/find`
- **Method**: POST

#### Success Response

- **Status**: 200
- **JSON**:
  ```json
  {
      "success": true,
      "donors": ListofDonors || [],
      "hospitals": ListofHospitals || []
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
    "isDonor": bool,
    "contactNumber": "updated_contact_number"
}'
```

### 7. Email Verification Route Test

```bash
curl -X GET \
  http://localhost:8000/api/verifyEmail/your_verification_code
```

### 8. Create Donation Request Route

```bash
curl -X POST \
  http://localhost:8000/api/donationRequests \
  -H 'Content-Type: application/json' \
  -H 'Authorization: Bearer your_access_token' \
  -d '{
    "bloodType": "A+",
    "quantity": 2,
    "location": [longitude, latitude],
    "requestingEntity": "User"
  }'
```

### 9. Get Donation Requests Route

#### Get all donation requests (no isFulfilled parameter):

```bash
curl -X GET \
  http://localhost:8000/api/donationRequests \
  -H 'Authorization: Bearer your_access_token'
```

#### Get only fulfilled donation requests:

```bash
curl -X GET \
  http://localhost:8000/api/donationRequests?isFulfilled=true \
  -H 'Authorization: Bearer your_access_token'
```

#### Get only unfulfilled donation requests:

```bash
curl -X GET \
  http://localhost:8000/api/donationRequests?isFulfilled=false \
  -H 'Authorization: Bearer your_access_token'
```


### 10. Update Donation Request Route

```bash
curl -X PUT \
  http://localhost:8000/api/donationRequests/:requestId \
  -H 'Content-Type: application/json' \
  -H 'Authorization: Bearer your_access_token' \
  -d '{
    "quantity": 3,
    "bloodType": "A+",
    "location": [updated_longitude, updated_latitude],
    "isFulfilled": true
  }'
```

### 11. Update User location Route (requires userAuth)

```bash
curl -X PUT \
  http://localhost:8000/api/user/location \
  -H 'Content-Type: application/json' \
  -H 'Authorization: Bearer your_access_token' \
  -d '{
    "longitude": float
    "latitude": float
  }'
```

### 6. Find Nearby donors (requires userAuth)

```bash
curl -X POST \
  http://localhost:8000/api/donors/find \
  -H 'Content-Type: application/json' \
  -H 'Authorization: Bearer your_access_token' \
  -d '{
    "bloodType": requesting_blood_type
}'
```

Make sure to replace `your_username`, `your_email@example.com`, `your_password`, `your_access_token`, `updated_username`, `updated_email@example.com`, `your_verification_code`, `longitude`, `latitude`, `updated_longitude`, `updated_latitude`, `:requestId` and `requesting_blood_type` with actual values.