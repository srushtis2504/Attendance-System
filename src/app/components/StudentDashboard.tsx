import { useNavigate } from "react-router";
import { ScanLine, TrendingUp, CheckCircle2, XCircle, Clock, Download } from "lucide-react";

export function StudentDashboard() {
  const navigate = useNavigate();

  const subjects = [
    { name: "Data Structures", attendance: 92, total: 25, present: 23 },
    { name: "Algorithms", attendance: 88, total: 22, present: 19 },
    { name: "Database Systems", attendance: 95, total: 20, present: 19 },
    { name: "Web Development", attendance: 85, total: 18, present: 15 },
    { name: "Operating Systems", attendance: 78, total: 24, present: 19 },
  ];

  const recentActivity = [
    { subject: "Data Structures", date: "2026-04-14", time: "09:30 AM", status: "present" },
    { subject: "Web Development", date: "2026-04-13", time: "02:15 PM", status: "present" },
    { subject: "Database Systems", date: "2026-04-12", time: "11:00 AM", status: "present" },
    { subject: "Operating Systems", date: "2026-04-11", time: "10:30 AM", status: "absent" },
    { subject: "Algorithms", date: "2026-04-10", time: "01:45 PM", status: "present" },
  ];

  const overallAttendance = 87;

  const handleDownloadAttendance = () => {
    const csvContent = [
      ["Subject", "Total Classes", "Present", "Attendance %", "Status"],
      ...subjects.map((subject) => [
        subject.name,
        subject.total,
        subject.present,
        subject.attendance + "%",
        subject.attendance >= 80 ? "Good" : "Low",
      ]),
      [],
      ["Recent Activity"],
      ["Subject", "Date", "Time", "Status"],
      ...recentActivity.map((activity) => [
        activity.subject,
        activity.date,
        activity.time,
        activity.status,
      ]),
      [],
      ["Overall Attendance", overallAttendance + "%"],
    ]
      .map((row) => row.join(","))
      .join("\n");

    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `attendance_report_${new Date().toISOString().split("T")[0]}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
  };

  return (
    <div className="max-w-7xl mx-auto pb-20 md:pb-8 relative">
      {/* Animated Background Elements */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-primary/5 rounded-full blur-3xl animate-pulse-slow -z-10" />
      <div className="absolute bottom-0 left-0 w-72 h-72 bg-blue-500/5 rounded-full blur-3xl animate-pulse-slow -z-10" style={{ animationDelay: '2s' }} />
      <div className="mb-8 flex items-start justify-between">
        <div>
          <h1 className="font-heading text-3xl mb-2" style={{ fontWeight: 700 }}>
            Dashboard
          </h1>
          <p className="text-muted-foreground">Track your attendance and stay updated</p>
        </div>
        <button
          onClick={handleDownloadAttendance}
          className="flex items-center gap-2 px-4 py-2.5 bg-card border border-border rounded-xl hover:bg-accent hover:shadow-lg hover:scale-105 transition-all duration-300 shadow-sm"
        >
          <Download className="h-4 w-4" />
          <span className="text-sm font-medium hidden md:inline">Download Report</span>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8 animate-fade-in">
        {/* Overall Attendance Card */}
        <div className="lg:col-span-2 bg-gradient-to-br from-primary via-primary to-blue-600 rounded-2xl p-8 text-primary-foreground shadow-xl hover:shadow-2xl transition-all duration-500 animate-gradient relative overflow-hidden group">
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
          <div className="flex items-start justify-between mb-6 relative z-10">
            <div>
              <p className="text-primary-foreground/80 mb-1">Overall Attendance</p>
              <h2 className="font-heading text-6xl mb-2" style={{ fontWeight: 700 }}>
                {overallAttendance}%
              </h2>
              <div className="flex items-center gap-2 text-primary-foreground/90">
                <TrendingUp className="h-4 w-4" />
                <span className="text-sm">+3% from last month</span>
              </div>
            </div>
            <div className="bg-white/20 backdrop-blur-sm rounded-xl p-3 animate-float">
              <CheckCircle2 className="h-8 w-8" />
            </div>
          </div>
          <div className="relative h-2 bg-white/20 rounded-full overflow-hidden z-10">
            <div
              className="absolute top-0 left-0 h-full bg-white rounded-full transition-all duration-1000 shadow-lg shadow-white/50"
              style={{ width: `${overallAttendance}%` }}
            />
          </div>
        </div>

        {/* Scan QR CTA */}
        <div className="bg-card border border-border rounded-2xl p-6 flex flex-col justify-between shadow-sm hover:shadow-xl transition-all duration-500 hover:scale-[1.02] animate-fade-in">
          <div className="mb-4">
            <div className="inline-flex p-3 bg-primary/10 rounded-xl mb-3">
              <ScanLine className="h-6 w-6 text-primary" />
            </div>
            <h3 className="font-heading text-lg mb-2" style={{ fontWeight: 600 }}>
              Mark Attendance
            </h3>
            <p className="text-sm text-muted-foreground">
              Scan the QR code displayed by your teacher
            </p>
          </div>
          <button
            onClick={() => navigate("/student/scan")}
            className="w-full bg-primary text-primary-foreground py-3 rounded-xl font-medium hover:shadow-xl hover:shadow-primary/30 hover:scale-[1.02] transition-all duration-300 shadow-lg shadow-primary/20 group relative overflow-hidden ripple-effect"
          >
            <span className="relative z-10">Open Scanner</span>
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700" />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 animate-slide-up" style={{ animationDelay: '0.2s' }}>
        {/* Subjects List */}
        <div className="bg-card border border-border rounded-2xl p-6 shadow-sm hover:shadow-lg transition-shadow duration-300">
          <h3 className="font-heading text-lg mb-4" style={{ fontWeight: 600 }}>
            Subjects
          </h3>
          <div className="space-y-3">
            {subjects.map((subject, index) => {
              const isLow = subject.attendance < 80;
              return (
                <div
                  key={index}
                  className="flex items-center justify-between p-4 rounded-xl bg-accent/50 hover:bg-accent hover:scale-[1.02] hover:shadow-md transition-all duration-300 cursor-pointer"
                >
                  <div className="flex-1">
                    <h4 className="font-medium mb-1">{subject.name}</h4>
                    <p className="text-xs text-muted-foreground">
                      {subject.present} / {subject.total} classes
                    </p>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="text-right">
                      <div
                        className={`font-heading text-xl ${
                          isLow ? "text-destructive" : "text-primary"
                        }`}
                        style={{ fontWeight: 600 }}
                      >
                        {subject.attendance}%
                      </div>
                    </div>
                    <div
                      className={`w-2 h-2 rounded-full ${
                        isLow ? "bg-destructive" : "bg-primary"
                      }`}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Recent Activity */}
        <div className="bg-card border border-border rounded-2xl p-6 shadow-sm hover:shadow-lg transition-shadow duration-300">
          <h3 className="font-heading text-lg mb-4" style={{ fontWeight: 600 }}>
            Recent Activity
          </h3>
          <div className="space-y-3">
            {recentActivity.map((activity, index) => (
              <div
                key={index}
                className="flex items-start gap-3 p-3 rounded-xl hover:bg-accent/50 hover:scale-[1.01] transition-all duration-200 cursor-pointer"
              >
                <div
                  className={`p-2 rounded-lg ${
                    activity.status === "present"
                      ? "bg-primary/10 text-primary"
                      : "bg-destructive/10 text-destructive"
                  }`}
                >
                  {activity.status === "present" ? (
                    <CheckCircle2 className="h-4 w-4" />
                  ) : (
                    <XCircle className="h-4 w-4" />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-sm truncate">{activity.subject}</p>
                  <div className="flex items-center gap-2 text-xs text-muted-foreground mt-1">
                    <Clock className="h-3 w-3" />
                    <span>
                      {activity.date} • {activity.time}
                    </span>
                  </div>
                </div>
                <div
                  className={`text-xs font-medium px-2 py-1 rounded-md ${
                    activity.status === "present"
                      ? "bg-primary/10 text-primary"
                      : "bg-destructive/10 text-destructive"
                  }`}
                >
                  {activity.status === "present" ? "Present" : "Absent"}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
