// Event system constants for asset loading coordination
export const ASSET_EVENTS = {
  LOADED: 'sushi-rabo-assets-loaded',
  PROGRESS: 'sushi-rabo-assets-progress'
} as const;

// Animation constants
export const ANIMATION = {
  HERO_LOGO_SCALE: 0.6,
  HERO_DURATION: 1.1,
  OVERLAY_DURATION: 0.9,
  CONTENT_DURATION: 0.8,
  SCROLL_TRIGGER_DELAY: 100
} as const;

// 3D Model animation constants
export const MODEL_ANIMATION = {
  CAMERA_START: { x: 0, y: 10, z: 0.001 },
  CAMERA_MID: { x: 0, y: 5, z: 8 },
  CAMERA_END: { x: 0, y: 0, z: 14 },
  SUSHI_Y_OFFSET: 0.8,
  TUBE_Y_OFFSET: 1.5,
  SCROLL_HEIGHT_MULTIPLIER: 1.5
} as const;

// Social media links
export const SOCIAL_LINKS = {
  instagram: 'https://instagram.com',
  twitter: 'https://twitter.com', 
  linkedin: 'https://linkedin.com'
} as const;

// Site metadata
export const SITE_CONFIG = {
  name: 'Sushi Rabo',
  description: 'Engineer your perfect bite.',
  url: process.env.NEXT_PUBLIC_SITE_URL ?? 'https://sushirabo.com'
} as const;
