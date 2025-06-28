import React, { useState } from 'react';
import api from '../api';
import './StudentApplyForm.css';
import { useNavigate } from 'react-router-dom';

function StudentApplyForm() {
  const [form, setForm] = useState({
    rollNumber: '',
    studentName: '',
    companyName: '',
    type: '',
    role: 'software engineer',
    ctc: '',
    status: 'Pending',
  });
  const navigate = useNavigate();

  const handleChange = e => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

const handleSubmit = async (e) => {
  e.preventDefault();
  try {
    await api.post('/student/apply', form);
    alert('Application submitted!');
    navigate('/student'); // Redirect to student applications page
  } catch (error) {
    console.error('Submission failed:', error);
    alert('Failed to submit application.');
  }
};


  return (
    <form onSubmit={handleSubmit}>
      <input name="rollNumber" placeholder="Roll no." onChange={handleChange} required />
      <input name="studentName" placeholder="Name" onChange={handleChange} required />
      <input name="companyName" placeholder="Company" onChange={handleChange} required />
      
      <select name="type" onChange={handleChange} required defaultValue="">
      <option value="" disabled>Select type</option>
      <option value="Placement">Placement</option>
      <option value="Internship">Internship</option>
    </select>

      <input name="ctc" placeholder="CTC" onChange={handleChange} required />
      <button type="submit">Apply</button>
    </form>
  );
}

export default StudentApplyForm;
