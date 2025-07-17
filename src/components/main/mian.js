import React, { useEffect, useState } from 'react';
import Navbar from '../nnavbarr/navbar';
import './main.css';

let Main = () => {
  let [list, setList] = useState([]);
  let username = 'asd';

  useEffect(() => {
    fetch('http://localhost:3001/all_posts')
      .then(res => res.json())
      .then(data => setList(data.posts))
      .catch(err => console.error('Failed to fetch all posts', err));
  }, []);

  let handleSearch = () => {
    let job = document.querySelector('#j_type').value;
    fetch('http://localhost:3001/search', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials:'include',
      body: JSON.stringify({ job }),
    })
      .then(res => res.json())
      .then(data => setList(data.list))
      .catch(err => console.error('Search failed', err));
  };

  let handleApply = (e) => {
    let li = e.currentTarget.closest('.job-card');
    let id = li.getAttribute('id');
    fetch('http://localhost:3001/apply', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify({ id }),
    })
      .then(res => res.json())
      .then(data => console.log('Applied to:', data.post))
      .catch(err => console.error('Apply failed', err));
  };

  return (
    <>
      <Navbar />
      <div className="search-container">
        <input id="j_type" type="text" placeholder="Search job type" />
        <button onClick={handleSearch}>Search</button>
      </div>

      <ul className="job-list">
        {list.map((job, index) => (
          <li key={index} id={job._id} className="job-card">
            <h3>{job.role} at {job.companyName}</h3>
            <p><strong>Salary:</strong> {job.salary}</p>
            <p><strong>Start:</strong> {new Date(job.startDate).toLocaleDateString()}</p>
            <p><strong>End:</strong> {new Date(job.endDate).toLocaleDateString()}</p>
            <p><strong>Duration:</strong> {job.duration}</p>
            <button onClick={handleApply}>Apply</button>
          </li>
        ))}
      </ul>
    </>
  );
};

export default Main;
