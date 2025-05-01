import React, { useEffect, useState } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import Navbar from "../components/Navbar";
import defaultAvatar from "../assets/user-avatar.png";
import bgImage from "../assets/heroimg.svg";
import "../styles/Explore.css";

const UserProfile = () => {
  const [user, setUser] = useState(null);
  const [designs, setDesigns] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchUser = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.get("http://localhost:5050/api/auth/me", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setUser(res.data.user);
    } catch (err) {
      console.error("User fetch error:", err.message);
      Swal.fire("Error", "Failed to load user data", "error");
    }
  };

  const fetchPrivateDesigns = async () => {
    try {
      const res = await axios.get("http://localhost:5050/api/designs/explore/private");
      setDesigns(res.data.designs || []);
    } catch (err) {
      console.error("Failed to fetch designs:", err.message);
      Swal.fire("Error", "Failed to load designs", "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUser();
    fetchPrivateDesigns();
  }, []);

  return (
    <div
      className="user-profile-page"
      style={{
        minHeight: "100vh",
        backgroundImage: `url(${bgImage})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
        backgroundAttachment: "fixed",
      }}
    >
      <Navbar />

      <div className="container py-5">
        {/* Profile Card */}
        <div
          className="mx-auto text-center p-5 mb-5"
          style={{
            maxWidth: "600px",
            background: "rgba(255,255,255,0.75)",
            backdropFilter: "blur(8px)",
            borderRadius: "30px",
          }}
        >
          <h2
            className="fw-bold mb-4"
            style={{ fontFamily: "'Abril Fatface', cursive", fontSize: "2rem" }}
          >
            User Profile
          </h2>
          <img
            src={defaultAvatar}
            alt="User"
            className="rounded-circle mb-4"
            style={{ width: "120px", height: "120px", objectFit: "cover" }}
          />
          {user ? (
            <>
              <p className="mb-2">
                <strong>Email:</strong>{" "}
                <span className="text-dark fw-semibold">{user.email}</span>
              </p>
              <p>
                <strong>User ID:</strong>{" "}
                <span className="text-dark fw-semibold">{user.id}</span>
              </p>
            </>
          ) : (
            <p>Loading user info...</p>
          )}
        </div>

        {/* Divider */}
        <hr className="mb-5" />
        <h5 className="fw-bold mb-4">Your Design History</h5>

        {/* Design History */}
        {loading ? (
          <p>Loading designs...</p>
        ) : designs.length === 0 ? (
          <p className="text-danger">No private designs available.</p>
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
                  <p className="text-muted mb-1"><strong>Type:</strong> {design.type}</p>
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
                  <p className="text-muted mb-0">
                    <small>
                      Created:{" "}
                      {design.createdAt?.seconds
                        ? new Date(design.createdAt.seconds * 1000).toLocaleString()
                        : "N/A"}
                    </small>
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default UserProfile;