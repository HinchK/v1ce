import {View,Text,StyleSheet} from "react-native";
import {useColors} from "@/hooks/useColors";
export default function Lounge(){const c=useColors();return <View style={[s.container,{backgroundColor:c.background}]}><Text style={[s.title,{color:c.foreground}]}>LOUNGE</Text><Text style={{color:c.mutedForeground}}>Community features are ready for the next data layer.</Text></View>}
const s=StyleSheet.create({container:{flex:1,padding:24,paddingTop:70},title:{fontSize:44,fontWeight:"700",marginBottom:12}});