import React, { useState, useEffect } from "react";
import { axiosClient } from "../api/axiosClient";
import { Project } from "../types/Project";
import { motion, AnimatePresence } from "framer-motion";

interface ProjectsTableProps {
  projects: Project[];
}

interface Reply {
  id: number;
  name: string;
  message: string;
  is_admin_reply: boolean;
  created_at: string;
}

interface Feedback {
  id: number;
  name: string;
  email: string;
  feedback: string;
  is_resolved: boolean;
  reply_count: number;
  replies: Reply[];
  created_at: string;
}

function initials(name: string) {
  return name.split(" ").slice(0, 2).map((w) => w[0]).join("").toUpperCase();
}

function timeAgo(iso: string) {
  const diff = Math.floor((Date.now() - new Date(iso).getTime()) / 1000);
  if (diff < 60) return "just now";
  if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
  return `${Math.floor(diff / 86400)}d ago`;
}

function stripPrefix(text: string) {
  const match = text.match(/^Project: .+?\n\n([\s\S]*)$/);
  return match ? match[1] : text;
}

const AVATAR_COLORS = [
  "bg-blue-100 text-blue-800",
  "bg-teal-100 text-teal-800",
  "bg-purple-100 text-purple-800",
  "bg-amber-100 text-amber-800",
  "bg-pink-100 text-pink-800",
];

function avatarColor(name: string) {
  return AVATAR_COLORS[name.charCodeAt(0) % AVATAR_COLORS.length];
}

function statusStyle(status: string) {
  switch (status) {
    case "completed": return "bg-green-100 text-green-700";
    case "ongoing": return "bg-blue-100 text-blue-700";
    case "pending": return "bg-yellow-100 text-yellow-700";
    case "under_procurement": return "bg-purple-100 text-purple-700";
    case "stalled": return "bg-red-100 text-red-700";
    case "not_started": return "bg-gray-100 text-gray-600";
    default: return "bg-gray-100 text-gray-700";
  }
}

// ── Single feedback card with inline reply ────────────────────────────────────
const FeedbackCard: React.FC<{
  fb: Feedback;
  onReplyPosted: () => void;
}> = ({ fb, onReplyPosted }) => {
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ name: "", message: "" });
  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState("");
  const [success, setSuccess] = useState(false);

  const handleReply = async () => {
    if (!form.name.trim() || !form.message.trim()) {
      setFormError("Name and message are required.");
      return;
    }
    setFormError("");
    setSubmitting(true);
    try {
      await axiosClient.post(`feedbacks/${fb.id}/public-reply/`, {
        name: form.name,
        message: form.message,
      });
      setSuccess(true);
      setForm({ name: "", message: "" });
      setTimeout(() => {
        setSuccess(false);
        setShowForm(false);
        onReplyPosted();
      }, 1000);
    } catch {
      setFormError("Could not post response. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="border border-gray-200 rounded-xl overflow-hidden bg-white">

      {/* Feedback message */}
      <div className="px-4 pt-4 pb-3">
        <div className="flex items-center gap-3 mb-3">
          <div className={`w-9 h-9 rounded-full flex items-center justify-center text-xs font-semibold flex-shrink-0 ${avatarColor(fb.name)}`}>
            {initials(fb.name)}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold text-gray-800">{fb.name}</p>
            <p className="text-xs text-gray-400">{timeAgo(fb.created_at)}</p>
          </div>
          {fb.is_resolved && (
            <span className="text-xs px-2 py-0.5 rounded-full bg-green-100 text-green-700 font-medium flex-shrink-0">
              ✓ Resolved
            </span>
          )}
        </div>
        <p className="text-sm text-gray-600 leading-relaxed">
          {stripPrefix(fb.feedback)}
        </p>
      </div>

      {/* Reply thread */}
      {fb.replies.length > 0 && (
        <div className="border-t border-gray-100 divide-y divide-gray-100">
          {fb.replies.map((reply) => (
            <div
              key={reply.id}
              className={`flex gap-3 items-start px-4 py-3 ${
                reply.is_admin_reply ? "bg-blue-50" : "bg-gray-50"
              }`}
            >
              <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-semibold flex-shrink-0 mt-0.5 ${
                reply.is_admin_reply
                  ? "bg-blue-200 text-blue-900"
                  : avatarColor(reply.name)
              }`}>
                {initials(reply.name)}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1 flex-wrap">
                  <span className="text-xs font-semibold text-gray-700">
                    {reply.name}
                  </span>
                  {reply.is_admin_reply && (
                    <span className="text-[10px] px-1.5 py-0.5 rounded bg-blue-600 text-white font-semibold tracking-wide">
                      ADMIN
                    </span>
                  )}
                  <span className="text-xs text-gray-400 ml-auto">
                    {timeAgo(reply.created_at)}
                  </span>
                </div>
                <p className="text-xs text-gray-600 leading-relaxed">
                  {reply.message}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Inline reply form */}
      <AnimatePresence>
        {showForm && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden border-t border-gray-100 bg-gray-50"
          >
            <div className="px-4 py-3 space-y-2">
              {success ? (
                <p className="text-xs text-green-700 text-center py-2 font-medium">
                  ✓ Response posted successfully!
                </p>
              ) : (
                <>
                  <input
                    type="text"
                    placeholder="Your name *"
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    className="w-full text-xs px-3 py-2 border border-gray-200 rounded-lg bg-white focus:outline-none focus:ring-1 focus:ring-green-400 text-gray-700 placeholder-gray-400"
                  />
                  <textarea
                    placeholder="Write your response..."
                    value={form.message}
                    onChange={(e) => setForm({ ...form, message: e.target.value })}
                    rows={3}
                    className="w-full text-xs px-3 py-2 border border-gray-200 rounded-lg bg-white focus:outline-none focus:ring-1 focus:ring-green-400 text-gray-700 placeholder-gray-400 resize-none"
                  />
                  {formError && (
                    <p className="text-xs text-red-500">{formError}</p>
                  )}
                  <div className="flex justify-end gap-2">
                    <button
                      onClick={() => {
                        setShowForm(false);
                        setFormError("");
                        setForm({ name: "", message: "" });
                      }}
                      className="text-xs px-3 py-1.5 rounded-lg border border-gray-200 text-gray-500 hover:bg-gray-100 transition"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handleReply}
                      disabled={submitting}
                      className={`text-xs px-4 py-1.5 rounded-lg text-white font-medium transition ${
                        submitting
                          ? "bg-green-400 cursor-not-allowed"
                          : "bg-green-700 hover:bg-green-800"
                      }`}
                    >
                      {submitting ? "Posting..." : "Post response"}
                    </button>
                  </div>
                </>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Card footer */}
      <div className="border-t border-gray-100 px-4 py-2.5 flex items-center justify-between bg-white">
        <span className="text-xs text-gray-400">
          {fb.reply_count === 0
            ? "No responses yet — be first"
            : `${fb.reply_count} ${fb.reply_count === 1 ? "response" : "responses"}`}
        </span>
        {!showForm && (
          <button
            onClick={() => setShowForm(true)}
            className="flex items-center gap-1.5 text-xs font-medium text-green-700 bg-green-50 border border-green-200 px-3 py-1.5 rounded-lg hover:bg-green-100 transition"
          >
            <svg className="w-3 h-3" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5">
              <path d="M2 10C2 6.686 4.686 4 8 4h4M9 2l3 2-3 2" />
            </svg>
            Join the conversation
          </button>
        )}
      </div>
    </div>
  );
};

// ── Feedback thread modal ─────────────────────────────────────────────────────
const FeedbackThreadModal: React.FC<{
  projectTitle: string;
  onClose: () => void;
}> = ({ projectTitle, onClose }) => {
  const [feedbacks, setFeedbacks] = useState<Feedback[]>([]);
  const [fbLoading, setFbLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [showSubmitForm, setShowSubmitForm] = useState(false);
  const [submitForm, setSubmitForm] = useState({
    name: "",
    email: "",
    feedback: "",
  });
  const [submitLoading, setSubmitLoading] = useState(false);
  const [submitError, setSubmitError] = useState("");
  const [submitSuccess, setSubmitSuccess] = useState(false);

  const loadFeedbacks = async (isRefresh = false) => {
    isRefresh ? setRefreshing(true) : setFbLoading(true);
    try {
      const res = await axiosClient.get("feedbacks/");
      const all: Feedback[] = res.data.results || res.data;
      const matched = all.filter((fb) =>
        fb.feedback.startsWith(`Project: ${projectTitle}\n\n`)
      );
      setFeedbacks(matched);
    } catch {
      setFeedbacks([]);
    } finally {
      isRefresh ? setRefreshing(false) : setFbLoading(false);
    }
  };

  useEffect(() => {
    loadFeedbacks();
  }, [projectTitle]);

  const handleSubmit = async () => {
    if (!submitForm.name.trim() || !submitForm.email.trim() || !submitForm.feedback.trim()) {
      setSubmitError("All fields are required.");
      return;
    }
    if (submitForm.feedback.trim().split(/\s+/).length > 500) {
      setSubmitError("Feedback exceeds 500 words.");
      return;
    }
    setSubmitError("");
    setSubmitLoading(true);
    try {
      await axiosClient.post("feedbacks/", {
        name: submitForm.name,
        email: submitForm.email,
        feedback: `Project: ${projectTitle}\n\n${submitForm.feedback}`,
      });
      setSubmitSuccess(true);
      setSubmitForm({ name: "", email: "", feedback: "" });
      setTimeout(() => {
        setSubmitSuccess(false);
        setShowSubmitForm(false);
        loadFeedbacks(true);
      }, 1200);
    } catch {
      setSubmitError("Failed to submit. Please check your connection.");
    } finally {
      setSubmitLoading(false);
    }
  };

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.97 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-white rounded-2xl w-full max-w-2xl shadow-2xl max-h-[90vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="border-b border-gray-100 px-6 py-4 flex items-start justify-between gap-3 flex-shrink-0">
          <div>
            <h3 className="text-lg font-bold text-green-800 leading-tight">
              Community Feedback
            </h3>
            <p className="text-xs text-gray-400 mt-0.5">{projectTitle}</p>
          </div>
          <div className="flex items-center gap-2 flex-shrink-0">
            <button
              onClick={() => loadFeedbacks(true)}
              disabled={refreshing}
              className="flex items-center gap-1.5 text-xs text-gray-400 hover:text-gray-600 px-2.5 py-1.5 rounded-lg hover:bg-gray-100 transition border border-gray-200"
            >
              <svg
                className={`w-3 h-3 ${refreshing ? "animate-spin" : ""}`}
                viewBox="0 0 16 16"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
              >
                <path d="M13.5 8A5.5 5.5 0 1 1 8 2.5c1.8 0 3.4.87 4.4 2.2M13.5 2.5v2.5H11" />
              </svg>
              {refreshing ? "Refreshing..." : "Refresh"}
            </button>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-red-500 text-xl font-bold leading-none"
            >
              ×
            </button>
          </div>
        </div>

        {/* Scrollable body */}
        <div className="overflow-y-auto px-6 py-5 flex-1">

          {/* Submit form */}
          <div className="mb-5">
            {!showSubmitForm ? (
              <button
                onClick={() => setShowSubmitForm(true)}
                className="w-full py-2.5 border-2 border-dashed border-green-300 rounded-xl text-sm font-medium text-green-700 hover:bg-green-50 transition"
              >
                + Submit feedback on this project
              </button>
            ) : (
              <div className="border border-gray-200 rounded-xl overflow-hidden">
                <div className="bg-green-700 px-4 py-3 flex items-center justify-between">
                  <h5 className="text-sm font-semibold text-white">
                    Submit your feedback
                  </h5>
                  <button
                    onClick={() => { setShowSubmitForm(false); setSubmitError(""); }}
                    className="text-green-200 hover:text-white text-lg leading-none"
                  >
                    ×
                  </button>
                </div>
                <div className="px-4 py-4 space-y-3 bg-white">
                  {submitSuccess ? (
                    <div className="text-center py-4">
                      <p className="text-green-700 font-semibold text-sm mb-1">
                        ✓ Feedback submitted!
                      </p>
                      <p className="text-xs text-green-600">
                        Your feedback is now visible below.
                      </p>
                    </div>
                  ) : (
                    <>
                      {/* Name only — no email */}
                      <div>
                        <label className="block text-xs font-medium text-gray-600 mb-1">
                          Name <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="text"
                          placeholder="Your name"
                          value={submitForm.name}
                          onChange={(e) => setSubmitForm({ ...submitForm, name: e.target.value })}
                          className="w-full text-sm px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-green-400 text-gray-700 placeholder-gray-400"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-gray-600 mb-1">
                          Feedback <span className="text-red-500">*</span>
                        </label>
                        <textarea
                          placeholder="Share your thoughts... (max 500 words)"
                          value={submitForm.feedback}
                          onChange={(e) => setSubmitForm({ ...submitForm, feedback: e.target.value })}
                          rows={4}
                          className="w-full text-sm px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-green-400 text-gray-700 placeholder-gray-400 resize-none"
                        />
                      </div>
                      {submitError && (
                        <p className="text-xs text-red-500">{submitError}</p>
                      )}
                      <div className="flex justify-end gap-2">
                        <button
                          onClick={() => { setShowSubmitForm(false); setSubmitError(""); }}
                          className="text-sm px-4 py-2 rounded-lg border border-gray-200 text-gray-500 hover:bg-gray-50 transition"
                        >
                          Cancel
                        </button>
                        <button
                          onClick={handleSubmit}
                          disabled={submitLoading}
                          className={`text-sm px-6 py-2 rounded-lg text-white font-medium transition ${
                            submitLoading
                              ? "bg-green-400 cursor-not-allowed"
                              : "bg-green-700 hover:bg-green-800"
                          }`}
                        >
                          {submitLoading ? "Submitting..." : "Submit Feedback"}
                        </button>
                      </div>
                    </>
                  )}
                </div>
              </div>
            )}
          </div>

          {fbLoading && (
            <p className="text-xs text-gray-400 animate-pulse py-4 text-center">
              Loading feedback...
            </p>
          )}

          {!fbLoading && feedbacks.length === 0 && !showSubmitForm && (
            <div className="text-center py-10 border border-dashed border-gray-200 rounded-xl">
              <p className="text-sm text-gray-400 mb-2">
                No feedback yet for this project.
              </p>
              <button
                onClick={() => setShowSubmitForm(true)}
                className="text-xs font-medium text-green-700 underline"
              >
                Be the first to share your thoughts
              </button>
            </div>
          )}

          {!fbLoading && feedbacks.length > 0 && (
            <div className="space-y-3">
              {feedbacks.map((fb) => (
                <FeedbackCard
                  key={fb.id}
                  fb={fb}
                  onReplyPosted={() => loadFeedbacks(true)}
                />
              ))}
            </div>
          )}
        </div>
      </motion.div>
    </div>
  );
};

// ── Main ProjectsTable ────────────────────────────────────────────────────────
const ProjectsTable: React.FC<ProjectsTableProps> = ({ projects }) => {
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [feedbackProject, setFeedbackProject] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 50;
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredProjects, setFilteredProjects] = useState<Project[]>(projects);

  useEffect(() => {
    if (!searchTerm.trim()) {
      setFilteredProjects(projects);
    } else {
      const lower = searchTerm.toLowerCase();
      setFilteredProjects(
        projects.filter((p) =>
          [p.title, p.department_name, p.subcounty_name, p.ward_name]
            .some((field) => field?.toLowerCase().includes(lower))
        )
      );
      setCurrentPage(1);
    }
  }, [searchTerm, projects]);

  if (!filteredProjects || filteredProjects.length === 0)
    return (
      <div className="text-center text-gray-500 mt-6">
        No projects found for the selected filters.
      </div>
    );

  const totalPages = Math.ceil(filteredProjects.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentProjects = filteredProjects.slice(
    startIndex,
    startIndex + itemsPerPage
  );

  const goToPage = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div>
      {/* Search */}
      <div className="flex flex-col sm:flex-row justify-between items-center mb-4 gap-3">
        <input
          type="text"
          placeholder="Search projects..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full sm:w-1/2 border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-green-600 focus:border-green-600"
        />
      </div>

      {/* Table */}
      <div className="overflow-x-auto shadow-md rounded-lg">
        <table className="min-w-full text-sm border-collapse border border-gray-200">
          <thead className="bg-green-800 text-white">
            <tr>
              <th className="p-3 text-left">Title</th>
              <th className="p-3 text-left">Department</th>
              <th className="p-3 text-left">Financial Year</th>
              <th className="p-3 text-left">Subcounty</th>
              <th className="p-3 text-left">Ward</th>
              <th className="p-3 text-left">Status</th>
              <th className="p-3 text-left">Description</th>
              <th className="p-3 text-left">Feedback</th>
            </tr>
          </thead>
          <tbody>
            {currentProjects.map((project) => (
              <tr key={project.id} className="border-t hover:bg-gray-50 transition">
                <td className="p-3">{project.title}</td>
                <td className="p-3">{project.department_name}</td>
                <td className="p-3">{project.financial_year_name}</td>
                <td className="p-3">{project.subcounty_name}</td>
                <td className="p-3">{project.ward_name}</td>
                <td className="p-3">
                  <span className={`px-2 py-1 rounded text-xs font-semibold ${statusStyle(project.status)}`}>
                    {project.status?.replace(/_/g, " ") || "N/A"}
                  </span>
                </td>
                <td className="p-3">
                  <button
                    onClick={() => setSelectedProject(project)}
                    className="text-blue-600 hover:underline font-medium"
                  >
                    View
                  </button>
                </td>
                <td className="p-3">
                  <button
                    onClick={() => setFeedbackProject(project.title)}
                    className="text-green-700 hover:underline font-medium"
                  >
                    Feedback
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="flex justify-between items-center mt-6">
        <button
          onClick={() => goToPage(currentPage - 1)}
          disabled={currentPage === 1}
          className={`px-4 py-2 rounded-lg font-medium transition ${
            currentPage === 1
              ? "bg-gray-300 text-gray-500 cursor-not-allowed"
              : "bg-green-700 text-white hover:bg-green-800 shadow-sm"
          }`}
        >
          ← Previous
        </button>

        <div className="flex gap-2 flex-wrap justify-center">
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
            <button
              key={page}
              onClick={() => goToPage(page)}
              className={`px-3 py-2 rounded-lg font-medium transition ${
                currentPage === page
                  ? "bg-green-700 text-white shadow-md"
                  : "bg-gray-200 text-gray-700 hover:bg-gray-300"
              }`}
            >
              {page}
            </button>
          ))}
        </div>

        <button
          onClick={() => goToPage(currentPage + 1)}
          disabled={currentPage === totalPages}
          className={`px-4 py-2 rounded-lg font-medium transition ${
            currentPage === totalPages
              ? "bg-gray-300 text-gray-500 cursor-not-allowed"
              : "bg-green-700 text-white hover:bg-green-800 shadow-sm"
          }`}
        >
          Next →
        </button>
      </div>

      <div className="text-center mt-3 text-sm text-gray-600">
        Page <span className="font-semibold">{currentPage}</span> of{" "}
        <span className="font-semibold">{totalPages}</span>
      </div>

      {/* Description modal — unchanged */}
      {selectedProject && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40 z-50">
          <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-md relative">
            <h2 className="text-lg font-bold text-green-800 mb-4">
              {selectedProject.title}
            </h2>
            <div className="space-y-3 text-sm text-gray-700">
              <p>
                <strong>Start Date:</strong>{" "}
                {selectedProject.start_date || "N/A"}
              </p>
              <p>
                <strong>Expected Completion:</strong>{" "}
                {selectedProject.expected_completion_date || "N/A"}
              </p>
              <p>
                <strong>Actual Completion:</strong>{" "}
                {selectedProject.actual_completion_date || "N/A"}
              </p>
              <hr className="my-3" />
              <p><strong>Description:</strong></p>
              <p className="text-gray-600 whitespace-pre-wrap">
                {selectedProject.description || "No description provided."}
              </p>
            </div>
            <button
              onClick={() => setSelectedProject(null)}
              className="w-full mt-6 bg-green-700 hover:bg-green-800 text-white font-semibold py-3 rounded-lg transition"
            >
              Close
            </button>
          </div>
        </div>
      )}

      {/* Feedback thread modal */}
      {feedbackProject && (
        <FeedbackThreadModal
          projectTitle={feedbackProject}
          onClose={() => setFeedbackProject(null)}
        />
      )}
    </div>
  );
};

export default ProjectsTable;