CREATE DATABASE IF NOT EXISTS attendance_db;
USE attendance_db;

-- Students Table
CREATE TABLE IF NOT EXISTS Students (
    student_id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    roll_no VARCHAR(50) UNIQUE NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL
);

-- Teachers Table
CREATE TABLE IF NOT EXISTS Teachers (
    teacher_id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL
);

-- Courses Table
CREATE TABLE IF NOT EXISTS Courses (
    course_id INT AUTO_INCREMENT PRIMARY KEY,
    course_name VARCHAR(255) NOT NULL,
    teacher_id INT,
    FOREIGN KEY (teacher_id) REFERENCES Teachers(teacher_id)
);

-- Enrollments Table
CREATE TABLE IF NOT EXISTS Enrollments (
    student_id INT,
    course_id INT,
    PRIMARY KEY (student_id, course_id),
    FOREIGN KEY (student_id) REFERENCES Students(student_id),
    FOREIGN KEY (course_id) REFERENCES Courses(course_id)
);

-- Attendance Table
CREATE TABLE IF NOT EXISTS Attendance (
    attendance_id INT AUTO_INCREMENT PRIMARY KEY,
    student_id INT,
    course_id INT,
    date DATE NOT NULL,
    status VARCHAR(20) DEFAULT 'Present',
    FOREIGN KEY (student_id) REFERENCES Students(student_id),
    FOREIGN KEY (course_id) REFERENCES Courses(course_id)
);

-- Sample Data
INSERT INTO Students (name, roll_no, email, password) VALUES 
('Aarav Sharma', 'S101', 'aarav@college.com', 'password123'),
('Priya Patel', 'S102', 'priya@college.com', 'password123'),
('Arjun Kumar', 'S103', 'arjun@college.com', 'password123'),
('Ananya Singh', 'S104', 'ananya@college.com', 'password123');

INSERT INTO Teachers (name, email, password) VALUES 
('Dr. Smith', 'smith@college.com', 'password123'),
('Prof. Johnson', 'johnson@college.com', 'admin456');

INSERT INTO Courses (course_name, teacher_id) VALUES 
('Data Structures', 1),
('Algorithms', 1),
('Database Systems', 2),
('Web Development', 2);

INSERT INTO Enrollments (student_id, course_id) VALUES 
(1, 1), (2, 1), (3, 1), (4, 1),
(1, 3), (2, 3);
