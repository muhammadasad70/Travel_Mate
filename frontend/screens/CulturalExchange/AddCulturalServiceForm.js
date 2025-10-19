

// // // screens/CulturalExchange/AddCulturalServiceForm.js
// // import React, { useMemo, useState, useEffect } from 'react';
// // import {
// //   View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView, Alert, Platform, KeyboardAvoidingView,
// // } from 'react-native';
// // import { Ionicons } from '@expo/vector-icons';
// // import DateTimePicker from '@react-native-community/datetimepicker';

// // /* ========= Backend Config ========= */
// // import AsyncStorage from '@react-native-async-storage/async-storage';
// // import getBaseURL from '../../config/env';

// // const API_BASE = getBaseURL().replace(/\/+$/, '');

// // const TOKEN_KEYS = ['token','auth_token','jwt','access_token','AUTH_TOKEN','userToken'];
// // const getAuthToken = async () => {
// //   for (const k of TOKEN_KEYS) {
// //     const v = await AsyncStorage.getItem(k);
// //     if (v) return v;
// //   }
// //   return null;
// // };
// // const showMsg = (title, msg) => {
// //   if (Platform.OS === 'web') alert(`${title ? title + ': ' : ''}${msg}`);
// //   else Alert.alert(title || 'Notice', msg);
// // };
// // /* ================================== */

// // const EXPERIENCE_TYPES = [
// //   { label: 'Workshop / Class', value: 'workshop' },
// //   { label: 'Neighborhood / Culture Walk', value: 'walk' },
// //   { label: 'Home / Community Experience', value: 'home_experience' },
// //   { label: 'Skill / Service Exchange', value: 'skill_exchange' },
// // ];

// // const SCHEDULE_TYPES = [
// //   { label: 'Fixed Dates', value: 'fixed_dates' },
// //   { label: 'Repeat Weekly', value: 'repeat_weekly' },
// //   { label: 'On Request', value: 'on_request' },
// // ];

// // const PRICING_MODELS = [
// //   { label: 'Per Person', value: 'per_person' },
// //   { label: 'Per Group', value: 'per_group' },
// //   { label: 'Free', value: 'free' },
// //   { label: 'Exchange', value: 'exchange' },
// // ];

// // const WEEK_DAYS = ['Mon','Tue','Wed','Thu','Fri','Sat','Sun'];
// // const CANCELLATION = [
// //   { label: 'Flexible', value: 'flexible' },
// //   { label: 'Moderate', value: 'moderate' },
// //   { label: 'Strict', value: 'strict' },
// // ];

// // const CATEGORIES_BY_TYPE = {
// //   workshop: ['Cooking', 'Craft', 'Music & Dance', 'Language'],
// //   walk: ['Street Food', 'Heritage Walk', 'Bazaar Walk', 'Architecture'],
// //   home_experience: ['Home Meal', 'Tea Ceremony', 'Festival Visit', 'Village/Farm'],
// //   skill_exchange: ['Photography ↔ Experience', 'Video Editing ↔ Experience', 'English Conversation ↔ Experience'],
// // };

// // /* ---------- Field (uncontrolled while typing) ---------- */
// // const Field = React.memo(function Field({
// //   label, name, value, onCommit, error, multiline, placeholder, keyboardType, ...props
// // }) {
// //   const [inner, setInner] = useState(value ?? '');

// //   // keep in sync if parent updates (e.g., reset)
// //   useEffect(() => {
// //     setInner(value ?? '');
// //     // eslint-disable-next-line react-hooks/exhaustive-deps
// //   }, [value]);

// //   const commit = () => {
// //     if (onCommit) onCommit(name, inner);
// //   };

// //   return (
// //     <View style={{ marginBottom: 12 }}>
// //       <Text style={styles.label}>{label}</Text>
// //       <TextInput
// //         value={inner}
// //         onChangeText={setInner}
// //         onBlur={commit}
// //         onSubmitEditing={commit}
// //         blurOnSubmit
// //         placeholder={placeholder || label}
// //         keyboardType={keyboardType}
// //         style={[
// //           styles.input,
// //           multiline && styles.multilineFixed,
// //           error && styles.inputError,
// //         ]}
// //         multiline={!!multiline}
// //         {...props}
// //       />
// //       {!!error && <Text style={styles.errorText}>{error}</Text>}
// //     </View>
// //   );
// // });

// // /* ---------- Chips ---------- */
// // const Chip = ({ text, selected, onPress }) => (
// //   <TouchableOpacity
// //     onPress={onPress}
// //     style={[styles.chip, selected && styles.chipSelected]}
// //     activeOpacity={0.85}
// //   >
// //     <Text style={[styles.chipText, selected && styles.chipTextSelected]}>{text}</Text>
// //   </TouchableOpacity>
// // );

// // const ChipGroup = ({ label, value, onChange, options, allowFreeText = false }) => {
// //   const [free, setFree] = useState(value ?? '');
// //   useEffect(() => { setFree(value ?? ''); }, [value]);

// //   const opts = options.map(o => (typeof o === 'object' ? o : ({ label: String(o), value: String(o) })));
// //   return (
// //     <View style={{ marginBottom: 12 }}>
// //       <Text style={styles.label}>{label}</Text>
// //       <View style={styles.rowWrap}>
// //         {opts.map(opt => (
// //           <Chip
// //             key={opt.value}
// //             text={opt.label}
// //             selected={value === opt.value || value === opt.label}
// //             onPress={() => onChange(opt.value)}
// //           />
// //         ))}
// //       </View>
// //       {allowFreeText && (
// //         <TextInput
// //           value={free}
// //           onChangeText={setFree}
// //           onBlur={() => onChange(free)}
// //           placeholder="Or type a custom value"
// //           style={[styles.input, { marginTop: 8 }]}
// //         />
// //       )}
// //     </View>
// //   );
// // };

// // export default function AddCulturalServiceForm({ onDone, onBack }) {
// //   const [form, setForm] = useState({
// //     title: '',
// //     experience_type: 'workshop',
// //     category: '',
// //     tags: '',
// //     description: '',

// //     city: '',
// //     meeting_point_label: '',
// //     schedule_type: 'fixed_dates',

// //     fixed_dates: [],
// //     availableDatesText: '',

// //     days_of_week: [],
// //     start_time: '',
// //     duration_hours: '',
// //     lead_time_days: '',

// //     group_size_max: '',
// //     languages: '',

// //     pricing_model: 'per_person',
// //     price_per_person: '',
// //     price_per_group: '',
// //     group_included_size: '',

// //     host_offers: '',
// //     traveler_can_offer: '',
// //     exchange_value_hint: '',

// //     includes: '',
// //     excludes: '',
// //     material_requirements: '',
// //     accessibility_notes: '',
// //     age_restriction: '',
// //     cancellation_policy: 'moderate',
// //   });

// //   const [errors, setErrors] = useState({});
// //   const [showDatePicker, setShowDatePicker] = useState(false);
// //   const [showTimePicker, setShowTimePicker] = useState(false);

// //   const set = (k, v) => setForm(s => ({ ...s, [k]: v }));
// //   const onCommit = (k, v) => setForm(s => ({ ...s, [k]: v }));

// //   const catOptions = useMemo(() => CATEGORIES_BY_TYPE[form.experience_type] || [], [form.experience_type]);

// //   const toggleDay = (d) => {
// //     set('days_of_week',
// //       form.days_of_week.includes(d)
// //         ? form.days_of_week.filter(x => x !== d)
// //         : [...form.days_of_week, d]
// //     );
// //   };

// //   // ---------- helpers ----------
// //   const toYMD = (dateObj) => {
// //     const y = dateObj.getFullYear();
// //     const m = String(dateObj.getMonth() + 1).padStart(2, '0');
// //     const d = String(dateObj.getDate()).padStart(2, '0');
// //     return `${y}-${m}-${d}`;
// //   };
// //   const csvToArray = (s) =>
// //     String(s || '')
// //       .split(',')
// //       .map(x => x.trim())
// //       .filter(Boolean);
// //   const isHHMM = (s) => /^([01]\d|2[0-3]):[0-5]\d$/.test(String(s || ''));
// //   const isDate = (s) => /^\d{4}-\d{2}-\d{2}$/.test(String(s || ''));
// //   const num = (v) => {
// //     const n = Number(v);
// //     return Number.isFinite(n) ? n : NaN;
// //   };

// //   // ---------- pickers ----------
// //   const openDatePicker = () => setShowDatePicker(true);
// //   const onPickDate = (e, date) => {
// //     setShowDatePicker(false);
// //     if (!date) return;
// //     const ymd = toYMD(date);
// //     if (!form.fixed_dates.includes(ymd)) {
// //       set('fixed_dates', [...form.fixed_dates, ymd].sort());
// //     }
// //   };
// //   const removeFixedDate = (d) => set('fixed_dates', form.fixed_dates.filter(x => x !== d));

// //   const openTimePicker = () => setShowTimePicker(true);
// //   const onPickTime = (e, date) => {
// //     setShowTimePicker(false);
// //     if (!date) return;
// //     const hh = String(date.getHours()).padStart(2, '0');
// //     const mm = String(date.getMinutes()).padStart(2, '0');
// //     set('start_time', `${hh}:${mm}`);
// //   };

// //   // ---------- validation ----------
// //   const validate = () => {
// //     const e = {};

// //     if (!form.title.trim()) e.title = 'Title is required';
// //     if (!form.city.trim()) e.city = 'City is required';

// //     if (form.schedule_type === 'fixed_dates') {
// //       const dates = Platform.OS === 'web'
// //         ? csvToArray(form.availableDatesText)
// //         : form.fixed_dates;

// //       if (dates.length === 0) e.fixed_dates = 'Select at least one date';
// //       if (dates.some(d => !isDate(d))) {
// //         if (Platform.OS === 'web') e.availableDatesText = 'Dates must be YYYY-MM-DD';
// //         else e.fixed_dates = 'Dates must be valid YYYY-MM-DD';
// //       }
// //     }

// //     if (form.schedule_type === 'repeat_weekly') {
// //       if (form.days_of_week.length === 0) e.days_of_week = 'Pick at least one day';
// //       if (!isHHMM(form.start_time)) e.start_time = 'Use 24h time, e.g., 14:00';
// //       if (!(num(form.duration_hours) > 0)) e.duration_hours = 'Enter duration in hours';
// //     }

// //     if (form.schedule_type === 'on_request') {
// //       if (!(num(form.lead_time_days) >= 0)) e.lead_time_days = 'Enter lead time in days';
// //       if (!(num(form.duration_hours) > 0)) e.duration_hours = 'Enter typical duration in hours';
// //     }

// //     if (form.group_size_max && !(num(form.group_size_max) > 0)) {
// //       e.group_size_max = 'Must be a number > 0';
// //     }

// //     if (form.pricing_model === 'per_person') {
// //       if (!(num(form.price_per_person) > 0)) e.price_per_person = 'Price per person required';
// //     }
// //     if (form.pricing_model === 'per_group') {
// //       if (!(num(form.price_per_group) > 0)) e.price_per_group = 'Price per group required';
// //       if (!(num(form.group_included_size) > 0)) e.group_included_size = 'Included group size required';
// //     }
// //     if (form.pricing_model === 'exchange') {
// //       if (!form.host_offers.trim()) e.host_offers = 'Describe what you offer';
// //       if (csvToArray(form.traveler_can_offer).length === 0) e.traveler_can_offer = 'List at least one traveler skill';
// //     }

// //     setErrors(e);
// //     return Object.keys(e).length === 0;
// //   };

// //   // ---------- submit (wired to backend) ----------
// //   const submit = async () => {
// //     if (!validate()) {
// //       Alert.alert('Please fix the highlighted fields');
// //       return;
// //     }

// //     const payload = {
// //       title: form.title.trim(),
// //       experience_type: form.experience_type,
// //       category: form.category.trim(),
// //       tags: csvToArray(form.tags),
// //       description: form.description.trim(),

// //       city: form.city.trim(),
// //       meeting_point_label: form.meeting_point_label.trim(),
// //       schedule: {
// //         type: form.schedule_type,
// //         fixed_dates:
// //           form.schedule_type === 'fixed_dates'
// //             ? (Platform.OS === 'web'
// //                 ? csvToArray(form.availableDatesText)
// //                 : form.fixed_dates)
// //             : [],
// //         weekly: form.schedule_type === 'repeat_weekly' ? {
// //           days_of_week: form.days_of_week,
// //           start_time: form.start_time,
// //           duration_hours: Number(form.duration_hours),
// //         } : null,
// //         on_request: form.schedule_type === 'on_request' ? {
// //           lead_time_days: Number(form.lead_time_days),
// //           duration_hours: Number(form.duration_hours),
// //         } : null,
// //       },

// //       group_size_max: form.group_size_max ? Number(form.group_size_max) : 0,
// //       languages: csvToArray(form.languages),

// //       pricing: {
// //         model: form.pricing_model,
// //         per_person: form.pricing_model === 'per_person' ? { price_per_person: Number(form.price_per_person) } : null,
// //         per_group: form.pricing_model === 'per_group' ? {
// //           price_per_group: Number(form.price_per_group),
// //           group_included_size: Number(form.group_included_size),
// //         } : null,
// //         free: form.pricing_model === 'free' ? { reason: '' } : null,
// //         exchange: form.pricing_model === 'exchange' ? {
// //           host_offers: form.host_offers.trim(),
// //           traveler_can_offer: csvToArray(form.traveler_can_offer),
// //           exchange_value_hint: form.exchange_value_hint.trim(),
// //         } : null,
// //       },

// //       includes: csvToArray(form.includes),
// //       excludes: csvToArray(form.excludes),
// //       material_requirements: csvToArray(form.material_requirements),
// //       accessibility_notes: form.accessibility_notes.trim(),
// //       age_restriction: form.age_restriction.trim() ? form.age_restriction.trim() : null,
// //       cancellation_policy: form.cancellation_policy,
// //     };

// //     try {
// //       const token = await getAuthToken();
// //       if (!token) {
// //         showMsg('Not logged in', 'Please log in again.');
// //         return;
// //       }

// //       const controller = new AbortController();
// //       const timeout = setTimeout(() => controller.abort(), 20000);

// //       const res = await fetch(`${API_BASE}/cultural/services`, {
// //         method: 'POST',
// //         headers: {
// //           'Content-Type': 'application/json',
// //           Authorization: `Bearer ${token}`,
// //         },
// //         body: JSON.stringify(payload),
// //         signal: controller.signal,
// //       });

// //       clearTimeout(timeout);

// //       const text = await res.text();
// //       let json = null;
// //       try { json = text ? JSON.parse(text) : null; } catch {}

// //       if (res.status === 401) { showMsg('Session expired', 'Please log in again.'); return; }
// //       if (res.status === 428) { showMsg('Complete Profile', json?.error || 'Please complete your profile to continue.'); return; }

// //       if (!res.ok) {
// //         const friendly = {
// //           400: 'Invalid data. Please review the fields.',
// //           403: "You don't have permission to do that.",
// //           404: 'Endpoint not found.',
// //           500: 'Server error. Please try again.',
// //           502: 'Bad gateway.',
// //           503: 'Server unavailable.',
// //           504: 'Server timed out.',
// //         };
// //         showMsg('Error', json?.error || friendly[res.status] || `Failed (HTTP ${res.status})`);
// //         return;
// //       }

// //       showMsg('Success', 'Service created successfully.');
// //       onDone?.();
// //     } catch (err) {
// //       const aborted = err?.name === 'AbortError';
// //       showMsg('Network Error', aborted ? 'Request timed out.' : 'Unable to reach the server.');
// //     }
// //   };

// //   // ---------- render ----------
// //   return (
// //     <KeyboardAvoidingView
// //       style={{ flex: 1 }}
// //       behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
// //       keyboardVerticalOffset={Platform.select({ ios: 64, android: 0, default: 0 })}
// //     >
// //       <ScrollView
// //         contentContainerStyle={styles.wrap}
// //         keyboardShouldPersistTaps="handled"
// //         keyboardDismissMode={Platform.OS === 'ios' ? 'interactive' : 'on-drag'}
// //         removeClippedSubviews={false}
// //         {...(Platform.OS === 'ios' ? { contentInsetAdjustmentBehavior: 'automatic' } : {})}
// //       >
// //         <View style={styles.header}>
// //           <TouchableOpacity onPress={onBack} style={styles.backBtn}>
// //             <Ionicons name="arrow-back" size={18} />
// //           </TouchableOpacity>
// //           <Text style={styles.h1}>Add Cultural Service</Text>
// //         </View>

// //         {/* BASICS */}
// //         <View style={styles.card}>
// //           <Field label="Title" name="title" value={form.title} onCommit={onCommit} error={errors.title} />
// //           <ChipGroup
// //             label="Experience Type"
// //             value={form.experience_type}
// //             onChange={v => set('experience_type', v)}
// //             options={EXPERIENCE_TYPES}
// //           />
// //           <ChipGroup
// //             label="Category"
// //             value={form.category}
// //             onChange={v => set('category', v)}
// //             options={(catOptions.length ? catOptions : ['General']).map(c => ({ label: c, value: c }))}
// //             allowFreeText
// //           />
// //           <Field label="Tags (comma separated)" name="tags" value={form.tags} onCommit={onCommit} placeholder="hands-on, budget-friendly" />
// //           <Field label="Description" name="description" value={form.description} onCommit={onCommit} multiline />
// //         </View>

// //         {/* WHERE & WHEN */}
// //         <View style={styles.card}>
// //           <Text style={styles.cardTitle}>Where & When</Text>
// //           <Field label="City" name="city" value={form.city} onCommit={onCommit} error={errors.city} />
// //           <Field label="Meeting Point" name="meeting_point_label" value={form.meeting_point_label} onCommit={onCommit} placeholder="Café ABC, Main Bazaar" />

// //           <ChipGroup
// //             label="Schedule Type"
// //             value={form.schedule_type}
// //             onChange={v => set('schedule_type', v)}
// //             options={SCHEDULE_TYPES}
// //           />

// //           {/* Fixed dates */}
// //           {form.schedule_type === 'fixed_dates' && (
// //             <>
// //               {Platform.OS !== 'web' ? (
// //                 <>
// //                   <Text style={styles.label}>Add date(s)</Text>
// //                   <View style={[styles.rowWrap, { marginBottom: 4 }]}>
// //                     <TouchableOpacity style={styles.pickerBtn} onPress={openDatePicker}>
// //                       <Ionicons name="calendar-outline" size={16} color="#0f172a" />
// //                       <Text style={styles.pickerBtnText}>Pick a date</Text>
// //                     </TouchableOpacity>
// //                     {!!errors.fixed_dates && <Text style={styles.errorText}>{errors.fixed_dates}</Text>}
// //                   </View>

// //                   <View style={styles.rowWrap}>
// //                     {form.fixed_dates.map(d => (
// //                       <View key={d} style={styles.dateChip}>
// //                         <Text style={styles.dateChipText}>{d}</Text>
// //                         <TouchableOpacity onPress={() => removeFixedDate(d)} hitSlop={8}>
// //                           <Ionicons name="close-circle" size={16} color="#991B1B" />
// //                         </TouchableOpacity>
// //                       </View>
// //                     ))}
// //                   </View>

// //                   {showDatePicker && (
// //                     <DateTimePicker
// //                       mode="date"
// //                       value={new Date()}
// //                       onChange={onPickDate}
// //                       display={Platform.OS === 'ios' ? 'inline' : 'default'}
// //                     />
// //                   )}
// //                 </>
// //               ) : (
// //                 <Field
// //                   label="Available dates (YYYY-MM-DD, comma separated)"
// //                   name="availableDatesText"
// //                   value={form.availableDatesText}
// //                   onCommit={onCommit}
// //                   placeholder="2025-10-08, 2025-10-12"
// //                   error={errors.availableDatesText}
// //                 />
// //               )}
// //             </>
// //           )}

// //           {/* Weekly repeat */}
// //           {form.schedule_type === 'repeat_weekly' && (
// //             <>
// //               <Text style={styles.label}>Days of Week</Text>
// //               <View style={styles.rowWrap}>
// //                 {WEEK_DAYS.map(d => (
// //                   <TouchableOpacity
// //                     key={d}
// //                     onPress={() => toggleDay(d)}
// //                     style={[styles.chip, form.days_of_week.includes(d) && styles.chipSelected]}
// //                   >
// //                     <Text style={[styles.chipText, form.days_of_week.includes(d) && styles.chipTextSelected]}>{d}</Text>
// //                   </TouchableOpacity>
// //                 ))}
// //               </View>
// //               {!!errors.days_of_week && <Text style={styles.errorText}>{errors.days_of_week}</Text>}

// //               {Platform.OS !== 'web' ? (
// //                 <View style={{ marginTop: 12 }}>
// //                   <Text style={styles.label}>Start Time</Text>
// //                   <TouchableOpacity style={styles.pickerBtn} onPress={openTimePicker}>
// //                     <Ionicons name="time-outline" size={16} color="#0f172a" />
// //                     <Text style={styles.pickerBtnText}>
// //                       {form.start_time ? form.start_time : 'Pick time'}
// //                     </Text>
// //                   </TouchableOpacity>
// //                   {!!errors.start_time && <Text style={styles.errorText}>{errors.start_time}</Text>}
// //                   {showTimePicker && (
// //                     <DateTimePicker
// //                       mode="time"
// //                       value={new Date()}
// //                       onChange={onPickTime}
// //                       display={Platform.OS === 'ios' ? 'spinner' : 'default'}
// //                       is24Hour
// //                     />
// //                   )}
// //                 </View>
// //               ) : (
// //                 <Field
// //                   label="Start Time (24h HH:MM)"
// //                   name="start_time"
// //                   value={form.start_time}
// //                   onCommit={onCommit}
// //                   placeholder="14:00"
// //                   error={errors.start_time}
// //                 />
// //               )}

// //               <Field
// //                 label="Duration (hours)"
// //                 name="duration_hours"
// //                 keyboardType="numeric"
// //                 value={form.duration_hours}
// //                 onCommit={onCommit}
// //                 error={errors.duration_hours}
// //               />
// //             </>
// //           )}

// //           {/* On request */}
// //           {form.schedule_type === 'on_request' && (
// //             <>
// //               <Field
// //                 label="Lead time (days)"
// //                 name="lead_time_days"
// //                 keyboardType="numeric"
// //                 value={form.lead_time_days}
// //                 onCommit={onCommit}
// //                 error={errors.lead_time_days}
// //               />
// //               <Field
// //                 label="Typical duration (hours)"
// //                 name="duration_hours"
// //                 keyboardType="numeric"
// //                 value={form.duration_hours}
// //                 onCommit={onCommit}
// //                 error={errors.duration_hours}
// //               />
// //             </>
// //           )}
// //         </View>

// //         {/* CAPACITY & LANGUAGES */}
// //         <View style={styles.card}>
// //           <Text style={styles.cardTitle}>Capacity & Languages</Text>
// //           <Field label="Max Group Size" name="group_size_max" keyboardType="numeric" value={form.group_size_max} onCommit={onCommit} error={errors.group_size_max} />
// //           <Field label="Languages (comma separated)" name="languages" value={form.languages} onCommit={onCommit} placeholder="English, Urdu" />
// //         </View>

// //         {/* PRICING */}
// //         <View style={styles.card}>
// //           <Text style={styles.cardTitle}>Pricing / Exchange</Text>
// //           <ChipGroup
// //             label="Pricing Model"
// //             value={form.pricing_model}
// //             onChange={v => set('pricing_model', v)}
// //             options={PRICING_MODELS}
// //           />

// //           {form.pricing_model === 'per_person' && (
// //             <Field label="Price per person" name="price_per_person" keyboardType="numeric" value={form.price_per_person} onCommit={onCommit} error={errors.price_per_person} />
// //           )}

// //           {form.pricing_model === 'per_group' && (
// //             <>
// //               <Field label="Price per group" name="price_per_group" keyboardType="numeric" value={form.price_per_group} onCommit={onCommit} error={errors.price_per_group} />
// //               <Field label="Group size included in price" name="group_included_size" keyboardType="numeric" value={form.group_included_size} onCommit={onCommit} error={errors.group_included_size} />
// //             </>
// //           )}

// //           {form.pricing_model === 'exchange' && (
// //             <>
// //               <Field label="Host offers (what you give)" name="host_offers" value={form.host_offers} onCommit={onCommit} error={errors.host_offers} placeholder="2-hour cooking class" />
// //               <Field label="Traveler can offer (comma separated)" name="traveler_can_offer" value={form.traveler_can_offer} onCommit={onCommit} error={errors.traveler_can_offer} placeholder="photography, social media, translation" />
// //               <Field label="Exchange value hint (optional)" name="exchange_value_hint" value={form.exchange_value_hint} onCommit={onCommit} placeholder="Equivalent to ~Rs 4000 value" />
// //             </>
// //           )}
// //         </View>

// //         {/* WHAT'S INCLUDED */}
// //         <View style={styles.card}>
// //           <Text style={styles.cardTitle}>What’s included / not</Text>
// //           <Field label="What’s included (comma separated)" name="includes" value={form.includes} onCommit={onCommit} placeholder="materials, snacks" />
// //           <Field label="What’s not included (comma separated)" name="excludes" value={form.excludes} onCommit={onCommit} placeholder="transport, tickets" />
// //           <Field label="Material / attire requirements (comma separated)" name="material_requirements" value={form.material_requirements} onCommit={onCommit} placeholder="comfortable shoes, head covering" />
// //         </View>

// //         {/* POLICIES */}
// //         <View style={styles.card}>
// //           <Text style={styles.cardTitle}>Policies & Safety</Text>
// //           <Field label="Age restriction (optional)" name="age_restriction" value={form.age_restriction} onCommit={onCommit} placeholder="12+" />
// //           <Field label="Accessibility notes" name="accessibility_notes" value={form.accessibility_notes} onCommit={onCommit} placeholder="Stairs at venue, no elevator" />
// //           <ChipGroup
// //             label="Cancellation Policy"
// //             value={form.cancellation_policy}
// //             onChange={v => set('cancellation_policy', v)}
// //             options={CANCELLATION}
// //           />
// //         </View>

// //         <TouchableOpacity style={styles.primary} onPress={submit}>
// //           <Text style={styles.primaryText}>Create Service</Text>
// //         </TouchableOpacity>
// //       </ScrollView>
// //     </KeyboardAvoidingView>
// //   );
// // }

// // // ---------- styles ----------
// // const styles = StyleSheet.create({
// //   wrap: {
// //     padding: 12,
// //     paddingBottom: 24,
// //   },

// //   header: {
// //     flexDirection: 'row',
// //     alignItems: 'center',
// //   },
// //   backBtn: {
// //     padding: 6,
// //     borderRadius: 8,
// //     backgroundColor: '#F1F5F9',
// //     marginRight: 8,
// //   },
// //   h1: { fontSize: 18, fontWeight: '800', color: '#0f172a' },

// //   card: {
// //     backgroundColor: '#fff',
// //     borderRadius: 16,
// //     borderWidth: 1,
// //     borderColor: '#E2E8F0',
// //     padding: 12,
// //     marginTop: 12,
// //     ...Platform.select({
// //       web: { boxShadow: '0 6px 16px rgba(0,0,0,0.06)' },
// //       default: { elevation: 1 },
// //     }),
// //   },
// //   cardTitle: { fontWeight: '800', color: '#0f172a', marginBottom: 8 },

// //   label: { fontWeight: '700', color: '#0f172a', marginBottom: 6, fontSize: 12 },
// //   input: {
// //     backgroundColor: '#F8FAFC',
// //     borderWidth: 1,
// //     borderColor: '#E2E8F0',
// //     borderRadius: 10,
// //     padding: 10,
// //   },
// //   multilineFixed: {
// //     height: 120, // fixed height to avoid layout jump
// //     textAlignVertical: 'top',
// //   },
// //   inputError: { borderColor: '#EF4444', backgroundColor: '#FEF2F2' },
// //   errorText: { color: '#B91C1C', marginTop: 4, fontSize: 12, fontWeight: '700' },

// //   rowWrap: {
// //     flexDirection: 'row',
// //     flexWrap: 'wrap',
// //     marginHorizontal: -4,
// //     marginTop: 4,
// //   },

// //   chip: {
// //     paddingVertical: 6,
// //     paddingHorizontal: 12,
// //     borderRadius: 999,
// //     backgroundColor: '#F1F5F9',
// //     borderWidth: 1,
// //     borderColor: '#E5E7EB',
// //     marginHorizontal: 4,
// //     marginVertical: 4,
// //   },
// //   chipSelected: { backgroundColor: '#E0F2FE', borderColor: '#7DD3FC' },
// //   chipText: { color: '#0f172a', fontWeight: '700', fontSize: 12 },
// //   chipTextSelected: { color: '#075985' },

// //   primary: {
// //     backgroundColor: '#0ea5e9',
// //     padding: 14,
// //     borderRadius: 12,
// //     marginTop: 12,
// //     alignItems: 'center',
// //   },
// //   primaryText: { color: '#fff', fontWeight: '800' },

// //   pickerBtn: {
// //     flexDirection: 'row',
// //     alignItems: 'center',
// //     backgroundColor: '#F1F5F9',
// //     borderWidth: 1,
// //     borderColor: '#E5E7EB',
// //     borderRadius: 999,
// //     paddingVertical: 8,
// //     paddingHorizontal: 12,
// //   },
// //   pickerBtnText: { fontWeight: '800', color: '#0f172a', marginLeft: 8 },

// //   dateChip: {
// //     flexDirection: 'row',
// //     alignItems: 'center',
// //     backgroundColor: '#EEF2FF',
// //     borderWidth: 1,
// //     borderColor: '#C7D2FE',
// //     borderRadius: 999,
// //     paddingVertical: 4,
// //     paddingHorizontal: 10,
// //     marginHorizontal: 4,
// //     marginVertical: 4,
// //   },
// //   dateChipText: { fontSize: 12, fontWeight: '700', color: '#3730A3', marginRight: 6 },
// // });


// // above is working for the create the services but i have updated this for the edit also  

// // // screens/CulturalExchange/AddCulturalServiceForm.js
// // import React, { useMemo, useState, useEffect } from 'react';
// // import {
// //   View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView, Alert, Platform, KeyboardAvoidingView,
// // } from 'react-native';
// // import { Ionicons } from '@expo/vector-icons';
// // import DateTimePicker from '@react-native-community/datetimepicker';
// // import { useRoute, useNavigation } from '@react-navigation/native';

// // /* ========= Backend Config ========= */
// // import AsyncStorage from '@react-native-async-storage/async-storage';
// // import getBaseURL from '../../config/env';

// // const API_BASE = getBaseURL().replace(/\/+$/, '');

// // const TOKEN_KEYS = ['token','auth_token','jwt','access_token','AUTH_TOKEN','userToken'];
// // const getAuthToken = async () => {
// //   for (const k of TOKEN_KEYS) {
// //     const v = await AsyncStorage.getItem(k);
// //     if (v) return v;
// //   }
// //   return null;
// // };
// // const showMsg = (title, msg) => {
// //   if (Platform.OS === 'web') alert(`${title ? title + ': ' : ''}${msg}`);
// //   else Alert.alert(title || 'Notice', msg);
// // };
// // /* ================================== */

// // const EXPERIENCE_TYPES = [
// //   { label: 'Workshop / Class', value: 'workshop' },
// //   { label: 'Neighborhood / Culture Walk', value: 'walk' },
// //   { label: 'Home / Community Experience', value: 'home_experience' },
// //   { label: 'Skill / Service Exchange', value: 'skill_exchange' },
// // ];

// // const SCHEDULE_TYPES = [
// //   { label: 'Fixed Dates', value: 'fixed_dates' },
// //   { label: 'Repeat Weekly', value: 'repeat_weekly' },
// //   { label: 'On Request', value: 'on_request' },
// // ];

// // const PRICING_MODELS = [
// //   { label: 'Per Person', value: 'per_person' },
// //   { label: 'Per Group', value: 'per_group' },
// //   { label: 'Free', value: 'free' },
// //   { label: 'Exchange', value: 'exchange' },
// // ];

// // const WEEK_DAYS = ['Mon','Tue','Wed','Thu','Fri','Sat','Sun'];
// // const CANCELLATION = [
// //   { label: 'Flexible', value: 'flexible' },
// //   { label: 'Moderate', value: 'moderate' },
// //   { label: 'Strict', value: 'strict' },
// // ];

// // const CATEGORIES_BY_TYPE = {
// //   workshop: ['Cooking', 'Craft', 'Music & Dance', 'Language'],
// //   walk: ['Street Food', 'Heritage Walk', 'Bazaar Walk', 'Architecture'],
// //   home_experience: ['Home Meal', 'Tea Ceremony', 'Festival Visit', 'Village/Farm'],
// //   skill_exchange: ['Photography ↔ Experience', 'Video Editing ↔ Experience', 'English Conversation ↔ Experience'],
// // };

// // /* ---------- Field (uncontrolled while typing) ---------- */
// // const Field = React.memo(function Field({
// //   label, name, value, onCommit, error, multiline, placeholder, keyboardType, ...props
// // }) {
// //   const [inner, setInner] = useState(value ?? '');

// //   // keep in sync if parent updates (e.g., prefill/reset)
// //   useEffect(() => { setInner(value ?? ''); }, [value]);

// //   const commit = () => { onCommit?.(name, inner); };

// //   return (
// //     <View style={{ marginBottom: 12 }}>
// //       <Text style={styles.label}>{label}</Text>
// //       <TextInput
// //         value={inner}
// //         onChangeText={setInner}
// //         onBlur={commit}
// //         onSubmitEditing={commit}
// //         blurOnSubmit
// //         placeholder={placeholder || label}
// //         keyboardType={keyboardType}
// //         style={[
// //           styles.input,
// //           multiline && styles.multilineFixed,
// //           error && styles.inputError,
// //         ]}
// //         multiline={!!multiline}
// //         {...props}
// //       />
// //       {!!error && <Text style={styles.errorText}>{error}</Text>}
// //     </View>
// //   );
// // });

// // /* ---------- Chips ---------- */
// // const Chip = ({ text, selected, onPress }) => (
// //   <TouchableOpacity
// //     onPress={onPress}
// //     style={[styles.chip, selected && styles.chipSelected]}
// //     activeOpacity={0.85}
// //   >
// //     <Text style={[styles.chipText, selected && styles.chipTextSelected]}>{text}</Text>
// //   </TouchableOpacity>
// // );

// // const ChipGroup = ({ label, value, onChange, options, allowFreeText = false }) => {
// //   const [free, setFree] = useState(value ?? '');
// //   useEffect(() => { setFree(value ?? ''); }, [value]);

// //   const opts = options.map(o => (typeof o === 'object' ? o : ({ label: String(o), value: String(o) })));
// //   return (
// //     <View style={{ marginBottom: 12 }}>
// //       <Text style={styles.label}>{label}</Text>
// //       <View style={styles.rowWrap}>
// //         {opts.map(opt => (
// //           <Chip
// //             key={opt.value}
// //             text={opt.label}
// //             selected={value === opt.value || value === opt.label}
// //             onPress={() => onChange(opt.value)}
// //           />
// //         ))}
// //       </View>
// //       {allowFreeText && (
// //         <TextInput
// //           value={free}
// //           onChangeText={setFree}
// //           onBlur={() => onChange(free)}
// //           placeholder="Or type a custom value"
// //           style={[styles.input, { marginTop: 8 }]}
// //         />
// //       )}
// //     </View>
// //   );
// // };

// // export default function AddCulturalServiceForm({ onDone, onBack }) {
// //   const route = useRoute();
// //   const navigation = useNavigation();
// //   const editId = route.params?.editId ?? null;

// //   const [form, setForm] = useState({
// //     title: '',
// //     experience_type: 'workshop',
// //     category: '',
// //     tags: '',
// //     description: '',

// //     city: '',
// //     meeting_point_label: '',
// //     schedule_type: 'fixed_dates',

// //     fixed_dates: [],
// //     availableDatesText: '',

// //     days_of_week: [],
// //     start_time: '',
// //     duration_hours: '',
// //     lead_time_days: '',

// //     group_size_max: '',
// //     languages: '',

// //     pricing_model: 'per_person',
// //     price_per_person: '',
// //     price_per_group: '',
// //     group_included_size: '',

// //     host_offers: '',
// //     traveler_can_offer: '',
// //     exchange_value_hint: '',

// //     includes: '',
// //     excludes: '',
// //     material_requirements: '',
// //     accessibility_notes: '',
// //     age_restriction: '',
// //     cancellation_policy: 'moderate',
// //   });

// //   const [errors, setErrors] = useState({});
// //   const [showDatePicker, setShowDatePicker] = useState(false);
// //   const [showTimePicker, setShowTimePicker] = useState(false);
// //   const [loading, setLoading] = useState(!!editId);

// //   const set = (k, v) => setForm(s => ({ ...s, [k]: v }));
// //   const onCommit = (k, v) => setForm(s => ({ ...s, [k]: v }));

// //   const catOptions = useMemo(() => CATEGORIES_BY_TYPE[form.experience_type] || [], [form.experience_type]);

// //   const toggleDay = (d) => {
// //     set('days_of_week',
// //       form.days_of_week.includes(d)
// //         ? form.days_of_week.filter(x => x !== d)
// //         : [...form.days_of_week, d]
// //     );
// //   };

// //   // ---------- helpers ----------
// //   const toYMD = (dateObj) => {
// //     const y = dateObj.getFullYear();
// //     const m = String(dateObj.getMonth() + 1).padStart(2, '0');
// //     const d = String(dateObj.getDate()).padStart(2, '0');
// //     return `${y}-${m}-${d}`;
// //   };
// //   const csvToArray = (s) =>
// //     String(s || '')
// //       .split(',')
// //       .map(x => x.trim())
// //       .filter(Boolean);
// //   const arrayToCSV = (arr) => (Array.isArray(arr) ? arr.join(', ') : '');
// //   const isHHMM = (s) => /^([01]\d|2[0-3]):[0-5]\d$/.test(String(s || ''));
// //   const isDate = (s) => /^\d{4}-\d{2}-\d{2}$/.test(String(s || ''));
// //   const num = (v) => {
// //     const n = Number(v);
// //     return Number.isFinite(n) ? n : NaN;
// //   };

// //   // ---------- load for EDIT ----------
// //   useEffect(() => {
// //     if (!editId) return;
// //     let mounted = true;
// //     (async () => {
// //       try {
// //         const token = await getAuthToken();
// //         if (!token) { showMsg('Login required', 'Please sign in again.'); return; }
// //         const res = await fetch(`${API_BASE}/cultural/services/${editId}`, {
// //           headers: { Authorization: `Bearer ${token}` },
// //         });
// //         const json = await res.json();
// //         if (!res.ok) throw new Error(json?.error || `Failed: ${res.status}`);

// //         if (!mounted) return;

// //         // Map API -> form state
// //         const f = {
// //           title: json.title || '',
// //           experience_type: json.experience_type || 'workshop',
// //           category: json.category || '',
// //           tags: arrayToCSV(json.tags || []),
// //           description: json.description || '',

// //           city: json.city || '',
// //           meeting_point_label: json.meeting_point_label || '',
// //           schedule_type: json.schedule_type || 'fixed_dates',

// //           fixed_dates: json.fixed_dates || [],
// //           availableDatesText: (json.fixed_dates || []).join(', '),

// //           days_of_week: json.days_of_week || [],
// //           start_time: json.start_time || '',
// //           duration_hours: json.duration_hours ? String(json.duration_hours) : '',
// //           lead_time_days: json.lead_time_days != null ? String(json.lead_time_days) : '',

// //           group_size_max: json.group_size_max != null ? String(json.group_size_max) : '',
// //           languages: arrayToCSV(json.languages || []),

// //           pricing_model: json.pricing_model || 'per_person',
// //           price_per_person: json.price_per_person != null ? String(json.price_per_person) : '',
// //           price_per_group: json.price_per_group != null ? String(json.price_per_group) : '',
// //           group_included_size: json.group_included_size != null ? String(json.group_included_size) : '',

// //           host_offers: json.host_offers || '',
// //           traveler_can_offer: arrayToCSV(json.traveler_can_offer || []),
// //           exchange_value_hint: json.exchange_value_hint || '',

// //           includes: arrayToCSV(json.includes || []),
// //           excludes: arrayToCSV(json.excludes || []),
// //           material_requirements: arrayToCSV(json.material_requirements || []),
// //           accessibility_notes: json.accessibility_notes || '',
// //           age_restriction: json.age_restriction || '',
// //           cancellation_policy: json.cancellation_policy || 'moderate',
// //         };
// //         setForm(f);
// //       } catch (e) {
// //         showMsg('Error', e.message || 'Failed to load service');
// //       } finally {
// //         if (mounted) setLoading(false);
// //       }
// //     })();
// //     return () => { mounted = false; };
// //   }, [editId]);

// //   // ---------- pickers ----------
// //   const openDatePicker = () => setShowDatePicker(true);
// //   const onPickDate = (e, date) => {
// //     setShowDatePicker(false);
// //     if (!date) return;
// //     const ymd = toYMD(date);
// //     if (!form.fixed_dates.includes(ymd)) {
// //       const next = [...form.fixed_dates, ymd].sort();
// //       set('fixed_dates', next);
// //       set('availableDatesText', next.join(', '));
// //     }
// //   };
// //   const removeFixedDate = (d) => {
// //     const next = form.fixed_dates.filter(x => x !== d);
// //     set('fixed_dates', next);
// //     set('availableDatesText', next.join(', '));
// //   };

// //   const openTimePicker = () => setShowTimePicker(true);
// //   const onPickTime = (e, date) => {
// //     setShowTimePicker(false);
// //     if (!date) return;
// //     const hh = String(date.getHours()).padStart(2, '0');
// //     const mm = String(date.getMinutes()).padStart(2, '0');
// //     set('start_time', `${hh}:${mm}`);
// //   };

// //   // ---------- validation ----------
// //   const validate = () => {
// //     const e = {};

// //     if (!form.title.trim()) e.title = 'Title is required';
// //     if (!form.city.trim()) e.city = 'City is required';

// //     if (form.schedule_type === 'fixed_dates') {
// //       const dates = Platform.OS === 'web'
// //         ? csvToArray(form.availableDatesText)
// //         : form.fixed_dates;

// //       if (dates.length === 0) e.fixed_dates = 'Select at least one date';
// //       if (dates.some(d => !isDate(d))) {
// //         if (Platform.OS === 'web') e.availableDatesText = 'Dates must be YYYY-MM-DD';
// //         else e.fixed_dates = 'Dates must be valid YYYY-MM-DD';
// //       }
// //     }

// //     if (form.schedule_type === 'repeat_weekly') {
// //       if (form.days_of_week.length === 0) e.days_of_week = 'Pick at least one day';
// //       if (!isHHMM(form.start_time)) e.start_time = 'Use 24h time, e.g., 14:00';
// //       if (!(num(form.duration_hours) > 0)) e.duration_hours = 'Enter duration in hours';
// //     }

// //     if (form.schedule_type === 'on_request') {
// //       if (!(num(form.lead_time_days) >= 0)) e.lead_time_days = 'Enter lead time in days';
// //       if (!(num(form.duration_hours) > 0)) e.duration_hours = 'Enter typical duration in hours';
// //     }

// //     if (form.group_size_max && !(num(form.group_size_max) > 0)) {
// //       e.group_size_max = 'Must be a number > 0';
// //     }

// //     if (form.pricing_model === 'per_person') {
// //       if (!(num(form.price_per_person) > 0)) e.price_per_person = 'Price per person required';
// //     }
// //     if (form.pricing_model === 'per_group') {
// //       if (!(num(form.price_per_group) > 0)) e.price_per_group = 'Price per group required';
// //       if (!(num(form.group_included_size) > 0)) e.group_included_size = 'Included group size required';
// //     }
// //     if (form.pricing_model === 'exchange') {
// //       if (!form.host_offers.trim()) e.host_offers = 'Describe what you offer';
// //       if (csvToArray(form.traveler_can_offer).length === 0) e.traveler_can_offer = 'List at least one traveler skill';
// //     }

// //     setErrors(e);
// //     return Object.keys(e).length === 0;
// //   };

// //   // ---------- submit (POST create | PUT edit) ----------
// //   const submit = async () => {
// //     if (!validate()) {
// //       Alert.alert('Please fix the highlighted fields');
// //       return;
// //     }

// //     const payload = {
// //       title: form.title.trim(),
// //       experience_type: form.experience_type,
// //       category: form.category.trim(),
// //       tags: csvToArray(form.tags),
// //       description: form.description.trim(),

// //       city: form.city.trim(),
// //       meeting_point_label: form.meeting_point_label.trim(),
// //       schedule: {
// //         type: form.schedule_type,
// //         fixed_dates:
// //           form.schedule_type === 'fixed_dates'
// //             ? (Platform.OS === 'web'
// //                 ? csvToArray(form.availableDatesText)
// //                 : form.fixed_dates)
// //             : [],
// //         weekly: form.schedule_type === 'repeat_weekly' ? {
// //           days_of_week: form.days_of_week,
// //           start_time: form.start_time,
// //           duration_hours: Number(form.duration_hours),
// //         } : null,
// //         on_request: form.schedule_type === 'on_request' ? {
// //           lead_time_days: Number(form.lead_time_days),
// //           duration_hours: Number(form.duration_hours),
// //         } : null,
// //       },

// //       group_size_max: form.group_size_max ? Number(form.group_size_max) : 0,
// //       languages: csvToArray(form.languages),

// //       pricing: {
// //         model: form.pricing_model,
// //         per_person: form.pricing_model === 'per_person' ? { price_per_person: Number(form.price_per_person) } : null,
// //         per_group: form.pricing_model === 'per_group' ? {
// //           price_per_group: Number(form.price_per_group),
// //           group_included_size: Number(form.group_included_size),
// //         } : null,
// //         free: form.pricing_model === 'free' ? { reason: '' } : null,
// //         exchange: form.pricing_model === 'exchange' ? {
// //           host_offers: form.host_offers.trim(),
// //           traveler_can_offer: csvToArray(form.traveler_can_offer),
// //           exchange_value_hint: form.exchange_value_hint.trim(),
// //         } : null,
// //       },

// //       includes: csvToArray(form.includes),
// //       excludes: csvToArray(form.excludes),
// //       material_requirements: csvToArray(form.material_requirements),
// //       accessibility_notes: form.accessibility_notes.trim(),
// //       age_restriction: form.age_restriction.trim() ? form.age_restriction.trim() : null,
// //       cancellation_policy: form.cancellation_policy,
// //     };

// //     try {
// //       const token = await getAuthToken();
// //       if (!token) { showMsg('Not logged in', 'Please log in again.'); return; }

// //       const controller = new AbortController();
// //       const timeout = setTimeout(() => controller.abort(), 20000);

// //       const method = editId ? 'PUT' : 'POST';
// //       const url = editId
// //         ? `${API_BASE}/cultural/services/${editId}`
// //         : `${API_BASE}/cultural/services`;

// //       const res = await fetch(url, {
// //         method,
// //         headers: {
// //           'Content-Type': 'application/json',
// //           Authorization: `Bearer ${token}`,
// //         },
// //         body: JSON.stringify(payload),
// //         signal: controller.signal,
// //       });

// //       clearTimeout(timeout);

// //       const text = await res.text();
// //       let json = null;
// //       try { json = text ? JSON.parse(text) : null; } catch {}

// //       if (res.status === 401) { showMsg('Session expired', 'Please log in again.'); return; }
// //       if (res.status === 428) { showMsg('Complete Profile', json?.error || 'Please complete your profile to continue.'); return; }

// //       if (!res.ok) {
// //         const friendly = {
// //           400: 'Invalid data. Please review the fields.',
// //           403: "You don't have permission to do that.",
// //           404: 'Not found.',
// //           500: 'Server error. Please try again.',
// //           502: 'Bad gateway.',
// //           503: 'Server unavailable.',
// //           504: 'Server timed out.',
// //         };
// //         showMsg('Error', json?.error || friendly[res.status] || `Failed (HTTP ${res.status})`);
// //         return;
// //       }

// //       showMsg('Success', editId ? 'Service updated successfully.' : 'Service created successfully.');
// //       onDone?.();
// //       if (editId) navigation.goBack();
// //     } catch (err) {
// //       const aborted = err?.name === 'AbortError';
// //       showMsg('Network Error', aborted ? 'Request timed out.' : 'Unable to reach the server.');
// //     }
// //   };

// //   // ---------- render ----------
// //   return (
// //     <KeyboardAvoidingView
// //       style={{ flex: 1 }}
// //       behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
// //       keyboardVerticalOffset={Platform.select({ ios: 64, android: 0, default: 0 })}
// //     >
// //       <ScrollView
// //         contentContainerStyle={styles.wrap}
// //         keyboardShouldPersistTaps="handled"
// //         keyboardDismissMode={Platform.OS === 'ios' ? 'interactive' : 'on-drag'}
// //         removeClippedSubviews={false}
// //         {...(Platform.OS === 'ios' ? { contentInsetAdjustmentBehavior: 'automatic' } : {})}
// //       >
// //         <View style={styles.header}>
// //           <TouchableOpacity onPress={onBack} style={styles.backBtn}>
// //             <Ionicons name="arrow-back" size={18} />
// //           </TouchableOpacity>
// //           <Text style={styles.h1}>{editId ? 'Edit Cultural Service' : 'Add Cultural Service'}</Text>
// //         </View>

// //         {/* Loading mask for edit prefill */}
// //         {loading ? (
// //           <View style={[styles.card, { alignItems: 'center' }]}>
// //             <Text>Loading…</Text>
// //           </View>
// //         ) : (
// //           <>
// //             {/* BASICS */}
// //             <View style={styles.card}>
// //               <Field label="Title" name="title" value={form.title} onCommit={onCommit} error={errors.title} />
// //               <ChipGroup
// //                 label="Experience Type"
// //                 value={form.experience_type}
// //                 onChange={v => set('experience_type', v)}
// //                 options={EXPERIENCE_TYPES}
// //               />
// //               <ChipGroup
// //                 label="Category"
// //                 value={form.category}
// //                 onChange={v => set('category', v)}
// //                 options={(catOptions.length ? catOptions : ['General']).map(c => ({ label: c, value: c }))}
// //                 allowFreeText
// //               />
// //               <Field label="Tags (comma separated)" name="tags" value={form.tags} onCommit={onCommit} placeholder="hands-on, budget-friendly" />
// //               <Field label="Description" name="description" value={form.description} onCommit={onCommit} multiline />
// //             </View>

// //             {/* WHERE & WHEN */}
// //             <View style={styles.card}>
// //               <Text style={styles.cardTitle}>Where & When</Text>
// //               <Field label="City" name="city" value={form.city} onCommit={onCommit} error={errors.city} />
// //               <Field label="Meeting Point" name="meeting_point_label" value={form.meeting_point_label} onCommit={onCommit} placeholder="Café ABC, Main Bazaar" />

// //               <ChipGroup
// //                 label="Schedule Type"
// //                 value={form.schedule_type}
// //                 onChange={v => set('schedule_type', v)}
// //                 options={SCHEDULE_TYPES}
// //               />

// //               {/* Fixed dates */}
// //               {form.schedule_type === 'fixed_dates' && (
// //                 <>
// //                   {Platform.OS !== 'web' ? (
// //                     <>
// //                       <Text style={styles.label}>Add date(s)</Text>
// //                       <View style={[styles.rowWrap, { marginBottom: 4 }]}>
// //                         <TouchableOpacity style={styles.pickerBtn} onPress={openDatePicker}>
// //                           <Ionicons name="calendar-outline" size={16} color="#0f172a" />
// //                           <Text style={styles.pickerBtnText}>Pick a date</Text>
// //                         </TouchableOpacity>
// //                         {!!errors.fixed_dates && <Text style={styles.errorText}>{errors.fixed_dates}</Text>}
// //                       </View>

// //                       <View style={styles.rowWrap}>
// //                         {form.fixed_dates.map(d => (
// //                           <View key={d} style={styles.dateChip}>
// //                             <Text style={styles.dateChipText}>{d}</Text>
// //                             <TouchableOpacity onPress={() => removeFixedDate(d)} hitSlop={8}>
// //                               <Ionicons name="close-circle" size={16} color="#991B1B" />
// //                             </TouchableOpacity>
// //                           </View>
// //                         ))}
// //                       </View>

// //                       {showDatePicker && (
// //                         <DateTimePicker
// //                           mode="date"
// //                           value={new Date()}
// //                           onChange={onPickDate}
// //                           display={Platform.OS === 'ios' ? 'inline' : 'default'}
// //                         />
// //                       )}
// //                     </>
// //                   ) : (
// //                     <Field
// //                       label="Available dates (YYYY-MM-DD, comma separated)"
// //                       name="availableDatesText"
// //                       value={form.availableDatesText}
// //                       onCommit={(k, v) => {
// //                         onCommit(k, v);
// //                         set('fixed_dates', csvToArray(v));
// //                       }}
// //                       placeholder="2025-10-08, 2025-10-12"
// //                       error={errors.availableDatesText}
// //                     />
// //                   )}
// //                 </>
// //               )}

// //               {/* Weekly repeat */}
// //               {form.schedule_type === 'repeat_weekly' && (
// //                 <>
// //                   <Text style={styles.label}>Days of Week</Text>
// //                   <View style={styles.rowWrap}>
// //                     {WEEK_DAYS.map(d => (
// //                       <TouchableOpacity
// //                         key={d}
// //                         onPress={() => toggleDay(d)}
// //                         style={[styles.chip, form.days_of_week.includes(d) && styles.chipSelected]}
// //                       >
// //                         <Text style={[styles.chipText, form.days_of_week.includes(d) && styles.chipTextSelected]}>{d}</Text>
// //                       </TouchableOpacity>
// //                     ))}
// //                   </View>
// //                   {!!errors.days_of_week && <Text style={styles.errorText}>{errors.days_of_week}</Text>}

// //                   {Platform.OS !== 'web' ? (
// //                     <View style={{ marginTop: 12 }}>
// //                       <Text style={styles.label}>Start Time</Text>
// //                       <TouchableOpacity style={styles.pickerBtn} onPress={openTimePicker}>
// //                         <Ionicons name="time-outline" size={16} color="#0f172a" />
// //                         <Text style={styles.pickerBtnText}>
// //                           {form.start_time ? form.start_time : 'Pick time'}
// //                         </Text>
// //                       </TouchableOpacity>
// //                       {!!errors.start_time && <Text style={styles.errorText}>{errors.start_time}</Text>}
// //                       {showTimePicker && (
// //                         <DateTimePicker
// //                           mode="time"
// //                           value={new Date()}
// //                           onChange={onPickTime}
// //                           display={Platform.OS === 'ios' ? 'spinner' : 'default'}
// //                           is24Hour
// //                         />
// //                       )}
// //                     </View>
// //                   ) : (
// //                     <Field
// //                       label="Start Time (24h HH:MM)"
// //                       name="start_time"
// //                       value={form.start_time}
// //                       onCommit={onCommit}
// //                       placeholder="14:00"
// //                       error={errors.start_time}
// //                     />
// //                   )}

// //                   <Field
// //                     label="Duration (hours)"
// //                     name="duration_hours"
// //                     keyboardType="numeric"
// //                     value={form.duration_hours}
// //                     onCommit={onCommit}
// //                     error={errors.duration_hours}
// //                   />
// //                 </>
// //               )}

// //               {/* On request */}
// //               {form.schedule_type === 'on_request' && (
// //                 <>
// //                   <Field
// //                     label="Lead time (days)"
// //                     name="lead_time_days"
// //                     keyboardType="numeric"
// //                     value={form.lead_time_days}
// //                     onCommit={onCommit}
// //                     error={errors.lead_time_days}
// //                   />
// //                   <Field
// //                     label="Typical duration (hours)"
// //                     name="duration_hours"
// //                     keyboardType="numeric"
// //                     value={form.duration_hours}
// //                     onCommit={onCommit}
// //                     error={errors.duration_hours}
// //                   />
// //                 </>
// //               )}
// //             </View>

// //             {/* CAPACITY & LANGUAGES */}
// //             <View style={styles.card}>
// //               <Text style={styles.cardTitle}>Capacity & Languages</Text>
// //               <Field label="Max Group Size" name="group_size_max" keyboardType="numeric" value={form.group_size_max} onCommit={onCommit} error={errors.group_size_max} />
// //               <Field label="Languages (comma separated)" name="languages" value={form.languages} onCommit={onCommit} placeholder="English, Urdu" />
// //             </View>

// //             {/* PRICING */}
// //             <View style={styles.card}>
// //               <Text style={styles.cardTitle}>Pricing / Exchange</Text>
// //               <ChipGroup
// //                 label="Pricing Model"
// //                 value={form.pricing_model}
// //                 onChange={v => set('pricing_model', v)}
// //                 options={PRICING_MODELS}
// //               />

// //               {form.pricing_model === 'per_person' && (
// //                 <Field label="Price per person" name="price_per_person" keyboardType="numeric" value={form.price_per_person} onCommit={onCommit} error={errors.price_per_person} />
// //               )}

// //               {form.pricing_model === 'per_group' && (
// //                 <>
// //                   <Field label="Price per group" name="price_per_group" keyboardType="numeric" value={form.price_per_group} onCommit={onCommit} error={errors.price_per_group} />
// //                   <Field label="Group size included in price" name="group_included_size" keyboardType="numeric" value={form.group_included_size} onCommit={onCommit} error={errors.group_included_size} />
// //                 </>
// //               )}

// //               {form.pricing_model === 'exchange' && (
// //                 <>
// //                   <Field label="Host offers (what you give)" name="host_offers" value={form.host_offers} onCommit={onCommit} error={errors.host_offers} placeholder="2-hour cooking class" />
// //                   <Field label="Traveler can offer (comma separated)" name="traveler_can_offer" value={form.traveler_can_offer} onCommit={onCommit} error={errors.traveler_can_offer} placeholder="photography, social media, translation" />
// //                   <Field label="Exchange value hint (optional)" name="exchange_value_hint" value={form.exchange_value_hint} onCommit={onCommit} placeholder="Equivalent to ~Rs 4000 value" />
// //                 </>
// //               )}
// //             </View>

// //             {/* WHAT'S INCLUDED */}
// //             <View style={styles.card}>
// //               <Text style={styles.cardTitle}>What’s included / not</Text>
// //               <Field label="What’s included (comma separated)" name="includes" value={form.includes} onCommit={onCommit} placeholder="materials, snacks" />
// //               <Field label="What’s not included (comma separated)" name="excludes" value={form.excludes} onCommit={onCommit} placeholder="transport, tickets" />
// //               <Field label="Material / attire requirements (comma separated)" name="material_requirements" value={form.material_requirements} onCommit={onCommit} placeholder="comfortable shoes, head covering" />
// //             </View>

// //             {/* POLICIES */}
// //             <View style={styles.card}>
// //               <Text style={styles.cardTitle}>Policies & Safety</Text>
// //               <Field label="Age restriction (optional)" name="age_restriction" value={form.age_restriction} onCommit={onCommit} placeholder="12+" />
// //               <Field label="Accessibility notes" name="accessibility_notes" value={form.accessibility_notes} onCommit={onCommit} placeholder="Stairs at venue, no elevator" />
// //               <ChipGroup
// //                 label="Cancellation Policy"
// //                 value={form.cancellation_policy}
// //                 onChange={v => set('cancellation_policy', v)}
// //                 options={CANCELLATION}
// //               />
// //             </View>

// //             <TouchableOpacity style={styles.primary} onPress={submit}>
// //               <Text style={styles.primaryText}>{editId ? 'Save Changes' : 'Create Service'}</Text>
// //             </TouchableOpacity>
// //           </>
// //         )}
// //       </ScrollView>
// //     </KeyboardAvoidingView>
// //   );
// // }

// // // ---------- styles ----------
// // const styles = StyleSheet.create({
// //   wrap: {
// //     padding: 12,
// //     paddingBottom: 24,
// //   },

// //   header: {
// //     flexDirection: 'row',
// //     alignItems: 'center',
// //   },
// //   backBtn: {
// //     padding: 6,
// //     borderRadius: 8,
// //     backgroundColor: '#F1F5F9',
// //     marginRight: 8,
// //   },
// //   h1: { fontSize: 18, fontWeight: '800', color: '#0f172a' },

// //   card: {
// //     backgroundColor: '#fff',
// //     borderRadius: 16,
// //     borderWidth: 1,
// //     borderColor: '#E2E8F0',
// //     padding: 12,
// //     marginTop: 12,
// //     ...Platform.select({
// //       web: { boxShadow: '0 6px 16px rgba(0,0,0,0.06)' },
// //       default: { elevation: 1 },
// //     }),
// //   },
// //   cardTitle: { fontWeight: '800', color: '#0f172a', marginBottom: 8 },

// //   label: { fontWeight: '700', color: '#0f172a', marginBottom: 6, fontSize: 12 },
// //   input: {
// //     backgroundColor: '#F8FAFC',
// //     borderWidth: 1,
// //     borderColor: '#E2E8F0',
// //     borderRadius: 10,
// //     padding: 10,
// //   },
// //   multilineFixed: {
// //     height: 120,
// //     textAlignVertical: 'top',
// //   },
// //   inputError: { borderColor: '#EF4444', backgroundColor: '#FEF2F2' },
// //   errorText: { color: '#B91C1C', marginTop: 4, fontSize: 12, fontWeight: '700' },

// //   rowWrap: {
// //     flexDirection: 'row',
// //     flexWrap: 'wrap',
// //     marginHorizontal: -4,
// //     marginTop: 4,
// //   },

// //   chip: {
// //     paddingVertical: 6,
// //     paddingHorizontal: 12,
// //     borderRadius: 999,
// //     backgroundColor: '#F1F5F9',
// //     borderWidth: 1,
// //     borderColor: '#E5E7EB',
// //     marginHorizontal: 4,
// //     marginVertical: 4,
// //   },
// //   chipSelected: { backgroundColor: '#E0F2FE', borderColor: '#7DD3FC' },
// //   chipText: { color: '#0f172a', fontWeight: '700', fontSize: 12 },
// //   chipTextSelected: { color: '#075985' },

// //   primary: {
// //     backgroundColor: '#0ea5e9',
// //     padding: 14,
// //     borderRadius: 12,
// //     marginTop: 12,
// //     alignItems: 'center',
// //   },
// //   primaryText: { color: '#fff', fontWeight: '800' },

// //   pickerBtn: {
// //     flexDirection: 'row',
// //     alignItems: 'center',
// //     backgroundColor: '#F1F5F9',
// //     borderWidth: 1,
// //     borderColor: '#E5E7EB',
// //     borderRadius: 999,
// //     paddingVertical: 8,
// //     paddingHorizontal: 12,
// //   },
// //   pickerBtnText: { fontWeight: '800', color: '#0f172a', marginLeft: 8 },

// //   dateChip: {
// //     flexDirection: 'row',
// //     alignItems: 'center',
// //     backgroundColor: '#EEF2FF',
// //     borderWidth: 1,
// //     borderColor: '#C7D2FE',
// //     borderRadius: 999,
// //     paddingVertical: 4,
// //     paddingHorizontal: 10,
// //     marginHorizontal: 4,
// //     marginVertical: 4,
// //   },
// //   dateChipText: { fontSize: 12, fontWeight: '700', color: '#3730A3', marginRight: 6 },
// // });

// //  this is working for both web and mobile and also for the edit 

// // screens/CulturalExchange/AddCulturalServiceForm.js

// import React, { useMemo, useState, useEffect } from 'react';
// import {
//   View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView, Alert, Platform, KeyboardAvoidingView,
// } from 'react-native';
// import { Ionicons } from '@expo/vector-icons';
// import DateTimePicker from '@react-native-community/datetimepicker';
// import { useRoute, useNavigation } from '@react-navigation/native';

// /* ========= Backend Config ========= */
// import AsyncStorage from '@react-native-async-storage/async-storage';
// import getBaseURL from '../../config/env';

// const API_BASE = getBaseURL().replace(/\/+$/, '');

// const TOKEN_KEYS = ['token','auth_token','jwt','access_token','AUTH_TOKEN','userToken'];
// const getAuthToken = async () => {
//   for (const k of TOKEN_KEYS) {
//     const v = await AsyncStorage.getItem(k);
//     if (v) return v;
//   }
//   return null;
// };
// const showMsg = (title, msg) => {
//   if (Platform.OS === 'web') alert(`${title ? title + ': ' : ''}${msg}`);
//   else Alert.alert(title || 'Notice', msg);
// };
// /* ================================== */

// const EXPERIENCE_TYPES = [
//   { label: 'Workshop / Class', value: 'workshop' },
//   { label: 'Neighborhood / Culture Walk', value: 'walk' },
//   { label: 'Home / Community Experience', value: 'home_experience' },
//   { label: 'Skill / Service Exchange', value: 'skill_exchange' },
// ];

// const SCHEDULE_TYPES = [
//   { label: 'Fixed Dates', value: 'fixed_dates' },
//   { label: 'Repeat Weekly', value: 'repeat_weekly' },
//   { label: 'On Request', value: 'on_request' },
// ];

// const PRICING_MODELS = [
//   { label: 'Per Person', value: 'per_person' },
//   { label: 'Per Group', value: 'per_group' },
//   { label: 'Free', value: 'free' },
//   { label: 'Exchange', value: 'exchange' },
// ];

// const WEEK_DAYS = ['Mon','Tue','Wed','Thu','Fri','Sat','Sun'];
// const CANCELLATION = [
//   { label: 'Flexible', value: 'flexible' },
//   { label: 'Moderate', value: 'moderate' },
//   { label: 'Strict', value: 'strict' },
// ];

// const CATEGORIES_BY_TYPE = {
//   workshop: ['Cooking', 'Craft', 'Music & Dance', 'Language'],
//   walk: ['Street Food', 'Heritage Walk', 'Bazaar Walk', 'Architecture'],
//   home_experience: ['Home Meal', 'Tea Ceremony', 'Festival Visit', 'Village/Farm'],
//   skill_exchange: ['Photography ↔ Experience', 'Video Editing ↔ Experience', 'English Conversation ↔ Experience'],
// };

// /* ---------- Field (uncontrolled while typing) ---------- */
// const Field = React.memo(function Field({
//   label, name, value, onCommit, error, multiline, placeholder, keyboardType, ...props
// }) {
//   const [inner, setInner] = useState(value ?? '');

//   // keep in sync if parent updates (e.g., prefill/reset)
//   useEffect(() => { setInner(value ?? ''); }, [value]);

//   const commit = () => { onCommit?.(name, inner); };

//   return (
//     <View style={{ marginBottom: 12 }}>
//       <Text style={styles.label}>{label}</Text>
//       <TextInput
//         value={inner}
//         onChangeText={setInner}
//         onBlur={commit}
//         onSubmitEditing={commit}
//         blurOnSubmit
//         placeholder={placeholder || label}
//         keyboardType={keyboardType}
//         style={[
//           styles.input,
//           multiline && styles.multilineFixed,
//           error && styles.inputError,
//         ]}
//         multiline={!!multiline}
//         {...props}
//       />
//       {!!error && <Text style={styles.errorText}>{error}</Text>}
//     </View>
//   );
// });

// /* ---------- Chips ---------- */
// const Chip = ({ text, selected, onPress }) => (
//   <TouchableOpacity
//     onPress={onPress}
//     style={[styles.chip, selected && styles.chipSelected]}
//     activeOpacity={0.85}
//   >
//     <Text style={[styles.chipText, selected && styles.chipTextSelected]}>{text}</Text>
//   </TouchableOpacity>
// );

// const ChipGroup = ({ label, value, onChange, options, allowFreeText = false }) => {
//   const [free, setFree] = useState(value ?? '');
//   useEffect(() => { setFree(value ?? ''); }, [value]);

//   const opts = options.map(o => (typeof o === 'object' ? o : ({ label: String(o), value: String(o) })));
//   return (
//     <View style={{ marginBottom: 12 }}>
//       <Text style={styles.label}>{label}</Text>
//       <View style={styles.rowWrap}>
//         {opts.map(opt => (
//           <Chip
//             key={opt.value}
//             text={opt.label}
//             selected={value === opt.value || value === opt.label}
//             onPress={() => onChange(opt.value)}
//           />
//         ))}
//       </View>
//       {allowFreeText && (
//         <TextInput
//           value={free}
//           onChangeText={setFree}
//           onBlur={() => onChange(free)}
//           placeholder="Or type a custom value"
//           style={[styles.input, { marginTop: 8 }]}
//         />
//       )}
//     </View>
//   );
// };

// export default function AddCulturalServiceForm({ onDone, onBack }) {
//   const route = useRoute();
//   const navigation = useNavigation();
//   const editId = route.params?.editId ?? null;

//   // ✅ Back handler: use onBack if given; otherwise goBack
//   const handleBack = () => {
//     if (typeof onBack === 'function') return onBack();
//     navigation.goBack();
//   };

//   const [form, setForm] = useState({
//     title: '',
//     experience_type: 'workshop',
//     category: '',
//     tags: '',
//     description: '',

//     city: '',
//     meeting_point_label: '',
//     schedule_type: 'fixed_dates',

//     fixed_dates: [],
//     availableDatesText: '',

//     days_of_week: [],
//     start_time: '',
//     duration_hours: '',
//     lead_time_days: '',

//     group_size_max: '',
//     languages: '',

//     pricing_model: 'per_person',
//     price_per_person: '',
//     price_per_group: '',
//     group_included_size: '',

//     host_offers: '',
//     traveler_can_offer: '',
//     exchange_value_hint: '',

//     includes: '',
//     excludes: '',
//     material_requirements: '',
//     accessibility_notes: '',
//     age_restriction: '',
//     cancellation_policy: 'moderate',
//   });

//   const [errors, setErrors] = useState({});
//   const [showDatePicker, setShowDatePicker] = useState(false);
//   const [showTimePicker, setShowTimePicker] = useState(false);
//   const [loading, setLoading] = useState(!!editId);

//   const set = (k, v) => setForm(s => ({ ...s, [k]: v }));
//   const onCommit = (k, v) => setForm(s => ({ ...s, [k]: v }));

//   const catOptions = useMemo(() => CATEGORIES_BY_TYPE[form.experience_type] || [], [form.experience_type]);

//   const toggleDay = (d) => {
//     set('days_of_week',
//       form.days_of_week.includes(d)
//         ? form.days_of_week.filter(x => x !== d)
//         : [...form.days_of_week, d]
//     );
//   };

//   // ---------- helpers ----------
//   const toYMD = (dateObj) => {
//     const y = dateObj.getFullYear();
//     const m = String(dateObj.getMonth() + 1).padStart(2, '0');
//     const d = String(dateObj.getDate()).padStart(2, '0');
//     return `${y}-${m}-${d}`;
//   };
//   const csvToArray = (s) =>
//     String(s || '')
//       .split(',')
//       .map(x => x.trim())
//       .filter(Boolean);
//   const arrayToCSV = (arr) => (Array.isArray(arr) ? arr.join(', ') : '');
//   const isHHMM = (s) => /^([01]\d|2[0-3]):[0-5]\d$/.test(String(s || ''));
//   const isDate = (s) => /^\d{4}-\d{2}-\d{2}$/.test(String(s || ''));
//   const num = (v) => {
//     const n = Number(v);
//     return Number.isFinite(n) ? n : NaN;
//   };

//   // ---------- load for EDIT ----------
//   useEffect(() => {
//     if (!editId) return;
//     let mounted = true;
//     (async () => {
//       try {
//         const token = await getAuthToken();
//         if (!token) { showMsg('Login required', 'Please sign in again.'); return; }
//         const res = await fetch(`${API_BASE}/cultural/services/${editId}`, {
//           headers: { Authorization: `Bearer ${token}` },
//         });
//         const json = await res.json();
//         if (!res.ok) throw new Error(json?.error || `Failed: ${res.status}`);

//         if (!mounted) return;

//         // Map API -> form state
//         const f = {
//           title: json.title || '',
//           experience_type: json.experience_type || 'workshop',
//           category: json.category || '',
//           tags: arrayToCSV(json.tags || []),
//           description: json.description || '',

//           city: json.city || '',
//           meeting_point_label: json.meeting_point_label || '',
//           schedule_type: json.schedule_type || 'fixed_dates',

//           fixed_dates: json.fixed_dates || [],
//           availableDatesText: (json.fixed_dates || []).join(', '),

//           days_of_week: json.days_of_week || [],
//           start_time: json.start_time || '',
//           duration_hours: json.duration_hours ? String(json.duration_hours) : '',
//           lead_time_days: json.lead_time_days != null ? String(json.lead_time_days) : '',

//           group_size_max: json.group_size_max != null ? String(json.group_size_max) : '',
//           languages: arrayToCSV(json.languages || []),

//           pricing_model: json.pricing_model || 'per_person',
//           price_per_person: json.price_per_person != null ? String(json.price_per_person) : '',
//           price_per_group: json.price_per_group != null ? String(json.price_per_group) : '',
//           group_included_size: json.group_included_size != null ? String(json.group_included_size) : '',

//           host_offers: json.host_offers || '',
//           traveler_can_offer: arrayToCSV(json.traveler_can_offer || []),
//           exchange_value_hint: json.exchange_value_hint || '',

//           includes: arrayToCSV(json.includes || []),
//           excludes: arrayToCSV(json.excludes || []),
//           material_requirements: arrayToCSV(json.material_requirements || []),
//           accessibility_notes: json.accessibility_notes || '',
//           age_restriction: json.age_restriction || '',
//           cancellation_policy: json.cancellation_policy || 'moderate',
//         };
//         setForm(f);
//       } catch (e) {
//         showMsg('Error', e.message || 'Failed to load service');
//       } finally {
//         if (mounted) setLoading(false);
//       }
//     })();
//     return () => { mounted = false; };
//   }, [editId]);

//   // ---------- pickers ----------
//   const openDatePicker = () => setShowDatePicker(true);
//   const onPickDate = (e, date) => {
//     setShowDatePicker(false);
//     if (!date) return;
//     const ymd = toYMD(date);
//     if (!form.fixed_dates.includes(ymd)) {
//       const next = [...form.fixed_dates, ymd].sort();
//       set('fixed_dates', next);
//       set('availableDatesText', next.join(', '));
//     }
//   };
//   const removeFixedDate = (d) => {
//     const next = form.fixed_dates.filter(x => x !== d);
//     set('fixed_dates', next);
//     set('availableDatesText', next.join(', '));
//   };

//   const openTimePicker = () => setShowTimePicker(true);
//   const onPickTime = (e, date) => {
//     setShowTimePicker(false);
//     if (!date) return;
//     const hh = String(date.getHours()).padStart(2, '0');
//     const mm = String(date.getMinutes()).padStart(2, '0');
//     set('start_time', `${hh}:${mm}`);
//   };

//   // ---------- validation ----------
//   const validate = () => {
//     const e = {};

//     if (!form.title.trim()) e.title = 'Title is required';
//     if (!form.city.trim()) e.city = 'City is required';

//     if (form.schedule_type === 'fixed_dates') {
//       const dates = Platform.OS === 'web'
//         ? csvToArray(form.availableDatesText)
//         : form.fixed_dates;

//       if (dates.length === 0) e.fixed_dates = 'Select at least one date';
//       if (dates.some(d => !isDate(d))) {
//         if (Platform.OS === 'web') e.availableDatesText = 'Dates must be YYYY-MM-DD';
//         else e.fixed_dates = 'Dates must be valid YYYY-MM-DD';
//       }
//     }

//     if (form.schedule_type === 'repeat_weekly') {
//       if (form.days_of_week.length === 0) e.days_of_week = 'Pick at least one day';
//       if (!isHHMM(form.start_time)) e.start_time = 'Use 24h time, e.g., 14:00';
//       if (!(num(form.duration_hours) > 0)) e.duration_hours = 'Enter duration in hours';
//     }

//     if (form.schedule_type === 'on_request') {
//       if (!(num(form.lead_time_days) >= 0)) e.lead_time_days = 'Enter lead time in days';
//       if (!(num(form.duration_hours) > 0)) e.duration_hours = 'Enter typical duration in hours';
//     }

//     if (form.group_size_max && !(num(form.group_size_max) > 0)) {
//       e.group_size_max = 'Must be a number > 0';
//     }

//     if (form.pricing_model === 'per_person') {
//       if (!(num(form.price_per_person) > 0)) e.price_per_person = 'Price per person required';
//     }
//     if (form.pricing_model === 'per_group') {
//       if (!(num(form.price_per_group) > 0)) e.price_per_group = 'Price per group required';
//       if (!(num(form.group_included_size) > 0)) e.group_included_size = 'Included group size required';
//     }
//     if (form.pricing_model === 'exchange') {
//       if (!form.host_offers.trim()) e.host_offers = 'Describe what you offer';
//       if (csvToArray(form.traveler_can_offer).length === 0) e.traveler_can_offer = 'List at least one traveler skill';
//     }

//     setErrors(e);
//     return Object.keys(e).length === 0;
//   };

//   // ---------- submit (POST create | PUT edit) ----------
//   const submit = async () => {
//     if (!validate()) {
//       Alert.alert('Please fix the highlighted fields');
//       return;
//     }

//     const payload = {
//       title: form.title.trim(),
//       experience_type: form.experience_type,
//       category: form.category.trim(),
//       tags: csvToArray(form.tags),
//       description: form.description.trim(),

//       city: form.city.trim(),
//       meeting_point_label: form.meeting_point_label.trim(),
//       schedule: {
//         type: form.schedule_type,
//         fixed_dates:
//           form.schedule_type === 'fixed_dates'
//             ? (Platform.OS === 'web'
//                 ? csvToArray(form.availableDatesText)
//                 : form.fixed_dates)
//             : [],
//         weekly: form.schedule_type === 'repeat_weekly' ? {
//           days_of_week: form.days_of_week,
//           start_time: form.start_time,
//           duration_hours: Number(form.duration_hours),
//         } : null,
//         on_request: form.schedule_type === 'on_request' ? {
//           lead_time_days: Number(form.lead_time_days),
//           duration_hours: Number(form.duration_hours),
//         } : null,
//       },

//       group_size_max: form.group_size_max ? Number(form.group_size_max) : 0,
//       languages: csvToArray(form.languages),

//       pricing: {
//         model: form.pricing_model,
//         per_person: form.pricing_model === 'per_person' ? { price_per_person: Number(form.price_per_person) } : null,
//         per_group: form.pricing_model === 'per_group' ? {
//           price_per_group: Number(form.price_per_group),
//           group_included_size: Number(form.group_included_size),
//         } : null,
//         free: form.pricing_model === 'free' ? { reason: '' } : null,
//         exchange: form.pricing_model === 'exchange' ? {
//           host_offers: form.host_offers.trim(),
//           traveler_can_offer: csvToArray(form.traveler_can_offer),
//           exchange_value_hint: form.exchange_value_hint.trim(),
//         } : null,
//       },

//       includes: csvToArray(form.includes),
//       excludes: csvToArray(form.excludes),
//       material_requirements: csvToArray(form.material_requirements),
//       accessibility_notes: form.accessibility_notes.trim(),
//       age_restriction: form.age_restriction.trim() ? form.age_restriction.trim() : null,
//       cancellation_policy: form.cancellation_policy,
//     };

//     try {
//       const token = await getAuthToken();
//       if (!token) { showMsg('Not logged in', 'Please log in again.'); return; }

//       const controller = new AbortController();
//       const timeout = setTimeout(() => controller.abort(), 20000);

//       const method = editId ? 'PUT' : 'POST';
//       const url = editId
//         ? `${API_BASE}/cultural/services/${editId}`
//         : `${API_BASE}/cultural/services`;

//       const res = await fetch(url, {
//         method,
//         headers: {
//           'Content-Type': 'application/json',
//           Authorization: `Bearer ${token}`,
//         },
//         body: JSON.stringify(payload),
//         signal: controller.signal,
//       });

//       clearTimeout(timeout);

//       const text = await res.text();
//       let json = null;
//       try { json = text ? JSON.parse(text) : null; } catch {}

//       if (res.status === 401) { showMsg('Session expired', 'Please log in again.'); return; }
//       if (res.status === 428) { showMsg('Complete Profile', json?.error || 'Please complete your profile to continue.'); return; }

//       if (!res.ok) {
//         const friendly = {
//           400: 'Invalid data. Please review the fields.',
//           403: "You don't have permission to do that.",
//           404: 'Not found.',
//           500: 'Server error. Please try again.',
//           502: 'Bad gateway.',
//           503: 'Server unavailable.',
//           504: 'Server timed out.',
//         };
//         showMsg('Error', json?.error || friendly[res.status] || `Failed (HTTP ${res.status})`);
//         return;
//       }

//       showMsg('Success', editId ? 'Service updated successfully.' : 'Service created successfully.');
//       onDone?.();
//       if (editId) navigation.goBack();
//     } catch (err) {
//       const aborted = err?.name === 'AbortError';
//       showMsg('Network Error', aborted ? 'Request timed out.' : 'Unable to reach the server.');
//     }
//   };

//   // ---------- render ----------
//   return (
//     <KeyboardAvoidingView
//       style={{ flex: 1 }}
//       behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
//       keyboardVerticalOffset={Platform.select({ ios: 64, android: 0, default: 0 })}
//     >
//       <ScrollView
//         contentContainerStyle={styles.wrap}
//         keyboardShouldPersistTaps="handled"
//         keyboardDismissMode={Platform.OS === 'ios' ? 'interactive' : 'on-drag'}
//         removeClippedSubviews={false}
//         {...(Platform.OS === 'ios' ? { contentInsetAdjustmentBehavior: 'automatic' } : {})}
//       >
//         <View style={styles.header}>
//           {/* ✅ Use handleBack here */}
//           <TouchableOpacity onPress={handleBack} style={styles.backBtn}>
//             <Ionicons name="arrow-back" size={18} />
//           </TouchableOpacity>
//           <Text style={styles.h1}>{editId ? 'Edit Cultural Service' : 'Add Cultural Service'}</Text>
//         </View>

//         {/* Loading mask for edit prefill */}
//         {loading ? (
//           <View style={[styles.card, { alignItems: 'center' }]}>
//             <Text>Loading…</Text>
//           </View>
//         ) : (
//           <>
//             {/* BASICS */}
//             <View style={styles.card}>
//               <Field label="Title" name="title" value={form.title} onCommit={onCommit} error={errors.title} />
//               <ChipGroup
//                 label="Experience Type"
//                 value={form.experience_type}
//                 onChange={v => set('experience_type', v)}
//                 options={EXPERIENCE_TYPES}
//               />
//               <ChipGroup
//                 label="Category"
//                 value={form.category}
//                 onChange={v => set('category', v)}
//                 options={(catOptions.length ? catOptions : ['General']).map(c => ({ label: c, value: c }))}
//                 allowFreeText
//               />
//               <Field label="Tags (comma separated)" name="tags" value={form.tags} onCommit={onCommit} placeholder="hands-on, budget-friendly" />
//               <Field label="Description" name="description" value={form.description} onCommit={onCommit} multiline />
//             </View>

//             {/* WHERE & WHEN */}
//             <View style={styles.card}>
//               <Text style={styles.cardTitle}>Where & When</Text>
//               <Field label="City" name="city" value={form.city} onCommit={onCommit} error={errors.city} />
//               <Field label="Meeting Point" name="meeting_point_label" value={form.meeting_point_label} onCommit={onCommit} placeholder="Café ABC, Main Bazaar" />

//               <ChipGroup
//                 label="Schedule Type"
//                 value={form.schedule_type}
//                 onChange={v => set('schedule_type', v)}
//                 options={SCHEDULE_TYPES}
//               />

//               {/* Fixed dates */}
//               {form.schedule_type === 'fixed_dates' && (
//                 <>
//                   {Platform.OS !== 'web' ? (
//                     <>
//                       <Text style={styles.label}>Add date(s)</Text>
//                       <View style={[styles.rowWrap, { marginBottom: 4 }]}>
//                         <TouchableOpacity style={styles.pickerBtn} onPress={openDatePicker}>
//                           <Ionicons name="calendar-outline" size={16} color="#0f172a" />
//                           <Text style={styles.pickerBtnText}>Pick a date</Text>
//                         </TouchableOpacity>
//                         {!!errors.fixed_dates && <Text style={styles.errorText}>{errors.fixed_dates}</Text>}
//                       </View>

//                       <View style={styles.rowWrap}>
//                         {form.fixed_dates.map(d => (
//                           <View key={d} style={styles.dateChip}>
//                             <Text style={styles.dateChipText}>{d}</Text>
//                             <TouchableOpacity onPress={() => removeFixedDate(d)} hitSlop={8}>
//                               <Ionicons name="close-circle" size={16} color="#991B1B" />
//                             </TouchableOpacity>
//                           </View>
//                         ))}
//                       </View>

//                       {showDatePicker && (
//                         <DateTimePicker
//                           mode="date"
//                           value={new Date()}
//                           onChange={onPickDate}
//                           display={Platform.OS === 'ios' ? 'inline' : 'default'}
//                         />
//                       )}
//                     </>
//                   ) : (
//                     <Field
//                       label="Available dates (YYYY-MM-DD, comma separated)"
//                       name="availableDatesText"
//                       value={form.availableDatesText}
//                       onCommit={(k, v) => {
//                         onCommit(k, v);
//                         set('fixed_dates', csvToArray(v));
//                       }}
//                       placeholder="2025-10-08, 2025-10-12"
//                       error={errors.availableDatesText}
//                     />
//                   )}
//                 </>
//               )}

//               {/* Weekly repeat */}
//               {form.schedule_type === 'repeat_weekly' && (
//                 <>
//                   <Text style={styles.label}>Days of Week</Text>
//                   <View style={styles.rowWrap}>
//                     {WEEK_DAYS.map(d => (
//                       <TouchableOpacity
//                         key={d}
//                         onPress={() => toggleDay(d)}
//                         style={[styles.chip, form.days_of_week.includes(d) && styles.chipSelected]}
//                       >
//                         <Text style={[styles.chipText, form.days_of_week.includes(d) && styles.chipTextSelected]}>{d}</Text>
//                       </TouchableOpacity>
//                     ))}
//                   </View>
//                   {!!errors.days_of_week && <Text style={styles.errorText}>{errors.days_of_week}</Text>}

//                   {Platform.OS !== 'web' ? (
//                     <View style={{ marginTop: 12 }}>
//                       <Text style={styles.label}>Start Time</Text>
//                       <TouchableOpacity style={styles.pickerBtn} onPress={openTimePicker}>
//                         <Ionicons name="time-outline" size={16} color="#0f172a" />
//                         <Text style={styles.pickerBtnText}>
//                           {form.start_time ? form.start_time : 'Pick time'}
//                         </Text>
//                       </TouchableOpacity>
//                       {!!errors.start_time && <Text style={styles.errorText}>{errors.start_time}</Text>}
//                       {showTimePicker && (
//                         <DateTimePicker
//                           mode="time"
//                           value={new Date()}
//                           onChange={onPickTime}
//                           display={Platform.OS === 'ios' ? 'spinner' : 'default'}
//                           is24Hour
//                         />
//                       )}
//                     </View>
//                   ) : (
//                     <Field
//                       label="Start Time (24h HH:MM)"
//                       name="start_time"
//                       value={form.start_time}
//                       onCommit={onCommit}
//                       placeholder="14:00"
//                       error={errors.start_time}
//                     />
//                   )}

//                   <Field
//                     label="Duration (hours)"
//                     name="duration_hours"
//                     keyboardType="numeric"
//                     value={form.duration_hours}
//                     onCommit={onCommit}
//                     error={errors.duration_hours}
//                   />
//                 </>
//               )}

//               {/* On request */}
//               {form.schedule_type === 'on_request' && (
//                 <>
//                   <Field
//                     label="Lead time (days)"
//                     name="lead_time_days"
//                     keyboardType="numeric"
//                     value={form.lead_time_days}
//                     onCommit={onCommit}
//                     error={errors.lead_time_days}
//                   />
//                   <Field
//                     label="Typical duration (hours)"
//                     name="duration_hours"
//                     keyboardType="numeric"
//                     value={form.duration_hours}
//                     onCommit={onCommit}
//                     error={errors.duration_hours}
//                   />
//                 </>
//               )}
//             </View>

//             {/* CAPACITY & LANGUAGES */}
//             <View style={styles.card}>
//               <Text style={styles.cardTitle}>Capacity & Languages</Text>
//               <Field label="Max Group Size" name="group_size_max" keyboardType="numeric" value={form.group_size_max} onCommit={onCommit} error={errors.group_size_max} />
//               <Field label="Languages (comma separated)" name="languages" value={form.languages} onCommit={onCommit} placeholder="English, Urdu" />
//             </View>

//             {/* PRICING */}
//             <View style={styles.card}>
//               <Text style={styles.cardTitle}>Pricing / Exchange</Text>
//               <ChipGroup
//                 label="Pricing Model"
//                 value={form.pricing_model}
//                 onChange={v => set('pricing_model', v)}
//                 options={PRICING_MODELS}
//               />

//               {form.pricing_model === 'per_person' && (
//                 <Field label="Price per person" name="price_per_person" keyboardType="numeric" value={form.price_per_person} onCommit={onCommit} error={errors.price_per_person} />
//               )}

//               {form.pricing_model === 'per_group' && (
//                 <>
//                   <Field label="Price per group" name="price_per_group" keyboardType="numeric" value={form.price_per_group} onCommit={onCommit} error={errors.price_per_group} />
//                   <Field label="Group size included in price" name="group_included_size" keyboardType="numeric" value={form.group_included_size} onCommit={onCommit} error={errors.group_included_size} />
//                 </>
//               )}

//               {form.pricing_model === 'exchange' && (
//                 <>
//                   <Field label="Host offers (what you give)" name="host_offers" value={form.host_offers} onCommit={onCommit} error={errors.host_offers} placeholder="2-hour cooking class" />
//                   <Field label="Traveler can offer (comma separated)" name="traveler_can_offer" value={form.traveler_can_offer} onCommit={onCommit} error={errors.traveler_can_offer} placeholder="photography, social media, translation" />
//                   <Field label="Exchange value hint (optional)" name="exchange_value_hint" value={form.exchange_value_hint} onCommit={onCommit} placeholder="Equivalent to ~Rs 4000 value" />
//                 </>
//               )}
//             </View>

//             {/* WHAT'S INCLUDED */}
//             <View style={styles.card}>
//               <Text style={styles.cardTitle}>What’s included / not</Text>
//               <Field label="What’s included (comma separated)" name="includes" value={form.includes} onCommit={onCommit} placeholder="materials, snacks" />
//               <Field label="What’s not included (comma separated)" name="excludes" value={form.excludes} onCommit={onCommit} placeholder="transport, tickets" />
//               <Field label="Material / attire requirements (comma separated)" name="material_requirements" value={form.material_requirements} onCommit={onCommit} placeholder="comfortable shoes, head covering" />
//             </View>

//             {/* POLICIES */}
//             <View style={styles.card}>
//               <Text style={styles.cardTitle}>Policies & Safety</Text>
//               <Field label="Age restriction (optional)" name="age_restriction" value={form.age_restriction} onCommit={onCommit} placeholder="12+" />
//               <Field label="Accessibility notes" name="accessibility_notes" value={form.accessibility_notes} onCommit={onCommit} placeholder="Stairs at venue, no elevator" />
//               <ChipGroup
//                 label="Cancellation Policy"
//                 value={form.cancellation_policy}
//                 onChange={v => set('cancellation_policy', v)}
//                 options={CANCELLATION}
//               />
//             </View>

//             <TouchableOpacity style={styles.primary} onPress={submit}>
//               <Text style={styles.primaryText}>{editId ? 'Save Changes' : 'Create Service'}</Text>
//             </TouchableOpacity>
//           </>
//         )}
//       </ScrollView>
//     </KeyboardAvoidingView>
//   );
// }

// // ---------- styles ----------
// const styles = StyleSheet.create({
//   wrap: {
//     padding: 12,
//     paddingBottom: 24,
//   },

//   header: {
//     flexDirection: 'row',
//     alignItems: 'center',
//   },
//   backBtn: {
//     padding: 6,
//     borderRadius: 8,
//     backgroundColor: '#F1F5F9',
//     marginRight: 8,
//   },
//   h1: { fontSize: 18, fontWeight: '800', color: '#0f172a' },

//   card: {
//     backgroundColor: '#fff',
//     borderRadius: 16,
//     borderWidth: 1,
//     borderColor: '#E2E8F0',
//     padding: 12,
//     marginTop: 12,
//     ...Platform.select({
//       web: { boxShadow: '0 6px 16px rgba(0,0,0,0.06)' },
//       default: { elevation: 1 },
//     }),
//   },
//   cardTitle: { fontWeight: '800', color: '#0f172a', marginBottom: 8 },

//   label: { fontWeight: '700', color: '#0f172a', marginBottom: 6, fontSize: 12 },
//   input: {
//     backgroundColor: '#F8FAFC',
//     borderWidth: 1,
//     borderColor: '#E2E8F0',
//     borderRadius: 10,
//     padding: 10,
//   },
//   multilineFixed: {
//     height: 120,
//     textAlignVertical: 'top',
//   },
//   inputError: { borderColor: '#EF4444', backgroundColor: '#FEF2F2' },
//   errorText: { color: '#B91C1C', marginTop: 4, fontSize: 12, fontWeight: '700' },

//   rowWrap: {
//     flexDirection: 'row',
//     flexWrap: 'wrap',
//     marginHorizontal: -4,
//     marginTop: 4,
//   },

//   chip: {
//     paddingVertical: 6,
//     paddingHorizontal: 12,
//     borderRadius: 999,
//     backgroundColor: '#F1F5F9',
//     borderWidth: 1,
//     borderColor: '#E5E7EB',
//     marginHorizontal: 4,
//     marginVertical: 4,
//   },
//   chipSelected: { backgroundColor: '#E0F2FE', borderColor: '#7DD3FC' },
//   chipText: { color: '#0f172a', fontWeight: '700', fontSize: 12 },
//   chipTextSelected: { color: '#075985' },

//   primary: {
//     backgroundColor: '#0ea5e9',
//     padding: 14,
//     borderRadius: 12,
//     marginTop: 12,
//     alignItems: 'center',
//   },
//   primaryText: { color: '#fff', fontWeight: '800' },

//   pickerBtn: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     backgroundColor: '#F1F5F9',
//     borderWidth: 1,
//     borderColor: '#E5E7EB',
//     borderRadius: 999,
//     paddingVertical: 8,
//     paddingHorizontal: 12,
//   },
//   pickerBtnText: { fontWeight: '800', color: '#0f172a', marginLeft: 8 },

//   dateChip: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     backgroundColor: '#EEF2FF',
//     borderWidth: 1,
//     borderColor: '#C7D2FE',
//     borderRadius: 999,
//     paddingVertical: 4,
//     paddingHorizontal: 10,
//     marginHorizontal: 4,
//     marginVertical: 4,
//   },
//   dateChipText: { fontSize: 12, fontWeight: '700', color: '#3730A3', marginRight: 6 },
// });



// screens/CulturalExchange/AddCulturalServiceForm.js

import React, { useMemo, useState, useEffect } from 'react';
import {
  View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView, Alert, Platform, KeyboardAvoidingView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import DateTimePicker from '@react-native-community/datetimepicker';
import { useRoute, useNavigation } from '@react-navigation/native';

/* ========= Backend Config ========= */
import AsyncStorage from '@react-native-async-storage/async-storage';
import getBaseURL from '../../config/env';

const API_BASE = getBaseURL().replace(/\/+$/, '');

const TOKEN_KEYS = ['token','auth_token','jwt','access_token','AUTH_TOKEN','userToken'];
const getAuthToken = async () => {
  for (const k of TOKEN_KEYS) {
    const v = await AsyncStorage.getItem(k);
    if (v) return v;
  }
  return null;
};
const showMsg = (title, msg) => {
  if (Platform.OS === 'web') alert(`${title ? title + ': ' : ''}${msg}`);
  else Alert.alert(title || 'Notice', msg);
};
/* ================================== */

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

/* ---------- Field (uncontrolled while typing) ---------- */
const Field = React.memo(function Field({
  label, name, value, onCommit, error, multiline, placeholder, keyboardType, ...props
}) {
  const [inner, setInner] = useState(value ?? '');

  // keep in sync if parent updates (e.g., prefill/reset)
  useEffect(() => { setInner(value ?? ''); }, [value]);

  const commit = () => { onCommit?.(name, inner); };

  return (
    <View style={{ marginBottom: 12 }}>
      <Text style={styles.label}>{label}</Text>
      <TextInput
        value={inner}
        onChangeText={setInner}
        onBlur={commit}
        onSubmitEditing={commit}
        blurOnSubmit
        placeholder={placeholder || label}
        keyboardType={keyboardType}
        style={[
          styles.input,
          multiline && styles.multilineFixed,
          error && styles.inputError,
        ]}
        multiline={!!multiline}
        {...props}
      />
      {!!error && <Text style={styles.errorText}>{error}</Text>}
    </View>
  );
});

/* ---------- Chips ---------- */
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
  const [free, setFree] = useState(value ?? '');
  useEffect(() => { setFree(value ?? ''); }, [value]);

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
          value={free}
          onChangeText={setFree}
          onBlur={() => onChange(free)}
          placeholder="Or type a custom value"
          style={[styles.input, { marginTop: 8 }]}
        />
      )}
    </View>
  );
};

export default function AddCulturalServiceForm({ onDone, onBack }) {
  const route = useRoute();
  const navigation = useNavigation();
  const editId = route.params?.editId ?? null;

  // ✅ Back handler: use onBack if given; otherwise goBack
  const handleBack = () => {
    if (typeof onBack === 'function') return onBack();
    navigation.goBack();
  };

  const [form, setForm] = useState({
    title: '',
    experience_type: 'workshop',
    category: '',
    tags: '',
    description: '',

    city: '',
    meeting_point_label: '',
    schedule_type: 'fixed_dates',

    fixed_dates: [],
    availableDatesText: '',

    days_of_week: [],
    start_time: '',
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
  const [loading, setLoading] = useState(!!editId);

  const set = (k, v) => setForm(s => ({ ...s, [k]: v }));
  const onCommit = (k, v) => setForm(s => ({ ...s, [k]: v }));

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
  const arrayToCSV = (arr) => (Array.isArray(arr) ? arr.join(', ') : '');
  const isHHMM = (s) => /^([01]\d|2[0-3]):[0-5]\d$/.test(String(s || ''));
  const isDate = (s) => /^\d{4}-\d{2}-\d{2}$/.test(String(s || ''));
  const num = (v) => {
    const n = Number(v);
    return Number.isFinite(n) ? n : NaN;
  };

  // ---------- load for EDIT ----------
  useEffect(() => {
    if (!editId) return;
    let mounted = true;
    (async () => {
      try {
        const token = await getAuthToken();
        if (!token) { showMsg('Login required', 'Please sign in again.'); return; }
        const res = await fetch(`${API_BASE}/cultural/services/${editId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const json = await res.json();
        if (!res.ok) throw new Error(json?.error || `Failed: ${res.status}`);

        if (!mounted) return;

        // Map API -> form state
        const f = {
          title: json.title || '',
          experience_type: json.experience_type || 'workshop',
          category: json.category || '',
          tags: arrayToCSV(json.tags || []),
          description: json.description || '',

          city: json.city || '',
          meeting_point_label: json.meeting_point_label || '',
          schedule_type: json.schedule_type || 'fixed_dates',

          fixed_dates: json.fixed_dates || [],
          availableDatesText: (json.fixed_dates || []).join(', '),

          days_of_week: json.days_of_week || [],
          start_time: json.start_time || '',
          duration_hours: json.duration_hours ? String(json.duration_hours) : '',
          lead_time_days: json.lead_time_days != null ? String(json.lead_time_days) : '',

          group_size_max: json.group_size_max != null ? String(json.group_size_max) : '',
          languages: arrayToCSV(json.languages || []),

          pricing_model: json.pricing_model || 'per_person',
          price_per_person: json.price_per_person != null ? String(json.price_per_person) : '',
          price_per_group: json.price_per_group != null ? String(json.price_per_group) : '',
          group_included_size: json.group_included_size != null ? String(json.group_included_size) : '',

          host_offers: json.host_offers || '',
          traveler_can_offer: arrayToCSV(json.traveler_can_offer || []),
          exchange_value_hint: json.exchange_value_hint || '',

          includes: arrayToCSV(json.includes || []),
          excludes: arrayToCSV(json.excludes || []),
          material_requirements: arrayToCSV(json.material_requirements || []),
          accessibility_notes: json.accessibility_notes || '',
          age_restriction: json.age_restriction || '',
          cancellation_policy: json.cancellation_policy || 'moderate',
        };
        setForm(f);
      } catch (e) {
        showMsg('Error', e.message || 'Failed to load service');
      } finally {
        if (mounted) setLoading(false);
      }
    })();
    return () => { mounted = false; };
  }, [editId]);

  // ---------- pickers ----------
  const openDatePicker = () => setShowDatePicker(true);
  const onPickDate = (e, date) => {
    setShowDatePicker(false);
    if (!date) return;
    const ymd = toYMD(date);
    if (!form.fixed_dates.includes(ymd)) {
      const next = [...form.fixed_dates, ymd].sort();
      set('fixed_dates', next);
      set('availableDatesText', next.join(', '));
    }
  };
  const removeFixedDate = (d) => {
    const next = form.fixed_dates.filter(x => x !== d);
    set('fixed_dates', next);
    set('availableDatesText', next.join(', '));
  };

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

  // ---------- submit (POST create | PUT edit) ----------
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

      group_size_max: form.group_size_max ? Number(form.group_size_max) : 0,
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
      age_restriction: form.age_restriction.trim() ? form.age_restriction.trim() : null,
      cancellation_policy: form.cancellation_policy,
    };

    try {
      const token = await getAuthToken();
      if (!token) { showMsg('Not logged in', 'Please log in again.'); return; }

      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), 20000);

      const method = editId ? 'PUT' : 'POST';
      const url = editId
        ? `${API_BASE}/cultural/services/${editId}`
        : `${API_BASE}/cultural/services`;

      const res = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
        signal: controller.signal,
      });

      clearTimeout(timeout);

      const text = await res.text();
      let json = null;
      try { json = text ? JSON.parse(text) : null; } catch {}

      if (res.status === 401) { showMsg('Session expired', 'Please log in again.'); return; }
      if (res.status === 428) { showMsg('Complete Profile', json?.error || 'Please complete your profile to continue.'); return; }

      if (!res.ok) {
        const friendly = {
          400: 'Invalid data. Please review the fields.',
          403: "You don't have permission to do that.",
          404: 'Not found.',
          500: 'Server error. Please try again.',
          502: 'Bad gateway.',
          503: 'Server unavailable.',
          504: 'Server timed out.',
        };
        showMsg('Error', json?.error || friendly[res.status] || `Failed (HTTP ${res.status})`);
        return;
      }

      showMsg('Success', editId ? 'Service updated successfully.' : 'Service created successfully.');
      onDone?.();
      if (editId) navigation.goBack();
    } catch (err) {
      const aborted = err?.name === 'AbortError';
      showMsg('Network Error', aborted ? 'Request timed out.' : 'Unable to reach the server.');
    }
  };

  // ---------- render ----------
  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      keyboardVerticalOffset={Platform.select({ ios: 64, android: 0, default: 0 })}
    >
      <ScrollView
        contentContainerStyle={styles.wrap}
        keyboardShouldPersistTaps="handled"
        keyboardDismissMode={Platform.OS === 'ios' ? 'interactive' : 'on-drag'}
        removeClippedSubviews={false}
        {...(Platform.OS === 'ios' ? { contentInsetAdjustmentBehavior: 'automatic' } : {})}
      >
        <View style={styles.header}>
          {/* ✅ Use handleBack here */}
          <TouchableOpacity onPress={handleBack} style={styles.backBtn}>
            <Ionicons name="arrow-back" size={18} />
          </TouchableOpacity>
          <Text style={styles.h1}>{editId ? 'Edit Cultural Service' : 'Add Cultural Service'}</Text>
        </View>

        {/* Loading mask for edit prefill */}
        {loading ? (
          <View style={[styles.card, { alignItems: 'center' }]}>
            <Text>Loading…</Text>
          </View>
        ) : (
          <>
            {/* BASICS */}
            <View style={styles.card}>
              <Field label="Title" name="title" value={form.title} onCommit={onCommit} error={errors.title} />
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
              <Field label="Tags (comma separated)" name="tags" value={form.tags} onCommit={onCommit} placeholder="hands-on, budget-friendly" />
              <Field label="Description" name="description" value={form.description} onCommit={onCommit} multiline />
            </View>

            {/* WHERE & WHEN */}
            <View style={styles.card}>
              <Text style={styles.cardTitle}>Where & When</Text>
              <Field label="City" name="city" value={form.city} onCommit={onCommit} error={errors.city} />
              <Field label="Meeting Point" name="meeting_point_label" value={form.meeting_point_label} onCommit={onCommit} placeholder="Café ABC, Main Bazaar" />

              <ChipGroup
                label="Schedule Type"
                value={form.schedule_type}
                onChange={v => set('schedule_type', v)}
                options={SCHEDULE_TYPES}
              />

              {/* Fixed dates */}
              {form.schedule_type === 'fixed_dates' && (
                <>
                  {Platform.OS !== 'web' ? (
                    <>
                      <Text style={styles.label}>Add date(s)</Text>
                      <View style={[styles.rowWrap, { marginBottom: 4 }]}>
                        <TouchableOpacity style={styles.pickerBtn} onPress={openDatePicker}>
                          <Ionicons name="calendar-outline" size={16} color="#0f172a" />
                          <Text style={styles.pickerBtnText}>Pick a date</Text>
                        </TouchableOpacity>
                        {!!errors.fixed_dates && <Text style={styles.errorText}>{errors.fixed_dates}</Text>}
                      </View>

                      <View style={styles.rowWrap}>
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
                      name="availableDatesText"
                      value={form.availableDatesText}
                      onCommit={(k, v) => {
                        onCommit(k, v);
                        set('fixed_dates', csvToArray(v));
                      }}
                      placeholder="2025-10-08, 2025-10-12"
                      error={errors.availableDatesText}
                    />
                  )}
                </>
              )}

              {/* Weekly repeat */}
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
                      name="start_time"
                      value={form.start_time}
                      onCommit={onCommit}
                      placeholder="14:00"
                      error={errors.start_time}
                    />
                  )}

                  <Field
                    label="Duration (hours)"
                    name="duration_hours"
                    keyboardType="numeric"
                    value={form.duration_hours}
                    onCommit={onCommit}
                    error={errors.duration_hours}
                  />
                </>
              )}

              {/* On request */}
              {form.schedule_type === 'on_request' && (
                <>
                  <Field
                    label="Lead time (days)"
                    name="lead_time_days"
                    keyboardType="numeric"
                    value={form.lead_time_days}
                    onCommit={onCommit}
                    error={errors.lead_time_days}
                  />
                  <Field
                    label="Typical duration (hours)"
                    name="duration_hours"
                    keyboardType="numeric"
                    value={form.duration_hours}
                    onCommit={onCommit}
                    error={errors.duration_hours}
                  />
                </>
              )}
            </View>

            {/* CAPACITY & LANGUAGES */}
            <View style={styles.card}>
              <Text style={styles.cardTitle}>Capacity & Languages</Text>
              <Field label="Max Group Size" name="group_size_max" keyboardType="numeric" value={form.group_size_max} onCommit={onCommit} error={errors.group_size_max} />
              <Field label="Languages (comma separated)" name="languages" value={form.languages} onCommit={onCommit} placeholder="English, Urdu" />
            </View>

            {/* PRICING */}
            <View style={styles.card}>
              <Text style={styles.cardTitle}>Pricing / Exchange</Text>
              <ChipGroup
                label="Pricing Model"
                value={form.pricing_model}
                onChange={v => set('pricing_model', v)}
                options={PRICING_MODELS}
              />

              {form.pricing_model === 'per_person' && (
                <Field label="Price per person" name="price_per_person" keyboardType="numeric" value={form.price_per_person} onCommit={onCommit} error={errors.price_per_person} />
              )}

              {form.pricing_model === 'per_group' && (
                <>
                  <Field label="Price per group" name="price_per_group" keyboardType="numeric" value={form.price_per_group} onCommit={onCommit} error={errors.price_per_group} />
                  <Field label="Group size included in price" name="group_included_size" keyboardType="numeric" value={form.group_included_size} onCommit={onCommit} error={errors.group_included_size} />
                </>
              )}

              {form.pricing_model === 'exchange' && (
                <>
                  <Field label="Host offers (what you give)" name="host_offers" value={form.host_offers} onCommit={onCommit} error={errors.host_offers} placeholder="2-hour cooking class" />
                  <Field label="Traveler can offer (comma separated)" name="traveler_can_offer" value={form.traveler_can_offer} onCommit={onCommit} error={errors.traveler_can_offer} placeholder="photography, social media, translation" />
                  <Field label="Exchange value hint (optional)" name="exchange_value_hint" value={form.exchange_value_hint} onCommit={onCommit} placeholder="Equivalent to ~Rs 4000 value" />
                </>
              )}
            </View>

            {/* WHAT'S INCLUDED */}
            <View style={styles.card}>
              <Text style={styles.cardTitle}>What’s included / not</Text>
              <Field label="What’s included (comma separated)" name="includes" value={form.includes} onCommit={onCommit} placeholder="materials, snacks" />
              <Field label="What’s not included (comma separated)" name="excludes" value={form.excludes} onCommit={onCommit} placeholder="transport, tickets" />
              <Field label="Material / attire requirements (comma separated)" name="material_requirements" value={form.material_requirements} onCommit={onCommit} placeholder="comfortable shoes, head covering" />
            </View>

            {/* POLICIES */}
            <View style={styles.card}>
              <Text style={styles.cardTitle}>Policies & Safety</Text>
              <Field label="Age restriction (optional)" name="age_restriction" value={form.age_restriction} onCommit={onCommit} placeholder="12+" />
              <Field label="Accessibility notes" name="accessibility_notes" value={form.accessibility_notes} onCommit={onCommit} placeholder="Stairs at venue, no elevator" />
              <ChipGroup
                label="Cancellation Policy"
                value={form.cancellation_policy}
                onChange={v => set('cancellation_policy', v)}
                options={CANCELLATION}
              />
            </View>

            <TouchableOpacity style={styles.primary} onPress={submit}>
              <Text style={styles.primaryText}>{editId ? 'Save Changes' : 'Create Service'}</Text>
            </TouchableOpacity>
          </>
        )}
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

// ---------- styles ----------
const styles = StyleSheet.create({
  wrap: {
    padding: 12,
    paddingBottom: 24,
  },

  header: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  backBtn: {
    padding: 6,
    borderRadius: 8,
    backgroundColor: '#F1F5F9',
    marginRight: 8,
  },
  h1: { fontSize: 18, fontWeight: '800', color: '#0f172a' },

  card: {
    backgroundColor: '#fff',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    padding: 12,
    marginTop: 12,
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
  multilineFixed: {
    height: 120,
    textAlignVertical: 'top',
  },
  inputError: { borderColor: '#EF4444', backgroundColor: '#FEF2F2' },
  errorText: { color: '#B91C1C', marginTop: 4, fontSize: 12, fontWeight: '700' },

  rowWrap: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginHorizontal: -4,
    marginTop: 4,
  },

  chip: {
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 999,
    backgroundColor: '#F1F5F9',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    marginHorizontal: 4,
    marginVertical: 4,
  },
  chipSelected: { backgroundColor: '#E0F2FE', borderColor: '#7DD3FC' },
  chipText: { color: '#0f172a', fontWeight: '700', fontSize: 12 },
  chipTextSelected: { color: '#075985' },

  primary: {
    backgroundColor: '#0ea5e9',
    padding: 14,
    borderRadius: 12,
    marginTop: 12,
    alignItems: 'center',
  },
  primaryText: { color: '#fff', fontWeight: '800' },

  pickerBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F1F5F9',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 999,
    paddingVertical: 8,
    paddingHorizontal: 12,
  },
  pickerBtnText: { fontWeight: '800', color: '#0f172a', marginLeft: 8 },

  dateChip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#EEF2FF',
    borderWidth: 1,
    borderColor: '#C7D2FE',
    borderRadius: 999,
    paddingVertical: 4,
    paddingHorizontal: 10,
    marginHorizontal: 4,
    marginVertical: 4,
  },
  dateChipText: { fontSize: 12, fontWeight: '700', color: '#3730A3', marginRight: 6 },
});


