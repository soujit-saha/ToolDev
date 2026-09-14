import React from 'react';
import { View, TouchableOpacity, Image, StyleSheet, StyleProp, ViewStyle } from 'react-native';
import { COLORS, ICONS } from '../utils/constants';
import { ms, mvs } from '../utils/helper/metric';
import { goBack } from '../utils/helper/RootNavigation';

interface BackButtonHeaderProps {
  onPress?: () => void;
  style?: StyleProp<ViewStyle>;
  rightComponent?: React.ReactNode;
}

const BackButtonHeader: React.FC<BackButtonHeaderProps> = ({ onPress, style, rightComponent }) => {


  return (
    <View style={[styles.header, style, rightComponent ? styles.headerWithRight : null]}>
      <TouchableOpacity
        style={styles.backButton}
        onPress={onPress || (() => goBack())}
        activeOpacity={0.7}
      >
        <Image
          source={ICONS.back}
          style={styles.backIcon}
          resizeMode="contain"
        />
      </TouchableOpacity>
      {rightComponent}
    </View>
  );
};

export default BackButtonHeader;

const styles = StyleSheet.create({
  header: {
    paddingHorizontal: ms(20),
    paddingTop: mvs(10),
  },
  headerWithRight: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  backButton: {
    width: ms(48),
    height: ms(48),
    borderRadius: ms(12),
    borderWidth: 1,
    borderColor: COLORS.lightGray,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.white,
  },
  backIcon: {
    width: ms(22),
    height: ms(22),
    tintColor: COLORS.black,
  },
});
