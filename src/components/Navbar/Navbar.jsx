import React, { useState, useEffect, useRef } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { FaUserCircle, FaBars, FaTimes } from "react-icons/fa";

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const dropdownRef = useRef(null);

  // Close dropdown if clicked outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = () => {
    logout();
    setDropdownOpen(false);
    setMobileMenuOpen(false);
    navigate("/");
  };

  const navLinks = [
    { to: "/", label: "Home" },
    { to: "/all-artifacts", label: "All Artifacts" },
  ];

  if (user) {
    navLinks.push({ to: "/add-artifact", label: "Add Artifact" });
  }

  const userPhoto = user?.profilePicture || user?.photoURL || null;
  const userName = user?.name || user?.displayName || "User";

  return (
    <nav
      className="fixed w-full left-0 z-50 bg-rose-300 text-white shadow-lg"
      style={{ margin: "0 auto", left: "50%", transform: "translateX(-50%)" }}
    >
      <div className="flex justify-between h-16 items-center px-4 md:px-8">
        {/* Logo */}
        <Link
          to="/"
          className="flex items-center gap-2 text-2xl font-extrabold text-white"
        >
          <img
            src="/logo.png"
            alt="Logo"
            className="w-10 h-10 rounded-full border-2 border-white bg-black object-contain"
          />
          <span>ArtifactCard</span>
        </Link>

        {/* Desktop nav */}
        <div className="hidden md:flex items-center gap-10 font-medium">
          {navLinks.map(({ to, label }) => (
            <NavLink
              key={to}
              to={to}
              className={({ isActive }) =>
                `hover:text-rose-900 transition px-3 py-2 rounded-lg ${
                  isActive
                    ? "text-rose-400 font-semibold bg-white/10 shadow-md"
                    : "text-white"
                }`
              }
            >
              {label}
            </NavLink>
          ))}

          {user ? (
            <div className="relative" ref={dropdownRef}>
              <button
                onClick={() => setDropdownOpen(!dropdownOpen)}
                aria-haspopup="true"
                aria-expanded={dropdownOpen}
                className="flex items-center gap-3 focus:outline-none focus:ring-2 focus:ring-rose-400 rounded-lg px-2 py-1 hover:bg-white/10 transition"
              >
                {userPhoto ? (
                  <img
                    src={userPhoto}
                    alt="User profile"
                    className="w-10 h-10 rounded-full border-2 border-rose-600 object-cover hover:brightness-90 transition"
                  />
                ) : (
                  <FaUserCircle className="text-4xl text-rose-300" />
                )}
                <span className="text-white font-semibold">{userName}</span>
              </button>

              {/* Dropdown menu */}
              {dropdownOpen && (
                <div
                  className="absolute right-0 mt-2 w-56 bg-black text-white shadow-xl rounded-2xl py-3 z-50 ring-1 ring-white/20"
                  role="menu"
                  aria-label="User menu"
                >
                  <NavLink
                    to="/my-profile"
                    onClick={() => setDropdownOpen(false)}
                    className="block px-5 py-2 hover:bg-white/10 rounded-lg"
                    role="menuitem"
                  >
                    My Profile
                  </NavLink>
                  <NavLink
                    to="/update-profile"
                    onClick={() => setDropdownOpen(false)}
                    className="block px-5 py-2 hover:bg-white/10 rounded-lg"
                    role="menuitem"
                  >
                    Update Profile
                  </NavLink>
                  <NavLink
                    to="/my-artifacts"
                    onClick={() => setDropdownOpen(false)}
                    className="block px-5 py-2 hover:bg-white/10 rounded-lg"
                    role="menuitem"
                  >
                    My Artifacts
                  </NavLink>
                  <NavLink
                    to="/liked-artifacts"
                    onClick={() => setDropdownOpen(false)}
                    className="block px-5 py-2 hover:bg-white/10 rounded-lg"
                    role="menuitem"
                  >
                    Liked Artifacts
                  </NavLink>
                  <NavLink
                    to="/feedback"
                    onClick={() => setDropdownOpen(false)}
                    className="block px-5 py-2 hover:bg-white/10 rounded-lg"
                    role="menuitem"
                  >
                    Feedback
                  </NavLink>
                  <NavLink
                    to="/help"
                    onClick={() => setDropdownOpen(false)}
                    className="block px-5 py-2 hover:bg-white/10 rounded-lg"
                    role="menuitem"
                  >
                    Help & Support
                  </NavLink>
                  <button
                    onClick={handleLogout}
                    className="block w-full text-left px-5 py-2 text-red-500 hover:bg-red-600 rounded-lg font-semibold"
                    role="menuitem"
                  >
                    Logout
                  </button>
                </div>
              )}
            </div>
          ) : (
            <>
              <NavLink
                to="/login"
                className="text-white font-semibold hover:underline px-4 py-2 rounded-lg"
              >
                Login
              </NavLink>
              <NavLink
                to="/register"
                className="bg-rose-700 text-white px-5 py-2 rounded-lg hover:bg-rose-800 transition"
              >
                Register
              </NavLink>
            </>
          )}
        </div>

        {/* Mobile menu button */}
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="md:hidden text-white hover:text-rose-300 focus:outline-none focus:ring-2 focus:ring-rose-400 rounded-lg p-2 transition"
          aria-label="Toggle menu"
        >
          {mobileMenuOpen ? <FaTimes size={24} /> : <FaBars size={24} />}
        </button>
      </div>

      {/* Mobile menu */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-black text-white shadow-lg border-t border-rose-700 rounded-b-xl">
          <div className="flex flex-col py-5 space-y-3 px-6 font-medium">
            {navLinks.map(({ to, label }) => (
              <NavLink
                key={to}
                to={to}
                onClick={() => setMobileMenuOpen(false)}
                className={({ isActive }) =>
                  `block py-3 px-5 rounded-lg hover:bg-white/10 transition ${
                    isActive
                      ? "bg-rose-700 text-white font-semibold"
                      : "text-white"
                  }`
                }
              >
                {label}
              </NavLink>
            ))}

            {user ? (
              <>
                <NavLink
                  to="/my-profile"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block py-3 px-5 rounded-lg hover:bg-white/10 transition"
                >
                  My Profile
                </NavLink>
                <NavLink
                  to="/update-profile"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block py-3 px-5 rounded-lg hover:bg-white/10 transition"
                >
                  Update Profile
                </NavLink>
                <NavLink
                  to="/feedback"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block py-3 px-5 rounded-lg hover:bg-white/10 transition"
                >
                  Feedback
                </NavLink>
                <NavLink
                  to="/help"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block py-3 px-5 rounded-lg hover:bg-white/10 transition"
                >
                  Help & Support
                </NavLink>
                <button
                  onClick={() => {
                    handleLogout();
                    setMobileMenuOpen(false);
                  }}
                  className="text-red-500 block text-left py-3 px-5 rounded-lg hover:bg-red-600 transition font-semibold"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <NavLink
                  to="/login"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block py-3 px-5 rounded-lg hover:bg-white/10 transition"
                >
                  Login
                </NavLink>
                <NavLink
                  to="/register"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block py-3 px-5 bg-rose-700 text-white rounded-lg hover:bg-rose-800 transition"
                >
                  Register
                </NavLink>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
