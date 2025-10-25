import { useEffect, useState } from "react";
import axios from "axios";
import TabsMenu from "../components/TabsMenu";
import StatusCards from "../components/StatusCards";
import ProjectsTable from "../components/ProjectsTable";
import { Project } from "../types/Project";
import FeedbackModal from "../components/FeedbackModal";

const Home = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [filtered, setFiltered] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [openFeedback, setOpenFeedback] = useState(false);
  const [selectedProject, setSelectedProject] = useState<string | null>(null);

  const BASE_URL = "http://10.10.212.245:8000/projects/";

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const res = await axios.get(BASE_URL);
        const data = res.data.results || res.data;
        setProjects(data);
        setFiltered(data);
      } catch (err) {
        console.error("Error fetching projects:", err);
        setError("Failed to load projects. Please check backend connection.");
      } finally {
        setLoading(false);
      }
    };
    fetchProjects();
  }, []);

 
  const handleFilterChange = async (filters: {
    financial_year_name?: string;
    department_name?: string;
    ward_name?: string;
    subcounty_name?: string;
    status?: string;
  }) => {
    try {
      let url = BASE_URL;
      const params = [];

      if (filters.department_name)
        params.push(`department_name=${encodeURIComponent(filters.department_name)}`);
      if (filters.ward_name)
        params.push(`ward_name=${encodeURIComponent(filters.ward_name)}`);
      if (filters.subcounty_name)
        params.push(`subcounty_name=${encodeURIComponent(filters.subcounty_name)}`);
      if (filters.financial_year_name)
        params.push(`financial_year_name=${encodeURIComponent(filters.financial_year_name)}`);
      if (filters.status)
        params.push(`status=${encodeURIComponent(filters.status)}`);

      if (params.length > 0) url += `?${params.join("&")}`;

      const response = await axios.get(url);
      const data = response.data.results || response.data;
      setFiltered(data);
    } catch (err) {
      console.error("Filter fetch error:", err);
      setError("Could not filter projects. Try again.");
    }
  };

  useEffect(() => {
    const handleOpenFeedback = (event: any) => {
      setSelectedProject(event.detail || null);
      setOpenFeedback(true);
    };

    window.addEventListener("openFeedback", handleOpenFeedback);
    return () => window.removeEventListener("openFeedback", handleOpenFeedback);
  }, []);

  if (loading) return <p className="text-center mt-10 text-gray-600">Loading...</p>;
  if (error) return <p className="text-center mt-10 text-red-600">{error}</p>;

  return (
    <div className="min-h-screen bg-gray-50 relative">
      <TabsMenu onFilterChange={handleFilterChange} />

      <div className="px-4 sm:px-8 py-6">
        <StatusCards />
        <ProjectsTable projects={filtered} />
      </div>

  
      <FeedbackModal
        isOpen={openFeedback}
        onClose={() => setOpenFeedback(false)}
        projectTitle={selectedProject}
      />
    </div>
  );
};

export default Home;
