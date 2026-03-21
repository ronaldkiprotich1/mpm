import React, { useState } from "react";
import { axiosClient } from "../api/axiosClient";

interface FeedbackModalProps {
  isOpen: boolean;
  onClose: () => void;
  projectTitle?: string | null;
  onSubmitted?: () => void;
}

const FeedbackModal: React.FC<FeedbackModalProps> = ({
  isOpen,
  onClose,
  projectTitle,
  onSubmitted,
}) => {
  const [form, setForm] = useState({ name: "", email: "", feedback: "" });
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setMessage("");

    if (!form.name || !form.email || !form.feedback) {
      setError("⚠️ All fields are required.");
      return;
    }
    if (form.feedback.trim().split(/\s+/).length > 500) {
      setError("⚠️ Feedback exceeds 500 words.");
      return;
    }

    setLoading(true);
    try {
      await axiosClient.post("feedbacks/", {
        name: form.name,
        email: form.email,
        feedback: projectTitle
          ? `Project: ${projectTitle}\n\n${form.feedback}`
          : form.feedback,
      });

      setMessage("✓ Feedback submitted! Redirecting you back...");
      setForm({ name: "", email: "", feedback: "" });

      setTimeout(() => {
        setMessage("");
        onClose();
        // Tell Home to reopen the project detail modal
        if (onSubmitted) onSubmitted();
      }, 1200);
    } catch {
      setError("Failed to submit. Please check your connection.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-2xl shadow-2xl p-6 w-full max-w-md relative"
        onClick={(e) => e.stopPropagation()}
        style={{ animation: "fadeIn 0.2s ease-in-out" }}
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-5 text-gray-400 hover:text-red-500 text-2xl font-bold leading-none"
        >
          ×
        </button>

        <h2 className="text-xl font-bold text-green-800 text-center mb-1">
          Submit Feedback
        </h2>

        {projectTitle && (
          <p className="text-sm text-center text-gray-500 mb-5">
            <span className="font-semibold text-gray-700">Project:</span>{" "}
            {projectTitle}
          </p>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="name"
              value={form.name}
              onChange={handleChange}
              required
              placeholder="Enter your name"
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-400 text-gray-700"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Email <span className="text-red-500">*</span>
            </label>
            <input
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              required
              placeholder="Enter your email"
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-400 text-gray-700"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Feedback <span className="text-red-500">*</span>
            </label>
            <textarea
              name="feedback"
              value={form.feedback}
              onChange={handleChange}
              required
              rows={5}
              maxLength={3000}
              placeholder="Write your feedback (max 500 words)"
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-green-400 text-gray-700"
            />
          </div>

          {error && (
            <p className="text-red-600 text-sm text-center">{error}</p>
          )}
          {message && (
            <p className="text-green-700 text-sm text-center font-medium">
              {message}
            </p>
          )}

          <button
            type="submit"
            disabled={loading}
            className={`w-full py-2.5 text-white font-semibold rounded-lg transition ${
              loading
                ? "bg-green-400 cursor-not-allowed"
                : "bg-green-700 hover:bg-green-800"
            }`}
          >
            {loading ? "Submitting..." : "Submit Feedback"}
          </button>
        </form>
      </div>

      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: scale(0.97); }
          to { opacity: 1; transform: scale(1); }
        }
      `}</style>
    </div>
  );
};

export default FeedbackModal;