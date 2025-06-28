import React, { useEffect, useState } from 'react';
import api from '../api';
import './StudentApplications.css';
import { useNavigate } from 'react-router-dom';

function StudentApplications() {
  const [apps, setApps] = useState([]);
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchApplications = async () => {
      try {
        console.log('Fetching applications');
        const res = await api.get(`/student/applications/me?page=${page}&size=5`);
        setApps(res.data.content);
        setTotalPages(res.data.totalPages);
      } catch (error) {
        console.error('Error fetching applications:', error);
      }
    };
    fetchApplications();
  }, [page]);


  return (
    <div className="student-container">
      <h2>Your Applications</h2>
      <ul className="application-list">
        {apps.map(app => (
          <li key={app.id} className="application-item">
            <span>
              {app.companyName} – {app.role}
            </span>
            <span className="status">{app.status}</span>
          </li>
        ))}
      </ul>
      {apps.length === 0 && <p>No applications found.</p>}

      {/* Pagination controls */}
      <div>
        {page > 0 && (
          <button onClick={() => setPage(page - 1)}>Previous</button>
        )}
        <span> Page {page + 1} of {totalPages} </span>
        {page + 1 < totalPages && (
          <button onClick={() => setPage(page + 1)}>Next</button>
        )}
      </div>
      <button onClick={() => navigate('/')}>Back to Home</button>
    </div>
  );
}

export default StudentApplications;
