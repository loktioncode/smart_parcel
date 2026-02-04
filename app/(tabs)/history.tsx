import { Colors } from '@/constants/Colors';
import { HistoryEvent, useBilling } from '@/context/BillingContext';
import { LinearGradient } from 'expo-linear-gradient';
import { ArrowLeftCircle, ArrowRightCircle, Clock, DollarSign, Plus } from 'lucide-react-native';
import React, { useMemo } from 'react';
import { Platform, SafeAreaView, ScrollView, StatusBar, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

import { Theme } from '@/constants/Theme';

// Helper to format timestamp
const formatTime = (timestamp: number): string => {
    const date = new Date(timestamp);
    return date.toLocaleString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
    });
};

// Helper to format duration
const formatDuration = (minutes: number): string => {
    if (minutes < 1) return 'Less than 1 min';
    if (minutes < 60) return `${Math.round(minutes)} min`;
    const hours = Math.floor(minutes / 60);
    const mins = Math.round(minutes % 60);
    return `${hours}h ${mins}m`;
};

export default function HistoryScreen() {
    const { history, clearHistory } = useBilling();

    // Calculate stats
    const stats = useMemo(() => {
        const totalEvents = history.length;
        const totalPenalties = history
            .filter(e => e.type === 'returned' && e.penalty)
            .reduce((sum, e) => sum + (e.penalty || 0), 0);
        return { totalEvents, totalPenalties };
    }, [history]);

    const renderHistoryItem = (event: HistoryEvent) => {
        const isLeft = event.type === 'left';
        const isReturned = event.type === 'returned';
        const color = isLeft ? Colors.warning : (isReturned ? Colors.success : Colors.info);

        return (
            <View key={event.id} style={styles.historyItem}>
                <View style={[styles.indicator, { backgroundColor: color }]} />
                <View style={styles.iconContainer}>
                    {isLeft && <ArrowRightCircle size={24} color={color} />}
                    {isReturned && <ArrowLeftCircle size={24} color={color} />}
                    {event.type === 'registered' && <Plus size={24} color={color} />}
                </View>
                <View style={styles.itemContent}>
                    <Text style={styles.cardText}>
                        Card <Text style={styles.bold}>#{event.cardId}</Text>
                    </Text>
                    <Text style={styles.subText}>
                        {isLeft && 'Left the store'}
                        {isReturned && (
                            event.penalty
                                ? `Returned - $${event.penalty.toFixed(2)} penalty`
                                : `Returned (within grace period)`
                        )}
                        {event.type === 'registered' && 'Card registered'}
                    </Text>
                    {isReturned && event.durationMinutes && (
                        <Text style={styles.durationText}>
                            Outside for {formatDuration(event.durationMinutes)}
                        </Text>
                    )}
                    <Text style={styles.timeText}>{formatTime(event.timestamp)}</Text>
                </View>
            </View>
        );
    };

    return (
        <View style={styles.container}>
            {/* Header */}
            <LinearGradient
                colors={[Colors.gradientStart, Colors.secondary]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={styles.header}
            >
                <SafeAreaView>
                    <View style={styles.headerContent}>
                        <Text style={styles.headerTitle}>History Log</Text>
                        <Text style={styles.headerSubtitle}>All system activities</Text>
                    </View>

                    {/* Key Stats in Header */}
                    <View style={styles.headerStatsRow}>
                        <View style={styles.headerStat}>
                            <View style={styles.statHeader}>
                                <Clock size={16} color={Colors.primary} />
                                <Text style={styles.statLabel}>Total Events</Text>
                            </View>
                            <Text style={styles.statValue}>{stats.totalEvents}</Text>
                        </View>
                        <View style={[styles.headerStat, { borderLeftWidth: 4, borderLeftColor: Colors.success }]}>
                            <View style={styles.statHeader}>
                                <DollarSign size={16} color={Colors.success} />
                                <Text style={styles.statLabel}>Total Penalties</Text>
                            </View>
                            <Text style={styles.statValue}>${stats.totalPenalties.toFixed(2)}</Text>
                        </View>
                    </View>
                </SafeAreaView>
            </LinearGradient>

            <ScrollView
                contentContainerStyle={styles.scrollContent}
                showsVerticalScrollIndicator={false}
            >
                <View style={styles.sectionHeader}>
                    <Text style={styles.sectionTitle}>Activity Timeline</Text>
                    {history.length > 0 && (
                        <TouchableOpacity onPress={clearHistory}>
                            <Text style={styles.clearButton}>Clear</Text>
                        </TouchableOpacity>
                    )}
                </View>

                {history.length === 0 ? (
                    <View style={styles.emptyState}>
                        <Clock size={48} color={Colors.textSecondary} />
                        <Text style={styles.emptyTitle}>No Activity Yet</Text>
                        <Text style={styles.emptyText}>
                            Events will appear here when cards leave or return to the store.
                        </Text>
                    </View>
                ) : (
                    history.map(renderHistoryItem)
                )}
            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Colors.background,
    },
    header: {
        paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0,
        paddingBottom: 24,
        borderBottomLeftRadius: 24,
        borderBottomRightRadius: 24,
    },
    headerContent: {
        paddingHorizontal: 24,
        paddingTop: 12,
        marginBottom: 20,
    },
    headerTitle: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#FFFFFF',
        marginBottom: 4,
    },
    headerSubtitle: {
        fontSize: 16,
        color: 'rgba(255, 255, 255, 0.8)',
    },
    headerStatsRow: {
        flexDirection: 'row',
        paddingHorizontal: 16,
        gap: 12,
    },
    headerStat: {
        flex: 1,
        backgroundColor: Colors.card,
        borderRadius: 12,
        padding: 12,
        borderLeftWidth: 4,
        borderLeftColor: Colors.primary,
    },
    statHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
        marginBottom: 8,
    },
    statLabel: {
        fontSize: 12,
        color: Colors.textSecondary,
        fontWeight: '500',
    },
    statValue: {
        fontSize: 24,
        fontWeight: 'bold',
        color: Colors.text,
    },
    scrollContent: {
        padding: 24,
    },
    sectionHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 16,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: '600',
        color: Colors.text,
    },
    clearButton: {
        fontSize: 14,
        color: Colors.primary,
        fontWeight: '500',
    },
    // History Item Styles
    historyItem: {
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
    itemContent: {
        flex: 1,
        padding: 12,
        justifyContent: 'center',
    },
    cardText: {
        fontSize: 15,
        color: Colors.text,
        marginBottom: 2,
    },
    bold: {
        fontWeight: 'bold',
    },
    subText: {
        fontSize: 13,
        color: Colors.text,
        marginBottom: 4,
    },
    durationText: {
        fontSize: 12,
        color: Colors.textSecondary,
        marginBottom: 2,
    },
    timeText: {
        fontSize: 12,
        color: Colors.textSecondary,
    },
    // Empty State
    emptyState: {
        alignItems: 'center',
        paddingVertical: 48,
    },
    emptyTitle: {
        fontSize: 18,
        fontWeight: '600',
        color: Colors.text,
        marginTop: 16,
        marginBottom: 8,
    },
    emptyText: {
        fontSize: 14,
        color: Colors.textSecondary,
        textAlign: 'center',
        paddingHorizontal: 32,
    },
});

