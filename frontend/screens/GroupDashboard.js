// screens/Groups/GroupDashboardScreen.js
import React, { useState, useMemo } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { View, Text, FlatList, Pressable, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";

const C = { primary:"#0F3A6B", border:"#E6EDF7", card:"#FFF", bg:"#F7F9FC", sub:"#6B7280" };

const ItemType = { ITINERARY:"itinerary", EVENT:"event", SERVICE:"service", POLL:"poll", NOTE:"note", FILE:"file" };

export default function GroupDashboardScreen({ route, navigation }) {
  const me = { id: 12, role: "admin" }; // dummy current user
  const [tab, setTab] = useState("feed");
  const [items, setItems] = useState(dummyItems); // from below

  const iconFor = (t) => ({
    [ItemType.ITINERARY]:"location-outline",
    [ItemType.EVENT]:"sparkles-outline",
    [ItemType.SERVICE]:"construct-outline",
    [ItemType.POLL]:"stats-chart-outline",
    [ItemType.NOTE]:"document-text-outline",
    [ItemType.FILE]:"attach-outline",
  }[t] || "information-circle-outline");

  const canDo = (item, action) => {
    const rules = item.permissions?.[action] || [];
    if (rules.includes("everyone")) return true;
    if (item.ownerId === me.id) return true;
    if (me.role === "admin" && rules.includes("role:admin")) return true;
    if (rules.includes(`user:${me.id}`)) return true;
    return false;
  };

  const filtered = useMemo(() => {
    if (tab === "feed") return items;
    if (tab === "polls") return items.filter(x => x.type === ItemType.POLL);
    if (tab === "items") return items.filter(x => x.type !== ItemType.POLL);
    return items;
  }, [tab, items]);

  const ActionBtn = ({ onPress, icon, label, disabled }) => (
    <Pressable onPress={onPress} disabled={disabled} style={[s.action, disabled && { opacity: 0.4 }]}>
      <Ionicons name={icon} size={16} color={C.primary} />
      <Text style={s.actionTxt}>{label}</Text>
    </Pressable>
  );

  const FeedCard = ({ item }) => (
    <View style={s.card}>
      <View style={s.cardTop}>
        <View style={s.iconWrap}><Ionicons name={iconFor(item.type)} size={18} color={C.primary}/></View>
        <View style={{ flex:1 }}>
          <Text style={s.title}>{item.title}</Text>
          {!!item.summary && <Text style={s.summary}>{item.summary}</Text>}
        </View>
        <Text style={s.time}>{item.lastActivityAt}</Text>
      </View>

      <View style={s.row}>
        {item.type !== ItemType.POLL && (
          <>
            <ActionBtn icon="heart-outline" label={`Like (${item.stats?.likes||0})`} disabled={!canDo(item,"like")} />
            <ActionBtn icon="chatbubble-ellipses-outline" label={`Comment (${item.stats?.comments||0})`} disabled={!canDo(item,"comment")} />
            <ActionBtn icon="create-outline" label="Edit" disabled={!canDo(item,"edit")} />
          </>
        )}
        {item.type === ItemType.POLL && (
          <>
            <ActionBtn icon="checkmark-circle-outline" label={`Yes (${item.stats?.votes?.yes||0})`} disabled={!canDo(item,"vote")} />
            <ActionBtn icon="close-circle-outline" label={`No (${item.stats?.votes?.no||0})`} disabled={!canDo(item,"vote")} />
          </>
        )}
        <Pressable style={s.more}><Ionicons name="ellipsis-horizontal" size={18} color={C.sub} /></Pressable>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={{ flex:1, backgroundColor: C.bg }}>
      {/* Header */}
      <View style={s.appbar}>
        <Pressable onPress={() => navigation.goBack()} style={s.icon}><Ionicons name="arrow-back" size={20} color={C.primary}/></Pressable>
        <Text style={s.headerTitle}>Group Dashboard</Text>
        <Pressable style={s.icon}><Ionicons name="settings-outline" size={20} color={C.primary}/></Pressable>
      </View>

      {/* Tabs */}
      <View style={s.tabs}>
        {["feed","items","polls","chat","people"].map(key => (
          <Pressable key={key} onPress={() => setTab(key)} style={[s.tab, tab===key && s.tabActive]}>
            <Text style={[s.tabTxt, tab===key && s.tabTxtActive]}>{key.toUpperCase()}</Text>
          </Pressable>
        ))}
      </View>

      {/* Content */}
      {tab === "chat" ? (
        <View style={{ padding:16 }}><Text>Chat (dummy for now)</Text></View>
      ) : tab === "people" ? (
        <View style={{ padding:16 }}><Text>People (dummy for now)</Text></View>
      ) : (
        <FlatList
          data={filtered}
          keyExtractor={(x) => x.id}
          renderItem={({ item }) => <FeedCard item={item} />}
          contentContainerStyle={{ padding:16, paddingBottom:40 }}
          ItemSeparatorComponent={() => <View style={{ height:10 }} />}
          ListHeaderComponent={
            <View style={s.quickRow}>
              <Quick onPress={()=>{}} icon="share-social-outline" label="Share" />
              <Quick onPress={()=>setTab("polls")} icon="stats-chart-outline" label="Poll" />
              <Quick onPress={()=>setTab("chat")} icon="chatbubble-outline" label="Chat" />
              <Quick onPress={()=>setTab("items")} icon="albums-outline" label="Items" />
            </View>
          }
        />
      )}
    </SafeAreaView>
  );
}

/* quick action button */
const Quick = ({ onPress, icon, label }) => (
  <Pressable onPress={onPress} style={s.quick}>
    <Ionicons name={icon} size={18} color={C.primary}/>
    <Text style={s.quickTxt}>{label}</Text>
  </Pressable>
);

/* styles */
const s = StyleSheet.create({
  appbar:{ height:48, backgroundColor:C.card, borderBottomWidth:1, borderBottomColor:C.border,
    flexDirection:"row", alignItems:"center", justifyContent:"space-between", paddingHorizontal:10 },
  icon:{ padding:6 }, headerTitle:{ fontWeight:"800", color:C.primary, fontSize:16 },

  tabs:{ flexDirection:"row", gap:8, paddingHorizontal:10, paddingVertical:8, borderBottomWidth:1, borderBottomColor:C.border, backgroundColor:"#FAFCFF" },
  tab:{ paddingHorizontal:10, paddingVertical:6, borderRadius:999, backgroundColor:"#EEF3FF", borderWidth:1, borderColor:"#D9E4FF" },
  tabActive:{ backgroundColor:C.primary, borderColor:C.primary }, tabTxt:{ color:C.primary, fontWeight:"700" }, tabTxtActive:{ color:"#FFF" },

  quickRow:{ flexDirection:"row", gap:8, marginBottom:12 },
  quick:{ flexDirection:"row", alignItems:"center", gap:6, backgroundColor:"#EEF3FF", borderWidth:1, borderColor:"#D9E4FF", borderRadius:12, paddingHorizontal:12, paddingVertical:10 },
  quickTxt:{ color:C.primary, fontWeight:"800" },

  card:{ backgroundColor:C.card, borderRadius:14, borderWidth:1, borderColor:C.border, padding:12 },
  cardTop:{ flexDirection:"row", alignItems:"flex-start", gap:10 },
  iconWrap:{ width:30, height:30, borderRadius:15, backgroundColor:"#E7F0FF", alignItems:"center", justifyContent:"center", marginTop:2 },
  title:{ fontWeight:"800", color:C.primary }, summary:{ color:C.sub, marginTop:2 }, time:{ color:C.sub, fontSize:12 },

  row:{ flexDirection:"row", alignItems:"center", gap:10, marginTop:10 },
  action:{ flexDirection:"row", alignItems:"center", gap:6, backgroundColor:"#F3F6FA", borderWidth:1, borderColor:C.border, paddingHorizontal:10, paddingVertical:8, borderRadius:10 },
  actionTxt:{ color:C.primary, fontWeight:"700" },
  more:{ marginLeft:"auto", paddingHorizontal:6, paddingVertical:4 },
});

/* dummy data */
const dummyItems = [
  { id:"it_101", type:ItemType.ITINERARY, title:"3 days in Islamabad", summary:"Day 1 Faisal Mosque, Day 2 Trail 5, Day 3 Lok Virsa", ownerId:12, permissions:{ edit:["owner","role:admin","user:34"], vote:["everyone"], comment:["everyone"], like:["everyone"], view:["everyone"] }, stats:{ likes:7, comments:3 }, lastActivityAt:"2m" },
  { id:"ev_9", type:ItemType.EVENT, title:"Hunza Cultural Festival", summary:"Nov 20 • Karimabad", ownerId:17, permissions:{ edit:["owner","role:admin"], vote:["everyone"], comment:["everyone"], like:["everyone"], view:["everyone"] }, stats:{ likes:2, comments:1 }, lastActivityAt:"1h" },
  { id:"sv_2", type:ItemType.SERVICE, title:"Local Guide (Rs 3000/day)", summary:"Full-day guiding & itinerary advice", ownerId:21, permissions:{ edit:["owner"], vote:[], comment:["everyone"], like:["everyone"], view:["everyone"] }, stats:{ likes:4, comments:0 }, lastActivityAt:"3h" },
  { id:"pl_55", type:ItemType.POLL, title:"1-day trail trip to Islamabad?", summary:"Yes or No", ownerId:12, permissions:{ edit:["owner","role:admin"], vote:["everyone"], comment:["everyone"], like:[], view:["everyone"] }, stats:{ votes:{ yes:7, no:2 } }, lastActivityAt:"5m" },
];
