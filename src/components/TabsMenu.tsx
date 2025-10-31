import React, { useEffect, useState, useRef } from "react";
import { axiosClient } from "../api/axiosClient";
import { useLocation } from "react-router-dom";

interface TabsMenuProps {
  onFilterChange: (filters: any) => void;
}

interface Department { id: number; name: string; }
interface Ward { id: number; name: string; }
interface Subcounty { id: number; name: string; }
interface FinancialYear { id: number; year: string; }

const TabsMenu: React.FC<TabsMenuProps> = ({ onFilterChange }) => {
  const [departments, setDepartments] = useState<Department[]>([]);
  const [wards, setWards] = useState<Ward[]>([]);
  const [subcounties, setSubcounties] = useState<Subcounty[]>([]);
  const [years, setYears] = useState<FinancialYear[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filters, setFilters] = useState({
    department_name: "",
    ward_name: "",
    subcounty_name: "",
    financial_year_name: "",
    status: "",
  });
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const dropdownRef = useRef<HTMLDivElement | null>(null);
  const location = useLocation();

  // Scroll to dropdown when coming from another page
  useEffect(() => {
    if (location.state?.activeTab) {
      setActiveDropdown(location.state.activeTab);
      setTimeout(() => {
        const el = document.getElementById("tabs-menu");
        if (el) el.scrollIntoView({ behavior: "smooth" });
      }, 100);
      window.history.replaceState({}, document.title);
    }
  }, [location.state]);

  // Helper: fetch paginated data (wards)
  const fetchAllPages = async (url: string): Promise<any[]> => {
    let allResults: any[] = [];
    let nextUrl: string | null = url;
    while (nextUrl) {
      const res: any = await axiosClient.get(nextUrl);
      const data: any = res.data;
      allResults = [...allResults, ...(data.results || [])];
      nextUrl = data.next;
    }
    return allResults;
  };

  // Fetch dropdown data
  useEffect(() => {
    const fetchAll = async () => {
      setLoading(true);
      try {
        const [deptRes, subRes, yearRes, allWards] = await Promise.all([
          axiosClient.get("http://192.168.100.32:8000/departments/"),
          axiosClient.get("http://192.168.100.32:8000/subcounties/"),
          axiosClient.get("http://192.168.100.32:8000/financial-years/"),
          fetchAllPages("http://192.168.100.32:8000/wards/"),
        ]);
        setDepartments(deptRes.data.results || []);
        setSubcounties(subRes.data.results || []);
        setYears(yearRes.data.results || []);
        setWards(allWards);
      } catch (err) {
        console.error("Dropdown fetch error:", err);
        setError("⚠️ Failed to load dropdown data. Check backend connection.");
      } finally {
        setLoading(false);
      }
    };
    fetchAll();
  }, []);

  // Handle dropdown change
  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newFilters = { ...filters, [e.target.name]: e.target.value };
    setFilters(newFilters);
    onFilterChange(newFilters);
    setActiveDropdown(null);
  };

  const resetFilters = () => {
    const cleared = {
      department_name: "",
      ward_name: "",
      subcounty_name: "",
      financial_year_name: "",
      status: "",
    };
    setFilters(cleared);
    onFilterChange(cleared);
    setActiveDropdown(null);
  };

  if (loading)
    return <div className="text-center text-gray-600 py-3">Loading filters...</div>;
  if (error)
    return <div className="text-center text-red-600 py-3">{error}</div>;

  return (
    <div
      id="tabs-menu"
      ref={dropdownRef}
      className="bg-white shadow-sm p-4 rounded-md relative z-50 overflow-visible"
    >
      {/* Top Navigation Tabs */}
      <div className="flex flex-wrap justify-center items-center gap-6 mb-3 text-blue-600 font-medium">
        <button
          onClick={resetFilters}
          className="text-green-700 font-semibold hover:underline"
        >
          All Projects
        </button>
        <button
          onClick={() => setActiveDropdown("financial")}
          className={`px-4 py-1 rounded-full transition ${
            activeDropdown === "financial"
              ? "bg-green-700 text-white"
              : "hover:text-green-700"
          }`}
        >
          Per Financial Year
        </button>
        <button
          onClick={() => setActiveDropdown("status")}
          className={`transition hover:text-green-700 ${
            activeDropdown === "status" ? "font-semibold" : ""
          }`}
        >
          Per Status
        </button>
        <button
          onClick={() => setActiveDropdown("department")}
          className={`transition hover:text-green-700 ${
            activeDropdown === "department" ? "font-semibold" : ""
          }`}
        >
          Per Department
        </button>
        <button
          onClick={() => setActiveDropdown("subcounty")}
          className={`transition hover:text-green-700 ${
            activeDropdown === "subcounty" ? "font-semibold" : ""
          }`}
        >
          Per Subcounty
        </button>
        <button
          onClick={() => setActiveDropdown("ward")}
          className={`transition hover:text-green-700 ${
            activeDropdown === "ward" ? "font-semibold" : ""
          }`}
        >
          Per Ward
        </button>
      </div>

      {/* Dropdown Filters */}
      <div className="flex justify-center relative z-50">
        {activeDropdown === "financial" && (
          <select
            name="financial_year_name"
            onChange={handleChange}
            value={filters.financial_year_name}
            className="border border-gray-400 rounded-md px-3 py-2 bg-white shadow-lg relative z-50 animate-fadeIn"
          >
            <option value="">Select Financial Year</option>
            {years.map((y) => (
              <option key={y.id} value={y.year}>
                {y.year}
              </option>
            ))}
          </select>
        )}

        {activeDropdown === "status" && (
          <select
            name="status"
            onChange={handleChange}
            value={filters.status}
            className="border border-gray-400 rounded-md px-3 py-2 bg-white shadow-lg relative z-50 animate-fadeIn"
          >
            <option value="">Select Status</option>
            <option value="completed">Completed</option>
            <option value="ongoing">Ongoing</option>
            <option value="pending">Pending</option>
            <option value="not_started">Not Started</option>
            <option value="under_procurement">Under Procurement</option>
          </select>
        )}

        {activeDropdown === "department" && (
          <select
            name="department_name"
            onChange={handleChange}
            value={filters.department_name}
            className="border border-gray-400 rounded-md px-3 py-2 bg-white shadow-lg relative z-50 animate-fadeIn"
          >
            <option value="">Select Department</option>
            {departments.map((dept) => (
              <option key={dept.id} value={dept.name}>
                {dept.name}
              </option>
            ))}
          </select>
        )}

        {activeDropdown === "subcounty" && (
          <select
            name="subcounty_name"
            onChange={handleChange}
            value={filters.subcounty_name}
            className="border border-gray-400 rounded-md px-3 py-2 bg-white shadow-lg relative z-50 animate-fadeIn"
          >
            <option value="">Select Subcounty</option>
            {subcounties.map((s) => (
              <option key={s.id} value={s.name}>
                {s.name}
              </option>
            ))}
          </select>
        )}

        {activeDropdown === "ward" && (
          <select
            name="ward_name"
            onChange={handleChange}
            value={filters.ward_name}
            className="border border-gray-400 rounded-md px-3 py-2 bg-white shadow-lg relative z-50 animate-fadeIn"
          >
            <option value="">Select Ward</option>
            {wards.map((w) => (
              <option key={w.id} value={w.name}>
                {w.name}
              </option>
            ))}
          </select>
        )}
      </div>

      {/* Simple fade-in animation */}
      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(-6px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fadeIn {
          animation: fadeIn 0.25s ease-in-out;
        }
      `}</style>
    </div>
  );
};

export default TabsMenu;
