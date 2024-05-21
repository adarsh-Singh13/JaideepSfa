import { createSlice } from '@reduxjs/toolkit';
import { HelperService } from '../../../utils/HelperService';

const initialState = {
    userLoginLoader: false,
    userLoginErrorMessage: null,
    userId: null,
    customerid: '',
    token: '',
    userLoginOtpLoader: false,
    userLoginIsLoading: false,
    userLoginOtpErrorMessage: null,
    otp: '',
    is_logged_in: '',
    validation: {
        invalid_number: false,
        invalid_password: false,
        invalid_area: false,
        error_message: '',
    },
    
};

const authSlice = createSlice({
    name: "auth",
    initialState,
    reducers : {
        changeLoginForm (state, action) {
            const { user } = action.payload;
            const otp = user?.otp ?? state.otp;
            const customerid = user?.customerid ?? state.customerid;
            return {
              ...state,
              customerid,
              userLoginIsLoading: false,
              otp,
              validation: {
                  invalid_number: false,
                  invalid_password: false,
                  invalid_area: false,
                  error_message: '',
                },
            };
        },
        loginLoading (state) {
            state.userLoginLoader = true;
            state.userLoginErrorMessage = null
        },
        loginSuccess (state, action) {
            state.userLoginLoader = false;
            state.userLoginErrorMessage = null;
        },
        loginFailure (state, action) {
            state.userLoginLoader = false;
            state.userLoginErrorMessage = action.errorMessage;
            state.userLoginLoader = false;
        },
        userLoginOtpLoading (state) {
            state.userLoginOtpLoader = true;
        },
        userLoginOtpSuccess (state, action) {
            state.token = user.user_details.token__c;
            state.userId = user.user_details.sfid;
            state.userLoginOtpLoader = false;
            state.userLoginOtpErrorMessage = null;
            state.otp = initialState.otp;
            state.is_logged_in = HelperService.getCurrentTimestamp();
        },
        userLoginOtpFailure (state,  action ) {
            state.userId = null;
            state.token = null;
            state.userLoginIsLoading = false;
            userLoginErrorMessage = errorMessage;
            state.userLoginOtpLoader = false;
            state.otp = '';
        }        
    }
})

export const {
    loginLoading,
    loginSuccess,
    loginFailure,
    userLoginOtpLoading,
    userLoginOtpSuccess,
    userLoginOtpFailure,
    changeLoginForm,
} = authSlice.actions;

export default authSlice.reducer