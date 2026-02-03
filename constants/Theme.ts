import { StyleSheet } from 'react-native';
import { Colors } from './Colors';

export const Theme = {
    spacing: {
        xs: 4,
        sm: 8,
        md: 16,
        lg: 24,
        xl: 32,
    },
    borderRadius: {
        sm: 8,
        md: 12,
        lg: 16,
        xl: 24,
        full: 9999,
    },
    typography: {
        h1: {
            fontSize: 28,
            fontWeight: '700' as const,
            color: Colors.text,
        },
        h2: {
            fontSize: 22,
            fontWeight: '600' as const,
            color: Colors.text,
        },
        h3: {
            fontSize: 18,
            fontWeight: '600' as const,
            color: Colors.text,
        },
        body: {
            fontSize: 16,
            fontWeight: '400' as const,
            color: Colors.text,
        },
        caption: {
            fontSize: 14,
            fontWeight: '400' as const,
            color: Colors.textSecondary,
        },
        label: {
            fontSize: 12,
            fontWeight: '500' as const,
            color: Colors.textSecondary,
            textTransform: 'uppercase' as const,
            letterSpacing: 0.5,
        },
    },
    shadows: StyleSheet.create({
        small: {
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.05,
            shadowRadius: 4,
            elevation: 2,
        },
        medium: {
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 4 },
            shadowOpacity: 0.1,
            shadowRadius: 8,
            elevation: 4,
        },
        large: {
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 8 },
            shadowOpacity: 0.15,
            shadowRadius: 16,
            elevation: 8,
        },
    }),
};

export default Theme;
