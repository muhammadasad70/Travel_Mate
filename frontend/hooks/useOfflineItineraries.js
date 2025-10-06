// hooks/useOfflineItineraries.js
import { Platform } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as FileSystem from "expo-file-system";              // OK if missing; we guard below
import NetInfo from "@react-native-community/netinfo";
import api from "../api";

const isNative = Platform.OS === "ios" || Platform.OS === "android";
const hasFS = !!FileSystem && !!FileSystem.documentDirectory; // <-- key
const ROOT = "offline/itineraries/";

function normalizeId(obj) {
  const raw = obj?.id ?? obj?._id ?? obj?.itinerary_id ?? obj?.itineraryId ?? obj?.ItineraryId;
  const s = raw != null ? String(raw) : "";
  return s && s !== "undefined" && s !== "null" ? s : null;
}

async function ensureDir() {
  if (!isNative || !hasFS) return;
  const root = FileSystem.documentDirectory + ROOT;
  const info = await FileSystem.getInfoAsync(root);
  if (!info.exists) await FileSystem.makeDirectoryAsync(root, { intermediates: true });
}

async function tryDownload(url, dest) {
  if (!isNative || !hasFS || !url) return;
  try { await FileSystem.downloadAsync(url, dest); } catch {}
}

/** PUBLIC */
export async function downloadItinerary({ itinerary, coverUrl, staticMapUrl }) {
  if (!itinerary) throw new Error("No itinerary passed");
  const safeId = normalizeId(itinerary);
  if (!safeId) throw new Error("Itinerary has no id/_id");

  // If FS isn't available (your case), fall back to AsyncStorage-only
  if (!isNative || !hasFS) {
    const idx = JSON.parse((await AsyncStorage.getItem("offline_itineraries")) || "[]");
    if (!idx.find((x) => String(x.id) === safeId)) {
      idx.push({ id: safeId, title: itinerary.title, city: itinerary.city, path: null });
      await AsyncStorage.setItem("offline_itineraries", JSON.stringify(idx));
    }
    await AsyncStorage.setItem(`offline_itinerary_${safeId}`, JSON.stringify(itinerary));
    return null;
  }

  // Native with FS
  await ensureDir();
  const base = FileSystem.documentDirectory + ROOT + safeId + "/";
  const d = await FileSystem.getInfoAsync(base);
  if (!d.exists) await FileSystem.makeDirectoryAsync(base);

  await FileSystem.writeAsStringAsync(base + "itinerary.json", JSON.stringify(itinerary));
  await tryDownload(coverUrl, base + "cover.jpg");
  await tryDownload(staticMapUrl, base + "map.jpg");

  const idx = JSON.parse((await AsyncStorage.getItem("offline_itineraries")) || "[]");
  if (!idx.find((x) => String(x.id) === safeId)) {
    idx.push({ id: safeId, title: itinerary.title, city: itinerary.city, path: base });
    await AsyncStorage.setItem("offline_itineraries", JSON.stringify(idx));
  }
  return base;
}

export async function listOfflineItineraries() {
  return JSON.parse((await AsyncStorage.getItem("offline_itineraries")) || "[]");
}

export async function loadOfflineItinerary(id) {
  const safeId = String(id);

  // If FS missing, read the same way as web
  if (!isNative || !hasFS) {
    const json = await AsyncStorage.getItem(`offline_itinerary_${safeId}`);
    const data = json ? JSON.parse(json) : null;
    return { data, assets: { cover: null, map: null } };
  }

  const base = FileSystem.documentDirectory + ROOT + safeId + "/";
  try {
    const j = await FileSystem.readAsStringAsync(base + "itinerary.json");
    const data = JSON.parse(j);
    return { data, assets: { cover: base + "cover.jpg", map: base + "map.jpg" } };
  } catch {
    return { data: null, assets: { cover: null, map: null } };
  }
}

export async function queueChange(itineraryId, patch) {
  const q = JSON.parse((await AsyncStorage.getItem("offline_queue")) || "[]");
  q.push({ itineraryId, patch, ts: Date.now() });
  await AsyncStorage.setItem("offline_queue", JSON.stringify(q));
}

export function startAutoSync() {
  if (!isNative) return () => {};
  const unsub = NetInfo.addEventListener(async (state) => {
    if (!state.isConnected) return;
    const q = JSON.parse((await AsyncStorage.getItem("offline_queue")) || "[]");
    if (q.length === 0) return;
    try {
      const byId = q.reduce((m, x) => { (m[x.itineraryId] ||= []).push(x.patch); return m; }, {});
      await Promise.all(Object.entries(byId).map(([id, patches]) =>
        api.post(`/itineraries/${id}/offline-sync`, { patches })
      ));
      await AsyncStorage.setItem("offline_queue", JSON.stringify([]));
    } catch {}
  });
  return () => unsub && unsub();
}
