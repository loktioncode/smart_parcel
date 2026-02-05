import { Colors } from '@/constants/Colors';
import { usePresence } from '@/hooks/usePresence';
import { WifiOff } from 'lucide-react-native';
import React, { useEffect, useState } from 'react';
import { Animated, StyleSheet, Text, View } from 'react-native';

export const OfflineBanner: React.FC = () => {
    const { isConnected } = usePresence();
    const [translateY] = useState(new Animated.Value(-100));

    useEffect(() => {
        Animated.spring(translateY, {
            toValue: isConnected ? -100 : 0,
            useNativeDriver: true,
            bounciness: 4,
        }).start();
    }, [isConnected]);

    return (
        <Animated.View style={[styles.container, { transform: [{ translateY }] }]}>
            <View style={styles.content}>
                <WifiOff size={18} color="#FFF" />
                <Text style={styles.text}>Server Offline - Using Cached Data</Text>
            </View>
        </Animated.View>
    );
};

const styles = StyleSheet.create({
    container: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        zIndex: 9999,
        backgroundColor: Colors.outside, // Reddish color for offline
        paddingTop: 50, // For notch
        paddingBottom: 10,
        alignItems: 'center',
        justifyContent: 'center',
    },
    content: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
    },
    text: {
        color: '#FFF',
        fontSize: 14,
        fontWeight: '600',
    },
});
