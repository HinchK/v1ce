import React from "react";
import { StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";
import { useColors } from "@/hooks/useColors";
import { fonts } from "@/constants/typography";
import type { RotatingTextPrefs } from "@/lib/rotatingTextPrefs";

export default function RotatingTextSettings({ title, prefs, onChange }: { title: string; prefs: RotatingTextPrefs; onChange: (next: RotatingTextPrefs) => void }) {
  const colors = useColors();
  const words = [...prefs.customWords, "", "", "", "", ""].slice(0, 5);
  return (
    <View style={[styles.block, { borderTopColor: colors.border }]}>
      <Text style={[styles.title, { color: colors.foreground }]}>{title}</Text>
      <Text style={[styles.help, { color: colors.mutedForeground }]}>Rotate the default words, add up to five of your own, or turn rotation off and pause on one word.</Text>
      <TouchableOpacity onPress={() => onChange({ ...prefs, rotating: !prefs.rotating })} style={[styles.toggle, { borderColor: colors.foreground, backgroundColor: prefs.rotating ? colors.foreground : colors.background }]}>
        <Text style={{ color: prefs.rotating ? colors.background : colors.foreground, fontFamily: fonts.black, letterSpacing: 1.5 }}>ROTATION {prefs.rotating ? "ON" : "OFF"}</Text>
      </TouchableOpacity>
      {!prefs.rotating ? <>
        <Text style={[styles.label, { color: colors.mutedForeground }]}>PAUSE ON</Text>
        <TextInput value={prefs.pausedWord} onChangeText={(pausedWord) => onChange({ ...prefs, pausedWord: pausedWord.toUpperCase().slice(0, 24) })} maxLength={24} placeholder="SOBER" placeholderTextColor={colors.mutedForeground} autoCapitalize="characters" style={[styles.input, { borderColor: colors.foreground, color: colors.foreground }]} />
      </> : null}
      <Text style={[styles.label, { color: colors.mutedForeground }]}>YOUR WORDS · UP TO 5</Text>
      {words.map((word, index) => <TextInput key={index} value={word} onChangeText={(value) => { const next=[...words]; next[index]=value.toUpperCase().slice(0,24); onChange({ ...prefs, customWords: next }); }} maxLength={24} placeholder={`WORD ${index + 1}`} placeholderTextColor={colors.mutedForeground} autoCapitalize="characters" style={[styles.input, { borderColor: colors.border, color: colors.foreground }]} />)}
    </View>
  );
}
const styles=StyleSheet.create({
  block:{borderTopWidth:2,marginTop:28,paddingTop:24},
  title:{fontSize:18,fontFamily:fonts.black,letterSpacing:1.5},
  help:{fontSize:12,lineHeight:18,fontFamily:fonts.body,marginTop:8,marginBottom:16},
  toggle:{borderWidth:2,minHeight:48,alignItems:"center",justifyContent:"center",marginBottom:18},
  label:{fontSize:10,fontFamily:fonts.bodyBold,letterSpacing:2,marginBottom:7,marginTop:10},
  input:{borderWidth:2,minHeight:46,paddingHorizontal:12,fontFamily:fonts.bodyBold,marginBottom:8},
});
