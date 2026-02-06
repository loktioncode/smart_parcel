import { Colors } from '@/constants/Colors';
import { LinearGradient } from 'expo-linear-gradient';
import { CreditCard, Plus, User } from 'lucide-react-native';
import React, { useState } from 'react';
import { Alert, Platform, SafeAreaView, ScrollView, StatusBar, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';

import { Theme } from '@/constants/Theme';
import { useBilling } from '@/context/BillingContext';

export default function AddScreen() {
    const [cardNumber, setCardNumber] = useState('');
    const [ownerName, setOwnerName] = useState('');
    const { registerCard } = useBilling();

    const handleRegister = async () => {
        const id = parseInt(cardNumber, 10);
        if (isNaN(id)) {
            Alert.alert('Error', 'Please enter a valid card number');
            return;
        }

        try {
            await registerCard(id, ownerName || undefined);
            Alert.alert('Success', `Card ${id} registered successfully!`);
            setCardNumber('');
            setOwnerName('');
        } catch (error) {
            Alert.alert('Error', 'Failed to register card');
        }
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
                        <Text style={styles.headerTitle}>Register Card</Text>
                        <Text style={styles.headerSubtitle}>Add a new card to the system</Text>
                    </View>
                </SafeAreaView>
            </LinearGradient>

            <ScrollView
                contentContainerStyle={styles.scrollContent}
                showsVerticalScrollIndicator={false}
            >
                <View style={styles.formCard}>
                    <View style={styles.inputGroup}>
                        <Text style={styles.label}>Card Number</Text>
                        <View style={styles.inputContainer}>
                            <CreditCard size={20} color={Colors.textSecondary} style={styles.inputIcon} />
                            <TextInput
                                style={styles.input}
                                placeholder="e.g. 25"
                                value={cardNumber}
                                onChangeText={setCardNumber}
                                keyboardType="numeric"
                                placeholderTextColor="#9E9E9E"
                            />
                        </View>
                    </View>

                    <View style={styles.inputGroup}>
                        <Text style={styles.label}>Owner Name (Optional)</Text>
                        <View style={styles.inputContainer}>
                            <User size={20} color={Colors.textSecondary} style={styles.inputIcon} />
                            <TextInput
                                style={styles.input}
                                placeholder="e.g. John Doe"
                                value={ownerName}
                                onChangeText={setOwnerName}
                                placeholderTextColor="#9E9E9E"
                            />
                        </View>
                    </View>

                    <TouchableOpacity style={styles.submitButton} onPress={handleRegister}>
                        <Plus size={24} color="#FFF" style={{ marginRight: 8 }} />
                        <Text style={styles.submitButtonText}>Register Card</Text>
                    </TouchableOpacity>
                </View>

                <View style={styles.infoBox}>
                    <Text style={styles.infoTitle}>Instructions</Text>
                    <Text style={styles.infoText}>
                        1. Enter the card ID number physically printed on the card.
                    </Text>
                    <Text style={styles.infoText}>
                        2. Tap "Register Card" to add it to the active monitoring list.
                    </Text>
                    <Text style={styles.infoText}>
                        3. The card will immediately start being tracked.
                    </Text>
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
    },
    formCard: {
        backgroundColor: Colors.card,
        borderRadius: Theme.borderRadius.lg,
        padding: 24,
        marginBottom: 24,
        ...Theme.shadows.medium,
    },
    inputGroup: {
        marginBottom: 20,
    },
    label: {
        fontSize: 14,
        fontWeight: '500',
        color: Colors.text,
        marginBottom: 8,
    },
    inputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: Colors.border,
        borderRadius: 12,
        backgroundColor: '#FAFAFA',
    },
    inputIcon: {
        marginLeft: 12,
    },
    input: {
        flex: 1,
        padding: 12,
        fontSize: 16,
        color: Colors.text,
    },
    submitButton: {
        backgroundColor: Colors.primary,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 16,
        borderRadius: 12,
        marginTop: 8,
        ...Theme.shadows.medium,
    },
    submitButtonText: {
        color: '#FFF',
        fontSize: 16,
        fontWeight: 'bold',
    },
    infoBox: {
        padding: 16,
    },
    infoTitle: {
        fontSize: 16,
        fontWeight: '600',
        color: Colors.text,
        marginBottom: 12,
    },
    infoText: {
        fontSize: 14,
        color: Colors.textSecondary,
        marginBottom: 8,
        lineHeight: 20,
    },
});
