import React from "react";
import { Project } from "../types/Project";

interface ProjectsTableProps {
  projects: Project[];
}

const ProjectsTable: React.FC<ProjectsTableProps> = ({ projects }) => {
  if (!projects || projects.length === 0)
    return (
      <p className="text-center text-gray-500 mt-6">
        No projects found for the selected filters.
      </p>
    );

  const handleFeedbackClick = (title: string) => {
    const event = new CustomEvent("openFeedback", { detail: title });
    window.dispatchEvent(event);
  };

  return (
    <div className="overflow-x-auto mt-6 shadow-md rounded-lg">
      <table className="min-w-full text-sm border-collapse border border-gray-200">
        <thead className="bg-green-800 text-white">
          <tr>
            <th className="p-3 text-left">Title</th>
            <th className="p-3 text-left">Department</th>
            <th className="p-3 text-left">Financial Year</th>
            <th className="p-3 text-left">Subcounty</th>
            <th className="p-3 text-left">Ward</th>
            <th className="p-3 text-left">Status</th>
            <th className="p-3 text-left">Feedback</th>
          </tr>
        </thead>
        <tbody>
          {projects.map((project) => (
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
  );
};

export default ProjectsTable;
