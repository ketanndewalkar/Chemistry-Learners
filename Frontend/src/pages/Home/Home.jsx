import React, { useEffect, useRef, useState } from "react";
import { IoPlay, IoChevronBack, IoChevronForward, IoClose } from "react-icons/io5";
import FeaturesBox from "../../components/ui/FeaturesBox";
import MentionedCourses from "../../components/ui/MentionedCourses";
import Faculty from "../../components/ui/Faculty";
import { Toaster } from "../../utils/toaster";
import { useAuth } from "../../Context/AuthContext";
import { useNavigate } from "react-router-dom";

const DEMO_VIDEOS = [
  "./video1.mp4",
  "./video2.mp4",
  "./video3.mp4",
  "./video4.mp4",
  
];

const Home = () => {
  const { user, roleRoute } = useAuth();
  const navigate = useNavigate();

  /* ---------------- DEMO VIDEO LOGIC ---------------- */
  const [openDemo, setOpenDemo] = useState(false);
  const [current, setCurrent] = useState(0);
  const videoRef = useRef(null);

  useEffect(() => {
    if (!openDemo || !videoRef.current) return;

    videoRef.current.load();
    videoRef.current.play();

    const handleEnded = () => {
      setCurrent((prev) => (prev + 1) % DEMO_VIDEOS.length);
    };

    videoRef.current.addEventListener("ended", handleEnded);
    return () =>
      videoRef.current?.removeEventListener("ended", handleEnded);
  }, [current, openDemo]);

  const next = () =>
    setCurrent((prev) => (prev + 1) % DEMO_VIDEOS.length);

  const prev = () =>
    setCurrent((prev) =>
      prev === 0 ? DEMO_VIDEOS.length - 1 : prev - 1
    );

  return (
    <>
      <div className="border relative overflow-x-hidden border-gray-200 w-full px-[clamp(1rem,4vw,3rem)] py-[clamp(1rem,2vw,3rem)] bg-gray-100">
        <div className=" relative size-full remains">
          <div className=" border-gray-500 flex size-full max-md:flex-col-reverse max-md:h-fit">
            <div className="w-[60%] h-full p-[1vw] flex flex-col itmes-center justify-center gap-[2.5vw] py-[clamp(1rem,4vw,2rem)] max-md:w-full max-md:p-2 max-md:h-fit">
              <div className=" text-gray-800 text-[clamp(2rem,5vw,3.5rem)] max-md:text-[clamp(1.5rem,6vw,2.5rem)] leading-snug">
                <h1 className="text-signika">
                  Stop <span className="text-blue-500">Memorizing</span>.
                </h1>
                <h1 className="text-signika">
                  Start Understanding{" "}
                  <span className="text-blue-500">Chemistry</span>.
                </h1>
              </div>

              <p className="font-semibold text-signika text-gray-600 text-[clamp(1rem,2.5vw,1.25rem)] max-md:text-[clamp(0.875rem,2.2vw,1rem)] text-pretty">
                Interactive learning designed to turn confusion into clarity,
                one concept at a time.
              </p>

              <div className="flex gap-[clamp(0.75rem,2vw,1.5rem)] mt-[clamp(1rem,2.5vw,2rem)] text-signika">
                <button
                  onClick={() => navigate(roleRoute[user.role])}
                  className="flex items-center justify-center px-[clamp(1rem,2vw,1.5rem)] py-[clamp(0.5rem,1vw,0.75rem)] rounded-full border border-gray-300 font-semibold text-gray-800 transition-all hover:bg-gray-100 active:scale-[0.97]"
                >
                  Start Learning
                </button>

                {/* UPDATED DEMO CTA */}
                <button
                  onClick={() => setOpenDemo(true)}
                  className="flex items-center gap-2 px-[clamp(1rem,2vw,1.5rem)] py-[clamp(0.5rem,1vw,0.75rem)] rounded-full border border-blue-500 bg-blue-500 font-semibold text-white transition-all hover:bg-blue-600 active:scale-[0.97]"
                >
                  <IoPlay className="text-lg" />
                  Concept Walkthrough
                </button>
              </div>
            </div>

            <div className="w-[40%] h-full p-[1vw] flex items-centers max-md:w-full max-md:h-[40vh]">
              <img
                src="./posternew.png"
                className="size-full object-center object-contain rounded-lg mix-blend-multiply"
              />
            </div>
          </div>
        </div>

        <FeaturesBox />
        <Faculty />
      </div>

      {/* ---------------- DEMO VIDEO MODAL ---------------- */}
      {openDemo && (
  <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm px-3 max-md:px-2">
    <div
      className="
        relative
        w-[72%]
        max-w-[1100px]
        aspect-video
        max-md:w-full
        max-md:aspect-[9/16]
        bg-[#0b1220]
        rounded-2xl
        shadow-2xl
        overflow-hidden
        flex
        items-center
        justify-center
      "
    >
      {/* Progress Indicators */}
      <div className="absolute top-3 left-3 right-3 flex gap-2 z-30">
        {DEMO_VIDEOS.map((_, i) => (
          <div
            key={i}
            className={`h-[3px] flex-1 rounded-full transition-all duration-300 ${
              i === current ? "bg-blue-500" : "bg-white/25"
            }`}
          />
        ))}
      </div>

      {/* Aspect Ratio Wrapper */}
      <div className="relative w-full h-full">
        <video
  ref={videoRef}
  src={DEMO_VIDEOS[current]}
  className="absolute inset-0 w-full h-full object-contain bg-black"
  playsInline
  controls={false}
/>

      </div>

      {/* Prev Button */}
      <button
        onClick={prev}
        className="
          absolute left-3 top-1/2 -translate-y-1/2
          bg-white/10 backdrop-blur-md
          p-3 rounded-full
          hover:bg-white/20
          transition
          z-30
        "
      >
        <IoChevronBack className="text-white text-xl" />
      </button>

      {/* Next Button */}
      <button
        onClick={next}
        className="
          absolute right-3 top-1/2 -translate-y-1/2
          bg-white/10 backdrop-blur-md
          p-3 rounded-full
          hover:bg-white/20
          transition
          z-30
        "
      >
        <IoChevronForward className="text-white text-xl" />
      </button>

      {/* Close */}
      <button
        onClick={() => setOpenDemo(false)}
        className="
          absolute top-3 right-3
          bg-white/10 backdrop-blur-md
          p-2 rounded-full
          hover:bg-white/20
          transition
          z-30
        "
      >
        <IoClose className="text-white text-lg" />
      </button>
    </div>
  </div>
)}

    </>
  );
};

export default Home;
