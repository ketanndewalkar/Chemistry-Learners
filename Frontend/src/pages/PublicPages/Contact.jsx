import React from "react";

const Contact = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-[#F7FAFC] px-8 py-20 max-md:px-4 max-md:py-14">
      {/* ================= HEADER ================= */}
      <div className="mx-auto mb-12 max-w-2xl text-center">
        <span className="inline-block rounded-full bg-blue-100 px-4 py-1 text-xs font-medium text-blue-600">
          We’d love to hear from you
        </span>

        <h1 className="mt-4 text-4xl font-semibold text-gray-900 max-md:text-2xl">
          Tell Us About Your Needs
        </h1>

        <p className="mx-auto mt-4 max-w-xl text-sm text-gray-600 max-md:text-xs">
          Have a question, feedback, or need help getting started? Share a few
          details and our team will get back to you as soon as possible.
        </p>
      </div>

      {/* ================= FORM CARD ================= */}
      <div className="mx-auto max-w-xl rounded-2xl bg-white p-8 shadow-sm max-md:p-5">
        <form className="space-y-5">
          {/* Full Name */}
          <InputField
            label="Full name"
            required
            placeholder="e.g. John Doe"
          />

          {/* Email */}
          <InputField
            label="Email address"
            type="email"
            required
            placeholder="e.g. john@example.com"
          />

          {/* Phone */}
          <InputField
            label="Phone number"
            placeholder="e.g. +91 98765 43210"
          />

          {/* Subject */}
          <InputField
            label="Subject"
            placeholder="How can we help you?"
          />

          {/* Message */}
          <div>
            <label className="mb-1 block text-sm text-gray-600">
              Message <span className="text-red-500">*</span>
            </label>
            <textarea
              rows="4"
              placeholder="Write your message here..."
              className="w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm text-gray-900 outline-none transition focus:border-blue-600"
            />
          </div>

          {/* CTA */}
          <button
            type="button"
            className="mt-2 w-full rounded-xl bg-blue-600 py-3 text-sm font-medium text-white transition hover:bg-blue-700"
          >
            Send Message →
          </button>
        </form>
      </div>

      {/* ================= TRUST FOOTER ================= */}
      <div className="mx-auto mt-14 max-w-xl text-center">
        <p className="text-xs text-gray-500">
          Trusted by learners and educators across the platform
        </p>
      </div>
    </div>
  );
};

/* ================= REUSABLE INPUT ================= */
const InputField = ({ label, type = "text", placeholder, required }) => (
  <div>
    <label className="mb-1 block text-sm text-gray-600">
      {label} {required && <span className="text-red-500">*</span>}
    </label>
    <input
      type={type}
      placeholder={placeholder}
      className="w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm text-gray-900 outline-none transition focus:border-blue-600"
    />
  </div>
);

export default Contact;
