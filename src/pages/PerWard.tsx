import React from "react";
import TabsMenu from "../components/TabsMenu";
import { projectsData } from "../data/projectsData";
import { Project } from "../types/Project";

const PerWard: React.FC = () => {
 
  const wards = Array.from(
    new Set(projectsData.map((p: Project) => p.ward_name))
  ).sort();

  return (
    <div className="min-h-screen bg-gray-50">
      <TabsMenu onFilterChange={() => {}} />

      <div className="max-w-6xl mx-auto px-6 py-8">
        <h2 className="text-2xl font-bold mb-6 text-gray-800 border-b pb-2">
          Projects per Ward
        </h2>

        {wards.map((ward) => {
          const wardProjects = projectsData.filter(
            (p: Project) => p.ward_name === ward
          );

          if (wardProjects.length === 0) return null;

          return (
            <div key={ward} className="mb-8">
              <h3 className="text-lg font-semibold text-blue-700 mb-3 border-l-4 border-blue-600 pl-3">
                {ward}
              </h3>

              <ul className="list-disc pl-8 space-y-1 text-gray-700">
                {wardProjects.map((project: Project) => (
                  <li key={project.id} className="leading-relaxed">
                    <span className="font-medium">{project.title}</span> —{" "}
                    <span className="italic text-gray-500">{project.status}</span>
                  </li>
                ))}
              </ul>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default PerWard;
