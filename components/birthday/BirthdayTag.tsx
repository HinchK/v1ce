import React from "react";
import { Text, View } from "react-native";
import { fonts } from "@/constants/typography";

export default function BirthdayTag() {
  return (
    <View style={{ backgroundColor: "#FFFFFF", borderWidth: 2, borderColor: "#0A0A0A", paddingHorizontal: 8, paddingVertical: 4 }}>
      <Text style={{ fontSize: 10, fontFamily: fonts.mono, letterSpacing: 2 }}>BDAY</Text>
    </View>
  );
}
