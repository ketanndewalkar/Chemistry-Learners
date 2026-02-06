
import { useNavigate, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
import {
  FiChevronDown,
  FiChevronRight,
  FiFileText,
  FiVideo,
  FiLink,
  FiEye,
} from "react-icons/fi";
import { useAuth } from "../../Context/AuthContext";
import { Toaster } from "../../utils/toaster";
import { ArrowLeft } from "lucide-react";
import BackButton from "../../components/ui/BackButton";

/* ===========================================================
   MAIN CONTAINER
=========================================================== */
const CourseDetailPage = () => {
  const { user,login ,logout,loading, setLoading,checkAuth} = useAuth();
  const { courseId } = useParams();
  const navigate = useNavigate();
  const [course, setCourse] = useState(null);
  const [activeTab, setActiveTab] = useState("Overview");
  const [isPurchased, setIsPurchased] = useState(false);

  const [chapters, setChapters] = useState([]);
  const [lessonsMap, setLessonsMap] = useState({});
  const [resources, setResources] = useState([]);

  const [chaptersFetched, setChaptersFetched] = useState(false);
  const [lessonsFetched, setLessonsFetched] = useState(false);
  const [resourcesFetched, setResourcesFetched] = useState(false);

  const [loadingCourse, setLoadingCourse] = useState(false);
  const [loadingTab, setLoadingTab] = useState(false);
  const [paymentLoading, setpaymentLoading] = useState(false)
  /* ================= FETCH COURSE ================= */
  useEffect(() => {
    const fetchCourse = async () => {
      setLoadingCourse(true);
      try {
        const res = await axios.get(
          `${import.meta.env.VITE_BACKEND_URL}/api/v1/courses/${courseId}`,
          { withCredentials: true }
        );
        const fetchedCourse = res.data.data;
        setCourse(fetchedCourse);

        if (user && fetchedCourse?.enrolledStudents) {
          setIsPurchased(
            fetchedCourse.enrolledStudents.includes(user._id)
          );
        }
      } catch (err) {
        Toaster(
          err.response?.data?.message || "Failed to fetch course details.",
          "error"
        );
      } finally {
        setLoadingCourse(false);
      }
    };

    fetchCourse();
  }, [courseId, user]);

  /* ================= FETCH CHAPTERS ================= */
  useEffect(() => {
    if (activeTab !== "Overview" || chaptersFetched) return;

    const fetchChapters = async () => {
      setLoadingTab(true);
      try {
        const res = await axios.get(
          `${import.meta.env.VITE_BACKEND_URL}/api/v1/chapters/${courseId}/all`,
          { withCredentials: true }
        );
        setChapters(res.data.data);
        setChaptersFetched(true);
      } catch (err) {
        Toaster(
          err.response?.data?.message || "Failed to fetch chapters.",
          "error"
        );
      } finally {
        setLoadingTab(false);
      }
    };

    fetchChapters();
  }, [activeTab, courseId, chaptersFetched]);

  /* ================= FETCH LESSONS ================= */
  useEffect(() => {
    if (activeTab !== "Lessons" || lessonsFetched || !chapters.length) return;

    const fetchLessons = async () => {
      setLoadingTab(true);
      try {
        const responses = await Promise.all(
          chapters.map((chapter) =>
            axios.get(
              `${import.meta.env.VITE_BACKEND_URL}/api/v1/lessons/${chapter._id}/all`,
              { withCredentials: true }
            )
          )
        );
        
        const mapped = {};
        responses.forEach((res, idx) => {
          mapped[chapters[idx]._id] = res.data.data;
        });

        setLessonsMap(mapped);
        setLessonsFetched(true);
      } catch (err) {
        Toaster(
          err.response?.data?.message || "Failed to fetch lessons.",
          "error"
        );
        
      } finally {
        setLoadingTab(false);
      }
    };

    fetchLessons();
  }, [activeTab, chapters, lessonsFetched]);

  /* ================= FETCH RESOURCES ================= */
  useEffect(() => {
    if (activeTab !== "Resources" || resourcesFetched || !lessonsFetched) return;

    const fetchResources = async () => {
      setLoadingTab(true);
      try {
        const lessonIds = Object.values(lessonsMap)
          .flat()
          .map((l) => l._id);

        const responses = await Promise.all(
          lessonIds.map((id) =>
            axios.get(
              `${import.meta.env.VITE_BACKEND_URL}/api/v1/materials/${id}`,
              { withCredentials: true }
            )
          )
        );

        setResources(responses.flatMap((r) => r.data.data));
        setResourcesFetched(true);
      } catch (err) {
        Toaster(
          err.response?.data?.message || "Failed to fetch resources.",
          "error"
        );
       
      } finally {
        setLoadingTab(false);
      }
    };

    fetchResources();
  }, [activeTab, lessonsMap, lessonsFetched, resourcesFetched]);

  /* ================= GLOBAL LOADER ================= */
  if (loadingCourse) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="flex gap-3 items-center text-gray-600">
          <div className="h-6 w-6 border-2 border-gray-200 border-t-blue-500 rounded-full animate-spin" />
          <span className="text-sm">Loading course...</span>
        </div>
      </div>
    );
  }

  // Payment Handling Functions 
  const paymentHandler = async () => {
    setpaymentLoading(true);
    try {
      const res = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/api/v1/payments/create-order/${courseId}`,{amount:course.courseFees},{
        withCredentials:true
      })
      
      const {amount,orderId} = res.data.data;
      var options = {
    "key": import.meta.env.VITE_RAZORPAY_KEY_ID, // Enter the Key ID generated from the Dashboard
    "amount": amount, // Amount is in currency subunits.
    "currency": "INR",
    "name": "Chemistry Learners", //your business name
    "description": "Course Purchase Trancsaction",
    "image": "https://yt3.ggpht.com/sazQFN5ThvCNGWioIhzDKlQedReeSkT213ODne4YTCIOUb8rwHF2zQcRv_G4QqyWIJ9dLlTl=s176-c-k-c0x00ffffff-no-rj-mo",
    "order_id": orderId, //This is a sample Order ID. Pass the `id` obtained in the response of Step 1
    "handler": async (response) => {
        const {razorpay_signature,razorpay_order_id,razorpay_payment_id} = response;
        try {
          const res = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/api/v1/payments/verify-payment`,response,{
            withCredentials:true
          })
          
          setIsPurchased(true)
          setLoading(true)
          Toaster("Purchased Course Successfully","success")
          window.location.reload();
          setLoading(false);
        } catch (error) {
          Toaster("Payment Invalid","error")
          
        }
    },
    "prefill": { //We recommend using the prefill parameter to auto-fill customer's contact information, especially their phone number
        "name": user.name, //your customer's name
        "email": user.email, 
        "contact": user.phoneNo  //Provide the customer's phone number for better conversion rates 
    },
    "notes": {
        "address": "Razorpay Corporate Office"
    },
    "theme": {
        "color": "#3399cc"
    }
};
var rzp1 = new Razorpay(options);
rzp1.on('payment.failed', function (response){
        alert(response.error.code);
        alert(response.error.description);
        alert(response.error.source);
        alert(response.error.step);
        alert(response.error.reason);
        alert(response.error.metadata.order_id);
        alert(response.error.metadata.payment_id);
});

    rzp1.open();

    } catch (error) {
      Toaster(
        error.response?.data?.message || "Payment initiation failed. Please try again.",
        "error"
      );
      
    } finally {
      setpaymentLoading(false);
    }
  }

  if (!course) return null;

  return (
    <div className="min-h-screen px-2 py-1">
      <div className="h-[clamp(1rem,2vw,2rem)] flex items-center">
          <BackButton to={`/learn/courses`}/>
        </div>

      {/* ================= COURSE HEADER ================= */}
      <div className="rounded-2xl bg-white border border-gray-200 shadow-sm p-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-2">
            <h1 className="text-2xl font-semibold text-gray-800">
              {course.title}
            </h1>
            <p className="mt-2 text-sm text-gray-600">
              {course.description}
            </p>

            <div className="mt-4 flex flex-wrap gap-4 text-sm text-gray-500">
              <span>📘 {chapters.length} Chapters</span>
              <span>📎 {resources.length} Materials</span>
              <span>👥 {course.enrolledStudents?.length || 0} Students</span>
            </div>

            <div className="mt-5">
              {!isPurchased ? (
                <button
  onClick={paymentHandler}
  disabled={paymentLoading}
  className={`
    rounded-xl px-6 py-2 text-sm font-medium text-white
    transition flex items-center justify-center gap-2
    ${paymentLoading ? "bg-blue-400 cursor-not-allowed" : "bg-blue-600 hover:bg-blue-700"}
  `}
>
  {paymentLoading ? (
    <>
      <span className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
      Processing...
    </>
  ) : (
    "Buy Now"
  )}
</button>
              ) : (
                <button onClick={()=>navigate(`/learn/courses/${courseId}/lecture`)} className="px-6 py-2 rounded-xl bg-green-600 text-white text-sm hover:bg-green-700 transition">
                  Continue Learning →
                </button>
              )}
            </div>
          </div>

          <div className="rounded-xl overflow-hidden bg-gray-100 h-fit">
            <img
              src={course.courseImage}
              alt="Course"
              className="h-full w-full object-cover aspect-[16/9]"
            />
          </div>
        </div>
      </div>

      {/* ================= TABS ================= */}
      <div className="mt-6 flex gap-2 overflow-x-auto">
        {["Overview", "Lessons", "Resources"].map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-4 py-2 rounded-lg text-sm whitespace-nowrap transition ${
              activeTab === tab
                ? "bg-blue-600 text-white"
                : "bg-white border border-gray-200 text-gray-600 hover:bg-gray-100"
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* ================= TAB CONTENT ================= */}
      <div className="mt-6 rounded-2xl bg-white border border-gray-200 p-5 shadow-sm">
        {loadingTab && (
          <div className="flex items-center gap-2 mb-4 text-gray-500">
            <div className="h-4 w-4 border-2 border-gray-200 border-t-blue-500 rounded-full animate-spin" />
            <span className="text-xs">Loading...</span>
          </div>
        )}

        {activeTab === "Overview" && (
          <CourseOverviewContent chapters={chapters} />
        )}

        {activeTab === "Lessons" && (
          <CourseLessons chapters={chapters} lessonsMap={lessonsMap} />
        )}

        {activeTab === "Resources" && (
          <CourseResources resources={resources} />
        )}
      </div>
    </div>
  );
};

/* ===========================================================
   OVERVIEW TAB
=========================================================== */
const CourseOverviewContent = ({ chapters }) => {
  if (!chapters.length) return <p className="text-sm text-gray-500">No chapters available.</p>;

  return (
    <ul className="space-y-2 text-sm text-gray-700">
      {chapters.map((c) => (
        <li key={c._id} className="flex gap-2">
          <span>•</span> {c.title}
        </li>
      ))}
    </ul>
  );
};

/* ===========================================================
   LESSONS TAB
=========================================================== */
const CourseLessons = ({ chapters, lessonsMap }) => {
  const [openChapterId, setOpenChapterId] = useState(null);

  if (!chapters.length) return <p className="text-sm text-gray-500">No lessons available.</p>;

  return (
    <div className="space-y-3">
      {chapters.map((chapter) => {
        const isOpen = openChapterId === chapter._id;

        return (
          <div key={chapter._id} className="rounded-xl border border-gray-200 overflow-hidden">
            <button
              onClick={() => setOpenChapterId(isOpen ? null : chapter._id)}
              className="w-full flex items-center justify-between px-4 py-3 bg-gray-50 text-sm font-medium"
            >
              {chapter.title}
              {isOpen ? <FiChevronDown /> : <FiChevronRight />}
            </button>

            {isOpen && (
              <div className="px-5 py-3 bg-white">
                {lessonsMap[chapter._id]?.length ? (
                  <ul className="space-y-1 text-sm text-gray-600">
                    {lessonsMap[chapter._id].map((lesson) => (
                      <li key={lesson._id}>• {lesson.title}</li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-sm text-gray-500">No lessons available</p>
                )}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
};

/* ===========================================================
   RESOURCES TAB (ATTACHMENT STYLE)
=========================================================== */
const CourseResources = ({ resources }) => {
  if (!resources.length) return <p className="text-sm text-gray-500">No resources available.</p>;

  const getIcon = (type) => {
    if (type === "video") return <FiVideo />;
    if (type === "link") return <FiLink />;
    return <FiFileText />;
  };

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {resources.map((res) => (
        <div
          key={res._id}
          className="rounded-xl border border-gray-200 p-4 bg-gray-50 hover:bg-white transition"
        >
          <div className="flex items-start gap-3">
            <div className="text-blue-600 text-lg">
              {getIcon(res.materialType)}
            </div>

            <div className="flex-1">
              <p className="font-medium text-sm text-gray-800">
                {res.title}
              </p>

              {res.description && (
                <p className="text-xs text-gray-500 mt-1">
                  {res.description}
                </p>
              )}

              <div className="mt-3 flex items-center gap-2 text-xs text-gray-500">
                <span className="px-2 py-0.5 rounded-full bg-gray-200">
                  {res.materialType}
                </span>

                {res.isPreview && (
                  <span className="flex items-center gap-1 text-green-600">
                    <FiEye /> Preview
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default CourseDetailPage;
