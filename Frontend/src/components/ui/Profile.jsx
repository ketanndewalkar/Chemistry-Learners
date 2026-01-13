import React, { useState, useRef } from "react";
import axios from "axios";
import { useAuth } from "../../Context/AuthContext";
import { Toaster } from "../../utils/toaster";

const Profile = () => {
  const { user, setUser } = useAuth();
  const fileInputRef = useRef(null);
  const [VerifyLoading, setVerifyLoading] = useState(false)
  /* ================= FORM STATE ================= */
  const [formData, setFormData] = useState({
    name: user?.name || "",
    email: user?.email || "",
    phoneNo: user?.phoneNo || "",
    avatar: user?.avatar.url || "",
  });

  const [passwords, setPasswords] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  /* ================= UI STATE ================= */
  const [isDirty, setIsDirty] = useState(false);
  const [showPasswordFields, setShowPasswordFields] = useState(false);
  const [loading, setLoading] = useState(false);

  /* ================= HANDLERS ================= */
  const handleProfileChange = (e) => {
    setIsDirty(true);
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handlePasswordChange = (e) => {
    setIsDirty(true);
    setPasswords((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleImageClick = () => {
    fileInputRef.current?.click();
  };

  const handleImageChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsDirty(true);
    setFormData((prev) => ({
      ...prev,
      avatar: URL.createObjectURL(file),
    }));
  };

  const handleVerifyEmail = async () => {
    setVerifyLoading(true);
    try {
      const res = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/v1/auth/resendemail`, {withCredentials: true});
      Toaster(res.data.message, "success");
    } catch (error) {
      Toaster("Failed to send verification email", "error");
    } finally {
      setVerifyLoading(false);
    }
  };

  /* ================= SAVE LOGIC ================= */
  const handleSave = async () => {
    if (!isDirty) return;

    const { name, email, phoneNo, avatar } = formData;
    const { currentPassword, newPassword, confirmPassword } = passwords;

    if (showPasswordFields) {
      if (!currentPassword || !newPassword || !confirmPassword) {
        Toaster("All password fields are required", "warning");
        return;
      }

      if (newPassword !== confirmPassword) {
        Toaster("Passwords do not match", "warning");
        return;
      }
    }

    setLoading(true);

    try {
      const requests = [
        axios.patch(
          `${import.meta.env.VITE_BACKEND_URL}/api/v1/users/profile`,
          { name, email, phoneNo, avatar },
          { withCredentials: true }
        ),
      ];

      if (showPasswordFields) {
        requests.push(
          axios.patch(
            `${import.meta.env.VITE_BACKEND_URL}/api/v1/users/change-password`,
            {
              oldPassword: currentPassword,
              newPassword,
            },
            { withCredentials: true }
          )
        );
      }

      const [profileRes] = await Promise.all(requests);

      setUser(profileRes.data.data);
      Toaster("Profile updated successfully", "success");

      setIsDirty(false);
      setShowPasswordFields(false);
      setPasswords({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });
    } catch (error) {
      console.error("Profile update failed:", error);
      Toaster(error.response.data.errors[0]||"Error", "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen px-2 py-3">
      {/* HEADER */}
      <div className="mb-8">
        <h1 className="text-2xl font-semibold text-gray-900">
          Profile
        </h1>
        <p className="mt-1 text-sm text-gray-500">
          Manage your personal details and security settings.
        </p>
      </div>

      {/* PROFILE CARD */}
      <div className="max-w-2xl rounded-2xl bg-white p-6 shadow-sm">
        {/* AVATAR */}
        <div className="mb-6 flex items-center gap-4">
          <div
            onClick={handleImageClick}
            className="relative h-20 w-20 cursor-pointer overflow-hidden rounded-full border"
          >
            <img
              src={
                formData.avatar ||
                "https://ui-avatars.com/api/?name=User&background=E0E7FF&color=1E40AF"
              }
              alt="Profile"
              className="h-full w-full object-cover"
            />
            <div className="absolute inset-0 flex items-center justify-center bg-black/40 text-xs text-white opacity-0 hover:opacity-100">
              Change
            </div>
          </div>

          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            hidden
            onChange={handleImageChange}
          />
        </div>

        {/* INPUTS */}
        <ProfileInput
          label="Full name"
          name="name"
          value={formData.name}
          onChange={handleProfileChange}
        />

        <ProfileInput
          label="Phone number"
          name="phoneNo"
          value={formData.phoneNo}
          onChange={handleProfileChange}
        />

        <ProfileInput
  label="Email address"
  name="email"
  value={formData.email}
  onChange={handleProfileChange}
  helper={
    user?.isEmailVerified ? (
      <span className="text-xs text-green-600">
        Email verified
      </span>
    ) : VerifyLoading ? (
      <span className="text-xs text-gray-600">
        Sending...
      </span>
    ) : (
      <button
        type="button"
        onClick={handleVerifyEmail}
        className="text-xs text-blue-600 hover:underline"
      >
        Verify email
      </button>
    )
  }
/>


        {/* CHANGE PASSWORD */}
        <div className="border-b py-4">
          <button
            type="button"
            onClick={() => setShowPasswordFields((p) => !p)}
            className="text-sm text-blue-600 hover:underline"
          >
            Change password
          </button>
        </div>

        {showPasswordFields && (
          <div className="mt-4 space-y-2">
            <PasswordInput
              label="Current password"
              name="currentPassword"
              value={passwords.currentPassword}
              onChange={handlePasswordChange}
            />
            <PasswordInput
              label="New password"
              name="newPassword"
              value={passwords.newPassword}
              onChange={handlePasswordChange}
            />
            <PasswordInput
              label="Confirm new password"
              name="confirmPassword"
              value={passwords.confirmPassword}
              onChange={handlePasswordChange}
            />
          </div>
        )}

        {/* ACTIONS */}
        <div className="mt-6 flex justify-end">
          <button
            disabled={!isDirty || loading}
            onClick={handleSave}
            className={`rounded-xl px-6 py-2.5 text-sm font-medium transition
              ${
                isDirty
                  ? "bg-blue-600 text-white hover:bg-blue-700"
                  : "cursor-not-allowed bg-gray-200 text-gray-400"
              }`}
          >
            {loading ? "Saving..." : "Save changes"}
          </button>
        </div>
      </div>
    </div>
  );
};

/* ================= PROFILE INPUT ================= */
const ProfileInput = ({
  label,
  name,
  value,
  onChange,
  helper,
}) => {
  return (
    <div className="flex items-start justify-between gap-6 py-4">
      <label className="text-sm text-gray-500">{label}</label>

      <div className="w-full max-w-md">
        <input
          name={name}
          value={value}
          onChange={onChange}
          className="w-full rounded-xl border border-gray-300 px-4 py-2.5 text-sm outline-none focus:border-blue-600"
        />
        {helper && <div className="mt-1">{helper}</div>}
      </div>
    </div>
  );
};

/* ================= PASSWORD INPUT ================= */
const PasswordInput = ({ label, name, value, onChange }) => (
  <div className="flex items-start justify-between gap-6">
    <label className="text-sm text-gray-500">{label}</label>

    <input
      type="password"
      name={name}
      value={value}
      onChange={onChange}
      className="w-full max-w-md rounded-xl border border-gray-300 px-4 py-2.5 text-sm focus:border-blue-600"
    />
  </div>
);

export default Profile;
