import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface AuthState {
  status: string;
  isLoading: boolean;
  isReqLoading: boolean;
  getTokenResponse: string | null;
  logoutResponse: {};
  error?: string;
  signUpRes: {};
  loginRes?: {};
  verifyOTPRes: {};
  ResetPasswordRes?: {};
  ForgotPasswordRes?: {};
  deleteAccountRes?: {};
}

const initialState: AuthState = {
  status: '',
  isLoading: true,
  isReqLoading: false,
  getTokenResponse: '',
  logoutResponse: {},
  signUpRes: {},
  loginRes: {},
  verifyOTPRes: {},
  ResetPasswordRes: {},
  ForgotPasswordRes: {},
  deleteAccountRes: {},
};

const AuthSlice = createSlice({
  name: 'Auth',
  initialState,
  reducers: {
    //get token
    getTokenRequest(state, action: PayloadAction<void>) {
      state.isLoading = true;
      state.status = action.type;
    },
    getTokenSuccess(state, action: PayloadAction<string | null>) {
      state.isLoading = false;
      state.getTokenResponse = action.payload;
      state.status = action.type;
    },
    getTokenFailure(state, action: PayloadAction<any>) {
      state.isLoading = false;
      state.error = action.payload?.error || 'Get token failed';
      state.status = action.type;
    },

    // loginRequest
    loginRequest(state, action: PayloadAction<any>) {
      state.isReqLoading = true;
      state.status = action.type;
    },
    loginSuccess(state, action: PayloadAction<any>) {
      state.isReqLoading = false;
      state.loginRes = action.payload;
      state.status = action.type;
    },
    loginFailure(state, action: PayloadAction<any>) {
      state.isReqLoading = false;
      state.error = action.payload?.error || 'Login failed';
      state.status = action.type;
    },

    // signupRequest
    signupRequest(state, action: PayloadAction<any>) {
      state.isReqLoading = true;
      state.status = action.type;
    },
    signupSuccess(state, action: PayloadAction<any>) {
      state.isReqLoading = false;
      state.signUpRes = action.payload;
      state.status = action.type;
    },
    signupFailure(state, action: PayloadAction<any>) {
      state.isReqLoading = false;
      state.error = action.payload?.error || 'Signup failed';
      state.status = action.type;
    },

    //login
    verifyOTPRequest(state, action: PayloadAction<any>) {
      state.isReqLoading = true;
      state.status = action.type;
    },
    verifyOTPSuccess(state, action: PayloadAction<any>) {
      state.isReqLoading = false;
      state.verifyOTPRes = action.payload;
      state.status = action.type;
    },
    verifyOTPFailure(state, action: PayloadAction<any>) {
      state.isReqLoading = false;
      state.error = action.payload?.error || 'verifyOTP failed';
      state.status = action.type;
    },

    // forgot password
    forgotPasswordRequest(state, action: PayloadAction<any>) {
      state.isReqLoading = true;
      state.status = action.type;
    },
    forgotPasswordSuccess(state, action: PayloadAction<any>) {
      state.isReqLoading = false;
      state.ForgotPasswordRes = action.payload;
      state.status = action.type;
    },
    forgotPasswordFailure(state, action: PayloadAction<any>) {
      state.isReqLoading = false;
      state.error = action.payload?.error || 'Forgot password failed';
      state.status = action.type;
    },

    // reset password
    resetPasswordRequest(state, action: PayloadAction<any>) {
      state.isReqLoading = true;
      state.status = action.type;
    },
    resetPasswordSuccess(state, action: PayloadAction<any>) {
      state.isReqLoading = false;
      state.ResetPasswordRes = action.payload;
      state.status = action.type;
    },
    resetPasswordFailure(state, action: PayloadAction<any>) {
      state.isReqLoading = false;
      state.error = action.payload?.error || 'Reset password failed';
      state.status = action.type;
    },

    //logout
    logoutRequest(state, action: PayloadAction<any>) {
      state.isReqLoading = true;
      state.status = action.type;
    },
    logoutSuccess(state, action: PayloadAction<any>) {
      state.isReqLoading = false;
      state.logoutResponse = action.payload;
      state.status = action.type;
    },
    logoutFailure(state, action: PayloadAction<any>) {
      state.isReqLoading = false;
      state.error = action.payload?.error || 'Logout failed';
      state.status = action.type;
    },

    // delete account
    deleteAccountRequest(state, action: PayloadAction<any>) {
      state.isReqLoading = true;
      state.status = action.type;
    },
    deleteAccountSuccess(state, action: PayloadAction<any>) {
      state.isReqLoading = false;
      state.deleteAccountRes = action.payload;
      state.status = action.type;
    },
    deleteAccountFailure(state, action: PayloadAction<any>) {
      state.isReqLoading = false;
      state.error = action.payload?.error || 'Delete account failed';
      state.status = action.type;
    },
  },
});

export const {
  getTokenRequest,
  getTokenSuccess,
  getTokenFailure,

  loginRequest,
  loginSuccess,
  loginFailure,

  signupRequest,
  signupSuccess,
  signupFailure,

  logoutRequest,
  logoutSuccess,
  logoutFailure,

  verifyOTPRequest,
  verifyOTPSuccess,
  verifyOTPFailure,

  forgotPasswordRequest,
  forgotPasswordSuccess,
  forgotPasswordFailure,

  resetPasswordRequest,
  resetPasswordSuccess,
  resetPasswordFailure,

  deleteAccountRequest,
  deleteAccountSuccess,
  deleteAccountFailure,
} = AuthSlice.actions;

export default AuthSlice.reducer;
