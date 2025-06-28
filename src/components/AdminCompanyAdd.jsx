import React, { useState } from 'react';
import api from '../api';
import { useNavigate } from 'react-router-dom';

function AdminCompanyAdd() {
  const [form, setForm] = useState({
    companyName: '',
    jobDescription: '',
    requiredCgpa: '',
    allowedBacklogHistory: false,
    allowActiveBacklog: '',
    slab: '',
    formLink: '',
    validity: ''
  });

  const [errors, setErrors] = useState({});
  const navigate = useNavigate();

  const handleChange = e => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const validate = () => {
    const newErrors = {};
    if (!form.companyName.trim()) newErrors.companyName = 'Company name is required';
    if (!form.jobDescription.trim()) newErrors.jobDescription = 'Job description is required';
    if (!form.formLink.trim()) newErrors.formLink = 'Form link is required';
    if (!form.validity.trim()) newErrors.validity = 'Validity is required';

    const cgpa = parseFloat(form.requiredCgpa);
    if (isNaN(cgpa) || cgpa < 0 || cgpa > 10)
      newErrors.requiredCgpa = 'CGPA must be a number between 0 and 10';

    const backlog = parseInt(form.allowActiveBacklog);
    if (isNaN(backlog) || backlog < 0)
      newErrors.allowActiveBacklog = 'Backlogs must be a non-negative number';

    if (!form.slab) newErrors.slab = 'Please select a slab';
    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    try {
      await api.post('/admin/company/add', form);
      alert("Notification submitted successfully!");
      navigate('/');
    } catch (error) {
      console.error('Submission failed:', error);
      setErrors({ api: 'Failed to submit notification. Please try again.' });
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input name="companyName" placeholder="Company Name" onChange={handleChange} />
      {errors.companyName && <p className="error">{errors.companyName}</p>}

      <input name="jobDescription" placeholder="Job Description" onChange={handleChange} />
      {errors.jobDescription && <p className="error">{errors.jobDescription}</p>}

      <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
        <input
          type="number"
          step="0.01"
          name="requiredCgpa"
          placeholder="Required CGPA"
          onChange={handleChange}
        />
        {errors.requiredCgpa && <p className="error">{errors.requiredCgpa}</p>}

        <label>
          <input
            type="checkbox"
            name="allowedBacklogHistory"
            onChange={e => setForm({ ...form, allowedBacklogHistory: e.target.checked })}
          />
          Allow Backlog History
        </label>

        <input
          type="number"
          name="allowActiveBacklog"
          placeholder="Allowed Active Backlogs"
          onChange={handleChange}
        />
        {errors.allowActiveBacklog && <p className="error">{errors.allowActiveBacklog}</p>}
      </div>

      <select name="slab" onChange={handleChange} defaultValue="">
        <option value="" disabled>Select Slab</option>
        <option value="SLAB1">Slab 1</option>
        <option value="SLAB2">Slab 2</option>
        <option value="SLAB3">Slab 3</option>
      </select>
      {errors.slab && <p className="error">{errors.slab}</p>}

      <input name="formLink" placeholder="G Form link" onChange={handleChange} />
      {errors.formLink && <p className="error">{errors.formLink}</p>}

      <input name="validity" placeholder="Validity(hrs)" onChange={handleChange} />
      {errors.validity && <p className="error">{errors.validity}</p>}

      {errors.api && <p className="error">{errors.api}</p>}
 
      <button type="submit">Add Company</button>
    </form>
  );
}

export default AdminCompanyAdd;
