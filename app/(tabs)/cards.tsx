import { LinearGradient } from 'expo-linear-gradient';
import React, { useEffect, useMemo } from 'react';
import { Platform, ScrollView, StatusBar, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import ParcelCard from '@/components/ParcelCard';
import { Colors } from '@/constants/Colors';
import { useBilling } from '@/context/BillingContext';
import { usePresence } from '@/hooks/usePresence';

export default function CardsScreen() {
  const { getEstimatedBill, cardSessions, unregisterCard } = useBilling();

  const knownIds = useMemo(() => Object.keys(cardSessions).map(id => parseInt(id, 10)), [cardSessions]);
  const { onlineCards, isConnected, lastUpdated, isOfflineMode } = usePresence(knownIds);

  // Convert sessions to array for rendering
  const cards = useMemo(() => Object.values(cardSessions), [cardSessions]);

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
        {cards.map((card) => {
          const isOnline = onlineCards.includes(card.cardId);
          const estimatedBill = !isOnline ? getEstimatedBill(card.cardId) : 0;
          const penaltyText = estimatedBill > 0
            ? `$${estimatedBill.toFixed(2)} penalty`
            : (!isOnline ? 'In Grace Period' : undefined);

          return (
            <ParcelCard
              key={card.cardId}
              id={card.cardId.toString()}
              cardNumber={card.cardId.toString()} // Fallback if ownerName not shown
              status={isOnline ? 'In Store' : 'Outside'}
              penalty={penaltyText}
              onRemove={() => {
                import('react-native').then(({ Alert }) => {
                  Alert.alert(
                    'Remove Card',
                    `Are you sure you want to unregister Card #${card.cardId}?`,
                    [
                      { text: 'Cancel', style: 'cancel' },
                      { text: 'Remove', style: 'destructive', onPress: () => unregisterCard(card.cardId) },
                    ]
                  );
                });
              }}
            />
          );
        })}

        {cards.length === 0 && (
          <View style={{ padding: 40, alignItems: 'center' }}>
            <Text style={{ textAlign: 'center', color: '#888', fontSize: 16 }}>No cards registered yet.</Text>
            <Text style={{ textAlign: 'center', color: '#AAA', fontSize: 12, marginTop: 8 }}>Go to the Add tab to register your first card.</Text>
          </View>
        )}

        <View style={{ marginTop: 20, padding: 10, backgroundColor: 'rgba(0,0,0,0.05)', borderRadius: 8 }}>
          <Text style={{ textAlign: 'center', color: '#666', fontSize: 12 }}>
            {isConnected
              ? 'Connected to Gateway'
              : 'Connecting to Gateway...'}
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
