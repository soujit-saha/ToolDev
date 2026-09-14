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
import { navigate } from '../../utils/helper/RootNavigation';
import { useDispatch, useSelector } from 'react-redux';
import { loginRequest } from '../../redux/reducer/AuthReducer';
import ToastAlert from '../../utils/helper/Toast';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const dispatch = useDispatch();
  const { isReqLoading } = useSelector((state: any) => state.AuthReducer);

  const handleLogin = () => {
    if (!email.trim()) {
      ToastAlert('Please enter your email');
      return;
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email.trim())) {
      ToastAlert('Please enter a valid email address');
      return;
    }
    if (!password) {
      ToastAlert('Please enter your password');
      return;
    }
    if (password.length < 6) {
      ToastAlert('Password must be at least 6 characters');
      return;
    }

    dispatch(
      loginRequest({
        email: email.trim(),
        password: password,
      })
    );
  };

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
          <Text style={styles.subtitle}>Management</Text>

          {/* Email Input */}
          <View style={styles.inputContainer}>
            <Text style={styles.label}>Email</Text>
            <View style={styles.inputWrapper}>
              <TextInput
                style={styles.input}
                placeholder="name@company.com"
                placeholderTextColor={COLORS.placeholderGray}
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
              />
            </View>
          </View>

          {/* Password Input */}
          <View style={styles.inputContainer}>
            <Text style={styles.label}>Password</Text>
            <View style={styles.inputWrapper}>
              <TextInput
                style={styles.input}
                placeholder="••••••••"
                placeholderTextColor={COLORS.placeholderGray}
                value={password}
                onChangeText={setPassword}
                secureTextEntry={!showPassword}
              />
              <TouchableOpacity
                onPress={() => setShowPassword(!showPassword)}
                hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
              >
                <Image
                  source={showPassword ? ICONS.eye_on : ICONS.eye_off}
                  style={styles.eyeIcon}
                  resizeMode="contain"
                />
              </TouchableOpacity>
            </View>
          </View>

          {/* Forgot Password */}
          <TouchableOpacity style={styles.forgotPasswordContainer} onPress={() => navigate('ForgotPassword')}>
            <Text style={styles.forgotPasswordText}>Forgot Password?</Text>
          </TouchableOpacity>

          {/* Login Button */}
          <TouchableOpacity
            style={styles.button}
            activeOpacity={0.8}
            onPress={handleLogin}
            disabled={isReqLoading}
          >
            <Text style={styles.buttonText}>
              {isReqLoading ? 'Logging in...' : 'Login'}
            </Text>
          </TouchableOpacity>

          {/* Sign Up Link */}
          <View style={styles.signupContainer}>
            <Text style={styles.noAccountText}>No account? </Text>
            <TouchableOpacity onPress={() => navigate('Signup')}>
              <Text style={styles.signupText}>Sign Up</Text>
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

export default Login;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.backgroundSecondary,
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: 'center',
    paddingHorizontal: s(10),
    paddingVertical: vs(40),
  },
  card: {
    backgroundColor: COLORS.white,
    borderRadius: ms(16),
    padding: ms(20),
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
  forgotPasswordContainer: {
    width: '100%',
    alignItems: 'flex-end',
    marginBottom: mvs(32),
  },
  forgotPasswordText: {
    fontFamily: FONTS.bold18,
    fontSize: ms(12),
    color: COLORS.primary,
  },
  button: {
    width: '100%',
    height: vs(48),
    backgroundColor: COLORS.primary,
    borderRadius: ms(8),
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: mvs(32),
  },
  buttonText: {
    fontFamily: FONTS.bold18,
    fontSize: ms(16),
    color: COLORS.white,
  },
  signupContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: mvs(8),
  },
  noAccountText: {
    fontFamily: FONTS.regular18,
    fontSize: ms(13),
    color: COLORS.shuttleGray,
  },
  signupText: {
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
