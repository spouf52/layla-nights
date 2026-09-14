import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { ScrollView, Pressable, StyleSheet, Text, View, type ScrollViewProps } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { colors, fonts, layout } from '@/constants/theme';

export function FestivalPage({ children, contentContainerStyle, ...props }: ScrollViewProps) {
  const safe = useSafeAreaInsets();
  return <ScrollView {...props} style={styles.screen} showsVerticalScrollIndicator={false}
    keyboardShouldPersistTaps="handled" contentContainerStyle={[styles.content, { paddingTop: safe.top + 16, paddingBottom: layout.tabClearance + safe.bottom }, contentContainerStyle]}>
    {children}
  </ScrollView>;
}

export function PageHeading({ title, eyebrow, right }: { title: string; eyebrow: string; right?: React.ReactNode }) {
  return <View style={styles.headingRow}><View style={{ flex: 1, gap: 4 }}><Text style={styles.eyebrow}>{eyebrow}</Text><Text style={styles.heading}>{title}</Text></View>{right}</View>;
}

export function TicketButton() {
  const router = useRouter();
  return <Pressable accessibilityRole="button" accessibilityLabel="Open my ticket" onPress={() => router.push('/tickets')} style={({ pressed }) => [styles.iconButton, pressed && styles.pressed]}><Ionicons name="ticket-outline" size={21} color={colors.text} /></Pressable>;
}

export const chrome = StyleSheet.create({
  kicker: { color: colors.accentBright, fontSize: 11, fontWeight: '700', letterSpacing: 2 },
  muted: { color: colors.textMuted, fontSize: 13, lineHeight: 20 },
  button: { borderRadius: 28, minHeight: 54, padding: 16, backgroundColor: colors.accent, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 10 },
  buttonText: { color: colors.white, fontWeight: '700', fontSize: 15 },
  pressed: { opacity: 0.75 },
});
const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.background },
  content: { paddingHorizontal: layout.pageInset, gap: 24 },
  headingRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: 16 },
  eyebrow: { color: colors.textMuted, fontSize: 10, fontWeight: '600', letterSpacing: 2 },
  heading: { color: colors.text, fontFamily: fonts.display, fontSize: 44, lineHeight: 50 },
  iconButton: { width: 48, height: 48, borderRadius: 24, backgroundColor: colors.surfaceRaised, borderWidth: 1, borderColor: colors.outline, alignItems: 'center', justifyContent: 'center' },
  pressed: { opacity: 0.65 },
});
