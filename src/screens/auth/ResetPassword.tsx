import React, { useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  Image,
  StatusBar,
} from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { COLORS, FONTS, ICONS, IMAGES } from '../../utils/constants';
import { s, vs, ms, mvs } from '../../utils/helper/metric';
import { SafeAreaView } from 'react-native-safe-area-context';
import { goBack, navigate } from '../../utils/helper/RootNavigation';
import { useDispatch, useSelector } from 'react-redux';
import { resetPasswordRequest } from '../../redux/reducer/AuthReducer';
import ToastAlert from '../../utils/helper/Toast';

const ResetPassword = ({ route }: any) => {
  const { email } = route?.params || {};
  const [otp, setOtp] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const dispatch = useDispatch();
  const { isReqLoading, ForgotPasswordRes } = useSelector((state: any) => state.AuthReducer);

  const onSubmitPress = () => {
    if (!otp) {
      ToastAlert('Please enter OTP');
    } else if (!newPassword) {
      ToastAlert('Please enter New Password');
    } else if (!confirmPassword) {
      ToastAlert('Please enter Confirm Password');
    } else if (newPassword !== confirmPassword) {
      ToastAlert('New Password and Confirm Password do not match');
    } else {
      dispatch(resetPasswordRequest({
        email,
        otp,
        password: newPassword,
        password_confirmation: confirmPassword
      }));
    }
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar
        barStyle="dark-content"
        backgroundColor={COLORS.backgroundSecondary}
      />
      <KeyboardAwareScrollView
        contentContainerStyle={styles.scrollContent}
        enableOnAndroid={true}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.card}>
          {/* Logo Area */}
          <View style={styles.logoContainer}>
            <Image
              source={IMAGES.logo}
              style={styles.logoIcon}
              resizeMode="contain"
            />
          </View>

          <Text style={styles.title}>GeckoRoofing</Text>
          <Text style={styles.subtitle}>Reset Password</Text>
          <Text style={styles.title}>{ForgotPasswordRes?.data?.otp}</Text>

          {/* OTP Input */}
          <View style={styles.inputContainer}>
            <Text style={styles.label}>OTP</Text>
            <View style={styles.inputWrapper}>
              <TextInput
                style={styles.input}
                placeholder="Enter OTP"
                placeholderTextColor={COLORS.placeholderGray}
                value={otp}
                onChangeText={setOtp}
                keyboardType="number-pad"
                maxLength={4}
              />
            </View>
          </View>

          {/* New Password Input */}
          <View style={styles.inputContainer}>
            <Text style={styles.label}>New Password</Text>
            <View style={styles.inputWrapper}>
              <TextInput
                style={styles.input}
                placeholder="••••••••"
                placeholderTextColor={COLORS.placeholderGray}
                value={newPassword}
                onChangeText={setNewPassword}
                secureTextEntry={!showNewPassword}
              />
              <TouchableOpacity
                onPress={() => setShowNewPassword(!showNewPassword)}
                hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
              >
                <Image
                  source={showNewPassword ? ICONS.eye_on : ICONS.eye_off}
                  style={styles.eyeIcon}
                  resizeMode="contain"
                />
              </TouchableOpacity>
            </View>
          </View>

          {/* Confirm Password Input */}
          <View style={styles.inputContainer}>
            <Text style={styles.label}>Confirm Password</Text>
            <View style={styles.inputWrapper}>
              <TextInput
                style={styles.input}
                placeholder="••••••••"
                placeholderTextColor={COLORS.placeholderGray}
                value={confirmPassword}
                onChangeText={setConfirmPassword}
                secureTextEntry={!showConfirmPassword}
              />
              <TouchableOpacity
                onPress={() => setShowConfirmPassword(!showConfirmPassword)}
                hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
              >
                <Image
                  source={showConfirmPassword ? ICONS.eye_on : ICONS.eye_off}
                  style={styles.eyeIcon}
                  resizeMode="contain"
                />
              </TouchableOpacity>
            </View>
          </View>

          {/* Reset Password Button */}
          <TouchableOpacity
            style={styles.button}
            activeOpacity={0.8}
            onPress={() => onSubmitPress()}
            disabled={isReqLoading}
          >
            <Text style={styles.buttonText}>{isReqLoading ? 'Resetting...' : 'Reset Password'}</Text>
          </TouchableOpacity>

          {/* Back to Login Link */}
          <View style={styles.loginContainer}>
            <TouchableOpacity onPress={() => navigate('Login')}>
              <Text style={styles.loginText}>Back to Login</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Footer Text */}
        <Text style={styles.footerText}>
          Designed for industrial-grade logistics and high-{'\n'}performance
          warehousing.
        </Text>
      </KeyboardAwareScrollView>
    </SafeAreaView>
  );
};

export default ResetPassword;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.backgroundSecondary,
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: 'center',
    paddingHorizontal: s(32),
    paddingVertical: vs(40),
  },
  card: {
    backgroundColor: COLORS.white,
    borderRadius: ms(16),
    padding: ms(32),
    shadowColor: COLORS.black,
    shadowOffset: { width: 0, height: vs(4) },
    shadowOpacity: 0.05,
    shadowRadius: ms(15),
    elevation: 5,
    alignItems: 'center',
  },
  logoContainer: {
    width: ms(70),
    height: ms(70),
    backgroundColor: COLORS.primary,
    borderRadius: ms(12),
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: mvs(16),
  },
  logoIcon: {
    width: ms(60),
    height: ms(60),
  },
  title: {
    fontFamily: FONTS.bold24,
    fontSize: ms(22),
    color: COLORS.black,
    marginBottom: mvs(2),
  },
  subtitle: {
    fontFamily: FONTS.bold18,
    fontSize: ms(14),
    color: COLORS.primary,
    marginBottom: mvs(32),
  },
  inputContainer: {
    width: '100%',
    marginBottom: mvs(16),
  },
  label: {
    fontFamily: FONTS.semiBold18,
    fontSize: ms(13),
    color: COLORS.black,
    marginBottom: mvs(8),
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    height: vs(48),
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: ms(8),
    paddingHorizontal: s(16),
    backgroundColor: COLORS.white,
  },
  input: {
    flex: 1,
    fontFamily: FONTS.regular18,
    fontSize: ms(14),
    color: COLORS.textPrimary,
    height: '100%',
  },
  eyeIcon: {
    width: s(16),
    height: s(16),
    tintColor: COLORS.gray,
  },
  button: {
    width: '100%',
    height: vs(48),
    backgroundColor: COLORS.primary,
    borderRadius: ms(8),
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: mvs(16),
    marginBottom: mvs(32),
  },
  buttonText: {
    fontFamily: FONTS.bold18,
    fontSize: ms(16),
    color: COLORS.white,
  },
  loginContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: mvs(8),
  },
  loginText: {
    fontFamily: FONTS.bold18,
    fontSize: ms(13),
    color: COLORS.primary,
  },
  footerText: {
    fontFamily: FONTS.regular18,
    fontSize: ms(12),
    color: COLORS.shuttleGray,
    textAlign: 'center',
    marginTop: mvs(32),
    paddingHorizontal: s(16),
    lineHeight: mvs(18),
  },
});
