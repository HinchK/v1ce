import React,{useState} from "react";
import {Alert,Image,ScrollView,StyleSheet,Text,TextInput,TouchableOpacity,View} from "react-native";
import * as ImagePicker from "expo-image-picker";
import {useRouter} from "expo-router";
import {useAuth} from "@/context/AuthContext";
import {supabase} from "@/lib/supabase";
import {useColors} from "@/hooks/useColors";

export default function Profile(){
 const{profile,user,setProfile,signOut}=useAuth();const c=useColors();const router=useRouter();
 const[name,setName]=useState(profile?.display_name||"");const[avatarUrl,setAvatarUrl]=useState(profile?.avatar_url||"");const[saving,setSaving]=useState(false);const[uploading,setUploading]=useState(false);

 const pickAvatar=async()=>{
  if(!user?.id)return;
  const permission=await ImagePicker.requestMediaLibraryPermissionsAsync();
  if(!permission.granted)return Alert.alert("V1CE","Photo access is required to choose a profile picture.");
  const result=await ImagePicker.launchImageLibraryAsync({mediaTypes:["images"],allowsEditing:true,aspect:[1,1],quality:.85});
  if(result.canceled||!result.assets[0])return;
  setUploading(true);
  try{
   const asset=result.assets[0];const response=await fetch(asset.uri);const body=await response.arrayBuffer();
   const extension=(asset.fileName?.split(".").pop()||asset.mimeType?.split("/").pop()||"jpg").toLowerCase();
   const contentType=asset.mimeType||"image/jpeg";const path=user.id+"/"+Date.now()+"."+extension;
   const{error:uploadError}=await supabase.storage.from("avatars").upload(path,body,{contentType,upsert:false});
   if(uploadError)throw uploadError;
   const{data}=supabase.storage.from("avatars").getPublicUrl(path);const url=data.publicUrl;
   const{data:updated,error}=await supabase.from("profiles").update({avatar_url:url}).eq("id",user.id).select().single();
   if(error)throw error;setAvatarUrl(url);setProfile(updated);
  }catch(error:any){Alert.alert("V1CE",error?.message||"Couldn't upload that photo.");}
  finally{setUploading(false);}
 };

 const removeAvatar=async()=>{
  if(!user?.id)return;setUploading(true);
  const{data:updated,error}=await supabase.from("profiles").update({avatar_url:null}).eq("id",user.id).select().single();
  if(error)Alert.alert("V1CE",error.message);else{setAvatarUrl("");setProfile(updated)}
  setUploading(false);
 };

 const save=async()=>{
  if(!user?.id)return;setSaving(true);
  const{data,error}=await supabase.from("profiles").update({display_name:name.trim()}).eq("id",user.id).select().single();
  if(error)Alert.alert("V1CE",error.message);else{setProfile(data);Alert.alert("V1CE","Profile saved.")}
  setSaving(false);
 };

 return <ScrollView style={{backgroundColor:c.background}} contentContainerStyle={s.container}>
  <Text style={[s.title,{color:c.foreground}]}>YOUR{String.fromCharCode(10)}PROFILE.</Text>
  <View style={s.avatarWrap}>
   {avatarUrl?<Image source={{uri:avatarUrl}} style={s.avatar}/>:<View style={[s.avatar,s.placeholder,{backgroundColor:c.foreground}]}><Text style={{color:c.background,fontSize:28,fontWeight:"900"}}>{(name.trim()||user?.email||"?").split(/\s+/).slice(0,2).map(v=>v[0]).join("").toUpperCase()}</Text></View>}{(profile?.gifted_count||0)>0&&<View style={[s.giftBadge,{backgroundColor:c.gold}]}><Text style={{color:"#0A0A0A",fontWeight:"900"}}>{profile?.gifted_count}</Text></View>}
   <TouchableOpacity disabled={uploading} onPress={pickAvatar}><Text style={[s.avatarAction,{color:c.foreground}]}>{uploading?"UPLOADING...":avatarUrl?"CHANGE PFP":"ADD PFP"}</Text></TouchableOpacity>
   {avatarUrl&&<TouchableOpacity disabled={uploading} onPress={removeAvatar}><Text style={[s.remove,{color:c.mutedForeground}]}>REMOVE PFP</Text></TouchableOpacity>}
  </View>
  <Text style={[s.label,{color:c.mutedForeground}]}>DISPLAY NAME</Text>
  <TextInput value={name} onChangeText={setName} maxLength={20} placeholder="Your name or nickname" placeholderTextColor={c.mutedForeground} style={[s.input,{borderColor:c.foreground,color:c.foreground}]}/>
  <Text style={{color:c.mutedForeground,marginTop:8}}>Name shown on your coin</Text>
  <TouchableOpacity disabled={saving} onPress={save} style={[s.button,{backgroundColor:c.foreground}]}><Text style={{color:c.background,fontWeight:"800"}}>{saving?"SAVING...":"SAVE →"}</Text></TouchableOpacity>
  <View style={[s.account,{borderTopColor:c.border}]}>
   <Text style={{color:c.foreground,fontWeight:"700"}}>{user?.email||profile?.email}</Text>
   <TouchableOpacity style={[s.logout,{borderColor:c.foreground}]} onPress={async()=>{await signOut();router.replace("/onboarding")}}><Text style={{color:c.foreground,fontWeight:"900",letterSpacing:2}}>LOG OUT</Text></TouchableOpacity>
  </View>
 </ScrollView>
}
const s=StyleSheet.create({container:{padding:20,paddingTop:55,paddingBottom:60},title:{fontSize:48,fontWeight:"900",lineHeight:50,marginBottom:40},avatarWrap:{alignItems:"center",marginBottom:34},avatar:{width:112,height:112},giftBadge:{position:"absolute",right:"31%",top:-8,minWidth:30,height:30,paddingHorizontal:8,borderRadius:15,alignItems:"center",justifyContent:"center"},placeholder:{alignItems:"center",justifyContent:"center"},avatarAction:{fontSize:11,fontWeight:"900",letterSpacing:2,marginTop:14},remove:{fontSize:10,fontWeight:"800",letterSpacing:2,marginTop:10},label:{fontSize:10,letterSpacing:3,fontWeight:"800",marginBottom:7},input:{borderWidth:2,padding:13,fontSize:15},button:{height:54,alignItems:"center",justifyContent:"center",marginTop:24},account:{borderTopWidth:2,marginTop:40,paddingTop:24},logout:{height:48,borderWidth:2,alignItems:"center",justifyContent:"center",marginTop:20}});
