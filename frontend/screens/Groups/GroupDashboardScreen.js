import React from 'react';
import { View, StyleSheet, useWindowDimensions, ScrollView, Platform } from 'react-native';
import DashboardSidebar from './DashboardSidebar';
import DashboardHeader from './DashboardHeader';
import DashboardMain from './DashboardMain';

const GroupDashboardScreen = () => {
  const { width } = useWindowDimensions();
  const isMobile = Platform.OS !== 'web' || width < 768;

  return (
    <View style={styles.wrapper}>
      {/* Desktop Sidebar */}
      {!isMobile && (
        <View style={styles.sidebarWrapper}>
          <DashboardSidebar />
        </View>
      )}

      {/* Main Content */}
      <View style={styles.contentWrapper}>
        {/* Mobile Sidebar */}
        {isMobile && (
          <View style={styles.mobileMenu}>
            <DashboardSidebar />
          </View>
        )}

        <DashboardHeader />

        <ScrollView contentContainerStyle={styles.mainScroll}>
          <DashboardMain role="Admin" />
        </ScrollView>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    flexDirection: 'row',
    flex: 1,
    backgroundColor: '#fff',
  },
  sidebarWrapper: {
    width: 220,
    borderRightWidth: 1,
    borderColor: '#ccc',
  },
  contentWrapper: {
    flex: 1,
    flexDirection: 'column',
  },
  mobileMenu: {
    borderBottomWidth: 1,
    borderColor: '#ccc',
    paddingBottom: 6,
  },
  mainScroll: {
    padding: 12,
    flexGrow: 1,
  },
});

export default GroupDashboardScreen;
