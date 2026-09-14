import { Pressable, StyleSheet, Text } from 'react-native';
import { colors, radius } from '../constants/theme';

export function Chip({
  label,
  active,
  onPress,
}: {
  label: string;
  active: boolean;
  onPress: () => void;
}) {
  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [styles.base, active ? styles.active : styles.idle, pressed && { opacity: 0.7 }]}
      accessibilityRole="button"
      accessibilityState={{ selected: active }}>
      <Text style={[styles.text, active && styles.textActive]}>{label}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  base: { borderRadius: radius.pill, paddingHorizontal: 16, minHeight: 44, justifyContent: 'center', borderWidth: 1 },
  idle: { backgroundColor: colors.surface, borderColor: colors.outline },
  active: { backgroundColor: colors.accent, borderColor: colors.accent },
  text: { color: colors.textMuted, fontSize: 13, fontWeight: '600' },
  textActive: { color: colors.text },
});
