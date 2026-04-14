import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import { TrendingUp, Users, AlertTriangle, Calendar } from "lucide-react";

export function Analytics() {
  const monthlyTrends = [
    { month: "Oct", attendance: 85 },
    { month: "Nov", attendance: 82 },
    { month: "Dec", attendance: 88 },
    { month: "Jan", attendance: 86 },
    { month: "Feb", attendance: 90 },
    { month: "Mar", attendance: 87 },
    { month: "Apr", attendance: 89 },
  ];

  const subjectWiseData = [
    { subject: "Data Structures", attendance: 92 },
    { subject: "Algorithms", attendance: 88 },
    { subject: "Database Systems", attendance: 95 },
    { subject: "Web Development", attendance: 85 },
    { subject: "Operating Systems", attendance: 78 },
  ];

  const defaulters = [
    { id: "STU032", name: "Rajesh Kumar", percentage: 65, absent: 12 },
    { id: "STU087", name: "Sneha Iyer", percentage: 68, absent: 11 },
    { id: "STU104", name: "Vikram Singh", percentage: 72, absent: 10 },
    { id: "STU156", name: "Meera Nair", percentage: 73, absent: 9 },
    { id: "STU203", name: "Karthik Reddy", percentage: 75, absent: 9 },
    { id: "STU241", name: "Divya Sharma", percentage: 76, absent: 8 },
  ];

  const stats = [
    {
      label: "Avg This Month",
      value: "89%",
      change: "+2%",
      icon: TrendingUp,
      color: "bg-primary/10 text-primary",
    },
    {
      label: "Total Classes",
      value: "124",
      change: "+8",
      icon: Calendar,
      color: "bg-primary/10 text-primary",
    },
    {
      label: "Students Below 75%",
      value: "28",
      change: "-5",
      icon: AlertTriangle,
      color: "bg-destructive/10 text-destructive",
    },
    {
      label: "Perfect Attendance",
      value: "156",
      change: "+12",
      icon: Users,
      color: "bg-primary/10 text-primary",
    },
  ];

  return (
    <div className="max-w-7xl mx-auto pb-20 md:pb-8 relative">
      {/* Animated Background */}
      <div className="absolute top-0 left-10 w-96 h-96 bg-primary/5 rounded-full blur-3xl animate-pulse-slow -z-10" />
      <div className="absolute bottom-20 right-0 w-72 h-72 bg-blue-500/5 rounded-full blur-3xl animate-pulse-slow -z-10" style={{ animationDelay: '3s' }} />
      <div className="mb-8">
        <h1 className="font-heading text-3xl mb-2" style={{ fontWeight: 700 }}>
          Analytics
        </h1>
        <p className="text-muted-foreground">
          Detailed insights and trends for attendance data
        </p>
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

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {/* Monthly Trends */}
        <div className="bg-card border border-border rounded-2xl p-6 shadow-sm hover:shadow-lg transition-shadow duration-300 animate-slide-up">
          <div className="mb-6">
            <h3 className="font-heading text-lg mb-1" style={{ fontWeight: 600 }}>
              Monthly Attendance Trends
            </h3>
            <p className="text-sm text-muted-foreground">
              Overall attendance percentage over the last 7 months
            </p>
          </div>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={monthlyTrends}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e4e4e7" />
              <XAxis
                dataKey="month"
                tick={{ fontSize: 12 }}
                stroke="#71717a"
              />
              <YAxis
                domain={[70, 100]}
                tick={{ fontSize: 12 }}
                stroke="#71717a"
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: "#ffffff",
                  border: "1px solid #e4e4e7",
                  borderRadius: "0.75rem",
                  padding: "0.5rem 0.75rem",
                }}
              />
              <Line
                type="monotone"
                dataKey="attendance"
                stroke="#2563eb"
                strokeWidth={3}
                dot={{ fill: "#2563eb", r: 5 }}
                activeDot={{ r: 7 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Subject-wise Attendance */}
        <div className="bg-card border border-border rounded-2xl p-6 shadow-sm hover:shadow-lg transition-shadow duration-300 animate-slide-up" style={{ animationDelay: '0.1s' }}>
          <div className="mb-6">
            <h3 className="font-heading text-lg mb-1" style={{ fontWeight: 600 }}>
              Subject-wise Attendance
            </h3>
            <p className="text-sm text-muted-foreground">
              Average attendance percentage by subject
            </p>
          </div>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={subjectWiseData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e4e4e7" />
              <XAxis
                dataKey="subject"
                tick={{ fontSize: 11 }}
                stroke="#71717a"
                angle={-15}
                textAnchor="end"
                height={80}
              />
              <YAxis
                domain={[0, 100]}
                tick={{ fontSize: 12 }}
                stroke="#71717a"
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: "#ffffff",
                  border: "1px solid #e4e4e7",
                  borderRadius: "0.75rem",
                  padding: "0.5rem 0.75rem",
                }}
              />
              <Bar
                dataKey="attendance"
                fill="#2563eb"
                radius={[8, 8, 0, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Defaulters List */}
      <div className="bg-card border border-border rounded-2xl overflow-hidden shadow-sm hover:shadow-lg transition-shadow duration-300">
        <div className="p-6 border-b border-border bg-destructive/5">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-destructive/10 rounded-xl">
              <AlertTriangle className="h-5 w-5 text-destructive" />
            </div>
            <div>
              <h3 className="font-heading text-lg" style={{ fontWeight: 600 }}>
                Defaulter List
              </h3>
              <p className="text-sm text-muted-foreground">
                Students with attendance below 80% threshold
              </p>
            </div>
          </div>
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
                  Attendance %
                </th>
                <th className="px-6 py-4 text-left text-sm font-medium text-muted-foreground">
                  Classes Missed
                </th>
                <th className="px-6 py-4 text-left text-sm font-medium text-muted-foreground">
                  Status
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {defaulters.map((student, index) => (
                <tr
                  key={index}
                  className="hover:bg-accent/30 hover:scale-[1.01] transition-all duration-200 cursor-pointer"
                >
                  <td className="px-6 py-4 text-sm font-mono text-muted-foreground">
                    {student.id}
                  </td>
                  <td className="px-6 py-4 text-sm font-medium">{student.name}</td>
                  <td className="px-6 py-4 text-sm">
                    <div className="flex items-center gap-2">
                      <div className="w-24 h-2 bg-accent rounded-full overflow-hidden">
                        <div
                          className={`h-full rounded-full ${
                            student.percentage >= 75
                              ? "bg-warning"
                              : "bg-destructive"
                          }`}
                          style={{ width: `${student.percentage}%` }}
                        />
                      </div>
                      <span
                        className={`text-sm font-medium ${
                          student.percentage >= 75
                            ? "text-warning"
                            : "text-destructive"
                        }`}
                      >
                        {student.percentage}%
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm">
                    <span className="inline-flex items-center px-2.5 py-1 rounded-md text-xs font-medium bg-destructive/10 text-destructive">
                      {student.absent} classes
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm">
                    <span
                      className={`inline-flex items-center px-2.5 py-1 rounded-md text-xs font-medium ${
                        student.percentage >= 75
                          ? "bg-warning/10 text-warning"
                          : "bg-destructive/10 text-destructive"
                      }`}
                    >
                      {student.percentage >= 75 ? "Warning" : "Critical"}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
