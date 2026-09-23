import React from "react";
import {ScrollView,StyleSheet,Text,View} from "react-native";
import {useAuth} from "@/context/AuthContext";
import {useColors} from "@/hooks/useColors";
import CoinFront from "@/components/CoinFront";

export default function Widget(){
 const {profile}=useAuth(); const c=useColors();
 const days=profile?.sobriety_date?Math.max(0,Math.floor((Date.now()-new Date(profile.sobriety_date+"T00:00:00").getTime())/86400000)):0;
 return <ScrollView style={{backgroundColor:c.background}} contentContainerStyle={s.page}>
  <Text style={[s.kicker,{color:c.mutedForeground}]}>V1CE</Text>
  <Text style={[s.title,{color:c.foreground}]}>YOUR WIDGET.</Text>
  <View style={[s.card,{borderColor:c.foreground}]}>
   <CoinFront days={days} shape={profile?.coin_shape||"circle"} color={profile?.coin_color||"gold"} numberStyle={profile?.number_style||"classic"} size={190} displayName={profile?.display_name||""} showBorder={profile?.coin_show_border??true} coinPhoto={profile?.coin_photo||undefined} imageOnlyMode={profile?.coin_image_only||false}/>
   <Text style={[s.days,{color:c.foreground}]}>{days} DAYS</Text>
   <Text style={[s.note,{color:c.mutedForeground}]}>A compact V1CE display for sharing your progress.</Text>
  </View>
 </ScrollView>
}
const s=StyleSheet.create({page:{padding:20,paddingTop:55,paddingBottom:80},kicker:{fontSize:11,letterSpacing:5,fontWeight:"800"},title:{fontSize:44,fontWeight:"900",marginBottom:25},card:{alignItems:"center",borderWidth:2,paddingVertical:30,paddingHorizontal:20},days:{fontSize:26,fontWeight:"900",letterSpacing:2,marginTop:12},note:{fontSize:11,textAlign:"center",marginTop:10,lineHeight:17}});
