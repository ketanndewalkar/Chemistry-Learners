import {
  FiPlus,
  FiUpload,
  FiUsers,
  FiTrendingUp,
  FiTrendingDown,
} from "react-icons/fi";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
import { Toaster } from "../../utils/toaster";
import { useAuth } from "../../Context/AuthContext";

const stats = [
  {
    title: "Total Courses",
    value: "128",
    change: "+4%",
    positive: true,
  },
  {
    title: "Total Students",
    value: "12,540",
    change: "+2.1%",
    positive: true,
  },
  {
    title: "Enrolled Students",
    value: "9,320",
    change: "-0.6%",
    positive: false,
  },
];

const enrollments = [
  {
    name: "Priya Sharma",
    course: "Organic Chemistry Basics",
    date: "Mar 14, 2025",
    status: "Active",
  },
  {
    name: "Daniel Kim",
    course: "Physical Chemistry I",
    date: "Mar 13, 2025",
    status: "Pending",
  },
  {
    name: "Aisha Khan",
    course: "Inorganic Chemistry Lab",
    date: "Mar 12, 2025",
    status: "Active",
  },
  {
    name: "Miguel Torres",
    course: "Analytical Techniques",
    date: "Mar 10, 2025",
    status: "Paused",
  },
];

const statusStyles = {
  Active: "bg-green-100 text-green-700",
  Pending: "bg-yellow-100 text-yellow-700",
  Paused: "bg-gray-100 text-gray-600",
};

const AdminDashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [loading, setloading] = useState(false);
  const [data, setData] = useState({
    courses:[],
    students:[],
    enrollments:[],
  });
  
  const fetchDashboardData = async () => {
    try {
      setloading(true);

      const [Course, Student,Enrolled] =
        await Promise.all([
          axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/v1/courses?status=published`,{withCredentials:true}),
          axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/v1/users/all`,{withCredentials:true}),
          axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/v1/users/all`,{withCredentials:true}),
          
        ]);
      setData({
        courses: Course.data.data.length,
        students: Student.data.data.userCount,
        enrollments: Enrolled.data.data.userCount,
      });
      
    } catch (error) {
      Toaster("Error fetching dashboard data",error);
    } finally {
      setloading(false);
    }
  };
  useEffect(() => {
    fetchDashboardData();
  }, []);

  if (loading) {
    return <AdminDashboardSkeleton />;
  }
  return (
    <div className="p-[clamp(1rem,2vw,2rem)] space-y-8">
      {/* ===== HEADER ===== */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-xl font-semibold text-gray-900">
            Hello{" "}
            {`${user.name.split(" ")[0][0].toUpperCase()}${user.name
              .split(" ")[0]
              .slice(1)}`}
            👋
          </h1>
          <p className="text-sm text-gray-500">
            Here’s what’s happening with your platform today
          </p>
        </div>

        <div className="flex flex-wrap gap-3">
          <button
            onClick={() => navigate("/admin/courses/new")}
            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-blue-600 text-white text-sm font-medium hover:bg-blue-700 transition"
          >
            <FiPlus /> Add new Course
          </button>
        </div>
      </div>

      {/* ===== STATS ===== */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        <StatCard title="Total Published Courses" value={data.courses} />
        <StatCard title="Total Students" value={data.students} />
        <StatCard title="Enrolled Students" value={data.enrollments} />
      </div>

      {/* ===== TABLE ===== */}
      <div className="rounded-2xl bg-white border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-blue-50 text-gray-700">
              <tr>
                <th className="px-6 py-4 text-left font-medium">Student</th>
                <th className="px-6 py-4 text-left font-medium">
                  Course Enrolled
                </th>
                <th className="px-6 py-4 text-left font-medium">
                  Enrollment Date
                </th>
                <th className="px-6 py-4 text-left font-medium">Status</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-gray-100">
              {enrollments.map((item) => (
                <tr key={item.name}>
                  <td className="px-6 py-4 font-medium text-gray-900">
                    {item.name}
                  </td>
                  <td className="px-6 py-4 text-gray-700">{item.course}</td>
                  <td className="px-6 py-4 text-gray-500">{item.date}</td>
                  <td className="px-6 py-4">
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-medium ${
                        statusStyles[item.status]
                      }`}
                    >
                      {item.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* ===== TABLE FOOTER ===== */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 px-6 py-4 text-sm text-gray-500">
          <span>Sort by Enrollment Date</span>

          <div className="flex items-center gap-2">
            <button className="px-3 py-1 rounded-lg border hover:bg-gray-100">
              Prev
            </button>
            <button className="px-3 py-1 rounded-lg bg-blue-600 text-white">
              1
            </button>
            <button className="px-3 py-1 rounded-lg border hover:bg-gray-100">
              2
            </button>
            <button className="px-3 py-1 rounded-lg border hover:bg-gray-100">
              3
            </button>
            <button className="px-3 py-1 rounded-lg border hover:bg-gray-100">
              Next
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;

const StatCard = ({ title, value }) => {
  return (
    <div
      key={title}
      className="rounded-2xl bg-white border border-gray-200 p-5 shadow-sm"
    >
      <p className="text-sm text-gray-500">{title}</p>

      <div className="mt-2 flex items-center justify-between">
        <h2 className="text-2xl font-semibold text-gray-900">{value}</h2>
      </div>
    </div>
  );
};

const AdminDashboardSkeleton = () => {
  return (
    <div className="p-[clamp(1rem,2vw,2rem)] space-y-8 animate-pulse">
      {/* ===== HEADER SKELETON ===== */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div className="space-y-2">
          <div className="h-6 w-52 bg-gray-200 rounded-md" />
          <div className="h-4 w-72 bg-gray-200 rounded-md" />
        </div>

        <div className="h-10 w-40 bg-gray-200 rounded-lg" />
      </div>

      {/* ===== STATS SKELETON ===== */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {[1, 2, 3].map((i) => (
          <div
            key={i}
            className="
              rounded-2xl
              bg-white
              border border-gray-200
              p-5
              space-y-4
            "
          >
            <div className="h-4 w-32 bg-gray-200 rounded-md" />
            <div className="h-7 w-20 bg-gray-200 rounded-md" />
            <div className="h-2 w-full bg-gray-200 rounded-full" />
          </div>
        ))}
      </div>

      {/* ===== TABLE SKELETON ===== */}
      <div className="rounded-2xl bg-white border border-gray-200 overflow-hidden">
        {/* Table Header */}
        <div className="bg-blue-50 px-6 py-4 grid grid-cols-4 gap-6">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-4 w-28 bg-gray-200 rounded-md" />
          ))}
        </div>

        {/* Table Rows */}
        <div className="divide-y divide-gray-100">
          {[1, 2, 3, 4].map((row) => (
            <div key={row} className="grid grid-cols-4 gap-6 px-6 py-4">
              <div className="h-4 w-32 bg-gray-200 rounded-md" />
              <div className="h-4 w-40 bg-gray-200 rounded-md" />
              <div className="h-4 w-28 bg-gray-200 rounded-md" />
              <div className="h-6 w-20 bg-gray-200 rounded-full" />
            </div>
          ))}
        </div>

        {/* ===== TABLE FOOTER SKELETON ===== */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 px-6 py-4">
          <div className="h-4 w-48 bg-gray-200 rounded-md" />

          <div className="flex items-center gap-2">
            {[1, 2, 3, 4, 5].map((btn) => (
              <div key={btn} className="h-8 w-10 bg-gray-200 rounded-lg" />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
