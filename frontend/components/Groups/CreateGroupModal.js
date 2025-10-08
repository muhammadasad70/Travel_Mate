
// import React, { useState } from "react";
// import { View, Text, TextInput, Pressable, StyleSheet, ActivityIndicator, Alert } from "react-native";
// import { SafeAreaView } from "react-native-safe-area-context";
// import { useNavigation } from "@react-navigation/native";
// import { Ionicons } from "@expo/vector-icons";
// import api from "../../api";

// const PRIMARY = "#0F3A6B";
// const ACCENT = "#003366";
// const BORDER = "#E6EDF7";
// const CARD_BG = "#FFFFFF";
// const PAGE_BG = "#F7F9FC";
// const SUBTEXT = "#6B7280";

// export default function CreateGroupModal() {
//   const nav = useNavigation();
//   const [name, setName] = useState("");
//   const [desc, setDesc] = useState("");
//   const [busy, setBusy] = useState(false);
//   const [err, setErr] = useState("");

//   const submit = async () => {
//     if (!name.trim()) {
//       return Alert.alert("Validation Error", "Please enter a group name.");
//     }
//     if (desc.length > 500) {
//       return Alert.alert("Validation Error", "Description too long (max 500 characters).");
//     }

//     try {
//       setBusy(true);
//       setErr("");
//       const res = await api.post("/groups", { name: name.trim(), description: desc.trim() });
//       const gid = res?.data?.id;

//       if (gid) {
//         Alert.alert("Success", "Group created successfully.", [
//           {
//             text: "OK",
//             onPress: () => nav.goBack(), // back to GroupsHomeScreen
//           },
//         ]);
//       } else {
//         Alert.alert("Created", "Group created. Reload your groups list.");
//         nav.goBack();
//       }
//     } catch {
//       setErr("Could not create group. Connect backend later.");
//     } finally {
//       setBusy(false);
//     }
//   };

//   return (
//     <SafeAreaView style={styles.container}>
//       <View style={styles.appbar}>
//         <Pressable onPress={() => nav.goBack()} style={styles.iconBtn}>
//           <Ionicons name="close" size={22} color={PRIMARY} />
//         </Pressable>
//         <Text style={styles.title}>Create Group</Text>
//         <View style={{ width: 22 }} />
//       </View>

//       <View style={styles.body}>
//         <Text style={styles.label}>Group name</Text>
//         <TextInput
//           value={name}
//           onChangeText={setName}
//           placeholder="e.g., Friends Trip to Hunza"
//           style={styles.input}
//         />

//         <Text style={[styles.label, { marginTop: 10 }]}>Description (optional)</Text>
//         <TextInput
//           value={desc}
//           onChangeText={setDesc}
//           placeholder="What is this group about?"
//           style={[styles.input, { height: 100 }]}
//           multiline
//         />

//         {!!err && <Text style={styles.error}>{err}</Text>}

//         <Pressable onPress={submit} style={({ pressed }) => [styles.primary, pressed && { opacity: 0.95 }]}>
//           {busy ? <ActivityIndicator color="#FFF" /> : (
//             <>
//               <Ionicons name="add" size={18} color="#FFF" />
//               <Text style={styles.primaryTxt}>Create</Text>
//             </>
//           )}
//         </Pressable>
//       </View>
//     </SafeAreaView>
//   );
// }

// const styles = StyleSheet.create({
//   container: { flex: 1, backgroundColor: PAGE_BG },
//   appbar: {
//     height: 48, paddingHorizontal: 10, backgroundColor: CARD_BG,
//     borderBottomWidth: 1, borderBottomColor: BORDER,
//     flexDirection: "row", alignItems: "center", justifyContent: "space-between",
//   },
//   iconBtn: { padding: 6 },
//   title: { fontSize: 18, fontWeight: "800", color: PRIMARY },
//   body: { padding: 16 },
//   label: { color: SUBTEXT, marginBottom: 6, fontWeight: "600" },
//   input: {
//     backgroundColor: "#FFF", borderWidth: 1, borderColor: BORDER, borderRadius: 12,
//     paddingHorizontal: 12, paddingVertical: 10,
//   },
//   primary: {
//     marginTop: 16, backgroundColor: ACCENT, paddingVertical: 12,
//     borderRadius: 14, alignItems: "center", flexDirection: "row", justifyContent: "center", gap: 8,
//   },
//   primaryTxt: { color: "#FFF", fontWeight: "800" },
//   error: { color: "#B91C1C", marginTop: 10 },
// });

// import React, { useState } from "react";
// import {
//   View, Text, TextInput, Pressable, StyleSheet,
//   ActivityIndicator, Alert, Platform
// } from "react-native";
// import { SafeAreaView } from "react-native-safe-area-context";
// import { useNavigation } from "@react-navigation/native";
// import { Ionicons } from "@expo/vector-icons";
// import api from "../../api";

// const PRIMARY = "#0F3A6B";
// const ACCENT = "#003366";
// const BORDER = "#E6EDF7";
// const CARD_BG = "#FFFFFF";
// const PAGE_BG = "#F7F9FC";
// const SUBTEXT = "#6B7280";

// export default function CreateGroupModal() {
//   const nav = useNavigation();
//   const [name, setName] = useState("");
//   const [desc, setDesc] = useState("");
//   const [busy, setBusy] = useState(false);
//   const [err, setErr] = useState("");

//   const nameOK = name.trim().length >= 4;
//   const descOK = desc.trim().length >= 10;
//   const isFormValid = nameOK && descOK;

//   const showSuccess = (msg) => {
//     if (Platform.OS === "web") {
//       window.alert(msg);
//       nav.goBack();
//     } else {
//       Alert.alert("Success", msg, [{ text: "OK", onPress: () => nav.goBack() }]);
//     }
//   };

//   const submit = async () => {
//     if (!nameOK) {
//       return Alert.alert("Validation Error", "Group name must be at least 4 characters.");
//     }
//     if (!descOK) {
//       return Alert.alert("Validation Error", "Description must be at least 10 characters.");
//     }

//     try {
//       setBusy(true);
//       setErr("");
//       const payload = { name: name.trim(), description: desc.trim() };
//       const res = await api.post("/groups", payload);

//       if (res?.data?.id) {
//         showSuccess("Group created successfully.");
//       } else {
//         Alert.alert("Created", "Group created. Returning to your groups.");
//         nav.goBack();
//       }
//     } catch (e) {
//       const msg = e?.response?.data?.error || "Could not create group.";
//       setErr(msg);
//       Alert.alert("Error", msg);
//     } finally {
//       setBusy(false);
//     }
//   };

//   return (
//     <SafeAreaView style={styles.container}>
//       <View style={styles.appbar}>
//         <Pressable onPress={() => nav.goBack()} style={styles.iconBtn}>
//           <Ionicons name="close" size={22} color={PRIMARY} />
//         </Pressable>
//         <Text style={styles.title}>Create Group</Text>
//         <View style={{ width: 22 }} />
//       </View>

//       <View style={styles.body}>
//         <Text style={styles.label}>Group name</Text>
//         <TextInput
//           value={name}
//           onChangeText={setName}
//           placeholder="e.g., Friends Trip to Islamabad"
//           style={[styles.input, !nameOK && name.length > 0 && styles.inputError]}
//         />

//         <Text style={[styles.label, { marginTop: 10 }]}>Description</Text>
//         <TextInput
//           value={desc}
//           onChangeText={setDesc}
//           placeholder="Describe the purpose, who’s going, what you’ll plan together…"
//           style={[styles.input, { height: 110 }, !descOK && desc.length > 0 && styles.inputError]}
//           multiline
//         />

//         {!isFormValid && (
//           <Text style={styles.hint}>
//             Name ≥ 4 chars and description ≥ 10 chars required.
//           </Text>
//         )}
//         {!!err && <Text style={styles.error}>{err}</Text>}

//         <Pressable
//           onPress={submit}
//           disabled={!isFormValid || busy}
//           style={({ pressed }) => [
//             styles.primary,
//             (!isFormValid || busy) && { backgroundColor: "#A0AEC0" },
//             pressed && { opacity: 0.95 },
//           ]}
//         >
//           {busy ? (
//             <ActivityIndicator color="#FFF" />
//           ) : (
//             <>
//               <Ionicons name="add" size={18} color="#FFF" />
//               <Text style={styles.primaryTxt}>Create</Text>
//             </>
//           )}
//         </Pressable>
//       </View>
//     </SafeAreaView>
//   );
// }

// const styles = StyleSheet.create({
//   container: { flex: 1, backgroundColor: PAGE_BG },
//   appbar: {
//     height: 48, paddingHorizontal: 10, backgroundColor: CARD_BG,
//     borderBottomWidth: 1, borderBottomColor: BORDER,
//     flexDirection: "row", alignItems: "center", justifyContent: "space-between",
//   },
//   iconBtn: { padding: 6 },
//   title: { fontSize: 18, fontWeight: "800", color: PRIMARY },
//   body: { padding: 16 },
//   label: { color: SUBTEXT, marginBottom: 6, fontWeight: "600" },
//   input: {
//     backgroundColor: "#FFF", borderWidth: 1, borderColor: BORDER, borderRadius: 12,
//     paddingHorizontal: 12, paddingVertical: 10,
//   },
//   inputError: { borderColor: "#DC2626" },
//   hint: { color: SUBTEXT, marginTop: 8 },
//   primary: {
//     marginTop: 16, backgroundColor: ACCENT, paddingVertical: 12,
//     borderRadius: 14, alignItems: "center", flexDirection: "row", justifyContent: "center", gap: 8,
//   },
//   primaryTxt: { color: "#FFF", fontWeight: "800" },
//   error: { color: "#B91C1C", marginTop: 10 },
// });


import React, { useState } from "react";
import {
  View, Text, TextInput, Pressable, StyleSheet,
  ActivityIndicator, Alert, Platform
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useNavigation } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";
import api from "../../api";

const PRIMARY = "#0F3A6B";
const ACCENT = "#003366";
const BORDER = "#E6EDF7";
const CARD_BG = "#FFFFFF";
const PAGE_BG = "#F7F9FC";
const SUBTEXT = "#6B7280";

export default function CreateGroupModal() {
  const nav = useNavigation();
  const [name, setName] = useState("");
  const [desc, setDesc] = useState("");
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState("");

  const nameOK = name.trim().length >= 4;
  const descOK = desc.trim().length >= 10;
  const isFormValid = nameOK && descOK;

  const showSuccess = (msg) => {
    if (Platform.OS === "web") {
      window.alert(msg);
      nav.goBack();
    } else {
      Alert.alert("Success", msg, [{ text: "OK", onPress: () => nav.goBack() }]);
    }
  };

  const submit = async () => {
    if (!nameOK) {
      return Alert.alert("Validation Error", "Group name must be at least 4 characters.");
    }
    if (!descOK) {
      return Alert.alert("Validation Error", "Description must be at least 10 characters.");
    }

    try {
      setBusy(true);
      setErr("");
      const payload = { name: name.trim(), description: desc.trim() };
      const res = await api.post("/groups", payload);

      // backend returns { group_id: number }
      const gid = res?.data?.group_id;
      if (gid) {
        showSuccess("Group created successfully.");
      } else {
        Alert.alert("Created", "Group created. Returning to your groups.");
        nav.goBack();
      }
    } catch (e) {
      const msg = e?.response?.data?.error || "Could not create group.";
      setErr(msg);
      Alert.alert("Error", msg);
    } finally {
      setBusy(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.appbar}>
        <Pressable onPress={() => nav.goBack()} style={styles.iconBtn}>
          <Ionicons name="close" size={22} color={PRIMARY} />
        </Pressable>
        <Text style={styles.title}>Create Group</Text>
        <View style={{ width: 22 }} />
      </View>

      <View style={styles.body}>
        <Text style={styles.label}>Group name</Text>
        <TextInput
          value={name}
          onChangeText={setName}
          placeholder="e.g., Friends Trip to Islamabad"
          style={[styles.input, !nameOK && name.length > 0 && styles.inputError]}
        />

        <Text style={[styles.label, { marginTop: 10 }]}>Description</Text>
        <TextInput
          value={desc}
          onChangeText={setDesc}
          placeholder="Describe the purpose, who’s going, what you’ll plan together…"
          style={[styles.input, { height: 110 }, !descOK && desc.length > 0 && styles.inputError]}
          multiline
        />

        {!isFormValid && (
          <Text style={styles.hint}>
            Name ≥ 4 chars and description ≥ 10 chars required.
          </Text>
        )}
        {!!err && <Text style={styles.error}>{err}</Text>}

        <Pressable
          onPress={submit}
          disabled={!isFormValid || busy}
          style={({ pressed }) => [
            styles.primary,
            (!isFormValid || busy) && { backgroundColor: "#A0AEC0" },
            pressed && { opacity: 0.95 },
          ]}
        >
          {busy ? (
            <ActivityIndicator color="#FFF" />
          ) : (
            <>
              <Ionicons name="add" size={18} color="#FFF" />
              <Text style={styles.primaryTxt}>Create</Text>
            </>
          )}
        </Pressable>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: PAGE_BG },
  appbar: {
    height: 48, paddingHorizontal: 10, backgroundColor: CARD_BG,
    borderBottomWidth: 1, borderBottomColor: BORDER,
    flexDirection: "row", alignItems: "center", justifyContent: "space-between",
  },
  iconBtn: { padding: 6 },
  title: { fontSize: 18, fontWeight: "800", color: PRIMARY },
  body: { padding: 16 },
  label: { color: SUBTEXT, marginBottom: 6, fontWeight: "600" },
  input: {
    backgroundColor: "#FFF", borderWidth: 1, borderColor: BORDER, borderRadius: 12,
    paddingHorizontal: 12, paddingVertical: 10,
  },
  inputError: { borderColor: "#DC2626" },
  hint: { color: SUBTEXT, marginTop: 8 },
  primary: {
    marginTop: 16, backgroundColor: ACCENT, paddingVertical: 12,
    borderRadius: 14, alignItems: "center", flexDirection: "row", justifyContent: "center", gap: 8,
  },
  primaryTxt: { color: "#FFF", fontWeight: "800" },
  error: { color: "#B91C1C", marginTop: 10 },
});
