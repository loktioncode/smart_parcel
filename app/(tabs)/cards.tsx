import { LinearGradient } from 'expo-linear-gradient';
import React from 'react';
import { Platform, SafeAreaView, ScrollView, StatusBar, StyleSheet, Text, View } from 'react-native';

import ParcelCard from '@/components/ParcelCard';
import { Colors } from '@/constants/Colors';

export default function CardsScreen() {
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
        <ParcelCard
          id="1"
          cardNumber="8"
          status="Outside"
          penalty="$0.20 penalty"
        />
        <ParcelCard
          id="2"
          cardNumber="15"
          status="In Store"
        />
        <ParcelCard
          id="3"
          cardNumber="23"
          status="Outside"
          penalty="$1.50 penalty"
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
});
