import { Colors } from '@/constants/Colors';
import { useAuth } from '@/context/AuthContext';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import React, { useState } from 'react';
import { Dimensions, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import Animated, { useAnimatedStyle, withSequence, withSpring } from 'react-native-reanimated';

const { width } = Dimensions.get('window');

const PIN_LENGTH = 4;

const LoginScreen = () => {
    const [pin, setPin] = useState('');
    const [error, setError] = useState(false);
    const { login } = useAuth();

    const animatedStyle = useAnimatedStyle(() => {
        return {
            transform: [
                {
                    translateX: error ? withSequence(
                        withSpring(-10),
                        withSpring(10),
                        withSpring(-10),
                        withSpring(0)
                    ) : 0
                }
            ],
        };
    }, [error]);

    const handlePress = async (num: string) => {
        if (pin.length >= PIN_LENGTH) return;
        setError(false);

        const newPin = pin + num;
        setPin(newPin);

        if (newPin.length === PIN_LENGTH) {
            const success = await login(newPin);
            if (!success) {
                setError(true);
                setTimeout(() => setPin(''), 500);
            }
        }
    };

    const handleDelete = () => {
        setPin(pin.slice(0, -1));
        setError(false);
    };

    const renderPinDots = () => {
        const dots = [];
        for (let i = 0; i < PIN_LENGTH; i++) {
            dots.push(
                <View
                    key={i}
                    style={[
                        styles.pinDot,
                        pin.length > i && styles.pinDotFilled,
                        error && styles.pinDotError
                    ]}
                />
            );
        }
        return dots;
    };

    const renderKeypad = () => {
        const keys = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '', '0', '⌫'];
        return keys.map((key, index) => (
            <TouchableOpacity
                key={index}
                style={[styles.key, !key && styles.keyEmpty]}
                disabled={!key}
                onPress={() => key === '⌫' ? handleDelete() : handlePress(key)}
            >
                <Text style={styles.keyText}>{key}</Text>
            </TouchableOpacity>
        ));
    };

    return (
        <View style={styles.container}>
            <LinearGradient
                colors={[Colors.gradientStart, Colors.secondary]}
                style={StyleSheet.absoluteFill}
            />

            <View style={styles.content}>
                <View style={styles.header}>
                    <View style={styles.logoContainer}>
                        <Ionicons name="lock-closed" color="#FFF" size={40} />
                    </View>
                    <Text style={styles.title}>Smart Parcel</Text>
                    <Text style={styles.subtitle}>Enter 4-digit PIN to unlock</Text>
                </View>

                <Animated.View style={[styles.pinContainer, animatedStyle]}>
                    {renderPinDots()}
                </Animated.View>

                {error && (
                    <Text style={styles.errorText}>Incorrect PIN. Please try again.</Text>
                )}

                <View style={styles.keypad}>
                    {renderKeypad()}
                </View>
            </View>
        </View>
    );
};

export default LoginScreen;

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    content: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 40,
    },
    header: {
        alignItems: 'center',
        marginBottom: 50,
    },
    logoContainer: {
        width: 80,
        height: 80,
        borderRadius: 40,
        backgroundColor: 'rgba(255,255,255,0.2)',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 20,
    },
    title: {
        fontSize: 32,
        fontWeight: 'bold',
        color: '#FFF',
        marginBottom: 8,
    },
    subtitle: {
        fontSize: 16,
        color: 'rgba(255,255,255,0.8)',
    },
    pinContainer: {
        flexDirection: 'row',
        marginBottom: 40,
        gap: 20,
    },
    pinDot: {
        width: 20,
        height: 20,
        borderRadius: 10,
        borderWidth: 2,
        borderColor: '#FFF',
    },
    pinDotFilled: {
        backgroundColor: '#FFF',
    },
    pinDotError: {
        borderColor: Colors.outside,
        backgroundColor: 'transparent',
    },
    errorText: {
        color: Colors.outside,
        marginBottom: 20,
        fontWeight: '600',
    },
    keypad: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'center',
        width: width * 0.8,
    },
    key: {
        width: 70,
        height: 70,
        borderRadius: 35,
        backgroundColor: 'rgba(255,255,255,0.15)',
        justifyContent: 'center',
        alignItems: 'center',
        margin: 10,
    },
    keyEmpty: {
        backgroundColor: 'transparent',
    },
    keyText: {
        color: '#FFF',
        fontSize: 24,
        fontWeight: '600',
    },
});
