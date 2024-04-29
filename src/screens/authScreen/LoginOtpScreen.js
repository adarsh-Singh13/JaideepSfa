import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Colors } from '../../themes/Theme';
import InputText from '../../components/formInput/InputText';
/**
 * ? LOCAL IMPORTS
 */

import BackGround from '../../components/background/BackGround';
import AnimatedBtnLoader from '../../components/animatedLoaderBtn/AnimatedBtnLoader';
import BackArrowButton from '../../components/backArrowButton/BackArrowButton';

export function LoginOtpScreen() {
    return (
        <SafeAreaView style={{ flex: 1 }}>
            <BackGround>
                <View style={styles.backarrwBtnContainer}>
                    <BackArrowButton />
                </View>
                <View style={styles.container}>
                    <Text style={styles.wlcmTxt}>Verification code</Text>
                    <View style={styles.loginContainer}>
                        <Text style={styles.loginTxt1}> Enter OTP</Text>
                        <Text style={[styles.loginTxt2, { marginTop: -2 }]}>Please enter the six digit code</Text>
                        <Text style={[styles.loginTxt2, { marginTop: -4 }]}>sent to your mobile</Text>
                        <InputText
                            placeholder='Enter Here'
                            style={styles.usrname}
                        // value={userId.toString().toUpperCase()}
                        // onChange={handleUserIdChange}
                        />
                        <View style={styles.loginBTNContainer}>
                            <AnimatedBtnLoader
                                text={'Verify Now'}
                                iconName={'arrow-forward'}
                                iconSize={25}
                                iconColor={'#ffffff'}
                                showIcon={true}
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
        marginStart: -50,
        marginTop: -300
    },
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
        fontSize: 25,
        marginLeft: '-30%',
        marginBottom: '6%',
        textTransform: 'uppercase',
        color: Colors.button,
    },
    loginContainer: {
        width: '130%',
        height: '100%',
        backgroundColor: '#fabce7e9',
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
        color: Colors.primary
    },
    loginTxt2: {
        alignSelf: 'center',
        fontWeight: '500',
        fontSize: 12,
        marginTop: 1,
        marginBottom: 5,
        color: Colors.clr66,
        textTransform: 'capitalize',
    },
    loginBTNContainer: {
        marginTop: 25,
        marginBottom: -55
    },
})