import React, { useEffect, useState } from 'react';
import Navbar from '../nnavbarr/navbar';
import './dash.css';
import { useNavigate } from 'react-router-dom';

const Dasjboard = () => {
  const [data, sdata] = useState({ jobs: [], post: [] });
  const [fullPosts, setFullPosts] = useState([]);
  const [appliedJobsDetails, setAppliedJobsDetails] = useState([]);
  const [editing, setEditing] = useState({ about: false, achievements: false });
  const [editForm, setEditForm] = useState({ about: '', achievements: '' });
  const [resumeFile, setResumeFile] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetch(`http://localhost:3001/u_details`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify(),
    })
      .then(res => res.json())
      .then(data => {
        sdata({
          mail: data.user.mail,
          name: data.user.name,
          post: data.user.post,
          jobs: data.user.jobs_app,
          about: data.user.about,
          achievements: data.user.achievements,
          image: '',
          resume: data.user.resume || '',
        });
      });
  }, []);

  useEffect(() => {
    if (data.jobs.length > 0) {
      fetch('http://localhost:3001/g_jobs', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ jobs: data.jobs }),
      })
        .then(res => res.json())
        .then(data => {
          setAppliedJobsDetails(data.jobs);
        });
    }
  }, [data.jobs]);

  useEffect(() => {
    if (data.post.length > 0) {
      fetch('http://localhost:3001/g_post', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ post: data.post }),
      })
        .then(res => res.json())
        .then(data => {
          setFullPosts(data.posts);
        });
    }
  }, [data.post]);

  const handlePostClick = (e) => {
    const li = e.currentTarget;
    const id = li.getAttribute('postid');
    navigate('/acceptance', { state: { postId: id } });
  };

  const saveField = (field) => {
    const updatedValue = editForm[field];

    fetch('http://localhost:3001/update_info', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify({ field, value: updatedValue })
    })
      .then(res => res.json())
      .then(resp => {
        if (resp.msg === 'updated') {
          sdata(prev => ({ ...prev, [field]: updatedValue }));
          setEditing(prev => ({ ...prev, [field]: false }));
        }
      })
      .catch(err => console.error(err));
  };

  const uploadResume = () => {
    if (!resumeFile) return;
    const formData = new FormData();
    formData.append('resume', resumeFile);

    fetch('http://localhost:3001/upload_resume', {
      method: 'POST',
      credentials: 'include',
      body: formData,
    })
      .then(res => res.json())
      .then(resp => {
        if (resp.msg === 'Resume uploaded') {
          sdata(prev => ({ ...prev, resume: resp.filename }));
          alert('Resume uploaded successfully.');
        } else {
          alert('Failed to upload resume.');
        }
      })
      .catch(err => console.error(err));
  };

  return (
    <>
      <Navbar />
      <div className="dashboard-container">
        <div className="profile-card">
          <h2>{data.name}</h2>

          {/* About Field */}
          <p>
            <strong>About:</strong>
            {editing.about ? (
              <>
                <textarea
                  value={editForm.about}
                  onChange={(e) => setEditForm({ ...editForm, about: e.target.value })}
                />
                <button className="save-btn" onClick={() => saveField('about')}>Save</button>
              </>
            ) : (
              <>
                {' '}{data.about}
                <button className="edit-btn" onClick={() => {
                  setEditForm({ ...editForm, about: data.about });
                  setEditing({ ...editing, about: true });
                }}>Edit</button>
              </>
            )}
          </p>

          {/* Achievements Field */}
          <p>
            <strong>Achievements:</strong>
            {editing.achievements ? (
              <>
                <textarea
                  value={editForm.achievements}
                  onChange={(e) => setEditForm({ ...editForm, achievements: e.target.value })}
                />
                <button className="save-btn" onClick={() => saveField('achievements')}>Save</button>
              </>
            ) : (
              <>
                {' '}{data.achievements}
                <button className="edit-btn" onClick={() => {
                  setEditForm({ ...editForm, achievements: data.achievements });
                  setEditing({ ...editing, achievements: true });
                }}>Edit</button>
              </>
            )}
          </p>

          {/* Resume Field */}
          <p>
            <strong>Resume:</strong> {data.resume || 'No resume uploaded'}
            <input
              type="file"
              onChange={(e) => setResumeFile(e.target.files[0])}
              style={{ marginLeft: '10px' }}
            />
            <button className="save-btn" onClick={uploadResume}>Upload</button>
          </p>
        </div>

        <div className="section">
          <h2>Jobs Applied</h2>
          <ul className="job-list">
            {appliedJobsDetails.map((job, index) => (
              <li key={index} className="job-card">
                <p><strong>Company:</strong> {job.companyName}</p>
                <p><strong>Role:</strong> {job.role}</p>
                <p><strong>Status:</strong> {job.status ? 'Accepted' : 'Pending/Rejected'}</p>
              </li>
            ))}
          </ul>
        </div>

        <div className="section">
          <h2>Jobs Posted</h2>
          <ul className="job-list">
            {fullPosts.map((post, index) => (
              <li key={index} postid={post._id} onClick={handlePostClick} className="job-card clickable">
                <p><strong>Company:</strong> {post.companyName}</p>
                <p><strong>Role:</strong> {post.role}</p>
                <p><strong>Salary:</strong> {post.salary}</p>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </>
  );
};

export default Dasjboard;
