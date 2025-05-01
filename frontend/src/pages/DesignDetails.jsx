import React, { useEffect, useState, useRef, Suspense } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import Swal from "sweetalert2";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import { Canvas, useLoader } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import { OBJLoader } from "three-stdlib";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
import Navbar from "../components/Navbar"; 
import heroBg from "../assets/heroimg.svg";
import "../styles/DesignDetails.css";

// Model Loaders
const ObjModel = ({ path }) => {
  const obj = useLoader(OBJLoader, path);
  return <primitive object={obj} />;
};

const GlbModel = ({ path }) => {
  const gltf = useLoader(GLTFLoader, path);
  return <primitive object={gltf.scene} />;
};

const RenderModel = ({ model }) => (
  <group position={model.position} rotation={model.rotation} scale={model.scale}>
    {model.type === "obj" ? <ObjModel path={model.path} /> : <GlbModel path={model.path} />}
  </group>
);

const DesignDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const previewRef = useRef(null);
  const [design, setDesign] = useState(null);

  useEffect(() => {
    fetchDesign();
  }, [id]);

  const fetchDesign = async () => {
    try {
      const res = await axios.get(`http://localhost:5050/api/designs/${id}`);
      setDesign(res.data);
    } catch {
      Swal.fire("Error", "Design not found", "error");
    }
  };

  const togglePublic = async () => {
    const token = localStorage.getItem("token");
    if (!token) return Swal.fire("Please login");

    try {
      await axios.put(
        `http://localhost:5050/api/designs/${id}/visibility`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setDesign({ ...design, isPublic: !design.isPublic });
      Swal.fire("Updated", "Visibility updated", "success");
    } catch {
      Swal.fire("Error", "Failed to update visibility", "error");
    }
  };

  const deleteDesign = async () => {
    const confirm = await Swal.fire({
      icon: "warning",
      title: "Are you sure?",
      text: "This will permanently delete the design!",
      showCancelButton: true,
      confirmButtonText: "Delete",
    });
    if (!confirm.isConfirmed) return;

    const token = localStorage.getItem("token");
    if (!token) return Swal.fire("Please login");

    try {
      await axios.delete(`http://localhost:5050/api/designs/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      Swal.fire("Deleted", "Design removed", "success");
      navigate("/dashboard");
    } catch {
      Swal.fire("Error", "Failed to delete design", "error");
    }
  };

  const exportToPDF = async () => {
    if (!previewRef.current) return;
    const canvas = await html2canvas(previewRef.current);
    const pdf = new jsPDF("landscape", "pt", "a4");
    pdf.addImage(canvas.toDataURL("image/png"), "PNG", 40, 40, 500, 300);
    pdf.save(`${design.name}_preview.pdf`);
  };

  const handleEdit = () => {
    if (design?.type === "2D") navigate(`/edit-2d/${id}`);
    if (design?.type === "3D") navigate(`/edit-3d/${id}`);
  };

  return (
    <div
      className="min-vh-100"
      style={{
        backgroundImage: `url(${heroBg})`,
        backgroundSize: "cover",
        backgroundAttachment: "fixed",
        backgroundPosition: "center",
      }}
    >
      {/* Navbar from component */}
      <Navbar />

      {/* Back Button */}
      <div className="container py-4">
        <button onClick={() => navigate("/dashboard")} className="btn btn-outline-dark mb-3">
          ← Back to Dashboard
        </button>

        <div className="bg-white p-4 rounded shadow">
          {design ? (
            <>
              <h2 className="fw-bold">{design.name}</h2>
              <p><strong>Type:</strong> {design.type}</p>
              <p>
                <strong>Visibility:</strong>{" "}
                <span className={design.isPublic ? "text-success" : "text-danger"}>
                  {design.isPublic ? "Public" : "Private"}
                </span>
              </p>
              <p>
                <strong>Objects:</strong>{" "}
                {design.designData?.objects?.map((obj, i) => (
                  <span key={i} className="badge bg-secondary text-white me-2">
                    {obj.type || obj.name}
                  </span>
                ))}
              </p>
              <p className="text-muted">
                <small>
                  Created:{" "}
                  {design.createdAt?.seconds
                    ? new Date(design.createdAt.seconds * 1000).toLocaleString()
                    : "N/A"}
                </small>
              </p>

              {/* Preview */}
              <div className="my-4">
                <h5 className="fw-semibold mb-3">Design Preview</h5>

                {design.type === "2D" && (
                  <div
                    ref={previewRef}
                    className="border rounded shadow"
                    style={{
                      backgroundImage: design.designData?.background
                        ? `url(http://localhost:5050/uploads/${design.designData.background})`
                        : "none",
                      backgroundSize: "cover",
                      backgroundPosition: "center",
                      position: "relative",
                      width: "100%",
                      height: "450px",
                    }}
                  >
                    {design.designData.objects.map((obj, i) => (
                      <img
                        key={i}
                        src={obj.image}
                        alt={obj.type}
                        style={{
                          position: "absolute",
                          left: obj.x,
                          top: obj.y,
                          width: obj.width,
                          height: obj.height,
                          transform: `rotateX(${obj.rotateX || 0}deg) rotateY(${obj.rotateY || 0}deg)`,
                        }}
                      />
                    ))}
                  </div>
                )}

                {design.type === "3D" && (
                  <div className="border rounded shadow" style={{ height: "450px" }}>
                    <Canvas camera={{ position: [3, 2, 5], fov: 50 }}>
                      <ambientLight intensity={0.6} />
                      <directionalLight position={[5, 10, 5]} />
                      <OrbitControls />
                      <Suspense fallback={null}>
                        {design.designData.objects.map((model, i) => (
                          <RenderModel key={i} model={model} />
                        ))}
                      </Suspense>
                    </Canvas>
                  </div>
                )}
              </div>

              {/* Actions */}
              <div className="d-flex flex-wrap gap-3">
                <button className="btn btn-outline-secondary" onClick={exportToPDF}>
                  Export as PDF
                </button>
                <button className="btn btn-outline-success" onClick={handleEdit}>
                  Edit Design
                </button>
                <button className="btn btn-outline-primary" onClick={togglePublic}>
                  Make {design.isPublic ? "Private" : "Public"}
                </button>
                <button className="btn btn-outline-danger" onClick={deleteDesign}>
                  Delete
                </button>
              </div>
            </>
          ) : (
            <p>Loading design...</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default DesignDetails;