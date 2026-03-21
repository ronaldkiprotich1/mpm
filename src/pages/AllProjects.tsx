import React, { useState, useEffect } from "react";
import { axiosClient } from "../api/axiosClient";
import { motion, AnimatePresence } from "framer-motion";

interface Project {
  id: number;
  title: string;
  department_name: string;
  ward_name: string;
  financial_year_name: string;
  status: string;
  budget: string | number | null;
  contractor_name?: string | null;
  description?: string | null;
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

// ── Helpers ───────────────────────────────────────────────────────────────────
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

function formatBudget(budget: string | number | null) {
  return budget ? Number(budget).toLocaleString() : "—";
}

function statusBadge(status: string) {
  switch (status) {
    case "Completed": return "bg-green-100 text-green-800";
    case "Ongoing":   return "bg-blue-100 text-blue-800";
    case "Stalled":   return "bg-red-100 text-red-800";
    case "Pending":   return "bg-yellow-100 text-yellow-800";
    case "Not Started": return "bg-gray-100 text-gray-600";
    case "Under Procurement": return "bg-purple-100 text-purple-800";
    default: return "bg-gray-100 text-gray-600";
  }
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

// ── Single feedback card with inline reply thread ─────────────────────────────
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

      {/* Feedback author + message */}
      <div className="px-4 pt-4 pb-3">
        <div className="flex items-center gap-3 mb-3">
          <div
            className={`w-9 h-9 rounded-full flex items-center justify-center text-xs font-semibold flex-shrink-0 ${avatarColor(fb.name)}`}
          >
            {initials(fb.name)}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold text-gray-800">{fb.name}</p>
            <p className="text-xs text-gray-400">
              {fb.email} · {timeAgo(fb.created_at)}
            </p>
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

      {/* Reply thread — admin replies blue, public replies gray */}
      {fb.replies.length > 0 && (
        <div className="border-t border-gray-100 divide-y divide-gray-100">
          {fb.replies.map((reply) => (
            <div
              key={reply.id}
              className={`flex gap-3 items-start px-4 py-3 ${
                reply.is_admin_reply ? "bg-blue-50" : "bg-gray-50"
              }`}
            >
              <div
                className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-semibold flex-shrink-0 mt-0.5 ${
                  reply.is_admin_reply
                    ? "bg-blue-200 text-blue-900"
                    : avatarColor(reply.name)
                }`}
              >
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
                    onChange={(e) =>
                      setForm({ ...form, message: e.target.value })
                    }
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
            : `${fb.reply_count} ${
                fb.reply_count === 1 ? "response" : "responses"
              }`}
        </span>
        {!showForm && (
          <button
            onClick={() => setShowForm(true)}
            className="flex items-center gap-1.5 text-xs font-medium text-green-700 bg-green-50 border border-green-200 px-3 py-1.5 rounded-lg hover:bg-green-100 transition"
          >
            <svg
              className="w-3 h-3"
              viewBox="0 0 16 16"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
            >
              <path d="M2 10C2 6.686 4.686 4 8 4h4M9 2l3 2-3 2" />
            </svg>
            Join the conversation
          </button>
        )}
      </div>
    </div>
  );
};

// ── Main AllProjects ──────────────────────────────────────────────────────────
const AllProjects: React.FC = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [feedbacks, setFeedbacks] = useState<Feedback[]>([]);
  const [fbLoading, setFbLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  // ── Fetch projects ────────────────────────────────────────────────────────
  useEffect(() => {
    axiosClient
      .get("projects/")
      .then((res) => setProjects(res.data.results || res.data))
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  // ── Listen for reopenProjectModal event fired from Home after
  //    FeedbackModal submits — reopens this project's detail modal
  //    so the user immediately sees their submitted feedback ──────────────────
  useEffect(() => {
    if (projects.length === 0) return;
    const handler = (event: CustomEvent) => {
      const title = event.detail as string;
      const match = projects.find((p) => p.title === title);
      if (match) openModal(match);
    };
    window.addEventListener("reopenProjectModal", handler as EventListener);
    return () =>
      window.removeEventListener("reopenProjectModal", handler as EventListener);
  }, [projects]);

  // ── Load feedbacks for a project ─────────────────────────────────────────
  const loadFeedbacks = async (projectTitle: string, isRefresh = false) => {
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

  const openModal = (project: Project) => {
    setSelectedProject(project);
    loadFeedbacks(project.title);
  };

  const closeModal = () => {
    setSelectedProject(null);
    setFeedbacks([]);
  };

  // ── Open FeedbackModal via custom event, then close this modal ────────────
  const openFeedbackSubmit = (projectTitle: string) => {
    closeModal();
    setTimeout(() => {
      window.dispatchEvent(
        new CustomEvent("openFeedback", { detail: projectTitle })
      );
    }, 150);
  };

  if (loading)
    return (
      <div className="flex items-center justify-center py-24">
        <p className="text-blue-600 text-sm animate-pulse">
          Loading projects...
        </p>
      </div>
    );

  if (error)
    return (
      <div className="flex items-center justify-center py-24">
        <p className="text-red-600 text-sm">
          Failed to load projects: {error}
        </p>
      </div>
    );

  return (
    <div className="px-4 py-6 md:px-8 lg:px-12">
      <h2 className="text-2xl font-bold text-green-800 mb-4 text-center uppercase tracking-wide">
        All County Projects
      </h2>

      {/* ── Projects table ── */}
      <div className="overflow-x-auto shadow-lg rounded-md border border-gray-200">
        <table className="min-w-full border-collapse">
          <thead className="bg-blue-600 text-white">
            <tr>
              {[
                "#",
                "Project Title",
                "Department",
                "Ward",
                "Financial Year",
                "Status",
                "Budget (KES)",
                "Action",
              ].map((h) => (
                <th
                  key={h}
                  className={`px-4 py-3 text-sm font-semibold border-b border-blue-500 ${
                    h === "Action" ? "text-center" : "text-left"
                  }`}
                >
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {projects.map((project, index) => (
              <tr
                key={project.id}
                className={`hover:bg-green-50 transition duration-150 ${
                  index % 2 === 0 ? "bg-gray-50" : "bg-white"
                }`}
              >
                <td className="px-4 py-3 text-sm text-gray-700">
                  {index + 1}
                </td>
                <td className="px-4 py-3 text-sm text-gray-800 font-semibold">
                  {project.title}
                </td>
                <td className="px-4 py-3 text-sm text-gray-700">
                  {project.department_name}
                </td>
                <td className="px-4 py-3 text-sm text-gray-700">
                  {project.ward_name}
                </td>
                <td className="px-4 py-3 text-sm text-gray-700">
                  {project.financial_year_name}
                </td>
                <td className="px-4 py-3">
                  <span
                    className={`text-xs font-semibold px-2 py-1 rounded-full ${statusBadge(
                      project.status
                    )}`}
                  >
                    {project.status}
                  </span>
                </td>
                <td className="px-4 py-3 text-sm text-gray-700">
                  {formatBudget(project.budget)}
                </td>
                <td className="px-4 py-3 text-center">
                  <button
                    onClick={() => openModal(project)}
                    className="bg-blue-600 text-white px-3 py-1 rounded-md text-xs hover:bg-green-700 transition"
                  >
                    View Details
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {projects.length === 0 && (
        <p className="text-center text-gray-500 mt-6 text-sm">
          No projects found.
        </p>
      )}

      {/* ── Project Detail Modal ── */}
      {selectedProject && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.97 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-2xl w-full max-w-2xl shadow-2xl max-h-[90vh] flex flex-col"
          >
            {/* Sticky header */}
            <div className="border-b border-gray-100 px-6 py-4 flex items-start justify-between gap-3 flex-shrink-0">
              <div>
                <h3 className="text-lg font-bold text-green-800 leading-tight">
                  {selectedProject.title}
                </h3>
                <p className="text-xs text-gray-400 mt-0.5">
                  {selectedProject.department_name}
                </p>
              </div>
              <div className="flex items-center gap-3 flex-shrink-0">
                <span
                  className={`text-xs font-semibold px-2.5 py-1 rounded-full ${statusBadge(
                    selectedProject.status
                  )}`}
                >
                  {selectedProject.status}
                </span>
                <button
                  onClick={closeModal}
                  className="text-gray-400 hover:text-red-500 text-xl font-bold leading-none"
                >
                  ×
                </button>
              </div>
            </div>

            {/* Scrollable body */}
            <div className="overflow-y-auto px-6 py-5 flex-1">

              {/* Project details grid */}
              <div className="grid grid-cols-2 gap-x-8 gap-y-4 mb-5">
                {[
                  { label: "Ward", value: selectedProject.ward_name },
                  {
                    label: "Financial Year",
                    value: selectedProject.financial_year_name,
                  },
                  {
                    label: "Contractor",
                    value: selectedProject.contractor_name ?? "—",
                  },
                  {
                    label: "Budget",
                    value: `KES ${formatBudget(selectedProject.budget)}`,
                  },
                ].map(({ label, value }) => (
                  <div key={label}>
                    <p className="text-xs text-gray-400 mb-0.5">{label}</p>
                    <p className="text-sm font-medium text-gray-700">{value}</p>
                  </div>
                ))}
              </div>

              {selectedProject.description && (
                <div className="bg-gray-50 rounded-xl px-4 py-3 text-sm text-gray-600 leading-relaxed mb-5">
                  {selectedProject.description}
                </div>
              )}

              {/* ── Feedback section ── */}
              <div className="border-t border-gray-100 pt-5">
                <div className="flex items-center justify-between mb-4">
                  <h4 className="text-sm font-bold text-gray-700 uppercase tracking-wide">
                    Community Feedback
                    {feedbacks.length > 0 && (
                      <span className="ml-2 normal-case font-normal text-gray-400">
                        ({feedbacks.length})
                      </span>
                    )}
                  </h4>

                  <div className="flex items-center gap-2">
                    {/* Refresh button */}
                    <button
                      onClick={() =>
                        loadFeedbacks(selectedProject.title, true)
                      }
                      disabled={refreshing}
                      className="flex items-center gap-1.5 text-xs text-gray-400 hover:text-gray-600 px-2.5 py-1.5 rounded-lg hover:bg-gray-100 transition border border-gray-200"
                      title="Refresh to see latest replies"
                    >
                      <svg
                        className={`w-3 h-3 ${
                          refreshing ? "animate-spin" : ""
                        }`}
                        viewBox="0 0 16 16"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="1.5"
                      >
                        <path d="M13.5 8A5.5 5.5 0 1 1 8 2.5c1.8 0 3.4.87 4.4 2.2M13.5 2.5v2.5H11" />
                      </svg>
                      {refreshing ? "Refreshing..." : "Refresh"}
                    </button>

                    {/* Submit feedback — closes this modal, opens FeedbackModal */}
                    <button
                      onClick={() =>
                        openFeedbackSubmit(selectedProject.title)
                      }
                      className="text-xs font-medium text-white bg-green-700 hover:bg-green-800 px-4 py-1.5 rounded-lg transition"
                    >
                      + Submit Feedback
                    </button>
                  </div>
                </div>

                {/* Loading */}
                {fbLoading && (
                  <p className="text-xs text-gray-400 animate-pulse py-4 text-center">
                    Loading feedback...
                  </p>
                )}

                {/* Empty state */}
                {!fbLoading && feedbacks.length === 0 && (
                  <div className="text-center py-8 border border-dashed border-gray-200 rounded-xl">
                    <p className="text-sm text-gray-400 mb-2">
                      No feedback yet for this project.
                    </p>
                    <button
                      onClick={() =>
                        openFeedbackSubmit(selectedProject.title)
                      }
                      className="text-xs font-medium text-green-700 underline"
                    >
                      Be the first to share your thoughts
                    </button>
                  </div>
                )}

                {/* Feedback cards */}
                {!fbLoading && feedbacks.length > 0 && (
                  <div className="space-y-3">
                    {feedbacks.map((fb) => (
                      <FeedbackCard
                        key={fb.id}
                        fb={fb}
                        onReplyPosted={() =>
                          loadFeedbacks(selectedProject.title, true)
                        }
                      />
                    ))}
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
};

export default AllProjects;