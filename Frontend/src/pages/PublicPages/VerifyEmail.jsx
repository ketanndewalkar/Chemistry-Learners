import { useEffect, useRef, useState } from "react";
import { useSearchParams } from "react-router-dom";
import axios from "axios";
import gsap from "gsap";
import { Check, X, Loader2 } from "lucide-react";
import { Toaster } from "../../utils/toaster";

const Verifyemail = () => {
  const containerRef = useRef(null);
  const iconRef = useRef(null);
  const textRef = useRef(null);

  const [params] = useSearchParams();
  const token = params.get("token");

  const [status, setStatus] = useState("loading");
  const [message, setMessage] = useState("We are securely verifying your email.");

  /* ENTRY ANIMATION */
  useEffect(() => {
    gsap.fromTo(
      containerRef.current,
      { opacity: 0, y: 32 },
      { opacity: 1, y: 0, duration: 0.8, ease: "power3.out" }
    );
  }, []);

  /* VERIFY EMAIL */
  useEffect(() => {
    const verify = async () => {
      if (!token) {
        setStatus("error");
        Toaster("Invalid or missing verification token.","error");
        return;
      }

      try {
        const res = await axios.get(
          `${import.meta.env.VITE_BACKEND_URL}/auth/verify-email`,
          { params: { token } }
        );

        if (res.data.success) {
          setStatus("success");
          setMessage("Your email address has been verified successfully.");
          Toaster("Email verified successfully!","success");
        } else {
          throw new Error();
        }
      } catch (e) {
        setStatus("error");
        setMessage(
          e.response?.data?.message ||
            "This verification link is invalid or expired."
        );
        Toaster(e.response?.data?.message || "Verification failed. Please try again.","error");
      }
    };

    verify();
  }, [token]);

  /* ICON PULSE */
  useEffect(() => {
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
        className="w-full max-w-lg bg-white rounded-xl shadow-[0_20px_60px_rgba(15,23,42,0.08)] px-10 py-12 text-center"
      >
        {/* ICON */}
        <div
          ref={iconRef}
          className={`mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full
            ${
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

        {/* TEXT */}
        <div ref={textRef}>
          <h1 className="text-2xl font-semibold text-[#0F172A] mb-2">
            {status === "loading" && "Verifying Email"}
            {status === "success" && "Email Verified"}
            {status === "error" && "Verification Failed"}
          </h1>

          <p className="text-sm text-[#64748B] mb-8">
            {message}
          </p>
        </div>

        {/* ACTION */}
        {status === "success" && (
          <a
            href="/login"
            className="inline-flex w-full items-center justify-center rounded-lg bg-blue-500 hover:bg-blue-600 transition text-white font-medium py-3"
          >
            Continue to Dashboard
          </a>
        )}

        {status === "error" && (
          <a
            href="/resend-verification"
            className="inline-flex w-full items-center justify-center rounded-lg border border-slate-200 hover:bg-slate-50 transition text-slate-700 font-medium py-3"
          >
            Resend Verification Email
          </a>
        )}
      </div>
    </div>
  );
};

export default Verifyemail;
