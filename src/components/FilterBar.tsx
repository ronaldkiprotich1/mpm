import React, { useState, useEffect } from "react";
import { Project } from "../types/Project";

interface FilterBarProps {
  projects: Project[]; 
  onFilterChange: (filters: {
    year: string;
    department: string;
    ward: string;
    status: string;
  }) => void;
}

const FilterBar: React.FC<FilterBarProps> = ({ projects, onFilterChange }) => {
  const [filters, setFilters] = useState({
    year: "",
    department: "",
    ward: "",
    status: "",
  });

  
  const years = Array.from(
    new Set(projects.map((p) => p.financial_year_name).filter(Boolean))
  ).sort();
  const departments = Array.from(
    new Set(projects.map((p) => p.department_name).filter(Boolean))
  ).sort();
  const wards = Array.from(
    new Set(projects.map((p) => p.ward_name).filter(Boolean))
  ).sort();
  const statuses = Array.from(
    new Set(projects.map((p) => p.status).filter(Boolean))
  ).sort();

  
  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newFilters = { ...filters, [e.target.name]: e.target.value };
    setFilters(newFilters);
    onFilterChange(newFilters);
  };

  
  useEffect(() => {
    onFilterChange(filters);
  }, [filters, onFilterChange]);

  return (
    <div className="bg-white p-4 rounded-md shadow-sm mb-6 flex flex-wrap gap-3 items-center justify-between overflow-x-auto">
      {[
        { name: "year", label: "All Years", options: years },
        { name: "department", label: "All Departments", options: departments },
        { name: "ward", label: "All Wards", options: wards },
        { name: "status", label: "All Statuses", options: statuses },
      ].map(({ name, label, options }) => (
        <select
          key={name}
          name={name}
          value={(filters as any)[name]}
          onChange={handleChange}
          className="border border-gray-300 rounded-md p-2 min-w-[150px] text-sm focus:ring-2 focus:ring-blue-400 focus:outline-none"
        >
          <option value="">{label}</option>
          {options.map((opt) => (
            <option key={opt} value={opt}>
              {opt}
            </option>
          ))}
        </select>
      ))}

      
      <button
        onClick={() =>
          setFilters({ year: "", department: "", ward: "", status: "" })
        }
        className="bg-blue-600 text-white px-3 py-2 rounded-md text-sm hover:bg-blue-700 transition-colors"
      >
        Reset Filters
      </button>
    </div>
  );
};

export default FilterBar;
