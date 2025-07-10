import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../nnavbarr/navbar';
import './create.css';

const Creat = () => {
  const navigate = useNavigate();
  const url = 'http://localhost:3001/';
  const [errorMsg, setErrorMsg] = useState('');

  const post = () => {
    const companyName = document.getElementById('c_name').value.trim();
    const role = document.getElementById('role').value.trim();
    const salary = document.getElementById('sal').value.trim();
    const responsibilities = document.getElementById('resp').value.trim();
    const skills = document.getElementById('skill').value.trim();
    const description = document.getElementById('j_desc').value.trim();
    const startValue = document.getElementById('start').value;
    const endValue = document.getElementById('end').value;

    // Check for any missing fields
    if (
      !companyName ||
      !role ||
      !salary ||
      !responsibilities ||
      !skills ||
      !description ||
      !startValue ||
      !endValue
    ) {
      setErrorMsg('All fields are required.');
      return;
    }

    const startDate = new Date(startValue);
    const endDate = new Date(endValue);

    const monthDiff =
      (endDate.getFullYear() - startDate.getFullYear()) * 12 +
      (endDate.getMonth() - startDate.getMonth());

    const data = {
      companyName,
      role,
      salary,
      responsibilities,
      skills,
      startDate: startDate.toISOString().split('T')[0],
      endDate: endDate.toISOString().split('T')[0],
      duration: `${monthDiff} month(s)`,
      description,
    };

    fetch(`${url}posts`, {
      method: 'POST',
      body: JSON.stringify(data),
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
      },
    })
      .then(res => res.json())
      .then(data => {
        console.log(data.msg);
        console.log('Post format:', data.post);
        navigate('/dashboard'); // redirect after post
      })
      .catch(err => {
        console.error(err);
        setErrorMsg('Something went wrong while posting.');
      });
  };

  return (
    <>
      <Navbar />
      <div className="create-container">
        <h2>Create a New Job Post</h2>

        <input type="text" id="c_name" placeholder="Company Name" />
        <input type="text" id="role" placeholder="Job Role" />
        <input type="text" id="sal" placeholder="Expected Salary" />
        <input type="text" id="resp" placeholder="Responsibilities" />
        <input type="text" id="skill" placeholder="Skills Required" />

        <div className="date-inputs">
          <label>
            Start Date:
            <input type="date" id="start" />
          </label>
          <label>
            End Date:
            <input type="date" id="end" />
          </label>
        </div>

        <textarea rows={5} id="j_desc" placeholder="Job Description"></textarea>

        <button className="post-btn" onClick={post}>Post Job</button>

        {errorMsg && (
          <div className="error-wrapper">
            <p className="error-message">{errorMsg}</p>
          </div>
        )}

      </div>
    </>
  );
};

export default Creat;
