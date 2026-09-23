import React,{useEffect,useState} from "react";
import {Alert,ScrollView,StyleSheet,Text,TextInput,TouchableOpacity,View} from "react-native";
import {useAuth} from "@/context/AuthContext";
import {supabase} from "@/lib/supabase";
import {useColors} from "@/hooks/useColors";

type Friend={id:string;requester_id:string;recipient_id:string;status:"pending"|"accepted"|"declined"|"blocked";created_at:string;is_active_in_lounge?:boolean;requester_name:string|null;requester_avatar:string|null;recipient_name:string|null;recipient_avatar:string|null};

export default function Friends(){
 const{user}=useAuth();const c=useColors();const[email,setEmail]=useState("");const[friends,setFriends]=useState<Friend[]>([]);const[pending,setPending]=useState<Friend[]>([]);const[blocked,setBlocked]=useState<any[]>([]);
 const load=async()=>{
  if(!user?.id)return;
  const [{data,error},{data:blocks,error:blockError}]=await Promise.all([
   supabase.rpc("get_my_friend_connections"),
   supabase.from("blocked_users").select("id,blocked_id").eq("blocker_id",user.id)
  ]);
  if(error)Alert.alert("V1CE",error.message);
  if(blockError)Alert.alert("V1CE",blockError.message);
  const rows=(data||[]) as Friend[];
  setFriends(rows.filter(f=>f.status==="accepted"));
  setPending(rows.filter(f=>f.status==="pending"&&f.recipient_id===user.id));
  setBlocked(blocks||[]);
 };
 useEffect(()=>{load()},[user?.id]);

 const send=async()=>{
  if(!user?.id||!email.trim())return;
  const target=email.trim().toLowerCase();
  const{data:targetProfile,error:lookupError}=await supabase.rpc("find_profile_by_email",{target_email:target});
  if(lookupError)return Alert.alert("V1CE",lookupError.message);
  if(!targetProfile?.length)return Alert.alert("V1CE","No V1CE profile found for that email.");
  const targetId=targetProfile[0].id;
  if(targetId===user.id)return Alert.alert("V1CE","You can't add yourself.");
  const{error}=await supabase.from("friend_connections").insert({requester_id:user.id,recipient_id:targetId,status:"pending"});
  if(error)Alert.alert("V1CE",error.message);
  else{setEmail("");Alert.alert("V1CE","Friend request sent!");load()}
 };

 const action=async(id:string,status:"accepted"|"declined")=>{
  const{error}=await supabase.from("friend_connections").update({status}).eq("id",id);
  if(error)Alert.alert("V1CE",error.message);load();
 };
 const remove=async(id:string)=>{const{error}=await supabase.from("friend_connections").delete().eq("id",id);if(error)Alert.alert("V1CE",error.message);load()};
 const block=async(id:string)=>{const friend=friends.find(f=>f.id===id);if(!friend||!user?.id)return;const blockedId=friend.requester_id===user.id?friend.recipient_id:friend.requester_id;const{error}=await supabase.from("blocked_users").insert({blocker_id:user.id,blocked_id:blockedId});if(error)Alert.alert("V1CE",error.message);else{await supabase.from("friend_connections").delete().eq("id",id);load()}};
 const unblock=async(id:string)=>{const{error}=await supabase.from("blocked_users").delete().eq("id",id);if(error)Alert.alert("V1CE",error.message);load()};

 const friendName=(f:Friend)=>f.requester_id===user?.id?(f.recipient_name||"Friend"):(f.requester_name||"Friend");
 const activeCount=friends.filter(f=>(f as any).is_active_in_lounge).length;
 const toggleLounge=async(id:string,current:boolean)=>{if(!current&&activeCount>=8){return Alert.alert("V1CE","You can have up to 8 friends active in the lounge.");}const{error}=await supabase.from("friend_connections").update({is_active_in_lounge:!current}).eq("id",id);if(error)Alert.alert("V1CE",error.message);else load()};
 const pendingName=(f:Friend)=>f.requester_name||"Friend";

 return <ScrollView style={{backgroundColor:c.background}} contentContainerStyle={s.container}>
  <Text style={[s.title,{color:c.foreground}]}>FRIENDS.</Text>
  <Text style={{color:c.mutedForeground}}>Connect with people on their sobriety journey.</Text>
  <View style={s.row}><TextInput value={email} onChangeText={setEmail} autoCapitalize="none" keyboardType="email-address" placeholder="Enter email" placeholderTextColor={c.mutedForeground} style={[s.input,{borderColor:c.foreground,color:c.foreground}]}/><TouchableOpacity onPress={send} style={[s.send,{backgroundColor:c.foreground}]}><Text style={{color:c.background,fontWeight:"800"}}>SEND</Text></TouchableOpacity></View>
  <Text style={[s.heading,{color:c.foreground}]}>YOUR FRIENDS</Text>
  {friends.length===0?<Text style={{color:c.mutedForeground}}>No friends yet.</Text>:friends.map(f=><View key={f.id} style={[s.card,{borderColor:c.border}]}><Text style={{color:c.foreground,fontWeight:"700"}}>{friendName(f)}</Text><View style={s.actions}><TouchableOpacity onPress={()=>toggleLounge(f.id,!!(f as any).is_active_in_lounge)}><Text style={{color:c.foreground,fontWeight:"800"}}>{(f as any).is_active_in_lounge?"LOUNGE ON":"LOUNGE"}</Text></TouchableOpacity><TouchableOpacity onPress={()=>remove(f.id)}><Text style={{color:c.mutedForeground}}>REMOVE</Text></TouchableOpacity><TouchableOpacity onPress={()=>block(f.id)}><Text style={{color:c.mutedForeground}}>BLOCK</Text></TouchableOpacity></View></View>)}
  <Text style={[s.heading,{color:c.foreground}]}>PENDING REQUESTS</Text>
  {pending.length===0?<Text style={{color:c.mutedForeground}}>No pending requests</Text>:pending.map(f=><View key={f.id} style={[s.card,{borderColor:c.border}]}><Text style={{color:c.foreground}}>{pendingName(f)}</Text><View style={s.actions}><TouchableOpacity onPress={()=>action(f.id,"accepted")}><Text style={{color:c.foreground,fontWeight:"800"}}>ACCEPT</Text></TouchableOpacity><TouchableOpacity onPress={()=>action(f.id,"declined")}><Text style={{color:c.mutedForeground}}>REJECT</Text></TouchableOpacity></View></View>)}
  <Text style={[s.heading,{color:c.foreground}]}>BLOCKED USERS</Text>
  {blocked.length===0?<Text style={{color:c.mutedForeground}}>No blocked users</Text>:blocked.map((b:any)=><View key={b.id} style={[s.card,{borderColor:c.border}]}><Text style={{color:c.foreground}}>BLOCKED USER</Text><TouchableOpacity onPress={()=>unblock(b.id)}><Text style={{color:c.mutedForeground}}>UNBLOCK</Text></TouchableOpacity></View>)}
 </ScrollView>
}

const s=StyleSheet.create({container:{padding:20,paddingTop:55,paddingBottom:60},title:{fontSize:48,fontWeight:"900"},row:{flexDirection:"row",gap:8,marginTop:28},input:{flex:1,borderWidth:2,padding:12,fontSize:14},send:{paddingHorizontal:18,justifyContent:"center"},heading:{fontSize:22,fontWeight:"900",letterSpacing:2,marginTop:34,marginBottom:12},card:{borderWidth:2,padding:16,marginBottom:10,flexDirection:"row",justifyContent:"space-between",alignItems:"center"},actions:{flexDirection:"row",gap:18}});
