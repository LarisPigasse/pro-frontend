// src/pages/Dashboard.tsx
import React from 'react';
import { useThemedEdg } from '../core/hooks/';

const Dashboard: React.FC = () => {
  return (
    <div className='min-h-full flex items-center justify-center'>
      <img
        className='block max-w-full h-auto'
        src={useThemedEdg()}
        alt='Express Delivery Group'
        onError={e => {
          e.currentTarget.style.display = 'none';
        }}
      />
    </div>
  );
};

export default Dashboard;
