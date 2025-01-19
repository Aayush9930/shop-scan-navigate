import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, View } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

import HomeScreen from './src/screens/HomeScreen';
import ScannerScreen from './src/screens/ScannerScreen';
import ProductDetailsScreen from './src/screens/ProductDetailsScreen';
import HistoryScreen from './src/screens/HistoryScreen';
import { ProductProvider } from './src/context/ProductContext';

const Stack = createNativeStackNavigator();
const queryClient = new QueryClient();

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ProductProvider>
        <SafeAreaProvider>
          <GestureHandlerRootView style={{ flex: 1 }}>
            <NavigationContainer>
              <StatusBar style="dark" />
              <Stack.Navigator
                screenOptions={{
                  headerStyle: {
                    backgroundColor: '#fff',
                  },
                  headerShadowVisible: false,
                  headerTitleStyle: {
                    fontWeight: '600',
                  },
                }}
              >
                <Stack.Screen 
                  name="Home" 
                  component={HomeScreen}
                  options={{ headerShown: false }}
                />
                <Stack.Screen 
                  name="Scanner" 
                  component={ScannerScreen}
                  options={{ 
                    title: 'Scan Barcode',
                    presentation: 'modal'
                  }}
                />
                <Stack.Screen 
                  name="ProductDetails" 
                  component={ProductDetailsScreen}
                  options={{ title: 'Product Details' }}
                />
                <Stack.Screen 
                  name="History" 
                  component={HistoryScreen}
                  options={{ title: 'Scan History' }}
                />
              </Stack.Navigator>
            </NavigationContainer>
          </GestureHandlerRootView>
        </SafeAreaProvider>
      </ProductProvider>
    </QueryClientProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
});