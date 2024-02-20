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
    error: error message
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
    error: error message
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
    error: error message
}