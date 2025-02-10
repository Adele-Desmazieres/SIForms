import React, { useEffect, useState } from "react";
import { View, StyleSheet, KeyboardAvoidingView, TextInput, Platform, ScrollView, Keyboard, TouchableWithoutFeedback } from "react-native";
import { Text, Avatar, } from "react-native-paper";
import colors from "../constants/colors";
import CustomButton from "../components/customButton";
import { useRouter, Stack } from "expo-router";
import globalStyles from '@/assets/style/globalStylesheet';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useSnackbar } from '../context/SnackbarProvider';

const EditProfileScreen = () => {
  const router = useRouter();
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const { showSnackbar } = useSnackbar();

  useEffect(() => {
    const fetchUserInfo = async () => {
      const userInfoString = await AsyncStorage.getItem('userInfo');
      if (userInfoString) {
        const userInfo = JSON.parse(userInfoString);
        setFirstName(userInfo.first_name || "");
        setLastName(userInfo.last_name || "");
        setEmail(userInfo.email || "");
        setPhone(userInfo.phone || "");
      }
    };

    fetchUserInfo();
  }, []);
  const apiBaseUrl = Platform.OS === 'android' ? 'http://10.0.2.2:8000' : 'http://localhost:8000';
  const handleSaveChanges = async () => {
    try {
      const token = await AsyncStorage.getItem('authToken');
      const response = await fetch(`${apiBaseUrl}/accounts/edit-profile/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Token ${token}`,
        },
        body: JSON.stringify({
          first_name: firstName,
          last_name: lastName,
          email: email,
          phone: phone,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        console.log("Profile saved!");
        showSnackbar('Profile saved successfully', colors.darkGreen);
        // Mettre à jour les informations dans AsyncStorage
        await AsyncStorage.setItem('userInfo', JSON.stringify(data.user));
        router.replace("/profile");
      } else {
        console.error("Error saving profile:", data.error);
        showSnackbar('Failed to save profile', colors.darkRed);
      }
    } catch (error) {
      console.error("Error saving profile:", error);
      showSnackbar('Failed to save profile', colors.darkRed);
    }
  };
  const handleCancelChanges = () => {
    console.log("Cancelled changes!");
    router.replace("/profile");
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <ScrollView
          contentContainerStyle={{ flexGrow: 1 }}
          keyboardShouldPersistTaps="handled"
        >
          <View style={globalStyles.containerSettings}>
            <Stack.Screen options={{ title: "Edit Profile" }} />
            <Avatar.Icon
              size={87}
              icon="account-edit"
              color={colors.white}
              style={globalStyles.avatarIcon}
            />
            <Text style={globalStyles.titleSettings}>Account information</Text>

            <View style={globalStyles.infoContainerProfile}>
              <Text style={globalStyles.fieldTitle}>First Name</Text>
              <TextInput
                style={styles.input}
                value={firstName}
                onChangeText={setFirstName}
              // theme={textInputTheme}
              />
              <Text style={globalStyles.fieldTitle}>Last Name</Text>
              <TextInput
                style={styles.input}
                value={lastName}
                onChangeText={setLastName}
              // theme={textInputTheme}
              />
              <Text style={globalStyles.fieldTitle}>Email</Text>
              <TextInput
                style={styles.input}
                value={email}
                onChangeText={setEmail}
              // theme={textInputTheme}
              />
              <Text style={globalStyles.fieldTitle}>Phone Number</Text>
              <TextInput
                style={styles.input}
                value={phone}
                onChangeText={setPhone}
              // theme={textInputTheme}
              />

            </View>

            {/* // Save and Cancel buttons */}
            <View style={styles.rowContainer}>
              <CustomButton
                title="Cancel"
                onPress={handleCancelChanges}
                color={colors.darkRed}
                textColor={colors.white}
                labelStyle={{ fontSize: 18 }}
              />
              <CustomButton
                title="Save"
                onPress={handleSaveChanges}
                color={colors.lightGreen}
                textColor={colors.white}
                labelStyle={{ fontSize: 18 }}
              />
            </View>
          </View>
        </ScrollView>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({

  input: {
    fontSize: 16,
    color: colors.darkGrey,
    backgroundColor: colors.white,
    marginBottom: 20,
    marginTop: 5,
    height: 50,
    padding: 15,
    borderRadius: 10,
  },

  rowContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
    paddingHorizontal: 30,
  },
});

export default EditProfileScreen;