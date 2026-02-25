// src/core/components/layout/custom/MainLayout.tsx
import React from 'react';

import { Header, Footer } from '..';
import { SettingsMenu, UserMenu } from '../../navigation';
import { useUISettings } from '../../../../app/hooks';
import { useIsMobile } from '../../../hooks';
import { useThemedBg } from '../../../hooks';

interface MainLayoutProps {
  children: React.ReactNode;
}

const MainLayout: React.FC<MainLayoutProps> = ({ children }) => {
  const { footerVisible } = useUISettings();
  const isMobile = useIsMobile();
  const bgSrc = useThemedBg();

  if (isMobile) {
    return (
      <div className='min-h-screen flex flex-col relative'>
        {/* Background fisso per mobile */}
        <div className='fixed inset-0 -z-10 bg-cover bg-center bg-no-repeat' style={{ backgroundImage: `url(${bgSrc})` }} />
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
    <div className='min-h-full relative'>
      {/* Background fisso per desktop */}
      <div className='grid grid-cols-1 grid-rows-[auto_1fr_auto] min-h-screen'>
        <header className='sticky top-0 z-40 col-span-full'>
          <Header />
        </header>

        <main className='flex-1 min-w-0 overflow-y-auto flex flex-col px-4 py-6 bg-bg-base'>
          <div className='w-full px-0 py-0 flex-1'>{children}</div>
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
