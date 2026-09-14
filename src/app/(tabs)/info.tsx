import { useState } from 'react';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { colors, fonts } from '@/constants/theme';
import { faq } from '@/data/festival';
import { DEMO_PRESETS, getDemoISO, isDemoMode, setDemoTime, useNow } from '@/lib/demoClock';
import { useFavorites } from '@/lib/favorites';
import { Chip } from '@/components/Chip';
import { FestivalPage, PageHeading, TicketButton, chrome } from '@/components/FestivalChrome';

export default function Info() {
  const [open,setOpen]=useState<string|null>(null);
  const [settings,setSettings]=useState(false);
  const router=useRouter();
  const favs=useFavorites();
  useNow(30000);
  const questions=faq.filter(f=>!f.pinned);
  return <FestivalPage>
    <PageHeading eyebrow="ALL YOU NEED FOR THE NIGHT" title="THE ESSENTIALS" right={<TicketButton/>}/>
    <View style={styles.pass}><Text style={styles.star}>✦</Text><Text style={styles.passTitle}>YOU BELONG HERE.</Text><Text style={chrome.muted}>Your guide to LAŸLA NIGHTS.</Text><View style={styles.stats}><View><Text style={styles.statValue}>{String(favs.count).padStart(2,'0')}</Text><Text style={styles.statLabel}>SAVED SETS</Text></View><View><Text style={styles.statValue}>03</Text><Text style={styles.statLabel}>STAGES</Text></View><View><Text style={styles.statValue}>01</Text><Text style={styles.statLabel}>UNFORGETTABLE NIGHT</Text></View></View></View>
    <Pressable accessibilityRole="button" onPress={()=>router.push('/map')} style={({pressed})=>[styles.safety,pressed&&chrome.pressed]}><Ionicons name="medical-outline" size={24} color={colors.accentBright}/><View style={{flex:1,gap:6}}><Text style={styles.safetyTitle}>Look after each other.</Text><Text style={styles.safetyBody}>Need help? Find a crew member or head to reception.</Text></View><Ionicons name="arrow-forward" size={20} color={colors.accentBright}/></Pressable>
    <View style={styles.links}>{[{label:'My ticket',icon:'ticket-outline' as const,path:'/tickets' as const},{label:'My schedule',icon:'bookmark-outline' as const,path:'/schedule' as const},{label:'Getting to the venue',icon:'navigate-outline' as const,path:'/map' as const}].map(item=><Pressable key={item.label} onPress={()=>router.push(item.path)} accessibilityRole="button" style={({pressed})=>[styles.link,pressed&&chrome.pressed]}><Ionicons name={item.icon} size={20} color={colors.text}/><Text style={styles.linkText}>{item.label}</Text><Ionicons name="chevron-forward" size={17} color={colors.textMuted}/></Pressable>)}</View>
    <View><Text style={styles.sectionTitle}>Good to know</Text>{questions.map(f=><View key={f.question} style={styles.faq}><Pressable onPress={()=>setOpen(open===f.question?null:f.question)} accessibilityRole="button" accessibilityState={{expanded:open===f.question}} style={styles.question}><Text style={styles.q}>{f.question}</Text><Ionicons name={open===f.question?'remove':'add'} size={21} color={open===f.question?colors.accentBright:colors.textMuted}/></Pressable>{open===f.question?<Text style={styles.answer}>{f.answer}</Text>:null}</View>)}</View>
    {__DEV__?<View><Pressable accessibilityRole="button" accessibilityState={{expanded:settings}} onPress={()=>setSettings(!settings)} style={styles.link}><Ionicons name="options-outline" size={20} color={colors.textMuted}/><Text style={styles.linkText}>Preview settings</Text><Ionicons name={settings?'chevron-up':'chevron-down'} size={17} color={colors.textMuted}/></Pressable>{settings?<View style={styles.settings}><Text style={chrome.muted}>Preview the event-day experience.</Text><View style={styles.chips}><Chip label="Device time" active={!isDemoMode()} onPress={()=>setDemoTime(null)}/>{DEMO_PRESETS.map(p=><Chip key={p.label} label={p.label} active={getDemoISO()===p.iso} onPress={()=>setDemoTime(p.iso)}/>)}</View></View>:null}</View>:null}
    <Text style={styles.footer}>LAŸLA NIGHTS · STELLAR EDITION{ '\n' }07 NOVEMBER 2026 · THE SOURCE MARRAKECH</Text>
  </FestivalPage>;
}
const styles=StyleSheet.create({
  pass:{backgroundColor:colors.surface,padding:24,borderRadius:28,gap:8,borderWidth:1,borderColor:colors.outline},
  star:{color:colors.accentBright,fontSize:36},
  passTitle:{color:colors.text,fontFamily:fonts.display,fontSize:36},
  stats:{flexDirection:'row',justifyContent:'space-between',gap:12,marginTop:20,paddingTop:20,borderTopWidth:1,borderTopColor:colors.outline},
  statValue:{color:colors.text,fontFamily:fonts.display,fontSize:32},
  statLabel:{color:colors.textMuted,fontSize:7,letterSpacing:0.7,marginTop:4},
  safety:{flexDirection:'row',gap:16,padding:20,alignItems:'center',backgroundColor:colors.accentSoft,borderRadius:24},
  safetyTitle:{color:colors.text,fontSize:15,fontWeight:'600'},
  safetyBody:{color:colors.textMuted,fontSize:12,lineHeight:18},
  links:{borderTopWidth:1,borderTopColor:colors.outline},
  link:{minHeight:64,flexDirection:'row',alignItems:'center',gap:16,borderBottomWidth:1,borderBottomColor:colors.outline},
  linkText:{flex:1,color:colors.text,fontSize:14},
  sectionTitle:{color:colors.text,fontSize:22,fontWeight:'600',marginBottom:12},
  faq:{borderBottomWidth:1,borderBottomColor:colors.outline},
  question:{flexDirection:'row',alignItems:'center',gap:16,paddingVertical:20,minHeight:64},
  q:{flex:1,color:colors.text,fontSize:14,lineHeight:20},
  answer:{color:colors.textMuted,fontSize:13,lineHeight:21,paddingBottom:20,paddingRight:20},
  settings:{gap:16,paddingVertical:20},
  chips:{flexDirection:'row',gap:8,flexWrap:'wrap'},
  footer:{color:colors.textMuted,textAlign:'center',fontSize:9,letterSpacing:1.2,lineHeight:20},
});
