
// // components/Social/Messages.js
// import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
// import {
//   View,
//   Text,
//   StyleSheet,
//   Platform,
//   FlatList,
//   TouchableOpacity,
//   TextInput,
//   ActivityIndicator,
//   Image,
//   SafeAreaView,
//   useWindowDimensions,
// } from "react-native";
// import AsyncStorage from "@react-native-async-storage/async-storage";
// import { Ionicons } from "@expo/vector-icons";
// import getBaseURL from "../../config/env"; // ✅ use your existing env.js

// const API_BASE_URL = getBaseURL();

// /* ------------------------------ Root Screen ------------------------------ */
// export default function Messages() {
//   const { width } = useWindowDimensions();
//   const isNarrow = width < 900; // stack on phones / small tablets

//   const [auth, setAuth] = useState({ token: null, userId: null });
//   const [selected, setSelected] = useState(null); // { id, type, title? }
//   const [refreshFlag, setRefreshFlag] = useState(0);

//   // load token + userId set by LoginScreen
//   useEffect(() => {
//     (async () => {
//       const [[, token], [, userIdRaw]] = await AsyncStorage.multiGet(["token", "userId"]);
//       setAuth({ token: token || null, userId: userIdRaw ? Number(userIdRaw) : null });
//     })();
//   }, []);

//   // build auth headers; don't set Content-Type for GETs without a body
//   const authHeaders = useMemo(() => {
//     const h = {};
//     if (auth.token) h.Authorization = `Bearer ${auth.token}`;
//     return h;
//   }, [auth.token]);

//   return (
//     <SafeAreaView style={styles.page}>
//       {/* Header strip (light, consistent with TravelMate) */}
//       <View style={styles.headerBar}>
//         <Text style={styles.h1}>Messages</Text>
//         <Text style={styles.hint}>Your direct and group conversations.</Text>
//       </View>

//       {/* Full-height messenger shell */}
//       <View style={[styles.shell, isNarrow && styles.shellNarrow]}>
//         {/* Left list: show on wide OR when no chat selected */}
//         {(!isNarrow || !selected) && (
//           <View style={[styles.leftPane, isNarrow && styles.leftPaneNarrow]}>
//             <ConversationsList
//               auth={auth}
//               headers={authHeaders}
//               refreshKey={refreshFlag}
//               onSelect={setSelected}
//               selectedId={selected?.id}
//             />
//           </View>
//         )}

//         {/* Right chat: show on wide OR when a chat is chosen */}
//         {(!isNarrow || selected) && (
//           <View style={[styles.rightPane, isNarrow && styles.rightPaneNarrow]}>
//             {selected ? (
//               <ChatWindow
//                 auth={auth}
//                 headers={authHeaders}
//                 conversation={selected}
//                 onMessageSent={() => setRefreshFlag((n) => n + 1)}
//                 onBack={isNarrow ? () => setSelected(null) : undefined}
//               />
//             ) : (
//               !isNarrow && (
//                 <View style={styles.rightEmpty}>
//                   <Text style={styles.meta}>Pick a conversation from the left.</Text>
//                 </View>
//               )
//             )}
//           </View>
//         )}
//       </View>
//     </SafeAreaView>
//   );
// }

// /* --------------------------- Conversations List -------------------------- */
// function ConversationsList({ auth, headers, refreshKey, selectedId, onSelect }) {
//   const [loading, setLoading] = useState(true);
//   const [err, setErr] = useState(null);
//   const [items, setItems] = useState([]);
//   const [search, setSearch] = useState("");

//   const fetchConversations = useCallback(async () => {
//     if (!auth.userId) return;
//     setLoading(true);
//     setErr(null);
//     try {
//       const res = await fetch(`${API_BASE_URL}/users/${auth.userId}/conversations`, { headers });
//       if (!res.ok) throw new Error(`HTTP ${res.status}`);
//       const data = await res.json();
//       setItems(Array.isArray(data) ? data : data?.conversations || []);
//     } catch (e) {
//       setErr(e?.message || "Failed to load conversations");
//       setItems([]);
//     } finally {
//       setLoading(false);
//     }
//   }, [auth.userId, headers]);

//   useEffect(() => {
//     fetchConversations();
//   }, [fetchConversations, refreshKey]);

//   const filtered = useMemo(() => {
//     const q = search.trim().toLowerCase();
//     if (!q) return items;
//     return items.filter((c) => {
//       const title = (c.title || (c.type === "direct" ? "Direct Message" : "Group Chat")).toLowerCase();
//       return title.includes(q) || String(c.id).includes(q);
//     });
//   }, [items, search]);

//   if (!auth.userId) {
//     return (
//       <View style={styles.leftWrap}>
//         <Text style={styles.meta}>Please log in to view messages.</Text>
//       </View>
//     );
//   }

//   return (
//     <View style={styles.leftWrap}>
//       {/* list header */}
//       <View style={styles.listHeader}>
//         <Text style={styles.listTitle}>Inbox</Text>
//         <TouchableOpacity onPress={fetchConversations} style={styles.refreshBtn} activeOpacity={0.9}>
//           <Ionicons name="refresh" size={16} color={COLORS.text} />
//           <Text style={styles.refreshText}>Refresh</Text>
//         </TouchableOpacity>
//       </View>

//       {/* search in list */}
//       <View style={styles.searchRow}>
//         <Ionicons name={Platform.OS === "ios" ? "search" : "search-outline"} size={18} color={COLORS.subtext} />
//         <TextInput
//           value={search}
//           onChangeText={setSearch}
//           placeholder="Search conversations…"
//           placeholderTextColor="#8CA0B3"
//           style={styles.searchInput}
//         />
//       </View>

//       {/* states */}
//       {loading ? (
//         <View style={styles.centerWrap}>
//           <ActivityIndicator />
//           <Text style={styles.meta}>Loading conversations…</Text>
//         </View>
//       ) : err ? (
//         <ErrorBanner text={err} onRetry={fetchConversations} />
//       ) : filtered.length === 0 ? (
//         <View style={styles.centerWrap}>
//           <Text style={styles.meta}>No conversations{search ? " match your search." : "."}</Text>
//         </View>
//       ) : (
//         <FlatList
//           data={filtered}
//           keyExtractor={(c) => String(c.id)}
//           ItemSeparatorComponent={() => <View style={styles.sepThin} />}
//           contentContainerStyle={{ paddingBottom: 10 }}
//           renderItem={({ item }) => {
//             const active = item.id === selectedId;
//             const title = item.title || (item.type === "direct" ? "Direct Message" : "Group Chat");
//             return (
//               <TouchableOpacity
//                 onPress={() => onSelect?.(item)}
//                 activeOpacity={0.9}
//                 style={[styles.convRow, active && styles.convRowActive]}
//               >
//                 <Image source={{ uri: "https://placehold.co/80x80?text=Chat" }} style={styles.convAvatar} />
//                 <View style={{ flex: 1, minWidth: 0 }}>
//                   <Text numberOfLines={1} style={[styles.convTitle, active && styles.convTitleActive]}>
//                     {title}
//                   </Text>
//                   <Text numberOfLines={1} style={[styles.convMeta, active && styles.convMetaActive]}>
//                     #{item.id} • {item.type}
//                   </Text>
//                 </View>
//                 <Ionicons name="chevron-forward" size={16} color={active ? "#fff" : COLORS.subtext} />
//               </TouchableOpacity>
//             );
//           }}
//         />
//       )}
//     </View>
//   );
// }

// /* ------------------------------ Chat Window ------------------------------ */
// function ChatWindow({ auth, headers, conversation, onMessageSent, onBack }) {
//   const listRef = useRef(null);
//   const [loading, setLoading] = useState(true);
//   const [err, setErr] = useState(null);
//   const [messages, setMessages] = useState([]);
//   const [text, setText] = useState("");
//   const [sending, setSending] = useState(false);

//   const convId = conversation?.id;

//   const load = useCallback(async () => {
//     if (!convId) return;
//     setLoading(true);
//     setErr(null);
//     try {
//       const res = await fetch(`${API_BASE_URL}/conversations/${convId}/messages`, { headers });
//       if (!res.ok) throw new Error(`HTTP ${res.status}`);
//       const data = await res.json();
//       const rows = Array.isArray(data) ? data : data?.messages || [];
//       rows.sort((a, b) => new Date(a.created_at) - new Date(b.created_at));
//       setMessages(rows);

//       // mark unread (others') as read
//       const myId = Number(auth.userId);
//       rows.forEach(async (m) => {
//         if (m.sender_id !== myId && !m.read_at && m.id) {
//           try {
//             await fetch(`${API_BASE_URL}/messages/${m.id}/read`, { method: "POST", headers });
//           } catch {}
//         }
//       });

//       requestAnimationFrame(() => listRef.current?.scrollToEnd?.({ animated: true }));
//     } catch (e) {
//       setErr(e?.message || "Failed to load messages");
//       setMessages([]);
//     } finally {
//       setLoading(false);
//     }
//   }, [convId, headers, auth.userId]);

//   useEffect(() => {
//     load();
//   }, [load]);

//   const send = async () => {
//     const body = (text || "").trim();
//     if (!body || sending || !convId) return;
//     setSending(true);

//     // optimistic bubble
//     const tempId = `tmp-${Date.now()}`;
//     const optimistic = {
//       id: tempId,
//       sender_id: Number(auth.userId),
//       content: body,
//       message_type: "text",
//       created_at: new Date().toISOString(),
//     };
//     setMessages((m) => [...m, optimistic]);
//     setText("");
//     requestAnimationFrame(() => listRef.current?.scrollToEnd?.({ animated: true }));

//     try {
//       const res = await fetch(`${API_BASE_URL}/conversations/${convId}/messages`, {
//         method: "POST",
//         headers: { ...headers, "Content-Type": "application/json" }, // ✅ JSON only on POST
//         body: JSON.stringify({ content: body, message_type: "text" }),
//       });
//       if (!res.ok) throw new Error(`HTTP ${res.status}`);
//       const saved = await res.json();
//       setMessages((m) => m.map((x) => (x.id === tempId ? saved : x)));
//       onMessageSent?.();
//     } catch {
//       setMessages((m) => m.filter((x) => x.id !== tempId));
//     } finally {
//       setSending(false);
//     }
//   };

//   const onKeyDown = (e) => {
//     if (Platform.OS === "web") {
//       if (e.key === "Enter" && !e.shiftKey) {
//         e.preventDefault();
//         send();
//       }
//     }
//   };

//   const title = conversation?.title || (conversation?.type === "direct" ? "Direct Message" : "Group Chat");

//   return (
//     <View style={styles.chatWrap}>
//       {/* header */}
//       <View style={styles.chatHeader}>
//         {onBack ? (
//           <TouchableOpacity onPress={onBack} style={styles.backBtn} accessibilityLabel="Back to conversations">
//             <Ionicons name="arrow-back" size={20} color={COLORS.text} />
//           </TouchableOpacity>
//         ) : null}
//         <Image source={{ uri: "https://placehold.co/80x80?text=DM" }} style={styles.convAvatar} />
//         <View style={{ flex: 1, minWidth: 0 }}>
//           <Text style={styles.chatTitle} numberOfLines={1}>
//             {title}
//           </Text>
//           <Text style={styles.chatMeta} numberOfLines={1}>
//             #{conversation?.id} • {conversation?.type}
//           </Text>
//         </View>
//       </View>

//       {/* message list */}
//       <View style={styles.chatBody}>
//         {loading ? (
//           <View style={styles.centerWrap}>
//             <ActivityIndicator />
//             <Text style={styles.meta}>Loading…</Text>
//           </View>
//         ) : err ? (
//           <ErrorBanner text={err} onRetry={load} />
//         ) : messages.length === 0 ? (
//           <View style={styles.centerWrap}>
//             <Text style={styles.meta}>No messages — say hello 👋</Text>
//           </View>
//         ) : (
//           <FlatList
//             ref={listRef}
//             data={messages}
//             keyExtractor={(m, i) => String(m.id ?? i)}
//             renderItem={({ item }) => <Bubble item={item} me={Number(auth.userId)} />}
//             contentContainerStyle={{ padding: 14 }}
//             onContentSizeChange={() => listRef.current?.scrollToEnd?.({ animated: true })}
//           />
//         )}
//       </View>

//       {/* composer */}
//       <View style={styles.composer}>
//         <TextInput
//           style={styles.input}
//           placeholder="Type a message (Shift+Enter for newline)"
//           placeholderTextColor="#8CA0B3"
//           value={text}
//           onChangeText={setText}
//           onKeyDown={onKeyDown}
//           multiline
//         />
//         <TouchableOpacity
//           onPress={send}
//           disabled={!text.trim() || sending}
//           activeOpacity={0.9}
//           style={[styles.sendBtn, (!text.trim() || sending) && { opacity: 0.6 }]}
//         >
//           <Ionicons name="send" size={16} color="#fff" />
//           <Text style={styles.sendText}>Send</Text>
//         </TouchableOpacity>
//       </View>
//     </View>
//   );
// }

// /* ------------------------------ Small UI ------------------------------ */
// function ErrorBanner({ text, onRetry }) {
//   return (
//     <View style={styles.errorBanner}>
//       <Ionicons name="alert-circle" size={18} color="#B42318" style={{ marginRight: 6 }} />
//       <Text style={styles.errorText}>{text}</Text>
//       {onRetry ? (
//         <TouchableOpacity onPress={onRetry} style={{ marginLeft: "auto" }}>
//           <Text style={styles.link}>Retry</Text>
//         </TouchableOpacity>
//       ) : null}
//     </View>
//   );
// }

// function Bubble({ item, me }) {
//   const mine = Number(item.sender_id) === Number(me);
//   const text = item.content ?? item.text ?? "";
//   return (
//     <View style={[styles.bubble, mine ? styles.bubbleMine : styles.bubbleTheirs]}>
//       {!!text && <Text style={[styles.bubbleText, mine && styles.bubbleTextMine]}>{text}</Text>}
//       {item.created_at ? (
//         <Text style={[styles.bubbleTime, mine && styles.bubbleTimeMine]}>
//           {new Date(item.created_at).toLocaleString()}
//         </Text>
//       ) : null}
//     </View>
//   );
// }

// /* ------------------------------ Styles ------------------------------ */
// const COLORS = {
//   page: "#F6FAFD",
//   bg: "#FFFFFF",
//   text: "#0F3A6B",
//   subtext: "#64748B",
//   primary: "#0F70F0",
//   border: "#E9EDF2",
//   soft: "#F7FAFD",
// };

// const styles = StyleSheet.create({
//   page: { flex: 1, backgroundColor: COLORS.page },

//   headerBar: {
//     paddingHorizontal: 20,
//     paddingTop: 18,
//     paddingBottom: 10,
//     ...(Platform.OS === "web" ? { maxWidth: 1400, alignSelf: "center", width: "100%" } : {}),
//   },
//   h1: { fontSize: 24, fontWeight: "800", color: COLORS.text, letterSpacing: 0.2 },
//   hint: { marginTop: 4, fontSize: 14, color: COLORS.subtext },

//   /* Full-height shell */
//   shell: {
//     flex: 1,
//     flexDirection: "row",
//     backgroundColor: COLORS.bg,
//     borderTopWidth: 1,
//     borderColor: COLORS.border,
//     ...(Platform.OS === "web" ? { maxWidth: 1400, alignSelf: "center", width: "100%" } : {}),
//   },
//   shellNarrow: { flexDirection: "column" },

//   leftPane: {
//     width: 360,
//     borderRightWidth: 1,
//     borderColor: COLORS.border,
//     backgroundColor: "#FFF",
//   },
//   leftPaneNarrow: { width: "100%", borderRightWidth: 0 },

//   rightPane: { flex: 1, backgroundColor: "#FFF" },
//   rightPaneNarrow: { width: "100%" },

//   /* left list internals */
//   leftWrap: { flex: 1 },
//   listHeader: {
//     flexDirection: "row",
//     alignItems: "center",
//     paddingHorizontal: 12,
//     paddingVertical: 10,
//     borderBottomWidth: 1,
//     borderColor: COLORS.border,
//   },
//   listTitle: { fontWeight: "800", color: COLORS.text, fontSize: 15 },
//   refreshBtn: {
//     marginLeft: "auto",
//     flexDirection: "row",
//     alignItems: "center",
//     gap: 6,
//     paddingHorizontal: 10,
//     paddingVertical: 6,
//     borderRadius: 999,
//     borderWidth: 1,
//     borderColor: COLORS.border,
//     backgroundColor: "#EEF3F9",
//   },
//   refreshText: { color: COLORS.text, fontWeight: "700", fontSize: 12 },

//   searchRow: {
//     margin: 10,
//     marginTop: 8,
//     flexDirection: "row",
//     alignItems: "center",
//     gap: 8,
//     paddingHorizontal: 10,
//     paddingVertical: Platform.OS === "ios" ? 10 : 8,
//     borderRadius: 12,
//     borderWidth: 1,
//     borderColor: COLORS.border,
//     backgroundColor: "#FFFFFF",
//   },
//   searchInput: { flex: 1, color: COLORS.text, fontSize: 14 },

//   convRow: {
//     flexDirection: "row",
//     alignItems: "center",
//     gap: 10,
//     paddingHorizontal: 12,
//     paddingVertical: 12,
//   },
//   convRowActive: { backgroundColor: "#0F70F0" },
//   convAvatar: { width: 38, height: 38, borderRadius: 19, backgroundColor: "#DDE7F2" },
//   convTitle: { fontWeight: "700", color: "#0F172A" },
//   convTitleActive: { color: "#fff" },
//   convMeta: { color: COLORS.subtext, fontSize: 12 },
//   convMetaActive: { color: "rgba(255,255,255,0.9)" },
//   sepThin: { height: 1, backgroundColor: "#F1F5F9" },

//   /* right chat */
//   chatWrap: { flex: 1, backgroundColor: COLORS.soft },
//   chatHeader: {
//     flexDirection: "row",
//     alignItems: "center",
//     gap: 10,
//     paddingHorizontal: 12,
//     paddingVertical: 10,
//     borderBottomWidth: 1,
//     borderColor: COLORS.border,
//     backgroundColor: "#FFFFFF",
//   },
//   backBtn: { padding: 6, borderRadius: 999, backgroundColor: "#EEF3F9" },
//   chatTitle: { fontWeight: "800", color: "#0F172A" },
//   chatMeta: { color: COLORS.subtext, fontSize: 12 },

//   chatBody: { flex: 1 },

//   composer: {
//     flexDirection: "row",
//     alignItems: "flex-end",
//     gap: 8,
//     paddingHorizontal: 12,
//     paddingVertical: 10,
//     borderTopWidth: 1,
//     borderColor: COLORS.border,
//     backgroundColor: "#FFFFFF",
//   },
//   input: {
//     flex: 1,
//     minHeight: 44,
//     maxHeight: 160,
//     paddingHorizontal: 12,
//     paddingVertical: 10,
//     borderWidth: 1,
//     borderColor: COLORS.border,
//     borderRadius: 12,
//     backgroundColor: "#F9FBFE",
//     color: "#0F172A",
//     fontSize: 15,
//   },
//   sendBtn: {
//     flexDirection: "row",
//     alignItems: "center",
//     gap: 6,
//     paddingHorizontal: 16,
//     paddingVertical: 10,
//     borderRadius: 12,
//     backgroundColor: COLORS.primary,
//   },
//   sendText: { color: "#fff", fontWeight: "800" },

//   /* misc */
//   rightEmpty: { flex: 1, alignItems: "center", justifyContent: "center" },
//   centerWrap: { alignItems: "center", justifyContent: "center", padding: 24 },
//   meta: { color: COLORS.subtext, fontWeight: "600" },

//   errorBanner: {
//     flexDirection: "row",
//     alignItems: "center",
//     paddingHorizontal: 12,
//     paddingVertical: 10,
//     margin: 12,
//     borderRadius: 12,
//     backgroundColor: "#FEF3F2",
//     borderWidth: 1,
//     borderColor: "#FEE4E2",
//   },
//   errorText: { color: "#B42318", fontWeight: "600" },
//   link: { color: "#0F70F0", fontWeight: "700" },

//   /* bubbles */
//   bubble: {
//     maxWidth: "75%",
//     borderRadius: 18,
//     paddingHorizontal: 12,
//     paddingVertical: 8,
//     marginBottom: 8,
//     alignSelf: "flex-start",
//     backgroundColor: "#EEF3F9",
//   },
//   bubbleMine: { alignSelf: "flex-end", backgroundColor: COLORS.primary },
//   bubbleTheirs: { backgroundColor: "#EEF3F9" },
//   bubbleText: { color: "#0F172A" },
//   bubbleTextMine: { color: "#FFFFFF" },
//   bubbleTime: { marginTop: 6, fontSize: 10, color: "#475569", opacity: 0.9 },
//   bubbleTimeMine: { color: "rgba(255,255,255,0.9)" },
// });


// components/Social/Messages.js
import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Platform,
  FlatList,
  TouchableOpacity,
  TextInput,
  ActivityIndicator,
  Image,
  SafeAreaView,
  useWindowDimensions,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Ionicons } from "@expo/vector-icons";
import getBaseURL from "../../config/env";

const API_BASE_URL = getBaseURL();

/* ------------------------------ Root Screen ------------------------------ */
export default function Messages() {
  const { width } = useWindowDimensions();
  const isNarrow = width < 900;

  const [auth, setAuth] = useState({ token: null, userId: null });
  const [selected, setSelected] = useState(null);
  const [refreshFlag, setRefreshFlag] = useState(0);

  useEffect(() => {
    (async () => {
      const [[, token], [, userIdRaw]] = await AsyncStorage.multiGet(["token", "userId"]);
      setAuth({ token: token || null, userId: userIdRaw ? Number(userIdRaw) : null });
    })();
  }, []);

  const authHeaders = useMemo(() => {
    const h = {};
    if (auth.token) h.Authorization = `Bearer ${auth.token}`;
    return h;
  }, [auth.token]);

  return (
    <SafeAreaView style={styles.page}>
      <View style={styles.headerBar}>
        <Text style={styles.h1}>Messages</Text>
        <Text style={styles.hint}>Your direct and group conversations.</Text>
      </View>

      <View style={[styles.shell, isNarrow && styles.shellNarrow]}>
        {(!isNarrow || !selected) && (
          <View style={[styles.leftPane, isNarrow && styles.leftPaneNarrow]}>
            <ConversationsList
              auth={auth}
              headers={authHeaders}
              refreshKey={refreshFlag}
              onSelect={setSelected}
              selectedId={selected?.id}
            />
          </View>
        )}

        {(!isNarrow || selected) && (
          <View style={[styles.rightPane, isNarrow && styles.rightPaneNarrow]}>
            {selected ? (
              <ChatWindow
                auth={auth}
                headers={authHeaders}
                conversation={selected}
                onMessageSent={() => setRefreshFlag((n) => n + 1)}
                onBack={isNarrow ? () => setSelected(null) : undefined}
              />
            ) : (
              !isNarrow && (
                <View style={styles.rightEmpty}>
                  <Text style={styles.meta}>Pick a conversation from the left.</Text>
                </View>
              )
            )}
          </View>
        )}
      </View>
    </SafeAreaView>
  );
}

/* --------------------------- Conversations List -------------------------- */
function ConversationsList({ auth, headers, refreshKey, selectedId, onSelect }) {
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState(null);
  const [items, setItems] = useState([]);
  const [search, setSearch] = useState("");

  const fetchConversations = useCallback(async () => {
    if (!auth.userId) return;
    setLoading(true);
    setErr(null);
    try {
      const res = await fetch(`${API_BASE_URL}/users/${auth.userId}/conversations`, { headers });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = await res.json();
      setItems(Array.isArray(data) ? data : data?.conversations || []);
    } catch (e) {
      setErr(e?.message || "Failed to load conversations");
      setItems([]);
    } finally {
      setLoading(false);
    }
  }, [auth.userId, headers]);

  useEffect(() => {
    fetchConversations();
  }, [fetchConversations, refreshKey]);

  // 🔥 Helper to get conversation display name
  const getConvTitle = (conv) => {
    if (conv.title) return conv.title;
    
    if (conv.type === "direct" && conv.members) {
      // Find the other person
      const otherPerson = conv.members.find((m) => m.id !== auth.userId);
      if (otherPerson) {
        const name = `${otherPerson.first_name || ""} ${otherPerson.last_name || ""}`.trim();
        return name || otherPerson.email || "User";
      }
    }
    
    return conv.type === "direct" ? "Direct Message" : "Group Chat";
  };

  // 🔥 Helper to get avatar
  const getConvAvatar = (conv) => {
    if (conv.type === "direct" && conv.members) {
      const otherPerson = conv.members.find((m) => m.id !== auth.userId);
      if (otherPerson) {
        const name = `${otherPerson.first_name || ""} ${otherPerson.last_name || ""}`.trim();
        return `https://ui-avatars.com/api/?name=${encodeURIComponent(name || "User")}&background=0F70F0&color=fff`;
      }
    }
    return "https://ui-avatars.com/api/?name=Chat&background=64748B&color=fff";
  };

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return items;
    return items.filter((c) => {
      const title = getConvTitle(c).toLowerCase();
      return title.includes(q) || String(c.id).includes(q);
    });
  }, [items, search, auth.userId]);

  if (!auth.userId) {
    return (
      <View style={styles.leftWrap}>
        <Text style={styles.meta}>Please log in to view messages.</Text>
      </View>
    );
  }

  return (
    <View style={styles.leftWrap}>
      <View style={styles.listHeader}>
        <Text style={styles.listTitle}>Inbox</Text>
        <TouchableOpacity onPress={fetchConversations} style={styles.refreshBtn} activeOpacity={0.9}>
          <Ionicons name="refresh" size={16} color={COLORS.text} />
          <Text style={styles.refreshText}>Refresh</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.searchRow}>
        <Ionicons name={Platform.OS === "ios" ? "search" : "search-outline"} size={18} color={COLORS.subtext} />
        <TextInput
          value={search}
          onChangeText={setSearch}
          placeholder="Search conversations…"
          placeholderTextColor="#8CA0B3"
          style={styles.searchInput}
        />
      </View>

      {loading ? (
        <View style={styles.centerWrap}>
          <ActivityIndicator />
          <Text style={styles.meta}>Loading conversations…</Text>
        </View>
      ) : err ? (
        <ErrorBanner text={err} onRetry={fetchConversations} />
      ) : filtered.length === 0 ? (
        <View style={styles.centerWrap}>
          <Text style={styles.meta}>No conversations{search ? " match your search." : "."}</Text>
        </View>
      ) : (
        <FlatList
          data={filtered}
          keyExtractor={(c) => String(c.id)}
          ItemSeparatorComponent={() => <View style={styles.sepThin} />}
          contentContainerStyle={{ paddingBottom: 10 }}
          renderItem={({ item }) => {
            const active = item.id === selectedId;
            const title = getConvTitle(item);
            const avatarUri = getConvAvatar(item);
            
            return (
              <TouchableOpacity
                onPress={() => onSelect?.(item)}
                activeOpacity={0.9}
                style={[styles.convRow, active && styles.convRowActive]}
              >
                <Image source={{ uri: avatarUri }} style={styles.convAvatar} />
                <View style={{ flex: 1, minWidth: 0 }}>
                  <Text numberOfLines={1} style={[styles.convTitle, active && styles.convTitleActive]}>
                    {title}
                  </Text>
                  <Text numberOfLines={1} style={[styles.convMeta, active && styles.convMetaActive]}>
                    {item.type === "direct" ? "Direct Message" : `Group • ${item.members?.length || 0} members`}
                  </Text>
                </View>
                <Ionicons name="chevron-forward" size={16} color={active ? "#fff" : COLORS.subtext} />
              </TouchableOpacity>
            );
          }}
        />
      )}
    </View>
  );
}

/* ------------------------------ Chat Window ------------------------------ */
function ChatWindow({ auth, headers, conversation, onMessageSent, onBack }) {
  const listRef = useRef(null);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState(null);
  const [messages, setMessages] = useState([]);
  const [text, setText] = useState("");
  const [sending, setSending] = useState(false);

  const convId = conversation?.id;

  // 🔥 Get conversation title
  const getConvTitle = () => {
    if (conversation.title) return conversation.title;
    
    if (conversation.type === "direct" && conversation.members) {
      const otherPerson = conversation.members.find((m) => m.id !== auth.userId);
      if (otherPerson) {
        const name = `${otherPerson.first_name || ""} ${otherPerson.last_name || ""}`.trim();
        return name || otherPerson.email || "User";
      }
    }
    
    return conversation.type === "direct" ? "Direct Message" : "Group Chat";
  };

  // 🔥 Get avatar
  const getConvAvatar = () => {
    if (conversation.type === "direct" && conversation.members) {
      const otherPerson = conversation.members.find((m) => m.id !== auth.userId);
      if (otherPerson) {
        const name = `${otherPerson.first_name || ""} ${otherPerson.last_name || ""}`.trim();
        return `https://ui-avatars.com/api/?name=${encodeURIComponent(name || "User")}&background=0F70F0&color=fff`;
      }
    }
    return "https://ui-avatars.com/api/?name=Chat&background=64748B&color=fff";
  };

  const load = useCallback(async () => {
    if (!convId) return;
    setLoading(true);
    setErr(null);
    try {
      const res = await fetch(`${API_BASE_URL}/conversations/${convId}/messages`, { headers });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = await res.json();
      const rows = Array.isArray(data) ? data : data?.messages || [];
      rows.sort((a, b) => new Date(a.created_at) - new Date(b.created_at));
      setMessages(rows);

      // Mark unread as read
      const myId = Number(auth.userId);
      rows.forEach(async (m) => {
        if (m.sender_id !== myId && !m.read_at && m.id) {
          try {
            await fetch(`${API_BASE_URL}/messages/${m.id}/read`, { method: "POST", headers });
          } catch {}
        }
      });

      requestAnimationFrame(() => listRef.current?.scrollToEnd?.({ animated: true }));
    } catch (e) {
      setErr(e?.message || "Failed to load messages");
      setMessages([]);
    } finally {
      setLoading(false);
    }
  }, [convId, headers, auth.userId]);

  useEffect(() => {
    load();
  }, [load]);

  const send = async () => {
    const body = (text || "").trim();
    if (!body || sending || !convId) return;
    setSending(true);

    const tempId = `tmp-${Date.now()}`;
    const optimistic = {
      id: tempId,
      sender_id: Number(auth.userId),
      content: body,
      message_type: "text",
      created_at: new Date().toISOString(),
    };
    setMessages((m) => [...m, optimistic]);
    setText("");
    requestAnimationFrame(() => listRef.current?.scrollToEnd?.({ animated: true }));

    try {
      const res = await fetch(`${API_BASE_URL}/conversations/${convId}/messages`, {
        method: "POST",
        headers: { ...headers, "Content-Type": "application/json" },
        body: JSON.stringify({ content: body, message_type: "text" }),
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const saved = await res.json();
      setMessages((m) => m.map((x) => (x.id === tempId ? saved : x)));
      onMessageSent?.();
    } catch {
      setMessages((m) => m.filter((x) => x.id !== tempId));
    } finally {
      setSending(false);
    }
  };

  const onKeyDown = (e) => {
    if (Platform.OS === "web") {
      if (e.key === "Enter" && !e.shiftKey) {
        e.preventDefault();
        send();
      }
    }
  };

  const title = getConvTitle();
  const avatarUri = getConvAvatar();

  return (
    <View style={styles.chatWrap}>
      <View style={styles.chatHeader}>
        {onBack ? (
          <TouchableOpacity onPress={onBack} style={styles.backBtn} accessibilityLabel="Back to conversations">
            <Ionicons name="arrow-back" size={20} color={COLORS.text} />
          </TouchableOpacity>
        ) : null}
        <Image source={{ uri: avatarUri }} style={styles.convAvatar} />
        <View style={{ flex: 1, minWidth: 0 }}>
          <Text style={styles.chatTitle} numberOfLines={1}>
            {title}
          </Text>
          <Text style={styles.chatMeta} numberOfLines={1}>
            {conversation.type === "direct" ? "Direct Message" : `Group • ${conversation.members?.length || 0} members`}
          </Text>
        </View>
      </View>

      <View style={styles.chatBody}>
        {loading ? (
          <View style={styles.centerWrap}>
            <ActivityIndicator />
            <Text style={styles.meta}>Loading…</Text>
          </View>
        ) : err ? (
          <ErrorBanner text={err} onRetry={load} />
        ) : messages.length === 0 ? (
          <View style={styles.centerWrap}>
            <Text style={styles.meta}>No messages — say hello 👋</Text>
          </View>
        ) : (
          <FlatList
            ref={listRef}
            data={messages}
            keyExtractor={(m, i) => String(m.id ?? i)}
            renderItem={({ item }) => <Bubble item={item} me={Number(auth.userId)} />}
            contentContainerStyle={{ padding: 14 }}
            onContentSizeChange={() => listRef.current?.scrollToEnd?.({ animated: true })}
          />
        )}
      </View>

      <View style={styles.composer}>
        <TextInput
          style={styles.input}
          placeholder="Type a message (Shift+Enter for newline)"
          placeholderTextColor="#8CA0B3"
          value={text}
          onChangeText={setText}
          onKeyDown={onKeyDown}
          multiline
        />
        <TouchableOpacity
          onPress={send}
          disabled={!text.trim() || sending}
          activeOpacity={0.9}
          style={[styles.sendBtn, (!text.trim() || sending) && { opacity: 0.6 }]}
        >
          <Ionicons name="send" size={16} color="#fff" />
          <Text style={styles.sendText}>Send</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

/* ------------------------------ Small UI ------------------------------ */
function ErrorBanner({ text, onRetry }) {
  return (
    <View style={styles.errorBanner}>
      <Ionicons name="alert-circle" size={18} color="#B42318" style={{ marginRight: 6 }} />
      <Text style={styles.errorText}>{text}</Text>
      {onRetry ? (
        <TouchableOpacity onPress={onRetry} style={{ marginLeft: "auto" }}>
          <Text style={styles.link}>Retry</Text>
        </TouchableOpacity>
      ) : null}
    </View>
  );
}

function Bubble({ item, me }) {
  const mine = Number(item.sender_id) === Number(me);
  const text = item.content ?? item.text ?? "";
  
  // 🔥 Get sender name
  const senderName = item.sender 
    ? `${item.sender.first_name || ""} ${item.sender.last_name || ""}`.trim() || item.sender.email || "User"
    : "Unknown";

  return (
    <View style={[styles.bubble, mine ? styles.bubbleMine : styles.bubbleTheirs]}>
      {/* 🔥 Show sender name for non-mine messages */}
      {!mine && (
        <Text style={styles.senderName}>{senderName}</Text>
      )}
      {!!text && <Text style={[styles.bubbleText, mine && styles.bubbleTextMine]}>{text}</Text>}
      {item.created_at ? (
        <Text style={[styles.bubbleTime, mine && styles.bubbleTimeMine]}>
          {new Date(item.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
        </Text>
      ) : null}
    </View>
  );
}

/* ------------------------------ Styles ------------------------------ */
const COLORS = {
  page: "#F6FAFD",
  bg: "#FFFFFF",
  text: "#0F3A6B",
  subtext: "#64748B",
  primary: "#0F70F0",
  border: "#E9EDF2",
  soft: "#F7FAFD",
};

const styles = StyleSheet.create({
  page: { flex: 1, backgroundColor: COLORS.page },

  headerBar: {
    paddingHorizontal: 20,
    paddingTop: 18,
    paddingBottom: 10,
    ...(Platform.OS === "web" ? { maxWidth: 1400, alignSelf: "center", width: "100%" } : {}),
  },
  h1: { fontSize: 24, fontWeight: "800", color: COLORS.text, letterSpacing: 0.2 },
  hint: { marginTop: 4, fontSize: 14, color: COLORS.subtext },

  shell: {
    flex: 1,
    flexDirection: "row",
    backgroundColor: COLORS.bg,
    borderTopWidth: 1,
    borderColor: COLORS.border,
    ...(Platform.OS === "web" ? { maxWidth: 1400, alignSelf: "center", width: "100%" } : {}),
  },
  shellNarrow: { flexDirection: "column" },

  leftPane: {
    width: 360,
    borderRightWidth: 1,
    borderColor: COLORS.border,
    backgroundColor: "#FFF",
  },
  leftPaneNarrow: { width: "100%", borderRightWidth: 0 },

  rightPane: { flex: 1, backgroundColor: "#FFF" },
  rightPaneNarrow: { width: "100%" },

  leftWrap: { flex: 1 },
  listHeader: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderColor: COLORS.border,
  },
  listTitle: { fontWeight: "800", color: COLORS.text, fontSize: 15 },
  refreshBtn: {
    marginLeft: "auto",
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: COLORS.border,
    backgroundColor: "#EEF3F9",
  },
  refreshText: { color: COLORS.text, fontWeight: "700", fontSize: 12 },

  searchRow: {
    margin: 10,
    marginTop: 8,
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    paddingHorizontal: 10,
    paddingVertical: Platform.OS === "ios" ? 10 : 8,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: COLORS.border,
    backgroundColor: "#FFFFFF",
  },
  searchInput: { flex: 1, color: COLORS.text, fontSize: 14 },

  convRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    paddingHorizontal: 12,
    paddingVertical: 12,
  },
  convRowActive: { backgroundColor: "#0F70F0" },
  convAvatar: { width: 38, height: 38, borderRadius: 19, backgroundColor: "#DDE7F2" },
  convTitle: { fontWeight: "700", color: "#0F172A" },
  convTitleActive: { color: "#fff" },
  convMeta: { color: COLORS.subtext, fontSize: 12 },
  convMetaActive: { color: "rgba(255,255,255,0.9)" },
  sepThin: { height: 1, backgroundColor: "#F1F5F9" },

  chatWrap: { flex: 1, backgroundColor: COLORS.soft },
  chatHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderColor: COLORS.border,
    backgroundColor: "#FFFFFF",
  },
  backBtn: { padding: 6, borderRadius: 999, backgroundColor: "#EEF3F9" },
  chatTitle: { fontWeight: "800", color: "#0F172A" },
  chatMeta: { color: COLORS.subtext, fontSize: 12 },

  chatBody: { flex: 1 },

  composer: {
    flexDirection: "row",
    alignItems: "flex-end",
    gap: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderTopWidth: 1,
    borderColor: COLORS.border,
    backgroundColor: "#FFFFFF",
  },
  input: {
    flex: 1,
    minHeight: 44,
    maxHeight: 160,
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 12,
    backgroundColor: "#F9FBFE",
    color: "#0F172A",
    fontSize: 15,
  },
  sendBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 12,
    backgroundColor: COLORS.primary,
  },
  sendText: { color: "#fff", fontWeight: "800" },

  rightEmpty: { flex: 1, alignItems: "center", justifyContent: "center" },
  centerWrap: { alignItems: "center", justifyContent: "center", padding: 24 },
  meta: { color: COLORS.subtext, fontWeight: "600" },

  errorBanner: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 12,
    paddingVertical: 10,
    margin: 12,
    borderRadius: 12,
    backgroundColor: "#FEF3F2",
    borderWidth: 1,
    borderColor: "#FEE4E2",
  },
  errorText: { color: "#B42318", fontWeight: "600" },
  link: { color: "#0F70F0", fontWeight: "700" },

  bubble: {
    maxWidth: "75%",
    borderRadius: 18,
    paddingHorizontal: 12,
    paddingVertical: 8,
    marginBottom: 8,
    alignSelf: "flex-start",
    backgroundColor: "#EEF3F9",
  },
  bubbleMine: { alignSelf: "flex-end", backgroundColor: COLORS.primary },
  bubbleTheirs: { backgroundColor: "#EEF3F9" },
  
  // 🔥 NEW: Sender name style
  senderName: {
    fontSize: 11,
    fontWeight: "700",
    color: COLORS.primary,
    marginBottom: 4,
  },
  
  bubbleText: { color: "#0F172A" },
  bubbleTextMine: { color: "#FFFFFF" },
  bubbleTime: { marginTop: 6, fontSize: 10, color: "#475569", opacity: 0.9 },
  bubbleTimeMine: { color: "rgba(255,255,255,0.9)" },
});