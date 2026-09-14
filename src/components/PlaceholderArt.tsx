import { StyleSheet, Text, View } from 'react-native';
import { colors, radius } from '../constants/theme';

/**
 * Intentional placeholder until DJ press photos land (PLAN.md §5):
 * dark card + artist initials + accent edge + star motif.
 */
export function PlaceholderArt({
  name,
  accent,
  size = 96,
  rounded = radius.card,
}: {
  name: string;
  accent: string;
  size?: number;
  rounded?: number;
}) {
  const initials = name
    .replace(/^WHOS/, 'WHOS ')
    .split(/[\s_]+/)
    .map((w) => w[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();
  return (
    <View style={[styles.base, { width: size, height: size, borderRadius: rounded, borderColor: accent }]}>
      <Text style={styles.star}>✦</Text>
      <Text style={[styles.initials, { fontSize: size * 0.28 }]}>{initials}</Text>
      <View style={[styles.edge, { backgroundColor: accent }]} />
    </View>
  );
}

const styles = StyleSheet.create({
  base: {
    backgroundColor: colors.surfaceRaised,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  star: { position: 'absolute', top: 6, right: 8, color: colors.textFaint, fontSize: 12 },
  initials: { color: colors.text, fontWeight: '800', letterSpacing: 1 },
  edge: { position: 'absolute', left: 0, top: 0, bottom: 0, width: 3 },
});
