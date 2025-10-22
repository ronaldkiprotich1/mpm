import { useState } from "react";
import { Project } from "../types/Project";

interface ProjectsTableProps {
  projects: Project[];
}

const ProjectsTable: React.FC<ProjectsTableProps> = ({ projects }) => {
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);

  // Helper: format dates nicely
  const formatDate = (date?: string | null) => {
    if (!date) return "—";
    const d = new Date(date);
    return isNaN(d.getTime())
      ? "—"
      : d.toLocaleDateString("en-KE", {
          year: "numeric",
          month: "short",
          day: "numeric",
        });
  };

  const handleView = (project: Project) => setSelectedProject(project);
  const handleClose = () => setSelectedProject(null);

  return (
    <div className="overflow-x-auto bg-white rounded-lg shadow">
      <table className="min-w-full text-sm text-left">
        <thead className="bg-green-800 text-white">
          <tr>
            <th className="px-4 py-2">Department</th>
            <th className="px-4 py-2">Financial Year</th>
            <th className="px-4 py-2">Ward</th>
            <th className="px-4 py-2">Start Date</th>
            <th className="px-4 py-2">End Date</th>
            <th className="px-4 py-2">Expected Completion</th>
            <th className="px-4 py-2">Budget (KES)</th>
            <th className="px-4 py-2">Status</th>
            <th className="px-4 py-2">Description</th>
            <th className="px-4 py-2">Feedback</th>
          </tr>
        </thead>
        <tbody>
          {projects.map((project) => (
            <tr key={project.id} className="border-b hover:bg-gray-50">
              <td className="px-4 py-2">{project.department_name}</td>
              <td className="px-4 py-2">{project.financial_year_name}</td>
              <td className="px-4 py-2">{project.ward_name}</td>
              <td className="px-4 py-2">{formatDate(project.start_date)}</td>
              <td className="px-4 py-2">{formatDate(project.actual_completion_date)}</td>
              <td className="px-4 py-2">{formatDate(project.expected_completion_date)}</td>
              <td className="px-4 py-2">
                {project.budget !== undefined && project.budget!== null
                  ? `KES ${Number(project.budget).toLocaleString()}`
                  : "—"}
              </td>
              <td className="px-4 py-2 capitalize">{project.status}</td>
              <td className="px-4 py-2">
                <button
                  onClick={() => handleView(project)}
                  className="text-blue-600 hover:underline"
                >
                  View
                </button>
              </td>
              <td className="px-4 py-2">
                <a
                  href={`mailto:projects@merucounty.go.ke?subject=Feedback on ${project.title}`}
                  className="text-green-700 hover:underline"
                >
                  Feedback
                </a>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Modal for project details */}
      {selectedProject && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white rounded-lg shadow-lg p-6 w-96 relative">
            <h2 className="text-lg font-semibold text-green-800 mb-2">
              {selectedProject.title}
            </h2>
            <p className="text-sm text-gray-700 mb-3">
              {selectedProject.description}
            </p>

            <div className="text-sm text-gray-600 space-y-1">
              <p><strong>Department:</strong> {selectedProject.department_name}</p>
              <p><strong>Ward:</strong> {selectedProject.ward_name}</p>
              <p><strong>Financial Year:</strong> {selectedProject.financial_year_name}</p>
              <p><strong>Start Date:</strong> {formatDate(selectedProject.start_date)}</p>
              <p><strong>Expected Completion:</strong> {formatDate(selectedProject.expected_completion_date)}</p>
              <p><strong>Actual Completion:</strong> {formatDate(selectedProject.actual_completion_date)}</p>
              <p><strong>Contractor:</strong> {selectedProject.contractor_name || "—"}</p>
              <p>
                <strong>Budget:</strong>{" "}
                {selectedProject.budget !== undefined && selectedProject.budget !== null
                  ? `KES ${Number(selectedProject.budget).toLocaleString()}`
                  : "—"}
              </p>
            </div>

            <button
              onClick={handleClose}
              className="mt-4 w-full bg-green-700 text-white py-2 rounded-lg hover:bg-green-800"
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
