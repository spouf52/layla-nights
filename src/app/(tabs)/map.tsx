import { useState } from 'react';
import { Ionicons } from '@expo/vector-icons';
import { Image } from 'expo-image';
import { Pressable, ScrollView, StyleSheet, Text, View, useWindowDimensions } from 'react-native';
import { colors, layout } from '@/constants/theme';
import { venuePoints, type VenuePoint } from '@/data/festival';
import { Chip } from '@/components/Chip';
import { FestivalPage, PageHeading, TicketButton, chrome } from '@/components/FestivalChrome';

const filters: { id: VenuePoint['category'] | null; label: string }[] = [
  { id: null, label: 'All places' }, { id: 'arrival', label: 'Arrival' }, { id: 'essentials', label: 'Essentials' }, { id: 'hospitality', label: 'Food & drink' },
];
const icons = { entrance: 'log-in-outline', parking: 'car-outline', reception: 'information-circle-outline', 'pool-house': 'restaurant-outline' } as const;
export default function VenueMap() {
  const [filter,setFilter]=useState<VenuePoint['category']|null>(null);
  const [selected,setSelected]=useState<string|null>(null);
  const [zoom,setZoom]=useState(1.5);
  const width=Math.min(useWindowDimensions().width,layout.maxWidth)-layout.pageInset*2;
  const places=venuePoints.filter(p=>!filter||p.category===filter);
  return <FestivalPage>
    <PageHeading eyebrow="THE SOURCE · MARRAKECH" title="FIND YOUR WAY" right={<TicketButton/>}/>
    <View style={styles.mapCard}>
      <ScrollView horizontal nestedScrollEnabled showsHorizontalScrollIndicator={false} contentContainerStyle={{minWidth:width}}>
        <ScrollView nestedScrollEnabled showsVerticalScrollIndicator={false} style={{width:width*zoom,height:350}} contentContainerStyle={{minHeight:350,justifyContent:'center'}}><Image accessibilityLabel="The Source Marrakech venue plan" source={require('../../../assets/maps/venue-reference.png')} contentFit="contain" style={{width:width*zoom,height:width*zoom*1368/2108}}/></ScrollView>
      </ScrollView>
      <View style={styles.controls}><Pressable disabled={zoom>=4} onPress={()=>setZoom(Math.min(4,zoom+0.5))} accessibilityRole="button" accessibilityLabel="Zoom in" style={[styles.zoom,zoom>=4&&{opacity:0.4}]}><Ionicons name="add" size={24} color={colors.text}/></Pressable><Pressable disabled={zoom<=1} onPress={()=>setZoom(Math.max(1,zoom-0.5))} accessibilityRole="button" accessibilityLabel="Zoom out" style={[styles.zoom,zoom<=1&&{opacity:0.4}]}><Ionicons name="remove" size={24} color={colors.text}/></Pressable><Pressable onPress={()=>setZoom(1)} accessibilityRole="button" accessibilityLabel="Fit venue map" style={styles.zoom}><Ionicons name="scan-outline" size={21} color={colors.text}/></Pressable></View>
      <View style={styles.mapTag}><Ionicons name="map-outline" size={14} color={colors.text}/><Text style={styles.mapTagText}>VENUE PLAN</Text></View>
    </View>
    <Text style={chrome.muted}>Explore the venue. Festival zones will be added closer to the event.</Text>
    <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{gap:8}}>{filters.map(f=><Chip key={f.label} label={f.label} active={f.id===filter} onPress={()=>{setFilter(f.id);setSelected(null);}}/>)}</ScrollView>
    <View>{places.map(place=><View key={place.id} style={styles.place}><Pressable accessibilityRole="button" accessibilityState={{expanded:selected===place.id}} onPress={()=>setSelected(selected===place.id?null:place.id)} style={styles.placeButton}><View style={styles.placeIcon}><Ionicons name={icons[place.id as keyof typeof icons]??'location-outline'} size={20} color={colors.accentBright}/></View><Text style={styles.placeName}>{place.label}</Text><Ionicons name={selected===place.id?'chevron-up':'chevron-down'} size={18} color={colors.textMuted}/></Pressable>{selected===place.id?<Text style={styles.description}>{place.blurb}</Text>:null}</View>)}</View>
  </FestivalPage>;
}
const styles=StyleSheet.create({
  mapCard:{height:350,borderRadius:28,overflow:'hidden',backgroundColor:colors.surfaceRaised},
  controls:{position:'absolute',top:16,right:16,gap:8},
  zoom:{width:44,height:44,borderRadius:16,backgroundColor:colors.glass,alignItems:'center',justifyContent:'center'},
  mapTag:{position:'absolute',left:16,bottom:16,flexDirection:'row',gap:8,alignItems:'center',padding:12,borderRadius:20,backgroundColor:colors.glass},
  mapTagText:{fontSize:9,letterSpacing:1.5,color:colors.text},
  place:{borderBottomWidth:1,borderBottomColor:colors.outline},
  placeButton:{minHeight:76,flexDirection:'row',alignItems:'center',gap:16},
  placeIcon:{width:44,height:44,borderRadius:16,backgroundColor:colors.accentSoft,alignItems:'center',justifyContent:'center'},
  placeName:{color:colors.text,fontSize:15,flex:1},
  description:{color:colors.textMuted,fontSize:13,lineHeight:21,paddingBottom:20,paddingLeft:60},
});
