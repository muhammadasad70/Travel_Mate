// import React, { useEffect, useState } from "react";
// import { View, Text, FlatList, Pressable } from "react-native";
// import { useNavigation } from "@react-navigation/native";
// import { listOfflineItineraries } from "../../hooks/useOfflineItineraries";

// export default function OfflineCenterScreen() {
//   const nav = useNavigation();
//   const [items, setItems] = useState([]);

//   useEffect(() => { (async () => setItems(await listOfflineItineraries()))(); }, []);

//   return (
//     <View style={{ flex:1, backgroundColor:"#F7F9FC", padding:16 }}>
//       <Text style={{ fontWeight:"800", fontSize:18, marginBottom:10 }}>Offline Itineraries</Text>
//       <FlatList
//         data={items}
//         keyExtractor={(x)=>String(x.id)}
//         renderItem={({item}) => (
//           <Pressable
//             onPress={()=> nav.navigate("OfflineItineraryViewer", { id: item.id })}
//             style={{ backgroundColor:"#fff", padding:12, borderRadius:12, marginBottom:10, borderWidth:1, borderColor:"#E6EDF7" }}>
//             <Text style={{ fontWeight:"800" }}>{item.title}</Text>
//             <Text style={{ color:"#6B7280" }}>{item.city || "—"}</Text>
//           </Pressable>
//         )}
//         ListEmptyComponent={<Text>No downloads yet.</Text>}
//       />
//       <Pressable onPress={()=> nav.navigate("OfflineEmergency")} style={{ marginTop:8 }}>
//         <Text style={{ color:"#0F3A6B", fontWeight:"800" }}>Emergency info</Text>
//       </Pressable>
//     </View>
//   );
// }




// components/Offline/OfflineCenterScreen.jsx
import React, { useEffect, useState } from "react";
import { View, Text, FlatList, Pressable } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { SafeAreaView, useSafeAreaInsets } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { listOfflineItineraries } from "../../hooks/useOfflineItineraries";

export default function OfflineCenterScreen() {
  const nav = useNavigation();
  const insets = useSafeAreaInsets();
  const [items, setItems] = useState([]);

  useEffect(() => {
    (async () => setItems(await listOfflineItineraries()))();
  }, []);

  const Header = () => (
    <View style={{ paddingHorizontal: 16, paddingTop: 8, marginBottom: 12 }}>
      {/* Back pill */}
      <Pressable
        onPress={() => nav.navigate("TravelerDashboard")}
        style={{
          alignSelf: "flex-start",
          flexDirection: "row",
          alignItems: "center",
          gap: 8,
          backgroundColor: "#fff",
          borderWidth: 1,
          borderColor: "#E6EDF7",
          borderRadius: 12,
          paddingVertical: 8,
          paddingHorizontal: 12,
          marginBottom: 10,
        }}
      >
        <Ionicons name="arrow-back" size={18} color="#0f172a" />
        <Text style={{ fontWeight: "800", color: "#0f172a" }}>Back</Text>
      </Pressable>

      {/* Title + emergency action */}
      <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between" }}>
        <Text style={{ fontWeight: "800", fontSize: 18 }}>Offline Itineraries</Text>
        <Pressable
          onPress={() => nav.navigate("OfflineEmergency")}
          style={{
            flexDirection: "row",
            alignItems: "center",
            gap: 6,
            backgroundColor: "#E9F1FF",
            paddingVertical: 8,
            paddingHorizontal: 12,
            borderRadius: 999,
            borderWidth: 1,
            borderColor: "#D6E3FF",
          }}
        >
          <Ionicons name="shield-checkmark-outline" size={16} color="#0F3A6B" />
          <Text style={{ color: "#0F3A6B", fontWeight: "800" }}>Emergency info</Text>
        </Pressable>
      </View>
    </View>
  );

  const Item = ({ item }) => (
    <Pressable
      onPress={() => nav.navigate("OfflineItineraryViewer", { id: item.id })}
      style={{
        backgroundColor: "#fff",
        padding: 12,
        borderRadius: 12,
        marginBottom: 10,
        borderWidth: 1,
        borderColor: "#E6EDF7",
        marginHorizontal: 16,
      }}
    >
      <Text style={{ fontWeight: "800" }}>{item.title}</Text>
      <Text style={{ color: "#6B7280" }}>{item.city || "—"}</Text>
    </Pressable>
  );

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#F7F9FC", paddingTop: insets.top }}>
      <FlatList
        data={items}
        keyExtractor={(x) => String(x.id)}
        renderItem={({ item }) => <Item item={item} />}
        ListHeaderComponent={<Header />}
        ListEmptyComponent={
          <Text style={{ color: "#6B7280", paddingHorizontal: 16 }}>No downloads yet.</Text>
        }
        contentContainerStyle={{ paddingBottom: 16 + insets.bottom }}
      />
    </SafeAreaView>
  );
}
