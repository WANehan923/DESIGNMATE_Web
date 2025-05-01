import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';
import Swal from 'sweetalert2';
import authImg from '../assets/auth.png'; 

const Register = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('user');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await axios.post('http://localhost:5050/api/auth/register', {
        email,
        password,
        role,
      });

      Swal.fire('Registered Successfully!', '', 'success');
      navigate('/login');
    } catch (err) {
      Swal.fire(
        'Registration Failed',
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
        {/* Left image side */}
        <div className="col-md-6 d-none d-md-flex align-items-center justify-content-center p-0" style={{ backgroundColor: '#cb9351' }}>
          <img src={authImg} alt="Register visual" className="img-fluid" style={{ maxHeight: '90%', objectFit: 'contain' }} />
        </div>

        {/* Right form side */}
        <div className="col-md-6 d-flex align-items-center justify-content-center" style={{ backgroundColor: '#edc396' }}>
          <div className="p-5 rounded" style={{ width: '100%', maxWidth: '400px', backgroundColor: '#f3c993', borderRadius: '2rem' }}>
            <h2 className="text-center mb-4 text-dark fw-bold">Register</h2>
            <form onSubmit={handleRegister}>
              <input
                className="form-control mb-3"
                type="email"
                placeholder="Email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              <input
                className="form-control mb-3"
                type="password"
                placeholder="Password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <select
                className="form-control mb-4"
                value={role}
                onChange={(e) => setRole(e.target.value)}
              >
                <option value="user">User</option>
                <option value="admin">Admin</option>
              </select>
              <button
                className="btn btn-success w-100 fw-semibold"
                type="submit"
                disabled={loading}
              >
                {loading ? 'Registering...' : 'Register'}
              </button>
              <p className="mt-3 text-center text-dark">
                Already have an account?{' '}
                <Link to="/login" className="text-primary fw-semibold">Login</Link>
              </p>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;