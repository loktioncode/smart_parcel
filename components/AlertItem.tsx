import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { CheckCircle2, AlertCircle } from 'lucide-react-native';
import { Theme } from '../constants/Theme';
import { Colors } from '../constants/Colors';

interface AlertItemProps {
    id: string;
    type: 'returned' | 'left';
    cardNumber: number | string;
    time: string;
    penalty?: string;
}

export const AlertItem: React.FC<AlertItemProps> = ({ type, cardNumber, time, penalty }) => {
    const isLeft = type === 'left';
    const color = isLeft ? Colors.error : Colors.success;

    return (
        <View style={styles.container}>
            <View style={[styles.indicator, { backgroundColor: color }]} />
            <View style={styles.iconContainer}>
                {isLeft ? (
                    <AlertCircle size={24} color={color} />
                ) : (
                    <CheckCircle2 size={24} color={color} />
                )}
            </View>
            <View style={styles.content}>
                <View style={styles.row}>
                    <Text style={styles.cardText}>Card <Text style={styles.bold}>#{cardNumber}</Text></Text>
                    <Text style={styles.time}>{time}</Text>
                </View>
                <Text style={styles.message}>
                    {isLeft ? 'Left the store' : 'Returned to store'}
                </Text>
                {penalty && (
                    <Text style={[styles.penalty, { color: Colors.success }]}>
                        Penalty: <Text style={styles.bold}>{penalty}</Text>
                    </Text>
                )}
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        backgroundColor: Colors.card,
        borderRadius: Theme.borderRadius.lg,
        flexDirection: 'row',
        marginBottom: 12,
        overflow: 'hidden',
        ...Theme.shadows.small,
    },
    indicator: {
        width: 4,
        height: '100%',
    },
    iconContainer: {
        padding: 16,
        justifyContent: 'center',
        alignItems: 'center',
    },
    content: {
        flex: 1,
        padding: 12,
        justifyContent: 'center',
    },
    row: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 4,
    },
    cardText: {
        ...Theme.typography.body,
        fontSize: 15,
    },
    bold: {
        fontWeight: '700',
    },
    time: {
        ...Theme.typography.caption,
        fontSize: 12,
    },
    message: {
        ...Theme.typography.caption,
        color: Colors.textSecondary,
    },
    penalty: {
        ...Theme.typography.caption,
        marginTop: 4,
        fontWeight: '600',
    },
});

export default AlertItem;
