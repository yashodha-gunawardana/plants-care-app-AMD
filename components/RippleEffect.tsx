import React, { useEffect, useRef } from 'react';
import { Animated, StyleSheet, Easing } from 'react-native';


const PressRipple = () => {

    // create a value to control the animation
    const anim = useRef(new Animated.Value(0)).current;

    useEffect(() => {

        // make the circle gradually grow larger and fade away
        Animated.timing(anim, {
            toValue: 1,
            duration: 800, 
            easing: Easing.out(Easing.circle),
            useNativeDriver: true,
        }).start();
    }, []);

    const rippleStyle = {
        transform: [{
            scale: anim.interpolate({
                inputRange: [0, 1],
                outputRange: [0.8, 2.5]  // size increase
            })
        }],
        opacity: anim.interpolate({
            inputRange: [0, 1],
            outputRange: [0.7, 0]  // decrease transparency and fade
        })
    };

    return <Animated.View style={[styles.rippleCircle, rippleStyle]} />;
};


const styles = StyleSheet.create({

    waterBtn: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: '#E1F5FE',
        justifyContent: 'center',
        alignItems: 'center',
        position: 'relative',
        overflow: 'visible', 
    },
    rippleCircle: {
        position: 'absolute',
        width: 40,
        height: 40,
        borderRadius: 20,
        borderWidth: 2,
        borderColor: '#4A90E2', 
    }
});


export default PressRipple;