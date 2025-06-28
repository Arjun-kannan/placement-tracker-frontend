import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Register.css';
import api from '../api';

function Register() {
  const [form, setForm] = useState({
    rollNumber: '',
    name: '',
    email: '',
    password: '',
    cgpa: '',
    activeBacklogs: '',
    backlogHistory: false,
  });

  const [errors, setErrors] = useState({});
  const navigate = useNavigate();

  const validate = async () => {
    const newErrors = {};

    const rollPattern = /^tve\d{2}[A-Za-z]{2}\d{3}$/;
    if (!form.rollNumber.trim()) {
      newErrors.name = 'Roll number is required';
    } else if (!rollPattern.test(form.rollNumber)) {
      newErrors.rollNumber = 'Invalid roll number format. Use tveYYXXZZZ';
    } else{
      const rollNumberExists = await api.get(`/api/v1/auth/check-roll?rollNumber=${form.rollNumber}`)
      if (rollNumberExists.data) {
        newErrors.rollNumber = 'Roll number already exists';
      }
    }
    if (!form.name.trim()) newErrors.name = 'Name is required';
    if (!form.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (form.email !== `${form.rollNumber}@cet.ac.in`) {
      newErrors.email = 'Email must be in the format: <rollnumber>@cet.ac.in';
    } else{
      const emailExists = await api.get(`/api/v1/auth/check-email?email=${form.email}`)
      if (emailExists.data) {
        newErrors.email = 'Email already exists';
      }
    }
    if (!form.password.trim()) newErrors.password = 'Password is required';
    if (!form.cgpa || form.cgpa < 0 || form.cgpa > 10)
      newErrors.cgpa = 'CGPA must be between 0 and 10';
    if (form.activeBacklogs < 0)
      newErrors.activeBacklogs = 'Backlogs cannot be negative';
    return newErrors;
  };

  const handleRegister = async () => {
    const validationErrors = await validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    try {
      await api.post('/api/v1/auth/register', form);
      navigate('/login');
    } catch (err) {
      console.error(err);
      setErrors({ api: 'Registration failed. Please try again.' });
    }
  };

  return (
    <div className="register-container">
      <div className="register-box">
        <h2>Register</h2>

        <label>
          Roll Number
          <input
            type="text"
            placeholder='tve22csxxx'
            onChange={(e) => setForm({ ...form, rollNumber: e.target.value, email: `${e.target.value}@cet.ac.in`})}
          />
        </label>
        {errors.rollNumber && <p className="error">{errors.rollNumber}</p>}

        <label>
          Name
          <input
            type="text"
            onChange={(e) => setForm({ ...form, name: e.target.value })}
          />
        </label>
        {errors.name && <p className="error">{errors.name}</p>}

        <div className="triple-field">
          <label>
            CGPA (0-10)
            <input
              type="number"
              step="0.01"
              onChange={(e) => setForm({ ...form, cgpa: e.target.value })}
            />
          </label>

          <label>
            Active Backlogs
            <input
              type="number"
              placeholder='0'
              value= '0'
              onChange={(e) =>
                setForm({ ...form, activeBacklogs: e.target.value })
              }
            />
          </label>

          <label className="checkbox-label">
            Backlog History
            <input
              type="checkbox"
              checked={form.backlogHistory}
              onChange={(e) =>
                setForm({ ...form, backlogHistory: e.target.checked })
              }
            />
          </label>
        </div>

        {errors.cgpa && <p className="error">{errors.cgpa}</p>}
        {errors.activeBacklogs && <p className="error">{errors.activeBacklogs}</p>}

        <label>
          Email
          <input
            type="email"
            placeholder={form.rollNumber ? `${form.rollNumber}@cet.ac.in` : '@cet.ac.in'}
            value={form.rollNumber ? `${form.rollNumber}@cet.ac.in` : '@cet.ac.in'}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
          />
        </label>
        {errors.email && <p className="error">{errors.email}</p>}

        <label>
          Password
          <input
            type="password"
            onChange={(e) => setForm({ ...form, password: e.target.value })}
          />
        </label>
        {errors.password && <p className="error">{errors.password}</p>}
        {errors.api && <p className="error">{errors.api}</p>}

        <button onClick={handleRegister}>Register</button>
        <button onClick={() => navigate('/login')}>Back to Login</button>
      </div>
    </div>
  );
}

export default Register;
