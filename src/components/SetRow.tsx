import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { colors, fonts } from '@/constants/theme';
import { formatTime, type Artist, type Set, type Stage } from '@/data/festival';
import { statusOf } from '@/lib/nowPlaying';
import { LivePill } from './LivePill';
import { ArtistPortrait } from './ArtistPortrait';

export function SetRow({ set, artist, stage, now, saved, onToggleSave }: {
  set: Set; artist?: Artist; stage?: Stage; now: Date; saved: boolean; index?: number; onToggleSave: () => void;
}) {
  const router = useRouter();
  const status = statusOf(set, now);
  return <View style={[styles.row, status === 'done' && { opacity: 0.6 }]}>
    <View style={styles.timeColumn}><Text style={styles.time}>{formatTime(set.start)}</Text><Text style={styles.end}>{formatTime(set.end)}</Text><View style={styles.line}/></View>
    <View style={[styles.card, status === 'live' && { borderColor: colors.outlineStrong }]}>
      <Pressable accessibilityRole="button" accessibilityLabel={`View ${artist?.name ?? set.artistSlug}`} onPress={() => router.push(`/artist/${set.artistSlug}`)} style={styles.artist}>
        {artist ? <ArtistPortrait artist={artist} style={styles.portrait}/> : null}
        <View style={styles.meta}><Text style={styles.name} numberOfLines={1} adjustsFontSizeToFit>{artist?.name ?? set.artistSlug}</Text><View style={styles.stageRow}><View style={[styles.dot, { backgroundColor: stage?.color ?? colors.accent }]}/><Text style={styles.stage}>{stage?.name.replace(' STAGE', '').replace(' ROOM', '')}</Text></View>{status === 'live' ? <LivePill/> : null}</View>
      </Pressable>
      <Pressable accessibilityRole="button" accessibilityState={{ selected: saved }} accessibilityLabel={saved ? `Remove ${artist?.name} from schedule` : `Save ${artist?.name}`} onPress={onToggleSave} style={({pressed})=>[styles.save,saved&&styles.saved,pressed&&{opacity:0.65}]}><Ionicons name={saved?'bookmark':'bookmark-outline'} size={18} color={saved?colors.white:colors.textMuted}/></Pressable>
    </View>
  </View>;
}
const styles=StyleSheet.create({
  row:{flexDirection:'row',gap:12,minHeight:112},
  timeColumn:{width:44,alignItems:'center',paddingTop:16},
  time:{fontSize:13,fontWeight:'600',color:colors.text,fontVariant:['tabular-nums']},
  end:{fontSize:10,color:colors.textMuted,marginTop:6,fontVariant:['tabular-nums']},
  line:{width:1,backgroundColor:colors.outline,flex:1,marginTop:12},
  card:{flex:1,flexDirection:'row',alignItems:'center',gap:8,padding:12,marginBottom:12,backgroundColor:colors.surface,borderRadius:20,borderWidth:1,borderColor:colors.outline},
  artist:{flex:1,flexDirection:'row',alignItems:'center',gap:12},
  portrait:{width:52,height:64,borderRadius:12},
  meta:{flex:1,gap:6},
  name:{color:colors.text,fontFamily:fonts.display,fontSize:26},
  stageRow:{flexDirection:'row',gap:5,alignItems:'center'},
  dot:{width:5,height:5,borderRadius:3},
  stage:{color:colors.textMuted,fontSize:9,letterSpacing:1},
  save:{width:44,height:44,borderRadius:22,alignItems:'center',justifyContent:'center'},
  saved:{backgroundColor:colors.accent},
});
