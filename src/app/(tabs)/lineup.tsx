import { useMemo, useState } from 'react';
import { Ionicons } from '@expo/vector-icons';
import { FlatList, ScrollView, Pressable, StyleSheet, Text, TextInput, View, useWindowDimensions } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { colors, layout } from '@/constants/theme';
import { artists, setForArtist, stages } from '@/data/festival';
import { useNow } from '@/lib/demoClock';
import { useFavorites } from '@/lib/favorites';
import { statusOf } from '@/lib/nowPlaying';
import { ArtistCard } from '@/components/ArtistCard';
import { Chip } from '@/components/Chip';
import { PageHeading, TicketButton } from '@/components/FestivalChrome';

export default function Lineup() {
  const [query, setQuery] = useState('');
  const [stageId, setStageId] = useState<string | null>(null);
  const [savedOnly, setSavedOnly] = useState(false);
  const now = useNow(30000);
  const favs = useFavorites();
  const safe = useSafeAreaInsets();
  const cardWidth = (Math.min(useWindowDimensions().width, layout.maxWidth) - layout.pageInset * 2 - 12) / 2;
  const list = useMemo(() => artists.filter((artist) => {
    const q = query.trim().toLowerCase();
    return (!q || `${artist.name} ${artist.style}`.toLowerCase().includes(q)) && (!stageId || artist.stageId === stageId)
      && (!savedOnly || favs.has(setForArtist(artist.slug)?.id ?? ''));
  }), [query, stageId, savedOnly, favs]);
  return <FlatList style={styles.screen} data={list} numColumns={2} keyExtractor={(artist) => artist.slug}
    showsVerticalScrollIndicator={false} keyboardShouldPersistTaps="handled"
    contentContainerStyle={[styles.content, { paddingTop: safe.top + 16, paddingBottom: layout.tabClearance + safe.bottom }]}
    columnWrapperStyle={{ gap: 12 }}
    ListHeaderComponent={<View style={styles.header}>
      <PageHeading eyebrow="THE SOUND OF STELLAR" title="THE LINE-UP" right={<TicketButton />} />
      <Text style={styles.intro}>Meet the artists. Find your frequency.</Text>
      <View style={styles.searchRow}><Ionicons name="search-outline" size={20} color={colors.textMuted} /><TextInput accessibilityLabel="Search artists" value={query} onChangeText={setQuery} placeholder="Search artists…" placeholderTextColor={colors.textMuted} style={styles.search} autoCorrect={false} />{query ? <Pressable accessibilityRole="button" accessibilityLabel="Clear search" onPress={() => setQuery('')} style={styles.clear}><Ionicons name="close" size={19} color={colors.text} /></Pressable> : null}</View>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.chips}><Chip label="All artists" active={stageId === null} onPress={() => setStageId(null)} />{stages.map((stage) => <Chip key={stage.id} label={stage.name === 'MAIN STAGE' ? 'Main stage' : stage.name === 'GARDEN STAGE' ? 'Garden' : 'Arrival'} active={stageId === stage.id} onPress={() => setStageId(stage.id)} />)}</ScrollView>
      <View style={styles.results}><Text style={styles.count}>{String(list.length).padStart(2, '0')} ARTISTS · 07 NOV</Text><Pressable onPress={() => setSavedOnly(!savedOnly)} accessibilityRole="button" accessibilityState={{ selected: savedOnly }} style={styles.savedToggle}><Ionicons name={savedOnly ? 'bookmark' : 'bookmark-outline'} size={15} color={savedOnly ? colors.accentBright : colors.textMuted} /><Text style={[styles.savedLabel, savedOnly && { color: colors.accentBright }]}>Saved</Text></Pressable></View>
    </View>}
    renderItem={({ item }) => { const set = setForArtist(item.slug); return <ArtistCard artist={item} set={set} status={set ? statusOf(set, now) : undefined} compact saved={!!set && favs.has(set.id)} onToggleSave={() => set && favs.toggle(set.id)} style={{ width: cardWidth, marginBottom: 16 }} />; }}
    ListEmptyComponent={<View style={styles.empty}><Ionicons name="search-outline" size={32} color={colors.accentBright} /><Text style={styles.emptyTitle}>{savedOnly ? 'Your night starts here' : 'No artists found'}</Text><Text style={styles.intro}>{savedOnly ? 'Save a set to keep your favourites together.' : 'Try a different name or stage.'}</Text><Pressable accessibilityRole="button" onPress={() => { setQuery(''); setStageId(null); setSavedOnly(false); }} style={styles.reset}><Text style={{ color: colors.text }}>Show all artists</Text></Pressable></View>}
  />;
}
const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.background },
  content: { paddingHorizontal: layout.pageInset },
  header: { gap: 16 },
  intro: { color: colors.textMuted, fontSize: 13, lineHeight: 20 },
  searchRow: { flexDirection: 'row', alignItems: 'center', gap: 12, backgroundColor: colors.surfaceRaised, borderRadius: 28, paddingLeft: 20, minHeight: 52 },
  search: { flex: 1, height: 52, color: colors.text, fontSize: 14, paddingRight: 12 },
  clear: { width: 44, height: 44, alignItems: 'center', justifyContent: 'center' },
  chips: { gap: 8 },
  results: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 },
  count: { fontSize: 10, letterSpacing: 1.4, color: colors.textMuted },
  savedToggle: { flexDirection: 'row', gap: 6, alignItems: 'center', minHeight: 44, paddingLeft: 12 },
  savedLabel: { color: colors.textMuted, fontSize: 12 },
  empty: { alignItems: 'center', gap: 12, paddingVertical: 48 },
  emptyTitle: { color: colors.text, fontSize: 20, fontWeight: '600' },
  reset: { padding: 16, backgroundColor: colors.surfaceRaised, borderRadius: 28 },
});
