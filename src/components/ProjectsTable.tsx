import React, { useState } from "react";
import { Project } from "../types/Project";

interface ProjectsTableProps {
  projects: Project[];
}

const ProjectsTable: React.FC<ProjectsTableProps> = ({ projects }) => {
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  if (!projects || projects.length === 0)
    return (
      <p className="text-center text-gray-500 mt-6">
        No projects found for the selected filters.
      </p>
    );

  // Calculate pagination
  const totalPages = Math.ceil(projects.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentProjects = projects.slice(startIndex, endIndex);

  const handleFeedbackClick = (title: string) => {
    const event = new CustomEvent("openFeedback", { detail: title });
    window.dispatchEvent(event);
  };

  const handleViewClick = (project: Project) => {
    setSelectedProject(project);
  };

  const closeModal = () => {
    setSelectedProject(null);
  };

  const goToPage = (page: number) => {
    setCurrentPage(page);
  };

  const handleItemsPerPageChange = (value: number) => {
    setItemsPerPage(value);
    setCurrentPage(1); // Reset to first page when changing items per page
  };

  return (
    <div>
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
              <tr
                key={project.id}
                className="border-t hover:bg-gray-50 transition"
              >
                <td className="p-3">{project.title}</td>
                <td className="p-3">{project.department_name}</td>
                <td className="p-3">{project.financial_year_name}</td>
                <td className="p-3">{project.subcounty_name}</td>
                <td className="p-3">{project.ward_name}</td>
                <td className="p-3">
                  <span
                    className={`px-2 py-1 rounded text-xs font-semibold ${
                      project.status === "completed"
                        ? "bg-green-100 text-green-700"
                        : project.status === "ongoing"
                        ? "bg-blue-100 text-blue-700"
                        : project.status === "pending"
                        ? "bg-yellow-100 text-yellow-700"
                        : project.status === "under_procurement"
                        ? "bg-purple-100 text-purple-700"
                        : "bg-gray-100 text-gray-700"
                    }`}
                  >
                    {project.status?.replace("_", " ") || "N/A"}
                  </span>
                </td>

                <td className="p-3">
                  <button
                    onClick={() => handleViewClick(project)}
                    className="text-blue-600 hover:underline"
                  >
                    View
                  </button>
                </td>

                <td className="p-3">
                  <button
                    onClick={() => handleFeedbackClick(project.title)}
                    className="text-green-700 hover:underline"
                  >
                    Feedback
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination Controls */}
      <div className="flex justify-between items-center mt-4">
        <button
          onClick={() => goToPage(currentPage - 1)}
          disabled={currentPage === 1}
          className={`px-4 py-2 rounded font-medium ${
            currentPage === 1
              ? "bg-gray-300 text-gray-500 cursor-not-allowed"
              : "bg-green-700 text-white hover:bg-green-800"
          }`}
        >
          Previous
        </button>

        <div className="flex gap-2">
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
            <button
              key={page}
              onClick={() => goToPage(page)}
              className={`px-3 py-2 rounded font-medium ${
                currentPage === page
                  ? "bg-green-700 text-white"
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
          className={`px-4 py-2 rounded font-medium ${
            currentPage === totalPages
              ? "bg-gray-300 text-gray-500 cursor-not-allowed"
              : "bg-green-700 text-white hover:bg-green-800"
          }`}
        >
          Next
        </button>
      </div>

      {/* Modal for Project Details */}
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
              <p>
                <strong>Description:</strong>
              </p>
              <p className="text-gray-600 whitespace-pre-wrap">
                {selectedProject.description || "No description provided."}
              </p>
            </div>
            <button
              onClick={closeModal}
              className="w-full mt-6 bg-green-700 hover:bg-green-800 text-white font-semibold py-3 rounded-lg transition"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProjectsTable;