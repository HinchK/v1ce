import React, { useMemo, useState } from "react";
import { Modal, Pressable, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { fonts } from "@/constants/typography";

const WEEKDAYS = ["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"];
const MONTHS = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

function daysInMonth(year: number, month: number) {
  return new Date(year, month + 1, 0).getDate();
}

function pad(n: number) {
  return String(n).padStart(2, "0");
}

export function formatDisplayDate(iso: string) {
  if (!iso) return "";
  const [y, m, d] = iso.split("-").map(Number);
  if (!y || !m || !d) return iso;
  return `${pad(m)}/${pad(d)}/${y}`;
}

function toIso(year: number, month: number, day: number) {
  return `${year}-${pad(month + 1)}-${pad(day)}`;
}

export default function CalendarField({
  value,
  onChange,
  placeholder = " ",
}: {
  value: string;
  onChange: (iso: string) => void;
  placeholder?: string;
}) {
  const initial = value ? new Date(`${value}T00:00:00`) : new Date();
  const [open, setOpen] = useState(false);
  const [cursor, setCursor] = useState({ year: initial.getFullYear(), month: initial.getMonth() });
  const [draft, setDraft] = useState(value);

  const cells = useMemo(() => {
    const first = new Date(cursor.year, cursor.month, 1).getDay();
    const count = daysInMonth(cursor.year, cursor.month);
    const out: (number | null)[] = Array.from({ length: first }, () => null);
    for (let d = 1; d <= count; d++) out.push(d);
    while (out.length % 7 !== 0) out.push(null);
    return out;
  }, [cursor]);

  const openCal = () => {
    const base = value ? new Date(`${value}T00:00:00`) : new Date();
    setCursor({ year: base.getFullYear(), month: base.getMonth() });
    setDraft(value);
    setOpen(true);
  };

  const selectedIso = draft || value;

  return (
    <>
      <TouchableOpacity onPress={openCal} style={styles.field} activeOpacity={0.85}>
        <Text style={[styles.fieldText, !value && styles.placeholder]}>{value ? formatDisplayDate(value) : placeholder}</Text>
      </TouchableOpacity>
      <Modal visible={open} transparent animationType="fade" onRequestClose={() => setOpen(false)}>
        <Pressable style={styles.backdrop} onPress={() => setOpen(false)}>
          <Pressable style={styles.sheet} onPress={(e) => e.stopPropagation()}>
            <View style={styles.monthRow}>
              <Text style={styles.monthLabel}>
                {MONTHS[cursor.month]} {cursor.year}
              </Text>
              <View style={styles.monthNav}>
                <TouchableOpacity
                  onPress={() =>
                    setCursor((c) => (c.month === 0 ? { year: c.year - 1, month: 11 } : { year: c.year, month: c.month - 1 }))
                  }
                >
                  <Text style={styles.navBtn}>‹</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() =>
                    setCursor((c) => (c.month === 11 ? { year: c.year + 1, month: 0 } : { year: c.year, month: c.month + 1 }))
                  }
                >
                  <Text style={styles.navBtn}>›</Text>
                </TouchableOpacity>
              </View>
            </View>
            <View style={styles.weekRow}>
              {WEEKDAYS.map((d) => (
                <Text key={d} style={styles.weekday}>
                  {d}
                </Text>
              ))}
            </View>
            <View style={styles.grid}>
              {cells.map((day, i) => {
                const iso = day ? toIso(cursor.year, cursor.month, day) : "";
                const selected = day !== null && iso === selectedIso;
                const today = new Date();
                const isToday = day === today.getDate() && cursor.month === today.getMonth() && cursor.year === today.getFullYear();
                return (
                  <TouchableOpacity
                    key={i}
                    disabled={!day}
                    onPress={() => day && setDraft(toIso(cursor.year, cursor.month, day))}
                    style={[styles.cell, selected && styles.cellSelected]}
                  >
                    <Text style={[styles.day, selected && styles.daySelected, isToday && !selected && styles.today]}>{day || ""}</Text>
                  </TouchableOpacity>
                );
              })}
            </View>
            <View style={styles.footer}>
              <TouchableOpacity
                onPress={() => {
                  setDraft("");
                  onChange("");
                }}
                style={styles.reset}
              >
                <Text style={styles.resetText}>Reset</Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => {
                  if (draft) onChange(draft);
                  setOpen(false);
                }}
                style={styles.confirm}
              >
                <Text style={styles.confirmText}>✓</Text>
              </TouchableOpacity>
            </View>
          </Pressable>
        </Pressable>
      </Modal>
    </>
  );
}

const styles = StyleSheet.create({
  field: {
    borderWidth: 2,
    borderColor: "#0A0A0A",
    backgroundColor: "#FFFFFF",
    minHeight: 52,
    justifyContent: "center",
    paddingHorizontal: 12,
  },
  fieldText: { fontSize: 18, color: "#0A0A0A", fontFamily: fonts.bodySemi, textAlign: "center" },
  placeholder: { color: "#A3A3A3" },
  backdrop: { flex: 1, backgroundColor: "rgba(0,0,0,0.25)", justifyContent: "center", padding: 24 },
  sheet: {
    backgroundColor: "#6B6B6B",
    borderRadius: 22,
    padding: 16,
    paddingBottom: 12,
  },
  monthRow: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", marginBottom: 10 },
  monthLabel: { color: "#FFFFFF", fontSize: 17, fontFamily: fonts.bodySemi },
  monthNav: { flexDirection: "row", gap: 16 },
  navBtn: { color: "#FFFFFF", fontSize: 26, lineHeight: 28 },
  weekRow: { flexDirection: "row" },
  weekday: { flex: 1, textAlign: "center", color: "rgba(255,255,255,0.7)", fontSize: 10, letterSpacing: 0.6, fontFamily: fonts.bodyBold },
  grid: { flexDirection: "row", flexWrap: "wrap", marginTop: 8 },
  cell: { width: "14.28%", height: 40, alignItems: "center", justifyContent: "center" },
  cellSelected: { backgroundColor: "#FFFFFF", borderRadius: 20 },
  day: { color: "#FFFFFF", fontSize: 16, fontFamily: fonts.body },
  daySelected: { color: "#0A0A0A", fontFamily: fonts.bodyBold },
  today: { fontFamily: fonts.bodyBold },
  footer: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginTop: 8 },
  reset: { backgroundColor: "#8A8A8A", borderRadius: 16, paddingHorizontal: 18, paddingVertical: 8 },
  resetText: { color: "#FFFFFF", fontFamily: fonts.bodySemi },
  confirm: { width: 44, height: 44, borderRadius: 22, backgroundColor: "#3B82F6", alignItems: "center", justifyContent: "center" },
  confirmText: { color: "#FFFFFF", fontSize: 20, fontFamily: fonts.bodyBold },
});
