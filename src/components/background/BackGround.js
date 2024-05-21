import React from 'react'
import { View, Text, StyleSheet, Image, Dimensions } from 'react-native'

const { width, height } = Dimensions.get('window')
export default function BackGround({ children, source }) {
    return (
        <View style={[styles.mainContainer, {
            width: width,
            height: height,
        }]}>
            <Image
                source={source}
                style={styles.imageBackground}
            />
            <View style={{ position: 'absolute' }}>
                {children}
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    mainContainer: {
        flex: 1,
        marginLeft: 35,
        justifyContent: 'center',
        alignItems: 'center',
    },
    backgroundImage: {
        width: width,
        height: height,
    },
})