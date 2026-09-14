import { StyleSheet, Text, View, StatusBar } from 'react-native';
import React from 'react';
import { COLORS } from './src/utils/constants';
import { SafeAreaView } from 'react-native-safe-area-context';
import StackNav from './src/navigators/StackNav';

const App = () => {
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: COLORS.white }}>
      <StatusBar barStyle="dark-content" backgroundColor={COLORS.backgroundSecondary} />
      <StackNav />
    </SafeAreaView>
  );
};

export default App;

const styles = StyleSheet.create({});
