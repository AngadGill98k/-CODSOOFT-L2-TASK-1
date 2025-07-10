import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import './accept.css'
import Navbar from '../../nnavbarr/navbar';
const Accptance = () => {
  const location = useLocation();
  const jobId = location.state?.postId;

  const [applicants, setApplicants] = useState([]);

  useEffect(() => {
    if (!jobId) return;

    fetch('http://localhost:3001/get_applicants', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials:'include',
      body: JSON.stringify({ jobId }),
    })
      .then(res => res.json())
      .then(data => {
        console.log('Applicants fetched:', data.applicants);
        setApplicants(data.applicants);
      })
      .catch(err => console.error('Error fetching applicants:', err));
  }, [jobId]);

  const updateStatus = (userId, status) => {
    fetch('http://localhost:3001/update_application_status', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials:'include',
      body: JSON.stringify({ userId, jobId, status }),
    })
      .then(res => res.json())
      .then(data => {
        console.log(status ? 'Accepted:' : 'Rejected:', data);
        setApplicants(prev => prev.filter(user => user._id !== userId)); // remove after action
      })
      .catch(err => console.error(`${status ? 'Accept' : 'Reject'} error:`, err));
  };

  const handleRemovePost = () => {
    fetch('http://localhost:3001/remove_post', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials:'include',
      body: JSON.stringify({ jobId }),
    })
      .then(res => res.json())
      .then(data => {
        console.log('Post removed:', data);
        setApplicants([]);
      })
      .catch(err => console.error('Remove post error:', err));
  };
const downloadResume = (email) => {
  fetch(`http://localhost:3001/download_resume_by_email`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
    body: JSON.stringify({ mail: email }),
  })
    .then(res => {
      if (!res.ok) throw new Error('Failed to download');
      return res.blob();
    })
    .then(blob => {
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'resume.pdf';
      document.body.appendChild(a);
      a.click();
      a.remove();
    })
    .catch(err => console.error('Resume download error:', err));
};

  return (
    <>
    <Navbar/>
    <div className="acceptance-container">
      <h2>Applicants for Job</h2>

      <button className="remove-post-btn" onClick={handleRemovePost}>
        Remove Post
      </button>

      <ul className="applicant-list">
        {applicants.map((user, index) => (
          <li key={index} className="applicant-card">
            <p><strong>Name:</strong> {user.name}</p>
            <p><strong>Email:</strong> {user.mail}</p>
            <p><strong>About:</strong> {user.about}</p>
            <p><strong>Achievements:</strong> {user.achievements}</p>

 {user.resume && user.resume !== '' ? (
  <button onClick={() => downloadResume(user.mail)}>Download Resume</button>
) : (
  <p style={{ color: 'gray', fontStyle: 'italic' }}>No resume uploaded</p>
)}

            <div className="action-buttons">
              <button onClick={() => updateStatus(user._id, true)}>Accept</button>
              <button onClick={() => updateStatus(user._id, false)}>Reject</button>
            </div>
          </li>
        ))}
      </ul>
    </div>
    </>
  );
};

export default Accptance;
