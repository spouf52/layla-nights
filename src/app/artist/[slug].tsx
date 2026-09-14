import { FontAwesome6, Ionicons } from '@expo/vector-icons';
import { Linking, Pressable, ScrollView, Share, StyleSheet, Text, View } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { colors, fonts } from '@/constants/theme';
import { artistBySlug, formatTime, setForArtist, stageById } from '@/data/festival';
import { useNow } from '@/lib/demoClock';
import { useFavorites } from '@/lib/favorites';
import { statusOf } from '@/lib/nowPlaying';
import { LivePill } from '@/components/LivePill';
import { ArtistPortrait } from '@/components/ArtistPortrait';
import { FestivalPage, chrome } from '@/components/FestivalChrome';

export default function ArtistDetail() {
  const { slug } = useLocalSearchParams<{ slug: string }>();
  const router = useRouter();
  const safe = useSafeAreaInsets();
  const now = useNow(15000);
  const favs = useFavorites();
  const artist = typeof slug === 'string' ? artistBySlug(slug) : undefined;
  const set = artist ? setForArtist(artist.slug) : undefined;
  const stage = artist ? stageById(artist.stageId) : undefined;
  const saved = !!set && favs.has(set.id);
  const live = set ? statusOf(set, now) === 'live' : false;
  const back = () => router.canGoBack() ? router.back() : router.replace('/lineup');
  if (!artist) return <FestivalPage><Text style={styles.name}>Artist not found</Text><Pressable style={chrome.button} onPress={back}><Text style={chrome.buttonText}>Back to line-up</Text></Pressable></FestivalPage>;
  return <FestivalPage contentContainerStyle={{ paddingHorizontal: 0, paddingTop: safe.top, gap: 0, paddingBottom: 40 }}>
    <View style={styles.hero}>
      <ArtistPortrait artist={artist} shade style={StyleSheet.absoluteFill} />
      <View style={styles.top}><Pressable onPress={back} accessibilityRole="button" accessibilityLabel="Go back" style={styles.circle}><Ionicons name="arrow-back" size={23} color={colors.white}/></Pressable><Text style={styles.topLabel}>MEET THE ARTIST</Text><Pressable onPress={() => Share.share({ message: `${artist.name} at LAŸLA NIGHTS · 7 November · The Source Marrakech.${set ? ' ' + formatTime(set.start) + '–' + formatTime(set.end) : ''}` }).catch(() => {})} accessibilityRole="button" accessibilityLabel={`Share ${artist.name}`} style={styles.circle}><Ionicons name="share-outline" size={21} color={colors.white}/></Pressable></View>
      <View style={styles.caption}>{live ? <LivePill /> : <Text style={styles.eyebrow}>STELLAR EDITION / 2026</Text>}<Text numberOfLines={1} adjustsFontSizeToFit style={styles.name}>{artist.name}</Text><Text style={styles.genre}>{artist.style}</Text></View>
    </View>
    <View style={styles.body}>
      <View style={styles.setMeta}><View style={styles.metaItem}><Ionicons name="musical-notes-outline" color={colors.accentBright} size={20}/><View><Text style={styles.label}>STAGE</Text><Text style={styles.value}>{stage?.name}</Text></View></View><View style={styles.metaItem}><Ionicons name="time-outline" color={colors.accentBright} size={20}/><View><Text style={styles.label}>SET TIME · LOCAL</Text><Text style={styles.value}>{set ? `${formatTime(set.start)}—${formatTime(set.end)}` : 'To be announced'}</Text></View></View></View>
      <View style={{gap: 12}}><Text style={styles.about}>IN THE SPOTLIGHT</Text><Text style={styles.bio}>{artist.description}</Text></View>
      {set ? <Pressable accessibilityRole="button" accessibilityState={{ selected: saved }} onPress={() => favs.toggle(set.id)} style={({pressed}) => [chrome.button, saved && styles.saved, pressed && chrome.pressed]}><Ionicons name={saved ? 'checkmark' : 'bookmark-outline'} size={20} color={colors.white}/><Text style={chrome.buttonText}>{saved ? 'Saved to my night' : 'Add to my schedule'}</Text></Pressable> : null}
      {artist.music ? <View style={styles.trackSection}>
        <View style={styles.sectionHeading}><View><Text style={styles.about}>TRACKS</Text><Text style={styles.musicIntro}>Titles in the orbit.</Text></View><Ionicons name="disc-outline" size={20} color={colors.accentBright}/></View>
        {artist.music.tracks.length ? <ScrollView style={styles.trackScroller} contentContainerStyle={styles.trackScrollerContent} nestedScrollEnabled showsVerticalScrollIndicator>
          {artist.music.tracks.map((track, index) => <View key={track.title} style={styles.trackRow}>
          <Text style={styles.trackNumber}>{String(index + 1).padStart(2, '0')}</Text>
          <Text numberOfLines={2} style={styles.trackTitle}>{track.title}</Text>
          <Pressable accessibilityRole="link" accessibilityLabel={`Listen to ${track.title} on Spotify`} onPress={() => Linking.openURL(track.spotifyUrl).catch(() => {})} style={({pressed}) => [styles.platformButton, styles.spotifyPlatform, pressed && chrome.pressed]}><FontAwesome6 name="spotify" size={16} color={colors.white}/></Pressable>
          <Pressable accessibilityRole="link" accessibilityLabel={`Listen to ${track.title} on Apple Music`} onPress={() => Linking.openURL(track.appleMusicUrl).catch(() => {})} style={({pressed}) => [styles.platformButton, styles.applePlatform, pressed && chrome.pressed]}><FontAwesome6 name="apple" size={16} color={colors.white}/></Pressable>
          </View>)}
        </ScrollView> : <View style={styles.trackEmpty}><Text style={styles.trackEmptyTitle}>Official tracklist incoming</Text><Text style={styles.trackEmptyBody}>Browse this artist on Spotify or Apple Music while the approved titles are collected.</Text><View style={styles.artistMusicActions}>
          <Pressable accessibilityRole="link" accessibilityLabel={`Browse ${artist.name} on Spotify`} onPress={() => Linking.openURL(artist.music!.spotifyUrl).catch(() => {})} style={({pressed}) => [styles.browseButton, styles.spotifyBrowse, pressed && chrome.pressed]}><FontAwesome6 name="spotify" size={15} color={colors.white}/><Text style={styles.browseText}>Spotify</Text></Pressable>
          <Pressable accessibilityRole="link" accessibilityLabel={`Browse ${artist.name} on Apple Music`} onPress={() => Linking.openURL(artist.music!.appleMusicUrl).catch(() => {})} style={({pressed}) => [styles.browseButton, styles.appleBrowse, pressed && chrome.pressed]}><FontAwesome6 name="apple" size={15} color={colors.white}/><Text style={styles.appleBrowseText}>Apple Music</Text></Pressable>
        </View></View>}
      </View> : null}
      {artist.music ? <View style={styles.musicSection}>
        <View style={styles.sectionHeading}><View><Text style={styles.about}>LISTEN BEFORE THE NIGHT</Text><Text style={styles.musicIntro}>Find the frequency.</Text></View><Ionicons name="headset-outline" size={20} color={colors.accentBright}/></View>
        <Pressable accessibilityRole="link" accessibilityLabel={`Open ${artist.name} on Spotify`} onPress={() => Linking.openURL(artist.music!.spotifyUrl).catch(() => {})} style={({pressed}) => [styles.musicRow, pressed && chrome.pressed]}>
          <View style={[styles.musicIcon, styles.spotifyIcon]}><FontAwesome6 name="spotify" size={19} color={colors.white}/></View>
          <View style={styles.musicCopy}><Text style={styles.musicTitle}>Spotify</Text><Text style={styles.musicDetail}>Open the artist profile</Text></View>
          <Ionicons name="open-outline" size={19} color={colors.textMuted}/>
        </Pressable>
        {artist.music.sets.map((item) => <Pressable key={item.url} accessibilityRole="link" accessibilityLabel={`Open ${item.title}`} onPress={() => Linking.openURL(item.url).catch(() => {})} style={({pressed}) => [styles.musicRow, pressed && chrome.pressed]}>
          <View style={styles.musicIcon}><Ionicons name={item.source === 'YouTube' ? 'logo-youtube' : 'cloud-outline'} size={19} color={colors.white}/></View>
          <View style={styles.musicCopy}><Text style={styles.musicTitle}>{item.title}</Text><Text style={styles.musicDetail}>{item.source} · {item.type === 'set' ? 'best set' : 'search results'}</Text></View>
          <Ionicons name="open-outline" size={19} color={colors.textMuted}/>
        </Pressable>)}
      </View> : null}
      <Pressable accessibilityRole="button" onPress={() => router.push('/schedule')} style={styles.schedule}><Text style={styles.scheduleText}>See the full schedule</Text><Ionicons name="arrow-forward" color={colors.textMuted} size={18}/></Pressable>
    </View>
  </FestivalPage>;
}
const styles=StyleSheet.create({
  hero: { minHeight: 450, justifyContent:'space-between', backgroundColor:colors.surfaceRaised },
  top: { flexDirection:'row', justifyContent:'space-between', alignItems:'center', padding:24 },
  circle: { width:44,height:44,borderRadius:22,backgroundColor:'rgba(7,8,12,0.6)',alignItems:'center',justifyContent:'center' },
  topLabel: { color:colors.white,fontSize:10,letterSpacing:2,fontWeight:'600', backgroundColor:'rgba(7,8,12,0.3)', padding:8,borderRadius:8 },
  caption:{ padding:24,gap:8 },
  eyebrow:{color:colors.text,fontSize:10,letterSpacing:2},
  name:{color:colors.text,fontFamily:fonts.display,fontSize:76,lineHeight:80},
  genre:{color:colors.textMuted,fontSize:11,letterSpacing:2},
  body:{padding:24,gap:28},
  setMeta:{flexDirection:'row',gap:16,paddingBottom:24,borderBottomWidth:1,borderBottomColor:colors.outline},
  metaItem:{flex:1,flexDirection:'row',gap:10,alignItems:'center'},
  label:{fontSize:8,color:colors.textMuted,letterSpacing:1.5,marginBottom:6},
  value:{fontSize:12,color:colors.text,fontWeight:'600',fontVariant:['tabular-nums']},
  about:{fontSize:10,letterSpacing:2,color:colors.accentBright},
  bio:{fontSize:15,lineHeight:24,color:colors.textMuted},
  saved:{backgroundColor:colors.surfaceRaised,borderColor:colors.outlineStrong,borderWidth:1},
  musicSection:{gap:12,paddingTop:4},
  sectionHeading:{flexDirection:'row',alignItems:'center',justifyContent:'space-between',paddingBottom:4},
  musicIntro:{fontFamily:fonts.display,fontSize:28,lineHeight:32,color:colors.text,marginTop:5},
  musicRow:{minHeight:68,padding:12,borderRadius:16,backgroundColor:colors.surfaceRaised,borderWidth:1,borderColor:colors.outline,flexDirection:'row',alignItems:'center',gap:12},
  musicIcon:{width:40,height:40,borderRadius:20,backgroundColor:colors.accentSoft,alignItems:'center',justifyContent:'center'},
  spotifyIcon:{backgroundColor:colors.spotifyGreen},
  musicCopy:{flex:1,gap:3},
  musicTitle:{fontSize:14,color:colors.text,fontWeight:'700'},
  musicDetail:{fontSize:11,color:colors.textMuted},
  trackSection:{gap:12,paddingTop:4},
  trackScroller:{height:216},
  trackScrollerContent:{gap:8},
  trackRow:{minHeight:64,padding:10,borderRadius:16,backgroundColor:colors.surfaceRaised,borderWidth:1,borderColor:colors.outline,flexDirection:'row',alignItems:'center',gap:10},
  trackNumber:{width:23,color:colors.textFaint,fontFamily:fonts.display,fontSize:18},
  trackTitle:{flex:1,color:colors.text,fontSize:13,lineHeight:17,fontWeight:'600'},
  platformButton:{width:36,height:36,borderRadius:18,alignItems:'center',justifyContent:'center'},
  spotifyPlatform:{backgroundColor:colors.spotifyGreen},
  applePlatform:{backgroundColor:colors.accent},
  trackEmpty:{padding:16,borderRadius:16,backgroundColor:colors.surfaceRaised,borderWidth:1,borderColor:colors.outline,gap:8},
  trackEmptyTitle:{fontSize:14,color:colors.text,fontWeight:'700'},
  trackEmptyBody:{fontSize:12,lineHeight:18,color:colors.textMuted},
  artistMusicActions:{flexDirection:'row',gap:8,paddingTop:4},
  browseButton:{minHeight:40,paddingHorizontal:14,borderRadius:20,flexDirection:'row',alignItems:'center',justifyContent:'center',gap:8},
  spotifyBrowse:{backgroundColor:colors.spotifyGreen},
  appleBrowse:{backgroundColor:colors.accent},
  browseText:{fontSize:12,color:colors.white,fontWeight:'700'},
  appleBrowseText:{fontSize:12,color:colors.white,fontWeight:'700'},
  schedule:{flexDirection:'row',justifyContent:'center',alignItems:'center',gap:12,minHeight:44},
  scheduleText:{fontSize:13,color:colors.textMuted},
});
