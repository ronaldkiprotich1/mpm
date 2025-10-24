import React from "react";
import { useParams, Link } from "react-router-dom";
import { projectsData } from "../data/projectsData";
import { Project } from "../types/Project";

const ProjectDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const project = (projectsData as Project[]).find((p) => p.id.toString() === id);

  if (!project)
    return (
      <div className="text-center py-10">
        <p className="text-gray-500">Project not found</p>
        <Link to="/" className="text-blue-600 underline">
          Back to projects
        </Link>
      </div>
    );

  const formatDate = (date?: string | null) =>
    date
      ? new Date(date).toLocaleDateString("en-KE", {
          year: "numeric",
          month: "short",
          day: "numeric",
        })
      : "—";

  return (
    <div className="max-w-lg mx-auto bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-2xl font-bold text-green-700 mb-3">{project.title}</h2>

      <div className="text-gray-700 text-sm space-y-1">
        <p>
          <strong>Start Date:</strong> {formatDate(project.start_date)}
        </p>
        <p>
          <strong>Expected Completion:</strong>{" "}
          {formatDate(project.expected_completion_date)}
        </p>
        <p>
          <strong>Actual Completion:</strong>{" "}
          {formatDate(project.actual_completion_date)}
        </p>
        <p>
          <strong>Description:</strong> {project.description || "—"}
        </p>
      </div>

      <Link
        to="/"
        className="block mt-5 text-blue-600 font-medium hover:underline"
      >
        ← Back to Projects
      </Link>
    </div>
  );
};

export default ProjectDetails;
