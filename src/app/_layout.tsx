import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useFonts } from 'expo-font';
import { useEffect, useState } from 'react';
import { View } from 'react-native';
import { colors, layout } from '@/constants/theme';
import { FavoritesProvider } from '@/lib/favorites';
import { LaunchScreen } from '@/components/LaunchScreen';

export default function RootLayout() {
  const [loaded, error] = useFonts({ BarlowCondensed: require('../../assets/fonts/BarlowCondensed-SemiBold.ttf') });
  const [minimumElapsed, setMinimumElapsed] = useState(false);
  useEffect(() => {
    const timer = setTimeout(() => setMinimumElapsed(true), 5000);
    return () => clearTimeout(timer);
  }, []);
  if ((!loaded && !error) || !minimumElapsed) return <LaunchScreen />;
  return (
    <View style={{ flex: 1, backgroundColor: colors.background }}>
    <View style={{ flex: 1, width: '100%', maxWidth: layout.maxWidth, alignSelf: 'center' }}>
    <FavoritesProvider>
      <StatusBar style="light" />
      <Stack
        screenOptions={{
          headerShown: false,
          contentStyle: { backgroundColor: colors.background },
          animation: 'fade',
        }}>
        <Stack.Screen name="(tabs)" />
        <Stack.Screen name="artist/[slug]" options={{ presentation: 'modal' }} />
        <Stack.Screen name="tickets" />
      </Stack>
    </FavoritesProvider>
    </View>
    </View>
  );
}
