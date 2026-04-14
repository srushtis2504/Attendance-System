import { Outlet, useLocation, useNavigate } from "react-router";
import { LayoutDashboard, ScanLine, BarChart3, User, LogOut } from "lucide-react";
import { useState } from "react";

export function Layout() {
  const location = useLocation();
  const navigate = useNavigate();
  const [userRole] = useState(() => {
    if (location.pathname.includes("student")) return "student";
    if (location.pathname.includes("teacher")) return "teacher";
    return "admin";
  });

  const handleLogout = () => {
    navigate("/");
  };

  const navItems = {
    student: [
      { path: "/student", icon: LayoutDashboard, label: "Dashboard" },
      { path: "/student/scan", icon: ScanLine, label: "Scan QR" },
      { path: "/analytics", icon: BarChart3, label: "Analytics" },
    ],
    teacher: [
      { path: "/teacher", icon: LayoutDashboard, label: "Dashboard" },
      { path: "/analytics", icon: BarChart3, label: "Analytics" },
    ],
    admin: [
      { path: "/admin", icon: LayoutDashboard, label: "Dashboard" },
      { path: "/analytics", icon: BarChart3, label: "Analytics" },
    ],
  };

  const currentNav = navItems[userRole as keyof typeof navItems];

  return (
    <div className="min-h-screen bg-background relative overflow-hidden">
      {/* Animated Background Mesh */}
      <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/5 rounded-full blur-3xl animate-pulse-slow" />
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-blue-500/5 rounded-full blur-3xl animate-pulse-slow" style={{ animationDelay: '2s' }} />
        <div className="absolute top-2/3 left-2/3 w-64 h-64 bg-primary/3 rounded-full blur-3xl animate-pulse-slow" style={{ animationDelay: '4s' }} />
      </div>
      {/* Top Navigation Bar */}
      <header className="sticky top-0 z-50 w-full border-b border-border bg-card/95 backdrop-blur supports-[backdrop-filter]:bg-card/60 transition-all duration-300">
        <div className="container mx-auto flex h-16 items-center justify-between px-6">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary hover:scale-110 transition-transform duration-300 cursor-pointer shadow-lg shadow-primary/20">
              <ScanLine className="h-5 w-5 text-primary-foreground" />
            </div>
            <div>
              <h1 className="font-heading text-lg tracking-tight" style={{ fontWeight: 600 }}>
                AttendEase
              </h1>
              <p className="text-xs text-muted-foreground capitalize">{userRole}</p>
            </div>
          </div>

          <nav className="hidden md:flex items-center gap-2">
            {currentNav.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.path;
              return (
                <button
                  key={item.path}
                  onClick={() => navigate(item.path)}
                  className={`flex items-center gap-2 rounded-lg px-4 py-2 transition-all duration-300 hover:scale-105 ${
                    isActive
                      ? "bg-primary text-primary-foreground shadow-lg shadow-primary/20"
                      : "text-muted-foreground hover:bg-accent hover:text-foreground hover:shadow-md"
                  }`}
                >
                  <Icon className="h-4 w-4" />
                  <span className="text-sm font-medium">{item.label}</span>
                </button>
              );
            })}
          </nav>

          <button
            onClick={handleLogout}
            className="flex items-center gap-2 rounded-lg px-4 py-2 text-muted-foreground transition-all duration-300 hover:bg-accent hover:text-foreground hover:shadow-md hover:scale-105"
          >
            <LogOut className="h-4 w-4" />
            <span className="hidden md:inline text-sm font-medium">Logout</span>
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-6 py-8 animate-fade-in">
        <Outlet />
      </main>

      {/* Mobile Bottom Navigation */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-card/95 backdrop-blur-lg border-t border-border">
        <div className="flex items-center justify-around px-2 py-3">
          {currentNav.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;
            return (
              <button
                key={item.path}
                onClick={() => navigate(item.path)}
                className={`flex flex-col items-center gap-1 rounded-lg px-4 py-2 transition-all duration-300 hover:scale-110 active:scale-95 ${
                  isActive ? "text-primary scale-105" : "text-muted-foreground"
                }`}
              >
                <Icon className="h-5 w-5" />
                <span className="text-xs font-medium">{item.label}</span>
              </button>
            );
          })}
        </div>
      </nav>
    </div>
  );
}
