import React from "react";
import Sir from "../../../public/sir.jpeg";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../Context/AuthContext";
const Faculty = () => {
  const navigate = useNavigate();
  const { user, roleRoute } = useAuth();
  return (
    <>
      <h1 className="mt-[5vw] text-signika text-gray-800 text-[clamp(1rem,2vw,1.25rem)] font-bold ">
        About the Instructor
      </h1>
      <section className="w-full bg-white mt-[1vw]">
        {/* ================= HERO ================= */}
        <div className="relative w-full bg-gradient-to-r from-blue-600 to-blue-500 rounded-lg">
          <div
            className="
            mx-auto
            max-w-[1280px]

            px-[clamp(1rem,4vw,3rem)]
            py-[clamp(3rem,6vw,6rem)]

            flex
            items-center
            gap-[clamp(1.5rem,4vw,4rem)]

            max-md:flex-col
            max-md:text-center
          "
          >
            {/* Image */}
            <div
              className="
              w-[clamp(14rem,26vw,22rem)]
              aspect-[3/4]
              rounded-2xl
              overflow-hidden
              shadow-xl 
              flex items-center justify-center
             bg-[#F7F7F7]
            "
            >
              <img
                src="./sir.jpeg"
                alt="Faculty"
                className="h-full object-cover object-center translate-y-3"
              />
            </div>

            {/* Text */}
            <div className="text-white">
              <h1 className="font-semibold leading-tight text-[clamp(1.8rem,4.5vw,3.5rem)]">
                Prof. Abhijit C Gurav
              </h1>

              <p className="mt-2 text-white/90 text-[clamp(1rem,1.6vw,1.25rem)]">
                Assistant Professor, Chemistry
              </p>

              {/* CTA */}
              <div
                className="
                mt-[clamp(1.5rem,3vw,2.5rem)]
                flex
                gap-[clamp(0.8rem,2vw,1.5rem)]

                max-md:flex-col
                max-md:items-center
              "
              >
                <button
                  className="
                  px-[clamp(1.2rem,2vw,1.6rem)]
                  py-[clamp(0.6rem,1vw,0.8rem)]
                  rounded-full
                  bg-white
                  text-blue-600
                  font-semibold

                  transition
                  hover:bg-blue-50
                "
                >
                  Contact Faculty
                </button>

                <button
                  onClick={() => {
                    console.log("hello")
                    navigate(
                      user ? `${roleRoute[user.role]}/courses` : "/auth",
                    );
                  }}
                  className="
                  px-[clamp(1.2rem,2vw,1.6rem)]
                  py-[clamp(0.6rem,1vw,0.8rem)]
                  rounded-full
                  border
                  border-white
                  text-white
                  font-semibold

                  transition
                  hover:bg-white/10
                "
                >
                  View Courses
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* ================= CONTENT ================= */}
        <div
          className="
          mx-auto
          max-w-[1200px]

          px-[clamp(1rem,4vw,3rem)]
          py-[clamp(3rem,6vw,5rem)]

          grid
          grid-cols-[2fr_1fr]
          gap-[clamp(1.5rem,3vw,3rem)]

          max-lg:grid-cols-1
        "
        >
          {/* About */}
          <div>
            <h2 className="font-semibold text-[clamp(1.3rem,2.2vw,2rem)]">
              About the Faculty
            </h2>

            <p className="mt-4 text-neutral-700 leading-relaxed text-[clamp(0.95rem,1.1vw,1rem)]">
              Learn Chemistry with Prof. Abhijit C. Gurav, a CSIR-NET qualified
              educator (AIR 284) with 12+ years of teaching experience. His
              teaching combines simple explanations, concept-focused notes,
              video lectures, quizzes, and mind maps to help students truly
              understand Chemistry. He is also the author of Engineering
              Chemistry books on Amazon and a translator for NPTEL & SWAYAM
              courses.
            </p>

            <p className="mt-3 text-neutral-700 leading-relaxed text-[clamp(0.95rem,1.1vw,1rem)]"></p>
          </div>

          {/* Stats */}
          {/* Quick Info Cards */}
          <div className="flex flex-col gap-4">
            <InfoCard title="Experience" value="12+" />
            <InfoCard title="Students Taught" value="10,000+" />
            <InfoCard
              title="Specialization"
              value="Organic Chemistry, Engineering Chemistry"
            />
          </div>
        </div>

        {/* ================= DETAILS ================= */}
        <div className="bg-neutral-50">
          <div
            className="
            mx-auto
            max-w-[1200px]

            px-[clamp(1rem,4vw,3rem)]
            py-[clamp(3rem,6vw,5rem)]

            grid
            grid-cols-3
            gap-[clamp(1.5rem,3vw,3rem)]

            max-lg:grid-cols-2
            max-md:grid-cols-1
          "
          >
            <DetailBlock
              title="Qualifications"
              items={["M.Sc. Chemistry", "Qualified NET-CSIR with AIR 284"]}
            />

            <DetailBlock
              title="Teaching Areas"
              items={[
                "Organic Chemistry",
                "Inorganic Chemistry",
                "Physical Chemistry",
                "Engineering Chemistry",
                "Environmental Chemistry",
              ]}
            />

            <DetailBlock
              title="Highlights"
              items={[
                "Top-rated faculty by Students",
                "Author of 3 Chemistry Books",
                "NPTEL/SWAYAM translator of regional language that is Marathi",
                "Techno-Savy Educator",
              ]}
            />
          </div>
        </div>
      </section>
    </>
  );
};

export default Faculty;

/* ================= SUB COMPONENTS ================= */

const InfoCard = ({ title, value }) => (
  <div
    className="
      rounded-xl
      border
      border-neutral-200
      bg-white
      px-4 py-3
      text-center
    "
  >
    <p className="text-neutral-500 text-[clamp(0.75rem,1vw,0.85rem)]">
      {title}
    </p>
    <p className="mt-1 font-semibold text-[clamp(1rem,1.4vw,1.2rem)]">
      {value}
    </p>
  </div>
);

const DetailBlock = ({ title, items }) => (
  <div>
    <h3 className="font-semibold mb-4 text-[clamp(1rem,1.2vw,1.25rem)]">
      {title}
    </h3>
    <ul className="space-y-2">
      {items.map((item, i) => (
        <li
          key={i}
          className="text-neutral-700 text-[clamp(0.9rem,1vw,0.95rem)]"
        >
          • {item}
        </li>
      ))}
    </ul>
  </div>
);
