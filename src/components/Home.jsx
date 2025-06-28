import React, { useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../AuthContext';
import api from '../api'; // ✅ Import centralized API instance
import './Home.css'; // Import your CSS file for styling
import { useState } from 'react';

function Home() {
    const { token, logout, role } = useContext(AuthContext);
    const navigate = useNavigate();
    const [name, setName] = useState('');

    useEffect(() => {
        if (!token) {
            navigate('/login');
            return;
        }
        api.get('/general/user') //api.jsx attaches the token(header) automatically
            .then(res => setName(res.data))
            .catch(err => {
                console.error(err);
                alert('Session expired');
                logout();
                navigate('/login');
            });
    }, [token]);

    return (
        <div className="home-container">
            <h1>Welcome, {name}.</h1>
            <p>This is a simple application to track placement applications.</p>
            <p>Use the navigation links to explore the application.</p>
            <div className='home-buttons'>
                {role === 'STUDENT' && (
                    <>
                        <button onClick={() => navigate('/student/company')}>Apply Now</button>
                        <button onClick={() => navigate('/student')}>My Applications</button>
                    </>
                )}
                {role === 'ADMIN' && (
                    <>
                        <button onClick={() => navigate('/admin/company/add')}>Add new Company</button>
                        <button onClick={() => navigate('/admin/company')}>View all Companies</button>
                        {/* <button onClick={() => navigate('/admin/all')}>View All Applications</button> */}
                    </>
                )}
            </div>
        </div>
    );
}

export default Home;