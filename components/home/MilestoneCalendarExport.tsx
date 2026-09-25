import React from "react";
import { Share, StyleSheet, Text, TouchableOpacity } from "react-native";
import { MILESTONES } from "@/constants/app";
import { useColors } from "@/hooks/useColors";
import { useTranslation } from "@/lib/i18n";
import { fonts } from "@/constants/typography";
import { Feather } from "@expo/vector-icons";

function formatDate(date: Date) {
  const y = date.getUTCFullYear();
  const m = String(date.getUTCMonth() + 1).padStart(2, "0");
  const d = String(date.getUTCDate()).padStart(2, "0");
  return `${y}${m}${d}`;
}

function generateICS(sobrietyDate: string, displayName?: string) {
  const start = new Date(`${sobrietyDate}T00:00:00`);
  const name = displayName || "You";
  const events = MILESTONES.map((milestone) => {
    const date = new Date(start);
    date.setDate(date.getDate() + milestone.days);
    const dateStr = formatDate(date);
    const endStr = formatDate(new Date(date.getTime() + 86400000));
    const uid = `v1ce-milestone-${milestone.days}-${dateStr}@v1ce.app`;
    const stamp = `${formatDate(new Date())}T000000Z`;
    return [
      "BEGIN:VEVENT",
      `UID:${uid}`,
      `DTSTAMP:${stamp}`,
      `DTSTART;VALUE=DATE:${dateStr}`,
      `DTEND;VALUE=DATE:${endStr}`,
      `SUMMARY:🎉 ${milestone.label} Sober!`,
      `DESCRIPTION:${name} reached ${milestone.label} of sobriety. ${milestone.message}`,
      "BEGIN:VALARM",
      "TRIGGER:PT9H",
      "ACTION:DISPLAY",
      `DESCRIPTION:🎉 ${milestone.label} Sober!`,
      "END:VALARM",
      "END:VEVENT",
    ].join("\r\n");
  }).join("\r\n");

  return [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//V1CE//Sobriety Milestones//EN",
    "CALSCALE:GREGORIAN",
    "METHOD:PUBLISH",
    events,
    "END:VCALENDAR",
  ].join("\r\n");
}

export default function MilestoneCalendarExport({
  sobrietyDate,
  displayName,
}: {
  sobrietyDate?: string;
  displayName?: string;
}) {
  const colors = useColors();
  const { t } = useTranslation();
  if (!sobrietyDate) return null;
  return (
    <TouchableOpacity
      onPress={() => Share.share({ message: generateICS(sobrietyDate, displayName), title: "v1ce-milestones.ics" })}
      style={[styles.button, { borderColor: colors.foreground }]}
    >
      <Feather name="calendar" size={16} color={colors.foreground} />
      <Text style={[styles.label, { color: colors.foreground }]}>{t("calendar.addToCalendar")}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: { borderWidth: 2, height: 52, flexDirection: "row", gap: 8, alignItems: "center", justifyContent: "center", marginTop: 24 },
  label: { fontSize: 18, fontFamily: fonts.display, letterSpacing: 2 },
});
