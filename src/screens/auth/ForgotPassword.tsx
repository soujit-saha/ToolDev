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
import { COLORS, FONTS, IMAGES } from '../../utils/constants';
import { s, vs, ms, mvs } from '../../utils/helper/metric';
import { SafeAreaView } from 'react-native-safe-area-context';
import { goBack } from '../../utils/helper/RootNavigation';
import { useDispatch, useSelector } from 'react-redux';
import { forgotPasswordRequest } from '../../redux/reducer/AuthReducer';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const dispatch = useDispatch();
  const { isReqLoading } = useSelector((state: any) => state.AuthReducer);

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
          <Text style={styles.subtitle}>Forgot Password</Text>

          <Text style={styles.instructionText}>
            Enter your email address and we'll send you a link to reset your password.
          </Text>

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

          {/* Send Link Button */}
          <TouchableOpacity
            style={styles.button}
            activeOpacity={0.8}
            onPress={() => {
              if (email) {
                dispatch(forgotPasswordRequest({ email }));
              }
            }}
            disabled={isReqLoading}
          >
            <Text style={styles.buttonText}>{isReqLoading ? 'Sending...' : 'Next'}</Text>
          </TouchableOpacity>

          {/* Back to Login Link */}
          <View style={styles.loginContainer}>
            <Text style={styles.rememberedText}>Remember your password? </Text>
            <TouchableOpacity onPress={() => goBack()}>
              <Text style={styles.loginText}>Login</Text>
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

export default ForgotPassword;

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
    marginBottom: mvs(16),
  },
  instructionText: {
    fontFamily: FONTS.regular18,
    fontSize: ms(13),
    color: COLORS.shuttleGray,
    textAlign: 'center',
    marginBottom: mvs(32),
    lineHeight: mvs(18),
  },
  inputContainer: {
    width: '100%',
    marginBottom: mvs(32),
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
  loginContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: mvs(8),
  },
  rememberedText: {
    fontFamily: FONTS.regular18,
    fontSize: ms(13),
    color: COLORS.shuttleGray,
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
