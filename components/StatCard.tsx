import React from 'react';
import { View, Text, StyleSheet, Dimensions } from 'react-native';
import { Theme } from '../constants/Theme';
import { Colors } from '../constants/Colors';

interface StatCardProps {
    title: string;
    value: string | number;
    icon: React.ReactNode;
    color: string;
}

export const StatCard: React.FC<StatCardProps> = ({ title, value, icon, color }) => {
    return (
        <View style={styles.card}>
            <View style={[styles.indicator, { backgroundColor: color }]} />
            <View style={styles.content}>
                <View style={styles.header}>
                    <View style={[styles.iconContainer, { backgroundColor: `${color}15` }]}>
                        {icon}
                    </View>
                    <Text style={styles.title}>{title}</Text>
                </View>
                <Text style={styles.value}>{value}</Text>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    card: {
        backgroundColor: Colors.card,
        borderRadius: Theme.borderRadius.lg,
        width: (Dimensions.get('window').width - 48) / 2,
        height: 110,
        flexDirection: 'row',
        overflow: 'hidden',
        marginBottom: 16,
        ...Theme.shadows.medium,
    },
    indicator: {
        width: 4,
        height: '100%',
    },
    content: {
        flex: 1,
        padding: 12,
        justifyContent: 'space-between',
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    iconContainer: {
        padding: 6,
        borderRadius: 8,
        marginRight: 8,
    },
    title: {
        ...Theme.typography.caption,
        fontSize: 12,
        fontWeight: '500',
        flex: 1,
    },
    value: {
        ...Theme.typography.h1,
        fontSize: 24,
        marginTop: 4,
    },
});

export default StatCard;
