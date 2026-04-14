const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
require('dotenv').config();
const db = require('./db');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(bodyParser.json());

// 1. Authentication API
app.post('/api/register', async (req, res) => {
  const { role, email, password, name, roll_no } = req.body;

  try {
    if (role === 'teacher') {
      const [result] = await db.query(
        'INSERT INTO Teachers (name, email, password) VALUES (?, ?, ?)',
        [name, email, password]
      );
      return res.json({ success: true, message: 'Teacher registered successfully', userId: result.insertId });
    } else if (role === 'student') {
      const [result] = await db.query(
        'INSERT INTO Students (name, roll_no, email, password) VALUES (?, ?, ?, ?)',
        [name, roll_no, email, password]
      );
      return res.json({ success: true, message: 'Student registered successfully', userId: result.insertId });
    }
    res.status(400).json({ success: false, message: 'Invalid role' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

app.post('/api/login', async (req, res) => {
  const { role, email, password, name, roll_no } = req.body;

  try {
    if (role === 'teacher') {
      const [rows] = await db.query('SELECT * FROM Teachers WHERE email = ? AND password = ?', [email, password]);
      if (rows.length > 0) {
        return res.json({ success: true, role: 'teacher', user: rows[0] });
      }
    } else if (role === 'student') {
      const [rows] = await db.query('SELECT * FROM Students WHERE name = ? AND roll_no = ? AND password = ?', [name, roll_no, password]);
      if (rows.length > 0) {
        return res.json({ success: true, role: 'student', user: rows[0] });
      }
    }
    res.status(401).json({ success: false, message: 'Invalid credentials' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// 2. Mark Attendance API
app.post('/api/attendance', async (req, res) => {
  const { student_id, course_id, status } = req.body;
  const date = new Date().toISOString().split('T')[0];

  try {
    // Check if student is enrolled in the course
    const [enrollment] = await db.query(
      'SELECT * FROM Enrollments WHERE student_id = ? AND course_id = ?',
      [student_id, course_id]
    );

    if (enrollment.length === 0) {
      return res.status(403).json({ success: false, message: 'Student is not enrolled in this course' });
    }

    // Prevent duplicate attendance for same student on same day
    const [existing] = await db.query(
      'SELECT * FROM Attendance WHERE student_id = ? AND course_id = ? AND date = ?',
      [student_id, course_id, date]
    );

    if (existing.length > 0) {
      return res.status(400).json({ success: false, message: 'Attendance already marked for today' });
    }

    // Get student details to return to the teacher/student
    const [student] = await db.query('SELECT name, roll_no FROM Students WHERE student_id = ?', [student_id]);
    
    if (student.length === 0) {
      return res.status(404).json({ success: false, message: 'Student not found' });
    }

    await db.query(
      'INSERT INTO Attendance (student_id, course_id, date, status) VALUES (?, ?, ?, ?)',
      [student_id, course_id, date, status || 'Present']
    );

    res.json({ 
      success: true, 
      message: 'Attendance marked successfully', 
      student: {
        name: student[0].name,
        roll_no: student[0].roll_no
      }
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// 3. Get Attendance for Teacher (per course)
app.get('/api/attendance/:courseId', async (req, res) => {
  const { courseId } = req.params;
  const date = req.query.date || new Date().toISOString().split('T')[0];

  try {
    const [rows] = await db.query(
      `SELECT s.name, s.roll_no, a.status, a.date 
       FROM Attendance a 
       JOIN Students s ON a.student_id = s.student_id 
       WHERE a.course_id = ? AND a.date = ?`,
      [courseId, date]
    );
    res.json({ success: true, attendance: rows });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// 4. Get Attendance for Student
app.get('/api/student/:id', async (req, res) => {
  const { id } = req.params;

  try {
    const [rows] = await db.query(
      `SELECT c.course_name, a.date, a.status 
       FROM Attendance a 
       JOIN Courses c ON a.course_id = c.course_id 
       WHERE a.student_id = ?`,
      [id]
    );
    res.json({ success: true, attendance: rows });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// 5. Get Courses for a Teacher
app.get('/api/teacher/:teacherId/courses', async (req, res) => {
  const { teacherId } = req.params;
  try {
    const [rows] = await db.query('SELECT * FROM Courses WHERE teacher_id = ?', [teacherId]);
    res.json({ success: true, courses: rows });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// 6. Get all students enrolled in a course with their attendance status for today
app.get('/api/courses/:courseId/enrolled', async (req, res) => {
  const { courseId } = req.params;
  const date = new Date().toISOString().split('T')[0];
  try {
    const [rows] = await db.query(
      `SELECT s.student_id, s.name, s.roll_no, 
       (SELECT COUNT(*) FROM Attendance a WHERE a.student_id = s.student_id AND a.course_id = e.course_id AND a.date = ?) as is_present
       FROM Enrollments e
       JOIN Students s ON e.student_id = s.student_id
       WHERE e.course_id = ?`,
      [date, courseId]
    );
    res.json({ success: true, students: rows });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// 7. Mark all enrolled students as present
app.post('/api/attendance/mark-all', async (req, res) => {
  const { course_id } = req.body;
  const date = new Date().toISOString().split('T')[0];
  try {
    const [enrolled] = await db.query('SELECT student_id FROM Enrollments WHERE course_id = ?', [course_id]);
    for (const student of enrolled) {
      const [existing] = await db.query(
        'SELECT * FROM Attendance WHERE student_id = ? AND course_id = ? AND date = ?',
        [student.student_id, course_id, date]
      );
      if (existing.length === 0) {
        await db.query(
          'INSERT INTO Attendance (student_id, course_id, date, status) VALUES (?, ?, ?, ?)',
          [student.student_id, course_id, date, 'Present']
        );
      }
    }
    res.json({ success: true, message: 'All students marked as present' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});
// 8. Clear today's attendance for testing purposes
app.post('/api/attendance/clear-all', async (req, res) => {
  const { course_id } = req.body;
  const date = new Date().toISOString().split('T')[0];
  try {
    await db.query('DELETE FROM Attendance WHERE course_id = ? AND date = ?', [course_id, date]);
    res.json({ success: true, message: 'All attendance for today cleared' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
app.get("/", (req, res) => {
  res.send("Backend is running 🚀");
});