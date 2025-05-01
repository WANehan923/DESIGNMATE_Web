import React from 'react';
import '../styles/Home.css';
import heroimg from '../assets/heroimg1.svg';
import can1 from '../assets/2.png';
import can2 from '../assets/1.png';
import can3 from '../assets/3.png';
import img from '../assets/imghome1.png';
import { useNavigate, Link } from 'react-router-dom';

const Home = () => {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  const handleAuth = () => {
    if (token) {
      localStorage.removeItem("token");
      navigate("/login");
    } else {
      navigate("/login");
    }
  };

  return (
    <div className="home-page">
      {/* Navbar */}
      <nav className="navbar bg-transparent position-absolute w-100 d-flex justify-content-between px-4 py-3 z-3">
        <h5 className="m-0 fw-bold text-uppercase text-white">DESIGNMATE</h5>
        <div className="ms-auto d-flex gap-3 align-items-center">
          <button className="btn btn-light btn-sm" onClick={() => navigate("/dashboard")}>
            Go to Dashboard
          </button>
          <button className="btn btn-light btn-sm" onClick={handleAuth}>
            {token ? 'Log Out' : 'Log In'}
          </button>
        </div>
      </nav>

      {/* Hero Section */}
      <header
        className="hero-section d-flex align-items-center"
        style={{
          backgroundImage: `url(${heroimg})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          height: '100vh',
        }}
      >
        <div className="container text-white text-start">
          <div className="col-lg-6 px-4">
            <h1 className="display-3 fw-bold mb-4" style={{ fontFamily: "'Georgia', serif" }}>
              Design Your<br />Dream home
            </h1>
            <div className="d-flex gap-3">
              <button
                className="btn btn-warning px-4 fw-semibold"
                onClick={() => navigate('/design3d')}
              >
                3D View
              </button>
              <button
                className="btn btn-outline-light px-4 fw-semibold"
                onClick={() => navigate('/create-design')}
              >
                2D View
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Features */}
      <section className="container py-5">
        <h2 className="text-center mb-4">Features</h2>
        <div className="row justify-content-center">
          <div className="col-md-4 mb-4">
            <div className="card shadow-sm">
              <img src={can2} className="card-img-top" alt="3D Preview" />
              <div className="card-body text-center">
                <h5 className="card-title">3D Preview</h5>
                <p className="card-text">Experience your design from every angle in real-time 3D.</p>
              </div>
            </div>
          </div>
          <div className="col-md-4 mb-4">
            <div className="card shadow-sm">
              <img src={can1} className="card-img-top" alt="Design Freely" />
              <div className="card-body text-center">
                <h5 className="card-title">Design Freely</h5>
                <p className="card-text">Craft rooms and furniture layouts with drag-and-drop tools.</p>
              </div>
            </div>
          </div>
          <div className="col-md-4 mb-4">
            <div className="card shadow-sm">
              <img src={can3} className="card-img-top" alt="Export PDF" />
              <div className="card-body text-center">
                <h5 className="card-title">Export PDF</h5>
                <p className="card-text">Download your project or share your design with others easily.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-5 bg-light">
        <div className="container text-center">
          <h3 className="mb-4">How It Works</h3>
          <div className="row text-muted">
            <div className="col-md-3"><strong>1. Login</strong><br />Create a free account to begin.</div>
            <div className="col-md-3"><strong>2. Choose Mode</strong><br />Pick 2D or 3D based on your vision.</div>
            <div className="col-md-3"><strong>3. Add Furniture</strong><br />Access a variety of design elements.</div>
            <div className="col-md-3"><strong>4. Save & Share</strong><br />Download your design or share it online.</div>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-5 cta-section">
        <div className="container d-flex flex-wrap align-items-center justify-content-between">
          <div className="text-content mb-4">
            <h2 className="fw-bold">Start Designing your dream room.</h2>
            <p className="text-muted">Jump into the editor and bring your ideas to life.</p>
            <button className="btn btn-warning px-4" onClick={() => navigate('/dashboard')}>
              Start now
            </button>
          </div>
          <div className="img-wrapper">
            <img src={img} alt="Furniture" className="img-fluid rounded" style={{ maxWidth: '450px' }} />
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-dark text-white py-4 text-center">
        <div className="container">
          <p className="mb-2">
            <Link to="/about" className="text-warning text-decoration-none">
              About DesignMate
            </Link>
          </p>
          <p className="mb-0">&copy; {new Date().getFullYear()} DesignMate. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default Home;