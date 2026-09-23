import React, { useEffect, useState } from "react";
import { Text } from "react-native";
import { ROTATING_LABELS, ROTATING_WORDS } from "@/constants/app";

export default function RotatingLabel({
  mode = "words",
  style,
}: {
  mode?: "words" | "labels";
  style?: object;
}) {
  const source = mode === "labels" ? ROTATING_LABELS : ROTATING_WORDS;
  const [index, setIndex] = useState(0);
  useEffect(() => {
    const id = setInterval(() => setIndex((value) => (value + 1) % source.length), 1500);
    return () => clearInterval(id);
  }, [source.length]);
  return <Text style={style}>{source[index]}</Text>;
}
