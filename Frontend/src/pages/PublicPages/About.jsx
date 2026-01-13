import React from "react";

const About = () => {
  return (
    <div className="bg-[#F7FAFC]">
      {/* ================= HERO SECTION ================= */}
      <section className="bg-blue-300 px-8 py-20 max-md:px-4 max-md:py-14">
        <div className="mx-auto max-w-6xl text-center">
          <h1 className="text-4xl font-semibold text-gray-900 max-md:text-2xl">
            About Us
          </h1>
          <p className="mx-auto mt-4 max-w-2xl text-sm text-gray-700 max-md:text-xs">
            We build structured learning journeys that help students master
            complex subjects with clarity, confidence, and consistency.
          </p>

          {/* Image strip */}
          <div className="mt-10 grid grid-cols-4 gap-4 max-md:grid-cols-2">
            <ImageCard src="https://images.unsplash.com/photo-1529070538774-1843cb3265df" />
            <ImageCard src="https://images.unsplash.com/photo-1551434678-e076c223a692" />
            <ImageCard src="https://images.unsplash.com/photo-1522071820081-009f0129c71c" />
            <ImageCard src="https://images.unsplash.com/photo-1521737604893-d14cc237f11d" />
          </div>
        </div>
      </section>

      {/* ================= SECTION 1 ================= */}
      <section className="px-8 py-20 max-md:px-4 max-md:py-14">
        <div className="mx-auto max-w-6xl grid grid-cols-2 gap-12 max-md:grid-cols-1">
          <div>
            <h2 className="text-3xl font-semibold text-gray-900 max-md:text-xl">
              Learning that’s structured and outcome-driven
            </h2>
            <p className="mt-4 text-sm text-gray-600 max-md:text-xs">
              Our platform is designed to remove confusion from learning. Every
              course is carefully structured into chapters, materials, and
              guided progress so students know exactly what to study, when, and
              why.
            </p>
            <p className="mt-3 text-sm text-gray-600 max-md:text-xs">
              We focus on concept clarity, consistency, and measurable progress
              instead of overwhelming learners with unorganized content.
            </p>
          </div>

          <div className="rounded-2xl bg-white p-6 shadow-sm">
            <img
              src="https://images.unsplash.com/photo-1516321318423-f06f85e504b3"
              alt="Learning"
              className="rounded-xl object-cover"
            />
          </div>
        </div>
      </section>

      {/* ================= SECTION 2 ================= */}
      <section className="px-8 py-20 max-md:px-4 max-md:py-14">
        <div className="mx-auto max-w-6xl grid grid-cols-2 gap-12 max-md:grid-cols-1">
          <div className="rounded-2xl bg-white p-6 shadow-sm">
            <img
              src="https://images.unsplash.com/photo-1556761175-5973dc0f32e7"
              alt="Mentor"
              className="rounded-xl object-cover"
            />
          </div>

          <div>
            <h2 className="text-3xl font-semibold text-gray-900 max-md:text-xl">
              Empowering students through guided education
            </h2>
            <p className="mt-4 text-sm text-gray-600 max-md:text-xs">
              We support students at every stage of their journey — from
              enrolling in a course to completing chapters and continuing where
              they left off.
            </p>

            <blockquote className="mt-6 border-l-4 border-blue-600 pl-4 text-sm italic text-gray-700 max-md:text-xs">
              “Our mission is to make quality education accessible, structured,
              and meaningful — not overwhelming.”
            </blockquote>
          </div>
        </div>
      </section>

      {/* ================= VALUES ================= */}
      <section className="px-8 py-20 max-md:px-4 max-md:py-14">
        <div className="mx-auto max-w-6xl text-center">
          <h2 className="text-3xl font-semibold text-gray-900 max-md:text-xl">
            Helping learners grow smarter and faster
          </h2>
          <p className="mx-auto mt-3 max-w-xl text-sm text-gray-600 max-md:text-xs">
            We believe learning should be simple, transparent, and progress-oriented.
          </p>

          <div className="mt-12 grid grid-cols-3 gap-8 max-md:grid-cols-1">
            <ValueCard
              title="Expert-curated courses"
              text="Every course is designed by experienced educators with a clear learning path."
            />
            <ValueCard
              title="Goal-oriented structure"
              text="Chapters, materials, and progress tracking keep learners focused."
            />
            <ValueCard
              title="Trusted learning experience"
              text="Transparent content, verified courses, and learner-first design."
            />
          </div>
        </div>
      </section>
    </div>
  );
};

/* ================= SUB COMPONENTS ================= */

const ImageCard = ({ src }) => (
  <div className="overflow-hidden rounded-xl bg-white shadow-sm">
    <img src={src} alt="" className="h-full w-full object-cover" />
  </div>
);

const ValueCard = ({ title, text }) => (
  <div className="rounded-2xl bg-white p-6 shadow-sm">
    <h3 className="text-base font-semibold text-gray-900">{title}</h3>
    <p className="mt-2 text-sm text-gray-600 max-md:text-xs">{text}</p>
  </div>
);

export default About;
