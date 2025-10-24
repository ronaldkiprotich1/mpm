import React, { useState } from "react";
import { axiosClient } from "../api/axiosClient";

interface FeedbackModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const FeedbackModal: React.FC<FeedbackModalProps> = ({ isOpen, onClose }) => {
  const [form, setForm] = useState({
    name: "",
    email: "",
    feedback: "",
  });
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    try {
      const res = await axiosClient.post("/feedbacks/", form);
      setMessage("✅ Feedback submitted successfully!");
      setForm({ name: "", email: "", feedback: "" });
    } catch (err) {
      console.error("Feedback error:", err);
      setMessage("❌ Failed to submit feedback. Try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center z-50">
      <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-md relative">
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-gray-500 hover:text-black"
        >
          ✕
        </button>

        <h2 className="text-lg font-bold mb-4 text-green-800">Submit Feedback</h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Name</label>
            <input
              type="text"
              name="name"
              required
              value={form.name}
              onChange={handleChange}
              className="w-full border p-2 rounded mt-1"
              placeholder="Enter your name"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Email</label>
            <input
              type="email"
              name="email"
              required
              value={form.email}
              onChange={handleChange}
              className="w-full border p-2 rounded mt-1"
              placeholder="Enter your email"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Feedback</label>
            <textarea
              name="feedback"
              required
              maxLength={500}
              value={form.feedback}
              onChange={handleChange}
              className="w-full border p-2 rounded mt-1 h-28"
              placeholder="Share your thoughts..."
            />
          </div>

          {message && <p className="text-sm text-center text-green-700">{message}</p>}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-green-700 text-white py-2 rounded hover:bg-green-800"
          >
            {loading ? "Submitting..." : "Submit Feedback"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default FeedbackModal;
