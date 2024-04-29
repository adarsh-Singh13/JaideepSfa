import { ApiEndPoints } from "../../../api/urlConstants";
import { createAsyncThunk } from '@reduxjs/toolkit';
import { HelperService } from '../../../utils/HelperService';
import { getConnectionStatus } from '../../Selectors'

import {
  loginLoading,
  loginSuccess,
  loginFailure,
  userLoginOtpLoading,
  userLoginOtpSuccess,
  userLoginOtpFailure,
} from '../../reducers/authReducer/authReducer';

export const loginRequest = (params, callback) => {

  return async ( dispatch ) => {
    console.log("AUTHLOGIN===", params);
    
    dispatch(loginLoading());
    try {
      const response = await fetch(ApiEndPoints.LOGIN_SEND, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(params),
      });
      
      console.log("AUTHLOGIN===2", response.ok);
      if (!response.ok) {
        throw new Error('Failed to login: Invalid User-ID.');
      }
      
      const userData = await response.json();
      
      console.log("AUTHLOGIN===3",userData);
      
      if (userData.response && userData.response.error === 1) {
        throw new Error(userData.response.error_message);
      }

      dispatch(loginSuccess(userData));
      callback();
    } catch (error) {
      dispatch(loginFailure(error.message));
      HelperService.showToast({ message: error.message, duration: 2000 });
      throw error;
    }
  }
};

export const loginOtpRequest = createAsyncThunk(
  'user/loginOtp',
  async (params, thunkAPI) => {
    const isOnline = thunkAPI.getState().connectionStatus;
    if (!isOnline) {
      throw new Error('Cannot Login. No Internet connection.');
    }

    const { dispatch } = thunkAPI;

    dispatch(userLoginOtpLoading());
    try {
      const response = await fetch(ApiEndPoints.LOGIN_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(params),
      });

      if (!response.ok) {
        throw new Error('Failed to login: Invalid User-ID.');
      }

      const userData = await response.json();

      if (userData.response && userData.response.error === 1) {
        throw new Error(userData.response.error_message);
      }

      dispatch(userLoginOtpSuccess(userData));
      HelperService.showToast({
        message: 'Logged in successfully!!',
        duration: 1000,
        buttonText: '',
      });


      if (userData.user_details && userData.user_details.areas) {
        let data2 = HelperService.convertToSearchableListFormat({
          list: userData.user_details.areas,
          id_key: 'area__c',
          label_key: 'name',
        });
        // dispatch(fetchAllAreasSuccess(data2));
      }
    } catch (error) {
      dispatch(userLoginOtpFailure(error.message));
      HelperService.showToast({ message: error.message, duration: 2000 });
      throw error;
    }
  }
);

export const logOutRequest = (params) => {
  return async () => { };
};
