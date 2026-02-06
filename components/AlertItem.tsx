import { AlertCircle, CheckCircle2, Info } from 'lucide-react-native';
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Colors } from '../constants/Colors';
import { Theme } from '../constants/Theme';

interface AlertItemProps {
    id: string;
    type: 'returned' | 'left' | 'registered';
    cardNumber: number | string;
    time: string;
    penalty?: string;
}

export const AlertItem: React.FC<AlertItemProps> = ({ type, cardNumber, time, penalty }) => {
    const isLeft = type === 'left';
    const isRegistered = type === 'registered';

    let color = Colors.success;
    if (isLeft) color = Colors.error;
    if (isRegistered) color = Colors.info;

    const renderIcon = () => {
        if (isLeft) return <AlertCircle size={24} color={color} />;
        if (isRegistered) return <Info size={24} color={color} />;
        return <CheckCircle2 size={24} color={color} />;
    };

    const getMessage = () => {
        if (isLeft) return 'Left the store';
        if (isRegistered) return 'New card registered';
        return 'Returned to store';
    };

    return (
        <View style={styles.container}>
            <View style={[styles.indicator, { backgroundColor: color }]} />
            <View style={styles.iconContainer}>
                {renderIcon()}
            </View>
            <View style={styles.content}>
                <View style={styles.row}>
                    <Text style={styles.cardText}>Card <Text style={styles.bold}>#{cardNumber}</Text></Text>
                    <Text style={styles.time}>{time}</Text>
                </View>
                <Text style={styles.message}>
                    {getMessage()}
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
