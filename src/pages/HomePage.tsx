import React from 'react';
import Calendar from '../components/Calendar';
import HealthChart from '../components/HealthChart';

const HomePage: React.FC = () => {
  return (
    <div className="home-page">
      <div className="home-content">
        <div className="home-row">
          <div className="home-item">
            <Calendar />
          </div>
          <div className="home-item">
            <HealthChart dataType="mood" period={14} />
          </div>
        </div>
        <div className="home-row">
          <div className="home-item">
            <HealthChart dataType="temperature" period={14} />
          </div>
          <div className="home-item">
            <HealthChart dataType="weight" period={14} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomePage;