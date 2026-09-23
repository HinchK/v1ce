import React,{useEffect,useState} from "react";
import {ScrollView,StyleSheet,Text,TextInput,TouchableOpacity,View} from "react-native";
import {useRouter} from "expo-router";
import {useAuth} from "@/context/AuthContext";
import {useColors} from "@/hooks/useColors";
import {supabase} from "@/lib/supabase";
import CoinFront,{NUMBER_STYLES,SHAPES} from "@/components/CoinFront";
import {COIN_COLORS,resolveCoinColor} from "@/constants/coin";

const ROTATING_WORDS=["COIN","TOKEN","CHIP","V1CE","JOURNEY","PROGRESS","BAGEL","SHINY CIRCLE","NOT A NICKEL","PIZZA FUND","PET ROCK","DOUBLOON","PAPERWEIGHT","SOUVENIR","OBJECT","THINGY"];
const BORDER_COLORS=["","#0A0A0A","#FFFFFF","#F5A41A"];
const PRESET_COLORS=Object.keys(COIN_COLORS);

export default function Customize(){
 const{profile,setProfile}=useAuth();const c=useColors();const router=useRouter();
 const[wordIndex,setWordIndex]=useState(0);const[color,setColor]=useState(profile?.coin_color||"#F5D680");const[shape,setShape]=useState(profile?.coin_shape||"circle");
 const[style,setStyle]=useState(profile?.number_style||"classic");const[displayName,setDisplayName]=useState(profile?.display_name||"");const[motto,setMotto]=useState(profile?.coin_motto||"");
 const[customShapePath,setCustomShapePath]=useState(profile?.coin_shape_path||"");const[imageOnlyMode,setImageOnlyMode]=useState(profile?.coin_image_only||false);
 const[border,setBorder]=useState(profile?.coin_show_border??true);const[borderColor,setBorderColor]=useState(profile?.coin_border_color||"");const[numberColor,setNumberColor]=useState(profile?.coin_number_color||"");
 const[coinPhoto,setCoinPhoto]=useState(profile?.coin_photo||"");const[saving,setSaving]=useState(false);const[customHex,setCustomHex]=useState(/^#[0-9A-Fa-f]{6}$/.test(profile?.coin_color||"")?profile?.coin_color||"":"");

 useEffect(()=>{const id=setInterval(()=>setWordIndex(v=>(v+1)%ROTATING_WORDS.length),1500);return()=>clearInterval(id)},[]);
 useEffect(()=>{if(!profile)return;setColor(profile.coin_color||"#F5D680");setShape(profile.coin_shape||"circle");setStyle(profile.number_style||"classic");setDisplayName(profile.display_name||"");setMotto(profile.coin_motto||"");setCustomShapePath(profile.coin_shape_path||"");setImageOnlyMode(profile.coin_image_only||false);setBorder(profile.coin_show_border??true);setBorderColor(profile.coin_border_color||"");setNumberColor(profile.coin_number_color||"");setCoinPhoto(profile.coin_photo||"");setCustomHex(/^#[0-9A-Fa-f]{6}$/.test(profile.coin_color||"")?profile.coin_color||"":"")},[profile]);
 const days=profile?.sobriety_date?Math.max(0,Math.floor((Date.now()-new Date(profile.sobriety_date+"T00:00:00").getTime())/86400000)):0;
 const activeColors=resolveCoinColor(color);
