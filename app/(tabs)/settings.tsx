import { Colors } from '@/constants/Colors';
import { LinearGradient } from 'expo-linear-gradient';
import { Bell, Clock, DollarSign, Lock, RefreshCw, Save } from 'lucide-react-native';
import React, { useState } from 'react';
import { Platform, SafeAreaView, ScrollView, StatusBar, StyleSheet, Switch, Text, TextInput, TouchableOpacity, View } from 'react-native';

import { Theme } from '@/constants/Theme';
import { useAuth } from '@/context/AuthContext';
import { useBilling } from '@/context/BillingContext';

export default function SettingsScreen() {
    const { settings, updateSettings } = useBilling();
    const { logout } = useAuth();

    // We keep local state for inputs to avoid jitter, sync on blur/save?
    // Or just direct update. Let's do direct update for simplicity, OR local state + Save button.
    // The UI has a Save button. So local state -> Save.
    const [gracePeriod, setGracePeriod] = useState(settings.gracePeriod.toString());
    const [penaltyRate, setPenaltyRate] = useState(settings.penaltyRate.toString());
    const [soundAlerts, setSoundAlerts] = useState(true);
    const [autoRefresh, setAutoRefresh] = useState(true);

    // Sync from context on mount
    React.useEffect(() => {
        setGracePeriod(settings.gracePeriod.toString());
        setPenaltyRate(settings.penaltyRate.toString());
    }, [settings]);

    const handleSave = () => {
        updateSettings({
            gracePeriod: parseFloat(gracePeriod) || 0,
            penaltyRate: parseFloat(penaltyRate) || 0,
        });
        // Feedback could be added here
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
                        <Text style={styles.headerTitle}>Settings</Text>
                        <Text style={styles.headerSubtitle}>Configure system parameters</Text>
                    </View>
                </SafeAreaView>
            </LinearGradient>

            <ScrollView
                contentContainerStyle={styles.scrollContent}
                showsVerticalScrollIndicator={false}
            >
                {/* Grace Period Card */}
                <View style={styles.card}>
                    <View style={styles.cardHeader}>
                        <View style={[styles.iconBox, { backgroundColor: '#E3F2FD' }]}>
                            <Clock size={20} color={Colors.primary} />
                        </View>
                        <View style={styles.cardHeaderText}>
                            <Text style={styles.cardTitle}>Grace Period</Text>
                            <Text style={styles.cardSubtitle}>Free time before charging starts</Text>
                        </View>
                    </View>

                    <Text style={styles.inputLabel}>Minutes</Text>
                    <TextInput
                        style={styles.input}
                        value={gracePeriod}
                        onChangeText={setGracePeriod}
                        keyboardType="numeric"
                    />

                    <View style={styles.infoBox}>
                        <Text style={styles.infoText}>
                            Customers get <Text style={styles.bold}>{gracePeriod} minutes</Text> of free time outside the store
                        </Text>
                    </View>
                </View>

                {/* Penalty Rate Card */}
                <View style={styles.card}>
                    <View style={styles.cardHeader}>
                        <View style={[styles.iconBox, { backgroundColor: '#E8F5E9' }]}>
                            <DollarSign size={20} color={Colors.success} />
                        </View>
                        <View style={styles.cardHeaderText}>
                            <Text style={styles.cardTitle}>Penalty Rate</Text>
                            <Text style={styles.cardSubtitle}>Cost per minute after grace period</Text>
                        </View>
                    </View>

                    <Text style={styles.inputLabel}>Dollars per minute</Text>
                    <TextInput
                        style={styles.input}
                        value={penaltyRate}
                        onChangeText={setPenaltyRate}
                        keyboardType="numeric"
                    />
                    <View style={[styles.infoBox, { backgroundColor: '#E8F5E9' }]}>
                        <Text style={styles.infoTextGreen}>
                            Each minute costs <Text style={styles.bold}>${Number(penaltyRate).toFixed(2)}</Text>
                        </Text>
                        <Text style={styles.infoSubTextGreen}>
                            Example: 30 minutes = ${(30 * Number(penaltyRate)).toFixed(2)}
                        </Text>
                    </View>
                </View>

                {/* Toggles */}
                <View style={styles.toggleCard}>
                    <View style={styles.toggleRow}>
                        <View style={[styles.iconBox, { backgroundColor: '#FFF3E0' }]}>
                            <Bell size={20} color={Colors.warning} />
                        </View>
                        <View style={styles.toggleText}>
                            <Text style={styles.toggleTitle}>Sound Alerts</Text>
                            <Text style={styles.toggleSubtitle}>Play sound on geofence events</Text>
                        </View>
                        <Switch
                            value={soundAlerts}
                            onValueChange={setSoundAlerts}
                            trackColor={{ false: '#767577', true: Colors.success }}
                            thumbColor={'#f4f3f4'}
                        />
                    </View>
                </View>

                <View style={styles.toggleCard}>
                    <View style={styles.toggleRow}>
                        <View style={[styles.iconBox, { backgroundColor: '#F3E5F5' }]}>
                            <RefreshCw size={20} color={Colors.secondary} />
                        </View>
                        <View style={styles.toggleText}>
                            <Text style={styles.toggleTitle}>Auto Refresh</Text>
                            <Text style={styles.toggleSubtitle}>Update data automatically</Text>
                        </View>
                        <Switch
                            value={autoRefresh}
                            onValueChange={setAutoRefresh}
                            trackColor={{ false: '#767577', true: Colors.success }}
                            thumbColor={'#f4f3f4'}
                        />
                    </View>
                </View>

                {/* Save Button */}
                <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
                    <Save size={20} color="#FFF" style={{ marginRight: 8 }} />
                    <Text style={styles.saveButtonText}>Save Settings</Text>
                </TouchableOpacity>

                {/* Logout Button */}
                <TouchableOpacity
                    style={[styles.saveButton, { backgroundColor: '#F44336', marginTop: 12 }]}
                    onPress={logout}
                >
                    <Lock size={20} color="#FFF" style={{ marginRight: 8 }} />
                    <Text style={styles.saveButtonText}>Logout Session</Text>
                </TouchableOpacity>

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
    scrollContent: {
        padding: 24,
        paddingBottom: 40,
    },
    card: {
        backgroundColor: Colors.card,
        borderRadius: Theme.borderRadius.lg,
        padding: 16,
        marginBottom: 16,
        ...Theme.shadows.small,
    },
    cardHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 16,
    },
    iconBox: {
        width: 40,
        height: 40,
        borderRadius: 20,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 12,
    },
    cardHeaderText: {
        flex: 1,
    },
    cardTitle: {
        fontSize: 16,
        fontWeight: '600',
        color: Colors.text,
    },
    cardSubtitle: {
        fontSize: 12,
        color: Colors.textSecondary,
    },
    inputLabel: {
        fontSize: 14,
        color: Colors.textSecondary,
        marginBottom: 8,
    },
    input: {
        borderWidth: 1,
        borderColor: Colors.border,
        borderRadius: 8,
        padding: 12,
        fontSize: 16,
        marginBottom: 16,
    },
    infoBox: {
        backgroundColor: '#E3F2FD',
        padding: 12,
        borderRadius: 8,
    },
    infoText: {
        fontSize: 12,
        color: Colors.primary,
    },
    infoTextGreen: {
        fontSize: 12,
        color: '#2E7D32',
    },
    infoSubTextGreen: {
        fontSize: 10,
        color: '#2E7D32',
        marginTop: 2,
    },
    bold: {
        fontWeight: 'bold',
    },
    toggleCard: {
        backgroundColor: Colors.card,
        borderRadius: Theme.borderRadius.lg,
        padding: 16,
        marginBottom: 16,
        ...Theme.shadows.small,
    },
    toggleRow: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    toggleText: {
        flex: 1,
    },
    toggleTitle: {
        fontSize: 16,
        fontWeight: '600',
        color: Colors.text,
    },
    toggleSubtitle: {
        fontSize: 12,
        color: Colors.textSecondary,
    },
    saveButton: {
        backgroundColor: '#880E4F', // Deep Red gradient end like
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 16,
        borderRadius: 12,
        marginTop: 8,
        ...Theme.shadows.medium,
    },
    saveButtonText: {
        color: '#FFF',
        fontSize: 16,
        fontWeight: '600',
    },
});
