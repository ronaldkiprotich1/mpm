import { useState, useEffect } from "react";
import axios from "axios";
import TabsMenu from "../components/TabsMenu";
import StatusCards from "../components/StatusCards";
import ProjectsTable from "../components/ProjectsTable";
import { Project } from "../types/Project";

const Home = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [filtered, setFiltered] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // ✅ Your backend IP address
  const BASE_URL = "http://192.168.100.149:8000/projects/?page_size=10"; // fetch 10 projects

  // ✅ Fetch projects from Django backend
  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const response = await axios.get(BASE_URL);
        const data = response.data.results || response.data; // handle pagination
        setProjects(data);
        setFiltered(data);
      } catch (err) {
        console.error("Error fetching projects:", err);
        setError("Failed to load project data. Please check your backend.");
      } finally {
        setLoading(false);
      }
    };
    fetchProjects();
  }, []);

  // ✅ Filtering logic
  const handleFilterChange = (filters: {
    year: string;
    department: string;
    ward: string;
    status: string;
  }) => {
    const newList = projects.filter((p) => {
      return (
        (!filters.year || p.financialYear === filters.year) &&
        (!filters.department || p.department === filters.department) &&
        (!filters.ward || p.ward === filters.ward) &&
        (!filters.status || p.status === filters.status)
      );
    });
    setFiltered(newList);
  };

  if (loading) return <p className="text-center mt-10 text-gray-600">Loading projects...</p>;
  if (error) return <p className="text-center mt-10 text-red-600">{error}</p>;

  return (
    <div className="min-h-screen bg-gray-50">
      <TabsMenu onFilterChange={handleFilterChange} />
      <div className="px-4 sm:px-8 py-6">
        <StatusCards projects={filtered} />
        <ProjectsTable projects={filtered} />
      </div>
    </div>
  );
};

export default Home;
