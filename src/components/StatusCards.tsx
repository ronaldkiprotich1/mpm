import { useEffect, useState } from "react";
import axios from "axios";

interface Stats {
  total_projects: number;
  completed: number;
  ongoing: number;
  pending: number;
  not_started: number;
  under_procurement?: number; // ✅ new field
  total_budget: string;
}

const StatusCards = () => {
  const [stats, setStats] = useState<Stats | null>(null);
  const BASE_URL = "http://192.168.100.149:8000/projects/statistics/";

  useEffect(() => {
    axios
      .get(BASE_URL)
      .then((res) => setStats(res.data))
      .catch((err) => console.error("Error fetching statistics:", err));
  }, []);

  if (!stats)
    return (
      <p className="text-center text-gray-600 mt-6">Loading statistics...</p>
    );

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4 mb-6">
      {/* ✅ Completed */}
      <div className="bg-green-600 text-white text-center p-4 rounded-xl">
        <h2 className="text-3xl font-bold">{stats.completed}</h2>
        <p>Completed</p>
      </div>

      {/* ✅ Ongoing */}
      <div className="bg-blue-600 text-white text-center p-4 rounded-xl">
        <h2 className="text-3xl font-bold">{stats.ongoing}</h2>
        <p>Ongoing</p>
      </div>

      {/* ✅ Pending */}
      <div className="bg-yellow-500 text-white text-center p-4 rounded-xl">
        <h2 className="text-3xl font-bold">{stats.pending}</h2>
        <p>Pending</p>
      </div>

      {/* ✅ Not Started */}
      <div className="bg-gray-600 text-white text-center p-4 rounded-xl">
        <h2 className="text-3xl font-bold">{stats.not_started}</h2>
        <p>Not Started</p>
      </div>

      {/* ✅ Under Procurement (replaces Total Projects position) */}
      <div className="bg-purple-700 text-white text-center p-4 rounded-xl">
        <h2 className="text-3xl font-bold">
          {stats.under_procurement ?? 0}
        </h2>
        <p>Under Procurement</p>
      </div>

      {/* ✅ Budget (KES) - moved to last position */}
      <div className="bg-white border text-center p-4 rounded-xl shadow">
        <h2 className="text-3xl font-bold text-green-700">
          KES {parseFloat(stats.total_budget).toLocaleString()}
        </h2>
        <p className="text-gray-800 mt-2 font-semibold">Total Budget</p>
      </div>
    </div>
  );
};

export default StatusCards;
