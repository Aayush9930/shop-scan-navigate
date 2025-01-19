import React from 'react';
import { StyleSheet, View, Text, ScrollView, ActivityIndicator, Linking } from 'react-native';
import { useRoute, RouteProp } from '@react-navigation/native';
import { useQuery } from '@tanstack/react-query';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import Animated, { FadeInUp } from 'react-native-reanimated';
import { RootStackParamList } from '../types/navigation';
import { getProductDetails } from '../services/upcService';
import { useProduct } from '../context/ProductContext';

type ProductDetailsRouteProp = RouteProp<RootStackParamList, 'ProductDetails'>;

export default function ProductDetailsScreen() {
  const route = useRoute<ProductDetailsRouteProp>();
  const { barcode } = route.params;
  const { addToHistory } = useProduct();

  const { data: products, isLoading, error } = useQuery({
    queryKey: ['product', barcode],
    queryFn: () => getProductDetails(barcode),
    onSuccess: (data) => {
      if (data && data.length > 0) {
        addToHistory({
          id: barcode,
          name: data[0].title,
          price: `${data[0].currency} ${data[0].price}`,
          date: new Date().toISOString(),
        });
      }
    },
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
        {products && products.length > 0 ? (
          <>
            <View style={styles.header}>
              <Text style={styles.title}>{products[0].title}</Text>
              <Text style={styles.price}>
                {products[0].currency} {products[0].price}
              </Text>
            </View>

            <View style={styles.pricesContainer}>
              <Text style={styles.sectionTitle}>Available Prices</Text>
              {products.map((product, index) => (
                <Animated.View 
                  key={index}
                  entering={FadeInUp.delay(300 + index * 100)}
                  style={styles.priceCard}
                >
                  <View>
                    <Text style={styles.productTitle}>{product.title}</Text>
                    <Text style={styles.priceText}>
                      {product.currency} {product.price}
                    </Text>
                  </View>
                  {product.url && (
                    <MaterialCommunityIcons
                      name="open-in-new"
                      size={24}
                      color="#007AFF"
                      onPress={() => Linking.openURL(product.url)}
                    />
                  )}
                </Animated.View>
              ))}
            </View>
          </>
        ) : (
          <View style={styles.noDataContainer}>
            <MaterialCommunityIcons name="information" size={48} color="#666" />
            <Text style={styles.noDataText}>No product information found</Text>
          </View>
        )}
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
  price: {
    fontSize: 20,
    fontWeight: '600',
    color: '#007AFF',
    marginTop: 8,
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
  productTitle: {
    fontSize: 16,
    color: '#333',
    marginBottom: 4,
  },
  priceText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#007AFF',
  },
  noDataContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 40,
  },
  noDataText: {
    marginTop: 16,
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
  },
});