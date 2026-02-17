// Barrel file per hooks personalizzati
export {
  default as useThemedImage,
  useThemedLogo,
  useThemedIcon,
  useThemedBg,
  useThemedEdg,
  type ThemedImageKey,
} from './useThemedImage';

export {
  default as useMediaQuery,
  useIsMobile,
  useIsTablet,
  useIsDesktop,
  useIsLargeScreen,
  BREAKPOINTS,
} from './useMediaQuery';

// Esporta anche altri hooks futuri
// export { default as useLocalStorage } from './useLocalStorage';
// export { default as useDebounce } from './useDebounce';
