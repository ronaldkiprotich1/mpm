import React, { useState } from "react";
import { axiosClient } from "../api/axiosClient";

interface FeedbackModalProps {
  isOpen: boolean;
  onClose: () => void;
  projectTitle?: string | null;
}

const FeedbackModal: React.FC<FeedbackModalProps> = ({
  isOpen,
  onClose,
  projectTitle,
}) => {
  const [form, setForm] = useState({
    name: "",
    email: "",
    feedback: "",
  });
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setMessage("");

    if (!form.name || !form.email || !form.feedback) {
      setError("⚠️ All fields are required.");
      return;
    }

    if (form.feedback.split(" ").length > 500) {
      setError("⚠️ Feedback exceeds 500 words limit.");
      return;
    }

    setLoading(true);
    try {
      const finalFeedback = projectTitle
        ? `Project: ${projectTitle}\n\n${form.feedback}`
        : form.feedback;

      const res = await axiosClient.post("feedbacks/", {
        ...form,
        feedback: finalFeedback,
      });

      setMessage(" Feedback submitted successfully!");
      setForm({ name: "", email: "", feedback: "" });

      setTimeout(() => {
        setMessage("");
        onClose();
      }, 1500);
    } catch (err) {
      console.error("Feedback submission failed:", err);
      setError(" Failed to submit feedback. Please check backend connection.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center z-50 animate-fadeIn"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-lg shadow-lg p-6 w-full max-w-md relative"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-gray-500 hover:text-black text-xl"
        >
          ✕
        </button>

        <h2 className="text-xl font-semibold text-green-800 text-center mb-4">
          Submit Feedback
        </h2>

        {projectTitle && (
          <p className="text-sm text-center text-gray-600 mb-2">
            <span className="font-semibold">Project:</span> {projectTitle}
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
              className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-400"
              placeholder="Enter your name"
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
              className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-400"
              placeholder="Enter your email"
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
              maxLength={3000}
              className="w-full border border-gray-300 rounded-md px-3 py-2 h-28 resize-none focus:outline-none focus:ring-2 focus:ring-green-400"
              placeholder="Write your feedback (max 500 words)"
            />
          </div>

          {error && <p className="text-red-600 text-sm text-center">{error}</p>}
          {message && (
            <p className="text-green-700 text-sm text-center">{message}</p>
          )}

          <button
            type="submit"
            disabled={loading}
            className={`w-full py-2 text-white font-semibold rounded-md transition ${
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
        .animate-fadeIn {
          animation: fadeIn 0.25s ease-in-out;
        }
      `}</style>
    </div>
  );
};

export default FeedbackModal;
