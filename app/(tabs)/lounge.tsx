import React, { useCallback, useEffect, useState } from "react";
import { Alert, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";
import { useRouter } from "expo-router";
import { useAuth } from "@/context/AuthContext";
import { supabase, TABLES, type FriendConnection, type LoungeChatMessage } from "@/lib/supabase";
import { useColors } from "@/hooks/useColors";
import LofiAvatar from "@/components/lounge/LofiAvatar";
import CoinPreview from "@/components/lounge/CoinPreview";
import BirthdayCard from "@/components/birthday/BirthdayCard";
import BirthdayTag from "@/components/birthday/BirthdayTag";
import GifterBadge from "@/components/GifterBadge";

const MOCK_FRIENDS = [
  { id: "mock-1", name: "Alex", days: 120 },
  { id: "mock-2", name: "Sam", days: 45 },
  { id: "mock-3", name: "Riley", days: 365 },
  { id: "mock-4", name: "Jordan", days: 12 },
];

const SOURCE_GAMES = [
  { title: "COIN FLIP", subtitle: "CALL IT", route: "/game" },
  { title: "SOBER STREAK", subtitle: "KEEP THE RUN", route: "/game" },
  { title: "MILESTONE MATCH", subtitle: "MEMORY", route: "/game" },
];

export default function Lounge() {
  const router = useRouter();
  const colors = useColors();
  const { user, profile } = useAuth();
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState<LoungeChatMessage[]>([]);
  const [friends, setFriends] = useState<FriendConnection[]>([]);
  const [sending, setSending] = useState(false);
  const [preview, setPreview] = useState<{ name: string; days: number } | null>(null);
  const [birthdayOpen, setBirthdayOpen] = useState(false);

  const load = useCallback(async () => {
    if (!user?.id) return;
    const [{ data: friendData, error: friendError }, { data: messageData, error: messageError }] = await Promise.all([
      supabase.rpc("get_my_friend_connections"),
      supabase.rpc("get_lounge_messages"),
    ]);
    if (friendError) Alert.alert("V1CE", friendError.message);
    else setFriends(((friendData || []) as FriendConnection[]).filter((f) => f.status === "accepted"));
    if (messageError) Alert.alert("V1CE", messageError.message);
    else setMessages((messageData || []) as LoungeChatMessage[]);
  }, [user?.id]);

  useEffect(() => {
    load();
    const channel = user?.id
      ? supabase.channel("v1ce-lounge").on("postgres_changes", { event: "INSERT", schema: "public", table: TABLES.LoungeChatMessage }, () => load()).subscribe()
      : null;
    return () => {
      if (channel) supabase.removeChannel(channel);
    };
  }, [load, user?.id]);

  const send = async (bodyText?: string) => {
    const body = (bodyText ?? message).trim();
    if (!body || !user?.id || sending) return;
    setSending(true);
    const { error } = await supabase.from(TABLES.LoungeChatMessage).insert({ sender_id: user.id, body, sender_name: profile?.display_name || "You" });
    if (error) Alert.alert("V1CE", error.message);
    else setMessage("");
    setSending(false);
    if (!error) load();
  };

  const friendName = (f: FriendConnection) =>
    f.requester_id === user?.id ? f.recipient_name || f.recipient_email || "Friend" : f.requester_name || f.requester_email || "Friend";
  const visibleFriends = friends.length > 0 ? friends : [];
  const displayFriends = visibleFriends.length > 0 ? visibleFriends : MOCK_FRIENDS.map((f) => ({ mock: true, ...f }));
  const isBirthday = profile?.birthday && new Date(profile.birthday).getMonth() === new Date().getMonth() && new Date(profile.birthday).getDate() === new Date().getDate();

  return (
    <ScrollView style={{ backgroundColor: colors.background }} contentContainerStyle={styles.container}>
      <Text style={[styles.kicker, { color: colors.mutedForeground }]}>THE</Text>
      <Text style={[styles.title, { color: colors.foreground }]}>LOUNGE.</Text>
      <Text style={{ color: colors.mutedForeground }}>Connect with friends on their sobriety journey.</Text>

      {isBirthday ? (
        <TouchableOpacity onPress={() => setBirthdayOpen(true)} style={[styles.bdayBanner, { borderColor: colors.foreground }]}>
          <BirthdayTag />
          <Text style={{ color: colors.foreground, fontWeight: "800" }}>It's your birthday in the lounge.</Text>
        </TouchableOpacity>
      ) : null}

      <Text style={[styles.section, { color: colors.foreground }]}>FRIENDS</Text>
      {displayFriends.map((item: any, index: number) => {
        const name = item.mock ? item.name : friendName(item);
        const locked = !profile?.is_premium && index > 0;
        return (
          <TouchableOpacity
            key={item.id}
            disabled={locked}
            onPress={() => setPreview({ name, days: item.days || 1 })}
            style={[styles.friend, { borderColor: colors.border, opacity: locked ? 0.45 : 1 }]}
          >
            <LofiAvatar seed={name} color={colors.foreground} />
            <Text style={{ color: colors.foreground, fontWeight: "700", flex: 1 }}>{name}</Text>
            {profile?.gifted_count ? <GifterBadge giftedCount={profile.gifted_count} size="sm" /> : null}
            {locked ? <Text style={{ color: colors.mutedForeground, fontWeight: "800" }}>LOCKED</Text> : null}
          </TouchableOpacity>
        );
      })}

      <Text style={[styles.section, { color: colors.foreground }]}>GAMES</Text>
      <View style={styles.arcadeRow}>
        {SOURCE_GAMES.map((game) => (
          <TouchableOpacity key={game.title} onPress={() => router.push(game.route as any)} style={[styles.gameCard, { borderColor: colors.foreground }]}>
            <Text style={[styles.gameTitle, { color: colors.foreground }]}>{game.title}</Text>
            <Text style={{ color: colors.mutedForeground, fontSize: 10, marginTop: 4 }}>{game.subtitle}</Text>
          </TouchableOpacity>
        ))}
      </View>

      <Text style={[styles.section, { color: colors.foreground }]}>ARCADE</Text>
      <View style={styles.arcadeRow}>
        <TouchableOpacity onPress={() => router.push("/game")} style={[styles.gameCard, { borderColor: colors.foreground }]}>
          <Text style={[styles.gameTitle, { color: colors.foreground }]}>SOBRIETY RUN</Text>
          <Text style={{ color: colors.mutedForeground, fontSize: 10, marginTop: 4 }}>12 LEVELS · BOSS FIGHT</Text>
          <Text style={{ color: colors.foreground, fontWeight: "900", marginTop: 10 }}>PLAY →</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => router.push("/game")} style={[styles.gameCard, { borderColor: colors.foreground }]}>
          <Text style={[styles.gameTitle, { color: colors.foreground }]}>JAYWALKER</Text>
          <Text style={{ color: colors.mutedForeground, fontSize: 10, marginTop: 4 }}>SNAKE · POWER-UPS</Text>
          <Text style={{ color: colors.foreground, fontWeight: "900", marginTop: 10 }}>PLAY →</Text>
        </TouchableOpacity>
      </View>

      <Text style={[styles.section, { color: colors.foreground }]}>LOUNGE CHAT</Text>
      <View style={[styles.chat, { borderColor: colors.border }]}>
        {profile?.is_premium ? (
          messages.length === 0 ? (
            <Text style={{ color: colors.mutedForeground }}>No messages yet. Say hello.</Text>
          ) : (
            messages.map((m) => (
              <View key={m.id} style={styles.message}>
                <LofiAvatar seed={m.display_name || m.sender_name || "F"} size={28} color={colors.foreground} />
                <Text style={{ color: colors.foreground, flex: 1 }}>
                  <Text style={{ fontWeight: "900" }}>{m.sender_id === user?.id ? "You" : m.display_name || m.sender_name || "Friend"}: </Text>
                  {m.body || m.message}
                </Text>
              </View>
            ))
          )
        ) : (
          <View style={styles.locked}>
            <Text style={{ color: colors.mutedForeground }}>Lounge Chat is a Premium feature.</Text>
            <TouchableOpacity onPress={() => router.push("/(tabs)/premium")}>
              <Text style={{ color: colors.foreground, fontWeight: "900", letterSpacing: 1 }}>UNLOCK PREMIUM →</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>
      {profile?.is_premium ? (
        <View style={styles.composer}>
          <TextInput
            value={message}
            onChangeText={setMessage}
            maxLength={500}
            placeholder="Say something..."
            placeholderTextColor={colors.mutedForeground}
            style={[styles.input, { color: colors.foreground, borderColor: colors.border }]}
          />
          <TouchableOpacity disabled={sending} onPress={() => send()} style={[styles.send, { backgroundColor: colors.foreground }]}>
            <Text style={{ color: colors.background, fontWeight: "800" }}>SEND</Text>
          </TouchableOpacity>
        </View>
      ) : null}

      <CoinPreview visible={!!preview} onClose={() => setPreview(null)} name={preview?.name || ""} days={preview?.days || 0} />
      <BirthdayCard
        name={profile?.display_name || "friend"}
        visible={birthdayOpen}
        onClose={() => setBirthdayOpen(false)}
        onShare={(text) => send(text)}
      />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { padding: 20, paddingTop: 55, paddingBottom: 100 },
  kicker: { fontSize: 12, letterSpacing: 5, fontWeight: "700" },
  title: { fontSize: 52, fontWeight: "900", lineHeight: 54 },
  section: { fontSize: 18, fontWeight: "900", letterSpacing: 2, marginTop: 28, marginBottom: 12 },
  friend: { height: 52, borderWidth: 1, flexDirection: "row", alignItems: "center", padding: 8, marginBottom: 6, gap: 10 },
  bdayBanner: { borderWidth: 2, padding: 12, marginTop: 18, flexDirection: "row", gap: 10, alignItems: "center" },
  locked: { padding: 18, alignItems: "center", gap: 12 },
  chat: { borderWidth: 1, padding: 14, minHeight: 100 },
  arcadeRow: { flexDirection: "row", gap: 8, flexWrap: "wrap" },
  gameCard: { flexGrow: 1, minWidth: "30%", borderWidth: 2, padding: 12, minHeight: 100 },
  gameTitle: { fontSize: 13, fontWeight: "900", letterSpacing: 1 },
  message: { flexDirection: "row", alignItems: "center", gap: 8, marginBottom: 8 },
  composer: { flexDirection: "row", gap: 8, marginTop: 8 },
  input: { flex: 1, borderWidth: 1, padding: 12 },
  send: { paddingHorizontal: 16, justifyContent: "center" },
});
