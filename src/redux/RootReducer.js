import { combineReducers } from '@reduxjs/toolkit';
import authReducer from './reducers/authReducer/authReducer';
// import dashBoardReducer from './reducers/dashBoardReducer';
// import userReducer from './reducers/userReducer';
// import retailersReducer from './reducers/retailersReducer';
// import commonReducer from './reducers/commonReducer';

const rootReducer = combineReducers({
  auth: authReducer,
  // dashBoard: dashBoardReducer,
  // user: userReducer,
  // retailers: retailersReducer,
  // common : commonReducer,
});

export default rootReducer;
