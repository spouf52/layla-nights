import { StyleSheet, Text, View } from 'react-native';
import { colors, spacing } from '../constants/theme';

export function SectionTitle({ title, hint }: { title: string; hint?: string }) {
  return (
    <View style={styles.row}>
      <Text style={styles.title}>{title}</Text>
      {hint ? <Text style={styles.hint}>{hint}</Text> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'baseline',
    justifyContent: 'space-between',
    marginBottom: spacing.sm,
  },
  title: { color: colors.text, fontSize: 18, fontWeight: '800', letterSpacing: 0.5 },
  hint: { color: colors.textFaint, fontSize: 12 },
});
