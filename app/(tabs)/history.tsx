import { Colors } from '@/constants/Colors';
import { LinearGradient } from 'expo-linear-gradient';
import { Clock, DollarSign, Plus } from 'lucide-react-native';
import React from 'react';
import { Platform, SafeAreaView, ScrollView, StatusBar, StyleSheet, Text, View } from 'react-native';

import AlertItem from '@/components/AlertItem';
import { Theme } from '@/constants/Theme';

export default function HistoryScreen() {
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
                            <Text style={styles.statValue}>14</Text>
                        </View>
                        <View style={[styles.headerStat, { borderLeftWidth: 4, borderLeftColor: Colors.success }]}>
                            <View style={styles.statHeader}>
                                <DollarSign size={16} color={Colors.success} />
                                <Text style={styles.statLabel}>Total Penalties</Text>
                            </View>
                            <Text style={styles.statValue}>$10.50</Text>
                        </View>
                    </View>
                </SafeAreaView>
            </LinearGradient>

            <ScrollView
                contentContainerStyle={styles.scrollContent}
                showsVerticalScrollIndicator={false}
            >
                <Text style={styles.sectionTitle}>Activity Timeline</Text>

                {/* We can reuse AlertItem or build custom ones for different event types. 
            For now, reusing AlertItem for consistency where applicable, 
            but the screenshot shows different icons/colors for registration. 
            I'll mock the specific look with AlertItem or just custom views here.
        */}

                {/* Mocking the "Card Registered" item manually to match screenshot perfectly or just use AlertItem if adaptable. 
           AlertItem is specific to Left/Returned. Let's make a generic HistoryItem properly in the future, 
           but for now I'll stick to AlertItem for the alerts and custom view for registration to match screenshot style.
        */}

                <View style={styles.historyItem}>
                    <View style={[styles.indicator, { backgroundColor: Colors.info }]} />
                    <View style={styles.iconContainer}>
                        <Plus size={24} color={Colors.info} />
                    </View>
                    <View style={styles.itemContent}>
                        <Text style={styles.cardText}>Card <Text style={styles.bold}>#15</Text></Text>
                        <Text style={styles.subText}>Card registered</Text>
                        <Text style={styles.timeText}>Jan 29, 2026, 02:06 PM</Text>
                    </View>
                </View>

                <AlertItem
                    id="1"
                    type="left"
                    cardNumber="23"
                    time="Jan 29, 2026, 02:46 PM"
                />

                <AlertItem
                    id="2"
                    type="left"
                    cardNumber="12"
                    time="Jan 29, 2026, 02:21 PM"
                />

                <AlertItem
                    id="3"
                    type="returned"
                    cardNumber="12"
                    time="Jan 29, 2026, 02:51 PM"
                    penalty="$3.50"
                />

                <View style={styles.historyItem}>
                    <View style={[styles.indicator, { backgroundColor: Colors.info }]} />
                    <View style={styles.iconContainer}>
                        <Plus size={24} color={Colors.info} />
                    </View>
                    <View style={styles.itemContent}>
                        <Text style={styles.cardText}>Card <Text style={styles.bold}>#8</Text></Text>
                        <Text style={styles.subText}>Card registered</Text>
                        <Text style={styles.timeText}>Jan 29, 2026, 01:06 PM</Text>
                    </View>
                </View>

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
    sectionTitle: {
        fontSize: 18,
        fontWeight: '600',
        color: Colors.text,
        marginBottom: 16,
    },
    // Custom History Item Styles
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
    timeText: {
        fontSize: 12,
        color: Colors.textSecondary,
    },
});
