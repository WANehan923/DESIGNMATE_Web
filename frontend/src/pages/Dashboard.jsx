import React, { useEffect, useState } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";
import bgImage from "../assets/heroimg.svg";
import "../styles/Explore.css";
import Navbar from "../components/Navbar";

const Dashboard = () => {
  const [designs, setDesigns] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const fetchPrivateDesigns = async () => {
    try {
      const res = await axios.get("http://localhost:5050/api/designs/explore/private");
      setDesigns(res.data.designs || []);
    } catch (err) {
      console.error(err);
      Swal.fire({
        icon: "error",
        title: "Error fetching designs",
        text: err.response?.data?.msg || "Something went wrong",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPrivateDesigns();
  }, []);

  return (
    <div
      className="dashboard-page"
      style={{
        backgroundImage: `url(${bgImage})`,
        backgroundSize: "cover",
        backgroundRepeat: "no-repeat",
        backgroundAttachment: "fixed",
        minHeight: "100vh",
      }}
    >
      <Navbar />

      <div className="container py-5">
        <div className="d-flex justify-content-between align-items-center mb-4">
          <h2 className="fw-bold text-dark">My Designs</h2>
          <button
            className="btn btn-success btn-sm"
            onClick={() => navigate("/create-design")}
          >
            + New Design
          </button>
        </div>

        {loading ? (
          <div className="text-center mt-5 text-dark">
            <div className="spinner-border text-dark" role="status" />
            <p className="mt-2">Loading designs...</p>
          </div>
        ) : designs.length === 0 ? (
          <div className="text-center mt-5 text-dark">
            <p>No private designs found yet.</p>
            <button
              className="btn btn-primary"
              onClick={() => navigate("/create-design")}
            >
              + Create First Design
            </button>
          </div>
        ) : (
          <div className="row">
            {designs.map((design) => (
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
                  <p className="mb-1 text-muted">
                    <strong>Type:</strong> {design.type}
                  </p>
                  <p className="mb-2 text-muted">
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

export default Dashboard;