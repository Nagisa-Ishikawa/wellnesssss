import React from 'react';
import HealthRecordForm from '../components/HealthRecordForm';

const RecordPage: React.FC = () => {
  return (
    <div>
      <h1>体調記録</h1>
      <div style={{ marginTop: '20px' }}>
        <HealthRecordForm />
      </div>
    </div>
  );
};

export default RecordPage;