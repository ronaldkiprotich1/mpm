import React, { useEffect, useState } from "react";
import TabsMenu from "../components/TabsMenu";
import { Project } from "../types/Project";

const API_BASE_URL = "http://127.0.0.1:8000";

const PerYear: React.FC = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [selectedYear, setSelectedYear] = useState<string>("");
  const [years, setYears] = useState<string[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [summary, setSummary] = useState<{ count: number; totalBudget: number }>({
    count: 0,
    totalBudget: 0,
  });

  // ✅ Fetch all years and all projects by default
  useEffect(() => {
    const fetchAllProjects = async () => {
      try {
        setLoading(true);
        const res = await fetch(`${API_BASE_URL}/projects/by_financial_year/`);
        const data = await res.json();

        const allProjects = data.flatMap((item: any) => item.projects);
        const allYears = data.map((item: any) => item.financial_year.year);

        setProjects(allProjects);
        setYears(allYears);
        setSummary({
          count: allProjects.length,
          totalBudget: allProjects.reduce(
            (sum: number, p: Project) => sum + Number(p.budget || 0),
            0
          ),
        });
      } catch {
        setError("Failed to load projects.");
      } finally {
        setLoading(false);
      }
    };

    fetchAllProjects();
  }, []);

  // ✅ Fetch projects when year changes
  useEffect(() => {
    if (!selectedYear) return;

    const fetchByYear = async () => {
      try {
        setLoading(true);
        setProjects([]); // Clear old projects before fetching
        
        const res = await fetch(
          `${API_BASE_URL}/projects/by_financial_year/?year=${selectedYear}`
        );
        const data = await res.json();

        console.log("API Response for year:", selectedYear, data); // Debug log

        if (Array.isArray(data) && data.length > 0) {
          const yearData = data[0];
          const fetchedProjects = yearData.projects || [];
          
          console.log("Fetched projects:", fetchedProjects); // Debug log
          
          // ✅ Additional client-side filtering to ensure only selected year projects
          const filteredProjects = fetchedProjects.filter(
            (p: Project) => p.financial_year_name === selectedYear
          );
          
          console.log("Filtered projects:", filteredProjects); // Debug log
          
          setProjects(filteredProjects);
          setSummary({
            count: filteredProjects.length,
            totalBudget: filteredProjects.reduce(
              (sum: number, p: Project) => sum + Number(p.budget || 0),
              0
            ),
          });
        } else {
          setProjects([]);
          setSummary({ count: 0, totalBudget: 0 });
        }
      } catch (err) {
        console.error("Error fetching projects:", err);
        setError("Failed to fetch selected year's projects.");
      } finally {
        setLoading(false);
      }
    };

    fetchByYear();
  }, [selectedYear]);

  // ✅ Count projects by status using correct status values
  const completed = projects.filter((p) => p.status === "completed").length;
  const ongoing = projects.filter((p) => p.status === "in_progress" || p.status === "ongoing").length;
  const pending = projects.filter((p) => p.status === "pending").length;
  const notStarted = projects.filter((p) => p.status === "not_started").length;

  return (
    <div className="min-h-screen bg-gray-50">
      <TabsMenu onFilterChange={() => {}} />

      <div className="max-w-7xl mx-auto px-6 py-8">
        <h2 className="text-2xl font-bold mb-6 text-gray-800 text-center uppercase">
          Projects Per Financial Year
        </h2>

        {/* ✅ Year Dropdown */}
        <div className="flex justify-center mb-6">
          <select
            className="border border-gray-400 rounded-lg px-4 py-2 w-64 text-center font-medium shadow-sm focus:ring-2 focus:ring-green-600"
            value={selectedYear}
            onChange={(e) => {
              const year = e.target.value;
              setSelectedYear(year);

              // Reset to all years if cleared
              if (!year) {
                setLoading(true);
                fetch(`${API_BASE_URL}/projects/by_financial_year/`)
                  .then((res) => res.json())
                  .then((data) => {
                    const allProjects = data.flatMap((item: any) => item.projects);
                    setProjects(allProjects);
                    setSummary({
                      count: allProjects.length,
                      totalBudget: allProjects.reduce(
                        (sum: number, p: Project) => sum + Number(p.budget || 0),
                        0
                      ),
                    });
                  })
                  .finally(() => setLoading(false));
              }
            }}
          >
            <option value="">All Financial Years</option>
            {years.map((year) => (
              <option key={year} value={year}>
                {year}
              </option>
            ))}
          </select>
        </div>

        {/* ✅ Status Cards */}
        {!loading && (
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-6 text-center">
            <div className="bg-green-600 text-white py-4 rounded-lg shadow">
              <h3 className="text-2xl font-bold">{completed}</h3>
              <p className="text-sm">Completed</p>
            </div>
            <div className="bg-blue-600 text-white py-4 rounded-lg shadow">
              <h3 className="text-2xl font-bold">{ongoing}</h3>
              <p className="text-sm">Ongoing</p>
            </div>
            <div className="bg-yellow-500 text-white py-4 rounded-lg shadow">
              <h3 className="text-2xl font-bold">{pending}</h3>
              <p className="text-sm">Pending</p>
            </div>
            <div className="bg-gray-700 text-white py-4 rounded-lg shadow">
              <h3 className="text-2xl font-bold">{notStarted}</h3>
              <p className="text-sm">Not Started</p>
            </div>
            <div className="bg-white text-green-700 py-4 rounded-lg shadow border">
              <h3 className="text-2xl font-bold">{summary.count}</h3>
              <p className="text-sm font-semibold">Total Projects</p>
              <p className="text-green-700 font-semibold mt-1">
                KES {summary.totalBudget.toLocaleString()}
              </p>
            </div>
          </div>
        )}

        {/* ✅ Table */}
        <div className="overflow-x-auto shadow-md rounded-lg border border-gray-200">
          <table className="min-w-full text-sm text-left border-collapse">
            <thead className="bg-green-900 text-white">
              <tr>
                <th className="px-4 py-3 font-semibold">Department</th>
                <th className="px-4 py-3 font-semibold">Financial Year</th>
                <th className="px-4 py-3 font-semibold">Ward</th>
                <th className="px-4 py-3 font-semibold">Start Date</th>
                <th className="px-4 py-3 font-semibold">End Date</th>
                <th className="px-4 py-3 font-semibold">Expected Completion</th>
                <th className="px-4 py-3 font-semibold">Budget (KES)</th>
                <th className="px-4 py-3 font-semibold">Status</th>
                <th className="px-4 py-3 font-semibold">Description</th>
                <th className="px-4 py-3 font-semibold text-center">Feedback</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-100">
              {loading ? (
                <tr>
                  <td colSpan={10} className="text-center py-5 text-gray-500">
                    Loading projects...
                  </td>
                </tr>
              ) : projects.length > 0 ? (
                projects.map((project) => (
                  <tr key={project.id} className="hover:bg-green-50 transition">
                    <td className="px-4 py-3">{project.department_name}</td>
                    <td className="px-4 py-3">{project.financial_year_name}</td>
                    <td className="px-4 py-3">{project.ward_name}</td>
                    <td className="px-4 py-3">{project.start_date ?? "—"}</td>
                    <td className="px-4 py-3">{project.actual_completion_date ?? "—"}</td>
                    <td className="px-4 py-3">{project.expected_completion_date ?? "—"}</td>
                    <td className="px-4 py-3">
                      KES {Number(project.budget).toLocaleString()}
                    </td>
                    <td
                      className={`px-4 py-3 font-semibold ${
                        project.status === "completed"
                          ? "text-green-700"
                          : project.status === "in_progress" || project.status === "ongoing"
                          ? "text-blue-700"
                          : project.status === "pending"
                          ? "text-yellow-700"
                          : "text-gray-700"
                      }`}
                    >
                      {project.status_display || project.status.replace(/_/g, " ").replace(/\b\w/g, l => l.toUpperCase())}
                    </td>
                    <td className="px-4 py-3 text-blue-600 underline cursor-pointer">
                      View
                    </td>
                    <td className="px-4 py-3 text-center">
                      <button className="text-green-600 font-medium hover:underline">
                        Feedback
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={10} className="text-center py-5 text-gray-500">
                    No projects found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default PerYear;