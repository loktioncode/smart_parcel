import { LinearGradient } from 'expo-linear-gradient';
import React, { useEffect, useMemo } from 'react';
import { Platform, ScrollView, StatusBar, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import ParcelCard from '@/components/ParcelCard';
import { Colors } from '@/constants/Colors';
import { useBilling } from '@/context/BillingContext';
import { usePresence } from '@/hooks/usePresence';

const KNOWN_CARDS = [
  { id: 101, cardNumber: '101' },
  { id: 1, cardNumber: '001' },
  { id: 2, cardNumber: '002' },
];

export default function CardsScreen() {
  const knownIds = useMemo(() => KNOWN_CARDS.map(c => c.id), []);
  const { onlineCards, isConnected, lastUpdated, isOfflineMode } = usePresence(knownIds);
  const { getEstimatedBill, cardSessions } = useBilling();

  // Force re-render to update timer?
  const [tick, setTick] = React.useState(0);
  useEffect(() => {
    const interval = setInterval(() => setTick(t => t + 1), 10000); // Update UI every 10s for billing
    return () => clearInterval(interval);
  }, []);

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
            <Text style={styles.headerTitle}>Card Details</Text>
            <Text style={styles.headerSubtitle}>View and manage all cards</Text>
          </View>
        </SafeAreaView>
      </LinearGradient>

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {KNOWN_CARDS.map((card) => {
          const isOnline = onlineCards.includes(card.id);
          const estimatedBill = !isOnline ? getEstimatedBill(card.id) : 0;
          const penaltyText = estimatedBill > 0
            ? `$${estimatedBill.toFixed(2)} penalty`
            : (!isOnline ? 'In Grace Period' : undefined);

          return (
            <ParcelCard
              key={card.id}
              id={card.id.toString()}
              cardNumber={card.cardNumber}
              status={isOnline ? 'In Store' : 'Outside'}
              penalty={penaltyText}
            />
          );
        })}

        {KNOWN_CARDS.length === 0 && (
          <Text style={{ textAlign: 'center', color: '#888', marginTop: 20 }}>No cards configured.</Text>
        )}

        <View style={{ marginTop: 20, padding: 10, backgroundColor: isOfflineMode ? 'rgba(255,165,0,0.15)' : 'rgba(0,0,0,0.05)', borderRadius: 8 }}>
          {isOfflineMode && (
            <Text style={{ textAlign: 'center', color: Colors.warning, fontSize: 14, fontWeight: '600', marginBottom: 4 }}>
              📱 Demo Mode
            </Text>
          )}
          <Text style={{ textAlign: 'center', color: isOfflineMode ? Colors.warning : '#666', fontSize: 12 }}>
            {isConnected
              ? 'Connected to Gateway'
              : (isOfflineMode
                ? 'Showing sample data - Connect to ESP32 for live tracking'
                : 'Connecting to Gateway...')}
          </Text>
          {lastUpdated && (
            <Text style={{ textAlign: 'center', color: '#888', fontSize: 10, marginTop: 4 }}>
              Last updated: {lastUpdated.toLocaleTimeString()}
            </Text>
          )}
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
});
