// screens/Traveler/ServiceBookingRequest.js
import React, { useEffect, useState } from 'react';
import { View, Text, TextInput, StyleSheet, TouchableOpacity, Alert, Platform } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import getBaseURL from '../../config/env';
import { Ionicons } from '@expo/vector-icons';
const API_BASE = getBaseURL().replace(/\/+$/, '');
const TOKEN_KEYS = ['token','auth_token','jwt','access_token','AUTH_TOKEN','userToken'];
const getAuthToken = async () => { for (const k of TOKEN_KEYS){const v=await AsyncStorage.getItem(k); if(v) return v;} return null; };

export default function ServiceBookingRequest({ route, navigation }) {
  const { id } = route.params || {};
  const [participants, setParticipants] = useState('1');
  const [date, setDate] = useState('');
  const [message, setMessage] = useState('');

  const submit = async () => {
    try {
      const token = await getAuthToken(); if(!token){ Alert.alert('Login required'); return; }
      const body = {
        service_id: id,
        participants: Number(participants || 1),
        chosen_date: date || null,
        message,
      };
      const res = await fetch(`${API_BASE}/cultural/bookings`, {
        method:'POST',
        headers:{ 'Content-Type':'application/json', Authorization:`Bearer ${token}` },
        body: JSON.stringify(body),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json?.error || 'Failed');
      Alert.alert('Request sent', 'The host will confirm or decline.');
      navigation.goBack();
    } catch(e){ Alert.alert('Error', e.message || 'Could not request'); }
  };

  return (
    <View style={{ padding:12 }}>
      <Text style={styles.h1}>Request Booking</Text>
      <TextInput style={styles.inp} placeholder="Participants" keyboardType="numeric" value={participants} onChangeText={setParticipants}/>
      <TextInput style={styles.inp} placeholder="Preferred date (YYYY-MM-DD, optional)" value={date} onChangeText={setDate}/>
      <TextInput style={[styles.inp,{height:120,textAlignVertical:'top'}]} multiline placeholder="Message to host (optional)" value={message} onChangeText={setMessage}/>
      <TouchableOpacity style={styles.btn} onPress={submit}>
        <Ionicons name="paper-plane-outline" size={16} color="#fff"/>
        <Text style={styles.btnText}>Send Request</Text>
      </TouchableOpacity>
    </View>
  );
}
const styles = StyleSheet.create({
  h1:{ fontSize:18, fontWeight:'800', color:'#0f172a', marginBottom:8 },
  inp:{ backgroundColor:'#F8FAFC', borderWidth:1, borderColor:'#E2E8F0', borderRadius:10, padding:10, marginBottom:8 },
  btn:{ backgroundColor:'#0ea5e9', padding:12, borderRadius:10, alignItems:'center', flexDirection:'row', justifyContent:'center', gap:8 },
  btnText:{ color:'#fff', fontWeight:'800' },
});
