# Server (Backend)

The server is running at http://localhost:8000

## Installation

```
1. after pulling the repo, install the dependencies by running:
npm install
2. start the server by running:
npm run dev
```

## Routes

1. Registration route:
`http://localhost:8000/api/register`

**Method**: Post

**Response**: On success
- Status: 201
- JSON:
{
    success: true,
    message: User created successfully
}

**Response**: On error
- Status: 500
- JSON:
{
    success: false,
    error: 'Internal server error',
}

2. Login route:
`http://localhost:8000/api/login`

**Method**: Post

**Response**: On success
- Status: 200
- JSON:
{
    success: true,
    message: Logged in successfully
}

**Response**: On error
- Status: 500
- JSON:
{
    success: false,
    error: 'Internal server error',
}

3. Logout route (require userAuth):
`http://localhost:8000/api/logout`

**Method**: Get

**Response**: On success
- Status: 200
- JSON:
{
    success: true,
    message: Logged out successfully
}

**Response**: On error
- Status: 500
- JSON:
{
    success: false,
    error: 'Internal server error',
}

4. Get Users route (require userAuth):
`http://localhost:8000/api/users`

**Method**: Get

**Response**: On success
- Status: 200
- JSON:
{
    success: true,
    users: [List of users]
}

**Response**: On error
- Status: 500
- JSON:
{
    success: false,
    error: 'Internal server error',
}