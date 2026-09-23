import React, { useEffect, useState } from "react";
import { Alert, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";
import { useAuth } from "@/context/AuthContext";
import { supabase, TABLES, type BlockedUser, type FriendConnection } from "@/lib/supabase";
import { useColors } from "@/hooks/useColors";

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

  if (!signedIn) {
    return (
      <View style={[styles.gate, { backgroundColor: colors.background }]}>
        <Text style={[styles.title, { color: colors.foreground }]}>FRIENDS.</Text>
        <Text style={{ color: colors.mutedForeground, marginTop: 12 }}>
          Add an email in onboarding or profile to send friend requests.
        </Text>
      </View>
    );
  }

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
    <ScrollView style={{ backgroundColor: colors.background }} contentContainerStyle={styles.container}>
      <Text style={[styles.title, { color: colors.foreground }]}>FRIENDS.</Text>
      <Text style={{ color: colors.mutedForeground }}>Connect with people on their sobriety journey.</Text>
      <View style={styles.row}>
        <TextInput
          value={email}
          onChangeText={setEmail}
          autoCapitalize="none"
          keyboardType="email-address"
          placeholder="Enter email"
          placeholderTextColor={colors.mutedForeground}
          style={[styles.input, { borderColor: colors.foreground, color: colors.foreground }]}
        />
        <TouchableOpacity onPress={send} style={[styles.send, { backgroundColor: colors.foreground }]}>
          <Text style={{ color: colors.background, fontWeight: "800" }}>SEND</Text>
        </TouchableOpacity>
      </View>
      <Text style={[styles.heading, { color: colors.foreground }]}>YOUR FRIENDS</Text>
      {friends.length === 0 ? (
        <Text style={{ color: colors.mutedForeground }}>No friends yet.</Text>
      ) : (
        friends.map((f) => (
          <View key={f.id} style={[styles.card, { borderColor: colors.border }]}>
            <Text style={{ color: colors.foreground, fontWeight: "700", flex: 1 }}>{friendName(f)}</Text>
            <View style={styles.actions}>
              <TouchableOpacity onPress={() => toggleLounge(f.id, !!f.is_active_in_lounge)}>
                <Text style={{ color: colors.foreground, fontWeight: "800" }}>{f.is_active_in_lounge ? "LOUNGE ON" : "LOUNGE"}</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => remove(f.id)}>
                <Text style={{ color: colors.mutedForeground, fontSize: 18, fontWeight: "900" }}>X</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => block(f.id)}>
                <Text style={{ color: colors.mutedForeground }}>BLOCK</Text>
              </TouchableOpacity>
            </View>
          </View>
        ))
      )}
      <Text style={[styles.heading, { color: colors.foreground }]}>PENDING REQUESTS</Text>
      {pending.length === 0 ? (
        <Text style={{ color: colors.mutedForeground }}>No pending requests</Text>
      ) : (
        pending.map((f) => (
          <View key={f.id} style={[styles.card, { borderColor: colors.border }]}>
            <Text style={{ color: colors.foreground }}>{f.requester_name || f.requester_email || "Friend"}</Text>
            <View style={styles.actions}>
              <TouchableOpacity onPress={() => action(f.id, "accepted")}>
                <Text style={{ color: colors.foreground, fontWeight: "800" }}>ACCEPT</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => action(f.id, "rejected")}>
                <Text style={{ color: colors.mutedForeground }}>REJECT</Text>
              </TouchableOpacity>
            </View>
          </View>
        ))
      )}
      <Text style={[styles.heading, { color: colors.foreground }]}>BLOCKED USERS</Text>
      {blocked.length === 0 ? (
        <Text style={{ color: colors.mutedForeground }}>No blocked users</Text>
      ) : (
        blocked.map((b) => (
          <View key={b.id} style={[styles.card, { borderColor: colors.border }]}>
            <Text style={{ color: colors.foreground }}>{b.blocked_email || "BLOCKED USER"}</Text>
            <TouchableOpacity onPress={() => unblock(b.id)}>
              <Text style={{ color: colors.mutedForeground }}>UNBLOCK</Text>
            </TouchableOpacity>
          </View>
        ))
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { padding: 20, paddingTop: 55, paddingBottom: 100 },
  gate: { flex: 1, padding: 20, paddingTop: 55 },
  title: { fontSize: 48, fontWeight: "900" },
  row: { flexDirection: "row", gap: 8, marginTop: 28 },
  input: { flex: 1, borderWidth: 2, padding: 12, fontSize: 14 },
  send: { paddingHorizontal: 18, justifyContent: "center" },
  heading: { fontSize: 22, fontWeight: "900", letterSpacing: 2, marginTop: 34, marginBottom: 12 },
  card: { borderWidth: 2, padding: 16, marginBottom: 10, flexDirection: "row", justifyContent: "space-between", alignItems: "center", gap: 8 },
  actions: { flexDirection: "row", gap: 14, alignItems: "center" },
});
