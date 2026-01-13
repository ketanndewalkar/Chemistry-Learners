// import { useState } from "react";

// import viteLogo from "/vite.svg";
// import "./App.css";
// import PublicLayout from "./components/layout/Layout/PublicLayout";
// import { Toaster } from "react-hot-toast";
// import {
//   createBrowserRouter,
//   Navigate,
//   RouterProvider,
// } from "react-router-dom";
// import Home from "./pages/Home/Home";
// import AuthPage from "./pages/AuthPage/AuthPage";
// import ForgotPassword from "./pages/AuthPage/ForgotPassword";
// import ProtectedRoute from "./components/ProtectedRoute/ProtectedRoute";
// import LearnLayout from "./components/layout/Layout/LearnLayout";
// import GlobalLoader from "./components/ui/GlobalLoader";
// import StudentDashboard from "./pages/StudentPages/StudentDashboard";
// import MyPurchases from "./pages/StudentPages/MyPurchases";
// import Profile from "./components/ui/Profile";
// import About from "./pages/PublicPages/About";
// import BatchSearchFilters from "./pages/StudentPages/BatchSearchFilters";
// import Contact from "./pages/PublicPages/Contact";
// import CourseDetailPage from "./pages/StudentPages/CourseDetailPage";
// import LectureLayout from "./components/layout/Layout/LectureLayout";
// import LecturePlayerPage from "./pages/StudentPages/LecturePlayerPage";
// import AdminRoute from "./components/ProtectedRoute/AdminRoute";
// import AdminLayout from "./components/layout/Layout/AdminLayout";
// import AdminDashboard from "./pages/AdminPages/DashboardPage";
// import CreateCoursePage from "./pages/AdminPages/CreateCoursePage";
// import CoursesPage from "./pages/AdminPages/CoursesPage";
// import CourseContentEditor from "./pages/AdminPages/CourseContentEditor";
// import CourseMaterialsPage from "./pages/AdminPages/CourseMaterialsPage";
// import { useAuth } from "./Context/AuthContext";
// import EditCoursePage from "./pages/AdminPages/EditCoursePage";

// function App() {
//   const router = createBrowserRouter([
//     /* ---------- PUBLIC (NO GUARDS AT ALL) ---------- */
//     {
//       element: <PublicLayout />,
//       children: [
//         { path: "/", element: <Home /> },
//         { path: "/about", element: <About /> },
//         { path: "/contact", element: <Contact /> },
//         {
//           path: "/courses",
//           element: (
//             <>
//               <div className="px-[clamp(1rem,4vw,3rem)] py-[clamp(1rem,2vw,3rem)]">
//                 <BatchSearchFilters />
//               </div>
//             </>
//           ),
//         },
//         // {
//         //   path: "/courses/:courseId",element: <CoursePage />,
//         // },
//       ],
//     },
//     // auth
//     { path: "/auth", element: <AuthPage /> },
//     { path: "/auth/forget-password", element: <ForgotPassword /> },
//     /* ---------- LEARNING AREA ---------- */
//     {
//       path: "/learn",
//       element: (
//         <ProtectedRoute>
//           <LearnLayout />
//         </ProtectedRoute>
//       ),
//       children: [
//         { index: true, element: <StudentDashboard /> },
//         {
//           path: "courses",
//           element: (
//             <>
//               <BatchSearchFilters />/
//             </>
//           ),
//         },
//         {
//           path: "courses/:courseId",
//           element: <CourseDetailPage />,
//         },
//         { path: "my-purchases", element: <MyPurchases /> },
//         { path: "profile", element: <Profile /> },
//       ],
//     },

//     /* ================= COURSE PLAYER ================= */
//     {
//       path: "/learn/courses/:courseId/lecture",
//       element: (
//         <ProtectedRoute>
//           <LectureLayout />
//         </ProtectedRoute>
//       ),
//       children: [
//         { index: true, element: <></> },
//         { path: ":lessonId", element: <LecturePlayerPage /> },
//       ],
//     },
//     /* ================= ADMIN ROUTES ================= */
//     {
//       path: "/admin",
//       element: (
//         <ProtectedRoute>
//           <AdminRoute>
//             <AdminLayout />
//           </AdminRoute>
//         </ProtectedRoute>
//       ),
//       children: [
//         { index: true, element: <AdminDashboard /> },
//         //   { path: "dashboard", element: <AdminDashboard /> },
//         { path: "courses", element: <CoursesPage /> },
//         { path: "courses/new", element: <CreateCoursePage /> },
//         { path: "courses/:courseId/edit", element: <EditCoursePage /> },
//         {
//           path: "courses/:courseId/edit-content-structure",
//           element: (
//             <>
//               <CourseContentEditor />
//             </>
//           ),
//         },
//         {
//           path: "courses/:courseId/chapters/:chapterId/lessons/:lessonId/materials",
//           element: (
//             <>
//               <CourseMaterialsPage />
//             </>
//           ),
//         },
//         //   { path: "courses/:courseId/edit", element: <EditCourse /> },
//         { path: "profile", element: <Profile /> }, // ✅ added
//       ],
//     },
//     /* ---------- FALLBACK ---------- */
//     {
//       path: "*",
//       element: <Navigate to="/" replace />,
//     },
//   ]);



//   const { loading,user } = useAuth();
//   return (
//     <>
//       {loading ? (
//         <>
//           <GlobalLoader />
//         </>
//       ) : (
//         ""
//       )}
//       <Toaster />
//       <RouterProvider router={router} />
//     </>
//   );
// }

// export default App;



///




import "./App.css";
import { Toaster } from "react-hot-toast";
import {
  createBrowserRouter,
  Navigate,
  RouterProvider,
} from "react-router-dom";

import PublicLayout from "./components/layout/Layout/PublicLayout";
import ProtectedRoute from "./components/ProtectedRoute/ProtectedRoute";
import AdminRoute from "./components/ProtectedRoute/AdminRoute";

import GlobalLoader from "./components/ui/GlobalLoader";

import Home from "./pages/Home/Home";
import About from "./pages/PublicPages/About";
import Contact from "./pages/PublicPages/Contact";
import AuthPage from "./pages/AuthPage/AuthPage";
import ForgotPassword from "./pages/AuthPage/ForgotPassword";

import LearnLayout from "./components/layout/Layout/LearnLayout";
import LectureLayout from "./components/layout/Layout/LectureLayout";

import StudentDashboard from "./pages/StudentPages/StudentDashboard";
import BatchSearchFilters from "./pages/StudentPages/BatchSearchFilters";
import CourseDetailPage from "./pages/StudentPages/CourseDetailPage";
import LecturePlayerPage from "./pages/StudentPages/LecturePlayerPage";
import MyPurchases from "./pages/StudentPages/MyPurchases";

import AdminLayout from "./components/layout/Layout/AdminLayout";
import AdminDashboard from "./pages/AdminPages/DashboardPage";
import CoursesPage from "./pages/AdminPages/CoursesPage";
import CreateCoursePage from "./pages/AdminPages/CreateCoursePage";
import EditCoursePage from "./pages/AdminPages/EditCoursePage";
import CourseContentEditor from "./pages/AdminPages/CourseContentEditor";
import CourseMaterialsPage from "./pages/AdminPages/CourseMaterialsPage";

import Profile from "./components/ui/Profile";
import { useAuth } from "./Context/AuthContext";
import FreeMaterialPage from "./pages/StudentPages/FreeMaterialPage";
import AdminFreeMaterial from "./pages/AdminPages/AdminFreeMaterial";
import FreeMaterial from "./pages/StudentPages/FreeMaterial";

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
        { index: true, element: <></> },
        { path: ":lessonId", element: <LecturePlayerPage /> },
      ],
    },
    {path:"/learn/free-materials",element:<><FreeMaterialPage>
      <FreeMaterial/>
      </FreeMaterialPage></>},
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
          path: "courses/:courseId/chapters/:chapterId/lessons/:lessonId/materials",
          element: <CourseMaterialsPage />,
        },
        { path: "profile", element: <Profile /> },
      ],
    },
    {path:"/admin/free-materials",element:<><FreeMaterialPage>
      <AdminFreeMaterial/>
      </FreeMaterialPage></>},
  ];

  /* ---------- ROLE-BASED ROUTER ---------- */
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

  /* ---------- RENDER ---------- */
  if (loading) {
    return <GlobalLoader />;
  }

  return (
    <>
      <Toaster />
      <RouterProvider router={router} />
    </>
  );
}

export default App;
