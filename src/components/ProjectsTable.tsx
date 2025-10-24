import React, { useState } from "react";
import { Project } from "../types/Project";

interface ProjectsTableProps {
  projects: Project[];
}

const ProjectsTable: React.FC<ProjectsTableProps> = ({ projects }) => {
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);

  return (
    <div className="overflow-x-auto bg-white rounded-lg shadow-md">
      <table className="min-w-full text-sm text-left border-collapse">
        <thead className="bg-green-800 text-white">
          <tr>
            <th className="py-3 px-4 font-semibold">Title</th>
            <th className="py-3 px-4 font-semibold">Department</th>
            <th className="py-3 px-4 font-semibold">Financial Year</th>
            <th className="py-3 px-4 font-semibold">Subcounty</th>
            <th className="py-3 px-4 font-semibold">Ward</th>
            <th className="py-3 px-4 font-semibold">Budget (KES)</th>
            <th className="py-3 px-4 font-semibold">Status</th>
            <th className="py-3 px-4 font-semibold">Description</th>
            <th className="py-3 px-4 font-semibold">Feedback</th>
          </tr>
        </thead>

        <tbody>
          {projects.length > 0 ? (
            projects.map((project) => (
              <tr key={project.id} className="border-b hover:bg-gray-50">
                <td className="py-3 px-4">{project.title}</td>
                <td className="py-3 px-4">{project.department_name}</td>
                <td className="py-3 px-4">{project.financial_year_name}</td>
                <td className="py-3 px-4">{project.subcounty_name || "-"}</td>
                <td className="py-3 px-4">{project.ward_name}</td>
                <td className="py-3 px-4">
                  {project.budget
                    ? ` ${Number(project.budget).toLocaleString()}`
                    : "-"}
                </td>
                <td className="py-3 px-4">
                  <span
                    className={`px-2 py-1 rounded text-xs font-semibold ${
                      project.status === "completed"
                        ? "bg-green-100 text-green-700"
                        : project.status === "ongoing"
                        ? "bg-blue-100 text-blue-700"
                        : project.status === "pending"
                        ? "bg-yellow-100 text-yellow-700"
                        : "bg-gray-100 text-gray-700"
                    }`}
                  >
                    {project.status_display || project.status}
                  </span>
                </td>
                <td className="py-3 px-4">
                  <button
                    onClick={() => setSelectedProject(project)}
                    className="text-blue-600 hover:underline"
                  >
                    View
                  </button>
                </td>
                <td className="py-3 px-4">
                  <button className="text-green-600 hover:underline">
                    Feedback
                  </button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={9} className="text-center py-4 text-gray-500">
                No projects found.
              </td>
            </tr>
          )}
        </tbody>
      </table>

      {/* Popup Modal */}
      {selectedProject && (
        <div
          className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50"
          onClick={() => setSelectedProject(null)}
        >
          <div
            className="bg-white rounded-lg shadow-lg w-full max-w-md p-6 animate-fadeIn relative"
            onClick={(e) => e.stopPropagation()}
          >
            <h2 className="text-lg font-semibold mb-3 text-green-800">
              {selectedProject.title}
            </h2>
            <div className="space-y-2 text-sm text-gray-700">
              <p>
                <strong>Description:</strong>{" "}
                {selectedProject.description || "No description available."}
              </p>
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
            </div>
            <div className="flex justify-end mt-4">
              <button
                onClick={() => setSelectedProject(null)}
                className="bg-green-700 text-white px-4 py-2 rounded hover:bg-green-800"
              >
                Close
              </button>
            </div>

            <style>{`
              @keyframes fadeIn {
                from { opacity: 0; transform: translateY(-5px); }
                to { opacity: 1; transform: translateY(0); }
              }
              .animate-fadeIn {
                animation: fadeIn 0.3s ease-in-out;
              }
            `}</style>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProjectsTable;
