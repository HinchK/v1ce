import React from "react";
import { Modal, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import CoinFront from "@/components/CoinFront";
import { useColors } from "@/hooks/useColors";
import { fonts } from "@/constants/typography";

export default function CoinPreview({
  visible,
  onClose,
  name,
  days,
  shape,
  color,
}: {
  visible: boolean;
  onClose: () => void;
  name: string;
  days: number;
  shape?: string;
  color?: string;
}) {
  const colors = useColors();
  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
      <View style={styles.overlay}>
        <View style={[styles.card, { backgroundColor: colors.background, borderColor: colors.foreground }]}>
          <Text style={[styles.name, { color: colors.foreground }]}>{name}</Text>
          <CoinFront days={days} shape={shape || "circle"} color={color || "gold"} size={180} displayName={name} />
          <TouchableOpacity onPress={onClose} style={[styles.button, { borderColor: colors.foreground }]}>
            <Text style={{ color: colors.foreground, fontFamily: fonts.bodyBold }}>CLOSE</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: { flex: 1, backgroundColor: "rgba(0,0,0,0.5)", justifyContent: "center", padding: 24 },
  card: { borderWidth: 2, padding: 20, alignItems: "center" },
  name: { fontSize: 22, fontFamily: fonts.display, letterSpacing: 1, marginBottom: 16 },
  button: { marginTop: 16, borderWidth: 2, height: 44, alignItems: "center", justifyContent: "center", alignSelf: "stretch" },
});
