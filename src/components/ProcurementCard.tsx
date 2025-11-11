import React from "react";
import { motion } from "framer-motion";

interface ProcurementCardProps {
  stage: string;
  count: number;
  color?: string; // optional custom color
}

const ProcurementCard: React.FC<ProcurementCardProps> = ({
  stage,
  count,
  color = "bg-purple-700", // default purple color
}) => {
  return (
    <motion.div
      whileHover={{ scale: 1.05, y: -5 }}
      transition={{ type: "spring", stiffness: 300, damping: 15 }}
      className={`${color} text-white px-6 py-5 rounded-xl shadow-md text-center cursor-pointer hover:shadow-lg`}
    >
      <p className="text-3xl font-bold">{count}</p>
      <p className="text-sm mt-1 font-medium">{stage}</p>
    </motion.div>
  );
};

export default ProcurementCard;
