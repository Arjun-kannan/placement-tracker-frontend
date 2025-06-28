import React, { useEffect, useState } from 'react';
import api from '../api';
import './CompanyView.css';

function StudentCompanyView() {
    const [companies, setCompanies] = useState([]);
    const [page, setPage] = useState(0);
    const [totalPages, setTotalPages] = useState(0);

    const fetchCompanies = async () => {
        try {
            const res = await api.get(`/student/company?page=${page}&size=6`);
            setCompanies(res.data.content || []);
            setTotalPages(res.data.totalPages || 1);
        } catch (err) {
            console.error('Failed to fetch companies', err);
        }
    };

    const handleWithdraw = async (companyId) => {
        try {
            const res = await api.delete(`/student/withdraw/${companyId}`);
            if (res.status === 200) {
                alert('Application withdrawn successfully!');
                fetchCompanies(); // Refresh the list after withdrawal
            } else {
                alert('Failed to withdraw application. Please try again later.');
            }
        }
        catch (err) {
            console.error('Failed to withdraw application', err);
            alert('Failed to withdraw application. Please try again later.');
        }
    }

    const applyToCompany = async (companyId) => {
        try{
            const res = await api.post(`/student/apply/${companyId}`);
            if (res.status === 200) {
                alert('Application submitted successfully!');
                fetchCompanies(); // Refresh the list after applying
            } else {
                alert('Failed to apply. Please try again later.');
            }
        }catch (err) {
            console.error('Failed to apply to company', err);
            alert('Failed to apply. Please try again later.');
        }
    }

    useEffect(() => {
        fetchCompanies();
    }, [page]);

    return (
        <div className="company-container">
            <h2 className="company-title">Available Companies</h2>

            <div className="company-grid">
                {companies.map((company) => {
                    const validTill = new Date(
                        new Date(company.timestamp).getTime() + company.validity * 60 * 60 * 1000
                    );
                    const formattedDate = `${validTill.getDate().toString().padStart(2, '0')}/${(validTill.getMonth() + 1).toString().padStart(2, '0')
                        }/${validTill.getFullYear()} ${validTill.getHours().toString().padStart(2, '0')}:${validTill
                            .getMinutes()
                            .toString()
                            .padStart(2, '0')}`;

                    return (
                        <div key={company.id}
                        className={`company-card${!company.eligible ? ' ineligible' : ''} ${!company.valid ? ' expired' : ''}`}>
                            <h3>{company.companyName}</h3>
                            <p><strong>Job Description:</strong> {company.jobDescription}</p>
                            <p><strong>CTC Slab:</strong> {company.slab}</p>
                            {company.valid ? (
                                <p><strong>Valid Till:</strong> {formattedDate}</p>
                            ):(
                                <p><strong>Expired on:</strong> {formattedDate}</p>
                            )}
                            <p><strong>Required CGPA:</strong> {company.requiredCgpa}</p>

                            {company.hasApplied ? (
                                <button className ="withdraw-button" onClick={() => handleWithdraw(company.id)}>Withdraw Application</button>
                            ): company.eligible ? (
                                company.valid ? (
                                <button className = "apply-button" onClick={() => applyToCompany(company.id)}>Apply</button>
                            ):(
                                <button className = "disable-button">Expired</button>
                            )
                                
                            ):(
                                <button className = "disabled-button" disabled>Not eligible</button>
                            )}

                        </div>
                    );
                })}
            </div>

            <div className="pagination">
                <button onClick={() => setPage(page - 1)} disabled={page === 0}>Previous</button>
                <span>Page {page + 1} of {totalPages}</span>
                <button onClick={() => setPage(page + 1)} disabled={page + 1 >= totalPages}>Next</button>
            </div>
        </div>
    );
}

export default StudentCompanyView;
