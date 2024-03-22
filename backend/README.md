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

### 8. Reset password request Route

- **Endpoint**: [http://localhost:8000/api/passwordResetRequest](http://localhost:8000/api/passwordResetRequest)
- **Method**: POST

#### Success Response

- **Status**: 200
- **JSON**:
  ```json
  {
      "success": true,
      "message": "Password reset email sent successfully",
  }
  ```

#### Error Response

- **Status**: 404
- **JSON**:
  ```json
  {
      "success": false,
      "error": "Email not found"
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

### 9. Reset password Route

- **Endpoint**: [http://localhost:8000/api/passwordReset](http://localhost:8000/api/passwordReset)
- **Method**: POST

#### Success Response

- **Status**: 200
- **JSON**:
  ```json
  {
      "success": true,
      "message": "Password reset successfully",
  }
  ```

#### Error Response

- **Status**: 404
- **JSON**:
  ```json
  {
      "success": false,
      "error": "Invalid verification code."
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

### 10. Create DonationRequest Route (requires userAuth)

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

### 11. Get DonationRequest Route (requires userAuth)

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

### 12. Update Donation request Route (requires userAuth)

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

### 13. Update user location Route (requires userAuth)

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

### 14. Find Nearby donors (requires userAuth)

- **Endpoint**: `http://localhost:8000/api/donors/find`
- **Method**: POST

#### Success Response

- **Status**: 200
- **JSON**:
  ```json
  {
      "success": true,
      "donors": ["ListofDonors"] || [],
      "hospitals": ["ListofHospitals"] || []
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

### 15. Delete donation request (requires userAuth)

- **Endpoint**: `http://localhost:8000/api/donationRequest/:requestID`
- **Method**: DELETE

#### Success Response

- **Status**: 200
- **JSON**:
  ```json
  {
      "success": true,
      "message": "Donation request deleted successfully"
  }
  ```
#### Error Response

- **Status**: 404
- **JSON**:
```json
  {
      "success": false,
      "error": "Donation request not found"
  }
```

- **Status**: 500
- **JSON**:
  ```json
  {
      "success": false,
      "error": "Internal server error"
  }
  ```

### 16. Find request by blood type (requires userAuth)

- **Endpoint**: `http://localhost:8000/api/donationReq`
- **Method**: GET

#### Success Response

- **Status**: 200
- **JSON**:
  ```json
  {
      "success": true,
      "donationRequests": ["ListofDonationRequests"]
  }
  ```

#### Error Response

- **Status**: 404
- **JSON**:
```json
  {
      "success": false,
      "error": "Donation request not found"
  }
```

- **Status**: 403
- **JSON**:
```json
  {
      "success": false,
      "error": "Update your donor status"
  }
```

- **Status**: 500
- **JSON**:
  ```json
  {
      "success": false,
      "error": "Internal server error"
  }
  ```

### 17. Deny Donation Request (requires userAuth)

- **Endpoint**: `http://localhost:8000/api/denyRequest`
- **Method**: POST

#### Success Response

- **Status**: 200
- **JSON**:
  ```json
  {
      "success": true,
      "message": "Request denied successfully"
  }
  ```

#### Error Response

- **Status**: 400
- **JSON**:
  ```json
  {
      "success": false,
      "error": "Request ID and reason are required"
  }
  ```

- **Status**: 404
- **JSON**:
```json
  {
      "success": false,
      "error": "Invalid request ID" || "Requestor not found"
  }
```

- **Status**: 500
- **JSON**:
  ```json
  {
      "success": false,
      "error": "Internal server error"
  }
  ```

### 18. Request new token route

- **Endpoint**: `http://localhost:8000/api/requestNewToken`
- **Method**: POST

#### Success Response

- **Status**: 200
- **JSON**:
  ```json
  {
      "success": true,
      "message": "New verification code sent successfully"
  }
  ```

#### Error Response

- **Status**: 404
- **JSON**:
  ```json
  {
      "success": false,
      "error": "Email not found"
  }
  ```

- **Status**: 500
- **JSON**:
  ```json
  {
      "success": false,
      "error": "Internal server error"
  }
  ```

### 19. Find request by date (requires userAuth)

- **Endpoint**: `http://localhost:8000/api/donationReqByDate`
- **Method**: POST

#### Success Response

- **Status**: 200
- **JSON**:
  ```json
  {
      "success": true,
      "donationRequests": ["ListofDonationRequests"]
  }
  ```

#### Error Response

- **Status**: 400
- **JSON**:
  ```json
  {
      "success": false,
      "error": "startDate and enddate are required" || "Invalid date format, Use YYYY-MM-DD"
  }
  ```

- **Status**: 403
- **JSON**:
```json
  {
      "success": false,
      "error": "Update your donor status"
  }
```

- **Status**: 500
- **JSON**:
  ```json
  {
      "success": false,
      "error": "Internal server error"
  }
  ```

### 20. Find request by priority (requires userAuth)

- **Endpoint**: `http://localhost:8000/api/donationReqByPriority/:urgent`
- **Method**: POST

#### Success Response

- **Status**: 200
- **JSON**:
  ```json
  {
      "success": true,
      "donationRequests": ["ListofDonationRequests"]
  }
  ```

#### Error Response

- **Status**: 400
- **JSON**:
  ```json
  {
      "success": false,
      "error": "Urgent field is required" || "Invalid urgent, use true or false"
  }
  ```

- **Status**: 403
- **JSON**:
```json
  {
      "success": false,
      "error": "Update your donor status"
  }
```

- **Status**: 500
- **JSON**:
  ```json
  {
      "success": false,
      "error": "Internal server error"
  }
  ```

## Blogs routes

### 1. Create a blog

- **Endpoint**: `http://localhost:8000/blogs/createBlog`
- **Method**: POST

#### Success Response

- **Status**: 200
- **JSON**:
  ```json
  {
      "success": true,
      "blog": {
        "id": ,
        "title": ,
        "content": ,
        "image": ,
        "created_at": ,
        "updated_at": 
      }
  }
  ```

#### Error Response

- **Status**: 400
- **JSON**:
  ```json
  {
     "errors": ["errors"]
  }
  ```
- **Status**: 500
- **JSON**:
  ```json
  {
      "success": false,
      "error": "Internal server error"
  }
  ```

### 2. Get blogs

- **Endpoint**: `http://localhost:8000/blogs/getBlogs`
- **Method**: GET

#### Success Response

- **Status**: 200
- **JSON**:
  ```json
  {
      "success": true,
      "blogs": ["List of blogs"]
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

### 3. Get blog by id

- **Endpoint**: `http://localhost:8000/blogs/getBlog/:id`
- **Method**: GET

#### Success Response

- **Status**: 200
- **JSON**:
  ```json
  {
      "success": true,
      "blog": {
        "id": "blog_id",
        "title": "blog_title",
        "content": "blog_content",
        "image": "blog_image_src"
      }
  }
  ```

### Blog not found Response

- **Status**: 404
- **JSON**:
```json
  {
      "success": false,
      "message": "Blog not found"
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

### 4. Update blog

- **Endpoint**: `http://localhost:8000/blogs/updateBlog/:id`
- **Method**: PUT

#### Success Response

- **Status**: 200
- **JSON**:
  ```json
  {
      "success": true,
      "blog": {
        "id": "blog_id",
        "title": "blog_title",
        "content": "blog_content",
        "image": "blog_image_src"
      }
  }
  ```

### Blog not found Response

- **Status**: 404
- **JSON**:
```json
  {
      "success": false,
      "message": "Blog not found"
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
- **API Base URL**: The base URL for all API endpoints is [http://localhost:8000/api](http://localhost:8000/api) and [http://localhost:8000/blogs](http://localhost:8000/blogs).

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

### 8. Reset password request Route Test

```bash
curl -X POST \
  http://localhost:8000/api/passwordResetRequest \
  -H 'Content-Type: application/json' \
  -d '{
    "email": "user_email@example.com",
  }'
```

### 9. Reset password Route Test

```bash
curl -X POST \
  http://localhost:8000/api/passwordReset \
  -H 'Content-Type: application/json' \
  -d '{
    "code": "reset_token",
    "password": "reset_password",
  }'
```

### 10. Create Donation Request Route

```bash
curl -X POST \
  http://localhost:8000/api/donationRequests \
  -H 'Content-Type: application/json' \
  -H 'Authorization: Bearer your_access_token' \
  -d '{
    "bloodType": "A+",
    "quantity": 2,
    "location": [longitude, latitude],
    "requestingEntity": "User",
    "message": "Please donate blood",
  }'
```

### 11. Get Donation Requests Route

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


### 12. Update Donation Request Route

```bash
curl -X PUT \
  http://localhost:8000/api/donationRequests/:requestId \
  -H 'Content-Type: application/json' \
  -H 'Authorization: Bearer your_access_token' \
  -d '{
    "quantity": 3,
    "bloodType": "A+",
    "location": [updated_longitude, updated_latitude],
    "isFulfilled": true,
    "message": "updated_message"
    "urgent": true
  }'
```

### 13. Update User location Route (requires userAuth)

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

### 14. Find Nearby donors (requires userAuth)

```bash
curl -X POST \
  http://localhost:8000/api/donors/find \
  -H 'Content-Type: application/json' \
  -H 'Authorization: Bearer your_access_token' \
  -d '{
    "bloodType": requesting_blood_type
}'
```

### 15. Delete donation request (requires userAuth)

```bash
curl -X DELETE \
  http://localhost:8000/api/donationRequest/:requestId \
  -H 'Authorization: Bearer your_access_token'
```

### 16. Find request by blood type (requires userAuth)

```bash
curl -X GET \
  http://localhost:8000/api/donationReq \
  -H 'Authorization: Bearer your_access_token'
```

### 17. Deny Donation Request (requires userAuth)

```bash
curl -X POST \
  http://localhost:8000/api/denyRequest \
  -H 'Content-Type: application/json' \
  -H 'Authorization: Bearer your_access_token' \
  -d '{
    "requestId": "request_id",
    "reason": "reason_for_denial"
  }'
```

### 18. Request new token route

```bash
curl -X POST \
  http://localhost:8000/api/requestNewToken \
  -H 'Content-Type: application/json' \
  -d '{
    "email": "email_address"
  }'
```

### 19. Find request by date (requires userAuth)

```bash
curl -X POST \
  http://localhost:8000/api/donationReqByDate \
  -H 'Content-Type: application/json' \
  -H 'Authorization: Bearer your_access_token' \
  -d '{
    "startDate": "YYYY-MM-DD",
    "endDate": "YYYY-MM-DD"
  }'
```

### 20. Find request by priority (requires userAuth)

```bash
curl -X GET \
  http://localhost:8000/api/donationReqByPriority/:urgent \
  -H 'Authorization: Bearer your_access_token' \
```

## Blogs routes

### 1. Create a blog

```bash
curl -X POST \
  http://localhost:8000/blogs/createBlog \
  -H 'Content-Type: application/json' \
  -d '{
    "title": "What is blood donation",
    "content": "Blood donation is all about...",
    "image": "image_src"
  }'
```

### 2. Get blogs

```bash
curl -X GET \
  http://localhost:8000/blogs/getBlogs 
```

### 3. Get blog by id

```bash
curl -X GET \
  http://localhost:8000/blogs/getBlog/:id
```

### 4. Update blog

```bash
curl -X PUT \
  http://localhost:8000/blogs/updateBlog/:id \
  -H 'Content-Type: application/json' \
  -d '{
    "title": "updated_title",
    "content": "updated_content",
    "image": "updated_image_src"
  }'
```

Make sure to replace `your_username`, `your_email@example.com`, `your_password`, `your_access_token`, `updated_username`, `updated_email@example.com`, `your_verification_code`, `longitude`, `latitude`, `updated_longitude`, `updated_latitude`, `:requestId` and `requesting_blood_type` with actual values.