import React from "react";
import { Image } from "react-native";

export default function V1ceLogo({ height = 28 }: { height?: number }) {
  return (
    <Image
      source={require("../../assets/images/v1ce-logo.png")}
      style={{ height, width: height * 0.84 }}
      resizeMode="contain"
    />
  );
}
