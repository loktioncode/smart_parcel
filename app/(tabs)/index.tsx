import { LinearGradient } from 'expo-linear-gradient';
import { Clock, CreditCard, DollarSign, MapPin } from 'lucide-react-native';
import React from 'react';
import { Platform, ScrollView, StatusBar, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import AlertItem from '@/components/AlertItem';
import StatCard from '@/components/StatCard';
import { Colors } from '@/constants/Colors';

export default function HomeScreen() {
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
            value="2"
            icon={<MapPin size={20} color={Colors.outside} />}
            color={Colors.outside}
          />
          <StatCard
            title="Being Charged"
            value="2"
            icon={<Clock size={20} color={Colors.warning} />}
            color={Colors.warning}
          />
          <StatCard
            title="Active Cards"
            value="3"
            icon={<CreditCard size={20} color={Colors.success} />}
            color={Colors.success}
          />
          <StatCard
            title="Total Revenue"
            value="$1.50"
            icon={<DollarSign size={20} color={Colors.primary} />}
            color={Colors.primary}
          />
        </View>

        {/* Recent Alerts */}
        <Text style={styles.sectionTitle}>Recent Alerts</Text>

        <AlertItem
          id="1"
          type="left"
          cardNumber="23"
          time="02:46 PM"
        />
        <AlertItem
          id="2"
          type="returned"
          cardNumber="12"
          time="02:51 PM"
          penalty="$3.50"
        />
        <AlertItem
          id="3"
          type="left"
          cardNumber="8"
          time="02:59 PM"
        />
        <AlertItem
          id="4"
          type="returned"
          cardNumber="5"
          time="03:01 PM"
        />
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
