import { StyleSheet, Text, View } from 'react-native';
import { colors, radius } from '../constants/theme';

export function LivePill({ label = 'LIVE' }: { label?: string }) {
  return (
    <View style={styles.pill}>
      <View style={styles.dot} />
      <Text style={styles.text}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  pill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    backgroundColor: colors.accent,
    borderRadius: radius.chip,
    paddingHorizontal: 9,
    paddingVertical: 4,
  },
  dot: { width: 6, height: 6, borderRadius: 3, backgroundColor: colors.white },
  text: { color: colors.white, fontSize: 11, fontWeight: '800', letterSpacing: 1 },
});
