import { useState, useEffect } from 'react';
import { Plus, QrCode, Timer, Users, CheckCircle2, XCircle, Download, UserPlus, CheckCheck, ChevronDown, ChevronUp } from 'lucide-react';
import { QRCodeCanvas } from 'qrcode.react';

export function TeacherDashboard() {
  const [activeSession, setActiveSession] = useState(null);

  const [timeRemaining, setTimeRemaining] = useState(0);
  const [presentStudents, setPresentStudents] = useState([]);
  const [enrolledStudents, setEnrolledStudents] = useState([]);
  const [teacherCourses, setTeacherCourses] = useState([]);
  const [showManualMarking, setShowManualMarking] = useState(false);

  const user = JSON.parse(localStorage.getItem('user') || '{}');

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const res = await fetch(`https://bust-glance-statute.ngrok-free.dev/api/teacher/${user.teacher_id}/courses`);
        const data = await res.json();
        if (data.success) {
          setTeacherCourses(data.courses);
        }
      } catch (err) {
        console.error('Failed to fetch courses', err);
      }
    };
    if (user.teacher_id) fetchCourses();
  }, [user.teacher_id]);

  useEffect(() => {
    let interval;
    if (activeSession) {
      interval = setInterval(() => {
        const elapsed = Math.floor((Date.now() - activeSession.startTime.getTime()) / 1000);
        const remaining = Math.max(0, activeSession.duration - elapsed);
        setTimeRemaining(remaining);

        if (remaining === 0) {
          clearInterval(interval);
        }
        
        fetchAttendance();
        fetchEnrolledStudents(activeSession.courseId);
      }, 3000);
    }
    return () => clearInterval(interval);
  }, [activeSession]);

  const fetchAttendance = async () => {
    if (!activeSession) return;
    try {
      const res = await fetch(`https://bust-glance-statute.ngrok-free.dev/api/attendance/${activeSession.courseId}`);
      const data = await res.json();
      if (data.success) {
        setPresentStudents(data.attendance);
      }
    } catch (err) {
      console.error('Failed to fetch attendance', err);
    }
  };

  const fetchEnrolledStudents = async (courseId) => {
    try {
      const res = await fetch(`https://bust-glance-statute.ngrok-free.dev/api/courses/${courseId}/enrolled`);
      const data = await res.json();
      if (data.success) {
        setEnrolledStudents(data.students);
      }
    } catch (err) {
      console.error('Failed to fetch enrolled students', err);
    }
  };

  const handleCreateSession = (courseId, subject) => {
    setActiveSession({
      subject,
      courseId,
      startTime: new Date(),
      duration: 300,
      qrCode: `ATTEND_${courseId}`,
    });
    setPresentStudents([]);
    setEnrolledStudents([]);
    setTimeRemaining(300);
    fetchEnrolledStudents(courseId);
  };

  const handleEndSession = () => {
    setActiveSession(null);
    setPresentStudents([]);
    setEnrolledStudents([]);
    setTimeRemaining(0);
    setShowManualMarking(false);
  };

  const handleMarkPresent = async (studentId) => {
    if (!activeSession) return;
    try {
      const res = await fetch(`https://bust-glance-statute.ngrok-free.dev/api/attendance`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          student_id: studentId,
          course_id: activeSession.courseId,
          status: 'Present'
        }),
      });
      const data = await res.json();
      if (data.success) {
        fetchEnrolledStudents(activeSession.courseId);
        fetchAttendance();
      }
    } catch (err) {
      console.error('Failed to mark attendance', err);
    }
  };

  const handleMarkAllPresent = async () => {
    if (!activeSession) return;
    try {
      const res = await fetch(`https://bust-glance-statute.ngrok-free.dev/api/attendance/mark-all`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          course_id: activeSession.courseId,
        }),
      });
      const data = await res.json();
      if (data.success) {
        fetchEnrolledStudents(activeSession.courseId);
        fetchAttendance();
      }
    } catch (err) {
      console.error('Failed to mark all present', err);
    }
  };

  const handleDownloadSessionReport = () => {
    if (!activeSession) return;

    const csvContent = [
      ['Attendance Report'],
      ['Subject', activeSession.subject],
      ['Date', new Date().toISOString().split('T')[0]],
      ['Time', new Date(activeSession.startTime).toLocaleTimeString()],
      ['Duration', activeSession.duration + ' seconds'],
      [],
      ['Students Present', presentStudents.length],
      [],
      ['Student Name', 'Roll Number', 'Status'],
      ...presentStudents.map((s) => [
        s.name,
        s.roll_no,
        'Present',
      ]),
    ]
      .map((row) => row.join(','))
      .join('
');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `attendance_${activeSession.subject}_${
      new Date().toISOString().split('T')[0]
    }.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className='max-w-7xl mx-auto pb-20 md:pb-8 relative'>
      <div className='absolute top-0 left-0 w-96 h-96 bg-primary/5 rounded-full blur-3xl animate-pulse-slow -z-10' />
      <div className='absolute bottom-20 right-10 w-72 h-72 bg-blue-500/5 rounded-full blur-3xl animate-pulse-slow -z-10' style={{ animationDelay: '3s' }} />
      <div className='mb-8 flex items-start justify-between'>
        <div>
          <h1 className='font-heading text-3xl mb-2' style={{ fontWeight: 700 }}>
            Teacher Dashboard
          </h1>
          <p className='text-muted-foreground'>Create attendance sessions and track students</p>
        </div>
      </div>

      {!activeSession ? (
        <>
          <div className='bg-card border border-border rounded-2xl p-8 mb-8 shadow-sm hover:shadow-lg transition-shadow duration-300 animate-fade-in'>
            <div className='flex items-center gap-3 mb-6'>
              <div className='p-3 bg-primary/10 rounded-xl'>
                <Plus className='h-6 w-6 text-primary' />
              </div>
              <div>
                <h2 className='font-heading text-xl' style={{ fontWeight: 600 }}>
                  Create New Session
                </h2>
                <p className='text-sm text-muted-foreground'>
                  Select a subject to start attendance
                </p>
              </div>
            </div>
            <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3'>
              {teacherCourses.map((course) => (
                <button
                  key={course.course_id}
                  onClick={() => handleCreateSession(course.course_id, course.course_name)}
                  className='p-4 rounded-xl border-2 border-border hover:border-primary hover:bg-primary/5 hover:scale-105 hover:shadow-lg transition-all duration-300 text-left group'
                >
                  <div className='flex items-center justify-between'>
                    <span className='font-medium'>{course.course_name}</span>
                    <QrCode className='h-5 w-5 text-muted-foreground group-hover:text-primary transition-colors' />
                  </div>
                </button>
              ))}
            </div>
          </div>
        </>
      ) : (
        <>
          <div className='grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8'>
            <div className='lg:col-span-2 bg-gradient-to-br from-primary via-primary to-blue-600 rounded-2xl p-8 text-primary-foreground shadow-xl animate-gradient hover:shadow-2xl transition-shadow duration-500 relative overflow-hidden group'>
              <div className='absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000' />
              <div className='mb-6 relative z-10'>
                <h2 className='font-heading text-2xl mb-1' style={{ fontWeight: 700 }}>
                  {activeSession.subject}
                </h2>
                <p className='text-primary-foreground/80'>Active Session</p>
              </div>

              <div className='flex items-center justify-center relative z-10'>
                <div className='bg-white p-8 rounded-2xl shadow-lg hover:shadow-2xl hover:scale-105 transition-all duration-500 animate-float animate-glow'>
                  <div className='bg-gray-100 rounded-xl flex items-center justify-center border-4 border-primary/20 p-4'>
                    <QRCodeCanvas
                      value={activeSession.qrCode}
                      size={200}
                      level={'H'}
                      includeMargin={false}
                    />
                  </div>
                  <p className='text-center text-xs text-gray-500 mt-4 font-mono'>
                    {activeSession.qrCode}
                  </p>
                </div>
              </div>
            </div>

            <div className='space-y-6'>
              <div className='bg-card border border-border rounded-2xl p-6 shadow-sm hover:shadow-lg transition-all duration-300 animate-slide-up'>
                <div className='flex items-center gap-3 mb-4'>
                  <div
                    className={`p-3 rounded-xl ${
                      timeRemaining > 20
                        ? 'bg-primary/10 text-primary'
                        : timeRemaining > 0
                        ? 'bg-warning/10 text-warning'
                        : 'bg-destructive/10 text-destructive'
                    }`}
                  >
                    <Timer className='h-6 w-6' />
                  </div>
                  <div>
                    <p className='text-sm text-muted-foreground'>Time Remaining</p>
                    <h3
                      className={`font-heading text-3xl ${
                        timeRemaining > 20
                          ? 'text-primary'
                          : timeRemaining > 0
                          ? 'text-warning animate-pulse'
                          : 'text-destructive animate-pulse'
                      }`}
                      style={{ fontWeight: 700 }}
                    >
                      {formatTime(timeRemaining)}
                    </h3>
                  </div>
                </div>
                <div className='relative h-2 bg-accent rounded-full overflow-hidden'>
                  <div
                    className={`absolute top-0 left-0 h-full rounded-full transition-all duration-1000 shadow-lg ${
                      timeRemaining > 20
                        ? 'bg-primary shadow-primary/50'
                        : timeRemaining > 0
                        ? 'bg-warning shadow-warning/50 animate-pulse'
                        : 'bg-destructive shadow-destructive/50 animate-pulse'
                    }`}
                    style={{
                      width: `${(timeRemaining / activeSession.duration) * 100}%`,
                    }}
                  />
                </div>
              </div>

              <div className='bg-card border border-border rounded-2xl p-6 shadow-sm hover:shadow-lg transition-all duration-300 animate-slide-up' style={{ animationDelay: '0.1s' }}>
                <div className='flex items-center gap-3 mb-2'>
                  <Users className='h-5 w-5 text-primary' />
                  <p className='text-sm text-muted-foreground'>Students Present</p>
                </div>
                <h3 className='font-heading text-4xl text-primary transition-all duration-500' style={{ fontWeight: 700 }}>
                  {presentStudents.length} / {enrolledStudents.length}
                </h3>
              </div>

              <button
                onClick={handleDownloadSessionReport}
                className='w-full bg-card border border-border text-foreground py-3 rounded-xl font-medium hover:bg-accent hover:shadow-lg hover:scale-[1.02] transition-all duration-300 shadow-sm animate-slide-up group relative overflow-hidden'
                style={{ animationDelay: '0.2s' }}
              >
                <div className='absolute inset-0 bg-gradient-to-r from-transparent via-accent to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700' />
                <div className='flex items-center justify-center gap-2 relative z-10'>
                  <Download className='h-4 w-4' />
                  <span>Download Report</span>
                </div>
              </button>

              <button
                onClick={handleEndSession}
                className='w-full bg-destructive text-destructive-foreground py-3 rounded-xl font-medium hover:shadow-xl hover:scale-[1.02] transition-all duration-300 shadow-lg animate-slide-up group relative overflow-hidden'
                style={{ animationDelay: '0.3s' }}
              >
                <span className='relative z-10'>End Session</span>
                <div className='absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700' />
              </button>
            </div>
          </div>

          <div className='bg-card border border-border rounded-2xl p-6 shadow-sm hover:shadow-lg transition-shadow duration-300 mb-8'>
            <h3 className='font-heading text-lg mb-4' style={{ fontWeight: 600 }}>
              Students Who Scanned
            </h3>
            {presentStudents.length === 0 ? (
              <div className='text-center py-12 text-muted-foreground'>
                <div className='p-4 bg-accent/50 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4'>
                  <QrCode className='h-8 w-8 opacity-20' />
                </div>
                <p>Waiting for students to scan...</p>
                <p className='text-xs mt-1'>Scanning students will appear here in real-time</p>
              </div>
            ) : (
              <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3'>
                {presentStudents.map((student, index) => (
                  <div
                    key={index}
                    className='flex items-center gap-3 p-3 rounded-xl bg-primary/5 border border-primary/10'
                  >
                    <div className='p-2 bg-primary/10 rounded-lg'>
                      <CheckCircle2 className='h-4 w-4 text-primary' />
                    </div>
                    <div>
                        <div className='text-sm font-medium'>{student.name}</div>
                        <div className='text-xs text-muted-foreground'>{student.roll_no}</div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className='bg-card border border-border rounded-2xl overflow-hidden shadow-sm hover:shadow-lg transition-all duration-300'>
            <button 
              onClick={() => setShowManualMarking(!showManualMarking)}
              className='w-full flex items-center justify-between p-6 hover:bg-accent/30 transition-colors'
            >
              <div className='flex items-center gap-3'>
                <UserPlus className='h-5 w-5 text-muted-foreground' />
                <h3 className='font-heading text-lg' style={{ fontWeight: 600 }}>
                  Manual Attendance & Enrollment List
                </h3>
              </div>
              {showManualMarking ? <ChevronUp className='h-5 w-5' /> : <ChevronDown className='h-5 w-5' />}
            </button>
            
            {showManualMarking && (
              <div className='p-6 pt-0 border-t border-border bg-accent/10'>
                <div className='flex flex-col md:flex-row items-start md:items-center justify-between gap-4 py-6'>
                  <p className='text-sm text-muted-foreground max-w-md'>
                    You can manually mark students as present if they are unable to scan the QR code.
                  </p>
                  <button
                    onClick={handleMarkAllPresent}
                    className='flex items-center gap-2 px-4 py-2 bg-primary/10 text-primary border border-primary/20 rounded-xl text-sm font-medium hover:bg-primary/20 transition-all'
                  >
                    <CheckCheck className='h-4 w-4' />
                    Mark All Present
                  </button>
                </div>

                <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4'>
                  {enrolledStudents.map((student, index) => (
                    <div
                      key={student.student_id}
                      className={`flex items-center justify-between p-4 rounded-xl border transition-all duration-300 ${
                        student.is_present 
                          ? 'bg-primary/5 border-primary/20' 
                          : 'bg-card border-border'
                      }`}
                    >
                      <div className='flex items-center gap-3'>
                        <div className={`p-2 rounded-lg ${student.is_present ? 'bg-primary/20 text-primary' : 'bg-muted text-muted-foreground'}`}>
                          <Users className='h-4 w-4' />
                        </div>
                        <div>
                            <div className='text-sm font-medium'>{student.name}</div>
                            <div className='text-xs text-muted-foreground'>{student.roll_no}</div>
                        </div>
                      </div>
                      {student.is_present ? (
                        <div className='text-primary'>
                          <CheckCircle2 className='h-5 w-5' />
                        </div>
                      ) : (
                        <button
                          onClick={() => handleMarkPresent(student.student_id)}
                          className='p-2 rounded-lg bg-primary text-primary-foreground hover:scale-110 transition-all duration-300 shadow-sm'
                          title='Mark Present'
                        >
                          <UserPlus className='h-4 w-4' />
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          <style>{`
            @keyframes fadeIn {
              from {
                opacity: 0;
                transform: translateY(-10px);
              }
              to {
                opacity: 1;
                transform: translateY(0);
              }
            }
          `}</style>
        </>
      )}
    </div>
  );
}