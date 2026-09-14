import { useState } from 'react';
import { Image } from 'expo-image';
import { StyleSheet, View, type StyleProp, type ViewStyle } from 'react-native';
import Svg, { Defs, LinearGradient, Rect, Stop } from 'react-native-svg';
import type { Artist } from '@/data/festival';
import { PlaceholderArt } from './PlaceholderArt';

const portraits: Record<string, number> = {
  dixon: require('../../assets/artists/dixon.jpg'),
  trikk: require('../../assets/artists/trikk.jpg'),
  nait: require('../../assets/artists/nait.jpg'),
  didiss: require('../../assets/artists/didiss.jpeg'),
  whoskenza: require('../../assets/artists/whoskenza.webp'),
};

/** A legibility scrim; never burns the festival treatment into press photography. */
export function PhotoScrim({ strong = false }: { strong?: boolean }) {
  return <Svg pointerEvents="none" width="100%" height="100%" style={StyleSheet.absoluteFill}>
    <Defs><LinearGradient id="shade" x1="0" y1="0" x2="0" y2="1">
      <Stop offset="0" stopColor="#07080C" stopOpacity={0.04} />
      <Stop offset="0.4" stopColor="#07080C" stopOpacity={0} />
      <Stop offset="1" stopColor="#07080C" stopOpacity={strong ? 1 : 0.92} />
    </LinearGradient></Defs>
    <Rect width="100%" height="100%" fill="url(#shade)" />
  </Svg>;
}

export function ArtistPortrait({ artist, style, shade = false }: { artist: Artist; style?: StyleProp<ViewStyle>; shade?: boolean }) {
  const [failedUri, setFailedUri] = useState<string | null>(null);
  const [failedLocal, setFailedLocal] = useState(false);
  const remote = artist.image && failedUri !== artist.image;
  const source = remote ? { uri: artist.image! } : failedLocal ? undefined : portraits[artist.slug];
  return <View style={[{ overflow: 'hidden', backgroundColor: '#151A23' }, style]}>
    {source ? <Image
      source={source} style={StyleSheet.absoluteFill} contentFit="cover"
      contentPosition={{ top: '25%', left: '50%' }} cachePolicy="memory-disk"
      accessibilityLabel={`${artist.name} portrait`} onError={() => remote ? setFailedUri(artist.image!) : setFailedLocal(true)}
    /> : <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}><PlaceholderArt name={artist.name} accent={artist.accent} size={160} /></View>}
    {shade ? <PhotoScrim /> : null}
  </View>;
}
