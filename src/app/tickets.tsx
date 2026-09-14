import { useState } from 'react';
import { Ionicons } from '@expo/vector-icons';
import { Image } from 'expo-image';
import { Pressable, StyleSheet, Text, TextInput, View, useWindowDimensions } from 'react-native';
import { useRouter } from 'expo-router';
import QRCode from 'react-native-qrcode-svg';
import { colors, fonts, layout } from '@/constants/theme';
import { FestivalPage, PageHeading, chrome } from '@/components/FestivalChrome';

type MockOrder = { id: string; name: string };
/** Demo display only until the ticketing provider supplies verified orders and QR payloads. */
export default function Tickets() {
  const router=useRouter();
  const [reference,setReference]=useState('');
  const [order,setOrder]=useState<MockOrder|null>(null);
  const width=Math.min(useWindowDimensions().width,layout.maxWidth);
  const lookup=()=>setOrder({id:(reference.trim()||'LAYLA-DEMO-0001').toUpperCase(),name:'Guest Raver'});
  return <FestivalPage contentContainerStyle={{paddingBottom:48}}>
    <Pressable accessibilityRole="button" accessibilityLabel="Go back" onPress={()=>router.canGoBack()?router.back():router.replace('/')} style={styles.back}><Ionicons name="arrow-back" size={23} color={colors.text}/><Text style={styles.backLabel}>Back</Text></Pressable>
    <PageHeading eyebrow="YOUR WAY INTO THE NIGHT" title="MY TICKET"/>
    <View style={styles.ticket}>
      <View style={styles.cover}><Image source={require('../../assets/brand/stellar-cover-v1.png')} contentFit="cover" style={StyleSheet.absoluteFill}/><View style={styles.coverShade}/><Text style={styles.coverEdition}>STELLAR EDITION</Text><Text style={styles.coverTitle}>LAŸLA NIGHTS</Text><Text style={styles.coverDate}>07 NOV 2026 · THE SOURCE MARRAKECH</Text></View>
      <View style={styles.perforation}><View style={styles.notchLeft}/><View style={styles.dashes}/><View style={styles.notchRight}/></View>
      <View style={styles.ticketBody}>
        <View style={styles.previewBadge}><Ionicons name="eye-outline" size={14} color={colors.accentBright}/><Text style={styles.previewLabel}>PREVIEW PASS · NOT VALID FOR ENTRY</Text></View>
        {!order?<View style={{gap:16}}><Text style={styles.label}>Order reference</Text><TextInput accessibilityLabel="Order reference" value={reference} onChangeText={setReference} placeholder="e.g. LAYLA-8F3K2A" placeholderTextColor={colors.textMuted} autoCapitalize="characters" autoCorrect={false} style={styles.input} onSubmitEditing={lookup}/><Pressable accessibilityRole="button" onPress={lookup} style={({pressed})=>[chrome.button,pressed&&chrome.pressed]}><Ionicons name="qr-code-outline" color={colors.white} size={20}/><Text style={chrome.buttonText}>Preview my ticket</Text></Pressable><Text style={styles.note}>Your admission pass will appear here when ticket linking is available.</Text></View>:<View style={{gap:20}}><Text style={styles.guest}>{order.name}</Text><Text selectable style={styles.reference}>{order.id}</Text></View>}
      </View>
      {order?<View style={styles.qr}><QRCode value={`DEMO-NOT-VALID-FOR-ENTRY:${order.id}`} size={Math.min(280,width-80)} backgroundColor={colors.white} color={colors.background}/><Text style={styles.qrLabel}>DEMO · NOT VALID FOR ENTRY</Text></View>:null}
      {order?<Pressable accessibilityRole="button" onPress={()=>setOrder(null)} style={styles.other}><Text style={styles.otherText}>Use another reference</Text><Ionicons name="arrow-forward" size={17} color={colors.text}/></Pressable>:null}
    </View>
    <View style={styles.tip}><Ionicons name="phone-portrait-outline" size={22} color={colors.textMuted}/><Text style={styles.tipText}>When your real ticket is linked, save a screenshot before arriving for a smoother check-in.</Text></View>
  </FestivalPage>;
}
const styles=StyleSheet.create({
  back:{minHeight:44,flexDirection:'row',alignItems:'center',gap:12,alignSelf:'flex-start'},
  backLabel:{color:colors.textMuted,fontSize:14},
  ticket:{borderRadius:28,overflow:'hidden',backgroundColor:colors.surfaceRaised},
  cover:{padding:24,minHeight:188,justifyContent:'flex-end',gap:8},
  coverShade:{...StyleSheet.absoluteFill,backgroundColor:'rgba(7,8,12,0.3)'},
  coverEdition:{color:colors.accentBright,fontSize:10,letterSpacing:2,fontWeight:'600'},
  coverTitle:{color:colors.text,fontFamily:fonts.display,fontSize:44},
  coverDate:{color:colors.text,fontSize:9,letterSpacing:1},
  perforation:{height:24,justifyContent:'center'},
  dashes:{borderTopColor:colors.outline,borderTopWidth:1,borderStyle:'dashed',marginHorizontal:24},
  notchLeft:{position:'absolute',left:-12,width:24,height:24,borderRadius:12,backgroundColor:colors.background},
  notchRight:{position:'absolute',right:-12,width:24,height:24,borderRadius:12,backgroundColor:colors.background},
  ticketBody:{padding:24,gap:24},
  previewBadge:{flexDirection:'row',alignItems:'center',gap:8},
  previewLabel:{fontSize:8,letterSpacing:0.6,color:colors.accentBright,fontWeight:'600',flexShrink:1},
  label:{color:colors.text,fontSize:14,fontWeight:'600'},
  input:{height:54,borderRadius:16,paddingHorizontal:16,color:colors.text,backgroundColor:colors.surface,borderWidth:1,borderColor:colors.outline,fontSize:14},
  note:{color:colors.textMuted,fontSize:12,lineHeight:19},
  guest:{color:colors.text,fontSize:20,fontWeight:'600'},
  reference:{color:colors.textMuted,fontSize:13,letterSpacing:1},
  qr:{backgroundColor:colors.white,paddingVertical:24,alignItems:'center',gap:16},
  qrLabel:{color:colors.background,fontSize:9,letterSpacing:1.5},
  other:{minHeight:64,flexDirection:'row',alignItems:'center',justifyContent:'center',gap:12},
  otherText:{color:colors.text,fontSize:13},
  tip:{flexDirection:'row',gap:16,paddingHorizontal:8,alignItems:'center'},
  tipText:{flex:1,color:colors.textMuted,fontSize:12,lineHeight:20},
});
