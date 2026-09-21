import React from "react";
import {View,Text,StyleSheet} from "react-native";
export const COIN_COLORS={gold:"#F5A41A",rose:"#E7A0A0",blue:"#8EB8E5",green:"#91C7A0",purple:"#B59AD8",black:"#111111",white:"#F7F7F7",silver:"#BFC3C8"} as const;
export const SHAPES=["circle","hexagon","star","diamond","shield","octagon"] as const;
export function CoinFront({value=0,color="gold",shape="circle",size=180}:{value?:number;color?:string;shape?:string;size?:number}){const bg=COIN_COLORS[color as keyof typeof COIN_COLORS]||color;return <View style={[s.coin,{width:size,height:size,borderRadius:shape==="circle"?size/2:18,backgroundColor:bg,borderColor:"#0A0A0A"}]}><Text style={[s.value,{fontSize:size*.3}]}>{value}</Text></View>}
const s=StyleSheet.create({coin:{borderWidth:4,alignItems:"center",justifyContent:"center"},value:{fontWeight:"700",color:"#0A0A0A"}});