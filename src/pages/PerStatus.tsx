import React from "react";
import TabsMenu from "../components/TabsMenu";
import { projectsData } from "../data/projectsData";
import { Project } from "../types/Project";

const PerStatus: React.FC = () => {
  const statuses = Array.from(
    new Set((projectsData as Project[]).map((p) => p.status))
  );

  return (
    <div className="min-h-screen bg-gray-50">
      <TabsMenu onFilterChange={() => {}} />

      <div className="max-w-6xl mx-auto px-6 py-8">
        <h2 className="text-2xl font-bold mb-6 text-gray-800 border-b pb-2">
          Projects per Status
        </h2>

        {statuses.map((status) => {
          const filtered = (projectsData as Project[]).filter(
            (p) => p.status === status
          );

          if (filtered.length === 0) return null;

          return (
            <div key={status} className="mb-8">
              <h3 className="text-lg font-semibold text-blue-700 mb-3 border-l-4 border-blue-600 pl-3">
                {status}
              </h3>

              <ul className="list-disc pl-8 space-y-1 text-gray-700">
                {filtered.map((p) => (
                  <li key={p.id}>
                    <span className="font-medium">{p.title}</span> —{" "}
                    {p.department_name}
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

export default PerStatus;
