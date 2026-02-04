import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter, useSegments } from 'expo-router';
import React, { createContext, useContext, useEffect, useState } from 'react';

interface AuthContextType {
    isAuthenticated: boolean;
    login: (pin: string) => Promise<boolean>;
    logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Hardcoded PIN for now
const CORRECT_PIN = '1234';

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
    const [isLoaded, setIsLoaded] = useState(false);
    const segments = useSegments();
    const router = useRouter();

    useEffect(() => {
        loadAuthState();
    }, []);

    useEffect(() => {
        if (!isLoaded) return;

        const inAuthGroup = segments[0] === 'login';

        if (!isAuthenticated && !inAuthGroup) {
            // Redirect to login if not authenticated and not already on login screen
            router.replace('/login');
        } else if (isAuthenticated && inAuthGroup) {
            // Redirect to home if authenticated and on login screen
            router.replace('/(tabs)');
        }
    }, [isAuthenticated, segments, isLoaded]);

    const loadAuthState = async () => {
        try {
            const authState = await AsyncStorage.getItem('is_authenticated');
            if (authState === 'true') {
                setIsAuthenticated(true);
            }
        } catch (e) {
            console.error('Failed to load auth state', e);
        } finally {
            setIsLoaded(true);
        }
    };

    const login = async (pin: string): Promise<boolean> => {
        if (pin === CORRECT_PIN) {
            setIsAuthenticated(true);
            await AsyncStorage.setItem('is_authenticated', 'true');
            return true;
        }
        return false;
    };

    const logout = async () => {
        setIsAuthenticated(false);
        await AsyncStorage.removeItem('is_authenticated');
    };

    return (
        <AuthContext.Provider value={{ isAuthenticated, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};
