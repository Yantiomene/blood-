-- Users tables ---

CREATE TABLE users(
    id SERIAL PRIMARY KEY,
    username VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    blood_type VARCHAR(255) NOT NULL,
    location VARCHAR(255),
    contact_number VARCHAR(255),
    isDonor BOOLEAN DEFAULT false,
    isVerified BOOLEAN DEFAULT false,
    isHospital BOOLEAN DEFAULT false,
    isBloodBank BOOLEAN DEFAULT false,
    isBloodCamp BOOLEAN DEFAULT false,
    associatedEntityId VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

INSERT INTO users (username, email, password, blood_type, location, contact_number, isDonor, isVerified, isHospital, isBloodBank, isBloodCamp, associatedEntityId)
VALUES
    ('JohnDoe', 'johndoe@example.com', 'password123', 'O+', 'New York', '1234567890', true, true, false, false, false, NULL),
    ('JaneDoe', 'janedoe@example.com', 'password456', 'A-', 'Los Angeles', '0987654321', true, false, false, false, false, NULL),
    ('Esmond', 'xmond@gmail.com', 'password', 'O-', 'Ghana', '0243511211', true, true, false, false, false, NULL);
