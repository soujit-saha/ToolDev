import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  StatusBar,
  ScrollView,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { COLORS, FONTS } from '../../utils/constants';
import { ms, mvs } from '../../utils/helper/metric';
import normalize from '../../utils/helper/normalize';
import BackButtonHeader from '../../component/BackButtonHeader';
import { navigate } from '../../utils/helper/RootNavigation';
import { useDispatch, useSelector } from 'react-redux';
import connectionrequest from '../../utils/helper/NetInfo';
import { verifyOTPRequest } from '../../redux/reducer/AuthReducer';
import ToastAlert from '../../utils/helper/Toast';
import Loader from '../../utils/helper/Loader';

const Otp = ({ route }: any) => {
  // console.log("route", route.params)
  const { signUpRes, isReqLoading } = useSelector(
    (state: any) => state.AuthReducer,
  );
  const { fcmToken } = useSelector((state: any) => state.MainReducer);
  const dispatch = useDispatch();
  const [otp, setOtp] = useState('');
  const [timer, setTimer] = useState(60);

  useEffect(() => {
    let interval = setInterval(() => {
      setTimer(prev => {
        if (prev <= 0) {
          clearInterval(interval);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [timer]);

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `0${m}:${s < 10 ? '0' : ''}${s}`;
  };

  const handleKeyPress = (key: string) => {
    if (key === 'delete') {
      setOtp(prev => prev.slice(0, -1));
    } else if (key !== '') {
      if (otp.length < 4) {
        setOtp(prev => prev + key);
      }
    }
  };

  const KEYPAD_BUTTONS = [
    ['1', '2', '3'],
    ['4', '5', '6'],
    ['7', '8', '9'],
    ['', '0', 'delete'],
  ];

  const onVerifyOtp = () => {
    let data = {
      email: signUpRes?.data?.email,
      otp: otp,
    };

    connectionrequest()
      .then(() => {
        dispatch(verifyOTPRequest(data));
      })
      .catch(err => {
        ToastAlert('Please connect To Internet');
      });
  };

  useEffect(() => {
    if (otp.length === 4) {
      onVerifyOtp();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [otp]);

  const onResendOtp = () => {
    setTimer(60);
    let data = route?.params;

    connectionrequest()
      .then(() => {
        // dispatch(sendOtpRequest(data));
      })
      .catch(err => {
        ToastAlert('Please connect To Internet');
      });
  };

  // console.log('sendOtpRes', sendOtpRes?.otp);

  return (
    <SafeAreaView style={styles.container}>
      {/* <Loader visible={isReqLoading} /> */}
      <ScrollView showsVerticalScrollIndicator={false}>
        <StatusBar
          barStyle="dark-content"
          backgroundColor={COLORS.background}
        />

        {/* Header / Back Button */}
        <BackButtonHeader />

        {/* Content Body */}
        <View style={styles.content}>
          {/* Title (Timer) */}
          <Text style={styles.title}>Verify Your Email</Text>
          {/* Subtitle */}
          <Text style={styles.subtitle}>
            Type the verification code{'\n'}we've sent you
          </Text>

          <View style={{ backgroundColor: '#bbbabaff', padding: ms(6), borderRadius: ms(4), marginBottom: ms(20) }}>

            <Text style={styles.stitle}>Your OTP code is : <Text style={{ color: COLORS.primary }}>{signUpRes?.data?.otp}</Text></Text>

          </View>

          {/* <Text style={styles.title}>{formatTime(timer)}</Text> */}



          {/* OTP Boxes Sequence */}
          <View style={styles.otpContainer}>
            {[0, 1, 2, 3].map(index => {
              const isFilled = index < otp.length;
              const isFocused = index === otp.length;

              const borderColor =
                isFilled || isFocused ? COLORS.primaryLight : COLORS.lightGray; // Soft pink matching screenshot
              const value = isFilled ? otp[index] : '0';

              let textColor = COLORS.lightGray;
              if (isFilled) textColor = COLORS.black;
              if (isFocused) textColor = COLORS.primaryLight; // Soft pink

              return (
                <View key={index} style={[styles.otpBox, { borderColor }]}>
                  <Text style={[styles.otpText, { color: textColor }]}>
                    {value}
                  </Text>
                </View>
              );
            })}
          </View>

          {/* Custom Keypad */}
          <View style={styles.keypadContainer}>
            {KEYPAD_BUTTONS.map((row, rowIndex) => (
              <View key={rowIndex} style={styles.keypadRow}>
                {row.map((key, colIndex) => {
                  if (key === '') {
                    return (
                      <View
                        key={`empty-${colIndex}`}
                        style={styles.keypadButton}
                      />
                    );
                  }
                  return (
                    <TouchableOpacity
                      key={key}
                      style={styles.keypadButton}
                      activeOpacity={0.6}
                      onPress={() => handleKeyPress(key)}
                    >
                      {key === 'delete' ? (
                        <Text style={styles.keypadIconText}>⌫</Text>
                      ) : (
                        <Text style={styles.keypadText}>{key}</Text>
                      )}
                    </TouchableOpacity>
                  );
                })}
              </View>
            ))}
          </View>

          {/* Resend Link */}
          <TouchableOpacity
            disabled={timer > 0}
            activeOpacity={0.7}
            style={styles.resendContainer}
            onPress={() => {
              // if (timer === 0) { setTimer(60) }
              // else {
              //     // navigate('ProfileDetails')
              //     onResendOtp()
              // }
              onResendOtp();
            }}
          >
            <Text
              style={[
                styles.resendLink,
                timer > 0 ? { color: COLORS.textTertiary } : {},
              ]}
            >
              {timer == 0 ? <Text>Send again</Text> : <Text>{formatTime(timer)}</Text>}
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default Otp;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  content: {
    flex: 1,
    alignItems: 'center',
    paddingHorizontal: ms(40),
    paddingTop: mvs(20),
  },
  title: {
    fontFamily: FONTS.bold24,
    fontSize: normalize(20),
    color: '#000000',
    marginBottom: mvs(10),
  },
  subtitle: {
    fontFamily: FONTS.regular24,
    fontSize: normalize(12),
    color: COLORS.textTertiary,
    textAlign: 'center',
    marginBottom: mvs(10),
    includeFontPadding: false,
  },
  stitle: {
    fontFamily: FONTS.medium24,
    fontSize: normalize(12),
    color: COLORS.black,
    textAlign: 'center',
    // marginBottom: mvs(40),
    includeFontPadding: false,
  },
  otpContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    marginBottom: mvs(50),
  },
  otpBox: {
    width: ms(60),
    height: ms(65),
    borderRadius: ms(12),
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.white,
  },
  otpText: {
    fontFamily: FONTS.bold24,
    fontSize: normalize(24),
  },
  keypadContainer: {
    width: '100%',
    paddingHorizontal: ms(20),
  },
  keypadRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: mvs(25),
  },
  keypadButton: {
    width: ms(60),
    height: ms(60),
    alignItems: 'center',
    justifyContent: 'center',
  },
  keypadText: {
    fontFamily: FONTS.regular24,
    fontSize: normalize(22),
    color: COLORS.black,
  },
  keypadIconText: {
    fontFamily: FONTS.regular24,
    fontSize: normalize(20),
    color: COLORS.black,
  },
  resendContainer: {
    marginTop: mvs(10),
    paddingBottom: mvs(30),
  },
  resendLink: {
    fontFamily: FONTS.bold24,
    fontSize: normalize(14),
    color: COLORS.primary,
  },
});
