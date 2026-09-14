import { useState } from 'react';
import { Ionicons } from '@expo/vector-icons';
import { Image } from 'expo-image';
import { useRouter } from 'expo-router';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { colors, fonts } from '@/constants/theme';
import { artistBySlug, artists, festival, formatTime, setForArtist, sets, stageById, stages } from '@/data/festival';
import { isDemoMode, useNow } from '@/lib/demoClock';
import { useFavorites } from '@/lib/favorites';
import { isEventWindow, liveSets, nextSet } from '@/lib/nowPlaying';
import { ArtistCard } from '@/components/ArtistCard';
import { Countdown } from '@/components/Countdown';
import { LivePill } from '@/components/LivePill';
import { Chip } from '@/components/Chip';
import { FestivalPage, TicketButton } from '@/components/FestivalChrome';
import { PhotoScrim } from '@/components/ArtistPortrait';

export default function Home() {
  const router = useRouter();
  const now = useNow(30000);
  const favs = useFavorites();
  const [stage, setStage] = useState<string | null>(null);
  const awake = isEventWindow(now) || isDemoMode();
  const live = liveSets(sets, now);
  const next = nextSet(sets, now);
  const featured = artists.filter((artist) => !stage || artist.stageId === stage);
  return <FestivalPage contentContainerStyle={{ gap: 24 }}>
    <View style={styles.top}><View style={styles.welcome}><Text style={styles.greeting}>See you under the stars.</Text><Text style={styles.greetingSub}>Marrakech, we’re coming together.</Text></View><TicketButton /></View>
    <Pressable accessibilityRole="button" accessibilityLabel="Search artists" onPress={() => router.push('/lineup')} style={({ pressed }) => [styles.search, pressed && styles.pressed]}><Ionicons name="search-outline" size={20} color={colors.textMuted} /><Text style={styles.searchText}>Find your next favourite artist</Text><Ionicons name="options-outline" size={20} color={colors.text} /></Pressable>
    <View style={styles.hero}>
      <Image source={require('../../../assets/brand/stellar-cover-v1.png')} style={StyleSheet.absoluteFill} contentFit="cover" contentPosition="center" />
      <PhotoScrim strong />
      <View style={styles.heroTop}><View style={styles.editionPill}><View style={styles.redDot}/><Text style={styles.edition}>STELLAR EDITION</Text></View><View style={styles.date}><Text style={styles.dateDay}>07</Text><Text style={styles.dateMonth}>NOV</Text></View></View>
      <View style={styles.heroCopy}><Text style={styles.heroKicker}>A NEW CHAPTER BEGINS</Text><Text style={styles.heroTitle}>BEYOND{ '\n' }THE NIGHT.</Text><View style={styles.venue}><Ionicons name="location-outline" size={14} color={colors.text} /><Text style={styles.venueText}>The Source · Marrakech</Text></View></View>
      <Pressable accessibilityRole="button" onPress={() => router.push('/lineup')} style={({ pressed }) => [styles.heroCta, pressed && styles.pressed]}><Text style={styles.heroCtaText}>Explore the line-up</Text><View style={styles.heroArrow}><Ionicons name="arrow-forward" size={20} color={colors.accent} /></View></Pressable>
    </View>
    {!awake && now < new Date(festival.doorsISO) ? <View style={styles.countdown}><Text style={styles.countdownLabel}>THE COUNTDOWN{ '\n' }IS ON</Text><Countdown targetISO={festival.doorsISO} /></View> : null}
    {awake && (live.length > 0 || next) ? <Pressable onPress={() => router.push('/schedule')} style={styles.liveBanner}><LivePill label={live.length ? 'PLAYING NOW' : 'NEXT UP'} /><Text style={styles.liveText}>{live.length ? live.map(s => artistBySlug(s.artistSlug)?.name).join(' · ') : artistBySlug(next!.artistSlug)?.name}</Text><Text style={styles.greetingSub}>{live.length ? 'Follow the sound. View the schedule.' : `${formatTime(next!.start)} · ${stageById(next!.stageId)?.name}`}</Text></Pressable> : null}
    <View style={styles.sectionHeading}><View><Text style={styles.sectionKicker}>THE SELECTORS</Text><Text style={styles.sectionTitle}>Soundtrack to your night</Text></View><Pressable accessibilityRole="button" accessibilityLabel="See all artists" onPress={() => router.push('/lineup')} style={styles.seeAll}><Ionicons name="arrow-forward" size={22} color={colors.text} /></Pressable></View>
    <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: 8 }}><Chip label="All artists" active={stage === null} onPress={() => setStage(null)} />{stages.map(s => <Chip key={s.id} label={s.name === 'MAIN STAGE' ? 'Main stage' : s.name === 'GARDEN STAGE' ? 'Garden' : 'Arrival'} active={stage === s.id} onPress={() => setStage(s.id)} />)}</ScrollView>
    <ScrollView horizontal showsHorizontalScrollIndicator={false} snapToInterval={228} decelerationRate="fast" contentContainerStyle={{ gap: 12 }} >{featured.map(artist => { const set = setForArtist(artist.slug); return <ArtistCard key={artist.slug} artist={artist} set={set} compact saved={!!set && favs.has(set.id)} onToggleSave={() => set && favs.toggle(set.id)} style={{ width: 216 }} />; })}</ScrollView>
    <View style={styles.essentials}><Pressable accessibilityRole="button" onPress={() => router.push('/map')} style={({ pressed }) => [styles.quick, pressed && styles.pressed]}><Ionicons name="navigate-outline" size={24} color={colors.accentBright}/><Text style={styles.quickTitle}>Find your way</Text><Text style={styles.greetingSub}>Explore the venue</Text><Ionicons name="arrow-forward" size={18} color={colors.text} /></Pressable><Pressable accessibilityRole="button" onPress={() => router.push('/schedule')} style={({ pressed }) => [styles.quick, styles.quickRed, pressed && styles.pressed]}><Ionicons name="bookmark-outline" size={24} color={colors.white}/><Text style={styles.quickTitle}>Make it yours</Text><Text style={[styles.greetingSub,{color: colors.text}]}>{favs.count} saved sets</Text><Ionicons name="arrow-forward" size={18} color={colors.white}/></Pressable></View>
    <Text style={styles.footer}>ONE NIGHT. ENDLESS POSSIBILITIES.{ '\n' }07 NOVEMBER 2026 · MARRAKECH</Text>
  </FestivalPage>;
}
const styles = StyleSheet.create({
  top: { flexDirection: 'row', alignItems: 'flex-start', justifyContent: 'space-between', gap: 12 },
  welcome: { flex: 1, gap: 6 },
  greeting: { color: colors.text, fontFamily: fonts.display, fontSize: 32, lineHeight: 34, letterSpacing: 0.2 },
  greetingSub: { color: colors.textMuted, fontSize: 12, lineHeight: 18 },
  search: { minHeight: 52, borderRadius: 28, paddingHorizontal: 20, flexDirection: 'row', alignItems: 'center', gap: 12, backgroundColor: colors.surfaceRaised },
  searchText: { flex: 1, color: colors.textMuted, fontSize: 13 },
  hero: { borderRadius: 28, overflow: 'hidden', minHeight: 380, padding: 24, justifyContent: 'space-between', borderWidth: 1, borderColor: colors.outline },
  heroTop: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' },
  editionPill: { flexDirection: 'row', gap: 6, borderRadius: 20, backgroundColor: 'rgba(7,8,12,0.6)', padding: 10, alignItems: 'center' },
  redDot: { width: 5, height: 5, borderRadius: 3, backgroundColor: colors.accentBright },
  edition: { color: colors.text, fontSize: 9, fontWeight: '700', letterSpacing: 1.4 },
  date: { width: 48, minHeight: 60, borderRadius: 16, backgroundColor: colors.text, alignItems: 'center', justifyContent: 'center' },
  dateDay: { fontFamily: fonts.display, fontSize: 30, lineHeight: 32, color: colors.background },
  dateMonth: { fontSize: 9, letterSpacing: 1, color: colors.background, fontWeight: '700' },
  heroCopy: { marginTop: 32, gap: 8 },
  heroKicker: { color: colors.text, fontSize: 9, letterSpacing: 2.6 },
  heroTitle: { color: colors.text, fontFamily: fonts.display, fontSize: 64, lineHeight: 60, letterSpacing: -0.5 },
  venue: { flexDirection: 'row', alignItems: 'center', gap: 6, marginTop: 4 },
  venueText: { color: colors.text, fontSize: 12 },
  heroCta: { marginTop: 24, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', minHeight: 52, borderRadius: 28, backgroundColor: colors.accent, paddingLeft: 20, paddingRight: 6 },
  heroCtaText: { color: colors.white, fontSize: 13, fontWeight: '700' },
  heroArrow: { width: 40, height: 40, borderRadius: 20, backgroundColor: colors.white, alignItems: 'center', justifyContent: 'center' },
  countdown: { flexDirection: 'row', justifyContent: 'space-between', gap: 16, paddingVertical: 16, borderBottomWidth: 1, borderBottomColor: colors.outline, alignItems: 'center' },
  countdownLabel: { color: colors.textMuted, fontSize: 9, lineHeight: 16, letterSpacing: 1.4 },
  sectionHeading: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  sectionKicker: { fontSize: 9, color: colors.accentBright, letterSpacing: 2, marginBottom: 6 },
  sectionTitle: { color: colors.text, fontSize: 20, fontWeight: '600', letterSpacing: -0.4 },
  seeAll: { width: 44, height: 44, alignItems: 'center', justifyContent: 'center' },
  liveBanner: { backgroundColor: colors.accentSoft, borderRadius: 24, padding: 20, gap: 10, borderWidth: 1, borderColor: colors.outlineStrong },
  liveText: { color: colors.text, fontFamily: fonts.display, fontSize: 36 },
  essentials: { flexDirection: 'row', gap: 12 },
  quick: { flex: 1, borderRadius: 24, padding: 20, minHeight: 170, backgroundColor: colors.surfaceRaised, gap: 12 },
  quickRed: { backgroundColor: colors.accent },
  quickTitle: { color: colors.text, fontSize: 16, fontWeight: '600' },
  footer: { textAlign: 'center', fontSize: 9, letterSpacing: 2, lineHeight: 20, color: colors.textMuted },
  pressed: { opacity: 0.7 },
});
