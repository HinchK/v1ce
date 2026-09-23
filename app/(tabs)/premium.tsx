import React from "react";
import {ScrollView,StyleSheet,Text,TouchableOpacity,View} from "react-native";
import {useAuth} from "@/context/AuthContext";
import {useColors} from "@/hooks/useColors";

const PERKS=[
 ["GOLD & BLUE COINS","Unlock the Gold trophy color and Blue prestige color for your coin."],
 ["ALL SHAPES","Hexagon, Octagon, Shield, Diamond, Star, Cross, Badge, Arrow — all yours."],
 ["8 FRIEND SLOTS","Connect with up to 8 people on their sobriety journeys."],
 ["LOUNGE ACCESS","Join the community chat and connect with others in real-time."],
 ["COIN PHOTO","Upload a personal photo to display on your coin face."]
];

export default function Premium(){
 const{profile}=useAuth();const c=useColors();const isPremium=!!profile?.is_premium;
 return <ScrollView style={{backgroundColor:c.background}} contentContainerStyle={s.container}>
  <Text style={[s.title,{color:c.foreground}]}>PREMIUM{"\n"}HUB.</Text>
  <Text style={[s.subtitle,{color:c.mutedForeground}]}>Everything unlocked. One upgrade.</Text>
  {isPremium&&<View style={[s.badge,{borderColor:c.foreground}]}><Text style={{color:c.foreground,fontWeight:"900",letterSpacing:2}}>YOU'RE PREMIUM</Text></View>}
  {!isPremium&&<Text style={[s.unlock,{color:c.foreground}]}>UNLOCK PREMIUM →</Text>}
  <Text style={[s.lifetime,{color:c.mutedForeground}]}>One-time purchase · Lifetime access</Text>
  {PERKS.map(([title,desc],i)=><View key={title} style={[s.perk,{borderBottomColor:c.border}]}>
    <View style={[s.num,{borderColor:c.foreground}]}><Text style={{color:c.foreground,fontWeight:"900"}}>{i+1}</Text></View>
    <View style={{flex:1}}><Text style={[s.perkTitle,{color:c.foreground}]}>{title}</Text><Text style={[s.desc,{color:c.mutedForeground}]}>{desc}</Text></View>
  </View>)}
  <TouchableOpacity disabled={isPremium} style={[s.button,{backgroundColor:isPremium?c.border:c.gold}]}><Text style={{color:isPremium?c.mutedForeground:c.background,fontWeight:"900",letterSpacing:2}}>{isPremium?"YOU'RE PREMIUM":"UNLOCK PREMIUM →"}</Text></TouchableOpacity>
 </ScrollView>
}
const s=StyleSheet.create({container:{padding:20,paddingTop:55,paddingBottom:80},title:{fontSize:52,fontWeight:"900",lineHeight:52},subtitle:{fontSize:15,marginTop:16},badge:{borderWidth:2,padding:12,alignSelf:"flex-start",marginTop:24},unlock:{fontSize:18,fontWeight:"900",letterSpacing:2,marginTop:28},lifetime:{fontSize:11,letterSpacing:1.5,marginTop:8},perk:{flexDirection:"row",gap:14,paddingVertical:18,borderBottomWidth:1},num:{width:30,height:30,borderWidth:2,alignItems:"center",justifyContent:"center"},perkTitle:{fontSize:15,fontWeight:"900",letterSpacing:1},desc:{fontSize:12,lineHeight:18,marginTop:4},button:{height:56,alignItems:"center",justifyContent:"center",marginTop:28}});