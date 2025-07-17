import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../nnavbarr/navbar';
import './create.css';

let Creat = () => {
  let navigate = useNavigate();
  let url = 'http://localhost:3001/';
  let [errorMsg, setErrorMsg] = useState('');

  let post = () => {
    let companyName = document.getElementById('c_name').value.trim();
    let role = document.getElementById('role').value.trim();
    let salary = document.getElementById('sal').value.trim();
    let responsibilities = document.getElementById('resp').value.trim();
    let skills = document.getElementById('skill').value.trim();
    let description = document.getElementById('j_desc').value.trim();
    let startValue = document.getElementById('start').value;
    let endValue = document.getElementById('end').value;

  
  
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

    let startDate = new Date(startValue);
    let endDate = new Date(endValue);

    let monthDiff =
      (endDate.getFullYear() - startDate.getFullYear()) * 12 +
      (endDate.getMonth() - startDate.getMonth());

    let data = {
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
        navigate('/dashboard');
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
