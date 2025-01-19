import React, { useEffect, useState } from 'react';
import { StyleSheet, View, Text, ScrollView, ActivityIndicator } from 'react-native';
import { useRoute } from '@react-navigation/native';
import { useQuery } from '@tanstack/react-query';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import Animated, { FadeInUp } from 'react-native-reanimated';

// Mock API call - Replace with actual API integration
const fetchProductDetails = async (barcode) => {
  // Simulate API call
  await new Promise(resolve => setTimeout(resolve, 1500));
  return {
    name: 'Sample Product',
    brand: 'Brand Name',
    prices: [
      { store: 'Store A', price: '$9.99' },
      { store: 'Store B', price: '$10.99' },
      { store: 'Store C', price: '$8.99' },
    ],
  };
};

export default function ProductDetailsScreen() {
  const route = useRoute();
  const { barcode } = route.params;

  const { data: product, isLoading, error } = useQuery({
    queryKey: ['product', barcode],
    queryFn: () => fetchProductDetails(barcode),
  });

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#007AFF" />
        <Text style={styles.loadingText}>Fetching product details...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.errorContainer}>
        <MaterialCommunityIcons name="alert" size={48} color="#FF3B30" />
        <Text style={styles.errorText}>Failed to load product details</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <Animated.View 
        entering={FadeInUp.duration(500)}
        style={styles.content}
      >
        <View style={styles.header}>
          <Text style={styles.title}>{product.name}</Text>
          <Text style={styles.brand}>{product.brand}</Text>
        </View>

        <View style={styles.pricesContainer}>
          <Text style={styles.sectionTitle}>Price Comparison</Text>
          {product.prices.map((price, index) => (
            <Animated.View 
              key={index}
              entering={FadeInUp.delay(300 + index * 100)}
              style={styles.priceCard}
            >
              <Text style={styles.storeName}>{price.store}</Text>
              <Text style={styles.price}>{price.price}</Text>
            </Animated.View>
          ))}
        </View>
      </Animated.View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  content: {
    padding: 20,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: '#666',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  errorText: {
    marginTop: 16,
    fontSize: 16,
    color: '#666',
  },
  header: {
    marginBottom: 24,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: '#333',
  },
  brand: {
    fontSize: 16,
    color: '#666',
    marginTop: 4,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    marginBottom: 16,
  },
  pricesContainer: {
    marginTop: 8,
  },
  priceCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
  },
  storeName: {
    fontSize: 16,
    color: '#333',
  },
  price: {
    fontSize: 16,
    fontWeight: '600',
    color: '#007AFF',
  },
});