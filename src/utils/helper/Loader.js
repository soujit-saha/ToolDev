import React from 'react';
import { ActivityIndicator, Dimensions, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { COLORS, GIFS } from '../constants';
import { ms } from './metric';

export default function Loader(props) {
  return props.visible ? (
    <SafeAreaView
      style={{
        height: Dimensions.get('window').height,
        position: 'absolute',
        // backgroundColor: COLORS.white,
        backgroundColor: 'rgba(0,0,0,0.8)',
        zIndex: 10,
        top: 0,
        bottom: 0,
        left: 0,
        right: 0,
        width: '100%',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <ActivityIndicator size="large" color={'white'} />
      {/* <Image source={GIFS.loader} style={{ width: ms(140), height: ms(140) }} resizeMode="contain" /> */}
    </SafeAreaView>
  ) : null;
}
