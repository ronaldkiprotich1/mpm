// src/components/BudgetByYearChart.tsx
import { BarChart, Bar, XAxis, Tooltip, ResponsiveContainer, CartesianGrid } from "recharts";
import { Project } from "../types/Project";

interface ChartProps {
  projects: Project[];
}

const BudgetByYearChart = ({ projects }: ChartProps) => {
  const groupedData = Object.entries(
    projects.reduce((acc: any, p) => {
      acc[p.financial_year_name] = (acc[p.financial_year_name] || 0) + p.budget;
      return acc;
    }, {})
  ).map(([year, budget]) => ({ year, budget }));

  return (
    <div className="bg-white p-4 rounded-lg shadow-md border border-gray-100 mb-6">
      <h3 className="font-semibold text-gray-700 mb-3">
        Budget Allocation by Financial Year
      </h3>
      {groupedData.length > 0 ? (
        <ResponsiveContainer width="100%" height={250}>
          <BarChart data={groupedData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
            <XAxis dataKey="year" />
            <Tooltip formatter={(v: number) => v.toLocaleString()} />
            <Bar dataKey="budget" fill="#0095da" radius={[5, 5, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      ) : (
        <p className="text-center text-gray-500 py-6">
          No data available for selected filters.
        </p>
      )}
    </div>
  );
};

export default BudgetByYearChart;
