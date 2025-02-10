//This file contains the settings screen where the user can edit his profile, change his password, edit his preferences, enable or disable notifications and logout

import colors from '@/constants/colors';
import React from 'react';
import { View, ScrollView, StyleSheet, Alert, Platform } from 'react-native';
import { Text, Switch, List, Divider } from 'react-native-paper';
import { useRouter, Stack } from "expo-router";
import globalStyles from '@/assets/style/globalStylesheet';
import AsyncStorage from '@react-native-async-storage/async-storage';

const SettingsScreen = () => {
  const router = useRouter();
  const [isNotificationsEnabled, setNotificationsEnabled] = React.useState(true);

  const toggleNotifications = () => setNotificationsEnabled(!isNotificationsEnabled);

  const handleLogout = () => {
    Alert.alert('Logout', 'Are you sure you want to log out?', [
      {
        text: 'Cancel',
        onPress: () => console.log('Cancel Pressed'),
        style: 'cancel',
      },
      {
        text: 'Yes', onPress: () => Logout(),

      },
    ]);
  }
  const apiBaseUrl = Platform.OS === 'android' ? 'http://10.0.2.2:8000' : 'http://localhost:8000';

  const Logout = async () => {
    console.log('Yes Pressed');
    try {

      const token = await AsyncStorage.getItem('authToken');

      const response = await fetch(`${apiBaseUrl}/session/logout/`, {
        method: 'POST',
        headers: {
          'Authorization': `Token ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        console.log('Logged out successfully');
        await AsyncStorage.removeItem('authToken');
        await AsyncStorage.removeItem('userInfo');
        router.push('/welcome');
      } else {
        console.error('Logout failed');
        Alert.alert('Logout Failed', 'Unable to log out. Please try again.');
      }
    } catch (error) {
      console.error('Error during logout:', error);
      Alert.alert('Error', 'An error occurred while trying to log out.');
    }
  };

  return (
    <ScrollView style={globalStyles.containerSettings}>
      <Stack.Screen options={{ title: "Settings" }} />

      {/* Account Section */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Account</Text>
        <Divider style={styles.divider} />
        <List.Item
          title="Edit profile"
          left={(props) => <List.Icon {...props} icon="account-edit" />}
          right={() => <List.Icon icon="chevron-right" />}
          onPress={() => router.push("/profile")}
        />
        <List.Item
          title="Change password"
          left={(props) => <List.Icon {...props} icon="lock-reset" />}
          right={() => <List.Icon icon="chevron-right" />}
          onPress={() => router.push("/editPassword")}

        />
        <List.Item
          title="Your preferences"
          left={(props) => <List.Icon {...props} icon="cog" />}
          right={() => <List.Icon icon="chevron-right" />}
          onPress={() => router.push("/editPreferences")}
        />
      </View>

      {/* Notifications Section */}
      {/* Still need to add permission logic but notifications don't work on emulators*/}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Notifications</Text>
        <Divider style={styles.divider} />
        <List.Item
          title="Allow notifications"
          left={(props) => <List.Icon {...props} icon="bell" />}
          right={() => (
            <Switch
              value={isNotificationsEnabled}
              onValueChange={toggleNotifications}
              color={colors.darkGreen}
            />
          )}
        />
      </View>

      <View style={styles.section}>
        <List.Item
          title="Logout"
          onPress={handleLogout}
          left={(props) => <List.Icon {...props} icon="logout" />}
        />
      </View>

    </ScrollView>
  );
};

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  container: {
    flex: 1,
    backgroundColor: colors.white,
    paddingHorizontal: 16,
  },
  titleText: {
    fontSize: 25,
    fontWeight: 'bold',
    marginVertical: 40,
    color: colors.darkGreen,
  },
  section: {
    marginBottom: 24,
    backgroundColor: colors.veryLightGrey,
    borderRadius: 10,
    padding: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
    color: colors.darkGrey,
  },
  divider: {
    marginVertical: 8,
  },
});

export default SettingsScreen;