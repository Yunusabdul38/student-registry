-- Database initialization script for student-registry
-- This script runs when the PostgreSQL container starts for the first time

-- Create extensions that might be useful
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- Create ENUM types based on your Rust enums
CREATE TYPE month_enum AS ENUM (
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
);

CREATE TYPE gender_enum AS ENUM ('Male', 'Female');

CREATE TYPE program_enum AS ENUM (
    'Mathematics', 'History', 'Economics', 'Literature',
    'Physics', 'Biochemistry', 'ComputerScience', 'Architecture'
);

CREATE TYPE student_status_enum AS ENUM ('Active', 'Expelled', 'Graduated');

-- Create the students table matching your StudentData/Student structs
CREATE TABLE IF NOT EXISTS students (
    student_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    first_name VARCHAR(255) NOT NULL,
    last_name VARCHAR(255) NOT NULL,
    dob_day SMALLINT NOT NULL CHECK (dob_day >= 1 AND dob_day <= 31),  -- Validate day range
    dob_month month_enum NOT NULL,
    dob_year INTEGER NOT NULL CHECK (dob_year >= 1900 AND dob_year <= EXTRACT(YEAR FROM CURRENT_DATE)),  -- Example validation
    gender gender_enum NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    program program_enum NOT NULL,
    status student_status_enum NOT NULL DEFAULT 'Active',
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP
    -- updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP  -- Uncomment if needed
);

-- Create indexes on commonly queried fields for performance
CREATE INDEX IF NOT EXISTS idx_students_email ON students(email);
CREATE INDEX IF NOT EXISTS idx_students_program ON students(program);
CREATE INDEX IF NOT EXISTS idx_students_status ON students(status);
CREATE INDEX IF NOT EXISTS idx_students_gender ON students(gender);
CREATE INDEX IF NOT EXISTS idx_students_dob_year ON students(dob_year);  -- For age-related queries

-- Optional: Trigger to auto-update updated_at on row changes (uncomment if adding updated_at column)
/*
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_students_updated_at
BEFORE UPDATE ON students
FOR EACH ROW
EXECUTE FUNCTION update_updated_at();
*/

-- Log that initialization is complete
DO $$
BEGIN
    RAISE NOTICE 'Database initialization completed successfully!';
END $$;