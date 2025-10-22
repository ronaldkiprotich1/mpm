import { useEffect, useState } from "react";
import axios from "axios";

interface Stats {
  total_projects: number;
  completed: number;
  ongoing: number;
  pending: number;
  not_started: number;
  total_budget: string;
}

const StatusCards = () => {
  const [stats, setStats] = useState<Stats | null>(null);

  useEffect(() => {
    axios
      .get("http://192.168.100.149:8000/projects/statistics/")
      .then((res) => setStats(res.data))
      .catch((err) => console.error("Error fetching statistics:", err));
  }, []);

  if (!stats)
    return (
      <p className="text-center text-gray-600 mt-6">Loading statistics...</p>
    );

  return (
    <div className="grid grid-cols-5 gap-4 mb-6">
      <div className="bg-green-600 text-white text-center p-4 rounded-xl">
        <h2 className="text-3xl font-bold">{stats.completed}</h2>
        <p>Completed</p>
      </div>

      <div className="bg-blue-600 text-white text-center p-4 rounded-xl">
        <h2 className="text-3xl font-bold">{stats.ongoing}</h2>
        <p>Ongoing</p>
      </div>

      <div className="bg-yellow-500 text-white text-center p-4 rounded-xl">
        <h2 className="text-3xl font-bold">{stats.pending}</h2>
        <p>Pending</p>
      </div>

      <div className="bg-gray-600 text-white text-center p-4 rounded-xl">
        <h2 className="text-3xl font-bold">{stats.not_started}</h2>
        <p>Not Started</p>
      </div>

      <div className="bg-white border text-center p-4 rounded-xl shadow">
        <h2 className="text-3xl font-bold text-blue-600">
          {stats.total_projects}
        </h2>
        <p>Total Projects</p>
        <p className="text-green-600 mt-2 font-semibold">
          KES {parseFloat(stats.total_budget).toLocaleString()}
        </p>
      </div>
    </div>
  );
};

export default StatusCards;
