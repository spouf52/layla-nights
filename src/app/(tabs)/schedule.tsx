import { useMemo, useState } from 'react';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { colors, fonts } from '@/constants/theme';
import { artistBySlug, sets, stageById } from '@/data/festival';
import { useNow } from '@/lib/demoClock';
import { useFavorites } from '@/lib/favorites';
import { overlaps } from '@/lib/nowPlaying';
import { FestivalPage, PageHeading, TicketButton, chrome } from '@/components/FestivalChrome';
import { SetRow } from '@/components/SetRow';

export default function Schedule() {
  const now = useNow(15000);
  const favs = useFavorites();
  const router = useRouter();
  const [myNight,setMyNight] = useState(false);
  const ordered = useMemo(()=>[...sets].sort((a,b)=>+new Date(a.start)-+new Date(b.start)),[]);
  const mine = ordered.filter(s=>favs.has(s.id));
  const conflict = mine.some((a,i)=>mine.slice(i+1).some(b=>overlaps(a,b)));
  const visible = myNight ? mine : ordered;
  return <FestivalPage>
    <PageHeading eyebrow="EVERY MOMENT COUNTS" title="YOUR NIGHT" right={<TicketButton/>}/>
    <View style={styles.segment}>{[false,true].map(mine=><Pressable key={String(mine)} accessibilityRole="button" accessibilityState={{selected:myNight===mine}} onPress={()=>setMyNight(mine)} style={[styles.segmentButton,myNight===mine&&styles.selected]}><Text style={[styles.segmentLabel,myNight===mine&&{color:colors.text}]}>{mine?`My schedule · ${favs.count}`:'Full schedule'}</Text></Pressable>)}</View>
    <View style={styles.date}><View><Text style={styles.month}>NOVEMBER</Text><Text style={styles.day}>07</Text></View><View style={{gap:8,flex:1}}><Text style={styles.saturday}>Saturday into Sunday</Text><Text style={chrome.muted}>18:00 — 03:00 · Marrakech time</Text></View><Ionicons name="moon-outline" size={24} color={colors.accentBright}/></View>
    {conflict&&myNight?<View style={styles.warning}><Ionicons name="git-compare-outline" color={colors.accentBright} size={20}/><Text style={styles.warningText}>Some of your saved sets overlap. Plan a little time to move between stages.</Text></View>:null}
    <View><View style={styles.listTitle}><Text style={styles.kicker}>{myNight?'YOUR PERSONAL LINE-UP':'FROM THE FIRST BEAT'}</Text><Text style={styles.count}>{visible.length} sets</Text></View>
      {visible.length?visible.map(s=><SetRow key={s.id} set={s} artist={artistBySlug(s.artistSlug)} stage={stageById(s.stageId)} now={now} saved={favs.has(s.id)} onToggleSave={()=>favs.toggle(s.id)}/>):<View style={styles.empty}><Ionicons name="bookmark-outline" size={36} color={colors.accentBright}/><Text style={styles.emptyTitle}>Make the night your own.</Text><Text style={chrome.muted}>Save the artists you don’t want to miss.</Text><Pressable onPress={()=>router.push('/lineup')} style={[chrome.button,{alignSelf:'stretch'}]}><Text style={chrome.buttonText}>Discover the artists</Text></Pressable></View>}
    </View>
    <Text style={styles.note}>Set times are shown in local venue time.{ '\n' }After-midnight sets take place on 8 November.</Text>
  </FestivalPage>;
}
const styles=StyleSheet.create({
  segment:{flexDirection:'row',backgroundColor:colors.surfaceRaised,padding:4,borderRadius:28},
  segmentButton:{flex:1,minHeight:44,borderRadius:24,alignItems:'center',justifyContent:'center'},
  selected:{backgroundColor:colors.surfaceSoft},
  segmentLabel:{fontSize:13,fontWeight:'600',color:colors.textMuted},
  date:{flexDirection:'row',gap:20,alignItems:'center',paddingBottom:24,borderBottomWidth:1,borderBottomColor:colors.outline},
  month:{fontSize:8,letterSpacing:1.5,color:colors.accentBright},
  day:{fontFamily:fonts.display,fontSize:52,lineHeight:54,color:colors.text},
  saturday:{fontSize:15,fontWeight:'600',color:colors.text},
  listTitle:{flexDirection:'row',justifyContent:'space-between',alignItems:'center',marginBottom:20},
  kicker:{color:colors.textMuted,fontSize:9,letterSpacing:1.8},
  count:{color:colors.textMuted,fontSize:12},
  warning:{backgroundColor:colors.accentSoft,padding:16,borderRadius:16,flexDirection:'row',gap:12,alignItems:'center'},
  warningText:{flex:1,color:colors.text,fontSize:12,lineHeight:18},
  empty:{alignItems:'center',gap:16,paddingVertical:24},
  emptyTitle:{color:colors.text,fontSize:21,fontWeight:'600'},
  note:{color:colors.textMuted,fontSize:11,lineHeight:18,textAlign:'center'},
});
