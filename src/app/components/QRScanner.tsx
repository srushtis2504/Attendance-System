import { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import { ScanLine, CheckCircle2, XCircle, AlertCircle, ArrowLeft, Clock } from "lucide-react";

type ScanStatus = "scanning" | "success" | "expired" | "invalid" | null;

export function QRScanner() {
  const navigate = useNavigate();
  const [scanStatus, setScanStatus] = useState<ScanStatus>(null);
  const [isScanning, setIsScanning] = useState(false);

  useEffect(() => {
    let timeout: NodeJS.Timeout;
    if (isScanning) {
      setScanStatus("scanning");
      timeout = setTimeout(() => {
        const outcomes: ScanStatus[] = ["success", "expired", "invalid"];
        const randomOutcome = outcomes[Math.floor(Math.random() * outcomes.length)];
        setScanStatus(randomOutcome);
        setIsScanning(false);
      }, 2000);
    }
    return () => clearTimeout(timeout);
  }, [isScanning]);

  const handleScan = () => {
    setIsScanning(true);
    setScanStatus(null);
  };

  const handleBack = () => {
    navigate("/student");
  };

  const statusConfig = {
    scanning: {
      icon: ScanLine,
      title: "Scanning...",
      message: "Position the QR code within the frame",
      color: "text-primary",
      bg: "bg-primary/10",
    },
    success: {
      icon: CheckCircle2,
      title: "Attendance Marked!",
      message: "You have been marked present for this session",
      color: "text-primary",
      bg: "bg-primary/10",
    },
    expired: {
      icon: AlertCircle,
      title: "QR Code Expired",
      message: "This attendance session has ended",
      color: "text-warning",
      bg: "bg-warning/10",
    },
    invalid: {
      icon: XCircle,
      title: "Invalid QR Code",
      message: "This QR code is not recognized",
      color: "text-destructive",
      bg: "bg-destructive/10",
    },
  };

  return (
    <div className="max-w-2xl mx-auto pb-20 md:pb-8 relative">
      {/* Animated Background */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-primary/5 rounded-full blur-3xl animate-pulse-slow -z-10" />
      <div className="absolute bottom-0 left-0 w-72 h-72 bg-blue-500/5 rounded-full blur-3xl animate-pulse-slow -z-10" style={{ animationDelay: '2s' }} />
      <button
        onClick={handleBack}
        className="flex items-center gap-2 text-muted-foreground hover:text-foreground mb-6 transition-all duration-300 hover:scale-105 hover:-translate-x-1"
      >
        <ArrowLeft className="h-4 w-4" />
        <span className="text-sm font-medium">Back to Dashboard</span>
      </button>

      <div className="mb-8 text-center">
        <h1 className="font-heading text-3xl mb-2" style={{ fontWeight: 700 }}>
          QR Scanner
        </h1>
        <p className="text-muted-foreground">Scan the QR code to mark your attendance</p>
      </div>

      {/* Scanner Interface */}
      <div className="bg-card border border-border rounded-2xl overflow-hidden shadow-xl hover:shadow-2xl transition-shadow duration-500 animate-slide-up">
        {/* Camera View */}
        <div className="relative bg-gradient-to-br from-gray-900 to-gray-800 aspect-square md:aspect-video flex items-center justify-center">
          {/* Simulated Camera Feed */}
          <div className="absolute inset-0 bg-gradient-to-br from-gray-800/50 to-gray-900/50" />

          {/* Scanning Frame */}
          <div className="relative z-10 w-64 h-64 md:w-80 md:h-80 transition-all duration-500 hover:scale-105">
            <div className="absolute inset-0 border-2 border-white/30 rounded-2xl transition-all duration-300" />
            {/* Corner Markers */}
            <div className="absolute top-0 left-0 w-8 h-8 border-t-4 border-l-4 border-primary rounded-tl-2xl animate-pulse" />
            <div className="absolute top-0 right-0 w-8 h-8 border-t-4 border-r-4 border-primary rounded-tr-2xl animate-pulse" style={{ animationDelay: '0.2s' }} />
            <div className="absolute bottom-0 left-0 w-8 h-8 border-b-4 border-l-4 border-primary rounded-bl-2xl animate-pulse" style={{ animationDelay: '0.4s' }} />
            <div className="absolute bottom-0 right-0 w-8 h-8 border-b-4 border-r-4 border-primary rounded-br-2xl animate-pulse" style={{ animationDelay: '0.6s' }} />

            {/* Scanning Line Animation */}
            {scanStatus === "scanning" && (
              <div
                className="absolute left-0 right-0 h-1 bg-gradient-to-r from-transparent via-primary to-transparent animate-pulse"
                style={{
                  top: "50%",
                  animation: "scan 2s ease-in-out infinite",
                }}
              />
            )}

            {/* Center Icon */}
            {!scanStatus && (
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6">
                  <ScanLine className="h-12 w-12 text-white" />
                </div>
              </div>
            )}
          </div>

          {/* Scan Instructions */}
          {!scanStatus && (
            <div className="absolute bottom-8 left-0 right-0 text-center">
              <p className="text-white/80 text-sm">Position QR code within the frame</p>
            </div>
          )}
        </div>

        {/* Status Message */}
        {scanStatus && scanStatus !== "scanning" && (
          <div className={`p-6 ${statusConfig[scanStatus].bg}`}>
            <div className="flex items-start gap-4">
              <div className={`p-3 rounded-xl bg-card ${statusConfig[scanStatus].color}`}>
                {(() => {
                  const Icon = statusConfig[scanStatus].icon;
                  return <Icon className="h-6 w-6" />;
                })()}
              </div>
              <div className="flex-1">
                <h3
                  className={`font-heading text-lg mb-1 ${statusConfig[scanStatus].color}`}
                  style={{ fontWeight: 600 }}
                >
                  {statusConfig[scanStatus].title}
                </h3>
                <p className="text-sm text-muted-foreground">
                  {statusConfig[scanStatus].message}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Action Button */}
        <div className="p-6 bg-accent/30">
          <button
            onClick={scanStatus === "success" ? handleBack : handleScan}
            disabled={isScanning}
            className={`w-full py-3 rounded-xl font-medium transition-all duration-300 shadow-lg group relative overflow-hidden ripple-effect ${
              scanStatus === "success"
                ? "bg-card text-foreground border border-border hover:shadow-xl"
                : "bg-primary text-primary-foreground shadow-primary/20 hover:shadow-xl hover:shadow-primary/30"
            } ${isScanning ? "opacity-50 cursor-not-allowed" : "hover:scale-[1.02]"}`}
          >
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700" />
            <span className="relative z-10">
              {scanStatus === "success"
                ? "Back to Dashboard"
                : isScanning
                ? "Scanning..."
                : scanStatus
                ? "Try Again"
                : "Start Scanning"}
            </span>
          </button>
        </div>
      </div>

      {/* Info Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
        <div className="bg-card border border-border rounded-xl p-4 text-center hover:shadow-lg hover:scale-105 transition-all duration-300 animate-fade-in cursor-pointer">
          <div className="inline-flex p-2 bg-primary/10 rounded-lg mb-2">
            <CheckCircle2 className="h-5 w-5 text-primary" />
          </div>
          <p className="text-sm text-muted-foreground">Valid QR codes are generated by teachers</p>
        </div>
        <div className="bg-card border border-border rounded-xl p-4 text-center hover:shadow-lg hover:scale-105 transition-all duration-300 animate-fade-in cursor-pointer" style={{ animationDelay: '0.1s' }}>
          <div className="inline-flex p-2 bg-warning/10 rounded-lg mb-2">
            <Clock className="h-5 w-5 text-warning" />
          </div>
          <p className="text-sm text-muted-foreground">QR codes expire after session ends</p>
        </div>
        <div className="bg-card border border-border rounded-xl p-4 text-center hover:shadow-lg hover:scale-105 transition-all duration-300 animate-fade-in cursor-pointer" style={{ animationDelay: '0.2s' }}>
          <div className="inline-flex p-2 bg-primary/10 rounded-lg mb-2">
            <ScanLine className="h-5 w-5 text-primary" />
          </div>
          <p className="text-sm text-muted-foreground">Scan within the designated time frame</p>
        </div>
      </div>

      <style>{`
        @keyframes scan {
          0%, 100% { top: 10%; }
          50% { top: 90%; }
        }
      `}</style>
    </div>
  );
}
