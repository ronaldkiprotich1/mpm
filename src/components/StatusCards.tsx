import { useEffect, useState } from "react";
import axios from "axios";
import { motion } from "framer-motion";

interface Stats {
  total_projects: number;
  completed: number;
  ongoing: number;
  pending: number;
  not_started: number;
  under_procurement: number;
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
    return <p className="text-center text-gray-600 mt-6">Loading statistics...</p>;

  const cards = [
    { label: "Completed", value: stats.completed, color: "bg-green-600" },
    { label: "Ongoing", value: stats.ongoing, color: "bg-blue-600" },
    { label: "Pending", value: stats.pending, color: "bg-yellow-500" },
    { label: "Not Started", value: stats.not_started, color: "bg-gray-600" },
    { label: "Under Procurement", value: stats.under_procurement, color: "bg-purple-600" },
    {
      label: "Total Projects",
      value: stats.total_projects,
      color: "bg-white border text-black shadow",
    },
  ];

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4 mb-6">
      {cards.map((card, idx) => (
        <motion.div
          key={idx}
          whileHover={{ scale: 1.05, y: -5 }}
          transition={{ type: "spring", stiffness: 300, damping: 15 }}
          className={`${card.color} text-center p-4 rounded-xl cursor-pointer hover:shadow-lg`}
        >
          <h2
            className={`text-3xl font-bold ${
              card.color === "bg-white border text-black shadow"
                ? "text-green-600"
                : "text-white"
            }`}
          >
            {card.value}
          </h2>
          <p
            className={`font-medium ${
              card.color === "bg-white border text-black shadow"
                ? "text-black"
                : "text-white"
            }`}
          >
            {card.label}
          </p>
        </motion.div>
      ))}
    </div>
  );
};

export default StatusCards;
