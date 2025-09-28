// screens/social/CreatePostScreen.js
import React, { useMemo, useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Platform,
  TextInput,
  ScrollView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
// import ItineraryPicker from './partials/ItineraryPicker';

const TABS = [
  { key: 'itinerary', label: 'Itinerary', icon: 'map-outline' },
  { key: 'event',     label: 'Event',     icon: 'sparkles-outline' },
  { key: 'service',   label: 'Service',   icon: 'briefcase-outline' },
  { key: 'skill',     label: 'Skill',     icon: 'school-outline' },
];

export default function CreatePostScreen({ onSubmit }) {
  const [active, setActive] = useState('itinerary');
  const [selectedItinerary, setSelectedItinerary] = useState(null);

  const cta = useMemo(() => {
    switch (active) {
      case 'event':     return 'Publish Event';
      case 'service':   return 'List Service';
      case 'skill':     return 'Share Skill';
      default:          return 'Post Itinerary';
    }
  }, [active]);

  const isPrimaryDisabled = active === 'itinerary' && !selectedItinerary;

  return (
    <ScrollView
      style={styles.root}
      contentContainerStyle={styles.container}
      keyboardShouldPersistTaps="handled"
    >
      {/* Heading */}
      <Text style={styles.title}>What do you want to post?</Text>
      <Text style={styles.subtitle}>
        Choose a type below — the content renders inline on this screen.
      </Text>

      {/* Tabs */}
      <View style={styles.tabsRow}>
        {TABS.map((t) => {
          const selected = active === t.key;
          return (
            <TouchableOpacity
              key={t.key}
              style={[styles.tabPill, selected && styles.tabPillActive]}
              onPress={() => setActive(t.key)}
              activeOpacity={0.9}
            >
              <Ionicons
                name={t.icon}
                size={18}
                color={selected ? '#0F3A6B' : '#5B6B7B'}
              />
              <Text style={[styles.tabPillText, selected && styles.tabPillTextActive]}>
                {t.label}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>

      {/* Inline area */}
      <View style={styles.card}>
        {/* {active === 'itinerary' && (
          <ItineraryPicker
            value={selectedItinerary}
            onChange={setSelectedItinerary}
          />
        )} */}

        {active === 'event' && <EventForm />}
        {active === 'service' && <ServiceForm />}
        {active === 'skill' && <SkillForm />}
      </View>

      {/* Submit */}
      <TouchableOpacity
        style={[styles.primaryBtn, isPrimaryDisabled && { opacity: 0.6 }]}
        activeOpacity={isPrimaryDisabled ? 1 : 0.9}
        onPress={() => {
          if (isPrimaryDisabled) return;
          if (active === 'itinerary') {
            onSubmit?.({ type: 'itinerary', itineraryId: selectedItinerary?.id });
          } else {
            onSubmit?.({ type: active });
          }
        }}
      >
        <Text style={styles.primaryBtnText}>{cta}</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

/* ---------- Simple stubs for other tabs (keep inline behavior) ---------- */

const Field = ({ label, placeholder, multiline }) => (
  <View style={styles.field}>
    <Text style={styles.label}>{label}</Text>
    <TextInput
      style={[styles.input, multiline && styles.inputMultiline]}
      placeholder={placeholder}
      placeholderTextColor="#9AA3AF"
      multiline={multiline}
    />
  </View>
);

const TwoCol = ({ left, right }) => (
  <View style={styles.twoCol}>
    <View style={{ flex: 1, marginRight: 8 }}>{left}</View>
    <View style={{ flex: 1, marginLeft: 8 }}>{right}</View>
  </View>
);

const EventForm = () => (
  <>
    <Text style={styles.formTitle}>Create Event</Text>
    <Field label="Event Name" placeholder="e.g., Trekking Meetup" />
    <TwoCol
      left={<Field label="Date" placeholder="YYYY-MM-DD" />}
      right={<Field label="Time" placeholder="HH:MM" />}
    />
    <Field label="Location" placeholder="City / venue / coordinates" />
    <Field label="Details" placeholder="Tell people what to expect" multiline />
  </>
);

const ServiceForm = () => (
  <>
    <Text style={styles.formTitle}>List a Service</Text>
    <Field label="Service Title" placeholder="e.g., Jeep Rental - Skardu" />
    <TwoCol
      left={<Field label="Price" placeholder="e.g., 6000 PKR/day" />}
      right={<Field label="Contact" placeholder="+92 ..." />}
    />
    <Field label="Description" placeholder="What’s included, terms, etc." multiline />
  </>
);

const SkillForm = () => (
  <>
    <Text style={styles.formTitle}>Share a Skill</Text>
    <Field label="Skill Title" placeholder="e.g., Local Cooking Class" />
    <TwoCol
      left={<Field label="Duration" placeholder="e.g., 2 hours" />}
      right={<Field label="Available Slots" placeholder="e.g., 6" />}
    />
    <Field label="About" placeholder="Describe what you’ll teach" multiline />
  </>
);

/* ----------------------- styles ----------------------- */

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: '#F6FAFD' },
  container: {
    paddingTop: Platform.OS === 'web' ? 92 : 16,
    paddingBottom: 120,
    paddingHorizontal: 16,
  },

  title: { fontSize: 22, fontWeight: '800', color: '#0F3A6B' },
  subtitle: { marginTop: 4, color: '#5B6B7B', fontWeight: '600' },

  tabsRow: { marginTop: 16, flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  tabPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingVertical: 8,
    paddingHorizontal: 14,
    backgroundColor: '#F3F6FA',
    borderRadius: 999,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    ...(Platform.OS === 'web' && { cursor: 'pointer' }),
  },
  tabPillActive: { backgroundColor: '#E7F3FF', borderColor: '#77B6FF' },
  tabPillText: { fontWeight: '700', color: '#5B6B7B' },
  tabPillTextActive: { color: '#0F3A6B' },

  card: {
    marginTop: 14,
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 14,
    borderWidth: 1,
    borderColor: '#EAF0F6',
    shadowColor: '#000',
    shadowOpacity: 0.06,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 3 },
    elevation: 2,
  },

  formTitle: { fontSize: 16, fontWeight: '800', color: '#0F3A6B', marginBottom: 8 },

  field: { marginBottom: 10 },
  label: { fontWeight: '700', color: '#0F3A6B', marginBottom: 6, fontSize: 12 },
  input: {
    backgroundColor: '#F9FBFE',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: Platform.OS === 'ios' ? 12 : 10,
    color: '#0F172A',
  },
  inputMultiline: { minHeight: 90, textAlignVertical: 'top' },

  twoCol: { flexDirection: 'row', marginBottom: 10 },

  primaryBtn: {
    marginTop: 16,
    height: 48,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#0F3A6B',
    shadowColor: '#0F3A6B',
    shadowOpacity: 0.2,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
  },
  primaryBtnText: { color: '#fff', fontWeight: '800' },
});
