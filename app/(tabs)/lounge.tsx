import React,{useState} from "react";
import { ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";
import { useAuth } from "@/context/AuthContext";
import { useColors } from "@/hooks/useColors";
import SnakeGame from "@/components/games/SnakeGame";
import SobrietyRunGame from "@/components/games/SobrietyRunGame";

const MOCK_FRIENDS=["Alex","Jordan","Sam","Riley"];
const MOCK_MESSAGES=[["Alex","31 days!"],["Jordan","keep going"],["Sam","one day at a time"]];

export default function Lounge(){
 const c=useColors(); const {profile}=useAuth(); const [game,setGame]=useState<"snake"|"run"|null>(null); const [message,setMessage]=useState(""); const [messages,setMessages]=useState(MOCK_MESSAGES);
 const send=()=>{if(!message.trim())return;setMessages(x=>[...x,["You",message.trim()]]);setMessage("")};
 return <ScrollView style={{backgroundColor:c.background}} contentContainerStyle={s.container}>
  <Text style={[s.kicker,{color:c.mutedForeground}]}>THE</Text><Text style={[s.title,{color:c.foreground}]}>LOUNGE.</Text>
  <Text style={{color:c.mutedForeground}}>Connect with friends on their sobriety journey.</Text>
  <Text style={[s.section,{color:c.foreground}]}>FRIENDS</Text>
  {MOCK_FRIENDS.map((name,i)=><View key={name} style={[s.friend,{borderColor:c.border}]}><View style={[s.avatar,{backgroundColor:c.foreground}]}><Text style={{color:c.background,fontWeight:"900"}}>{name[0]}</Text></View><Text style={{color:c.foreground,fontWeight:"700"}}>{name}</Text>{!profile?.is_premium&&i>0&&<Text style={{marginLeft:"auto",color:c.mutedForeground}}>LOCKED</Text>}</View>)}
  <Text style={[s.section,{color:c.foreground}]}>GAMES</Text>
  <View style={s.switch}><TouchableOpacity onPress={()=>setGame("snake")} style={[s.tab,{borderColor:c.foreground,backgroundColor:game==="snake"?c.foreground:"transparent"}]}><Text style={{color:game==="snake"?c.background:c.foreground,fontWeight:"800"}}>SKULL SNAKE</Text></TouchableOpacity><TouchableOpacity onPress={()=>setGame("run")} style={[s.tab,{borderColor:c.foreground,backgroundColor:game==="run"?c.foreground:"transparent"}]}><Text style={{color:game==="run"?c.background:c.foreground,fontWeight:"800"}}>SOBRIETY RUN</Text></TouchableOpacity></View>
  {game==="snake"&&<SnakeGame/>}{game==="run"&&<SobrietyRunGame/>}
  <Text style={[s.section,{color:c.foreground}]}>CHAT</Text>
  <View style={[s.chat,{borderColor:c.border}]}>{messages.map(([who,msg],i)=><Text key={i} style={{color:c.foreground,marginBottom:8}}><Text style={{fontWeight:"900"}}>{who}: </Text>{msg}</Text>)}</View>
  <View style={s.composer}><TextInput value={message} onChangeText={setMessage} placeholder="Say something..." placeholderTextColor={c.mutedForeground} style={[s.input,{color:c.foreground,borderColor:c.border}]}/><TouchableOpacity onPress={send} style={[s.send,{backgroundColor:c.foreground}]}><Text style={{color:c.background,fontWeight:"800"}}>SEND</Text></TouchableOpacity></View>
 </ScrollView>
}
const s=StyleSheet.create({container:{padding:20,paddingTop:55,paddingBottom:90},kicker:{fontSize:12,letterSpacing:5,fontWeight:"700"},title:{fontSize:52,fontWeight:"900",lineHeight:54},section:{fontSize:18,fontWeight:"900",letterSpacing:2,marginTop:28,marginBottom:12},friend:{height:52,borderWidth:1,flexDirection:"row",alignItems:"center",padding:8,marginBottom:6,gap:10},avatar:{width:34,height:34,alignItems:"center",justifyContent:"center"},switch:{flexDirection:"row",gap:8},tab:{flex:1,borderWidth:2,padding:12,alignItems:"center"},chat:{borderWidth:1,padding:14,minHeight:100},composer:{flexDirection:"row",gap:8,marginTop:8},input:{flex:1,borderWidth:1,padding:12},send:{paddingHorizontal:16,justifyContent:"center"}});