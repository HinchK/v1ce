import React from "react";
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { useAuth } from "@/context/AuthContext";
import { useColors } from "@/hooks/useColors";

const FEATURES = [["GOLD & BLUE COINS","Unlock the Gold trophy color and Blue prestige color for your coin."],["ALL SHAPES","Hexagon, Octagon, Shield, Diamond, Star, Cross, Badge, Arrow — all yours."],["8 FRIEND SLOTS","Connect with up to 8 people on their sobriety journeys."],["LOUNGE ACCESS","Join the community chat and connect with others in real-time."],["COIN PHOTO","Upload a personal photo to display on your coin face."]];

export default function Premium() {
  const { profile } = useAuth();
  const c = useColors();
  const premium = !!profile?.is_premium;
  return (
    <ScrollView style={{ backgroundColor: c.background }} contentContainerStyle={s.container}>
      <Text style={[s.kicker, { color: c.mutedForeground }]}>V1CE</Text>
      <Text style={[s.title, { color: c.foreground }]}>PREMIUM.</Text>
      <Text style={[s.price, { color: c.gold }]}>LIFETIME ACCESS</Text><Text style={[s.note,{color:c.mutedForeground}]}>ONE-TIME PURCHASE · LIFETIME ACCESS</Text>
      {FEATURES.map(([title,desc], i) => <View key={title} style={[s.feature, { borderBottomColor: c.border }]}><View style={[s.icon, { borderColor: c.foreground }]}><Text style={{ color: c.foreground }}>{i + 1}</Text></View><View style={{flex:1}}><Text style={[s.featureText, { color: c.foreground }]}>{title}</Text><Text style={[s.note,{color:c.mutedForeground,marginTop:4}]}>{desc}</Text></View></View>)}
      <TouchableOpacity disabled={premium} style={[s.button, { backgroundColor: premium ? c.border : c.gold }]}>
        <Text style={{ color: premium ? c.mutedForeground : c.background, fontWeight: "900", letterSpacing: 2 }}>{premium ? "YOU ARE PREMIUM" : "UPGRADE NOW"}</Text>
      </TouchableOpacity>
      {!premium && <Text style={[s.note, { color: c.mutedForeground }]}>Checkout is routed through the native backend integration; Stripe credentials and the original Base44 price configuration remain required for live purchases.</Text>}
    </ScrollView>
  );
}
const s=StyleSheet.create({
 container:{padding:20,paddingTop:55,paddingBottom:80},kicker:{fontSize:12,letterSpacing:5,fontWeight:"700"},title:{fontSize:52,fontWeight:"900",marginBottom:18},price:{fontSize:28,fontWeight:"900",marginBottom:28},
 feature:{minHeight:62,borderBottomWidth:1,flexDirection:"row",alignItems:"center",gap:14},icon:{width:30,height:30,borderWidth:2,alignItems:"center",justifyContent:"center"},featureText:{fontSize:16,fontWeight:"700"},button:{height:58,alignItems:"center",justifyContent:"center",marginTop:28},note:{fontSize:12,lineHeight:18,marginTop:18}
});
