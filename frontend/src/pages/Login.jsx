import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';
import Swal from 'sweetalert2';
import authImg from '../assets/auth.png';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await axios.post('http://localhost:5050/api/auth/login', {
        email,
        password
      });

      localStorage.setItem('token', res.data.token);

      const profileRes = await axios.get('http://localhost:5050/api/auth/me', {
        headers: { Authorization: `Bearer ${res.data.token}` },
      });

      localStorage.setItem('user', JSON.stringify(profileRes.data));
      localStorage.setItem('userId', profileRes.data._id); 

      Swal.fire('Login Successful!', '', 'success');
      navigate('/dashboard');
    } catch (err) {
      Swal.fire(
        'Login Failed',
        err.response?.data?.msg || 'Server error',
        'error'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container-fluid vh-100">
      <div className="row h-100">
        {/* Left Image Side */}
        <div className="col-md-6 d-none d-md-flex align-items-center justify-content-center p-0" style={{ backgroundColor: '#cb9351' }}>
          <img src={authImg} alt="Login visual" className="img-fluid" style={{ maxHeight: '90%', objectFit: 'contain' }} />
        </div>

        {/* Right Login Form Side */}
        <div className="col-md-6 d-flex align-items-center justify-content-center" style={{ backgroundColor: '#edc396' }}>
          <div className="p-5 rounded" style={{ width: '100%', maxWidth: '400px', backgroundColor: '#f3c993', borderRadius: '2rem' }}>
            <h2 className="text-center mb-4 text-dark fw-bold">Login</h2>
            <form onSubmit={handleLogin}>
              <input
                className="form-control mb-3"
                type="email"
                placeholder="Email"
                value={email}
                required
                onChange={(e) => setEmail(e.target.value)}
              />
              <input
                className="form-control mb-4"
                type="password"
                placeholder="Password"
                value={password}
                required
                onChange={(e) => setPassword(e.target.value)}
              />
              <button
                className="btn btn-primary w-100 fw-semibold"
                type="submit"
                disabled={loading}
              >
                {loading ? 'Logging in...' : 'Login'}
              </button>
              <p className="mt-3 text-center text-dark">
                New user?{" "}
                <Link to="/register" className="text-primary fw-semibold">
                  Register here
                </Link>
              </p>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;