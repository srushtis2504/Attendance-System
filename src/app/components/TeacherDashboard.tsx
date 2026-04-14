import { useState, useEffect } from "react";
import { Plus, QrCode, Timer, Users, CheckCircle2, XCircle, Download } from "lucide-react";
import { QRCodeCanvas } from "qrcode.react";

export function TeacherDashboard() {
  const [activeSession, setActiveSession] = useState<{
    subject: string;
    startTime: Date;
    duration: number;
    qrCode: string;
  } | null>(null);

  const [timeRemaining, setTimeRemaining] = useState(0);
  const [presentStudents, setPresentStudents] = useState<string[]>([]);

  useEffect(() => {
    if (activeSession) {
      const interval = setInterval(() => {
        const elapsed = Math.floor((Date.now() - activeSession.startTime.getTime()) / 1000);
        const remaining = Math.max(0, activeSession.duration - elapsed);
        setTimeRemaining(remaining);

        if (remaining === 0) {
          clearInterval(interval);
        }

        if (Math.random() > 0.7 && presentStudents.length < 45) {
          const studentNames = [
            "Aarav Sharma",
            "Priya Patel",
            "Arjun Kumar",
            "Ananya Singh",
            "Rohan Mehta",
            "Ishita Reddy",
            "Kabir Gupta",
            "Aditya Rao",
            "Sanya Joshi",
            "Vihaan Nair",
          ];
          const newStudent = studentNames[Math.floor(Math.random() * studentNames.length)];
          if (!presentStudents.includes(newStudent)) {
            setPresentStudents((prev) => [...prev, newStudent]);
          }
        }
      }, 1000);

      return () => clearInterval(interval);
    }
  }, [activeSession, presentStudents]);

  const handleCreateSession = (subject: string) => {
    setActiveSession({
      subject,
      startTime: new Date(),
      duration: 60,
      qrCode: `QR_${subject}_${Date.now()}`,
    });
    setPresentStudents([]);
    setTimeRemaining(60);
  };

  const handleEndSession = () => {
    setActiveSession(null);
    setPresentStudents([]);
    setTimeRemaining(0);
  };

  const handleDownloadSessionReport = () => {
    if (!activeSession) return;

    const csvContent = [
      ["Attendance Report"],
      ["Subject", activeSession.subject],
      ["Date", new Date().toISOString().split("T")[0]],
      ["Time", new Date(activeSession.startTime).toLocaleTimeString()],
      ["Duration", activeSession.duration + " seconds"],
      [],
      ["Students Present", presentStudents.length],
      [],
      ["Student Name", "Time Marked"],
      ...presentStudents.map((student, index) => [
        student,
        new Date(activeSession.startTime.getTime() + index * 5000).toLocaleTimeString(),
      ]),
    ]
      .map((row) => row.join(","))
      .join("\n");

    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `attendance_${activeSession.subject}_${
      new Date().toISOString().split("T")[0]
    }.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
  };

  const handleDownloadAllSessions = () => {
    const csvContent = [
      ["Recent Sessions Report"],
      ["Generated on", new Date().toLocaleString()],
      [],
      ["Subject", "Date", "Present", "Total", "Attendance %"],
      ...recentSessions.map((session) => [
        session.subject,
        session.date,
        session.attendance,
        session.total,
        ((session.attendance / session.total) * 100).toFixed(1) + "%",
      ]),
    ]
      .map((row) => row.join(","))
      .join("\n");

    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `all_sessions_${new Date().toISOString().split("T")[0]}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
  };

  const subjects = [
    "Data Structures",
    "Algorithms",
    "Database Systems",
    "Web Development",
    "Operating Systems",
  ];

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  const recentSessions = [
    { subject: "Data Structures", date: "2026-04-13", attendance: 42, total: 45 },
    { subject: "Web Development", date: "2026-04-12", attendance: 38, total: 45 },
    { subject: "Database Systems", date: "2026-04-11", attendance: 44, total: 45 },
  ];

  return (
    <div className="max-w-7xl mx-auto pb-20 md:pb-8 relative">
      {/* Animated Background */}
      <div className="absolute top-0 left-0 w-96 h-96 bg-primary/5 rounded-full blur-3xl animate-pulse-slow -z-10" />
      <div className="absolute bottom-20 right-10 w-72 h-72 bg-blue-500/5 rounded-full blur-3xl animate-pulse-slow -z-10" style={{ animationDelay: '3s' }} />
      <div className="mb-8 flex items-start justify-between">
        <div>
          <h1 className="font-heading text-3xl mb-2" style={{ fontWeight: 700 }}>
            Teacher Dashboard
          </h1>
          <p className="text-muted-foreground">Create attendance sessions and track students</p>
        </div>
        {!activeSession && (
          <button
            onClick={handleDownloadAllSessions}
            className="flex items-center gap-2 px-4 py-2.5 bg-card border border-border rounded-xl hover:bg-accent hover:shadow-lg hover:scale-105 transition-all duration-300 shadow-sm"
          >
            <Download className="h-4 w-4" />
            <span className="text-sm font-medium hidden md:inline">Download All Sessions</span>
          </button>
        )}
      </div>

      {!activeSession ? (
        <>
          {/* Create New Session */}
          <div className="bg-card border border-border rounded-2xl p-8 mb-8 shadow-sm hover:shadow-lg transition-shadow duration-300 animate-fade-in">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-3 bg-primary/10 rounded-xl">
                <Plus className="h-6 w-6 text-primary" />
              </div>
              <div>
                <h2 className="font-heading text-xl" style={{ fontWeight: 600 }}>
                  Create New Session
                </h2>
                <p className="text-sm text-muted-foreground">
                  Select a subject to start attendance
                </p>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
              {subjects.map((subject) => (
                <button
                  key={subject}
                  onClick={() => handleCreateSession(subject)}
                  className="p-4 rounded-xl border-2 border-border hover:border-primary hover:bg-primary/5 hover:scale-105 hover:shadow-lg transition-all duration-300 text-left group"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-medium">{subject}</span>
                    <QrCode className="h-5 w-5 text-muted-foreground group-hover:text-primary transition-colors" />
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Recent Sessions */}
          <div className="bg-card border border-border rounded-2xl p-6 shadow-sm hover:shadow-lg transition-shadow duration-300">
            <h3 className="font-heading text-lg mb-4" style={{ fontWeight: 600 }}>
              Recent Sessions
            </h3>
            <div className="space-y-3">
              {recentSessions.map((session, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-4 rounded-xl bg-accent/50 hover:bg-accent hover:scale-[1.02] hover:shadow-md transition-all duration-300 cursor-pointer"
                >
                  <div>
                    <h4 className="font-medium mb-1">{session.subject}</h4>
                    <p className="text-xs text-muted-foreground">{session.date}</p>
                  </div>
                  <div className="text-right">
                    <div className="font-heading text-xl text-primary" style={{ fontWeight: 600 }}>
                      {session.attendance}/{session.total}
                    </div>
                    <p className="text-xs text-muted-foreground">Students</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </>
      ) : (
        <>
          {/* Active Session */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
            {/* QR Code Display */}
            <div className="lg:col-span-2 bg-gradient-to-br from-primary via-primary to-blue-600 rounded-2xl p-8 text-primary-foreground shadow-xl animate-gradient hover:shadow-2xl transition-shadow duration-500 relative overflow-hidden group">
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
              <div className="mb-6 relative z-10">
                <h2 className="font-heading text-2xl mb-1" style={{ fontWeight: 700 }}>
                  {activeSession.subject}
                </h2>
                <p className="text-primary-foreground/80">Active Session</p>
              </div>

              <div className="flex items-center justify-center relative z-10">
                <div className="bg-white p-8 rounded-2xl shadow-lg hover:shadow-2xl hover:scale-105 transition-all duration-500 animate-float animate-glow">
                  <div className="bg-gray-100 rounded-xl flex items-center justify-center border-4 border-primary/20 p-4">
                    <QRCodeCanvas
                      value={activeSession.qrCode}
                      size={200}
                      level={"H"}
                      includeMargin={false}
                    />
                  </div>
                  <p className="text-center text-xs text-gray-500 mt-4 font-mono">
                    {activeSession.qrCode}
                  </p>
                </div>
              </div>
            </div>

            {/* Timer and Controls */}
            <div className="space-y-6">
              {/* Timer Card */}
              <div className="bg-card border border-border rounded-2xl p-6 shadow-sm hover:shadow-lg transition-all duration-300 animate-slide-up">
                <div className="flex items-center gap-3 mb-4">
                  <div
                    className={`p-3 rounded-xl ${
                      timeRemaining > 20
                        ? "bg-primary/10 text-primary"
                        : timeRemaining > 0
                        ? "bg-warning/10 text-warning"
                        : "bg-destructive/10 text-destructive"
                    }`}
                  >
                    <Timer className="h-6 w-6" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Time Remaining</p>
                    <h3
                      className={`font-heading text-3xl ${
                        timeRemaining > 20
                          ? "text-primary"
                          : timeRemaining > 0
                          ? "text-warning animate-pulse"
                          : "text-destructive animate-pulse"
                      }`}
                      style={{ fontWeight: 700 }}
                    >
                      {formatTime(timeRemaining)}
                    </h3>
                  </div>
                </div>
                <div className="relative h-2 bg-accent rounded-full overflow-hidden">
                  <div
                    className={`absolute top-0 left-0 h-full rounded-full transition-all duration-1000 shadow-lg ${
                      timeRemaining > 20
                        ? "bg-primary shadow-primary/50"
                        : timeRemaining > 0
                        ? "bg-warning shadow-warning/50 animate-pulse"
                        : "bg-destructive shadow-destructive/50 animate-pulse"
                    }`}
                    style={{
                      width: `${(timeRemaining / activeSession.duration) * 100}%`,
                    }}
                  />
                </div>
              </div>

              {/* Attendance Count */}
              <div className="bg-card border border-border rounded-2xl p-6 shadow-sm hover:shadow-lg transition-all duration-300 animate-slide-up" style={{ animationDelay: '0.1s' }}>
                <div className="flex items-center gap-3 mb-2">
                  <Users className="h-5 w-5 text-primary" />
                  <p className="text-sm text-muted-foreground">Students Present</p>
                </div>
                <h3 className="font-heading text-4xl text-primary transition-all duration-500" style={{ fontWeight: 700 }}>
                  {presentStudents.length}
                </h3>
              </div>

              {/* Download Report Button */}
              <button
                onClick={handleDownloadSessionReport}
                className="w-full bg-card border border-border text-foreground py-3 rounded-xl font-medium hover:bg-accent hover:shadow-lg hover:scale-[1.02] transition-all duration-300 shadow-sm animate-slide-up group relative overflow-hidden"
                style={{ animationDelay: '0.2s' }}
              >
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-accent to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700" />
                <div className="flex items-center justify-center gap-2 relative z-10">
                  <Download className="h-4 w-4" />
                  <span>Download Report</span>
                </div>
              </button>

              {/* End Session Button */}
              <button
                onClick={handleEndSession}
                className="w-full bg-destructive text-destructive-foreground py-3 rounded-xl font-medium hover:shadow-xl hover:scale-[1.02] transition-all duration-300 shadow-lg animate-slide-up group relative overflow-hidden"
                style={{ animationDelay: '0.3s' }}
              >
                <span className="relative z-10">End Session</span>
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700" />
              </button>
            </div>
          </div>

          {/* Present Students List */}
          <div className="bg-card border border-border rounded-2xl p-6 shadow-sm hover:shadow-lg transition-shadow duration-300">
            <h3 className="font-heading text-lg mb-4" style={{ fontWeight: 600 }}>
              Students Marked Present
            </h3>
            {presentStudents.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                <Users className="h-12 w-12 mx-auto mb-3 opacity-50" />
                <p>No students marked yet</p>
                <p className="text-sm mt-1">Students will appear here as they scan the QR code</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                {presentStudents.map((student, index) => (
                  <div
                    key={index}
                    className="flex items-center gap-3 p-3 rounded-xl bg-accent/50"
                    style={{
                      animation: `fadeIn 0.3s ease-out ${index * 0.05}s both`,
                    }}
                  >
                    <div className="p-2 bg-primary/10 rounded-lg">
                      <CheckCircle2 className="h-4 w-4 text-primary" />
                    </div>
                    <span className="text-sm font-medium">{student}</span>
                  </div>
                ))}
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
