import { createBrowserRouter } from "react-router";
import { Layout } from "./components/Layout";
import { Login } from "./components/Login";
import { StudentDashboard } from "./components/StudentDashboard";
import { QRScanner } from "./components/QRScanner";
import { TeacherDashboard } from "./components/TeacherDashboard";
import { AdminDashboard } from "./components/AdminDashboard";
import { Analytics } from "./components/Analytics";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <Login />,
  },
  {
    path: "/",
    element: <Layout />,
    children: [
      {
        path: "student",
        element: <StudentDashboard />,
      },
      {
        path: "student/scan",
        element: <QRScanner />,
      },
      {
        path: "teacher",
        element: <TeacherDashboard />,
      },
      {
        path: "admin",
        element: <AdminDashboard />,
      },
      {
        path: "analytics",
        element: <Analytics />,
      },
    ],
  },
]);
