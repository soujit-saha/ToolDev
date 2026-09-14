import { Image, StyleSheet, Text, View } from 'react-native';
import React, { useEffect } from 'react';
import { navigate } from '../../utils/helper/RootNavigation';
import { SafeAreaView } from 'react-native-safe-area-context';
import { IMAGES } from '../../utils/constants';
import { ms } from '../../utils/helper/metric';
import { useDispatch } from 'react-redux';
import { getTokenRequest } from '../../redux/reducer/AuthReducer';

const SplashScreen = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    setTimeout(() => {
      dispatch(getTokenRequest())
    }, 1000);
  }, []);

  return (
    <SafeAreaView style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Image source={IMAGES.logo} style={{ width: ms(100), height: ms(100), resizeMode: 'contain' }} />
    </SafeAreaView>
  );
};

export default SplashScreen;

const styles = StyleSheet.create({});
