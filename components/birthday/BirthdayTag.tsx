import React from "react";
import { Text, View } from "react-native";

export default function BirthdayTag() {
  return (
    <View style={{ backgroundColor: "#FFFFFF", borderWidth: 2, borderColor: "#0A0A0A", paddingHorizontal: 8, paddingVertical: 4 }}>
      <Text style={{ fontSize: 10, fontWeight: "800", letterSpacing: 2 }}>BDAY</Text>
    </View>
  );
}
