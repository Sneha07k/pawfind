import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    setMenuOpen(false);
    navigate("/");
  };

  const dashboardLink =
    user?.role === "ADMIN"
      ? "/admin"
      : user?.role === "NGO"
        ? "/ngo/dashboard"
        : user?.role === "ADOPTER"
          ? "/dashboard"
          : null;

  return (
    <nav className="bg-white shadow-sm sticky top-0 z-50">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="flex justify-between items-center h-16">
          <Link
            to="/"
            className="text-xl font-semibold text-primary-600 flex items-center gap-1.5"
          >
            PawFind
          </Link>

          {/* Desktop nav */}
          <div className="hidden md:flex items-center gap-6 text-sm">
            <Link
              to="/browse"
              className="text-neutral-600 hover:text-primary-600"
            >
              Browse Pets
            </Link>
            <Link to="/map" className="text-neutral-600 hover:text-primary-600">
              Nearby
            </Link>

            {user ? (
              <>
                {dashboardLink && (
                  <Link
                    to={dashboardLink}
                    className="text-neutral-600 hover:text-primary-600"
                  >
                    Dashboard
                  </Link>
                )}
                {user.role === "ADOPTER" && (
                  <Link
                    to="/favorites"
                    className="text-neutral-600 hover:text-primary-600"
                  >
                    Favourites
                  </Link>
                )}
                <button
                  onClick={handleLogout}
                  className="text-neutral-600 hover:text-red-500"
                >
                  Log Out
                </button>
                <span className="text-xs bg-primary-50 text-primary-600 px-3 py-1.5 rounded-full">
                  Hi, {user.name?.split(" ")[0]}
                </span>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  className="text-neutral-600 hover:text-primary-600"
                >
                  Log In
                </Link>
                <Link
                  to="/register"
                  className="bg-primary-500 text-white px-4 py-1.5 rounded-xl hover:bg-primary-600"
                >
                  Sign Up
                </Link>
              </>
            )}
          </div>

          {/* Mobile hamburger */}
          <button
            className="md:hidden text-neutral-600"
            onClick={() => setMenuOpen((o) => !o)}
            aria-label="Menu"
          >
            <svg
              width="24"
              height="24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path d="M3 6h18M3 12h18M3 18h18" strokeLinecap="round" />
            </svg>
          </button>
        </div>

        {/* Mobile menu */}
        {menuOpen && (
          <div className="md:hidden flex flex-col gap-3 pb-4 text-sm">
            <Link
              to="/browse"
              onClick={() => setMenuOpen(false)}
              className="text-neutral-600"
            >
              Browse Pets
            </Link>
            <Link
              to="/map"
              onClick={() => setMenuOpen(false)}
              className="text-neutral-600"
            >
              Nearby
            </Link>
            {user ? (
              <>
                {dashboardLink && (
                  <Link
                    to={dashboardLink}
                    onClick={() => setMenuOpen(false)}
                    className="text-neutral-600"
                  >
                    Dashboard
                  </Link>
                )}
                {user.role === "ADOPTER" && (
                  <Link
                    to="/favorites"
                    onClick={() => setMenuOpen(false)}
                    className="text-neutral-600"
                  >
                    Favourites
                  </Link>
                )}
                <button
                  onClick={handleLogout}
                  className="text-left text-red-500"
                >
                  Log Out
                </button>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  onClick={() => setMenuOpen(false)}
                  className="text-neutral-600"
                >
                  Log In
                </Link>
                <Link
                  to="/register"
                  onClick={() => setMenuOpen(false)}
                  className="text-primary-600 font-medium"
                >
                  Sign Up
                </Link>
              </>
            )}
          </div>
        )}
      </div>
    </nav>
  );
}
