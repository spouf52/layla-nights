import { Ionicons } from '@expo/vector-icons';
import { Tabs } from 'expo-router';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { colors } from '@/constants/theme';

const icons = { index: 'planet-outline', lineup: 'musical-notes-outline', schedule: 'time-outline', map: 'map-outline', info: 'grid-outline' } as const;
export default function TabsLayout() {
  return <Tabs screenOptions={{ headerShown: false, animation: 'none' }}
    tabBar={({ state, descriptors, navigation, insets }) => <View style={[styles.dockWrap, { bottom: Math.max(12, insets.bottom) }]}>
      <View style={styles.dock}>{state.routes.map((route, index) => {
        const selected = state.index === index;
        const title = descriptors[route.key].options.title ?? route.name;
        return <Pressable key={route.key} accessibilityRole="tab" accessibilityLabel={title} accessibilityState={{ selected }}
          onPress={() => { const event = navigation.emit({ type: 'tabPress', target: route.key, canPreventDefault: true }); if (!selected && !event.defaultPrevented) navigation.navigate(route.name, route.params); }}
          onLongPress={() => navigation.emit({ type: 'tabLongPress', target: route.key })}
          style={({ pressed }) => [styles.tab, pressed && { opacity: 0.7 }]}>
          <View style={[styles.icon, selected && styles.active]}><Ionicons name={icons[route.name as keyof typeof icons] ?? 'ellipse-outline'} size={21} color={selected ? colors.white : colors.textMuted} /></View>
          <Text style={[styles.label, selected && styles.labelActive]}>{title}</Text>
        </Pressable>;
      })}</View>
    </View>}>
    <Tabs.Screen name="index" options={{ title: 'Home' }} />
    <Tabs.Screen name="lineup" options={{ title: 'Line-up' }} />
    <Tabs.Screen name="schedule" options={{ title: 'Schedule' }} />
    <Tabs.Screen name="map" options={{ title: 'Map' }} />
    <Tabs.Screen name="info" options={{ title: 'More' }} />
  </Tabs>;
}
const styles = StyleSheet.create({
  dockWrap: { position: 'absolute', left: 16, right: 16 },
  dock: { flexDirection: 'row', backgroundColor: colors.glass, borderRadius: 36, padding: 8, borderWidth: 1, borderColor: colors.outline, boxShadow: '0 8px 32px rgba(0,0,0,0.5)', minHeight: 80 },
  tab: { flex: 1, alignItems: 'center', justifyContent: 'center', gap: 5, minHeight: 62 },
  icon: { width: 44, height: 36, borderRadius: 24, alignItems: 'center', justifyContent: 'center' },
  active: { backgroundColor: colors.accent, boxShadow: '0 4px 16px rgba(245,34,45,0.3)' },
  label: { color: colors.textMuted, fontSize: 10, fontWeight: '500' },
  labelActive: { color: colors.text, fontWeight: '700' },
});
