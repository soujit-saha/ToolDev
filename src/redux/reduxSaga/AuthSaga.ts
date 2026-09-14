import AsyncStorage from '@react-native-async-storage/async-storage';
import { call, put, select, takeLatest } from 'redux-saga/effects';
import { PayloadAction } from '@reduxjs/toolkit';
import ToastAlert from '../../utils/helper/Toast';
import {
  getTokenFailure,
  getTokenSuccess,
  loginSuccess,
  loginFailure,
  signupSuccess,
  signupFailure,
  logoutFailure,
  logoutSuccess,
  verifyOTPSuccess,
  verifyOTPFailure,
  forgotPasswordSuccess,
  forgotPasswordFailure,
  resetPasswordSuccess,
  resetPasswordFailure,
  deleteAccountSuccess,
  deleteAccountFailure,
} from '../reducer/AuthReducer';
// import { getApi, postApi } from '../../utils/helper/ApiRequest';
import { ApiHeaders, ApiResponse } from '../types';
import { constants } from '../../utils/constants';
import { getApi, postApi } from '../../utils/helper/ApiRequest';
import { goBack, navigate } from '../../utils/helper/RootNavigation';

// Define types for action payloads
interface LoginPayload {
  email: string;
  password: string;
}

interface LogoutPayload {
  showMsg: boolean;
}

const getItems = (state: any) => state.AuthReducer;

//Checking Saga
export function* getTokenSaga(): Generator<any, void, any> {
  try {
    const response: string | null = yield call(
      AsyncStorage.getItem,
      constants?.TOKEN,
    );

    if (response != null) {
      const tokenData = JSON.parse(response);
      yield put(getTokenSuccess(tokenData));
    } else {
      yield put(getTokenSuccess(null)); // Provide default empty token instead of null
    }
  } catch (error: any) {
    yield put(getTokenFailure(error));
  }
}

//login saga
export function* loginSaga(
  action: PayloadAction<any>,
): Generator<any, void, any> {
  const header: ApiHeaders = {
    Accept: 'application/json',
    contenttype: 'application/json',
  };
  try {
    const response: ApiResponse = yield call(
      postApi,
      'login',
      action.payload,
      header,
    );

    console.log('login response', response);
    yield put(loginSuccess(response?.data));

    const token = response?.data?.token || response?.data?.data?.token;
    if (token) {
      yield call(AsyncStorage.setItem, constants.TOKEN, JSON.stringify(token));
      yield put(getTokenSuccess(token));
      ToastAlert('Login Successful');
    }
  } catch (error: any) {
    console.log(error);
    yield put(loginFailure(error));
    ToastAlert(error?.response?.data?.message || 'Login Failed');
  }
}

//signup saga
export function* signupSaga(
  action: PayloadAction<any>,
): Generator<any, void, any> {
  const header: ApiHeaders = {
    Accept: 'application/json',
    contenttype: 'application/json',
  };
  try {
    const response: ApiResponse = yield call(
      postApi,
      'register',
      action.payload,
      header,
    );

    console.log('signup response', response);
    yield put(signupSuccess(response?.data));
    navigate('Otp', action.payload);

    // const token = response?.data?.token || response?.data?.data?.token;
    // if (token) {
    //   yield call(AsyncStorage.setItem, constants.TOKEN, JSON.stringify(token));
    //   yield put(getTokenSuccess(token));
    //   ToastAlert('Signup Successful');
    // }
  } catch (error: any) {
    console.log(error);
    yield put(signupFailure(error));
    ToastAlert(error?.response?.data?.message || 'Signup Failed');
  }
}

//verifyOTPsaga
export function* verifyOTPSaga(
  action: PayloadAction<any>,
): Generator<any, void, any> {
  const item = yield select(getItems);
  const header: ApiHeaders = {
    Accept: 'application/json',
    contenttype: 'application/json',
  };
  try {
    const response: ApiResponse = yield call(
      postApi,
      'verify-otp',
      action.payload,
      header,
    );

    console.log('response', response, response?.data?.data?.token);
    yield put(verifyOTPSuccess(response?.data?.data));
    // navigate('Otp', action.payload)

    // if (response?.data?.data?.user?.name == null) {
    //   navigate('ProfileDetails');
    // } else {
    yield call(
      AsyncStorage.setItem,
      constants.TOKEN,
      JSON.stringify(response?.data?.data?.token),
    );
    yield put(getTokenSuccess(response?.data?.data?.token || null));
    yield put(verifyOTPSuccess(response?.data?.data));
    ToastAlert('Login Successful');
    // }
  } catch (error: any) {
    console.log(error);
    yield put(verifyOTPFailure(error));
    ToastAlert(error?.response?.data?.message || 'Social Auth Failed');
  }
}

//logout saga
export function* logoutSaga(
  action: PayloadAction<LogoutPayload>,
): Generator<any, void, any> {
  try {
    yield call(AsyncStorage.removeItem, constants.TOKEN);
    yield put(getTokenSuccess(null)); // Provide default empty token instead of null
    yield put(logoutSuccess({ message: 'logout', success: true }));
    // if (action.payload.showMsg) {
    ToastAlert('Logout Successful');
    // }
  } catch (error: any) {
    yield put(logoutFailure(error));
    ToastAlert('Logout Failed');
  }
}

// forgot password saga
export function* forgotPasswordSaga(
  action: PayloadAction<any>,
): Generator<any, void, any> {
  const header: ApiHeaders = {
    Accept: 'application/json',
    contenttype: 'application/json',
  };
  try {
    const response: ApiResponse = yield call(
      postApi,
      'forgot-password',
      action.payload,
      header,
    );

    console.log('forgot password response', response);
    yield put(forgotPasswordSuccess(response?.data));
    ToastAlert(response?.data?.message || 'Reset link sent');
    navigate('ResetPassword', { email: action.payload.email });
  } catch (error: any) {
    console.log(error);
    yield put(forgotPasswordFailure(error));
    ToastAlert(error?.response?.data?.message || 'Forgot password failed');
  }
}

// reset password saga
export function* resetPasswordSaga(
  action: PayloadAction<any>,
): Generator<any, void, any> {
  const header: ApiHeaders = {
    Accept: 'application/json',
    contenttype: 'application/json',
  };
  try {
    const response: ApiResponse = yield call(
      postApi,
      'reset-password',
      action.payload,
      header,
    );

    console.log('reset password response', response);
    yield put(resetPasswordSuccess(response?.data));
    ToastAlert(response?.data?.message || 'Password reset successful');
    navigate('Login');
  } catch (error: any) {
    console.log(error);
    yield put(resetPasswordFailure(error));
    ToastAlert(error?.response?.data?.message || 'Reset password failed');
  }
}

// delete account saga
export function* deleteAccountSaga(
  action: PayloadAction<any>,
): Generator<any, void, any> {
  const item = yield select(getItems);
  const header: ApiHeaders = {
    Accept: 'application/json',
    contenttype: 'application/json',
    accesstoken: item.getTokenResponse,
  };
  try {
    const response: ApiResponse = yield call(
      postApi,
      'profile/delete-account',
      {},
      header,
    );

    console.log('delete account response', response);
    yield put(deleteAccountSuccess(response?.data));
    
    // Clear token and sign user out locally
    yield call(AsyncStorage.removeItem, constants.TOKEN);
    yield put(getTokenSuccess(null)); 
    
    ToastAlert(response?.data?.message || 'Account deleted successfully');
  } catch (error: any) {
    console.log(error);
    yield put(deleteAccountFailure(error));
    ToastAlert(error?.response?.data?.message || 'Delete account failed');
  }
}

// Watcher Saga
export function* watchAuthSaga(): Generator<any, void, any> {
  yield takeLatest('Auth/getTokenRequest', getTokenSaga);
  yield takeLatest('Auth/loginRequest', loginSaga);
  yield takeLatest('Auth/signupRequest', signupSaga);
  yield takeLatest('Auth/logoutRequest', logoutSaga);
  yield takeLatest('Auth/verifyOTPRequest', verifyOTPSaga);
  yield takeLatest('Auth/forgotPasswordRequest', forgotPasswordSaga);
  yield takeLatest('Auth/resetPasswordRequest', resetPasswordSaga);
  yield takeLatest('Auth/deleteAccountRequest', deleteAccountSaga);
}
