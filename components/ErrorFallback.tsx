import React, { useState } from "react";
import { Modal, ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { useColors } from "@/hooks/useColors";

export type ErrorFallbackProps = {
  error: Error;
  resetError: () => void;
};

export function ErrorFallback({ error, resetError }: ErrorFallbackProps) {
  const colors = useColors();
  const [showDetails, setShowDetails] = useState(false);

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <Text style={[styles.kicker, { color: colors.gold }]}>V1CE</Text>
      <Text style={[styles.title, { color: colors.foreground }]}>SOMETHING{"\n"}WENT WRONG.</Text>
      <Text style={[styles.body, { color: colors.mutedForeground }]}>
        The app hit an unexpected error. You can restart and keep going.
      </Text>
      <TouchableOpacity
        onPress={resetError}
        style={[styles.button, { backgroundColor: colors.foreground }]}
      >
        <Text style={[styles.buttonText, { color: colors.background }]}>RESTART</Text>
      </TouchableOpacity>
      {__DEV__ ? (
        <TouchableOpacity onPress={() => setShowDetails(true)} style={styles.detailsLink}>
          <Text style={[styles.detailsText, { color: colors.mutedForeground }]}>DEV DETAILS</Text>
        </TouchableOpacity>
      ) : null}
      <Modal visible={showDetails} animationType="slide" onRequestClose={() => setShowDetails(false)}>
        <View style={[styles.modal, { backgroundColor: colors.background }]}>
          <Text style={[styles.modalTitle, { color: colors.foreground }]}>{error.message}</Text>
          <ScrollView>
            <Text style={[styles.stack, { color: colors.mutedForeground }]}>{error.stack}</Text>
          </ScrollView>
          <TouchableOpacity onPress={() => setShowDetails(false)} style={[styles.button, { backgroundColor: colors.foreground }]}>
            <Text style={[styles.buttonText, { color: colors.background }]}>CLOSE</Text>
          </TouchableOpacity>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: "center", padding: 32 },
  kicker: { fontSize: 11, fontWeight: "800", letterSpacing: 4, marginBottom: 12 },
  title: { fontSize: 40, fontWeight: "900", lineHeight: 42, letterSpacing: -1, marginBottom: 16 },
  body: { fontSize: 14, lineHeight: 20, marginBottom: 28 },
  button: { height: 56, alignItems: "center", justifyContent: "center" },
  buttonText: { fontSize: 18, fontWeight: "800", letterSpacing: 2 },
  detailsLink: { marginTop: 18, alignItems: "center" },
  detailsText: { fontSize: 11, fontWeight: "800", letterSpacing: 2 },
  modal: { flex: 1, padding: 24, paddingTop: 64 },
  modalTitle: { fontSize: 18, fontWeight: "800", marginBottom: 16 },
  stack: { fontSize: 12, lineHeight: 18, fontFamily: "SpaceMono_700Bold" },
});
