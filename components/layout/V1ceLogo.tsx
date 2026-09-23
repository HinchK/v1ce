import React from "react";
import { Image, StyleSheet } from "react-native";

export default function V1ceLogo({ height = 28 }: { height?: number }) {
  return (
    <Image
      source={{ uri: "https://media.base44.com/images/public/69fd9ed0922dc60247de8924/7e6c269c0_vice__1_.png" }}
      style={{ height, width: height * 3.2 }}
      resizeMode="contain"
    />
  );
}

const styles = StyleSheet.create({});
