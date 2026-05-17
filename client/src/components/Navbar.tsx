import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import useDarkMode from "../hooks/useDarkMode";
import { Sun, Moon, LogOut } from "lucide-react";

const Navbar = () => {
  const { state, logout } = useAuth();
  const navigate = useNavigate();
  const { isDark, toggleDarkMode } = useDarkMode();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <nav className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 px-6 py-4">
      <div className="flex items-center justify-between max-w-7xl mx-auto">
        <div>
          <h1 className="text-xl font-bold text-blue-600 dark:text-blue-400">
            Smart Leads
          </h1>
          <p className="text-xs text-gray-500 dark:text-gray-400">
            {state.user?.name} •{" "}
            <span className="capitalize">{state.user?.role}</span>
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={toggleDarkMode}
            className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-600 dark:text-gray-300"
          >
            {isDark ? <Sun size={18} /> : <Moon size={18} />}
          </button>
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-600 dark:text-gray-300 text-sm"
          >
            <LogOut size={16} />
            Logout
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;