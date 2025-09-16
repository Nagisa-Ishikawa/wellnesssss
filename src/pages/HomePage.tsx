import React from 'react';
import Calendar from '../components/Calendar';
import HealthChart from '../components/HealthChart';

const HomePage: React.FC = () => {
  return (
    <div>
      <h1>ホーム</h1>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginTop: '20px' }}>
        <Calendar />
        <HealthChart dataType="mood" period={14} />
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginTop: '20px' }}>
        <HealthChart dataType="temperature" period={14} />
        <HealthChart dataType="weight" period={14} />
      </div>
    </div>
  );
};

export default HomePage;