import React,{useState} from "react";
import {ScrollView,StyleSheet,Text,TouchableOpacity,View} from "react-native";
import {useAuth} from "@/context/AuthContext";
import {useColors} from "@/hooks/useColors";
import CoinFront from "@/components/CoinFront";

export default function Widget(){
 const{profile}=useAuth();const c=useColors();const[preview,setPreview]=useState(true);
 const days=profile?.sobriety_date?Math.max(0,Math.floor((Date.now()-new Date(profile.sobriety_date+"T00:00:00").getTime())/86400000)):0;
 if(!profile)return <View style={[s.empty,{backgroundColor:c.background}]}><Text style={[s.emptyTitle,{color:c.foreground}]}>No Profile Yet</Text><Text style={[s.note,{color:c.mutedForeground}]}>Set your sobriety date on the Home page first.</Text></View>;
 return <ScrollView style={{backgroundColor:c.background}} contentContainerStyle={s.page}>
  <Text style={[s.title,{color:c.foreground}]}>YOUR{"\n"}WIDGET.</Text>
  <Text style={[s.subtitle,{color:c.mutedForeground}]}>Share & Install</Text>
  <Text style={[s.note,{color:c.mutedForeground}]}>Get V1CE on your home screen and share your coin.</Text>
  <TouchableOpacity style={[s.action,{backgroundColor:c.foreground}]}><Text style={{color:c.background,fontWeight:"900",letterSpacing:2}}>INSTALL APP</Text></TouchableOpacity>
  <TouchableOpacity style={[s.outline,{borderColor:c.foreground}]}><Text style={{color:c.foreground,fontWeight:"900",letterSpacing:2}}>WIDGET LINK</Text></TouchableOpacity>
  <TouchableOpacity onPress={()=>setPreview(v=>!v)} style={[s.outline,{borderColor:c.foreground}]}><Text style={{color:c.foreground,fontWeight:"900",letterSpacing:2}}>{preview?"Hide Preview":"Show Preview"}</Text></TouchableOpacity>
  {preview&&<View style={[s.preview,{borderColor:c.foreground}]}><CoinFront days={days} shape={profile.coin_shape||"circle"} color={profile.coin_color||"gold"} numberStyle={profile.number_style||"classic"} size={190} displayName={profile.display_name||""} showBorder={profile.coin_show_border??true} coinPhoto={profile.coin_photo||undefined} imageOnlyMode={profile.coin_image_only||false}/></View>}
 </ScrollView>
}
const s=StyleSheet.create({page:{padding:20,paddingTop:55,paddingBottom:80},title:{fontSize:52,fontWeight:"900",lineHeight:52},subtitle:{fontSize:18,fontWeight:"900",marginTop:24},note:{fontSize:13,lineHeight:19,marginTop:8},action:{height:54,alignItems:"center",justifyContent:"center",marginTop:24},outline:{height:54,borderWidth:2,alignItems:"center",justifyContent:"center",marginTop:10},preview:{borderWidth:2,alignItems:"center",justifyContent:"center",paddingVertical:26,marginTop:18},empty:{flex:1,alignItems:"center",justifyContent:"center",padding:30},emptyTitle:{fontSize:28,fontWeight:"900"},});