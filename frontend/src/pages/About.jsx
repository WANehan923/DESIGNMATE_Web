import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import bgImage from '../assets/heroimg.svg';

const About = () => {
  const [form, setForm] = useState({ name: '', email: '', message: '' });
  const navigate = useNavigate();
  const token = localStorage.getItem('token');

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    alert('Thanks for reaching out! We’ll get back to you soon.');
    setForm({ name: '', email: '', message: '' });
  };

  const handleAuth = () => {
    if (token) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      navigate('/login');
    } else {
      navigate('/login');
    }
  };

  return (
    <div
      className="about-page"
      style={{
        backgroundImage: `url(${bgImage})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundAttachment: 'fixed',
        minHeight: '100vh',
      }}
    >
      {/* Navigation */}
      <nav className="navbar bg-transparent position-absolute w-100 d-flex justify-content-between px-4 py-3">
        <h5 className="m-0 fw-bold text-white">DesignMate</h5>
        <div>
          <Link to="/" className="btn btn-outline-light btn-sm me-2">Home</Link>
          <button className="btn btn-light btn-sm" onClick={handleAuth}>
            {token ? 'Logout' : 'Login'}
          </button>
        </div>
      </nav>

      {/* Main Content */}
      <div className="container bg-white bg-opacity-90 rounded shadow p-5 mt-5">
        <h1 className="text-center fw-bold mb-3">Welcome to DesignMate</h1>
        <p className="text-center lead mb-5">
          Empowering interior design through interactive 2D/3D planning, real-time visualization, and seamless collaboration.
        </p>

        {/* Features */}
        <div className="row g-4 mb-5">
          <div className="col-md-4">
            <div className="card h-100 border-0 shadow-sm text-center p-3">
              <div className="card-body">
                <i className="bi bi-layout-text-window-reverse fs-1 text-primary"></i>
                <h5 className="card-title mt-3 fw-bold">Intuitive Interface</h5>
                <p className="card-text">Craft your space easily with a sleek and beginner-friendly interface.</p>
              </div>
            </div>
          </div>
          <div className="col-md-4">
            <div className="card h-100 border-0 shadow-sm text-center p-3">
              <div className="card-body">
                <i className="bi bi-camera-reels fs-1 text-success"></i>
                <h5 className="card-title mt-3 fw-bold">Live 3D Preview</h5>
                <p className="card-text">Explore your layout in real-time with interactive 3D simulation.</p>
              </div>
            </div>
          </div>
          <div className="col-md-4">
            <div className="card h-100 border-0 shadow-sm text-center p-3">
              <div className="card-body">
                <i className="bi bi-download fs-1 text-warning"></i>
                <h5 className="card-title mt-3 fw-bold">Easy Export</h5>
                <p className="card-text">Download your project or share it online with one click.</p>
              </div>
            </div>
          </div>
        </div>

        {/* Contact Form */}
        <div className="text-center">
          <h3 className="fw-bold mb-3">Let’s Connect</h3>
          <p className="mb-4">Got suggestions, ideas, or just want to say hi? Send us a message below.</p>

          <form onSubmit={handleSubmit} className="mx-auto" style={{ maxWidth: '600px' }}>
            <div className="mb-3 text-start">
              <label className="form-label fw-semibold">Full Name</label>
              <input
                type="text"
                name="name"
                value={form.name}
                onChange={handleChange}
                className="form-control"
                placeholder="Jane Smith"
                required
              />
            </div>
            <div className="mb-3 text-start">
              <label className="form-label fw-semibold">Email</label>
              <input
                type="email"
                name="email"
                value={form.email}
                onChange={handleChange}
                className="form-control"
                placeholder="jane@example.com"
                required
              />
            </div>
            <div className="mb-3 text-start">
              <label className="form-label fw-semibold">Your Message</label>
              <textarea
                name="message"
                value={form.message}
                onChange={handleChange}
                className="form-control"
                rows="4"
                placeholder="How can we help you?"
                required
              />
            </div>
            <button type="submit" className="btn btn-primary fw-bold px-4">Submit</button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default About;