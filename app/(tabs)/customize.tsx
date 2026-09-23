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
 const save=async()=>{if(!profile?.id||saving)return;setSaving(true);const values={coin_shape:shape,coin_color:color,number_style:style,display_name:displayName,coin_motto:motto,coin_shape_path:customShapePath,coin_show_border:border,coin_border_color:borderColor||null,coin_number_color:numberColor||null,coin_image_only:imageOnlyMode,coin_photo:coinPhoto||null};const{data,error}=await supabase.from("profiles").update(values).eq("id",profile.id).select().single();if(!error)setProfile(data||{...profile,...values});setSaving(false)};

 return <ScrollView style={{backgroundColor:c.background}} contentContainerStyle={s.page} keyboardShouldPersistTaps="handled">
  <View style={[s.hero,{borderBottomColor:c.foreground}]}><Text style={[s.heroYour,{color:c.foreground}]}>YOUR</Text><Text style={[s.heroWord,{color:c.foreground}]}>{ROTATING_WORDS[wordIndex]}</Text></View>
  <View style={[s.preview,{borderBottomColor:c.foreground}]}><CoinFront days={days} shape={shape} color={color} numberStyle={style} size={240} displayName={displayName} motto={motto} customShapePath={customShapePath} showBorder={border} coinPhoto={coinPhoto||undefined} borderColor={borderColor||undefined} numberColor={numberColor||undefined} imageOnlyMode={imageOnlyMode}/></View>

  <Section title="SHAPE" c={c}><View style={s.wrap}>{SHAPES.map(item=>{const locked=item!=="circle"&&!profile?.is_premium;return <TouchableOpacity key={item} onPress={()=>locked?router.push("/(tabs)/premium"):setShape(item)} style={[s.option,{borderColor:shape===item?c.foreground:c.border,opacity:locked?.55:1}]}><Text style={{color:c.foreground,fontSize:11,fontWeight:"800",letterSpacing:1}}>{item.toUpperCase()}{locked?" • PREMIUM":""}</Text></TouchableOpacity>})}</View></Section>

  <Section title="COIN PHOTO" c={c}><Text style={[s.body,{color:c.mutedForeground}]}>UPLOAD A PHOTO TO APPEAR ON YOUR COIN FACE</Text><View style={[s.disabled,{borderColor:c.foreground}]}><Text style={{color:c.mutedForeground,fontWeight:"800",letterSpacing:1}}>+ UPLOAD PHOTO</Text></View><Text style={[s.micro,{color:c.mutedForeground}]}>COMING SOON</Text></Section>

  <Section title="IMAGE MODE" c={c}><Text style={[s.body,{color:c.mutedForeground}]}>Show only your photo on the front. Your sober time, name & motto move to the back.</Text><TouchableOpacity onPress={()=>profile?.is_premium?setImageOnlyMode(!imageOnlyMode):router.push("/(tabs)/premium")} style={[s.toggle,{borderColor:c.foreground}]}><Text style={{color:c.foreground,fontWeight:"800",letterSpacing:1}}>IMAGE ONLY: {imageOnlyMode&&profile?.is_premium?"ON":"OFF"}{!profile?.is_premium?" • PREMIUM":""}</Text></TouchableOpacity></Section>

  <Section title="PERSONALIZE" c={c}><Field label="DISPLAY NAME" value={displayName} onChangeText={v=>setDisplayName(v.slice(0,20))} placeholder="Your name or nickname" c={c}/><Field label="PERSONAL MOTTO" value={motto} onChangeText={v=>setMotto(v.slice(0,50))} placeholder="Your personal motto (back of coin)" c={c}/></Section>

  <Section title="COLOR" c={c}><View style={s.wrap}>{PRESET_COLORS.map(name=>{const coin=COIN_COLORS[name as keyof typeof COIN_COLORS];return <TouchableOpacity key={name} onPress={()=>{setColor(name);setCustomHex("")}} style={[s.colorChip,{backgroundColor:coin.bg,borderColor:color===name?c.foreground:c.border}]}><Text style={{color:coin.text,fontSize:10,fontWeight:"900",letterSpacing:1}}>{name.replace("_"," ").toUpperCase()}</Text></TouchableOpacity>})}</View><Text style={[s.micro,{color:c.mutedForeground}]}>CUSTOM HEX</Text><TextInput value={customHex} onChangeText={v=>{const next=v.startsWith("#")?v:"#"+v;setCustomHex(next.slice(0,7));if(/^#[0-9A-Fa-f]{6}$/.test(next))setColor(next.toUpperCase())}} autoCapitalize="characters" maxLength={7} placeholder="#F5D680" placeholderTextColor={c.mutedForeground} style={[s.input,{color:c.foreground,borderColor:c.foreground}]}/></Section>

  <Section title="BORDER" c={c}><TouchableOpacity onPress={()=>setBorder(!border)} style={[s.toggle,{borderColor:c.foreground}]}><Text style={{color:c.foreground,fontWeight:"800",letterSpacing:1}}>BORDER: {border?"ON":"OFF"}</Text></TouchableOpacity>{border&&<><Text style={[s.micro,{color:c.mutedForeground}]}>BORDER COLOR</Text><View style={s.colorRow}>{BORDER_COLORS.map(v=><TouchableOpacity key={v||"auto"} onPress={()=>setBorderColor(v)} style={[s.dot,{backgroundColor:v||activeColors.border,borderColor:c.foreground,opacity:borderColor===v?1:.45}]}/>)}</View></>}</Section>

  <Section title="NUMBER COLOR" c={c}><Text style={[s.body,{color:c.mutedForeground}]}>Leave blank to auto-contrast with coin color</Text><View style={s.colorRow}>{BORDER_COLORS.map(v=><TouchableOpacity key={v||"auto"} onPress={()=>setNumberColor(v)} style={[s.dot,{backgroundColor:v||activeColors.text,borderColor:c.foreground,opacity:numberColor===v?1:.45}]}/>)}</View></Section>

  <Section title="NUMBER STYLE" c={c}><View style={s.wrap}>{Object.keys(NUMBER_STYLES).map(item=><TouchableOpacity key={item} onPress={()=>setStyle(item)} style={[s.option,{borderColor:style===item?c.foreground:c.border}]}><Text style={{color:c.foreground,fontSize:10,fontWeight:"800",letterSpacing:1}}>{item.toUpperCase()}</Text></TouchableOpacity>)}</View></Section>

  <TouchableOpacity onPress={save} disabled={saving} style={[s.save,{backgroundColor:c.foreground,opacity:saving?.45:1}]}><Text style={{color:c.background,fontSize:16,fontWeight:"900",letterSpacing:2}}>{saving?"SAVING...":"SAVE CHANGES →"}</Text></TouchableOpacity>
 </ScrollView>;
}

function Section({title,c,children}:{title:string;c:any;children:React.ReactNode}){return <View style={[s.section,{borderBottomColor:c.foreground}]}><Text style={[s.sectionTitle,{color:c.foreground}]}>{title}</Text><View style={s.sectionBody}>{children}</View></View>}
function Field({label,value,onChangeText,placeholder,c}:{label:string;value:string;onChangeText:(v:string)=>void;placeholder:string;c:any}){return <View style={s.field}><Text style={[s.micro,{color:c.mutedForeground}]}>{label}</Text><TextInput value={value} onChangeText={onChangeText} placeholder={placeholder} placeholderTextColor={c.mutedForeground} style={[s.input,{color:c.foreground,borderColor:c.foreground}]}/></View>}

const s=StyleSheet.create({
 page:{paddingBottom:80},hero:{paddingHorizontal:20,paddingTop:28,paddingBottom:22,borderBottomWidth:2},heroYour:{fontSize:42,lineHeight:40,fontWeight:"900",letterSpacing:-1},heroWord:{fontSize:54,lineHeight:52,fontWeight:"900",letterSpacing:-2},
 preview:{minHeight:330,alignItems:"center",justifyContent:"center",paddingVertical:28,borderBottomWidth:2},section:{paddingHorizontal:20,paddingVertical:28,borderBottomWidth:2},sectionTitle:{fontSize:28,lineHeight:30,fontWeight:"900",letterSpacing:-.5},sectionBody:{marginTop:18},
 body:{fontSize:11,lineHeight:17,letterSpacing:1.2,fontWeight:"600"},micro:{fontSize:9,letterSpacing:2.5,fontWeight:"800",marginBottom:8},wrap:{flexDirection:"row",flexWrap:"wrap",gap:8},option:{borderWidth:2,paddingHorizontal:11,paddingVertical:10},colorChip:{borderWidth:2,paddingHorizontal:12,paddingVertical:11},
 input:{borderWidth:2,paddingHorizontal:12,paddingVertical:11,fontSize:14},disabled:{borderWidth:2,borderStyle:"dashed",minHeight:48,alignItems:"center",justifyContent:"center"},toggle:{minHeight:48,borderWidth:2,alignItems:"center",justifyContent:"center",paddingHorizontal:14},colorRow:{flexDirection:"row",gap:10},dot:{width:38,height:38,borderWidth:2},field:{marginBottom:18},save:{marginHorizontal:20,marginTop:26,height:56,alignItems:"center",justifyContent:"center"}
});
