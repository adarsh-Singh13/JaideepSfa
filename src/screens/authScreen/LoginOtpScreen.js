import React, { useEffect, useRef, useState } from 'react';
import { View, Text, StyleSheet, SafeAreaView, TextInput } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useDispatch, useSelector } from 'react-redux';
import DeviceInfo from 'react-native-device-info';

/**
 * ? LOCAL IMPORTS
*/

import { Colors } from '../../themes/Theme';
import BackGround from '../../components/background/BackGround';
import AnimatedBtnLoader from '../../components/animatedLoaderBtn/AnimatedBtnLoader';
import BackArrowButton from '../../components/backArrowButton/BackArrowButton';

export function LoginOtpScreen() {

    const dispatch = useDispatch();
    const navigation = useNavigation();
    const otpLength = 6;
    const otpInputRefs = useRef(Array(otpLength).fill(null));
    const [enteredOtp, setEnteredOtp] = useState(0);
    const [highlightedBoxIndex, setHighlightedBoxIndex] = useState(0);
    const [blinkHighlightedBox, setBlinkHighlightedBox] = useState(true)
    const [blinkStates, setBlinkStates] = useState(Array(otpLength).fill(true));
    // STATES
    const userLoginOtpLoader = useSelector((state) => state.auth.userLoginOtpLoader)

    useEffect(() => {
        if (highlightedBoxIndex < otpInputRefs.current.length) {
            otpInputRefs.current[highlightedBoxIndex]?.focus();
        }
    }, [highlightedBoxIndex, enteredOtp]);

    useEffect(() => {
        const blinkingInterval = setInterval(() => {
            // Toggle blink state only for the highlighted box
            setBlinkStates(prevStates => {
                const updatedStates = [...prevStates];
                updatedStates[highlightedBoxIndex] = !updatedStates[highlightedBoxIndex];
                return updatedStates;
            });
        }, 700);
        return () => clearInterval(blinkingInterval);
    }, [highlightedBoxIndex]);

    // handle back press
    const backPressHandler = (index, key) => {
        if (key === 'Backspace') {
            if (index > 0) {
                setHighlightedBoxIndex(index - 1);
                const newEnteredOtp = enteredOtp.slice(0, index - 1) + enteredOtp.slice(index);
                setEnteredOtp(newEnteredOtp);
            } else {
                setHighlightedBoxIndex(0);
            }
        }
    };

    
    // onchange Otp Input handler
    const handleOtpInpuChange = (value, index) => {
        if (value === '') {
            // If deleting the last digit, don't change highlighted index
            if (index === otpLength - 1) {
                setEnteredOtp(prevEnteredOtp => prevEnteredOtp.slice(0, -1));
            } else {
                setEnteredOtp(prevEnteredOtp => {
                    const newEnteredOtp = prevEnteredOtp.slice(0, index) + prevEnteredOtp.slice(index + 1);
                    return newEnteredOtp;
                });
                setHighlightedBoxIndex(index === 0 ? 0 : index - 1);
            }
        } else {
            setEnteredOtp(prevEnteredOtp => prevEnteredOtp + value);
            if (index < otpLength - 1) {
                setHighlightedBoxIndex(index + 1);
            }
        }
    }

    // Submit Handler 
    const onOtpSubmit = () => {
        const androidVersion = DeviceInfo.getSystemVersion();
        const phoneModel = DeviceInfo.getModel();
        const brandName = DeviceInfo.getBrand();
        console.log("Pressed", androidVersion, phoneModel, brandName);
    }

    return (
        <SafeAreaView style={{ flex: 1 }}>
            <BackGround
                source={require('../../assets/images/Moira2.jpg')}>
                <View style={styles.backarrwBtnContainer}>
                    <BackArrowButton />
                </View>
                <View style={styles.container}>
                    <Text style={styles.wlcmTxt}>Verification code</Text>
                    <View style={styles.loginContainer}>
                        <Text style={styles.loginTxt1}> Enter OTP</Text>
                        <Text style={[styles.loginTxt2, { marginTop: -2 }]}>Please enter the six digit code</Text>
                        <Text style={[styles.loginTxt2, { marginTop: -4 }]}>sent to your mobile</Text>
                        {/* INPUT AUTO FILL OTP 6 digit */}
                        <View style={styles.otpBoxContainer}>
                            {
                                Array.from({ length: otpLength }).map((_, index) => (
                                    <View
                                        style={[styles.otPBox,
                                            index === highlightedBoxIndex && blinkStates[index] && styles.blinkingBox,
                                        ]}
                                        key={index}
                                    >
                                        <View>
                                            <TextInput
                                                ref={(ref) => otpInputRefs.current[index] = ref}
                                                keyboardType='numeric'
                                                maxLength={1}
                                                caretHidden={true}
                                                style={styles.numberInput}
                                                editable={true}
                                                onKeyPress={({ nativeEvent }) => backPressHandler(index, nativeEvent.key)}
                                                onChangeText={(value) => handleOtpInpuChange(value, index)}
                                            />
                                        </View>
                                    </View>
                                ))
                            }
                        </View>
                        <View style={styles.loginBTNContainer}>
                            <AnimatedBtnLoader
                                text={'Verify Now'}
                                iconName={'arrow-forward'}
                                iconSize={25}
                                iconColor={'#ffffff'}
                                showIcon={true}
                                onPress={()=> console.warn("WARN")}
                                loader={userLoginOtpLoader}
                            />
                        </View>
                    </View>
                </View>
            </BackGround>
        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    backarrwBtnContainer: {
        position: 'absolute',
        marginStart: -20,
        marginTop: -200
    },
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        width: 'auto',
        height: '150%',
        marginRight: 70,
    },
    wlcmTxt: {
        fontWeight: '800',
        fontSize: 25,
        marginLeft: '-30%',
        marginBottom: '6%',
        textTransform: 'uppercase',
        color: Colors.button,
    },
    loginContainer: {
        width: '117%',
        height: '100%',
        backgroundColor: Colors.secondary,
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
        alignItems: 'center',
    },
    loginTxt1: {
        alignSelf: 'center',
        fontWeight: 'bold',
        fontSize: 25,
        marginTop: -8,
        marginBottom: 4,
        color: Colors.primary
    },
    loginTxt2: {
        alignSelf: 'center',
        fontWeight: '500',
        fontSize: 13,
        marginTop: 1,
        marginBottom: 5,
        color: Colors.clr66,
        textTransform: 'capitalize',
    },
    loginBTNContainer: {
        marginTop: -25,
        marginBottom: 55
    },
    otpBoxContainer: {
        flexDirection: 'row',
        width: '75%',
        justifyContent: 'center',
        alignContent: 'center',
    },
    otPBox: {
        marginTop: '10%',
        marginBottom: '-6%',
        marginHorizontal: 3,
        width: 45,
        height: 45,
        borderWidth: 2.5,
        borderRadius: 6,
        borderColor: Colors.secondary,
        backgroundColor: Colors.backGroundColor,
        alignItems: 'center',
    },
    blinkingBox: {
        borderColor: Colors.primary,
    },
    numberInput: {
        fontSize: 20,
        fontWeight: '800',
        justifyContent: 'center',
        alignItems: 'center',
        marginVertical: -5,
        marginLeft: 6,
        color: Colors.primary
    }
});