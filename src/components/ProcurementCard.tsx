import React from "react";

interface ProcurementCardProps {
  stage: string;
  count: number;
}

const ProcurementCard: React.FC<ProcurementCardProps> = ({ stage, count }) => {
  return (
    <div className="bg-purple-600 text-white px-6 py-4 rounded-lg shadow-md text-center w-48">
      <p className="text-3xl font-bold">{count}</p>
      <p className="text-sm mt-1">{stage}</p>
    </div>
  );
};

export default ProcurementCard;
