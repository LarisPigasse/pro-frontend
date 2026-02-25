// src/core/hooks/useThemedImage.ts
import { useMemo } from 'react';
import { useUISettings } from '../../app/hooks';

// Mapping delle immagini disponibili
const THEMED_IMAGES = {
  logo: {
    light: '/src/assets/logo.png',
    dark: '/src/assets/logo-reverse.png',
  },
  icon: {
    light: '/src/assets/icon.png',
    dark: '/src/assets/icon-reverse.png',
  },
  bg: {
    light: '/src/assets/bgbase.jpg',
    dark: '/src/assets/bgdark.jpg',
  },
  edg: {
    light: '/src/assets/edg.png',
    dark: '/src/assets/edgdark.png',
  },
  home: {
    light: '/src/assets/home.jpg',
    dark: '/src/assets/edgdark.png',
  },
} as const;

// Tipi per le immagini disponibili
export type ThemedImageKey = keyof typeof THEMED_IMAGES;

// Hook per ottenere l'immagine corretta in base al tema
export const useThemedImage = (imageKey: ThemedImageKey): string => {
  const { darkMode } = useUISettings();

  return useMemo(() => {
    const imageSet = THEMED_IMAGES[imageKey];
    return darkMode ? imageSet.dark : imageSet.light;
  }, [imageKey, darkMode]);
};

// Hook specifico per il logo (convenience)
export const useThemedLogo = (): string => {
  return useThemedImage('logo');
};

// Hook specifico per l'icona (convenience)
export const useThemedIcon = (): string => {
  return useThemedImage('icon');
};

// Hook specifico per il background (convenience)
export const useThemedBg = (): string => {
  return useThemedImage('bg');
};

// Hook specifico per il logo grande edg (convenience)
export const useThemedEdg = (): string => {
  return useThemedImage('edg');
};

// Hook specifico per la dashboard (convenience)
export const useThemedHome = (): string => {
  return useThemedImage('home');
};

export default useThemedImage;
