
// screens/CulturalExchange/AddCulturalServiceForm.js
import React, { useMemo, useState } from 'react';
import {
  View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView, Alert, Platform,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import DateTimePicker from '@react-native-community/datetimepicker';

const EXPERIENCE_TYPES = [
  { label: 'Workshop / Class', value: 'workshop' },
  { label: 'Neighborhood / Culture Walk', value: 'walk' },
  { label: 'Home / Community Experience', value: 'home_experience' },
  { label: 'Skill / Service Exchange', value: 'skill_exchange' },
];

const SCHEDULE_TYPES = [
  { label: 'Fixed Dates', value: 'fixed_dates' },
  { label: 'Repeat Weekly', value: 'repeat_weekly' },
  { label: 'On Request', value: 'on_request' },
];

const PRICING_MODELS = [
  { label: 'Per Person', value: 'per_person' },
  { label: 'Per Group', value: 'per_group' },
  { label: 'Free', value: 'free' },
  { label: 'Exchange', value: 'exchange' },
];

const WEEK_DAYS = ['Mon','Tue','Wed','Thu','Fri','Sat','Sun'];
const CANCELLATION = [
  { label: 'Flexible', value: 'flexible' },
  { label: 'Moderate', value: 'moderate' },
  { label: 'Strict', value: 'strict' },
];

const CATEGORIES_BY_TYPE = {
  workshop: ['Cooking', 'Craft', 'Music & Dance', 'Language'],
  walk: ['Street Food', 'Heritage Walk', 'Bazaar Walk', 'Architecture'],
  home_experience: ['Home Meal', 'Tea Ceremony', 'Festival Visit', 'Village/Farm'],
  skill_exchange: ['Photography ↔ Experience', 'Video Editing ↔ Experience', 'English Conversation ↔ Experience'],
};

export default function AddCulturalServiceForm({ onDone, onBack }) {
  const [form, setForm] = useState({
    title: '',
    experience_type: 'workshop',
    category: '',
    tags: '',
    description: '',

    city: '',
    meeting_point_label: '',
    schedule_type: 'fixed_dates',

    // 🔹 NEW: store fixed dates as array of strings YYYY-MM-DD
    fixed_dates: [],

    // web fallback text for dates (optional)
    availableDatesText: '',

    days_of_week: [],
    start_time: '',          // "HH:MM"
    duration_hours: '',
    lead_time_days: '',

    group_size_max: '',
    languages: '',

    pricing_model: 'per_person',
    price_per_person: '',
    price_per_group: '',
    group_included_size: '',

    host_offers: '',
    traveler_can_offer: '',
    exchange_value_hint: '',

    includes: '',
    excludes: '',
    material_requirements: '',
    accessibility_notes: '',
    age_restriction: '',
    cancellation_policy: 'moderate',
  });
  const [errors, setErrors] = useState({});
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showTimePicker, setShowTimePicker] = useState(false);

  const set = (k, v) => setForm(s => ({ ...s, [k]: v }));

  const catOptions = useMemo(() => CATEGORIES_BY_TYPE[form.experience_type] || [], [form.experience_type]);

  const toggleDay = (d) => {
    set('days_of_week',
      form.days_of_week.includes(d)
        ? form.days_of_week.filter(x => x !== d)
        : [...form.days_of_week, d]
    );
  };

  // ---------- helpers ----------
  const toYMD = (dateObj) => {
    const y = dateObj.getFullYear();
    const m = String(dateObj.getMonth() + 1).padStart(2, '0');
    const d = String(dateObj.getDate()).padStart(2, '0');
    return `${y}-${m}-${d}`;
  };
  const csvToArray = (s) =>
    String(s || '')
      .split(',')
      .map(x => x.trim())
      .filter(Boolean);
  const isHHMM = (s) => /^([01]\d|2[0-3]):[0-5]\d$/.test(String(s || ''));
  const isDate = (s) => /^\d{4}-\d{2}-\d{2}$/.test(String(s || ''));
  const num = (v) => {
    const n = Number(v);
    return Number.isFinite(n) ? n : NaN;
  };

  // ---------- pickers ----------
  const openDatePicker = () => setShowDatePicker(true);
  const onPickDate = (e, date) => {
    setShowDatePicker(false);
    if (!date) return;
    const ymd = toYMD(date);
    if (!form.fixed_dates.includes(ymd)) {
      set('fixed_dates', [...form.fixed_dates, ymd].sort());
    }
  };
  const removeFixedDate = (d) => set('fixed_dates', form.fixed_dates.filter(x => x !== d));

  const openTimePicker = () => setShowTimePicker(true);
  const onPickTime = (e, date) => {
    setShowTimePicker(false);
    if (!date) return;
    const hh = String(date.getHours()).padStart(2, '0');
    const mm = String(date.getMinutes()).padStart(2, '0');
    set('start_time', `${hh}:${mm}`);
  };

  // ---------- validation ----------
  const validate = () => {
    const e = {};

    if (!form.title.trim()) e.title = 'Title is required';
    if (!form.city.trim()) e.city = 'City is required';

    if (form.schedule_type === 'fixed_dates') {
      const dates = Platform.OS === 'web'
        ? csvToArray(form.availableDatesText)
        : form.fixed_dates;

      if (dates.length === 0) e.fixed_dates = 'Select at least one date';
      if (dates.some(d => !isDate(d))) {
        if (Platform.OS === 'web') e.availableDatesText = 'Dates must be YYYY-MM-DD';
        else e.fixed_dates = 'Dates must be valid YYYY-MM-DD';
      }
    }

    if (form.schedule_type === 'repeat_weekly') {
      if (form.days_of_week.length === 0) e.days_of_week = 'Pick at least one day';
      if (!isHHMM(form.start_time)) e.start_time = 'Use 24h time, e.g., 14:00';
      if (!(num(form.duration_hours) > 0)) e.duration_hours = 'Enter duration in hours';
    }

    if (form.schedule_type === 'on_request') {
      if (!(num(form.lead_time_days) >= 0)) e.lead_time_days = 'Enter lead time in days';
      if (!(num(form.duration_hours) > 0)) e.duration_hours = 'Enter typical duration in hours';
    }

    if (form.group_size_max && !(num(form.group_size_max) > 0)) {
      e.group_size_max = 'Must be a number > 0';
    }

    if (form.pricing_model === 'per_person') {
      if (!(num(form.price_per_person) > 0)) e.price_per_person = 'Price per person required';
    }
    if (form.pricing_model === 'per_group') {
      if (!(num(form.price_per_group) > 0)) e.price_per_group = 'Price per group required';
      if (!(num(form.group_included_size) > 0)) e.group_included_size = 'Included group size required';
    }
    if (form.pricing_model === 'exchange') {
      if (!form.host_offers.trim()) e.host_offers = 'Describe what you offer';
      if (csvToArray(form.traveler_can_offer).length === 0) e.traveler_can_offer = 'List at least one traveler skill';
    }

    setErrors(e);
    return Object.keys(e).length === 0;
  };

  // ---------- submit ----------
  const submit = async () => {
    if (!validate()) {
      Alert.alert('Please fix the highlighted fields');
      return;
    }

    const payload = {
      title: form.title.trim(),
      experience_type: form.experience_type,
      category: form.category.trim(),
      tags: csvToArray(form.tags),
      description: form.description.trim(),

      city: form.city.trim(),
      meeting_point_label: form.meeting_point_label.trim(),
      schedule: {
        type: form.schedule_type,
        fixed_dates:
          form.schedule_type === 'fixed_dates'
            ? (Platform.OS === 'web'
                ? csvToArray(form.availableDatesText)
                : form.fixed_dates)
            : [],
        weekly: form.schedule_type === 'repeat_weekly' ? {
          days_of_week: form.days_of_week,
          start_time: form.start_time,
          duration_hours: Number(form.duration_hours),
        } : null,
        on_request: form.schedule_type === 'on_request' ? {
          lead_time_days: Number(form.lead_time_days),
          duration_hours: Number(form.duration_hours),
        } : null,
      },

      group_size_max: form.group_size_max ? Number(form.group_size_max) : null,
      languages: csvToArray(form.languages),

      pricing: {
        model: form.pricing_model,
        per_person: form.pricing_model === 'per_person' ? { price_per_person: Number(form.price_per_person) } : null,
        per_group: form.pricing_model === 'per_group' ? {
          price_per_group: Number(form.price_per_group),
          group_included_size: Number(form.group_included_size),
        } : null,
        free: form.pricing_model === 'free' ? { reason: '' } : null,
        exchange: form.pricing_model === 'exchange' ? {
          host_offers: form.host_offers.trim(),
          traveler_can_offer: csvToArray(form.traveler_can_offer),
          exchange_value_hint: form.exchange_value_hint.trim(),
        } : null,
      },

      includes: csvToArray(form.includes),
      excludes: csvToArray(form.excludes),
      material_requirements: csvToArray(form.material_requirements),
      accessibility_notes: form.accessibility_notes.trim(),
      age_restriction: form.age_restriction.trim() || null,
      cancellation_policy: form.cancellation_policy,
    };

    Alert.alert('Created', 'Service created (stub). Check console for payload.');
    console.log('[Create Cultural Service] payload:', payload);
    onDone?.();
  };

  // ---------- UI primitives ----------
  const Field = ({ label, error, multiline, ...props }) => (
    <View style={{ marginBottom: 12 }}>
      <Text style={styles.label}>{label}</Text>
      <TextInput
        style={[
          styles.input,
          multiline && { minHeight: 90, textAlignVertical: 'top' },
          error && styles.inputError,
        ]}
        placeholder={label}
        multiline={!!multiline}
        {...props}
      />
      {!!error && <Text style={styles.errorText}>{error}</Text>}
    </View>
  );

  const Card = ({ title, children }) => (
    <View style={styles.card}>
      {!!title && <Text style={styles.cardTitle}>{title}</Text>}
      {children}
    </View>
  );

  const Chip = ({ text, selected, onPress }) => (
    <TouchableOpacity
      onPress={onPress}
      style={[styles.chip, selected && styles.chipSelected]}
      activeOpacity={0.85}
    >
      <Text style={[styles.chipText, selected && styles.chipTextSelected]}>{text}</Text>
    </TouchableOpacity>
  );

  const ChipGroup = ({ label, value, onChange, options, allowFreeText = false }) => {
    const opts = options.map(o => (typeof o === 'object' ? o : ({ label: String(o), value: String(o) })));
    return (
      <View style={{ marginBottom: 12 }}>
        <Text style={styles.label}>{label}</Text>
        <View style={styles.rowWrap}>
          {opts.map(opt => (
            <Chip
              key={opt.value}
              text={opt.label}
              selected={value === opt.value || value === opt.label}
              onPress={() => onChange(opt.value)}
            />
          ))}
        </View>
        {allowFreeText && (
          <TextInput
            style={[styles.input, { marginTop: 8 }]}
            placeholder="Or type a custom value"
            value={value}
            onChangeText={onChange}
          />
        )}
      </View>
    );
  };

  // ---------- render ----------
  return (
    <ScrollView contentContainerStyle={styles.wrap}>
      <View style={styles.header}>
        <TouchableOpacity onPress={onBack} style={styles.backBtn}>
          <Ionicons name="arrow-back" size={18} />
        </TouchableOpacity>
        <Text style={styles.h1}>Add Cultural Service</Text>
      </View>

      {/* BASICS */}
      <Card>
        <Field label="Title" value={form.title} onChangeText={t => set('title', t)} error={errors.title} />
        <ChipGroup
          label="Experience Type"
          value={form.experience_type}
          onChange={v => set('experience_type', v)}
          options={EXPERIENCE_TYPES}
        />
        <ChipGroup
          label="Category"
          value={form.category}
          onChange={v => set('category', v)}
          options={(catOptions.length ? catOptions : ['General']).map(c => ({ label: c, value: c }))}
          allowFreeText
        />
        <Field label="Tags (comma separated)" value={form.tags} onChangeText={t => set('tags', t)} placeholder="hands-on, budget-friendly" />
        <Field label="Description" multiline value={form.description} onChangeText={t => set('description', t)} />
      </Card>

      {/* WHERE & WHEN */}
      <Card title="Where & When">
        <Field label="City" value={form.city} onChangeText={t => set('city', t)} error={errors.city} />
        <Field label="Meeting Point" value={form.meeting_point_label} onChangeText={t => set('meeting_point_label', t)} placeholder="Café ABC, Main Bazaar" />

        <ChipGroup
          label="Schedule Type"
          value={form.schedule_type}
          onChange={v => set('schedule_type', v)}
          options={SCHEDULE_TYPES}
        />

        {/* Fixed dates: native calendar + chips; web: CSV input */}
        {form.schedule_type === 'fixed_dates' && (
          <>
            {Platform.OS !== 'web' ? (
              <>
                <Text style={styles.label}>Add date(s)</Text>
                <View style={styles.rowWrap}>
                  <TouchableOpacity style={styles.pickerBtn} onPress={openDatePicker}>
                    <Ionicons name="calendar-outline" size={16} color="#0f172a" />
                    <Text style={styles.pickerBtnText}>Pick a date</Text>
                  </TouchableOpacity>
                  {!!errors.fixed_dates && <Text style={styles.errorText}>{errors.fixed_dates}</Text>}
                </View>

                <View style={[styles.rowWrap, { marginTop: 8 }]}>
                  {form.fixed_dates.map(d => (
                    <View key={d} style={styles.dateChip}>
                      <Text style={styles.dateChipText}>{d}</Text>
                      <TouchableOpacity onPress={() => removeFixedDate(d)} hitSlop={8}>
                        <Ionicons name="close-circle" size={16} color="#991B1B" />
                      </TouchableOpacity>
                    </View>
                  ))}
                </View>

                {showDatePicker && (
                  <DateTimePicker
                    mode="date"
                    value={new Date()}
                    onChange={onPickDate}
                    display={Platform.OS === 'ios' ? 'inline' : 'default'}
                  />
                )}
              </>
            ) : (
              <Field
                label="Available dates (YYYY-MM-DD, comma separated)"
                value={form.availableDatesText}
                onChangeText={t => set('availableDatesText', t)}
                placeholder="2025-10-08, 2025-10-12"
                error={errors.availableDatesText}
              />
            )}
          </>
        )}

        {/* Weekly repeat: day chips + native time picker */}
        {form.schedule_type === 'repeat_weekly' && (
          <>
            <Text style={styles.label}>Days of Week</Text>
            <View style={styles.rowWrap}>
              {WEEK_DAYS.map(d => (
                <TouchableOpacity
                  key={d}
                  onPress={() => toggleDay(d)}
                  style={[styles.chip, form.days_of_week.includes(d) && styles.chipSelected]}
                >
                  <Text style={[styles.chipText, form.days_of_week.includes(d) && styles.chipTextSelected]}>{d}</Text>
                </TouchableOpacity>
              ))}
            </View>
            {!!errors.days_of_week && <Text style={styles.errorText}>{errors.days_of_week}</Text>}

            {/* Time */}
            {Platform.OS !== 'web' ? (
              <View style={{ marginTop: 12 }}>
                <Text style={styles.label}>Start Time</Text>
                <TouchableOpacity style={styles.pickerBtn} onPress={openTimePicker}>
                  <Ionicons name="time-outline" size={16} color="#0f172a" />
                  <Text style={styles.pickerBtnText}>
                    {form.start_time ? form.start_time : 'Pick time'}
                  </Text>
                </TouchableOpacity>
                {!!errors.start_time && <Text style={styles.errorText}>{errors.start_time}</Text>}
                {showTimePicker && (
                  <DateTimePicker
                    mode="time"
                    value={new Date()}
                    onChange={onPickTime}
                    display={Platform.OS === 'ios' ? 'spinner' : 'default'}
                    is24Hour
                  />
                )}
              </View>
            ) : (
              <Field
                label="Start Time (24h HH:MM)"
                value={form.start_time}
                onChangeText={t => set('start_time', t)}
                placeholder="14:00"
                error={errors.start_time}
              />
            )}

            <Field
              label="Duration (hours)"
              keyboardType="numeric"
              value={form.duration_hours}
              onChangeText={t => set('duration_hours', t)}
              error={errors.duration_hours}
            />
          </>
        )}

        {/* On request */}
        {form.schedule_type === 'on_request' && (
          <>
            <Field
              label="Lead time (days)"
              keyboardType="numeric"
              value={form.lead_time_days}
              onChangeText={t => set('lead_time_days', t)}
              error={errors.lead_time_days}
            />
            <Field
              label="Typical duration (hours)"
              keyboardType="numeric"
              value={form.duration_hours}
              onChangeText={t => set('duration_hours', t)}
              error={errors.duration_hours}
            />
          </>
        )}
      </Card>

      {/* CAPACITY & LANGUAGES */}
      <Card title="Capacity & Languages">
        <Field label="Max Group Size" keyboardType="numeric" value={form.group_size_max} onChangeText={t => set('group_size_max', t)} error={errors.group_size_max} />
        <Field label="Languages (comma separated)" value={form.languages} onChangeText={t => set('languages', t)} placeholder="English, Urdu" />
      </Card>

      {/* PRICING */}
      <Card title="Pricing / Exchange">
        <ChipGroup
          label="Pricing Model"
          value={form.pricing_model}
          onChange={v => set('pricing_model', v)}
          options={PRICING_MODELS}
        />

        {form.pricing_model === 'per_person' && (
          <Field label="Price per person" keyboardType="numeric" value={form.price_per_person} onChangeText={t => set('price_per_person', t)} error={errors.price_per_person} />
        )}

        {form.pricing_model === 'per_group' && (
          <>
            <Field label="Price per group" keyboardType="numeric" value={form.price_per_group} onChangeText={t => set('price_per_group', t)} error={errors.price_per_group} />
            <Field label="Group size included in price" keyboardType="numeric" value={form.group_included_size} onChangeText={t => set('group_included_size', t)} error={errors.group_included_size} />
          </>
        )}

        {form.pricing_model === 'exchange' && (
          <>
            <Field label="Host offers (what you give)" value={form.host_offers} onChangeText={t => set('host_offers', t)} error={errors.host_offers} placeholder="2-hour cooking class" />
            <Field label="Traveler can offer (comma separated)" value={form.traveler_can_offer} onChangeText={t => set('traveler_can_offer', t)} error={errors.traveler_can_offer} placeholder="photography, social media, translation" />
            <Field label="Exchange value hint (optional)" value={form.exchange_value_hint} onChangeText={t => set('exchange_value_hint', t)} placeholder="Equivalent to ~Rs 4000 value" />
          </>
        )}
      </Card>

      {/* WHAT'S INCLUDED */}
      <Card title="What’s included / not">
        <Field label="What’s included (comma separated)" value={form.includes} onChangeText={t => set('includes', t)} placeholder="materials, snacks" />
        <Field label="What’s not included (comma separated)" value={form.excludes} onChangeText={t => set('excludes', t)} placeholder="transport, tickets" />
        <Field label="Material / attire requirements (comma separated)" value={form.material_requirements} onChangeText={t => set('material_requirements', t)} placeholder="comfortable shoes, head covering" />
      </Card>

      {/* POLICIES */}
      <Card title="Policies & Safety">
        <Field label="Age restriction (optional)" value={form.age_restriction} onChangeText={t => set('age_restriction', t)} placeholder="12+" />
        <Field label="Accessibility notes" value={form.accessibility_notes} onChangeText={t => set('accessibility_notes', t)} placeholder="Stairs at venue, no elevator" />
        <ChipGroup
          label="Cancellation Policy"
          value={form.cancellation_policy}
          onChange={v => set('cancellation_policy', v)}
          options={CANCELLATION}
        />
      </Card>

      <TouchableOpacity style={styles.primary} onPress={submit}>
        <Text style={styles.primaryText}>Create Service</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

// ---------- styles ----------
const styles = StyleSheet.create({
  wrap: { padding: 12, gap: 12, paddingBottom: 24 },
  header: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  backBtn: { padding: 6, borderRadius: 8, backgroundColor: '#F1F5F9' },
  h1: { fontSize: 18, fontWeight: '800', color: '#0f172a' },

  card: {
    backgroundColor: '#fff',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    padding: 12,
    marginTop: 8,
    ...Platform.select({
      web: { boxShadow: '0 6px 16px rgba(0,0,0,0.06)' },
      default: { elevation: 1 },
    }),
  },
  cardTitle: { fontWeight: '800', color: '#0f172a', marginBottom: 8 },

  label: { fontWeight: '700', color: '#0f172a', marginBottom: 6, fontSize: 12 },
  input: {
    backgroundColor: '#F8FAFC',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: 10,
    padding: 10,
  },
  inputError: { borderColor: '#EF4444', backgroundColor: '#FEF2F2' },
  errorText: { color: '#B91C1C', marginTop: 4, fontSize: 12, fontWeight: '700' },

  rowWrap: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },

  chip: {
    paddingVertical: 6, paddingHorizontal: 12, borderRadius: 999,
    backgroundColor: '#F1F5F9', borderWidth: 1, borderColor: '#E5E7EB',
  },
  chipSelected: { backgroundColor: '#E0F2FE', borderColor: '#7DD3FC' },
  chipText: { color: '#0f172a', fontWeight: '700', fontSize: 12 },
  chipTextSelected: { color: '#075985' },

  primary: { backgroundColor: '#0ea5e9', padding: 14, borderRadius: 12, marginTop: 8, alignItems: 'center' },
  primaryText: { color: '#fff', fontWeight: '800' },

  pickerBtn: {
    flexDirection: 'row', alignItems: 'center', gap: 8,
    backgroundColor: '#F1F5F9', borderWidth: 1, borderColor: '#E5E7EB',
    borderRadius: 999, paddingVertical: 8, paddingHorizontal: 12,
  },
  pickerBtnText: { fontWeight: '800', color: '#0f172a' },

  dateChip: {
    flexDirection: 'row', alignItems: 'center', gap: 6,
    backgroundColor: '#EEF2FF', borderWidth: 1, borderColor: '#C7D2FE',
    borderRadius: 999, paddingVertical: 4, paddingHorizontal: 10,
  },
  dateChipText: { fontSize: 12, fontWeight: '700', color: '#3730A3' },
});
