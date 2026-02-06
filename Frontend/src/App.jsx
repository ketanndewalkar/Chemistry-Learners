import "./App.css";
import { Toaster } from "react-hot-toast";
import {
  createBrowserRouter,
  Navigate,
  RouterProvider,
} from "react-router-dom";

/* ---------- LAYOUTS ---------- */
import PublicLayout from "./components/layout/Layout/PublicLayout";
import LearnLayout from "./components/layout/Layout/LearnLayout";
import LectureLayout from "./components/layout/Layout/LectureLayout";
import AdminLayout from "./components/layout/Layout/AdminLayout";

/* ---------- ROUTE GUARDS ---------- */
import ProtectedRoute from "./components/ProtectedRoute/ProtectedRoute";
import AdminRoute from "./components/ProtectedRoute/AdminRoute";

/* ---------- UI ---------- */
import GlobalLoader from "./components/ui/GlobalLoader";
import Profile from "./components/ui/Profile";

/* ---------- AUTH ---------- */
import AuthPage from "./pages/AuthPage/AuthPage";
import ForgotPassword from "./pages/AuthPage/ForgotPassword";
import VerifyEmail from "./pages/PublicPages/VerifyEmail";

/* ---------- PUBLIC PAGES ---------- */
import Home from "./pages/Home/Home";
import About from "./pages/PublicPages/About";
import Contact from "./pages/PublicPages/Contact";

/* ---------- STUDENT PAGES ---------- */
import StudentDashboard from "./pages/StudentPages/StudentDashboard";
import BatchSearchFilters from "./pages/StudentPages/BatchSearchFilters";
import CourseDetailPage from "./pages/StudentPages/CourseDetailPage";
import LecturePlayerPage from "./pages/StudentPages/LecturePlayerPage";
import MyPurchases from "./pages/StudentPages/MyPurchases";
import FreeMaterialPage from "./pages/StudentPages/FreeMaterialPage";
import FreeMaterial from "./pages/StudentPages/FreeMaterial";
 
/* ---------- ADMIN PAGES ---------- */
import AdminDashboard from "./pages/AdminPages/DashboardPage";
import CoursesPage from "./pages/AdminPages/CoursesPage";
import CreateCoursePage from "./pages/AdminPages/CreateCoursePage";
import EditCoursePage from "./pages/AdminPages/EditCoursePage";
import CourseContentEditor from "./pages/AdminPages/CourseContentEditor";
import CourseMaterialsPage from "./pages/AdminPages/CourseMaterialsPage";
import AdminFreeMaterial from "./pages/AdminPages/AdminFreeMaterial";

/* ---------- AUTH CONTEXT ---------- */
import { useAuth } from "./Context/AuthContext";

function App() {
  const { user, loading } = useAuth();

  /* ---------- PUBLIC ROUTES ---------- */
  const publicRoutes = [
    {
      element: <PublicLayout />,
      children: [
        { path: "/", element: <Home /> },
        { path: "/about", element: <About /> },
        { path: "/contact", element: <Contact /> },
        { path: "/verify-email/:token", element: <VerifyEmail /> }, // ✅ FIXED
      ],
    },
    { path: "/auth", element: <AuthPage /> },
    { path: "/auth/forget-password", element: <ForgotPassword /> },
  ];

  /* ---------- STUDENT ROUTES ---------- */
  const studentRoutes = [
    {
      path: "/learn",
      element: (
        <ProtectedRoute>
          <LearnLayout />
        </ProtectedRoute>
      ),
      children: [
        { index: true, element: <StudentDashboard /> },
        { path: "courses", element: <BatchSearchFilters /> },
        { path: "courses/:courseId", element: <CourseDetailPage /> },
        { path: "my-purchases", element: <MyPurchases /> },
        { path: "profile", element: <Profile /> },
      ],
    },
    {
      path: "/learn/courses/:courseId/lecture",
      element: (
        <ProtectedRoute>
          <LectureLayout />
        </ProtectedRoute>
      ),
      children: [
        { index: true, element: null },
        { path: ":lessonId", element: <LecturePlayerPage /> },
      ],
    },
    {
      path: "/learn/free-materials",
      element: (
        <FreeMaterialPage>
          <FreeMaterial />
        </FreeMaterialPage>
      ),
    },
  ];

  /* ---------- ADMIN ROUTES ---------- */
  const adminRoutes = [
    {
      path: "/admin",
      element: (
        <ProtectedRoute>
          <AdminRoute>
            <AdminLayout />
          </AdminRoute>
        </ProtectedRoute>
      ),
      children: [
        { index: true, element: <AdminDashboard /> },
        { path: "courses", element: <CoursesPage /> },
        { path: "courses/new", element: <CreateCoursePage /> },
        { path: "courses/:courseId/edit", element: <EditCoursePage /> },
        {
          path: "courses/:courseId/edit-content-structure",
          element: <CourseContentEditor />,
        },
        {
          path:
            "courses/:courseId/chapters/:chapterId/lessons/:lessonId/materials",
          element: <CourseMaterialsPage />,
        },
        { path: "profile", element: <Profile /> },
      ],
    },
    {
      path: "/admin/free-materials",
      element: (
        <FreeMaterialPage>
          <AdminFreeMaterial />
        </FreeMaterialPage>
      ),
    },
  ];

  /* ---------- ROLE-BASED ROUTE SELECTION ---------- */
  let roleRoutes = [];
  if (user?.role === "student") roleRoutes = studentRoutes;
  if (user?.role === "admin") roleRoutes = adminRoutes;

  const router = createBrowserRouter([
    ...publicRoutes,
    ...roleRoutes,
    {
      path: "*",
      element: (
        <Navigate
          to={
            user?.role === "admin"
              ? "/admin"
              : user?.role === "student"
              ? "/learn"
              : "/"
          }
          replace
        />
      ),
    },
  ]);

  /* ---------- LOADING ---------- */
  if (loading) return <GlobalLoader />;

  return (
    <>
      <Toaster />
      <RouterProvider router={router} />
    </>
  );
}

export default App;
