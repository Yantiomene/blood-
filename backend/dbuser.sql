-- Create blooduser
CREATE USER blooduser WITH PASSWORD 'bloodpwd';

-- Grant privileges on users table to blooduser
GRANT SELECT, INSERT, UPDATE ON TABLE users TO blooduser;
GRANT USAGE ON SEQUENCE users_id_seq TO blooduser;
GRANT ALL ON DATABASE blooddb TO blooduser;
CREATE EXTENSION IF NOT EXISTS postgis;
