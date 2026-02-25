// src/pages/Dashboard.tsx
import React from 'react';
import { useThemedEdg, useThemedHome } from '../core/hooks/';
import { useIsMobile } from '../core/hooks';

const Dashboard: React.FC = () => {
  const isMobile = useIsMobile();

  if (isMobile) {
    return (
      <div className='min-h-full flex items-center justify-center'>
        <img
          className='block max-w-1/2 h-auto'
          src={useThemedEdg()}
          alt='Express Delivery Group'
          onError={e => {
            e.currentTarget.style.display = 'none';
          }}
        />
      </div>
    );
  }
  return (
    <div className='min-h-full flex items-center justify-center'>
      <img
        className='block max-w-full h-auto'
        src={useThemedHome()}
        alt='Express Delivery Group'
        onError={e => {
          e.currentTarget.style.display = 'none';
        }}
      />
    </div>
  );
};

export default Dashboard;
