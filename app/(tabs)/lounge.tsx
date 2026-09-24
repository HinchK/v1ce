import React, { useCallback, useEffect, useState } from "react";
import { Alert, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";
import { useRouter } from "expo-router";
import { useAuth } from "@/context/AuthContext";
import { supabase, TABLES, type FriendConnection, type LoungeChatMessage } from "@/lib/supabase";
import { useColors } from "@/hooks/useColors";
import { useTranslation } from "@/lib/i18n";
import { fonts } from "@/constants/typography";
import LofiAvatar from "@/components/lounge/LofiAvatar";
import CoinPreview from "@/components/lounge/CoinPreview";
import BirthdayCard from "@/components/birthday/BirthdayCard";
import BirthdayTag from "@/components/birthday/BirthdayTag";
import GifterBadge from "@/components/GifterBadge";
import ArcadeCabinet from "@/components/ui/ArcadeCabinet";

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
  const { t } = useTranslation();
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
      ? supabase
          .channel("v1ce-lounge")
          .on("postgres_changes", { event: "INSERT", schema: "public", table: TABLES.LoungeChatMessage }, () => load())
          .subscribe()
      : null;
    return () => {
      if (channel) supabase.removeChannel(channel);
    };
  }, [load, user?.id]);

  const send = async (bodyText?: string) => {
    const body = (bodyText ?? message).trim();
    if (!body || !user?.id || sending) return;
    setSending(true);
    const { error } = await supabase.from(TABLES.LoungeChatMessage).insert({
      sender_id: user.id,
      body,
      sender_name: profile?.display_name || "You",
    });
    if (error) Alert.alert("V1CE", error.message);
    else setMessage("");
    setSending(false);
    if (!error) load();
  };

  const friendName = (f: FriendConnection) =>
    f.requester_id === user?.id ? f.recipient_name || f.recipient_email || "Friend" : f.requester_name || f.requester_email || "Friend";
  const visibleFriends = friends.length > 0 ? friends : [];
  const displayFriends = visibleFriends.length > 0 ? visibleFriends : MOCK_FRIENDS.map((f) => ({ mock: true, ...f }));
  const isBirthday =
    profile?.birthday &&
    new Date(profile.birthday).getMonth() === new Date().getMonth() &&
    new Date(profile.birthday).getDate() === new Date().getDate();

  return (
    <ScrollView style={{ backgroundColor: colors.background }} contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>
      <Text style={[styles.title, { color: colors.foreground }]}>{t("lounge.title")}</Text>
      <Text style={{ color: colors.mutedForeground, fontFamily: fonts.body }}>{t("lounge.subtitle")}</Text>

      {isBirthday ? (
        <TouchableOpacity onPress={() => setBirthdayOpen(true)} style={[styles.bdayBanner, { borderColor: colors.foreground }]}>
          <BirthdayTag />
          <Text style={{ color: colors.foreground, fontFamily: fonts.extraBold }}>It's your birthday in the lounge.</Text>
        </TouchableOpacity>
      ) : null}

      <Text style={[styles.section, { color: colors.foreground }]}>{t("lounge.friends")}</Text>
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
            <Text style={{ color: colors.foreground, fontFamily: fonts.extraBold, flex: 1 }}>{name}</Text>
            {profile?.gifted_count ? <GifterBadge giftedCount={profile.gifted_count} size="sm" /> : null}
            {locked ? <Text style={{ color: colors.mutedForeground, fontFamily: fonts.extraBold }}>LOCKED</Text> : null}
          </TouchableOpacity>
        );
      })}

      <Text style={[styles.section, { color: colors.foreground }]}>GAMES</Text>
      <View style={styles.arcadeRow}>
        {SOURCE_GAMES.map((game) => (
          <TouchableOpacity key={game.title} onPress={() => router.push(game.route as any)} style={[styles.gameCard, { borderColor: colors.foreground }]}>
            <Text style={[styles.gameTitle, { color: colors.foreground }]}>{game.title}</Text>
            <Text style={{ color: colors.mutedForeground, fontSize: 10, marginTop: 4, fontFamily: fonts.bodyBold }}>{game.subtitle}</Text>
          </TouchableOpacity>
        ))}
      </View>

      <Text style={[styles.section, { color: colors.foreground }]}>ARCADE</Text>
      <TouchableOpacity activeOpacity={0.9} onPress={() => router.push("/game")} style={{ marginBottom: 12 }}>
        <ArcadeCabinet />
      </TouchableOpacity>
      <View style={styles.arcadeRow}>
        <TouchableOpacity onPress={() => router.push("/game")} style={[styles.gameCard, { borderColor: colors.foreground, flex: 1 }]}>
          <Text style={[styles.gameTitle, { color: colors.foreground }]}>SOBRIETY RUN</Text>
          <Text style={{ color: colors.mutedForeground, fontSize: 10, marginTop: 4, fontFamily: fonts.bodyBold }}>12 LEVELS · BOSS FIGHT</Text>
          <Text style={{ color: colors.foreground, fontFamily: fonts.black, marginTop: 10 }}>PLAY →</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => router.push("/game")} style={[styles.gameCard, { borderColor: colors.foreground, flex: 1 }]}>
          <Text style={[styles.gameTitle, { color: colors.foreground }]}>JAYWALKER</Text>
          <Text style={{ color: colors.mutedForeground, fontSize: 10, marginTop: 4, fontFamily: fonts.bodyBold }}>SNAKE · POWER-UPS</Text>
          <Text style={{ color: colors.foreground, fontFamily: fonts.black, marginTop: 10 }}>PLAY →</Text>
        </TouchableOpacity>
      </View>

      <Text style={[styles.section, { color: colors.foreground }]}>{t("lounge.loungeChat")}</Text>
      <View style={[styles.chat, { borderColor: colors.border }]}>
        {!user?.id ? (
          <View style={styles.locked}>
            <Text style={{ color: colors.mutedForeground, fontFamily: fonts.body }}>{t("lounge.signInToChat")}</Text>
            <TouchableOpacity onPress={() => router.push("/(tabs)/profile")}>
              <Text style={{ color: colors.foreground, fontFamily: fonts.black, letterSpacing: 1 }}>{t("lounge.signIn")}</Text>
            </TouchableOpacity>
          </View>
        ) : profile?.is_premium ? (
          messages.length === 0 ? (
            <Text style={{ color: colors.mutedForeground, fontFamily: fonts.body }}>No messages yet. Say hello.</Text>
          ) : (
            messages.map((m) => (
              <View key={m.id} style={styles.message}>
                <LofiAvatar seed={m.display_name || m.sender_name || "F"} size={28} color={colors.foreground} />
                <Text style={{ color: colors.foreground, flex: 1, fontFamily: fonts.body }}>
                  <Text style={{ fontFamily: fonts.black }}>{m.sender_id === user?.id ? "You" : m.display_name || m.sender_name || "Friend"}: </Text>
                  {m.body || m.message}
                </Text>
              </View>
            ))
          )
        ) : (
          <View style={styles.locked}>
            <Text style={{ color: colors.mutedForeground, fontFamily: fonts.body }}>{t("lounge.premiumRequired")}</Text>
            <TouchableOpacity onPress={() => router.push("/(tabs)/premium")}>
              <Text style={{ color: colors.foreground, fontFamily: fonts.black, letterSpacing: 1 }}>{t("lounge.unlockPremium")}</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>
      {user?.id && profile?.is_premium ? (
        <View style={styles.composer}>
          <TextInput
            value={message}
            onChangeText={setMessage}
            maxLength={500}
            placeholder="Say something..."
            placeholderTextColor={colors.mutedForeground}
            style={[styles.input, { color: colors.foreground, borderColor: colors.border, fontFamily: fonts.body }]}
          />
          <TouchableOpacity disabled={sending} onPress={() => send()} style={[styles.send, { backgroundColor: colors.foreground }]}>
            <Text style={{ color: colors.background, fontFamily: fonts.extraBold }}>SEND</Text>
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
  container: { paddingHorizontal: 20, paddingTop: 28, paddingBottom: 48 },
  title: { fontSize: 64, lineHeight: 58, fontFamily: fonts.display, letterSpacing: 0.5 },
  section: { fontSize: 18, fontFamily: fonts.black, letterSpacing: 2, marginTop: 28, marginBottom: 12 },
  friend: { height: 52, borderWidth: 1, flexDirection: "row", alignItems: "center", padding: 8, marginBottom: 6, gap: 10 },
  bdayBanner: { borderWidth: 2, padding: 12, marginTop: 18, flexDirection: "row", gap: 10, alignItems: "center" },
  locked: { padding: 18, alignItems: "center", gap: 12 },
  chat: { borderWidth: 1, padding: 14, minHeight: 100 },
  arcadeRow: { flexDirection: "row", gap: 8, flexWrap: "wrap" },
  gameCard: { flexGrow: 1, minWidth: "30%", borderWidth: 2, padding: 12, minHeight: 100 },
  gameTitle: { fontSize: 13, fontFamily: fonts.black, letterSpacing: 1 },
  message: { flexDirection: "row", alignItems: "center", gap: 8, marginBottom: 8 },
  composer: { flexDirection: "row", gap: 8, marginTop: 8 },
  input: { flex: 1, borderWidth: 1, padding: 12 },
  send: { paddingHorizontal: 16, justifyContent: "center" },
});
