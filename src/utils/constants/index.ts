// App configuration constants

interface AppConstants {
  readonly TOKEN: string;
  readonly BASE_URL: string;
}

export const constants: AppConstants = {
  TOKEN: 'TOKEN',
  BASE_URL: 'https://tool.swastechinfo.in/public/api',
} as const;

// Colors extracted from Figma design
export const COLORS = {
  // Primary brand colors
  primary: '#0056BE',
  primaryLight: '#2F6FDB',

  // Semantic colors
  success: '#34A853', // Chateau Green
  warning: '#FBBC04',
  error: '#EB001B', // Red
  info: '#4285F4', // Cornflower Blue

  // Neutral colors
  white: '#FFFFFF',
  black: '#000000',
  codGray: '#1C1C1C',
  shuttleGray: '#5F6368',
  waterloo: '#808191',
  alto: '#D9D9D9',
  whiteLinen: '#F8F2EA',

  // Additional gray variants
  gray: '#5F6368', // Using shuttleGray as the main gray
  lightGray: '#E8E6EA', // Using alto as light gray
  darkGray: '#1C1C1C', // Using codGray as dark gray
  mediumGray: '#959595', // Medium gray for borders and placeholders
  lightestGray: '#E5E5E5', // Very light gray for backgrounds
  placeholderGray: '#989898', // Placeholder text color
  subtleGray: '#666666', // Subtle text color
  mutedGray: '#7C7C7C', // Muted text color
  charcoal: '#333333', // Charcoal color for text

  // Additional UI colors
  accent: '#FF9D33', // Orange accent color
  backgroundTertiary: '#FAFAFA', // Very light background
  accentLight: '#97DFEC', // Light blue accent
  headerBlue: '#007AFF', // Header background blue
  red: '#FF3B30', // Red color for errors

  // Background colors
  background: '#FFFFFF',
  backgroundSecondary: '#F8F9FB',
  surface: '#F8F2EA',

  // Text colors
  textPrimary: '#000000',
  textSecondary: '#1C1C1C',
  textTertiary: 'rgba(0, 0, 0, 0.7)',
  placeholder: '#808191',

  // Border colors
  border: '#D9D9D9',
  borderLight: '#D4CEC6',

  // Additional colors from design
  lightBackground: '#EEFFFD', // Light mint background
  flashSaleBg: '#FFB039', // Flash sale background with opacity
  productBackground: '#F2F2F2', // Product placeholder background
  borderGray: '#E6E8EC', // Product card border
  priceStriked: '#828282', // Striked price color
  yellowAccent: '#FBFF2E', // Yellow accent color
  pinkAccent: '#E76AAD', // Pink accent color
  lightMint: '#C7E2EE', // Light mint color
  blackText: '#212121', // Black text color
  notificationRed: '#F80036', // Notification red color
  lightGreen: '#F0F0F0', // Light green divider
};

export const FONTS = {
  thin18: 'Inter_18pt-Thin',
  thin18Italic: 'Inter_18pt-ThinItalic',
  extraLight18: 'Inter_18pt-ExtraLight',
  extraLight18Italic: 'Inter_18pt-ExtraLightItalic',
  light18: 'Inter_18pt-Light',
  light18Italic: 'Inter_18pt-LightItalic',
  regular18: 'Inter_18pt-Regular',
  italic18: 'Inter_18pt-Italic',
  medium18: 'Inter_18pt-Medium',
  medium18Italic: 'Inter_18pt-MediumItalic',
  semiBold18: 'Inter_18pt-SemiBold',
  semiBold18Italic: 'Inter_18pt-SemiBoldItalic',
  bold18: 'Inter_18pt-Bold',
  bold18Italic: 'Inter_18pt-BoldItalic',
  extraBold18: 'Inter_18pt-ExtraBold',
  extraBold18Italic: 'Inter_18pt-ExtraBoldItalic',
  black18: 'Inter_18pt-Black',
  black18Italic: 'Inter_18pt-BlackItalic',
  thin24: 'Inter_24pt-Thin',
  thin24Italic: 'Inter_24pt-ThinItalic',
  extraLight24: 'Inter_24pt-ExtraLight',
  extraLight24Italic: 'Inter_24pt-ExtraLightItalic',
  light24: 'Inter_24pt-Light',
  light24Italic: 'Inter_24pt-LightItalic',
  regular24: 'Inter_24pt-Regular',
  italic24: 'Inter_24pt-Italic',
  medium24: 'Inter_24pt-Medium',
  medium24Italic: 'Inter_24pt-MediumItalic',
  semiBold24: 'Inter_24pt-SemiBold',
  semiBold24Italic: 'Inter_24pt-SemiBoldItalic',
  bold24: 'Inter_24pt-Bold',
  bold24Italic: 'Inter_24pt-BoldItalic',
  extraBold24: 'Inter_24pt-ExtraBold',
  extraBold24Italic: 'Inter_24pt-ExtraBoldItalic',
  black24: 'Inter_24pt-Black',
  black24Italic: 'Inter_24pt-BlackItalic',
  thin28: 'Inter_28pt-Thin',
  thin28Italic: 'Inter_28pt-ThinItalic',
  extraLight28: 'Inter_28pt-ExtraLight',
  extraLight28Italic: 'Inter_28pt-ExtraLightItalic',
  light28: 'Inter_28pt-Light',
  light28Italic: 'Inter_28pt-LightItalic',
  regular28: 'Inter_28pt-Regular',
  italic28: 'Inter_28pt-Italic',
  medium28: 'Inter_28pt-Medium',
  medium28Italic: 'Inter_28pt-MediumItalic',
  semiBold28: 'Inter_28pt-SemiBold',
  semiBold28Italic: 'Inter_28pt-SemiBoldItalic',
  bold28: 'Inter_28pt-Bold',
  bold28Italic: 'Inter_28pt-BoldItalic',
  extraBold28: 'Inter_28pt-ExtraBold',
  extraBold28Italic: 'Inter_28pt-ExtraBoldItalic',
  black28: 'Inter_28pt-Black',
  black28Italic: 'Inter_28pt-BlackItalic',
  bold: 'Inter_18pt-Bold',
  semiBold: 'Inter_18pt-SemiBold',
  medium: 'Inter_18pt-Medium',
  regular: 'Inter_18pt-Regular',
};

export const ICONS = {
  access: require('../../assets/icons/Access.png'),
  account: require('../../assets/icons/account.png'),
  alertGreen: require('../../assets/icons/AlertGreen.png'),
  alertRed: require('../../assets/icons/AlertRed.png'),
  allTools: require('../../assets/icons/allTools.png'),
  // apple: require('../../assets/icons/apple.png'),
  back: require('../../assets/icons/Back.png'),
  calendor: require('../../assets/icons/calendor.png'),
  camera: require('../../assets/icons/camera.png'),
  carpentry: require('../../assets/icons/Carpentry.png'),
  cardActive: require('../../assets/icons/Dashboard.png'),
  cardInactive: require('../../assets/icons/Search.png'),
  check: require('../../assets/icons/check.png'),
  circleRight: require('../../assets/icons/CircleRight.png'),
  container: require('../../assets/icons/Container.png'),
  container29: require('../../assets/icons/Container (29).png'),
  dashboard: require('../../assets/icons/Dashboard.png'),
  DashboardInactive: require('../../assets/icons/DashboardInactive.png'),
  deopDown: require('../../assets/icons/DeopDown.png'),
  driver: require('../../assets/icons/driver.png'),
  drop: require('../../assets/icons/Drop.png'),
  dropInactive: require('../../assets/icons/DropInactive.png'),
  electrical: require('../../assets/icons/Electrical.png'),
  handTools: require('../../assets/icons/HandTools.png'),
  harness: require('../../assets/icons/Harness.png'),
  help: require('../../assets/icons/help.png'),
  hvac: require('../../assets/icons/HVAC.png'),
  location: require('../../assets/icons/location.png'),
  logInactive: require('../../assets/icons/LogInactive.png'),
  logout: require('../../assets/icons/logout.png'),
  logs: require('../../assets/icons/Logs.png'),
  materials: require('../../assets/icons/Materials.png'),
  measure: require('../../assets/icons/Measure.png'),
  menu: require('../../assets/icons/Menu.png'),
  messageActive: require('../../assets/icons/Logs.png'),
  messageInactive: require('../../assets/icons/LogInactive.png'),
  minus: require('../../assets/icons/minus.png'),
  nextArrow: require('../../assets/icons/NextArrow.png'),
  notification: require('../../assets/icons/Notification.png'),
  ppe: require('../../assets/icons/ppe.png'),
  peopleActive: require('../../assets/icons/Teams.png'),
  peopleInactive: require('../../assets/icons/profile.png'),
  plus: require('../../assets/icons/plus.png'),
  profile: require('../../assets/icons/profile.png'),
  qr: require('../../assets/icons/qr.png'),
  safety: require('../../assets/icons/Safety.png'),
  search: require('../../assets/icons/Search.png'),
  take: require('../../assets/icons/Take.png'),
  takeInactive: require('../../assets/icons/TakeInactive.png'),
  teams: require('../../assets/icons/Teams.png'),
  terms: require('../../assets/icons/Terms.png'),
  matchesActive: require('../../assets/icons/Wrench.png'),
  matchesInactive: require('../../assets/icons/Wrench.png'),
  wrench: require('../../assets/icons/Wrench.png'),
  eye_on: require('../../assets/icons/eye_on.png'),
  eye_off: require('../../assets/icons/eye_off.png'),
  ButtonNext: require('../../assets/icons/ButtonNext.png'),
  ButtonPrev: require('../../assets/icons/ButtonPrev.png'),
};

export const IMAGES = {
  logo: require('../../assets/images/logo.png'),
  banner: require('../../assets/images/Banner.png'),
};

export * from './countries';

