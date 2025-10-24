
import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

const departments = [
  "Administration, Public Service & Special Programs",
  "Agriculture, Livestock, Fisheries & Cooperatives",
  "Education, Youth, Sports & Vocational Training",
  "Finance, Economic Planning & ICT",
  "Gender, Culture & Social Services",
  "Lands, Housing & Urban Planning",
  "Medical & Health Services",
  "Roads, Public Works & Transport",
  "Trade, Energy, Tourism, Investment & Industry",
  "Water, Sanitation, Environment, Natural Resources & Climate Change",
];

const DepartmentDropdown: React.FC = () => {
  const [selected, setSelected] = useState("All Departments");
  const [open, setOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // 🧠 Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div ref={dropdownRef} className="relative inline-block text-left">
      
      <button
        onClick={() => setOpen(!open)}
        className="bg-green-800 text-white font-semibold px-4 py-2 rounded-t-md w-72 text-left flex justify-between items-center hover:bg-green-700"
      >
        {selected}
        <span className="ml-2 text-sm">▼</span>
      </button>

      
      <AnimatePresence>
        {open && (
          <motion.ul
            key="menu"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="absolute z-10 w-72 bg-blue-500 text-white font-medium shadow-lg border border-blue-600 max-h-80 overflow-y-auto rounded-b-md origin-top"
          >
            <li
              onClick={() => {
                setSelected("All Departments");
                setOpen(false);
              }}
              className="bg-green-800 px-4 py-2 hover:bg-green-700 cursor-pointer"
            >
              All Departments
            </li>

            {departments.map((dept) => (
              <li
                key={dept}
                onClick={() => {
                  setSelected(dept);
                  setOpen(false);
                }}
                className="px-4 py-2 hover:bg-blue-600 cursor-pointer border-t border-blue-400"
              >
                {dept}
              </li>
            ))}
          </motion.ul>
        )}
      </AnimatePresence>
    </div>
  );
};

export default DepartmentDropdown;
