import React, { useEffect, useState } from 'react';
import api from '../../api/api';
import '../../css/HomeLogin.css';
import SupportCTA from '../SupportCTA';

const SuccessStats = () => {
  const [stats, setStats] = useState({
    students: 0,
    successRate: 0,
    questions: 0,
    experts: 0,
    years: 0,
  });

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await api.get('/api/stats');
        setStats(response.data);
      } catch (error) {
        console.error('Error fetching stats:', error);
      }
    };
    fetchStats();
  }, []);

  return (
    <>
    <section className="success">
      <h1 className="success-title">Our Success</h1>
      <p className="success-subtitle">
        We’ve helped alot of learners grow their language skills and cultural understanding across Cameroon.
      </p>
      <div className="stats">
        <div className="stat-item">
          <h3>{stats.students}+</h3>
          <p>Students</p>
        </div>
        <div className="stat-item">
          <h3>{stats.successRate}%</h3>
          <p>Total success</p>
        </div>
        <div className="stat-item">
          <h3>{stats.questions}</h3>
          <p>Main questions</p>
        </div>
        <div className="stat-item">
          <h3>{stats.experts}</h3>
          <p>Chief experts</p>
        </div>
        <div className="stat-item">
          <h3>{stats.years}</h3>
          <p>Years of experience</p>
        </div>
      </div>
    </section>
    <SupportCTA />
    </>
  );
};

export default SuccessStats;
