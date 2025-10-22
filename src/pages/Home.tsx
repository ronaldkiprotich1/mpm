import { useEffect, useState } from "react";
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

  const BASE_URL = "http://192.168.100.149:8000/projects/";

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const response = await axios.get(BASE_URL);
        const data = response.data.results || response.data;
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
    year: string;
    department: string;
    ward: string;
    status: string;
  }) => {
    try {
      let url = BASE_URL;

      if (filters.department)
        url = `${BASE_URL}by_department/?department=${filters.department}`;
      else if (filters.year)
        url = `${BASE_URL}by_financial_year/?year=${filters.year}`;
      else if (filters.status)
        url = `${BASE_URL}by_status/?status=${filters.status}`;
      else if (filters.ward)
        url = `${BASE_URL}by_ward/?ward=${filters.ward}`;

      const response = await axios.get(url);
      const data =
        response.data.results ||
        response.data.projects ||
        response.data[0]?.projects ||
        response.data;
      setFiltered(data);
    } catch (err) {
      console.error("Filter fetch error:", err);
      setError("Could not filter projects. Try again.");
    }
  };

  if (loading)
    return <p className="text-center mt-10 text-gray-600">Loading...</p>;
  if (error)
    return <p className="text-center mt-10 text-red-600">{error}</p>;

  return (
    <div className="min-h-screen bg-gray-50">
      <TabsMenu onFilterChange={handleFilterChange} />
      <div className="px-4 sm:px-8 py-6">
        <StatusCards />
        <ProjectsTable projects={filtered} />
      </div>
    </div>
  );
};

export default Home;
