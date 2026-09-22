import React,{useEffect,useMemo,useState} from "react";
import {Alert,ScrollView,StyleSheet,Text,TouchableOpacity,View} from "react-native";
import {useRouter} from "expo-router";
import {useAuth} from "@/context/AuthContext";
import {useColors} from "@/hooks/useColors";
import {supabase} from "@/lib/supabase";
import CoinFront from "@/components/CoinFront";

const WORDS=["SOBER","UNBOTHERED","HYDRATED","EMPLOYABLE","ASCENDING","CRAZY","SLAYING","FEELING","EXPERIENCING","SHOWING UP","CAFFEINATED","UNHINGED","VALID","VIBING","GRATEFUL","GAY","PROUD","CLEAN","HAPPY","RICH","LOVED"];
const TIME_LABELS=["DAYS SOBER","CLEAN TIME","SOBER TIME","DAYS FREE"];
const SUBSTANCES=["Alcohol","Cannabis","Cocaine","Opioids","Meth","Benzodiazepines","Nicotine","Sugar","Gambling","Other"];
const MILESTONES=[
  {days:1,label:"1 DAY"},{days:7,label:"1 WEEK"},{days:30,label:"1 MONTH"},
  {days:60,label:"2 MONTHS"},{days:90,label:"90 DAYS"},{days:180,label:"6 MONTHS"},
  {days:365,label:"1 YEAR"},{days:730,label:"2 YEARS"},
];

function elapsed(start:string){
  const ms=Math.max(0,Date.now()-new Date(start+"T00:00:00").getTime());
  return {
    days:Math.floor(ms/86400000),
    hours:Math.floor(ms/3600000)%24,
    minutes:Math.floor(ms/60000)%60,
    seconds:Math.floor(ms/1000)%60
  };
}

export default function Home(){
  const{profile,setProfile}=useAuth();
  const c=useColors();
  const router=useRouter();
  const[now,setNow]=useState(Date.now());
  const[savingSubstances,setSavingSubstances]=useState(false);

  useEffect(()=>{
    const id=setInterval(()=>setNow(Date.now()),1000);
    return()=>clearInterval(id);
  },[]);

  const time=useMemo(
    ()=>profile?elapsed(profile.sobriety_date):{days:0,hours:0,minutes:0,seconds:0},
    [profile,now]
  );

  const rotatingWord=WORDS[Math.floor(now/1500)%WORDS.length];
  const rotatingLabel=TIME_LABELS[Math.floor(now/2500)%TIME_LABELS.length];

  const toggleSubstance=async(substance:string)=>{
    if(!profile||savingSubstances)return;
    const next=profile.substances.includes(substance)
      ? profile.substances.filter((item)=>item!==substance)
      : [...profile.substances,substance];

    setProfile({...profile,substances:next});
    setSavingSubstances(true);
    const{error}=await supabase
      .from("SobrietyProfile")
      .update({substances:next})
      .eq("email",profile.email);
    setSavingSubstances(false);

    if(error){
      setProfile({...profile,substances:profile.substances});
      Alert.alert("Couldn't save","Your substance selections weren't saved. Please try again.");
    }
  };

  return(
    <ScrollView
      style={{backgroundColor:c.background}}
      contentContainerStyle={s.container}
      showsVerticalScrollIndicator={false}
    >
      <View style={s.header}>
        <Text style={[s.kicker,{color:c.mutedForeground}]}>YOUR</Text>
        <Text style={[s.title,{color:c.foreground}]}>JOURNEY.</Text>
      </View>

      <View style={s.word}>
        <Text style={[s.wordText,{color:c.foreground}]}>{rotatingWord}</Text>
      </View>

      <View style={s.counter}>
        <Text style={[s.counterNumber,{color:c.foreground}]}>{time.days}</Text>
        <Text style={[s.counterLabel,{color:c.mutedForeground}]}>{rotatingLabel}</Text>
      </View>

      <View style={[s.coinWrap,{borderColor:c.foreground}]}>
        {profile
          ? <CoinFront
              days={time.days}
              shape={profile.coin_shape||"circle"}
              color={profile.coin_color||"#F5D680"}
              numberStyle={profile.number_style||"classic"}
              displayName={profile.display_name}
              motto={profile.coin_motto}
              showBorder={profile.coin_show_border!==false}
              borderColor={profile.coin_border_color}
              numberColor={profile.coin_number_color}
              coinPhoto={profile.coin_photo}
              imageOnlyMode={profile.coin_image_only}
              size={230}
            />
          : <Text style={{color:c.mutedForeground}}>Set your sobriety date to start tracking.</Text>
        }
      </View>

      <View style={s.elapsed}>
        <Text style={[s.section,{color:c.foreground}]}>TIME ELAPSED</Text>
        <View style={s.grid}>
          {[[time.hours,"HRS"],[time.minutes,"MIN"],[time.seconds,"SEC"]].map(([v,l])=>(
            <View key={String(l)}>
              <Text style={[s.num,{color:c.foreground}]}>{String(v).padStart(2,"0")}</Text>
              <Text style={[s.small,{color:c.mutedForeground}]}>{l}</Text>
            </View>
          ))}
        </View>
      </View>

      {profile&&(
        <View style={s.sectionBlock}>
          <Text style={[s.section,{color:c.foreground}]}>MY JOURNEY</Text>
          <Text style={[s.helper,{color:c.mutedForeground}]}>WHAT ARE YOU LEAVING BEHIND?</Text>
          <View style={s.chips}>
            {SUBSTANCES.map((substance)=>{
              const selected=profile.substances.includes(substance);
              return(
                <TouchableOpacity
                  key={substance}
                  disabled={savingSubstances}
                  onPress={()=>toggleSubstance(substance)}
                  style={[
                    s.chip,
                    {borderColor:c.foreground},
                    selected&&{backgroundColor:c.foreground}
                  ]}
                >
                  <Text style={[s.chipText,{color:selected?c.background:c.foreground}]}>{substance}</Text>
                </TouchableOpacity>
              );
            })}
          </View>
        </View>
      )}

      <View style={s.sectionBlock}>
        <Text style={[s.section,{color:c.foreground}]}>MILESTONES</Text>
        <View style={s.milestones}>
          {MILESTONES.map((milestone)=>{
            const achieved=time.days>=milestone.days;
            return(
              <View
                key={milestone.days}
                style={[
                  s.milestone,
                  {borderColor:achieved?c.gold:c.border,backgroundColor:achieved?c.gold:c.background}
                ]}
              >
                <Text style={[s.milestoneDays,{color:achieved?c.foreground:c.mutedForeground}]}>
                  {milestone.days<365?milestone.days+"D":milestone.days===365?"1Y":"2Y"}
                </Text>
                <Text style={[s.milestoneLabel,{color:achieved?c.foreground:c.mutedForeground}]}>
                  {milestone.label}
                </Text>
              </View>
            );
          })}
        </View>
      </View>

      <TouchableOpacity
        onPress={()=>router.push("/(tabs)/customize")}
        style={[s.button,{backgroundColor:c.foreground}]}
      >
        <Text style={{color:c.background,fontWeight:"800"}}>CUSTOMIZE →</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const s=StyleSheet.create({
  container:{padding:20,paddingBottom:50},
  header:{borderBottomWidth:2,paddingTop:24,paddingBottom:18},
  kicker:{fontSize:12,letterSpacing:5,fontWeight:"700"},
  title:{fontSize:52,fontWeight:"900",lineHeight:52},
  word:{paddingVertical:18},
  wordText:{fontSize:14,fontWeight:"800",letterSpacing:4},
  counter:{alignItems:"center",paddingVertical:4},
  counterNumber:{fontSize:96,fontWeight:"900",lineHeight:100,letterSpacing:-4},
  counterLabel:{fontSize:12,fontWeight:"800",letterSpacing:3,marginTop:-2},
  coinWrap:{alignItems:"center",justifyContent:"center",paddingVertical:25,borderBottomWidth:2},
  elapsed:{paddingVertical:24},
  sectionBlock:{paddingVertical:12},
  section:{fontSize:22,fontWeight:"900",letterSpacing:2},
  helper:{fontSize:9,fontWeight:"700",letterSpacing:2,marginTop:6,marginBottom:14},
  grid:{flexDirection:"row",justifyContent:"space-between",marginTop:18},
  num:{fontSize:32,fontWeight:"800"},
  small:{fontSize:9,letterSpacing:2,fontWeight:"700",marginTop:3},
  chips:{flexDirection:"row",flexWrap:"wrap",gap:8},
  chip:{paddingHorizontal:13,paddingVertical:9,borderWidth:2},
  chipText:{fontSize:12,fontWeight:"700"},
  milestones:{flexDirection:"row",flexWrap:"wrap",gap:8,marginTop:14},
  milestone:{width:"23%",minWidth:72,borderWidth:2,paddingVertical:12,alignItems:"center"},
  milestoneDays:{fontSize:18,fontWeight:"900"},
  milestoneLabel:{fontSize:8,fontWeight:"800",letterSpacing:1,textAlign:"center",marginTop:3},
  button:{height:54,alignItems:"center",justifyContent:"center",marginTop:20}
});


