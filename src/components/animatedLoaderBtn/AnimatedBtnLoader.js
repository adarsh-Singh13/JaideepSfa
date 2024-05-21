import React, {useEffect} from 'react';
import { Container } from 'native-base';
import { View, Text, TouchableOpacity, StyleSheet, ActivityIndicator } from 'react-native';
import Animated, { useAnimatedStyle, useSharedValue, withTiming } from 'react-native-reanimated';
import { Colors } from '../../themes/Theme';
import { HelperService } from '../../utils/HelperService';
import Icon from 'react-native-vector-icons/Ionicons'

const AnimatedBtn = Animated.createAnimatedComponent(TouchableOpacity)

export default function AnimatedBtnLoader  ({loader, onPress, userId = '', text, showIcon, iconName, iconSize, iconColor}) {

    const [btnClicked, setBtnClicked] = React.useState(false)

    useEffect(() => {
        // Reset width and radius when loader becomes false
        if (!loader) {
          animatedWidth.value = withTiming(200, { duration: 500 });
          animatedRadius.value = withTiming(12, { duration: 500 });
        }
      }, [loader]);

    const animatedWidth = useSharedValue(200);
    const animatedRadius = useSharedValue(12);
    const animatedStyle = useAnimatedStyle(()=>{
        return {
            width: animatedWidth.value,
            borderRadius: animatedRadius.value,
        }
    })

    const handlePress = () => {
        if (!userId.trim()) {
          // If userId is empty
          HelperService.showToast({message: 'Enter your Valid credentials', duration: 2000});
        } else {
          if (animatedWidth.value === 200) {
            animatedWidth.value = withTiming(50, { duration: 500 });
            animatedRadius.value = withTiming(50, { duration: 500 });
            onPress();
          } else {
            animatedWidth.value = withTiming(200, { duration: 500 });
            animatedRadius.value = withTiming(12, { duration: 500 });
          }
        }
      };

  return (
    <View style={Styles.Container}>
        <AnimatedBtn 
            style={[Styles.btnLoader, animatedStyle]}
            onPress={handlePress}
        >
            {loader == true ? <ActivityIndicator size={'large'} color={'white'}/> : 
              (
                <View style={Styles.btnContent}>
                  <Text style={Styles.lgnText}>{text}</Text>
                  {showIcon && 
                  <Icon name={iconName} size={iconSize} color={iconColor} />}
                </View>
              )            
            }
        </AnimatedBtn>
    </View>
  )
}

const Styles = StyleSheet.create({
    Container: {
        flex: 1, 
        justifyContent: 'center',
        alignItems: 'center',
    },
    btnLoader: {
        width: 200,
        height: 50,
        backgroundColor: Colors.primary,
        borderRadius: 12,
        justifyContent: 'center',
        alignItems: 'center',
    },
    btnContent: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
    },
    lgnText: {
      fontWeight: 'bold',
      fontSize: 18,
      color: Colors.white,
      letterSpacing: 1.8, 
      textTransform: 'uppercase',
      marginRight: 4,
    },
});
