import { useState, useEffect, useRef } from "react";
import { Project } from "../types/Project";

interface ProjectsTableProps {
  projects: Project[];
}

const ProjectsTable = ({ projects }: ProjectsTableProps) => {
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [feedbackProject, setFeedbackProject] = useState<Project | null>(null);
  const [feedbackText, setFeedbackText] = useState("");
  const [feedbackSent, setFeedbackSent] = useState(false);
  const modalRef = useRef<HTMLDivElement | null>(null);

  // 🧠 Handle closing modal (outside click + ESC)
  useEffect(() => {
    const handleClose = (event: MouseEvent | KeyboardEvent) => {
      if (event instanceof MouseEvent) {
        if (
          modalRef.current &&
          !modalRef.current.contains(event.target as Node)
        ) {
          setSelectedProject(null);
          setFeedbackProject(null);
        }
      } else if (event instanceof KeyboardEvent && event.key === "Escape") {
        setSelectedProject(null);
        setFeedbackProject(null);
      }
    };

    if (selectedProject || feedbackProject) {
      document.addEventListener("mousedown", handleClose);
      document.addEventListener("keydown", handleClose);
    } else {
      document.removeEventListener("mousedown", handleClose);
      document.removeEventListener("keydown", handleClose);
    }

    return () => {
      document.removeEventListener("mousedown", handleClose);
      document.removeEventListener("keydown", handleClose);
    };
  }, [selectedProject, feedbackProject]);

  const handleSubmitFeedback = (e: React.FormEvent) => {
    e.preventDefault();
    if (feedbackText.trim() === "") return;
    console.log(`Feedback for ${feedbackProject?.title}: ${feedbackText}`);
    setFeedbackSent(true);
    setTimeout(() => {
      setFeedbackSent(false);
      setFeedbackText("");
      setFeedbackProject(null);
    }, 2000);
  };

  return (
    <div className="overflow-x-auto bg-white rounded-lg shadow-md mb-6 relative">
      <table className="min-w-full divide-y divide-gray-200 text-sm">
        <thead className="bg-green-800 text-white">
          <tr>
            <th className="px-3 sm:px-4 py-2 text-left">Project Title</th>
            <th className="px-3 sm:px-4 py-2 text-left">Department</th>
            <th className="px-3 sm:px-4 py-2 text-left">Financial Year</th>
            <th className="px-3 sm:px-4 py-2 text-left">Ward</th>
            <th className="px-3 sm:px-4 py-2 text-left">Budget (KES)</th>
            <th className="px-3 sm:px-4 py-2 text-left">Status</th>
            <th className="px-3 sm:px-4 py-2 text-center">Description</th>
            <th className="px-3 sm:px-4 py-2 text-center">Feedback</th>
          </tr>
        </thead>

        <tbody className="divide-y divide-gray-100">
          {projects.map((p) => (
            <tr key={p.id} className="hover:bg-gray-50 transition">
              <td className="px-3 sm:px-4 py-2 font-medium">{p.title}</td>
              <td className="px-3 sm:px-4 py-2">{p.department}</td>
              <td className="px-3 sm:px-4 py-2">{p.financialYear}</td>
              <td className="px-3 sm:px-4 py-2">{p.ward}</td>
              <td className="px-3 sm:px-4 py-2">{p.budget.toLocaleString()}</td>
              <td className="px-3 sm:px-4 py-2">
                <span
                  className={`px-2 py-1 rounded-full text-xs font-medium ${
                    p.status === "Completed"
                      ? "bg-green-100 text-green-700"
                      : p.status === "Ongoing"
                      ? "bg-blue-100 text-blue-700"
                      : p.status === "Pending"
                      ? "bg-yellow-100 text-yellow-700"
                      : "bg-gray-100 text-gray-700"
                  }`}
                >
                  {p.status}
                </span>
              </td>
              <td className="px-3 sm:px-4 py-2 text-center">
                <button
                  onClick={() => setSelectedProject(p)}
                  className="text-blue-700 hover:underline"
                >
                  View
                </button>
              </td>
              <td className="px-3 sm:px-4 py-2 text-center">
                <button
                  onClick={() => setFeedbackProject(p)}
                  className="text-green-700 hover:underline"
                >
                  Feedback
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Description Modal */}
      {selectedProject && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50 p-4">
          <div
            ref={modalRef}
            className="bg-white rounded-lg shadow-lg max-w-md w-full p-6 relative"
          >
            <button
              onClick={() => setSelectedProject(null)}
              className="absolute top-2 right-3 text-gray-500 hover:text-black text-lg"
            >
              ×
            </button>

            <h2 className="text-lg font-bold text-green-700 mb-3">
              {selectedProject.title}
            </h2>

            <div className="space-y-1 text-sm text-gray-600 mb-4">
              <p>
                <strong>Department:</strong> {selectedProject.department}
              </p>
              <p>
                <strong>Financial Year:</strong>{" "}
                {selectedProject.financialYear}
              </p>
              <p>
                <strong>Ward:</strong> {selectedProject.ward}
              </p>
              <p>
                <strong>Contractor:</strong> {selectedProject.contractor}
              </p>
              <p>
                <strong>Budget:</strong> KES{" "}
                {selectedProject.budget.toLocaleString()}
              </p>
              <p>
                <strong>Status:</strong> {selectedProject.status}
              </p>
            </div>

            <p className="text-gray-700 text-sm leading-relaxed border-t pt-2">
              {selectedProject.description}
            </p>
          </div>
        </div>
      )}

      {/* Feedback Modal */}
      {feedbackProject && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50 p-4">
          <div
            ref={modalRef}
            className="bg-white rounded-lg shadow-lg max-w-md w-full p-6 relative"
          >
            <button
              onClick={() => setFeedbackProject(null)}
              className="absolute top-2 right-3 text-gray-500 hover:text-black text-lg"
            >
              ×
            </button>

            <h2 className="text-lg font-bold text-green-700 mb-3">
              Feedback for {feedbackProject.title}
            </h2>

            {feedbackSent ? (
              <p className="text-green-600 font-medium text-center">
                ✅ Feedback submitted successfully!
              </p>
            ) : (
              <form onSubmit={handleSubmitFeedback}>
                <textarea
                  value={feedbackText}
                  onChange={(e) => setFeedbackText(e.target.value)}
                  placeholder="Write your feedback..."
                  className="w-full border border-gray-300 rounded-md p-2 text-sm focus:ring-2 focus:ring-green-500"
                  rows={4}
                ></textarea>
                <button
                  type="submit"
                  className="mt-3 w-full bg-green-700 text-white py-2 rounded-md hover:bg-green-800"
                >
                  Submit Feedback
                </button>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default ProjectsTable;
