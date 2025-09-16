// screens/ManageTravelerProfile.js
import React, { useEffect, useState } from 'react';
import {
  View, Text, StyleSheet, ScrollView, TextInput, TouchableOpacity, ActivityIndicator, Platform, Image, Alert
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import api from '../../api';

const PRIMARY = '#003366';
const SUBTEXT  = '#6B7280';
const PAGE_BG  = '#F7F7F7';
const CARD_BG  = '#FFFFFF';
const BORDER   = '#ECEFF3';
const PILL_BG  = '#F0F6FF';
const DANGER   = '#E11D48';
const SUCCESS  = '#10B981';
const MAX_W    = 720;

export default function ManageTravelerProfile() {
  const nav = useNavigation();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving]   = useState(false);
  const [err, setErr]         = useState('');

  // profile state
  const [avatarUrl, setAvatarUrl] = useState('');
  const [firstName, setFirst]     = useState('');
  const [lastName, setLast]       = useState('');
  const [bio, setBio]             = useState('');
  const [phone, setPhone]         = useState('');
  const [countryCode, setCC]      = useState('+92');
  const [country, setCountry]     = useState('');
  const [city, setCity]           = useState('');
  const [email, setEmail]         = useState('');
  const [emailVerified, setEV]    = useState(false);
  const [role, setRole]           = useState('traveler'); // read-only
  const [stats, setStats]         = useState({ rating: null, tripCount: null });
  const [kycStatus, setKyc]       = useState('none');     // optional

  useEffect(() => {
    (async () => {
      try {
        const { data } = await api.get('/profile/me');
        setAvatarUrl(data.avatarUrl || '');
        setFirst(data.firstName || '');
        setLast(data.lastName || '');
        setBio(data.bio || '');
        setPhone(data.phone || '');
        setCC((data.countryCode || '+92'));
        setCountry(data.country || '');
        setCity(data.city || '');
        setEmail(data.email || '');
        setEV(!!data.emailVerified);
        setRole(data.role || 'traveler');
        setStats(data.stats || { rating: null, tripCount: null });
        setKyc(data.kycStatus || 'none');
      } catch (e) {
        setErr('Failed to load profile.');
        console.log(e?.response?.data || e.message);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const pickPhoto = async () => {
    // Optional: plug Expo ImagePicker here
    Alert.alert('Photo', 'Hook up expo-image-picker here to upload a new avatar.');
  };

  const validate = () => {
    if (!firstName || firstName.length < 2) return 'First name is too short';
    if (!lastName || lastName.length < 2)  return 'Last name is too short';
    if (countryCode && !countryCode.startsWith('+')) return 'Country code must start with +';
    return '';
  };

  const onSave = async () => {
    const v = validate();
    if (v) { setErr(v); return; }
    setSaving(true); setErr('');
    try {
      await api.patch('/profile/me', {
        firstName, lastName, bio, phone, countryCode, country, city
      });
      Alert.alert('Saved', 'Your profile was updated.');
      nav.goBack();
    } catch (e) {
      setErr(e?.response?.data?.error || 'Save failed.');
      console.log(e?.response?.data || e.message);
    } finally {
      setSaving(false);
    }
  };

  // 🔙 Back button handler
  const handleBack = () => {
    if (nav.canGoBack()) nav.goBack();
    else nav.navigate('TravelerProfile'); // fallback route name
  };

  if (loading) {
    return (
      <View style={{ flex:1, justifyContent:'center', alignItems:'center', backgroundColor: PAGE_BG }}>
        <ActivityIndicator size="large" color={PRIMARY} />
        <Text style={{ marginTop: 8, color: SUBTEXT }}>Loading profile…</Text>
      </View>
    );
  }

  return (
    <View style={styles.page}>
      <ScrollView contentContainerStyle={styles.scroll}>
        <View style={styles.content}>

          {/* Top bar with Back */}
          <View style={styles.topBar}>
            <TouchableOpacity
              onPress={handleBack}
              style={styles.backBtn}
              hitSlop={{ top: 10, left: 10, right: 10, bottom: 10 }}
              accessibilityRole="button"
              accessibilityLabel="Go back to profile"
            >
              <Ionicons name="chevron-back" size={20} color={PRIMARY} />
              <Text style={styles.backTxt}>Back</Text>
            </TouchableOpacity>
          </View>

          <Text style={styles.title}>Edit Profile</Text>

          {!!err && (
            <View style={styles.errorBox}>
              <Ionicons name="alert-circle" size={16} color="#fff" />
              <Text style={styles.errorText}>{err}</Text>
            </View>
          )}

          {/* Identity card */}
          <View style={styles.card}>
            <View style={{ flexDirection:'row', alignItems:'center', gap:12 }}>
              <TouchableOpacity onPress={pickPhoto} activeOpacity={0.85} accessibilityLabel="Change profile picture">
                {avatarUrl ? (
                  <Image source={{ uri: avatarUrl }} style={styles.avatar} />
                ) : (
                  <View style={[styles.avatar, styles.avatarFallback]}>
                    <Text style={{ color:'#fff', fontWeight:'800', fontSize:22 }}>
                      {(firstName || 'U')[0]}
                    </Text>
                  </View>
                )}
              </TouchableOpacity>

              <View style={{ flex:1 }}>
                <Text style={styles.identityName}>
                  {firstName || '—'} {lastName || ''}
                </Text>
                <View style={{ flexDirection:'row', gap:8, alignItems:'center', marginTop:4 }}>
                  <RoleBadge role={role} />
                  <VerifyBadge verified={emailVerified} />
                </View>
              </View>

              <View style={{ alignItems:'flex-end' }}>
                <Text style={styles.statText}>
                  ⭐ {stats?.rating ?? '—'}   •   🗺️ {stats?.tripCount ?? 0}
                </Text>
              </View>
            </View>
          </View>

          {/* Contact (email read-only) */}
          <Section title="Contact">
            <ReadOnlyRow label="Email" value={email} right={
              <View style={{ flexDirection:'row', alignItems:'center', gap:6 }}>
                <Ionicons name={emailVerified ? 'checkmark-circle' : 'close-circle'} size={16} color={emailVerified ? SUCCESS : DANGER} />
                <Text style={{ color: emailVerified ? SUCCESS : DANGER, fontWeight:'600', fontSize:12 }}>
                  {emailVerified ? 'Verified' : 'Not verified'}
                </Text>
              </View>
            }/>
            <Row label="Phone (+code)">
              <View style={{ flexDirection:'row', gap:8, flex:1 }}>
                <TextInput
                  value={countryCode} onChangeText={setCC}
                  style={[styles.input, { width: 80 }]} keyboardType="phone-pad"
                  accessibilityLabel="Country code"
                />
                <TextInput
                  value={phone} onChangeText={setPhone}
                  style={[styles.input, { flex:1 }]} keyboardType="phone-pad"
                  placeholder="3xx xxx xxxx" accessibilityLabel="Phone number"
                />
              </View>
            </Row>
          </Section>

          {/* Location */}
          <Section title="Location">
            <Row label="Country">
              <TextInput value={country} onChangeText={setCountry} style={[styles.input, { flex:1 }]} placeholder="Pakistan" />
            </Row>
            <Row label="City">
              <TextInput value={city} onChangeText={setCity} style={[styles.input, { flex:1 }]} placeholder="Skardu" />
            </Row>
          </Section>

          {/* Personal */}
          <Section title="Personal">
            <Row label="First name">
              <TextInput value={firstName} onChangeText={setFirst} style={[styles.input, { flex:1 }]} />
            </Row>
            <Row label="Last name">
              <TextInput value={lastName} onChangeText={setLast} style={[styles.input, { flex:1 }]} />
            </Row>
            <Row label="Bio">
              <TextInput
                value={bio} onChangeText={setBio}
                style={[styles.input, { flex:1, height: 86, textAlignVertical:'top' }]}
                multiline maxLength={240} placeholder="Tell others about your travel style…"
              />
            </Row>
          </Section>

          {/* Role & Verification (read-only role; optional KYC status) */}
          <Section title="Role & Verification">
            <ReadOnlyRow label="Role" value={role === 'vendor' ? 'Vendor' : 'Traveler'} />
            <ReadOnlyRow label="KYC Status" value={kycStatus} />
            {role !== 'vendor' && (
              <TouchableOpacity onPress={() => nav.navigate('Login', { selectedRole: 'vendor' })} style={styles.ctaOutline} activeOpacity={0.9}>
                <Ionicons name="briefcase-outline" size={18} color={PRIMARY} />
                <Text style={styles.ctaOutlineText}>Become a Vendor</Text>
              </TouchableOpacity>
            )}
          </Section>

          {/* Account & Security shortcuts */}
          <Section title="Account & Security">
            <LinkRow label="Change Password" icon="key-outline" onPress={() => nav.navigate('ChangePassword')} />
            <LinkRow label="Two-Factor Authentication" icon="lock-closed-outline" onPress={() => nav.navigate('TwoFactor')} />
            <LinkRow label="Logout" icon="log-out-outline" danger onPress={() => nav.navigate('Landing Page')} />
          </Section>

          {/* Save bar */}
          <View style={styles.footer}>
            <TouchableOpacity style={[styles.btn, styles.btnGhost]} onPress={handleBack} disabled={saving}>
              <Text style={[styles.btnText, { color: PRIMARY }]}>Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[styles.btn, styles.btnPrimary]} onPress={onSave} disabled={saving}>
              {saving ? <ActivityIndicator color="#fff" /> : <Text style={styles.btnText}>Save Changes</Text>}
            </TouchableOpacity>
          </View>

          <View style={{ height: 24 }} />
        </View>
      </ScrollView>
    </View>
  );
}

/* ---------- Small subcomponents ---------- */
function Section({ title, children }) {
  return (
    <View style={{ marginTop: 14 }}>
      <Text style={styles.sectionHeading}>{title}</Text>
      <View style={styles.card}>{children}</View>
    </View>
  );
}
function Row({ label, children }) {
  return (
    <View style={styles.row}>
      <Text style={styles.rowLabel}>{label}</Text>
      <View style={{ flex:1 }}>{children}</View>
    </View>
  );
}
function ReadOnlyRow({ label, value, right }) {
  return (
    <View style={styles.row}>
      <Text style={styles.rowLabel}>{label}</Text>
      <View style={{ flex:1, flexDirection:'row', justifyContent:'space-between', alignItems:'center' }}>
        <Text style={styles.readonly}>{value || '—'}</Text>
        {right}
      </View>
    </View>
  );
}
function LinkRow({ label, icon, onPress, danger }) {
  return (
    <TouchableOpacity onPress={onPress} style={styles.linkRow} activeOpacity={0.85}>
      <View style={{ flexDirection:'row', alignItems:'center', gap:8 }}>
        <Ionicons name={icon} size={18} color={danger ? DANGER : PRIMARY} />
        <Text style={[styles.linkLabel, danger && { color: DANGER }]}>{label}</Text>
      </View>
      <Ionicons name="chevron-forward" size={18} color={SUBTEXT} />
    </TouchableOpacity>
  );
}
function RoleBadge({ role }) {
  const txt = role === 'vendor' ? 'Vendor' : 'Traveler';
  return (
    <View style={styles.badge}>
      <Text style={styles.badgeText}>{txt}</Text>
    </View>
  );
}
function VerifyBadge({ verified }) {
  return (
    <View style={[styles.badge, { backgroundColor: verified ? PILL_BG : '#FEF2F2', borderColor: verified ? '#DBEAFE' : '#FEE2E2' }]}>
      <Ionicons name={verified ? 'checkmark-circle' : 'close-circle'} size={14} color={verified ? SUCCESS : DANGER} />
      <Text style={[styles.badgeText, { color: verified ? PRIMARY : DANGER }]}>
        {verified ? 'Email Verified' : 'Not Verified'}
      </Text>
    </View>
  );
}

/* ---------- Styles ---------- */
const styles = StyleSheet.create({
  page: { flex:1, backgroundColor: PAGE_BG, ...(Platform.OS === 'web' && { paddingTop:12 }) },
  scroll: { alignItems:'center', paddingHorizontal:12, paddingTop:12 },
  content: { width:'100%', maxWidth: MAX_W, alignSelf:'center' },

  // top bar
  topBar: { flexDirection:'row', alignItems:'center', justifyContent:'flex-start', marginBottom:6 },
  backBtn: {
    flexDirection:'row', alignItems:'center', gap:4,
    backgroundColor:'#fff', borderWidth:1, borderColor:BORDER,
    paddingHorizontal:10, paddingVertical:8, borderRadius:10
  },
  backTxt: { color: PRIMARY, fontWeight:'700', fontSize:13 },

  title: { fontSize:22, fontWeight:'800', color:'#0F172A', marginBottom:8 },
  sectionHeading: { fontSize:16, fontWeight:'700', color:'#0F172A', marginBottom:8 },

  card: { backgroundColor:CARD_BG, borderRadius:16, padding:14, borderWidth:1, borderColor:BORDER },

  row: { flexDirection:'row', alignItems:'center', gap:12, paddingVertical:8 },
  rowLabel: { width:120, color:SUBTEXT, fontWeight:'600', fontSize:12 },
  input: {
    backgroundColor:'#fff', borderWidth:1, borderColor:BORDER, borderRadius:12,
    paddingHorizontal:12, paddingVertical:10, fontSize:14, color:'#0F172A'
  },
  readonly: { color:'#0F172A', fontWeight:'600' },

  linkRow: {
    paddingVertical:12, flexDirection:'row', alignItems:'center', justifyContent:'space-between',
    borderTopWidth:1, borderTopColor:BORDER
  },
  linkLabel: { fontSize:13, fontWeight:'700', color:PRIMARY },

  // identity
  avatar: { width:72, height:72, borderRadius:36, backgroundColor:'#111827' },
  avatarFallback: { alignItems:'center', justifyContent:'center' },
  identityName: { fontSize:18, fontWeight:'800', color:'#0F172A' },
  statText: { color:SUBTEXT, fontWeight:'600', fontSize:12 },

  badge: {
    flexDirection:'row', alignItems:'center', gap:6,
    backgroundColor:PILL_BG, borderWidth:1, borderColor:'#DBEAFE', borderRadius:999, paddingHorizontal:10, paddingVertical:4
  },
  badgeText: { color:PRIMARY, fontWeight:'700', fontSize:12 },

  // CTA (added to avoid undefined style)
  ctaOutline: {
    marginTop:10, alignSelf:'flex-start',
    flexDirection:'row', alignItems:'center', gap:6,
    borderWidth:1, borderColor:PRIMARY, borderRadius:12,
    paddingVertical:8, paddingHorizontal:12, backgroundColor:'#fff'
  },
  ctaOutlineText: { color: PRIMARY, fontWeight:'800' },

  // footer
  footer: { flexDirection:'row', gap:10, justifyContent:'flex-end', marginTop:14 },
  btn: { height:44, paddingHorizontal:16, borderRadius:12, alignItems:'center', justifyContent:'center', minWidth:120 },
  btnPrimary: { backgroundColor: PRIMARY },
  btnGhost: { backgroundColor:'#fff', borderWidth:1, borderColor:BORDER },
  btnText: { color:'#fff', fontWeight:'800' },

  errorBox: {
    flexDirection:'row', alignItems:'center', gap:8, backgroundColor:DANGER, borderRadius:12,
    paddingVertical:8, paddingHorizontal:12, marginBottom:8
  },
  errorText: { color:'#fff', fontWeight:'700' },
});
