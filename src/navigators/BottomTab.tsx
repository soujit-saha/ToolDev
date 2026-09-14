import { StyleSheet, Text, View, Image, Dimensions } from 'react-native';
import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { COLORS, FONTS, ICONS } from '../utils/constants';
import Logs from '../screens/main/Logs';
import Drop from '../screens/main/Drop';
import Take from '../screens/main/Take';
import Dashboard from '../screens/main/Dashboard';
import { ms } from '../utils/helper/metric';

const Tab = createBottomTabNavigator();

const width = Dimensions.get('window').width * 0.25;

const BottomTab = () => {
  const insets = useSafeAreaInsets();

  return (
    <Tab.Navigator
      initialRouteName="Dashboard"
      screenOptions={{
        headerShown: false,
        tabBarHideOnKeyboard: true,
        tabBarShowLabel: false,
        tabBarStyle: {
          position: 'absolute',
          height: ms(66) + insets.bottom,
          borderTopWidth: ms(1),
          borderTopColor: 'rgba(255,255,255,0.15)',
          backgroundColor: COLORS.white,
          overflow: 'hidden',
          paddingTop: ms(14),
          paddingBottom: insets.bottom,
          elevation: 0,
          shadowOpacity: 0,
        },
      }}
    >
      <Tab.Screen
        name="Dashboard"
        component={Dashboard}
        options={{
          tabBarIcon: ({ color, focused }) => (
            <View style={styles.con}>
              <Image
                source={focused ? ICONS.dashboard : ICONS.DashboardInactive}
                style={{
                  height: ms(22),
                  width: ms(22),
                  resizeMode: 'contain',
                }}
              />
              <Text
                style={{
                  color: focused ? COLORS.primary : '#9CA3AF',
                  fontSize: ms(14),
                  marginTop: ms(6),
                  fontFamily: FONTS.semiBold24,
                  includeFontPadding: false,
                }}
              >
                Dashboard
              </Text>
            </View>
          ),
        }}
      />
      <Tab.Screen
        name="Take"
        component={Take}
        options={{
          tabBarIcon: ({ color, focused }) => (
            <View style={styles.con}>
              <Image
                source={focused ? ICONS.take : ICONS.takeInactive}
                style={{
                  height: ms(22),
                  width: ms(22),
                  resizeMode: 'contain',
                }}
              />
              <Text
                style={{
                  color: focused ? COLORS.primary : '#9CA3AF',
                  fontSize: ms(14),
                  marginTop: ms(6),
                  fontFamily: FONTS.semiBold24,
                  includeFontPadding: false,
                }}
              >
                Take
              </Text>
            </View>
          ),
        }}
      />

      <Tab.Screen
        name="Drop"
        component={Drop}
        options={{
          tabBarIcon: ({ color, focused }) => (
            <View style={styles.con}>
              <Image
                source={focused ? ICONS.drop : ICONS.dropInactive}
                style={{
                  height: ms(22),
                  width: ms(22),
                  resizeMode: 'contain',
                }}
              />
              <Text
                style={{
                  color: focused ? COLORS.primary : '#9CA3AF',
                  fontSize: ms(14),
                  marginTop: ms(6),
                  fontFamily: FONTS.semiBold24,
                  includeFontPadding: false,
                }}
              >
                Drop
              </Text>
            </View>
          ),
        }}
      />
      <Tab.Screen
        name="Logs"
        component={Logs}
        options={{
          // tabBarStyle: { display: 'none' },
          tabBarIcon: ({ color, focused }) => (
            <View style={styles.con}>
              <Image
                source={focused ? ICONS.logs : ICONS.logInactive}
                style={{
                  height: ms(22),
                  width: ms(22),
                  resizeMode: 'contain',
                }}
              />
              <Text
                style={{
                  color: focused ? COLORS.primary : '#9CA3AF',
                  fontSize: ms(14),
                  marginTop: ms(6),
                  fontFamily: FONTS.semiBold24,
                  includeFontPadding: false,
                }}
              >
                Logs
              </Text>
            </View>
          ),
        }}
      />
    </Tab.Navigator>
  );
};

export default BottomTab;

const styles = StyleSheet.create({
  tabBarBackground: {
    flex: 1,
    overflow: 'hidden',
  },
  tabBarBlur: {
    flex: 1,
  },
  con: {
    width: width,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
