import { PixelRatio, Platform, Dimensions } from 'react-native';

const scale = Dimensions.get('window').width / 320;

export default function normalize(size: number) {
  const newSize = size * scale;

  return Math.round(PixelRatio.roundToNearestPixel(newSize));
}

const { height: screenHeight, width: screenWidth } = Dimensions.get('window');

const wp = (value: number) => {
  return PixelRatio.roundToNearestPixel((screenWidth * value) / 100);
};
const hp = (value: number) => {
  return PixelRatio.roundToNearestPixel((screenHeight * value) / 100);
};

export { wp, hp };
