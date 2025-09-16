import React from 'react';
import SettingsForm from '../components/SettingsForm';

const SettingsPage: React.FC = () => {
  return (
    <div>
      <h1>設定</h1>
      <div style={{ marginTop: '20px' }}>
        <SettingsForm />
      </div>
    </div>
  );
};

export default SettingsPage;