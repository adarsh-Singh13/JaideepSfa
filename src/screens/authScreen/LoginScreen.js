import React from 'react';
import { SafeAreaView, StyleSheet, Text, View } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'

/**
 * ? Local Imports
 */

import BackGround from '../../components/background/BackGround';
import { Colors } from '../../themes/Theme';
import InputText from '../../components/formInput/InputText';
import AnimatedBtnLoader from '../../components/animatedLoaderBtn/AnimatedBtnLoader';
import { HelperService } from '../../utils/HelperService';
import { loginRequest } from '../../redux/action/auth/authAction';
import { changeLoginForm } from '../../redux/reducers/authReducer/authReducer'
import { useNavigation } from '@react-navigation/native';

export function LoginScreen() {

  const otp = useSelector((state)=> state.auth.otp)
  const userLoginLoader = useSelector((state) => state.auth.userLoginLoader)
  const [userId, setUserId] = React.useState('');
  const dispatch = useDispatch();
  const navigation = useNavigation();

 const loginPressHandler = () => {
  if (!userId) {
    HelperService.showToast({message:"Enter the Correct Credentials", duration: 2000})
  } else {
    dispatch(
      loginRequest({
        customerid: userId,
        type: 'SFA',
      }, ()=>navigation.navigate("LoginOtp")
    ),
    )
  }
 }

 const handleUserIdChange = (value) => {
  setUserId(value);
  dispatch(changeLoginForm({ customerid: value }));
 };

  return (
    <SafeAreaView style={{flex: 1}}>
    <BackGround>
      <View style={styles.container}>
        <Text style={styles.wlcmTxt}>Welcome back !</Text>
        <View style={styles.loginContainer}>
          <Text style={styles.loginTxt1}>Login</Text>
          <Text style={styles.loginTxt2}>Enter Your MOIRA user id</Text>
          <InputText
            placeholder='Enter here'
            style={styles.usrname}
            value={userId.toString().toUpperCase()}
            onChange={handleUserIdChange}
          />
        <View style={styles.loginBTNContainer}>
          <AnimatedBtnLoader
            onPress={loginPressHandler}
            loader={userLoginLoader}
            userId={userId}
            text={'login'}
          />
        </View>
        </View>
      </View>
    </BackGround>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    width: 'auto',
    height: '150%',
    marginRight: 70,
    marginTop: -75,
  },
  wlcmTxt: {
    fontWeight: '800',
    fontSize: 35,
    marginLeft: '-20%',
    marginBottom: '6%',
    textTransform: 'uppercase',
    color: Colors.button,
  },
  loginContainer: {
    width: '150%',
    height: '100%',
    backgroundColor: '#ffd6f3e9',
    padding: 20,
    borderRadius: 10,
    shadowColor: '#463240',
    shadowOffset: {
      width: 0,
      height: 6,
    },
    shadowOpacity: 0.28,
    shadowRadius: 3.84,
    elevation: 10,
  },
  loginTxt1: {
    alignSelf: 'center',
    fontWeight: 'bold',
    fontSize: 25,
    marginTop: -8,
    marginBottom: 4,
    color: Colors.clr66
  },
  loginTxt2: {
    alignSelf: 'center',
    fontWeight: '500',
    fontSize: 14,
    marginTop: 1,
    marginBottom: 5,
    color: Colors.clr66,
    textTransform: 'uppercase',
  },
  loginBTNContainer: {
    marginTop: 25,
    marginBottom: -55
  },
})