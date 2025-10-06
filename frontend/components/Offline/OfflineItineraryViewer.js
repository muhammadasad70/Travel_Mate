// import React, { useEffect, useState } from "react";
// import { View, Text, Image, ScrollView, Pressable, Alert } from "react-native";
// import { loadOfflineItinerary, queueChange } from "../../hooks/useOfflineItineraries";

// export default function OfflineItineraryViewer({ route }) {
//   const { id } = route.params;
//   const [it, setIt] = useState(null);

//   useEffect(() => { (async () => setIt(await loadOfflineItinerary(id)))(); }, [id]);

//   if (!it) return null;
//   const { data, assets } = it;

//   return (
//     <ScrollView style={{ flex:1, backgroundColor:"#F7F9FC" }} contentContainerStyle={{ padding:16 }}>
//       {!!assets.cover && <Image source={{ uri: assets.cover }} style={{ height:160, borderRadius:12, marginBottom:12 }} />}
//       <Text style={{ fontWeight:"800", fontSize:18 }}>{data.title}</Text>
//       <Text style={{ color:"#6B7280", marginBottom:10 }}>{data.city}</Text>

//       <Text style={{ fontWeight:"800", marginTop:10 }}>Overview</Text>
//       <Text style={{ color:"#374151" }}>{data.description || data.overview || "—"}</Text>

//       {!!assets.map && (
//         <>
//           <Text style={{ fontWeight:"800", marginTop:12 }}>Map (offline)</Text>
//           <Image source={{ uri: assets.map }} style={{ height:140, borderRadius:10 }} />
//         </>
//       )}

//       <Text style={{ fontWeight:"800", marginTop:12 }}>Daily Plan</Text>
//       {(data.days || []).map((d, idx) => (
//         <View key={idx} style={{ backgroundColor:"#fff", padding:12, borderRadius:10, borderWidth:1, borderColor:"#E6EDF7", marginTop:8 }}>
//           <Text style={{ fontWeight:"700" }}>Day {idx+1} — {d.place}</Text>
//           {!!d.time && <Text>Time: {d.time}</Text>}
//           <Text>Activities: {d.activities}</Text>

//           <Pressable
//             onPress={async ()=> {
//               await queueChange(data.id, { op:"toggle", path:`days.${idx}.confirmed`, value:true });
//               Alert.alert("Saved offline", "Will sync when you’re online.");
//             }}
//             style={{ marginTop:8, alignSelf:"flex-start" }}>
//             <Text style={{ color:"#0F3A6B", fontWeight:"800" }}>Mark as confirmed</Text>
//           </Pressable>
//         </View>
//       ))}
//     </ScrollView>
//   );
// }


// components/Offline/OfflineItineraryViewer.jsx
import React, { useEffect, useState } from "react";
import { View, Text, Image, ScrollView, Pressable, Alert } from "react-native";
import { SafeAreaView, useSafeAreaInsets } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { loadOfflineItinerary, queueChange } from "../../hooks/useOfflineItineraries";

const BORDER = "#E6EDF7";
const SOFT_BG = "#F7F9FC";
const EMPHASIS = "#0f172a";

export default function OfflineItineraryViewer({ route }) {
  const { id } = route.params;
  const [it, setIt] = useState(null);
  const nav = useNavigation();
  const insets = useSafeAreaInsets();

  useEffect(() => {
    (async () => setIt(await loadOfflineItinerary(id)))();
  }, [id]);

  if (!it || !it.data) {
    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: SOFT_BG, paddingTop: insets.top }}>
        <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
          <Text>Itinerary not found offline.</Text>
        </View>
      </SafeAreaView>
    );
  }

  const { data, assets } = it;
  const safeId = String(data.id ?? data._id); // normalize for queueChange

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: SOFT_BG, paddingTop: insets.top }}>
      <ScrollView contentContainerStyle={{ paddingBottom: 16 + insets.bottom }}>
        {/* Header */}
        <View style={{ paddingHorizontal: 16, paddingTop: 8, marginBottom: 8 }}>
          <Pressable
            onPress={() => nav.goBack()}
            style={{
              alignSelf: "flex-start",
              flexDirection: "row",
              alignItems: "center",
              gap: 8,
              backgroundColor: "#fff",
              borderRadius: 12,
              borderWidth: 1,
              borderColor: BORDER,
              paddingVertical: 8,
              paddingHorizontal: 12,
              marginBottom: 12,
            }}
          >
            <Ionicons name="arrow-back" size={18} color={EMPHASIS} />
            <Text style={{ fontWeight: "800", color: EMPHASIS }}>Back</Text>
          </Pressable>

          <Text style={{ fontWeight: "800", fontSize: 20 }}>{data.title}</Text>
          {!!data.city && <Text style={{ color: "#6B7280" }}>{data.city}</Text>}
        </View>

        {/* Cover (if saved) */}
        {!!assets?.cover && (
          <View
            style={{
              height: 160,
              borderRadius: 12,
              overflow: "hidden",
              marginHorizontal: 16,
              marginBottom: 12,
              borderWidth: 1,
              borderColor: BORDER,
              backgroundColor: "#fff",
            }}
          >
            <Image source={{ uri: assets.cover }} style={{ width: "100%", height: "100%" }} />
          </View>
        )}

        {/* Overview */}
        <View
          style={{
            backgroundColor: "#fff",
            borderWidth: 1,
            borderColor: BORDER,
            borderRadius: 16,
            padding: 14,
            marginHorizontal: 16,
            marginBottom: 12,
          }}
        >
          <Text style={{ fontWeight: "800", marginBottom: 6 }}>Overview</Text>
          <Text style={{ color: "#374151" }}>{data.description || data.overview || "—"}</Text>
        </View>

        {/* Map (if saved) */}
        {!!assets?.map && (
          <View
            style={{
              backgroundColor: "#fff",
              borderWidth: 1,
              borderColor: BORDER,
              borderRadius: 16,
              padding: 14,
              marginHorizontal: 16,
              marginBottom: 12,
            }}
          >
            <Text style={{ fontWeight: "800", marginBottom: 8 }}>Map (offline)</Text>
            <Image source={{ uri: assets.map }} style={{ height: 160, borderRadius: 12 }} />
          </View>
        )}

        {/* Daily plan */}
        <View style={{ paddingHorizontal: 16, marginTop: 4 }}>
          <Text style={{ fontWeight: "800", marginBottom: 6 }}>Daily Plan</Text>

          {(data.days || []).map((d, idx) => (
            <View
              key={idx}
              style={{
                backgroundColor: "#fff",
                padding: 12,
                borderRadius: 12,
                borderWidth: 1,
                borderColor: BORDER,
                marginBottom: 10,
              }}
            >
              <Text style={{ fontWeight: "700" }}>
                Day {idx + 1} — {d.place}
              </Text>
              {!!d.time && <Text>Time: {d.time}</Text>}
              {!!d.activities && <Text>Activities: {d.activities}</Text>}

              <Pressable
                onPress={async () => {
                  try {
                    await queueChange(safeId, { op: "toggle", path: `days.${idx}.confirmed`, value: true });
                    Alert.alert("Saved offline", "Will sync when you’re online.");
                  } catch (e) {
                    Alert.alert("Failed", String(e?.message || e));
                  }
                }}
                style={{ marginTop: 8, alignSelf: "flex-start" }}
              >
                <Text style={{ color: "#0F3A6B", fontWeight: "800" }}>Mark as confirmed</Text>
              </Pressable>
            </View>
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
