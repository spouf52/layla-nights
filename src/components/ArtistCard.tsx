import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { Pressable, StyleSheet, Text, View, type StyleProp, type ViewStyle } from 'react-native';
import { colors, fonts } from '@/constants/theme';
import { formatTime, stageById, type Artist, type Set } from '@/data/festival';
import type { SetStatus } from '@/lib/nowPlaying';
import { LivePill } from './LivePill';
import { ArtistPortrait } from './ArtistPortrait';

export function ArtistCard({ artist, set, status, saved, onToggleSave, compact = false, style }: {
  artist: Artist; set?: Set; status?: SetStatus; saved: boolean; index?: number;
  onToggleSave: () => void; compact?: boolean; style?: StyleProp<ViewStyle>;
}) {
  const router = useRouter();
  return <View style={[styles.card, style]}>
    <Pressable accessibilityRole="button" accessibilityLabel={`View ${artist.name}`} onPress={() => router.push(`/artist/${artist.slug}`)}
      style={({ pressed }) => [styles.open, { aspectRatio: compact ? 0.77 : 1.05 }, pressed && { opacity: 0.85 }]}>
      <ArtistPortrait artist={artist} shade style={StyleSheet.absoluteFill} />
      {status === 'live' ? <View style={styles.live}><LivePill /></View> : null}
      <View style={[styles.caption, compact && { paddingHorizontal: 16 }]}>
        <Text numberOfLines={1} adjustsFontSizeToFit minimumFontScale={0.7} style={[styles.name, compact && styles.compactName]}>{artist.name}</Text>
        <Text style={styles.genre} numberOfLines={1}>{artist.style.toLowerCase()}</Text>
      </View>
    </Pressable>
    <Pressable accessibilityRole="button" accessibilityLabel={saved ? `Remove ${artist.name} from schedule` : `Save ${artist.name}`}
      accessibilityState={{ selected: saved }} onPress={onToggleSave} style={({ pressed }) => [styles.save, saved && styles.saved, pressed && { opacity: 0.65 }]}>
      <Ionicons name={saved ? 'bookmark' : 'bookmark-outline'} color={colors.white} size={18} />
    </Pressable>
    <View style={styles.footer}><View style={styles.stageRow}><View style={[styles.dot, { backgroundColor: artist.accent }]} /><Text numberOfLines={1} style={styles.stage}>{stageById(artist.stageId)?.name.replace(' STAGE', '').replace(' ROOM', '')}</Text></View><Text style={styles.time}>{set ? formatTime(set.start) : 'TBA'}</Text></View>
  </View>;
}
const styles = StyleSheet.create({
  card: { borderRadius: 24, overflow: 'hidden', backgroundColor: colors.surfaceRaised, borderCurve: 'continuous' },
  open: { width: '100%', justifyContent: 'flex-end' },
  caption: { padding: 20, paddingBottom: 16, gap: 2 },
  name: { fontFamily: fonts.display, color: colors.text, fontSize: 52, lineHeight: 54 },
  compactName: { fontSize: 30, lineHeight: 34 },
  genre: { fontSize: 12, color: '#DEDDE0', textTransform: 'capitalize' },
  save: { position: 'absolute', top: 12, right: 12, height: 44, width: 44, borderRadius: 22, backgroundColor: 'rgba(7,8,12,0.55)', alignItems: 'center', justifyContent: 'center', borderWidth: 1, borderColor: 'rgba(255,255,255,0.25)' },
  saved: { backgroundColor: colors.accent, borderColor: colors.accent },
  footer: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', gap: 8, paddingHorizontal: 16, minHeight: 44 },
  stageRow: { flexDirection: 'row', gap: 6, alignItems: 'center', flex: 1 },
  dot: { width: 5, height: 5, borderRadius: 3 },
  stage: { fontSize: 9, fontWeight: '600', letterSpacing: 1, color: colors.textMuted, flexShrink: 1 },
  time: { color: colors.text, fontSize: 12, fontWeight: '600', fontVariant: ['tabular-nums'] },
  live: { position: 'absolute', left: 12, top: 16 },
});
