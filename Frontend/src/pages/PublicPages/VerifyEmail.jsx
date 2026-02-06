import { useEffect, useRef, useState } from "react";
import { useParams, Link } from "react-router-dom";
import axios from "axios";
import gsap from "gsap";
import { Check, X, Loader2 } from "lucide-react";
import { Toaster } from "../../utils/toaster";

const VerifyEmail = () => {
  const containerRef = useRef(null);
  const iconRef = useRef(null);
  const textRef = useRef(null);
  const hasCalled = useRef(false);


  const { token } = useParams();

  const [status, setStatus] = useState("loading");
  const isFinalized = useRef(false);

  const [message, setMessage] = useState(
    "We are securely verifying your email."
  );

  // Animation
  useEffect(() => {
    gsap.fromTo(
      containerRef.current,
      { opacity: 0, y: 32 },
      { opacity: 1, y: 0, duration: 0.8, ease: "power3.out" }
    );
  }, []);

  // 🔥 MAIN FIX LOGIC
 useEffect(() => {

  if (hasCalled.current) return;
  hasCalled.current = true;

  const verify = async () => {
    try {

      const res = await axios.get(
        `${import.meta.env.VITE_BACKEND_URL}/api/v1/auth/verify/${token}`
      );

      console.log("VERIFY RESPONSE 👉", res.data);

      if (isFinalized.current) return;

      if (res.data?.success === true) {

        isFinalized.current = true;   // 🔥 LOCK

        setStatus("success");
        setMessage(res.data.message);

        Toaster("Email verified successfully!", "success");

        return;
      }

    } catch (err) {

      console.log("VERIFY ERROR 👉", err.response?.data);

      // ❗ IMPORTANT
      if (isFinalized.current) return;

      setStatus("error");
      setMessage(
        err.response?.data?.message || "Invalid or expired token"
      );
    }
  };

  verify();

}, [token]);



  // Icon Animation
  useEffect(() => {
    if (!iconRef.current || !textRef.current) return;

    gsap.fromTo(
      iconRef.current,
      { scale: 0.85, opacity: 0 },
      { scale: 1, opacity: 1, duration: 0.4, ease: "back.out(1.5)" }
    );

    gsap.fromTo(
      textRef.current,
      { opacity: 0, y: 8 },
      { opacity: 1, y: 0, duration: 0.4, delay: 0.1 }
    );
  }, [status]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-[#F5FAFF] to-[#E8F2FF] px-4">
      <div
        ref={containerRef}
        className="w-full max-w-lg bg-white rounded-xl shadow px-10 py-12 text-center"
      >
        <div
          ref={iconRef}
          className={`mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full ${
            status === "loading"
              ? "bg-blue-50 text-blue-500"
              : status === "success"
              ? "bg-green-50 text-green-500"
              : "bg-red-50 text-red-500"
          }`}
        >
          {status === "loading" && (
            <Loader2 className="h-7 w-7 animate-spin" />
          )}
          {status === "success" && <Check className="h-7 w-7" />}
          {status === "error" && <X className="h-7 w-7" />}
        </div>

        <div ref={textRef}>
          <h1 className="text-2xl font-semibold mb-2">
            {status === "loading" && "Verifying Email"}
            {status === "success" && "Email Verified"}
            {status === "error" && "Verification Failed"}
          </h1>

          <p className="text-sm text-gray-500 mb-8">{message}</p>
        </div>

        {status === "success" && (
          <Link
            to="/auth"
            className="inline-flex w-full items-center justify-center rounded-lg bg-blue-500 hover:bg-blue-600 text-white py-3"
          >
            Continue to Login
          </Link>
        )}

        {status === "error" && (
          <Link
            to="/auth"
            className="inline-flex w-full items-center justify-center rounded-lg border py-3"
          >
            Go to Login
          </Link>
        )}
      </div>
    </div>
  );
};

export default VerifyEmail;
