import React, { useState } from "react";
import { projectsData } from "../data/projectsData";
import { Project } from "../types/Project";

const AllProjects: React.FC = () => {
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);

  const handleViewDetails = (project: Project) => {
    setSelectedProject(project);
  };

  return (
    <div className="px-4 py-6 md:px-8 lg:px-12">
      <h2 className="text-2xl font-bold text-green-800 mb-4 text-center uppercase tracking-wide">
        All County Projects
      </h2>

      <div className="overflow-x-auto shadow-lg rounded-md border border-gray-200">
        <table className="min-w-full border-collapse">
          <thead className="bg-blue-600 text-white">
            <tr>
              <th className="px-4 py-3 text-left text-sm font-semibold border-b border-blue-500">
                #
              </th>
              <th className="px-4 py-3 text-left text-sm font-semibold border-b border-blue-500">
                Project Title
              </th>
              <th className="px-4 py-3 text-left text-sm font-semibold border-b border-blue-500">
                Department
              </th>
              <th className="px-4 py-3 text-left text-sm font-semibold border-b border-blue-500">
                Ward
              </th>
              <th className="px-4 py-3 text-left text-sm font-semibold border-b border-blue-500">
                Financial Year
              </th>
              <th className="px-4 py-3 text-left text-sm font-semibold border-b border-blue-500">
                Status
              </th>
              <th className="px-4 py-3 text-left text-sm font-semibold border-b border-blue-500">
                Budget (KES)
              </th>
              <th className="px-4 py-3 text-center text-sm font-semibold border-b border-blue-500">
                Action
              </th>
            </tr>
          </thead>

          <tbody className="bg-white divide-y divide-gray-200">
            {(projectsData as Project[]).map((project, index) => (
              <tr
                key={project.id}
                className={`hover:bg-green-50 transition duration-150 ${
                  index % 2 === 0 ? "bg-gray-50" : "bg-white"
                }`}
              >
                <td className="px-4 py-3 text-sm font-medium text-gray-700">
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
                <td
                  className={`px-4 py-3 text-sm font-semibold ${
                    project.status === "Completed"
                      ? "text-green-700"
                      : project.status === "Ongoing"
                      ? "text-yellow-600"
                      : "text-red-600"
                  }`}
                >
                  {project.status}
                </td>
                <td className="px-4 py-3 text-sm text-gray-700">
                  {project.budget
                    ? Number(project.budget).toLocaleString()
                    : "—"}
                </td>
                <td className="px-4 py-3 text-center">
                  <button
                    onClick={() => handleViewDetails(project)}
                    className="bg-blue-600 text-white px-3 py-1 rounded-md text-xs hover:bg-green-700 transition duration-150"
                  >
                    View Details
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {selectedProject && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg w-[90%] md:w-[60%] shadow-2xl relative">
            <button
              className="absolute top-2 right-3 text-gray-500 hover:text-red-600 font-bold text-lg"
              onClick={() => setSelectedProject(null)}
            >
              ×
            </button>
            <h3 className="text-xl font-bold text-green-800 mb-3">
              {selectedProject.title}
            </h3>
            <p><strong>Department:</strong> {selectedProject.department_name}</p>
            <p><strong>Ward:</strong> {selectedProject.ward_name}</p>
            <p><strong>Financial Year:</strong> {selectedProject.financial_year_name}</p>
            <p><strong>Status:</strong> {selectedProject.status}</p>
            <p><strong>Contractor:</strong> {selectedProject.contractor_name ?? "—"}</p>
            <p>
              <strong>Budget:</strong> KES{" "}
              {selectedProject.budget
                ? Number(selectedProject.budget).toLocaleString()
                : "—"}
            </p>
            <p className="mt-3 text-gray-700 leading-relaxed">
              <strong>Description:</strong> {selectedProject.description}
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default AllProjects;
