import React, { useEffect, useState } from "react";
import { Alert, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";
import { Feather } from "@expo/vector-icons";
import { useAuth } from "@/context/AuthContext";
import { supabase, TABLES, type BlockedUser, type FriendConnection } from "@/lib/supabase";
import { useColors } from "@/hooks/useColors";
import { fonts } from "@/constants/typography";

export default function Friends() {
  const { user } = useAuth();
  const colors = useColors();
  const [email, setEmail] = useState("");
  const [friends, setFriends] = useState<FriendConnection[]>([]);
  const [pending, setPending] = useState<FriendConnection[]>([]);
  const [blocked, setBlocked] = useState<BlockedUser[]>([]);
  const signedIn = !!user?.email;

  const load = async () => {
    if (!user?.id) return;
    const [{ data, error }, { data: blocks, error: blockError }] = await Promise.all([
      supabase.rpc("get_my_friend_connections"),
      supabase.from(TABLES.BlockedUser).select("*").eq("blocker_id", user.id),
    ]);
    if (error) Alert.alert("V1CE", error.message);
    if (blockError) Alert.alert("V1CE", blockError.message);
    const rows = (data || []) as FriendConnection[];
    setFriends(rows.filter((f) => f.status === "accepted"));
    setPending(rows.filter((f) => f.status === "pending" && (f.recipient_id === user.id || f.recipient_email === user.email)));
    setBlocked((blocks || []) as BlockedUser[]);
  };

  useEffect(() => {
    if (signedIn) load();
  }, [user?.id, signedIn]);

  const send = async () => {
    if (!user?.id || !email.trim()) return;
    const target = email.trim().toLowerCase();
    const { data: targetProfile, error: lookupError } = await supabase.rpc("find_profile_by_email", { target_email: target });
    if (lookupError) return Alert.alert("V1CE", lookupError.message);
    if (!targetProfile?.length) return Alert.alert("V1CE", "No V1CE profile found for that email.");
    const targetId = targetProfile[0].id;
    if (targetId === user.id) return Alert.alert("V1CE", "You can't add yourself.");
    const { error } = await supabase.from(TABLES.FriendConnection).insert({
      requester_id: user.id,
      recipient_id: targetId,
      requester_email: user.email,
      recipient_email: target,
      requester_name: "",
      recipient_name: "",
      status: "pending",
    });
    if (error) Alert.alert("V1CE", error.message);
    else {
      setEmail("");
      Alert.alert("V1CE", "Friend request sent!");
      load();
    }
  };

  const action = async (id: string, status: "accepted" | "rejected") => {
    const { error } = await supabase.from(TABLES.FriendConnection).update({ status }).eq("id", id);
    if (error) Alert.alert("V1CE", error.message);
    load();
  };
  const remove = async (id: string) => {
    const { error } = await supabase.from(TABLES.FriendConnection).delete().eq("id", id);
    if (error) Alert.alert("V1CE", error.message);
    load();
  };
  const block = async (id: string) => {
    const friend = friends.find((f) => f.id === id);
    if (!friend || !user?.id) return;
    const blockedId = friend.requester_id === user.id ? friend.recipient_id : friend.requester_id;
    const blockedEmail = friend.requester_id === user.id ? friend.recipient_email : friend.requester_email;
    const { error } = await supabase.from(TABLES.BlockedUser).insert({
      blocker_id: user.id,
      blocked_id: blockedId,
      blocker_email: user.email,
      blocked_email: blockedEmail,
    });
    if (error) Alert.alert("V1CE", error.message);
    else {
      await supabase.from(TABLES.FriendConnection).delete().eq("id", id);
      load();
    }
  };
  const unblock = async (id: string) => {
    const { error } = await supabase.from(TABLES.BlockedUser).delete().eq("id", id);
    if (error) Alert.alert("V1CE", error.message);
    load();
  };
  const friendName = (f: FriendConnection) =>
    f.requester_id === user?.id ? f.recipient_name || f.recipient_email || "Friend" : f.requester_name || f.requester_email || "Friend";
  const activeCount = friends.filter((f) => f.is_active_in_lounge).length;
  const toggleLounge = async (id: string, current: boolean) => {
    if (!current && activeCount >= 8) return Alert.alert("V1CE", "You can have up to 8 friends active in the lounge.");
    const { error } = await supabase.from(TABLES.FriendConnection).update({ is_active_in_lounge: !current }).eq("id", id);
    if (error) Alert.alert("V1CE", error.message);
    else load();
  };

  return (
    <ScrollView style={{ backgroundColor: colors.background }} contentContainerStyle={styles.page} keyboardShouldPersistTaps="handled">
      <Text style={[styles.title, { color: colors.foreground }]}>MANAGE{"\n"}FRIENDS</Text>
      <Text style={[styles.sub, { color: colors.mutedForeground }]}>Send requests, manage your top 8, and block users.</Text>
      <View style={[styles.rule, { backgroundColor: colors.foreground }]} />

      <Text style={[styles.heading, { color: colors.foreground }]}>SEND FRIEND REQUEST</Text>
      <View style={styles.row}>
        <View style={[styles.inputWrap, { borderColor: colors.foreground }]}>
          <Feather name="mail" size={18} color={colors.foreground} style={{ marginRight: 8 }} />
          <TextInput
            value={email}
            onChangeText={setEmail}
            autoCapitalize="none"
            keyboardType="email-address"
            placeholder="Enter email"
            placeholderTextColor={colors.mutedForeground}
            style={[styles.input, { color: colors.foreground }]}
          />
        </View>
        <TouchableOpacity onPress={send} style={[styles.send, { backgroundColor: colors.secondary }]}>
          <Feather name="send" size={18} color={colors.background} />
        </TouchableOpacity>
      </View>
      <View style={[styles.rule, { backgroundColor: colors.foreground }]} />

      {pending.length === 0 ? (
        <Text style={[styles.empty, { color: colors.mutedForeground }]}>No pending requests</Text>
      ) : (
        pending.map((f) => (
          <View key={f.id} style={[styles.card, { borderColor: colors.border }]}>
            <Text style={{ color: colors.foreground, fontFamily: fonts.bodySemi }}>{f.requester_name || f.requester_email || "Friend"}</Text>
            <View style={styles.actions}>
              <TouchableOpacity onPress={() => action(f.id, "accepted")}>
                <Text style={{ color: colors.foreground, fontFamily: fonts.extraBold }}>ACCEPT</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => action(f.id, "rejected")}>
                <Text style={{ color: colors.mutedForeground }}>REJECT</Text>
              </TouchableOpacity>
            </View>
          </View>
        ))
      )}

      {friends.length === 0 ? (
        <Text style={[styles.foot, { color: colors.mutedForeground }]}>No friends yet. Send a friend request to get started!</Text>
      ) : (
        friends.map((f) => (
          <View key={f.id} style={[styles.card, { borderColor: colors.border }]}>
            <Text style={{ color: colors.foreground, fontFamily: fonts.bodyBold, flex: 1 }}>{friendName(f)}</Text>
            <View style={styles.actions}>
              <TouchableOpacity onPress={() => toggleLounge(f.id, !!f.is_active_in_lounge)}>
                <Text style={{ color: colors.foreground, fontFamily: fonts.extraBold }}>{f.is_active_in_lounge ? "LOUNGE ON" : "LOUNGE"}</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => remove(f.id)}>
                <Text style={{ color: colors.mutedForeground, fontSize: 18, fontFamily: fonts.extraBold }}>X</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => block(f.id)}>
                <Text style={{ color: colors.mutedForeground }}>BLOCK</Text>
              </TouchableOpacity>
            </View>
          </View>
        ))
      )}

      {blocked.length > 0 ? (
        <>
          <Text style={[styles.heading, { color: colors.foreground, marginTop: 28 }]}>BLOCKED USERS</Text>
          {blocked.map((b) => (
            <View key={b.id} style={[styles.card, { borderColor: colors.border }]}>
              <Text style={{ color: colors.foreground }}>{b.blocked_email || "BLOCKED USER"}</Text>
              <TouchableOpacity onPress={() => unblock(b.id)}>
                <Text style={{ color: colors.mutedForeground }}>UNBLOCK</Text>
              </TouchableOpacity>
            </View>
          ))}
        </>
      ) : null}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  page: { paddingHorizontal: 20, paddingTop: 28, paddingBottom: 48 },
  title: { fontSize: 56, lineHeight: 52, fontFamily: fonts.display },
  sub: { fontSize: 15, lineHeight: 22, fontFamily: fonts.body, marginTop: 12 },
  rule: { height: 2, marginVertical: 22 },
  heading: { fontSize: 13, fontFamily: fonts.extraBold, letterSpacing: 1.4, marginBottom: 12 },
  row: { flexDirection: "row", gap: 0 },
  inputWrap: {
    flex: 1,
    borderWidth: 2,
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 12,
    minHeight: 52,
  },
  input: { flex: 1, fontSize: 15, fontFamily: fonts.body, paddingVertical: 12 },
  send: { width: 52, alignItems: "center", justifyContent: "center" },
  empty: { textAlign: "center", fontSize: 14, fontFamily: fonts.body, marginTop: 8 },
  foot: { textAlign: "center", fontSize: 14, fontFamily: fonts.body, marginTop: 36 },
  card: { borderWidth: 2, padding: 16, marginBottom: 10, flexDirection: "row", justifyContent: "space-between", alignItems: "center", gap: 8 },
  actions: { flexDirection: "row", gap: 14, alignItems: "center" },
});
