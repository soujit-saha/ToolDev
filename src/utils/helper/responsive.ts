import { Dimensions, PixelRatio } from 'react-native';

type ResponsiveValue = number | { mobile: number; tablet?: number };

type ScreenType = 'mobile' | 'tablet';

const MOBILE_GUIDELINE = { width: 375, height: 812 };
const TABLET_GUIDELINE = { width: 768, height: 1024 };
const TABLET_BREAKPOINT = 600;

const getWindowSize = () => Dimensions.get('window');

const getScreenType = (): ScreenType => {
  const { width, height } = getWindowSize();
  return Math.min(width, height) >= TABLET_BREAKPOINT ? 'tablet' : 'mobile';
};

const resolveValue = (value: ResponsiveValue): number => {
  if (typeof value === 'number') {
    return value;
  }

  if (getScreenType() === 'tablet') {
    return value.tablet ?? value.mobile;
  }

  return value.mobile;
};

const getGuideline = () => {
  return getScreenType() === 'tablet' ? TABLET_GUIDELINE : MOBILE_GUIDELINE;
};

const round = (value: number) => PixelRatio.roundToNearestPixel(value);

const width = (value: ResponsiveValue): number => {
  const { width: screenWidth } = getWindowSize();
  const guideline = getGuideline();
  return round((screenWidth / guideline.width) * resolveValue(value));
};

const height = (value: ResponsiveValue): number => {
  const { height: screenHeight } = getWindowSize();
  const guideline = getGuideline();
  return round((screenHeight / guideline.height) * resolveValue(value));
};

const font = (value: ResponsiveValue, factor = 0.5): number => {
  const base = resolveValue(value);
  const scaledWidth = width(base);
  const scaledHeight = height(base);
  const scaled = base + (Math.min(scaledWidth, scaledHeight) - base) * factor;
  return round(scaled);
};

const spacing = (value: ResponsiveValue): number => {
  return height(value);
};

const radius = (value: ResponsiveValue): number => {
  return Math.min(width(value), height(value));
};

const hitArea = (value: ResponsiveValue = 10) => {
  const size = spacing(value);
  return { top: size, right: size, bottom: size, left: size };
};

const screen = {
  get type() {
    return getScreenType();
  },
  get isTablet() {
    return getScreenType() === 'tablet';
  },
  get isMobile() {
    return getScreenType() === 'mobile';
  },
};

export { width, height, font, spacing, radius, hitArea, screen, getScreenType };

export type { ResponsiveValue, ScreenType };
