-- Create blooduser
CREATE USER blooduser WITH PASSWORD 'bloodpwd';

-- Grant privileges on users table to blooduser
GRANT SELECT, INSERT, UPDATE ON TABLE users TO blooduser;
