import { useState } from "react";
import { useNavigate } from "react-router";
import { ScanLine, User, GraduationCap, Shield } from "lucide-react";

export function Login() {
  const navigate = useNavigate();
  const [selectedRole, setSelectedRole] = useState<"student" | "teacher" | "admin">("student");
  const [isSignup, setIsSignup] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    navigate(`/${selectedRole}`);
  };

  const roles = [
    { value: "student" as const, label: "Student", icon: GraduationCap },
    { value: "teacher" as const, label: "Teacher", icon: User },
    { value: "admin" as const, label: "Admin", icon: Shield },
  ];

  return (
    <div className="min-h-screen w-full flex items-center justify-center relative overflow-hidden p-6">
      {/* Animated Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-background via-secondary/30 to-background" />
      <div className="absolute inset-0 animate-gradient bg-gradient-to-br from-primary/5 via-transparent to-blue-500/5" />

      {/* Floating Shapes */}
      <div className="absolute top-20 left-10 w-72 h-72 bg-primary/10 rounded-full blur-3xl animate-pulse-slow" />
      <div className="absolute bottom-20 right-10 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl animate-pulse-slow" style={{ animationDelay: '2s' }} />

      <div className="w-full max-w-md relative z-10 animate-slide-up">
        {/* Logo and Header */}
        <div className="mb-8 text-center">
          <div className="inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-primary shadow-lg shadow-primary/20 mb-4 hover:shadow-xl hover:shadow-primary/30 transition-all duration-500 hover:scale-110 cursor-pointer">
            <ScanLine className="h-8 w-8 text-primary-foreground" />
          </div>
          <h1 className="font-heading text-3xl tracking-tight mb-2" style={{ fontWeight: 700 }}>
            AttendEase
          </h1>
          <p className="text-muted-foreground">
            Smart QR-based attendance management
          </p>
        </div>

        {/* Login Card */}
        <div className="bg-card/80 backdrop-blur-xl rounded-2xl shadow-xl border border-border overflow-hidden hover:shadow-2xl transition-shadow duration-500">
          <div className="p-8">
            <h2 className="font-heading text-xl mb-6" style={{ fontWeight: 600 }}>
              {isSignup ? "Create Account" : "Welcome Back"}
            </h2>

            {/* Role Selection */}
            <div className="mb-6">
              <label className="block text-sm font-medium mb-3">Select Role</label>
              <div className="grid grid-cols-3 gap-2">
                {roles.map((role) => {
                  const Icon = role.icon;
                  const isSelected = selectedRole === role.value;
                  return (
                    <button
                      key={role.value}
                      type="button"
                      onClick={() => setSelectedRole(role.value)}
                      className={`flex flex-col items-center gap-2 p-4 rounded-xl border-2 transition-all duration-300 hover:scale-105 ${
                        isSelected
                          ? "border-primary bg-primary/5 text-primary shadow-lg shadow-primary/10"
                          : "border-border hover:border-muted-foreground/30 hover:bg-accent/50"
                      }`}
                    >
                      <Icon className="h-5 w-5" />
                      <span className="text-xs font-medium">{role.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">Email</label>
                <input
                  type="email"
                  placeholder="name@example.com"
                  className="w-full px-4 py-3 rounded-xl border border-border bg-input-background focus:outline-none focus:ring-2 focus:ring-ring focus:border-primary transition-all duration-300 hover:shadow-md focus:scale-[1.01]"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Password</label>
                <input
                  type="password"
                  placeholder="••••••••"
                  className="w-full px-4 py-3 rounded-xl border border-border bg-input-background focus:outline-none focus:ring-2 focus:ring-ring focus:border-primary transition-all duration-300 hover:shadow-md focus:scale-[1.01]"
                  required
                />
              </div>

              {isSignup && (
                <div>
                  <label className="block text-sm font-medium mb-2">Confirm Password</label>
                  <input
                    type="password"
                    placeholder="••••••••"
                    className="w-full px-4 py-3 rounded-xl border border-border bg-input-background focus:outline-none focus:ring-2 focus:ring-ring focus:border-primary transition-all duration-300 hover:shadow-md focus:scale-[1.01]"
                    required
                  />
                </div>
              )}

              <button
                type="submit"
                className="w-full bg-primary text-primary-foreground py-3 rounded-xl font-medium hover:shadow-xl hover:shadow-primary/30 hover:scale-[1.02] transition-all duration-300 shadow-lg shadow-primary/20 ripple-effect"
              >
                {isSignup ? "Create Account" : "Sign In"}
              </button>
            </form>

            <div className="mt-6 text-center">
              <button
                type="button"
                onClick={() => setIsSignup(!isSignup)}
                className="text-sm text-muted-foreground hover:text-foreground transition-all duration-300 hover:scale-105"
              >
                {isSignup ? "Already have an account? " : "Don't have an account? "}
                <span className="text-primary font-medium">
                  {isSignup ? "Sign In" : "Sign Up"}
                </span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
