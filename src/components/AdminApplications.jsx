import React, { useState, useEffect } from 'react';
import api from '../api';
import './AdminApplications.css';

function AdminApplications() {
  const [page, setPage] = useState(0);
  const [apps, setApps] = useState([]);
  const [totalPages, setTotalPages] = useState(0);

  const fetch = async () => {
    const res = await api.get(`/admin/applications?page=${page}&size=5`);
    setApps(res.data.content);
    setTotalPages(res.data.totalPages);
  };

  useEffect(() => {
    fetch();
  }, [page]);


  const updateStatus = async (id, status) => {
    await api.put(`/admin/applications/${id}`, { status });
    fetch(); // reload list
  };

  return (
    <div className="admin-container">
      <h2>All Applications</h2>
      <ul className="app-list">
        {apps.map(app => (
          <li key={app.id} className="app-item">
            <span className="app-info">
              {app.studentName} | {app.companyName} | <b>{app.status}</b>
            </span>
            <span className="app-actions">
              {app.status === 'Pending' || app.status === 'Approved' && (
                <>
                  <button className="reject-button" onClick={() => updateStatus(app.id, 'Rejected')}>Reject</button>
                </>
              )}
              {app.status === 'Pending' || app.status === 'Rejected' && (
                <>
                  <button className="approve-button" onClick={() => updateStatus(app.id, 'Approved')}>Approve</button>
                </>
              )}
            </span>
          </li>
        ))}
      </ul>

      <div>
        <button disabled={page <= 0} onClick={() => setPage(page - 1)}>Previous</button>
        <span> Page {page + 1} of {totalPages} </span>
        <button disabled={page + 1 >= totalPages} onClick={() => setPage(page + 1)}>Next</button>
      </div>

    </div>
  );
}

export default AdminApplications;
