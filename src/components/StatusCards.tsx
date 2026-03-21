import { useEffect, useState } from "react";
import { axiosClient } from "../api/axiosClient";
import { motion } from "framer-motion";

interface Stats {
  completed: number;
  ongoing: number;
  pending: number;
  not_started: number;
  under_procurement: number;
  stalled: number;
}

type CardConfig = {
  label: string;
  value: number;
  bgColor: string;
  textColor: string;
  labelColor: string;
};

const StatusCards = () => {
  const [stats, setStats] = useState<Stats | null>(null);

  useEffect(() => {
    axiosClient
      .get("projects/statistics/")
      .then((res) => setStats(res.data))
      .catch((err) => console.error("Error fetching statistics:", err));
  }, []);

  if (!stats)
    return <p className="text-center text-gray-600 mt-6">Loading statistics...</p>;

  const total =
    (stats.completed || 0) +
    (stats.ongoing || 0) +
    (stats.pending || 0) +
    (stats.not_started || 0) +
    (stats.under_procurement || 0) +
    (stats.stalled || 0);

  const cards: CardConfig[] = [
    { label: "Completed", value: stats.completed, bgColor: "bg-green-600", textColor: "text-white", labelColor: "text-white" },
    { label: "Ongoing", value: stats.ongoing, bgColor: "bg-blue-600", textColor: "text-white", labelColor: "text-white" },
    { label: "Pending", value: stats.pending, bgColor: "bg-yellow-500", textColor: "text-white", labelColor: "text-white" },
    { label: "Not Started", value: stats.not_started, bgColor: "bg-gray-600", textColor: "text-white", labelColor: "text-white" },
    { label: "Under Procurement", value: stats.under_procurement, bgColor: "bg-purple-600", textColor: "text-white", labelColor: "text-white" },
    { label: "Stalled", value: stats.stalled, bgColor: "bg-red-600", textColor: "text-white", labelColor: "text-white" },
    { label: "Total Projects", value: total, bgColor: "bg-white border border-gray-200 shadow", textColor: "text-green-600", labelColor: "text-gray-800" },
  ];

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-7 gap-4 mb-6">
      {cards.map((card, idx) => (
        <motion.div
          key={idx}
          whileHover={{ scale: 1.05, y: -5 }}
          transition={{ type: "spring", stiffness: 300, damping: 15 }}
          className={`${card.bgColor} text-center p-4 rounded-xl cursor-pointer hover:shadow-lg`}
        >
          <h2 className={`text-3xl font-bold ${card.textColor}`}>{card.value}</h2>
          <p className={`font-medium ${card.labelColor}`}>{card.label}</p>
        </motion.div>
      ))}
    </div>
  );
};

export default StatusCards;