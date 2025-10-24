import { useNavigate } from "react-router-dom";

const Navbar = () => {
  const navigate = useNavigate();

  const handleNavigation = (tab: string | null = null) => {
    navigate("/", { state: { activeTab: tab } });

   
    setTimeout(() => {
      const el = document.getElementById("tabs-menu");
      if (el) el.scrollIntoView({ behavior: "smooth" });
    }, 300);
  };

  return (
    <nav className="bg-green-800 text-white shadow-md">
      <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between py-3 px-4">
     
        <div className="flex items-center space-x-3 mb-2 md:mb-0">
          <img
            src="/src/assets/logo.png"
            alt="Meru County Logo"
            className="h-10 w-10 rounded-full bg-white"
          />
          <div className="leading-tight">
            <h1 className="font-bold text-base sm:text-lg">
              MERU COUNTY GOVERNMENT
            </h1>
            <p className="text-xs sm:text-sm text-blue-200">
              Projects Dashboard
            </p>
          </div>
        </div>

       
        <div className="flex flex-wrap gap-4 text-sm sm:text-base justify-center md:justify-end">
          <button
            onClick={() => handleNavigation(null)}
            className="hover:text-blue-300 transition"
          >
            Home
          </button>
          <button
            onClick={() => handleNavigation("financial")}
            className="hover:text-blue-300 transition"
          >
            Financial Year
          </button>
          <button
            onClick={() => handleNavigation("status")}
            className="hover:text-blue-300 transition"
          >
            Status
          </button>
          <button
            onClick={() => handleNavigation("department")}
            className="hover:text-blue-300 transition"
          >
            Department
          </button>
          <button
            onClick={() => handleNavigation("ward")}
            className="hover:text-blue-300 transition"
          >
            Ward
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
