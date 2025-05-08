import React from "react";
import { Link, useNavigate } from "react-router-dom";

const Navbar = () => {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  const handleAuth = () => {
    if (token) {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      navigate("/login");
    } else {
      navigate("/login");
    }
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-dark px-4 py-3 shadow-sm">
      <div className="container-fluid">
        {/* Brand */}
        <Link className="navbar-brand fw-bold text-uppercase" to="/">
          DesignMate
        </Link>

        {/* Mobile Toggler */}
        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#mainNavbar"
          aria-controls="mainNavbar"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        {/* Navigation Links */}
        <div className="collapse navbar-collapse" id="mainNavbar">
          <ul className="navbar-nav me-auto mb-2 mb-lg-0">

            <li className="nav-item">
              <Link className="nav-link" to="/dashboard">Dashboard</Link>
            </li>

            <li className="nav-item">
              <Link className="nav-link" to="/">Home</Link>
            </li>

            <li className="nav-item">
              <Link className="nav-link" to="/explore">Explore</Link>
            </li>

            <li className="nav-item">
              <Link className="nav-link" to="/shop">Shop</Link>
            </li>

            {/* Create Design Dropdown */}
            <li className="nav-item dropdown">
              <a
                className="nav-link dropdown-toggle"
                href="#"
                id="createDropdown"
                role="button"
                data-bs-toggle="dropdown"
                aria-expanded="false"
              >
                Create Design
              </a>
              <ul className="dropdown-menu" aria-labelledby="createDropdown">
                <li>
                  <Link className="dropdown-item" to="/create-design">
                    Create 2D Design
                  </Link>
                </li>
                <li>
                  <Link className="dropdown-item" to="/design3d">
                    Create 3D Design
                  </Link>
                </li>
              </ul>
            </li>

            <li className="nav-item">
              <Link className="nav-link" to="/public-designs">Public Designs</Link>
            </li>

            <li className="nav-item">
              <Link className="nav-link" to="/profile">Profile</Link>
            </li>

          </ul>

          {/* Auth Button */}
          <div className="d-flex">
            <button
              className="btn btn-outline-light btn-sm"
              onClick={handleAuth}
            >
              {token ? "Log Out" : "Log In"}
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;