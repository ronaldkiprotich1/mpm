import React from "react";
import { useParams, Link } from "react-router-dom";
import { projectsData } from "../data/projectsData";
import { Project } from "../types/Project";

const ProjectDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const project = (projectsData as Project[]).find(
    (p) => p.id.toString() === id
  );

  if (!project)
    return (
      <div className="text-center py-10">
        <p className="text-gray-500">Project not found</p>
        <Link to="/" className="text-blue-600 underline">
          Back to projects
        </Link>
      </div>
    );

  return (
    <div className="max-w-3xl mx-auto bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-2xl font-bold text-blue-700 mb-2">{project.title}</h2>
      <p className="text-gray-700 mb-4">{project.description}</p>

      <div className="grid grid-cols-2 gap-4 text-sm">
        <div><strong>Department:</strong> {project.department_name}</div>
        <div><strong>Ward:</strong> {project.ward_name}</div>
        <div><strong>Status:</strong> {project.status}</div>
        <div><strong>Financial Year:</strong> {project.financial_year_name}</div>
        <div>
          <strong>Budget:</strong>{" "}
          KES {project.budget ? Number(project.budget).toLocaleString() : "—"}
        </div>
        <div><strong>Contractor:</strong> {project.contractor_name ?? "—"}</div>
      </div>

      <div className="mt-6">
        <Link to="/" className="text-blue-600 hover:underline">
          ← Back to Projects
        </Link>
      </div>
    </div>
  );
};

export default ProjectDetails;
