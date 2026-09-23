import React from "react";
import {ScrollView,StyleSheet,Text,View} from "react-native";
import {useColors} from "@/hooks/useColors";

export default function Analytics(){
 const c=useColors();
 return <ScrollView style={{backgroundColor:c.background}} contentContainerStyle={s.container}>
  <Text style={[s.title,{color:c.foreground}]}>COMING{"\n"}SOON.</Text>
  <Text style={[s.subtitle,{color:c.mutedForeground}]}>Advanced analytics and insights are being crafted. Check back soon.</Text>
  <View style={[s.preview,{borderColor:c.foreground}]}>
   <Text style={[s.previewTitle,{color:c.foreground}]}>PROGRESS OVER TIME</Text>
   <View style={s.bars}>{[.2,.35,.3,.55,.45,.7,.62].map((h,i)=><View key={i} style={[s.bar,{height:30+h*70,backgroundColor:c.foreground}]}/>)}</View>
  </View>
 </ScrollView>
}
const s=StyleSheet.create({container:{padding:20,paddingTop:55,paddingBottom:80},title:{fontSize:54,fontWeight:"900",lineHeight:52,letterSpacing:-1},subtitle:{fontSize:14,lineHeight:21,marginTop:18,maxWidth:330},preview:{borderWidth:2,marginTop:36,padding:18,minHeight:190},previewTitle:{fontSize:12,fontWeight:"900",letterSpacing:2},bars:{height:125,flexDirection:"row",alignItems:"flex-end",justifyContent:"space-between",marginTop:18},bar:{width:26}});