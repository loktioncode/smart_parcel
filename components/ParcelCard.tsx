import { LinearGradient } from 'expo-linear-gradient';
import { Radio, Trash2 } from 'lucide-react-native';
import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Colors } from '../constants/Colors';
import { Theme } from '../constants/Theme';

interface ParcelCardProps {
    id: string;
    cardNumber: number | string;
    status: 'Outside' | 'In Store';
    penalty?: string;
    onRemove?: () => void;
}

export const ParcelCard: React.FC<ParcelCardProps> = ({ cardNumber, status, penalty, onRemove }) => {
    const isInStore = status === 'In Store';
    const statusColor = isInStore ? Colors.success : Colors.error;

    return (
        <View style={styles.container}>
            {/* Visual Parcel Icon Card */}
            <View style={styles.cardVisual}>
                <LinearGradient
                    colors={[Colors.gradientStart, Colors.secondary]}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 1 }}
                    style={styles.gradient}
                >
                    <Text style={styles.cardLabel}>Card/Locker</Text>
                    <Text style={styles.cardNumber}>#{cardNumber}</Text>
                </LinearGradient>
            </View>

            {/* Info Section */}
            <View style={styles.infoSection}>
                <View style={styles.statusRow}>
                    <View style={[styles.statusDot, { backgroundColor: statusColor }]} />
                    <Text style={styles.statusText}>{status}</Text>
                </View>
                {penalty && (
                    <Text style={styles.penaltyText}>{penalty} <Text style={styles.penaltySub}>penalty</Text></Text>
                )}
            </View>

            {/* Connectivity Icon & Delete */}
            <View style={styles.iconContainer}>
                <Radio size={24} color={statusColor} style={{ marginBottom: 12 }} />
                {onRemove && (
                    <TouchableOpacity onPress={onRemove} style={styles.removeButton}>
                        <Trash2 size={20} color={Colors.textSecondary} />
                    </TouchableOpacity>
                )}
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        backgroundColor: Colors.card,
        borderRadius: Theme.borderRadius.xl,
        flexDirection: 'row',
        alignItems: 'center',
        padding: 12,
        marginBottom: 16,
        ...Theme.shadows.medium,
    },
    cardVisual: {
        width: 100,
        height: 80,
        borderRadius: Theme.borderRadius.lg,
        overflow: 'hidden',
    },
    gradient: {
        flex: 1,
        padding: 12,
        justifyContent: 'center',
    },
    cardLabel: {
        color: '#FFFFFFAA',
        fontSize: 10,
        fontWeight: '600',
    },
    cardNumber: {
        color: '#FFFFFF',
        fontSize: 24,
        fontWeight: 'bold',
    },
    infoSection: {
        flex: 1,
        paddingHorizontal: 16,
    },
    statusRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 4,
    },
    statusDot: {
        width: 10,
        height: 10,
        borderRadius: 5,
        marginRight: 8,
    },
    statusText: {
        ...Theme.typography.body,
        fontWeight: '500',
    },
    penaltyText: {
        ...Theme.typography.caption,
        color: Colors.error,
        fontWeight: '600',
    },
    penaltySub: {
        fontWeight: '400',
        color: Colors.textSecondary,
    },
    iconContainer: {
        paddingRight: 8,
        alignItems: 'center',
    },
    removeButton: {
        padding: 4,
    },
});

export default ParcelCard;
