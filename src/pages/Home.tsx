import { useEffect, useState } from "react";
import { axiosClient } from "../api/axiosClient";
import TabsMenu from "../components/TabsMenu";
import StatusCards from "../components/StatusCards";
import ProjectsTable from "../components/ProjectsTable";
import FeedbackModal from "../components/FeedbackModal";
import { Project } from "../types/Project";

const Home = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [filtered, setFiltered] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [openFeedback, setOpenFeedback] = useState(false);
  const [feedbackProjectTitle, setFeedbackProjectTitle] = useState<string | null>(null);

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const res = await axiosClient.get("projects/");
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
      const params = new URLSearchParams();
      if (filters.department_name) params.append("department_name", filters.department_name);
      if (filters.ward_name) params.append("ward_name", filters.ward_name);
      if (filters.subcounty_name) params.append("subcounty_name", filters.subcounty_name);
      if (filters.financial_year_name) params.append("financial_year_name", filters.financial_year_name);
      if (filters.status) params.append("status", filters.status);
      const url = params.toString() ? `projects/?${params.toString()}` : "projects/";
      const response = await axiosClient.get(url);
      setFiltered(response.data.results || response.data);
    } catch (err) {
      console.error("Filter fetch error:", err);
      setError("Could not filter projects. Try again.");
    }
  };

  // Listen for openFeedback event fired from AllProjects
  useEffect(() => {
    const handler = (event: CustomEvent) => {
      setFeedbackProjectTitle(event.detail || null);
      setOpenFeedback(true);
    };
    window.addEventListener("openFeedback", handler as EventListener);
    return () => window.removeEventListener("openFeedback", handler as EventListener);
  }, []);

  if (loading)
    return <p className="text-center mt-10 text-gray-500 animate-pulse">Loading projects...</p>;
  if (error)
    return <p className="text-center mt-10 text-red-600 font-medium">{error}</p>;

  return (
    <div className="min-h-screen bg-gray-50">
      <TabsMenu onFilterChange={handleFilterChange} />
      <div className="px-4 sm:px-8 py-6">
        <StatusCards />
        <ProjectsTable projects={filtered} />
      </div>

      <FeedbackModal
        isOpen={openFeedback}
        onClose={() => setOpenFeedback(false)}
        projectTitle={feedbackProjectTitle}
        onSubmitted={() => {
          // After submitting — reopen the project detail modal
          // so user sees their feedback + can see replies
          if (feedbackProjectTitle) {
            window.dispatchEvent(
              new CustomEvent("reopenProjectModal", {
                detail: feedbackProjectTitle,
              })
            );
          }
        }}
      />
    </div>
  );
};

export default Home;