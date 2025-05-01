import React, { useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import axios from "axios";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import "../styles/CreateDesign.css";
import objectImages from "../data/objectImages";

const gridSize = 20;

const CreateDesign = () => {
  const [name, setName] = useState("");
  const [type] = useState("2D");
  const [isPublic, setIsPublic] = useState(false);
  const [objects, setObjects] = useState([]);
  const [selectedObjectType, setSelectedObjectType] = useState(objectImages[0].type);
  const [roomWidthFt, setRoomWidthFt] = useState(30);
  const [roomHeightFt, setRoomHeightFt] = useState(20);
  const [bgImageFile, setBgImageFile] = useState(null);
  const [bgPreview, setBgPreview] = useState(null);

  const previewRef = useRef(null);
  const dragRef = useRef({ id: null, offsetX: 0, offsetY: 0 });
  const navigate = useNavigate();

  const addObject = () => {
    const config = objectImages.find(obj => obj.type === selectedObjectType);
    if (!config) return;
    const newObj = {
      id: Date.now(),
      type: config.type,
      image: config.image,
      x: 0,
      y: 0,
      width: 40,
      height: 40,
      rotateX: 0,
      rotateY: 0
    };
    setObjects([...objects, newObj]);
  };

  const handleDelete = (id) => {
    setObjects(objects.filter(obj => obj.id !== id));
  };

  const updateObject = (id, field, value) => {
    setObjects(prev =>
      prev.map(obj =>
        obj.id === id ? { ...obj, [field]: parseFloat(value) || 0 } : obj
      )
    );
  };

  const startDrag = (e, id) => {
    const obj = objects.find(o => o.id === id);
    if (!obj || !previewRef.current) return;
    const bounds = previewRef.current.getBoundingClientRect();
    dragRef.current = {
      id,
      offsetX: e.clientX - bounds.left - obj.x,
      offsetY: e.clientY - bounds.top - obj.y
    };
    window.addEventListener("mousemove", handleDragMove);
    window.addEventListener("mouseup", stopDrag);
  };

  const handleDragMove = (e) => {
    const { id, offsetX, offsetY } = dragRef.current;
    if (!id || !previewRef.current) return;
    const bounds = previewRef.current.getBoundingClientRect();
    const x = Math.round((e.clientX - bounds.left - offsetX) / gridSize) * gridSize;
    const y = Math.round((e.clientY - bounds.top - offsetY) / gridSize) * gridSize;
    setObjects(prev =>
      prev.map(obj => (obj.id === id ? { ...obj, x, y } : obj))
    );
  };

  const stopDrag = () => {
    dragRef.current = { id: null, offsetX: 0, offsetY: 0 };
    window.removeEventListener("mousemove", handleDragMove);
    window.removeEventListener("mouseup", stopDrag);
  };

  const handleBgChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setBgImageFile(file);
      setBgPreview(URL.createObjectURL(file));
    }
  };

  const handleExportPDF = async () => {
    if (!previewRef.current) return;
    const canvas = await html2canvas(previewRef.current);
    const pdf = new jsPDF("landscape", "pt", "a4");
    pdf.addImage(canvas.toDataURL("image/png"), "PNG", 40, 40, 500, 300);
    pdf.save(`${name || "design"}.pdf`);
  };

  const handleSubmit = async () => {
    const token = localStorage.getItem("token");
    if (!token) return Swal.fire("Please login.");
    if (!name || objects.length === 0) {
      return Swal.fire("Design name and at least one object required.");
    }

    const formData = new FormData();
    formData.append("name", name);
    formData.append("type", type);
    formData.append("isPublic", isPublic);
    formData.append("objects", JSON.stringify(objects));
    if (bgImageFile) {
      formData.append("bgImage", bgImageFile);
    }

    try {
      await axios.post("http://localhost:5050/api/designs/save", formData, {
        headers: { Authorization: `Bearer ${token}` }
      });
      Swal.fire("Success", "Design saved!", "success");
      navigate("/dashboard");
    } catch {
      Swal.fire("Error", "Could not save design", "error");
    }
  };

  return (
    <div className="d-flex" style={{ minHeight: "100vh" }}>
      {/* Canvas Side */}
      <div className="flex-grow-1 d-flex align-items-center justify-content-center p-3">
        <div
          ref={previewRef}
          style={{
            width: `${roomWidthFt * gridSize}px`,
            height: `${roomHeightFt * gridSize}px`,
            border: "2px dashed #aaa",
            backgroundColor: "#fff",
            backgroundImage: bgPreview ? `url(${bgPreview})` : "none",
            backgroundSize: "cover",
            backgroundPosition: "center",
            position: "relative"
          }}
        >
          {objects.map((obj) => (
            <img
              key={obj.id}
              src={obj.image}
              alt={obj.type}
              onMouseDown={(e) => startDrag(e, obj.id)}
              onDoubleClick={() => handleDelete(obj.id)}
              style={{
                position: "absolute",
                left: obj.x,
                top: obj.y,
                width: `${obj.width}px`,
                height: `${obj.height}px`,
                transform: `rotateX(${obj.rotateX}deg) rotateY(${obj.rotateY}deg)`,
                cursor: "grab"
              }}
            />
          ))}
        </div>
      </div>

      {/* Sidebar Panel */}
      <div
        className="p-4"
        style={{
          width: "400px",
          backgroundColor: "#f3ede7",
          borderTopLeftRadius: "40px",
          borderBottomLeftRadius: "40px",
          boxShadow: "0 0 15px rgba(0,0,0,0.1)"
        }}
      >
        <button onClick={() => navigate("/dashboard")} className="btn btn-dark rounded-circle mb-3">
          ←
        </button>
        <h3 className="fw-bold mb-4">Create New Design</h3>

        <div className="mb-3">
          <label className="fw-semibold">Design Name</label>
          <input
            type="text"
            className="form-control bg-warning-subtle"
            placeholder="Enter Design Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </div>

        <div className="d-flex gap-2 mb-3">
          <div>
            <label>Room Width (ft)</label>
            <input
              type="number"
              className="form-control bg-warning-subtle"
              value={roomWidthFt}
              onChange={(e) => setRoomWidthFt(parseFloat(e.target.value))}
            />
          </div>
          <div>
            <label>Room Height (ft)</label>
            <input
              type="number"
              className="form-control bg-warning-subtle"
              value={roomHeightFt}
              onChange={(e) => setRoomHeightFt(parseFloat(e.target.value))}
            />
          </div>
        </div>

        <div className="mb-3">
          <label>Background Image</label>
          <input type="file" className="form-control bg-warning-subtle" accept="image/*" onChange={handleBgChange} />
        </div>

        <div className="mb-3">
          <label>Select Object</label>
          <div className="d-flex gap-2">
            <select
              className="form-select bg-warning-subtle"
              value={selectedObjectType}
              onChange={(e) => setSelectedObjectType(e.target.value)}
            >
              {objectImages.map((obj) => (
                <option key={obj.type} value={obj.type}>{obj.label}</option>
              ))}
            </select>
            <button className="btn btn-success" onClick={addObject}>+</button>
          </div>
        </div>

        {/* Object Properties */}
        {objects.length > 0 && (
          <div className="bg-white p-2 rounded shadow-sm mb-3">
            <h6 className="fw-semibold mb-2">Edit Object Properties</h6>
            {objects.map((obj) => (
              <div key={obj.id} className="mb-2">
                <small className="fw-semibold">{obj.type}</small>
                <div className="row g-1">
                  <div className="col"><input type="number" className="form-control" value={(obj.width / 20).toFixed(1)} onChange={(e) => updateObject(obj.id, "width", parseFloat(e.target.value) * 20)} /></div>
                  <div className="col"><input type="number" className="form-control" value={(obj.height / 20).toFixed(1)} onChange={(e) => updateObject(obj.id, "height", parseFloat(e.target.value) * 20)} /></div>
                  <div className="col"><input type="number" className="form-control" value={obj.rotateX} onChange={(e) => updateObject(obj.id, "rotateX", e.target.value)} /></div>
                  <div className="col"><input type="number" className="form-control" value={obj.rotateY} onChange={(e) => updateObject(obj.id, "rotateY", e.target.value)} /></div>
                </div>
              </div>
            ))}
          </div>
        )}

        <div className="form-check mb-3">
          <input type="checkbox" className="form-check-input" checked={isPublic} onChange={(e) => setIsPublic(e.target.checked)} />
          <label className="form-check-label">Make this design public</label>
        </div>

        <button className="btn btn-primary w-100 mb-2 fw-bold" onClick={handleSubmit}>
          Save Design
        </button>
        <button className="btn btn-dark w-100 fw-bold" onClick={handleExportPDF}>
          Export to PDF
        </button>
      </div>
    </div>
  );
};

export default CreateDesign;