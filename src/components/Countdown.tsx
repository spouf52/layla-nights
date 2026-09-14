import { useMemo } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { colors, fonts } from '../constants/theme';
import { useNow } from '../lib/demoClock';

function pad(n: number) {
  return n < 10 ? `0${n}` : `${n}`;
}

export function Countdown({ targetISO }: { targetISO: string }) {
  const now = useNow(1000);
  const parts = useMemo(() => {
    const diff = Math.max(0, new Date(targetISO).getTime() - now.getTime());
    const d = Math.floor(diff / 86400000);
    const h = Math.floor((diff % 86400000) / 3600000);
    const m = Math.floor((diff % 3600000) / 60000);
    const s = Math.floor((diff % 60000) / 1000);
    return [
      { v: `${d}`, l: 'DAYS' },
      { v: pad(h), l: 'HRS' },
      { v: pad(m), l: 'MIN' },
      { v: pad(s), l: 'SEC' },
    ];
  }, [now, targetISO]);

  return (
    <View style={styles.row}>
      {parts.map((p) => (
        <View key={p.l} style={styles.cell}>
          <Text style={styles.value} selectable>
            {p.v}
          </Text>
          <Text style={styles.label}>{p.l}</Text>
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', gap: 16, flex: 1, justifyContent: 'flex-end' },
  cell: { alignItems: 'center', minWidth: 26 },
  value: { color: colors.text, fontFamily: fonts.display, fontSize: 28, fontVariant: ['tabular-nums'] },
  label: { color: colors.textMuted, fontSize: 8, letterSpacing: 1, marginTop: 2 },
});
