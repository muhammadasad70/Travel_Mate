// import React from "react";
// import { View, Text, Pressable, Linking } from "react-native";

// const pk = {
//   police:    [{ name:"Islamabad Police", phone:"+92-51-9262550" }],
//   hospitals: [{ name:"PIMS Hospital", phone:"+92-51-9261170", maps:"https://maps.app.goo.gl/..." }],
//   embassy:   [{ name:"US Embassy", phone:"+92-51-2014000", maps:"https://maps.app.goo.gl/..." }],
// };

// export default function OfflineEmergency() {
//   return (
//     <View style={{ flex:1, backgroundColor:"#F7F9FC", padding:16 }}>
//       <Text style={{ fontWeight:"800", fontSize:18, marginBottom:10 }}>Emergency Contacts (Offline)</Text>
//       {["police","hospitals","embassy"].map(section => (
//         <View key={section} style={{ marginBottom:12 }}>
//           <Text style={{ fontWeight:"800", marginBottom:6 }}>{section.toUpperCase()}</Text>
//           {pk[section].map((x,i)=>(
//             <View key={i} style={{ backgroundColor:"#fff", padding:12, borderRadius:10, borderWidth:1, borderColor:"#E6EDF7", marginBottom:6 }}>
//               <Text style={{ fontWeight:"700" }}>{x.name}</Text>
//               {!!x.phone && <Pressable onPress={()=> Linking.openURL(`tel:${x.phone}`)}><Text style={{ color:"#0F3A6B" }}>{x.phone}</Text></Pressable>}
//               {!!x.maps &&  <Pressable onPress={()=> Linking.openURL(x.maps)}><Text style={{ color:"#0F3A6B" }}>Open in Maps</Text></Pressable>}
//             </View>
//           ))}
//         </View>
//       ))}
//     </View>
//   );
// }


// components/Offline/OfflineEmergency.jsx
import React from "react";
import { View, Text, Pressable, Linking } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { SafeAreaView, useSafeAreaInsets } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";

const pk = {
  police:    [{ name: "Islamabad Police", phone: "+92-51-9262550" }],
  hospitals: [{ name: "PIMS Hospital", phone: "+92-51-9261170", maps: "https://maps.app.goo.gl/..." }],
  embassy:   [{ name: "US Embassy",       phone: "+92-51-2014000", maps: "https://maps.app.goo.gl/..." }],
};

export default function OfflineEmergency() {
  const nav = useNavigation();
  const insets = useSafeAreaInsets();

  const SectionCard = ({ entry }) => (
    <View
      style={{
        backgroundColor: "#fff",
        padding: 12,
        borderRadius: 12,
        borderWidth: 1,
        borderColor: "#E6EDF7",
        marginBottom: 10,
        shadowColor: "#000",
        shadowOpacity: 0.05,
        shadowRadius: 8,
        shadowOffset: { width: 0, height: 4 },
        elevation: 2,
      }}
    >
      <Text style={{ fontWeight: "700", marginBottom: 6 }}>{entry.name}</Text>

      {!!entry.phone && (
        <Pressable
          onPress={() => Linking.openURL(`tel:${entry.phone}`)}
          style={{
            flexDirection: "row",
            alignItems: "center",
            gap: 8,
            alignSelf: "flex-start",
            backgroundColor: "#E9F1FF",
            borderColor: "#D6E3FF",
            borderWidth: 1,
            borderRadius: 999,
            paddingVertical: 8,
            paddingHorizontal: 12,
            marginBottom: entry.maps ? 6 : 0,
          }}
        >
          <Ionicons name="call-outline" size={16} color="#0F3A6B" />
          <Text style={{ color: "#0F3A6B", fontWeight: "800" }}>{entry.phone}</Text>
        </Pressable>
      )}

      {!!entry.maps && (
        <Pressable
          onPress={() => Linking.openURL(entry.maps)}
          style={{
            flexDirection: "row",
            alignItems: "center",
            gap: 8,
            alignSelf: "flex-start",
            backgroundColor: "#ECFDF5",
            borderColor: "#BBF7D0",
            borderWidth: 1,
            borderRadius: 999,
            paddingVertical: 8,
            paddingHorizontal: 12,
          }}
        >
          <Ionicons name="map-outline" size={16} color="#065F46" />
          <Text style={{ color: "#065F46", fontWeight: "800" }}>Open in Maps</Text>
        </Pressable>
      )}
    </View>
  );

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#F7F9FC", paddingTop: insets.top }}>
      {/* Header */}
      <View style={{ paddingHorizontal: 16, paddingTop: 8, marginBottom: 6 }}>
        <Pressable
          onPress={() => nav.goBack()} // returns to Offline Center
          style={{
            alignSelf: "flex-start",
            flexDirection: "row",
            alignItems: "center",
            gap: 8,
            backgroundColor: "#fff",
            borderRadius: 12,
            borderWidth: 1,
            borderColor: "#E6EDF7",
            paddingVertical: 8,
            paddingHorizontal: 12,
            marginBottom: 10,
          }}
        >
          <Ionicons name="arrow-back" size={18} color="#0f172a" />
          <Text style={{ fontWeight: "800", color: "#0f172a" }}>Back</Text>
        </Pressable>

        <Text style={{ fontWeight: "800", fontSize: 18, marginBottom: 10 }}>
          Emergency Contacts (Offline)
        </Text>
      </View>

      {/* Content */}
      <View style={{ flex: 1, paddingHorizontal: 16 }}>
        {["police", "hospitals", "embassy"].map((section) => (
          <View key={section} style={{ marginBottom: 12 }}>
            <Text style={{ fontWeight: "800", marginBottom: 6 }}>{section.toUpperCase()}</Text>
            {pk[section].map((x, i) => (
              <SectionCard key={i} entry={x} />
            ))}
          </View>
        ))}
      </View>

      {/* Safe bottom padding */}
      <View style={{ height: insets.bottom }} />
    </SafeAreaView>
  );
}
