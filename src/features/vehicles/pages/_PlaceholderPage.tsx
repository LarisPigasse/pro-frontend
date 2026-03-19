// =============================================================================
// ASSET AZIENDALI — UTILITY: _PlaceholderPage
// features/vehicles/pages/_PlaceholderPage.tsx
// =============================================================================

import React from 'react';

type IconType = 'driver' | 'deadline' | 'history' | 'config';

const ICONS: Record<IconType, React.ReactNode> = {
  driver: (
    <svg className='w-12 h-12' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
      <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={1.25}
        d='M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857
           M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857
           m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z' />
    </svg>
  ),
  deadline: (
    <svg className='w-12 h-12' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
      <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={1.25}
        d='M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5
           a2 2 0 00-2 2v12a2 2 0 002 2z' />
    </svg>
  ),
  history: (
    <svg className='w-12 h-12' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
      <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={1.25}
        d='M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z' />
    </svg>
  ),
  config: (
    <svg className='w-12 h-12' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
      <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={1.25}
        d='M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0
           002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0
           001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0
           00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0
           00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0
           00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0
           00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0
           001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z' />
      <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={1.25}
        d='M15 12a3 3 0 11-6 0 3 3 0 016 0z' />
    </svg>
  ),
};

interface PlaceholderPageProps {
  title:       string;
  description: string;
  icon:        IconType;
}

export const PlaceholderPage: React.FC<PlaceholderPageProps> = ({ title, description, icon }) => (
  <div className='flex flex-col gap-4'>
    <div>
      <h1 className='text-xl font-semibold text-text-primary'>{title}</h1>
      <p className='text-sm text-text-secondary mt-0.5'>Asset Aziendali</p>
    </div>
    <div className='flex flex-col items-center justify-center gap-4
                    min-h-96 rounded-xl border border-dashed border-border-primary
                    bg-surface-primary text-text-secondary'>
      <div className='opacity-20'>{ICONS[icon]}</div>
      <div className='text-center max-w-sm'>
        <p className='font-medium text-text-primary mb-1'>{title}</p>
        <p className='text-sm leading-relaxed'>{description}</p>
      </div>
      <span className='px-3 py-1 text-xs rounded-full bg-blue-500/10
                       text-blue-500 border border-blue-500/20 font-medium'>
        In sviluppo
      </span>
    </div>
  </div>
);
