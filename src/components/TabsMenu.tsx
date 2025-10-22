import React, { useState } from "react";

interface TabsMenuProps {
  onFilterChange: (filters: {
    year: string;
    department: string;
    ward: string;
    status: string;
  }) => void;
}

const TabsMenu: React.FC<TabsMenuProps> = ({ onFilterChange }) => {
  const [activeTab, setActiveTab] = useState("all");
  const [filters, setFilters] = useState({
    year: "",
    department: "",
    ward: "",
    status: "",
  });

  const handleChange = (key: string, value: string) => {
    const newFilters = { ...filters, [key]: value };
    setFilters(newFilters);
    onFilterChange(newFilters);
  };

  const tabs = [
    { key: "all", label: "All Projects" },
    { key: "year", label: "Per Financial Year" },
    { key: "status", label: "Per Status" },
    { key: "department", label: "Per Department" },
    { key: "ward", label: "Per Ward" },
  ];

  return (
    <div className="bg-white shadow-sm border-b">
      <div className="flex flex-wrap items-center justify-center gap-2 px-4 py-3 text-sm sm:text-base">
        {tabs.map((tab) => (
          <button
            key={tab.key}
            onClick={() => {
              setActiveTab(tab.key);
              if (tab.key === "all") onFilterChange({ year: "", department: "", ward: "", status: "" });
            }}
            className={`px-4 py-2 rounded-md transition-colors ${
              activeTab === tab.key
                ? "bg-green-700 text-white font-semibold"
                : "text-blue-600 hover:text-green-700"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {activeTab !== "all" && (
        <div className="flex flex-wrap justify-center gap-4 bg-gray-50 py-3">
          {activeTab === "year" && (
            <select
              onChange={(e) => handleChange("year", e.target.value)}
              className="border border-gray-300 rounded-md px-3 py-2"
            >
              <option value="">Select Financial Year</option>
              <option value="2022/2023">2022/2023</option>
              <option value="2023/2024">2023/2024</option>
              <option value="2024/2025">2024/2025</option>
              <option value="2025/2026">2025/2026</option>
            </select>
          )}

          {activeTab === "department" && (
            <select
              onChange={(e) => handleChange("department", e.target.value)}
              className="border border-gray-300 rounded-md px-3 py-2"
            >
              <option value="">Select Department</option>
              <option value="Health">Health</option>
              <option value="Education">Education</option>
              <option value="Infrastructure">Infrastructure</option>
              <option value="Trade & Cooperatives">Trade & Cooperatives</option>
              <option value="Agriculture & Livestock">Agriculture & Livestock</option>
              <option value="Water & Sanitation">Water & Sanitation</option>
              <option value="Environment & Urban Planning">Environment & Urban Planning</option>
              <option value="ICT & Youth Affairs">ICT & Youth Affairs</option>
              <option value="Gender & Social Services">Gender & Social Services</option>
            </select>
          )}

          {activeTab === "status" && (
            <select
              onChange={(e) => handleChange("status", e.target.value.toLowerCase())}
              className="border border-gray-300 rounded-md px-3 py-2"
            >
              <option value="">Select Status</option>
              <option value="completed">Completed</option>
              <option value="ongoing">Ongoing</option>
              <option value="pending">Pending</option>
              <option value="not started">Not Started</option>
            </select>
          )}

          {activeTab === "ward" && (
            <select
              onChange={(e) => handleChange("ward", e.target.value)}
              className="border border-gray-300 rounded-md px-3 py-2"
            >
              <option value="">Select Ward</option>
              <option value="Igoji East">Igoji East</option>
              <option value="Igoji West">Igoji West</option>
              <option value="Abogeta West">Abogeta West</option>
              <option value="Abothuguchi Central">Abothuguchi Central</option>
              <option value="Abothuguchi West">Abothuguchi West</option>
              <option value="Akachiu">Akachiu</option>
              <option value="Amwathi">Amwathi</option>
              <option value="Antubetwe Kiongo">Antubetwe Kiongo</option>
              <option value="Antuambui">Antuambui</option>
              <option value="Athiru Gaiti">Athiru Gaiti</option>
              <option value="Athiru Ruujine">Athiru Ruujine</option>
              <option value="Gaitu">Gaitu</option>
              <option value="Gikurune">Gikurune</option>
              <option value="Githongo">Githongo</option>
              <option value="Giaki">Giaki</option>
              <option value="Kibirichia">Kibirichia</option>
              <option value="Kiguchwa">Kiguchwa</option>
              <option value="Kiengu">Kiengu</option>
              <option value="Kiigene">Kiigene</option>
              <option value="Kithangari">Kithangari</option>
              <option value="Kithirune">Kithirune</option>
              <option value="Kithoka">Kithoka</option>
              <option value="Kongoacheke">Kongoacheke</option>
              <option value="Maua">Maua</option>
              <option value="Mikinduri">Mikinduri</option>
              <option value="Mituntu">Mituntu</option>
              <option value="Muringene">Muringene</option>
              <option value="Mwanganthia">Mwanganthia</option>
              <option value="Nkuene">Nkuene</option>
              <option value="Nkomo">Nkomo</option>
              <option value="Ntima East">Ntima East</option>
              <option value="Ntima West">Ntima West</option>
              <option value="Ntuene">Ntuene</option>
              <option value="Ntonyiri">Ntonyiri</option>
              <option value="Ruiri Rwarera">Ruiri Rwarera</option>
              <option value="Thangatha">Thangatha</option>
              <option value="Timau">Timau</option>
              <option value="Tigania East">Tigania East</option>
              <option value="Tigania West">Tigania West</option>
              <option value="Kanyakine">Kanyakine</option>
              <option value="Kiirua Naari">Kiirua Naari</option>
              <option value="Mwanganthia">Mwanganthia</option>
              <option value="Muthara">Muthara</option>
              <option value="Ntunene">Ntunene</option>
              <option value="Njia">Njia</option>
              <option value="Gatimbi">Gatimbi</option>
            </select>
          )}
        </div>
      )}
    </div>
  );
};

export default TabsMenu;
