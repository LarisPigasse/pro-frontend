// src/core/components/layout/custom/MainLayout.tsx
import React from 'react';

import { Header, Footer } from '..';
import { SettingsMenu, UserMenu } from '../../navigation';
import { useUISettings } from '../../../../app/hooks';
import { useIsMobile } from '../../../hooks';
import backgroundImage from '../../../../assets/background.jpg';

interface MainLayoutProps {
  children: React.ReactNode;
}

const MainLayout: React.FC<MainLayoutProps> = ({ children }) => {
  const { footerVisible } = useUISettings();
  const isMobile = useIsMobile();

  if (isMobile) {
    return (
      <div className='min-h-screen flex flex-col relative'>
        {/* Background fisso per mobile */}
        <div
          className='fixed inset-0 -z-10 bg-cover bg-center bg-no-repeat'
          style={{ backgroundImage: `url(${backgroundImage})` }}
        />
        <Header />
        <main className='flex-1'>
          <div className='w-full px-4 sm:px-6 py-8'>{children}</div>
        </main>
        {footerVisible && <Footer showVersionInfo={true} />}
        <SettingsMenu />
        <UserMenu />
      </div>
    );
  }

  return (
    <div className='min-h-screen relative'>
      {/* Background fisso per desktop */}
      <div
        className='fixed inset-0 -z-10 bg-cover bg-center bg-no-repeat'
        style={{ backgroundImage: `url(${backgroundImage})` }}
      />
      <div className='grid grid-cols-1 grid-rows-[auto_1fr_auto] min-h-screen'>
        <header className='sticky top-0 z-40 col-span-full'>
          <Header />
        </header>

        <main className='flex-1 min-w-0 overflow-y-auto flex flex-col'>
          <div className='w-full px-4 sm:px-6 lg:px-8 py-8 flex-1'>{children}</div>
        </main>

        {footerVisible && (
          <footer className='sticky bottom-0 z-40 col-span-full'>
            <Footer showVersionInfo={true} />
          </footer>
        )}
      </div>

      <SettingsMenu />
      <UserMenu />
    </div>
  );
};

export default MainLayout;
