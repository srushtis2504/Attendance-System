import { useState } from "react";
import { Users, TrendingUp, AlertTriangle, Calendar, Search, Filter, Download } from "lucide-react";

export function AdminDashboard() {
  const [selectedClass, setSelectedClass] = useState("all");
  const [selectedSubject, setSelectedSubject] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");

  const stats = [
    {
      label: "Total Students",
      value: "1,248",
      change: "+12%",
      icon: Users,
      color: "bg-primary/10 text-primary",
    },
    {
      label: "Avg Attendance",
      value: "87.5%",
      change: "+3.2%",
      icon: TrendingUp,
      color: "bg-primary/10 text-primary",
    },
    {
      label: "Defaulters",
      value: "142",
      change: "-8%",
      icon: AlertTriangle,
      color: "bg-destructive/10 text-destructive",
    },
    {
      label: "Active Sessions",
      value: "8",
      change: "Live",
      icon: Calendar,
      color: "bg-primary/10 text-primary",
    },
  ];

  const attendanceRecords = [
    {
      id: "STU001",
      name: "Aarav Sharma",
      class: "CS-A",
      subject: "Data Structures",
      date: "2026-04-14",
      status: "Present",
      percentage: 92,
    },
    {
      id: "STU002",
      name: "Priya Patel",
      class: "CS-A",
      subject: "Algorithms",
      date: "2026-04-14",
      status: "Present",
      percentage: 88,
    },
    {
      id: "STU003",
      name: "Arjun Kumar",
      class: "CS-B",
      subject: "Database Systems",
      date: "2026-04-14",
      status: "Absent",
      percentage: 75,
    },
    {
      id: "STU004",
      name: "Ananya Singh",
      class: "CS-A",
      subject: "Web Development",
      date: "2026-04-14",
      status: "Present",
      percentage: 95,
    },
    {
      id: "STU005",
      name: "Rohan Mehta",
      class: "CS-B",
      subject: "Operating Systems",
      date: "2026-04-14",
      status: "Present",
      percentage: 82,
    },
    {
      id: "STU006",
      name: "Ishita Reddy",
      class: "CS-A",
      subject: "Data Structures",
      date: "2026-04-14",
      status: "Absent",
      percentage: 78,
    },
    {
      id: "STU007",
      name: "Kabir Gupta",
      class: "CS-B",
      subject: "Algorithms",
      date: "2026-04-14",
      status: "Present",
      percentage: 91,
    },
    {
      id: "STU008",
      name: "Aditya Rao",
      class: "CS-A",
      subject: "Database Systems",
      date: "2026-04-13",
      status: "Present",
      percentage: 86,
    },
  ];

  const filteredRecords = attendanceRecords.filter((record) => {
    const matchesClass = selectedClass === "all" || record.class === selectedClass;
    const matchesSubject = selectedSubject === "all" || record.subject === selectedSubject;
    const matchesSearch =
      searchQuery === "" ||
      record.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      record.id.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesClass && matchesSubject && matchesSearch;
  });

  const handleDownloadRecords = () => {
    const csvContent = [
      ["Attendance Records Export"],
      ["Generated on", new Date().toLocaleString()],
      ["Filters Applied"],
      ["Class", selectedClass === "all" ? "All Classes" : selectedClass],
      ["Subject", selectedSubject === "all" ? "All Subjects" : selectedSubject],
      ["Search Query", searchQuery || "None"],
      [],
      ["Total Records", filteredRecords.length],
      [],
      ["Student ID", "Name", "Class", "Subject", "Date", "Status", "Overall %"],
      ...filteredRecords.map((record) => [
        record.id,
        record.name,
        record.class,
        record.subject,
        record.date,
        record.status,
        record.percentage + "%",
      ]),
      [],
      ["Summary Statistics"],
      ["Total Students", stats[0].value],
      ["Average Attendance", stats[1].value],
      ["Defaulters", stats[2].value],
      ["Active Sessions", stats[3].value],
    ]
      .map((row) => row.join(","))
      .join("\n");

    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `admin_attendance_report_${new Date().toISOString().split("T")[0]}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
  };

  return (
    <div className="max-w-7xl mx-auto pb-20 md:pb-8 relative">
      {/* Animated Background */}
      <div className="absolute top-20 right-0 w-96 h-96 bg-primary/5 rounded-full blur-3xl animate-pulse-slow -z-10" />
      <div className="absolute bottom-0 left-20 w-72 h-72 bg-blue-500/5 rounded-full blur-3xl animate-pulse-slow -z-10" style={{ animationDelay: '2s' }} />
      <div className="mb-8 flex items-start justify-between">
        <div>
          <h1 className="font-heading text-3xl mb-2" style={{ fontWeight: 700 }}>
            Admin Dashboard
          </h1>
          <p className="text-muted-foreground">
            Monitor attendance across all classes and subjects
          </p>
        </div>
        <button
          onClick={handleDownloadRecords}
          className="flex items-center gap-2 px-4 py-2.5 bg-primary text-primary-foreground rounded-xl hover:shadow-xl hover:shadow-primary/30 hover:scale-105 transition-all duration-300 shadow-lg shadow-primary/20 group relative overflow-hidden"
        >
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700" />
          <Download className="h-4 w-4 relative z-10" />
          <span className="text-sm font-medium hidden md:inline relative z-10">Export Data</span>
        </button>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8 animate-fade-in">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <div
              key={index}
              className="bg-card border border-border rounded-xl p-6 shadow-sm hover:shadow-xl hover:scale-105 transition-all duration-300 animate-fade-in cursor-pointer"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <div className="flex items-start justify-between mb-4">
                <div className={`p-3 rounded-xl ${stat.color}`}>
                  <Icon className="h-5 w-5" />
                </div>
                <span className="text-xs text-muted-foreground bg-accent px-2 py-1 rounded-md">
                  {stat.change}
                </span>
              </div>
              <h3 className="font-heading text-2xl mb-1" style={{ fontWeight: 700 }}>
                {stat.value}
              </h3>
              <p className="text-sm text-muted-foreground">{stat.label}</p>
            </div>
          );
        })}
      </div>

      {/* Filters and Search */}
      <div className="bg-card border border-border rounded-2xl p-6 mb-6 shadow-sm hover:shadow-lg transition-shadow duration-300">
        <div className="flex items-center gap-3 mb-4">
          <Filter className="h-5 w-5 text-muted-foreground" />
          <h3 className="font-heading text-lg" style={{ fontWeight: 600 }}>
            Filter Records
          </h3>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search by name or ID..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-border bg-input-background focus:outline-none focus:ring-2 focus:ring-ring focus:border-primary transition-all duration-300 hover:shadow-md"
            />
          </div>

          {/* Class Filter */}
          <select
            value={selectedClass}
            onChange={(e) => setSelectedClass(e.target.value)}
            className="px-4 py-2.5 rounded-xl border border-border bg-input-background focus:outline-none focus:ring-2 focus:ring-ring focus:border-primary transition-all duration-300 hover:shadow-md cursor-pointer"
          >
            <option value="all">All Classes</option>
            <option value="CS-A">CS-A</option>
            <option value="CS-B">CS-B</option>
          </select>

          {/* Subject Filter */}
          <select
            value={selectedSubject}
            onChange={(e) => setSelectedSubject(e.target.value)}
            className="px-4 py-2.5 rounded-xl border border-border bg-input-background focus:outline-none focus:ring-2 focus:ring-ring focus:border-primary transition-all duration-300 hover:shadow-md cursor-pointer"
          >
            <option value="all">All Subjects</option>
            <option value="Data Structures">Data Structures</option>
            <option value="Algorithms">Algorithms</option>
            <option value="Database Systems">Database Systems</option>
            <option value="Web Development">Web Development</option>
            <option value="Operating Systems">Operating Systems</option>
          </select>
        </div>
      </div>

      {/* Attendance Records Table */}
      <div className="bg-card border border-border rounded-2xl overflow-hidden shadow-sm hover:shadow-lg transition-shadow duration-300">
        <div className="p-6 border-b border-border">
          <h3 className="font-heading text-lg" style={{ fontWeight: 600 }}>
            Attendance Records
          </h3>
          <p className="text-sm text-muted-foreground mt-1">
            {filteredRecords.length} records found
          </p>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-accent/50">
              <tr>
                <th className="px-6 py-4 text-left text-sm font-medium text-muted-foreground">
                  Student ID
                </th>
                <th className="px-6 py-4 text-left text-sm font-medium text-muted-foreground">
                  Name
                </th>
                <th className="px-6 py-4 text-left text-sm font-medium text-muted-foreground">
                  Class
                </th>
                <th className="px-6 py-4 text-left text-sm font-medium text-muted-foreground">
                  Subject
                </th>
                <th className="px-6 py-4 text-left text-sm font-medium text-muted-foreground">
                  Date
                </th>
                <th className="px-6 py-4 text-left text-sm font-medium text-muted-foreground">
                  Status
                </th>
                <th className="px-6 py-4 text-left text-sm font-medium text-muted-foreground">
                  Overall %
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {filteredRecords.map((record, index) => (
                <tr
                  key={index}
                  className="hover:bg-accent/30 hover:scale-[1.01] transition-all duration-200 cursor-pointer"
                >
                  <td className="px-6 py-4 text-sm font-mono text-muted-foreground">
                    {record.id}
                  </td>
                  <td className="px-6 py-4 text-sm font-medium">{record.name}</td>
                  <td className="px-6 py-4 text-sm">{record.class}</td>
                  <td className="px-6 py-4 text-sm">{record.subject}</td>
                  <td className="px-6 py-4 text-sm text-muted-foreground">{record.date}</td>
                  <td className="px-6 py-4 text-sm">
                    <span
                      className={`inline-flex items-center px-2.5 py-1 rounded-md text-xs font-medium ${
                        record.status === "Present"
                          ? "bg-primary/10 text-primary"
                          : "bg-destructive/10 text-destructive"
                      }`}
                    >
                      {record.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm">
                    <div className="flex items-center gap-2">
                      <div className="flex-1 h-2 bg-accent rounded-full overflow-hidden">
                        <div
                          className={`h-full rounded-full ${
                            record.percentage >= 80
                              ? "bg-primary"
                              : record.percentage >= 70
                              ? "bg-warning"
                              : "bg-destructive"
                          }`}
                          style={{ width: `${record.percentage}%` }}
                        />
                      </div>
                      <span
                        className={`text-sm font-medium min-w-[3rem] text-right ${
                          record.percentage >= 80
                            ? "text-primary"
                            : record.percentage >= 70
                            ? "text-warning"
                            : "text-destructive"
                        }`}
                      >
                        {record.percentage}%
                      </span>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {filteredRecords.length === 0 && (
          <div className="text-center py-12 text-muted-foreground">
            <Search className="h-12 w-12 mx-auto mb-3 opacity-50" />
            <p>No records found</p>
            <p className="text-sm mt-1">Try adjusting your filters</p>
          </div>
        )}
      </div>
    </div>
  );
}
