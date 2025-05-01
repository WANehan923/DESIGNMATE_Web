import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import Navbar from "../components/Navbar";
import bgImage from "../assets/heroimg.svg";
import "../styles/Explore.css";

const Explore = () => {
  const navigate = useNavigate();
  const [designs, setDesigns] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterType, setFilterType] = useState("All");

  const fetchPublicDesigns = async () => {
    try {
      const res = await axios.get("http://localhost:5050/api/designs/explore/all");
      setDesigns(res.data.designs || []);
    } catch (err) {
      console.error(err);
      Swal.fire({
        icon: "error",
        title: "Failed to load public designs",
        text: err.response?.data?.msg || "Server error",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPublicDesigns();
  }, []);

  const filteredDesigns = designs.filter((design) =>
    filterType === "All" ? true : design.type === filterType
  );

  return (
    <div
      className="explore-page"
      style={{
        backgroundImage: `url(${bgImage})`,
        backgroundSize: "cover",
        backgroundRepeat: "no-repeat",
        backgroundAttachment: "fixed",
        minHeight: "100vh",
      }}
    >
      {/* Navbar */}
      <Navbar />

      {/* Page Content */}
      <div className="container py-5">
        <div className="d-flex justify-content-between align-items-center mb-4">
          <h3 className="fw-bold text-black">Explore Public Designs</h3>
          <select
            className="form-select w-auto"
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
          >
            <option value="All">All Types</option>
            <option value="2D">2D</option>
            <option value="3D">3D</option>
          </select>
        </div>

        {loading ? (
          <p className="text-black">Loading...</p>
        ) : filteredDesigns.length === 0 ? (
          <p className="text-black">No public designs available.</p>
        ) : (
          <div className="row">
            {filteredDesigns.map((design) => (
              <div key={design.id} className="col-md-6 col-lg-4 mb-4">
                <div
                  className="p-4 rounded shadow-sm glass-card-alt h-100"
                  style={{
                    background: "rgba(255, 255, 255, 0.85)",
                    borderRadius: "1rem",
                    border: "1px solid rgba(0, 0, 0, 0.05)",
                    backdropFilter: "blur(8px)",
                  }}
                >
                  <h5 className="fw-bold text-dark mb-2">{design.name}</h5>
                  <p className="text-muted mb-1">Type: {design.type}</p>
                  <p className="text-muted mb-2">
                    <strong>Objects:</strong>{" "}
                    {design.designData?.objects?.length > 0 ? (
                      design.designData.objects.map((obj, index) => (
                        <span key={index} className="badge bg-secondary text-light me-1">
                          {obj.type || obj.name}
                        </span>
                      ))
                    ) : (
                      <span className="text-muted">None</span>
                    )}
                  </p>
                  <p className="text-muted mb-3">
                    <small>
                      Created:{" "}
                      {design.createdAt?.seconds
                        ? new Date(design.createdAt.seconds * 1000).toLocaleString()
                        : "N/A"}
                    </small>
                  </p>
                  <div className="d-grid">
                    <button
                      className="btn btn-outline-dark btn-sm"
                      onClick={() => navigate(`/design/${design.id}`)}
                    >
                      View Design
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Explore;