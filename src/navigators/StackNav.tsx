import { NavigationContainer } from '@react-navigation/native';
import {
  createStackNavigator,
  TransitionPresets,
  CardStyleInterpolators,
} from '@react-navigation/stack';
import React, { useEffect, useState } from 'react';
import { Platform, Easing } from 'react-native';
import { navigationRef } from '../utils/helper/RootNavigation';
import BottomTab from './BottomTab';

import SplashScreen from '../screens/auth/SplashScreen';
import Signup from '../screens/auth/Signup';
import Login from '../screens/auth/Login';
import Otp from '../screens/auth/Otp';
import ForgotPassword from '../screens/auth/ForgotPassword';
import ResetPassword from '../screens/auth/ResetPassword';
import Profile from '../screens/main/Profile';
import Notifications from '../screens/main/Notifications';
import ScheduleCalendar from '../screens/main/ScheduleCalendar';
import ToolCategories from '../screens/main/ToolCategories';
import AddNewTool from '../screens/main/AddNewTool';
import Teams from '../screens/main/Teams';
import TeamsDetails from '../screens/main/TeamsDetails';
import { useSelector } from 'react-redux';


type RootStackParamList = {
  SplashScreen: undefined;
  Signup: undefined;
  Login: undefined;
  Otp: undefined;
  BottomTab: undefined;
  Profile: undefined;
  Notifications: undefined;
  ScheduleCalendar: undefined;
  ToolCategories: undefined;
  AddNewTool: undefined;
  Teams: undefined;
  TeamsDetails: undefined;
  ForgotPassword: undefined;
  ResetPassword: { email: string };
};

const Stack = createStackNavigator<RootStackParamList>();

// Enhanced smooth transition configuration
const smoothTransition = {
  // gestureEnabled: true,
  gestureDirection: 'horizontal' as const,
  transitionSpec: {
    open: {
      animation: 'timing' as const,
      config: {
        duration: 350,
        easing: Easing.out(Easing.poly(4)),
      },
    },
    close: {
      animation: 'timing' as const,
      config: {
        duration: 300,
        easing: Easing.in(Easing.poly(4)),
      },
    },
  },
  cardStyleInterpolator: CardStyleInterpolators.forHorizontalIOS,
};

export default function StackNav() {
  const { getTokenResponse, isLoading } = useSelector(
    (state: any) => state.AuthReducer,
  );

  console.log("getTokenResponse", getTokenResponse);
  const Screens: Partial<{
    [key in keyof RootStackParamList]: React.ComponentType<any>;
  }> =
    getTokenResponse == null ?
      {

        Login,
        Signup,
        Otp,
        ForgotPassword,
        ResetPassword,

      } :
      {
        BottomTab,
        Profile,
        Notifications,
        ScheduleCalendar,
        ToolCategories,
        AddNewTool,
        Teams,
        TeamsDetails
      };

  if (isLoading) {
    return <SplashScreen />;
  } else {
    return (
      <NavigationContainer ref={navigationRef}>
        <Stack.Navigator
          screenOptions={{
            headerShown: false,
            ...smoothTransition,
          }}
        >
          {Object.entries({
            ...Screens,
          }).map(([name, component], index) => {
            return (
              <Stack.Screen
                key={index}
                name={name as keyof RootStackParamList}
                component={component}
                options={{
                  ...smoothTransition,
                  // gestureEnabled: true,
                  gestureResponseDistance: 50, // Increase swipe sensitivity
                }}
              />
            );
          })}
        </Stack.Navigator>
      </NavigationContainer>
    );
  }
}
