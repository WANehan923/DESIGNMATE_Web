import React from "react";
import { useNavigate } from "react-router-dom";
import objectImages from "../data/objectImages";
import "../styles/Shop.css"; 

const productPrices = {
  "D-Bed-Black": 45000,
  "D-Bed-Brown": 46000,
  "D-Bed-White": 47000,
  "S-Bed-Black": 30000,
  "S-Bed-Brown": 31000,
  "S-Bed-White": 32000,
  "Sofa-Black": 55000,
  "Sofa-Brown": 56000,
  "Sofa-White": 57000,
  "Sofa-Yellow": 58000,
  "Table-Brown": 25000,
  "Table-DBrown": 26000,
  "Table-White": 27000,
};

const Shop = () => {
  const navigate = useNavigate();

  const handleViewProduct = (product) => {
    navigate(`/product/${product.type}`, { state: product });
  };

  return (
    <div className="container my-5">
      <h2 className="text-center fw-bold mb-4">Furniture Shop</h2>
      <div className="row">
        {objectImages.map((product) => (
          <div className="col-md-4 mb-4" key={product.type}>
            <div className="card h-100 shadow-sm">
              <img
                src={product.image}
                className="card-img-top"
                alt={product.label}
                style={{ height: "200px", objectFit: "contain" }}
              />
              <div className="card-body d-flex flex-column justify-content-between">
                <h5 className="card-title">{product.label}</h5>
                <p className="card-text text-success fw-semibold">
                  Rs. {productPrices[product.type]?.toLocaleString() || "N/A"}
                </p>
                <button
                  className="btn btn-primary w-100 mt-2"
                  onClick={() => handleViewProduct(product)}
                >
                  Buy Now
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Shop;