// components/Groups/InviteUserPicker.js
import React, { useEffect, useMemo, useRef, useState } from "react";
import { View, Text, StyleSheet, TextInput, FlatList, TouchableOpacity, ActivityIndicator, Modal, Platform } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Ionicons } from "@expo/vector-icons";
import getBaseURL from "../../config/env";

const API = getBaseURL();
const MIN = 2, DEBOUNCE = 350;

export default function InviteUserPicker({ visible, onClose, groupId, alreadyMemberIds = [], pendingInviteeIds = [], onInvited }) {
  const [q, setQ] = useState(""), [rows, setRows] = useState([]), [busy, setBusy] = useState(false);
  const [err, setErr] = useState(null), [rowBusy, setRowBusy] = useState({});
  const [auth, setAuth] = useState({ token: null, userId: null });
  const tRef = useRef(null);

  const memberSet  = useMemo(() => new Set(alreadyMemberIds.map(Number)), [alreadyMemberIds]);
  const pendingSet = useMemo(() => new Set(pendingInviteeIds.map(Number)), [pendingInviteeIds]);

  useEffect(() => { (async () => {
    const [[, token], [, uid]] = await AsyncStorage.multiGet(["token","userId"]);
    setAuth({ token: token || null, userId: uid ? Number(uid) : null });
  })(); }, []);

  const headers = useMemo(() => (auth.token ? { Authorization: `Bearer ${auth.token}` } : {}), [auth.token]);

  useEffect(() => {
    if (!visible) return;
    if (tRef.current) clearTimeout(tRef.current);
    const s = q.trim();
    if (s.length < MIN) { setRows([]); setErr(null); return; }
    tRef.current = setTimeout(async () => {
      try {
        setBusy(true); setErr(null);
        const r = await fetch(`${API}/search/users?q=${encodeURIComponent(s)}`, { headers });
        if (!r.ok) throw new Error(`HTTP ${r.status}`);
        const j = await r.json();
        const list = (j.users || []).map(u => ({
          id: Number(u.id),
          name: [u.first_name||"", u.last_name||""].filter(Boolean).join(" "),
          email: u.email || "",
        }));
        setRows(list);
      } catch (e) { setErr(e.message || "Search failed"); setRows([]); }
      finally { setBusy(false); }
    }, DEBOUNCE);
    return () => tRef.current && clearTimeout(tRef.current);
  }, [q, headers, visible]);

  const invite = async (userId) => {
    if (!groupId) { setErr("Missing groupId"); return; }
    if (!auth.userId) { setErr("Please log in"); return; }
    if (memberSet.has(userId) || pendingSet.has(userId) || rowBusy[userId]) return;
    try {
      setRowBusy(p => ({ ...p, [userId]: true }));
      const r = await fetch(`${API}/groups/${groupId}/invites`, {
        method: "POST",
        headers: { ...headers, "Content-Type": "application/json" },
        body: JSON.stringify({ inviteeId: userId }),
      });
      if (!r.ok) {
        let msg = `HTTP ${r.status}`; try { const j = await r.json(); if (j?.error) msg = j.error; } catch {}
        throw new Error(msg);
      }
      onInvited?.(userId);
    } catch (e) { setErr(e.message || "Invite failed"); }
    finally { setRowBusy(p => (delete p[userId], { ...p })); }
  };

  const CTA = (uid) => {
    const isMe = auth.userId === uid, isMember = memberSet.has(uid), isPending = pendingSet.has(uid), rBusy = !!rowBusy[uid];
    let label = "Invite", style = [styles.btn, styles.btnPrimary], text = styles.btnPrimaryTxt, disabled = rBusy || isMe;
    if (isMember) { label = "Member"; style = [styles.btn, styles.btnMuted]; text = styles.btnMutedTxt; disabled = true; }
    else if (isPending) { label = "Invited"; style = [styles.btn, styles.btnMuted]; text = styles.btnMutedTxt; disabled = true; }
    return (
      <TouchableOpacity disabled={disabled} onPress={() => invite(uid)} style={[...style, disabled && { opacity: 0.8 }]}>
        {rBusy ? <ActivityIndicator size="small" /> : <Text style={text}>{label}</Text>}
      </TouchableOpacity>
    );
  };

  const Row = ({ item }) => (
    <View style={styles.row}>
      <View style={styles.avatar} />
      <View style={{ flex: 1, minWidth: 0 }}>
        <Text style={styles.name} numberOfLines={1}>{item.name || item.email}</Text>
        <Text style={styles.email} numberOfLines={1}>{item.email}</Text>
      </View>
      {CTA(item.id)}
    </View>
  );

  return (
    <Modal visible={visible} animationType="slide" onRequestClose={onClose} transparent={Platform.OS !== "web"}>
      <View style={styles.wrap}>
        <View style={styles.card}>
          <View style={styles.header}>
            <Text style={styles.title}>Invite people</Text>
            <TouchableOpacity onPress={onClose} style={styles.x}><Ionicons name="close" size={18} color="#0F3A6B" /></TouchableOpacity>
          </View>

          <View style={styles.search}>
            <Ionicons name="search-outline" size={18} color="#64748B" />
            <TextInput
              placeholder="Search by name or email…"
              placeholderTextColor="#8CA0B3"
              value={q}
              onChangeText={setQ}
              style={{ flex: 1, color: "#0F3A6B", fontSize: 16 }}
              autoCapitalize="none"
              autoCorrect={false}
            />
          </View>

          {!!err && <Text style={styles.err}>{err}</Text>}

          <View style={{ flex: 1, minHeight: 320 }}>
            {busy ? (
              <View style={styles.center}><ActivityIndicator /><Text style={styles.dim}>Searching…</Text></View>
            ) : q.trim().length >= MIN && rows.length === 0 ? (
              <View style={styles.center}><Text style={styles.dim}>No results</Text></View>
            ) : (
              <FlatList data={rows} keyExtractor={(u) => String(u.id)} renderItem={Row} ItemSeparatorComponent={() => <View style={styles.sep} />} />
            )}
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  wrap: { flex: 1, backgroundColor: Platform.OS === "web" ? "transparent" : "rgba(0,0,0,0.25)", alignItems: "center", justifyContent: "center" },
  card: { width: "92%", maxWidth: 720, backgroundColor: "#fff", borderRadius: 16, borderWidth: 1, borderColor: "#E9EDF2", padding: 14, ...(Platform.OS==="web"?{boxShadow:"0 12px 30px rgba(0,0,0,0.08)"}:{elevation:3}), maxHeight:"88%" },
  header: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", marginBottom: 8 },
  title: { fontSize: 18, fontWeight: "800", color: "#0F3A6B" },
  x: { padding: 6, borderRadius: 8, backgroundColor: "#F3F6FA", borderWidth: 1, borderColor: "#E6EDF7" },
  search: { flexDirection: "row", alignItems: "center", gap: 8, backgroundColor: "#fff", borderWidth: 1, borderColor: "#E6EDF7", borderRadius: 12, paddingHorizontal: 12, paddingVertical: 10, marginBottom: 8 },
  err: { color: "#B42318", fontWeight: "600", marginBottom: 6 },
  center: { alignItems: "center", justifyContent: "center", paddingVertical: 20 },
  dim: { color: "#64748B", fontWeight: "600" },
  row: { flexDirection: "row", alignItems: "center", paddingVertical: 10, paddingHorizontal: 6 },
  avatar: { width: 42, height: 42, borderRadius: 21, backgroundColor: "#EAF0F6", marginRight: 12 },
  name: { color: "#0F172A", fontWeight: "700", fontSize: 15 },
  email: { color: "#64748B", fontSize: 13 },
  sep: { height: 1, backgroundColor: "#E9EDF2", marginLeft: 60 },
  btn: { borderRadius: 999, borderWidth: 1, paddingVertical: 8, paddingHorizontal: 14, minWidth: 96, alignItems: "center" },
  btnPrimary: { backgroundColor: "#0F70F0", borderColor: "#0F70F0" },
  btnPrimaryTxt: { color: "#fff", fontWeight: "800" },
  btnMuted: { backgroundColor: "#EEF3F9", borderColor: "#E9EDF2" },
  btnMutedTxt: { color: "#0F172A", fontWeight: "800" },
});
