import React,{useCallback,useEffect,useMemo,useState} from "react";
import {Alert,ScrollView,StyleSheet,Text,View} from "react-native";
import {useAuth} from "@/context/AuthContext";
import {supabase} from "@/lib/supabase";
import {useColors} from "@/hooks/useColors";

const MILESTONES=[1,7,30,60,90,180,365,730];

export default function Analytics(){
 const{user,profile}=useAuth();const c=useColors();const[checkIns,setCheckIns]=useState<string[]>([]);const[loading,setLoading]=useState(true);
 const days=useMemo(()=>profile?.sobriety_date?Math.max(0,Math.floor((Date.now()-new Date(profile.sobriety_date+"T00:00:00").getTime())/86400000)):0,[profile]);
 const load=useCallback(async()=>{if(!user?.id){setLoading(false);return}setLoading(true);const{data,error}=await supabase.from("check_ins").select("check_in_date").eq("user_id",user.id).order("check_in_date",{ascending:true});if(error)Alert.alert("V1CE",error.message);else setCheckIns((data||[]).map(x=>x.check_in_date));setLoading(false)},[user?.id]);
 useEffect(()=>{load()},[load]);

 const week=useMemo(()=>{
  const result=Array(7).fill(0);const now=new Date();now.setHours(0,0,0,0);
  for(const value of checkIns){const d=new Date(value+"T00:00:00");const diff=Math.round((now.getTime()-d.getTime())/86400000);if(diff>=0&&diff<7){const day=d.getDay();result[day===0?6:day-1]+=1}}
  return result;
 },[checkIns]);

 const longest=useMemo(()=>{
  if(!checkIns.length)return days;
  const dates=[...new Set(checkIns)].sort();let best=1,current=1;
  for(let i=1;i<dates.length;i++){const a=new Date(dates[i-1]+"T00:00:00").getTime();const b=new Date(dates[i]+"T00:00:00").getTime();if(Math.round((b-a)/86400000)===1){current++;best=Math.max(best,current)}else current=1}
  return Math.max(best,days);
 },[checkIns,days]);

 const milestones=MILESTONES.filter(x=>days>=x).length;const max=Math.max(1,...week);
 return <ScrollView style={{backgroundColor:c.background}} contentContainerStyle={s.container}>
  <Text style={[s.kicker,{color:c.mutedForeground}]}>YOUR</Text><Text style={[s.title,{color:c.foreground}]}>STATS.</Text>
  <View style={s.chart}>{week.map((v,i)=><View key={i} style={s.barWrap}><View style={[s.bar,{height:28+(v/max)*92,backgroundColor:v?c.gold:c.border}]}/><Text style={[s.day,{color:c.mutedForeground}]}>{["M","T","W","T","F","S","S"][i]}</Text></View>)}</View>
  <View style={s.grid}>
   <Stat label="LONGEST STREAK" value={longest ? String(longest)+"d" : "—"} c={c}/>
   <Stat label="TOTAL CHECK-INS" value={loading?"—":checkIns.length} c={c}/>
   <Stat label="THIS WEEK" value={week.reduce((a,b)=>a+b,0)} c={c}/>
   <Stat label="MILESTONES" value={milestones} c={c}/>
  </View>
  <Text style={[s.note,{color:c.mutedForeground}]}>Check-ins are recorded from your V1CE sobriety history.</Text>
 </ScrollView>
}
function Stat({label,value,c}:{label:string;value:string|number;c:any}){return <View style={[s.card,{borderColor:c.border}]}><Text style={[s.label,{color:c.mutedForeground}]}>{label}</Text><Text style={[s.value,{color:c.foreground}]}>{value}</Text></View>}
const s=StyleSheet.create({container:{padding:20,paddingTop:55,paddingBottom:80},kicker:{fontSize:12,letterSpacing:5,fontWeight:"700"},title:{fontSize:52,fontWeight:"900",lineHeight:54,marginBottom:24},chart:{height:150,borderBottomWidth:2,borderBottomColor:"#888",flexDirection:"row",alignItems:"flex-end",justifyContent:"space-around",paddingHorizontal:8},barWrap:{height:145,alignItems:"center",justifyContent:"flex-end",gap:6},bar:{width:28,minHeight:4},day:{fontSize:9,letterSpacing:2,fontWeight:"700"},grid:{flexDirection:"row",flexWrap:"wrap",gap:10,marginTop:24},card:{width:"48%",borderWidth:2,padding:16,minHeight:105},label:{fontSize:9,letterSpacing:1.5,fontWeight:"700"},value:{fontSize:28,fontWeight:"900",marginTop:12},note:{fontSize:12,lineHeight:18,marginTop:24}});
