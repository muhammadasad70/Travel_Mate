import React, { useState, useMemo } from 'react';
import { View, Text, Image, StyleSheet } from 'react-native';


function gravatarUrl(email) {
  if (!email) return null;
  const norm = email.trim().toLowerCase();
  const hash = Crypto ? Crypto.digestStringAsync(Crypto.CryptoDigestAlgorithm.MD5, norm) : null;
  // Note: digestStringAsync is async; for simplicity we won’t await it here.
  // If you want gravatar, precompute hash and pass as prop instead.
  return null; // keep null by default to avoid async; see note above
}

export default function Avatar({
  size = 64,
  uri,        // prefer this if provided by backend
  initials = 'U',
  email,      // optional: to generate gravatar if you want later
  ring = true // show a subtle ring like your design
}) {
  const [failed, setFailed] = useState(false);

  // If you decide to enable gravatar, replace null with computed URL
  const fallbackUri = null; // gravatarUrl(email);
  const sourceUri = !failed && (uri || fallbackUri) ? { uri: uri || fallbackUri } : null;

  return (
    <View style={[styles.wrap, ring && styles.ring, { width: size, height: size, borderRadius: size }]}>
      {sourceUri ? (
        <Image
          source={sourceUri}
          style={{ width: size, height: size, borderRadius: size }}
          onError={() => setFailed(true)}
          accessibilityLabel="User avatar"
        />
      ) : (
        <View style={[styles.fallback, { width: size, height: size, borderRadius: size }]}>
          <Text style={[styles.initials, { fontSize: Math.max(18, size * 0.35) }]}>{initials}</Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { overflow: 'hidden' },
  ring: {
    borderWidth: 2,
    borderColor: '#e5e7eb', // light ring like in your mock
  },
  fallback: {
    backgroundColor: '#0f172a',
    alignItems: 'center',
    justifyContent: 'center',
  },
  initials: { color: '#fff', fontWeight: '700' },
});
