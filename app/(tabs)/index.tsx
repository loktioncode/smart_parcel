import { LinearGradient } from 'expo-linear-gradient';
import { Clock, CreditCard, DollarSign, MapPin } from 'lucide-react-native';
import React, { useMemo } from 'react';
import { Platform, ScrollView, StatusBar, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import AlertItem from '@/components/AlertItem';
import StatCard from '@/components/StatCard';
import { Colors } from '@/constants/Colors';
import { useBilling } from '@/context/BillingContext';
import { usePresence } from '@/hooks/usePresence';

export default function HomeScreen() {
  const { cardSessions, history, getEstimatedBill } = useBilling();
  const knownIds = useMemo(() => Object.keys(cardSessions).map(id => parseInt(id, 10)), [cardSessions]);
  const { onlineCards } = usePresence(knownIds);

  const stats = useMemo(() => {
    const sessionIds = Object.keys(cardSessions).map(id => parseInt(id, 10));
    const totalActive = sessionIds.length;

    // Count how many of our registered cards are actually detected
    const onlineRegistered = sessionIds.filter(id => onlineCards.includes(id)).length;
    const outsideStore = totalActive - onlineRegistered;

    // Count how many are outside AND past grace period
    const beingCharged = sessionIds.filter(id => {
      return !onlineCards.includes(id) && getEstimatedBill(id) > 0;
    }).length;

    // Total revenue from history
    const totalRevenue = history
      .filter(e => e.type === 'returned' && e.penalty && cardSessions[e.cardId] !== undefined)
      .reduce((sum, e) => sum + (e.penalty || 0), 0);

    return { outsideStore, beingCharged, totalActive, totalRevenue };
  }, [cardSessions, onlineCards, history, getEstimatedBill]);

  const recentAlerts = useMemo(() => {
    return history
      .filter(event => cardSessions[event.cardId] !== undefined)
      .slice(0, 10); // Show last 10 alerts
  }, [history, cardSessions]);

  const formatTime = (ts: number) => {
    return new Date(ts).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
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
            <Text style={styles.headerTitle}>Officer Dashboard</Text>
            <Text style={styles.headerSubtitle}>Smart Parcel Monitor System</Text>
          </View>
        </SafeAreaView>
      </LinearGradient>

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Stats Grid */}
        <View style={styles.statsGrid}>
          <StatCard
            title="Outside Store"
            value={stats.outsideStore}
            icon={<MapPin size={20} color={Colors.outside} />}
            color={Colors.outside}
          />
          <StatCard
            title="Being Charged"
            value={stats.beingCharged}
            icon={<Clock size={20} color={Colors.warning} />}
            color={Colors.warning}
          />
          <StatCard
            title="Active Cards"
            value={stats.totalActive}
            icon={<CreditCard size={20} color={Colors.success} />}
            color={Colors.success}
          />
          <StatCard
            title="Total Revenue"
            value={`$${stats.totalRevenue.toFixed(2)}`}
            icon={<DollarSign size={20} color={Colors.primary} />}
            color={Colors.primary}
          />
        </View>

        {/* Recent Alerts */}
        <Text style={styles.sectionTitle}>Recent Alerts</Text>

        {recentAlerts.length === 0 ? (
          <Text style={{ textAlign: 'center', color: '#888', marginTop: 20 }}>No recent activity.</Text>
        ) : (
          recentAlerts.map((alert) => (
            <AlertItem
              key={alert.id}
              id={alert.id}
              type={alert.type as 'left' | 'returned' | 'registered'}
              cardNumber={alert.cardId.toString()}
              time={formatTime(alert.timestamp)}
              penalty={alert.penalty ? `$${alert.penalty.toFixed(2)}` : undefined}
            />
          ))
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
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: Colors.text,
    marginBottom: 16,
  },
});
