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
