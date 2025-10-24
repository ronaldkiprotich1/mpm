import { Link } from "react-router-dom";

const Navbar = () => {
  return (
    <nav className="bg-green-800 text-white shadow-md">
      <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between py-3 px-4">
        {/* Logo + Title */}
        <div className="flex items-center space-x-3 mb-2 md:mb-0">
          <img
            src="/src/assets/logo.png"
            alt="Meru County Logo"
            className="h-10 w-10 rounded-full bg-white"
          />
          <div className="leading-tight">
            <h1 className="font-bold text-base sm:text-lg">MERU COUNTY GOVERNMENT</h1>
            <p className="text-xs sm:text-sm text-blue-200">Projects Dashboard</p>
          </div>
        </div>

        {/* Links */}
        <div className="flex flex-wrap gap-4 text-sm sm:text-base justify-center md:justify-end">
          <Link to="/" className="hover:text-blue-300">Home</Link>
          <Link to="/per-year" className="hover:text-blue-300">Financial Year</Link>
          <Link to="/per-status" className="hover:text-blue-300">Status</Link>
          <Link to="/per-department" className="hover:text-blue-300">Department</Link>
          <Link to="/per-ward" className="hover:text-blue-300">Ward</Link>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
