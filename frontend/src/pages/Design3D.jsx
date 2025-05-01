import React, { useState, useRef, useEffect, Suspense } from "react";
import { Canvas, useLoader, useThree, useFrame } from "@react-three/fiber";
import { OrbitControls, TransformControls } from "@react-three/drei";
import { OBJLoader } from "three-stdlib";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
import Swal from "sweetalert2";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { FaTrash } from "react-icons/fa";
import * as THREE from "three";
import "../styles/CreateDesign.css";

const ObjModel = ({ path }) => {
  const obj = useLoader(OBJLoader, path);
  return <primitive object={obj} />;
};

const GlbModel = ({ path }) => {
  const gltf = useLoader(GLTFLoader, path);
  return <primitive object={gltf.scene} />;
};

const ModelMesh = ({ model, selected, onSelect, onUpdate }) => {
  const ref = useRef();

  useEffect(() => {
    if (selected && ref.current) {
      onUpdate(model.id, "position", ref.current.position.toArray());
      onUpdate(model.id, "rotation", [
        ref.current.rotation.x,
        ref.current.rotation.y,
        ref.current.rotation.z,
      ]);
      onUpdate(model.id, "scale", ref.current.scale.toArray());
    }
  }, [selected]);

  return (
    <group>
      <mesh
        ref={ref}
        position={model.position}
        rotation={model.rotation}
        scale={model.scale}
        onClick={(e) => {
          e.stopPropagation();
          onSelect(model.id);
        }}
      >
        {model.type === "obj" ? <ObjModel path={model.path} /> : <GlbModel path={model.path} />}
      </mesh>

      {selected && (
        <TransformControls
          object={ref.current}
          mode="translate"
          onObjectChange={() => {
            if (!ref.current) return;
            const pos = ref.current.position.toArray();
            onUpdate(model.id, "position", pos);
            onUpdate(model.id, "rotation", [
              ref.current.rotation.x,
              ref.current.rotation.y,
              ref.current.rotation.z,
            ]);
            onUpdate(model.id, "scale", ref.current.scale.toArray());
          }}
        />
      )}
    </group>
  );
};

const WallsAndFloor = ({ roomWidth, roomLength, roomHeight, wallColor, floorColor }) => {
  const { camera } = useThree();
  const [hideWall, setHideWall] = useState("");

  useFrame(() => {
    const camDir = new THREE.Vector3();
    camera.getWorldDirection(camDir);

    if (Math.abs(camDir.x) > Math.abs(camDir.z)) {
      if (camDir.x > 0) setHideWall("left");
      else setHideWall("right");
    } else {
      if (camDir.z > 0) setHideWall("back");
      else setHideWall("front");
    }
  });

  return (
    <group>
      {hideWall !== "back" && (
        <mesh position={[0, roomHeight / 2, -roomLength / 2]}>
          <planeGeometry args={[roomWidth, roomHeight]} />
          <meshStandardMaterial color={wallColor} side={THREE.DoubleSide} />
        </mesh>
      )}
      {hideWall !== "front" && (
        <mesh position={[0, roomHeight / 2, roomLength / 2]} rotation={[0, Math.PI, 0]}>
          <planeGeometry args={[roomWidth, roomHeight]} />
          <meshStandardMaterial color={wallColor} side={THREE.DoubleSide} />
        </mesh>
      )}
      {hideWall !== "left" && (
        <mesh position={[-roomWidth / 2, roomHeight / 2, 0]} rotation={[0, Math.PI / 2, 0]}>
          <planeGeometry args={[roomLength, roomHeight]} />
          <meshStandardMaterial color={wallColor} side={THREE.DoubleSide} />
        </mesh>
      )}
      {hideWall !== "right" && (
        <mesh position={[roomWidth / 2, roomHeight / 2, 0]} rotation={[0, -Math.PI / 2, 0]}>
          <planeGeometry args={[roomLength, roomHeight]} />
          <meshStandardMaterial color={wallColor} side={THREE.DoubleSide} />
        </mesh>
      )}
      <mesh position={[0, 0, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[roomWidth, roomLength]} />
        <meshStandardMaterial color={floorColor} side={THREE.DoubleSide} />
      </mesh>
    </group>
  );
};

const Design3D = () => {
  const [models, setModels] = useState([]);
  const [selectedModelId, setSelectedModelId] = useState(null);
  const [roomWidth, setRoomWidth] = useState(8);
  const [roomLength, setRoomLength] = useState(8);
  const [roomHeight, setRoomHeight] = useState(3);
  const [wallColor, setWallColor] = useState("#f5f5f5");
  const [floorColor, setFloorColor] = useState("#e0cda9");
  const [modelType, setModelType] = useState("Chair1");
  const [isPublic, setIsPublic] = useState(false);
  const navigate = useNavigate();

  const modelPaths = {
    Bookrack: "/models/Bookrack.glb",
    Chair1: "/models/Chair1.glb",
    Chair2: "/models/Chair2.glb",
    Coffeetable: "/models/coffeetable.glb",
    GamingChair: "/models/gamingchair.glb",
    Rack2: "/models/rack2.glb",
    Couch: "/models/couch02.glb",
    Sofa: "/models/sofa1.glb",
    Sofa2: "/models/soffaaaa.glb",
  };

  const handleAddModel = () => {
    const id = Date.now();
    const path = modelPaths[modelType];
    const type = path.endsWith(".glb") ? "glb" : "obj";

    const newModel = {
      id,
      name: modelType,
      path,
      type,
      position: [0, 0, 0],
      rotation: [0, 0, 0],
      scale: [0.5, 0.5, 0.5],
    };

    setModels([...models, newModel]);
    setSelectedModelId(id);
  };

  const updateModel = (id, field, value) => {
    setModels((prev) => prev.map((m) => (m.id === id ? { ...m, [field]: value } : m)));
  };

  const deleteModel = (id) => {
    setModels((prev) => prev.filter((m) => m.id !== id));
    if (selectedModelId === id) setSelectedModelId(null);
  };

  const handleSubmit = async () => {
    const token = localStorage.getItem("token");
    if (!token) return Swal.fire("Please login.");
    if (models.length === 0) return Swal.fire("Add at least one model.");

    const formData = new FormData();
    formData.append("name", "My 3D Design");
    formData.append("type", "3D");
    formData.append("isPublic", isPublic);
    formData.append("objects", JSON.stringify(models));

    try {
      await axios.post("http://localhost:5050/api/designs/save", formData, {
        headers: { Authorization: `Bearer ${token}` },
      });
      Swal.fire("Success", "Design saved!", "success");
      navigate("/dashboard");
    } catch {
      Swal.fire("Error", "Could not save design", "error");
    }
  };

  return (
    <div className="d-flex" style={{ minHeight: "100vh" }}>
      {/* Canvas */}
      <div className="flex-grow-1">
        <Canvas camera={{ position: [10, 6, 10], fov: 50 }}>
          <ambientLight intensity={0.7} />
          <directionalLight position={[5, 10, 5]} />
          <OrbitControls enablePan={false} />
          <Suspense fallback={null}>
            <WallsAndFloor
              roomWidth={roomWidth}
              roomLength={roomLength}
              roomHeight={roomHeight}
              wallColor={wallColor}
              floorColor={floorColor}
            />
            {models.map((model) => (
              <ModelMesh
                key={model.id}
                model={model}
                selected={selectedModelId === model.id}
                onSelect={setSelectedModelId}
                onUpdate={updateModel}
              />
            ))}
          </Suspense>
        </Canvas>
      </div>

      {/* Sidebar */}
      <div
        className="p-4"
        style={{
          width: "400px",
          backgroundColor: "#f3ede7",
          borderTopLeftRadius: "40px",
          borderBottomLeftRadius: "40px",
          boxShadow: "0 0 15px rgba(0,0,0,0.1)",
        }}
      >
        <h3 className="fw-bold mb-4">Create 3D Design</h3>

        <div className="mb-3">
          <label>Room Width (m)</label>
          <input type="range" min="3" max="20" value={roomWidth} onChange={(e) => setRoomWidth(parseFloat(e.target.value))} className="form-range" />
        </div>

        <div className="mb-3">
          <label>Room Length (m)</label>
          <input type="range" min="3" max="20" value={roomLength} onChange={(e) => setRoomLength(parseFloat(e.target.value))} className="form-range" />
        </div>

        <div className="mb-3">
          <label>Room Height (m)</label>
          <input type="range" min="2" max="6" value={roomHeight} onChange={(e) => setRoomHeight(parseFloat(e.target.value))} className="form-range" />
        </div>

        <div className="mb-3">
          <label>Wall Color</label>
          <input type="color" className="form-control form-control-color" value={wallColor} onChange={(e) => setWallColor(e.target.value)} />
        </div>

        <div className="mb-3">
          <label>Floor Color</label>
          <input type="color" className="form-control form-control-color" value={floorColor} onChange={(e) => setFloorColor(e.target.value)} />
        </div>

        <div className="mb-3">
          <label>Select Object</label>
          <select className="form-select" value={modelType} onChange={(e) => setModelType(e.target.value)}>
            {Object.keys(modelPaths).map((key) => (
              <option key={key} value={key}>{key}</option>
            ))}
          </select>
        </div>

        <button className="btn btn-success w-100 mb-3" onClick={handleAddModel}>
          + Add Model
        </button>

        <div className="form-check mb-3">
          <input type="checkbox" className="form-check-input" checked={isPublic} onChange={(e) => setIsPublic(e.target.checked)} />
          <label className="form-check-label">Make this design public</label>
        </div>

        <button className="btn btn-primary w-100 mb-4" onClick={handleSubmit}>
          Save Design
        </button>

        {models.length > 0 && (
          <div>
            <h6 className="text-center mb-2">Manage Objects</h6>
            {models.map((obj) => (
              <div key={obj.id} className="bg-white border rounded p-2 mb-3">
                <div className="d-flex justify-content-between">
                  <strong>{obj.name}</strong>
                  <button className="btn btn-sm btn-outline-danger" onClick={() => deleteModel(obj.id)}>
                    <FaTrash />
                  </button>
                </div>
                <div className="d-flex gap-2 mt-2">
                  <button className="btn btn-sm btn-outline-dark" onClick={() => handleScaleUp(obj.id)}>Scale +</button>
                  <button className="btn btn-sm btn-outline-dark" onClick={() => handleScaleDown(obj.id)}>Scale -</button>
                  <button className="btn btn-sm btn-outline-dark" onClick={() => handleRotateLeft(obj.id)}>Rotate ➡</button>
                  <button className="btn btn-sm btn-outline-dark" onClick={() => handleRotateRight(obj.id)}>Rotate ⬅</button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Design3D;