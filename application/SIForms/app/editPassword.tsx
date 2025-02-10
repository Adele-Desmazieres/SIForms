import CustomButton from '@/components/customButton';
import colors from '@/constants/colors';
import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, KeyboardAvoidingView, Platform, ScrollView, Keyboard, TouchableWithoutFeedback } from 'react-native';
import { TextInput, Avatar } from 'react-native-paper';
import globalStyles from '@/assets/style/globalStylesheet';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Link, Stack } from 'expo-router';
import { useSnackbar } from '../context/SnackbarProvider';

const ChangePasswordScreen = () => {
  const [currentPasswordVisible, setCurrentPasswordVisible] = useState(false);
  const [newPasswordVisible, setNewPasswordVisible] = useState(false);
  const [retypePasswordVisible, setRetypePasswordVisible] = useState(false);
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [retypePassword, setRetypePassword] = useState('');
  const { showSnackbar } = useSnackbar();

  const handleChangePassword = async () => {

    if (!currentPassword || !newPassword || !retypePassword) {
      showSnackbar('Please fill in all fields.', colors.darkRed);
      return;
    }

    if (newPassword !== retypePassword) {
      showSnackbar('New password and retype password do not match.', colors.darkRed);
      return;
    }

    try {
      const apiBaseUrl = Platform.OS === 'android' ? 'http://10.0.2.2:8000' : 'http://localhost:8000';

      const token = await AsyncStorage.getItem('authToken');
      const response = await fetch(`${apiBaseUrl}/accounts/change-password/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Token ${token}`,
        },
        body: JSON.stringify({
          old_password: currentPassword,
          new_password: newPassword,
        }),
      });
      if (response.status === 200) {
        showSnackbar('Password changed successfully', colors.darkGreen);
        setCurrentPassword('');
        setNewPassword('');
        setRetypePassword('');
      }
    } catch (error) {
      //Alert.alert('Error', 'Failed to change password');
      showSnackbar('Failed to change password', colors.darkRed);
    }
  };

  const textInputTheme = {
    colors: {
      primary: colors.darkGreen,
    },
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
            <Stack.Screen options={{ title: "Change password" }} />
            <Avatar.Icon
              size={87}
              icon="lock-reset"
              color={colors.white}
              style={globalStyles.avatarIcon}
            />
            <Text style={globalStyles.titleSettings}>Update your password</Text>
            <Text style={globalStyles.description}>
              Your password must be at least 8 characters long.
            </Text>

            <TextInput
              label="Current password"
              secureTextEntry={!currentPasswordVisible}
              right={
                <TextInput.Icon
                  icon={currentPasswordVisible ? 'eye' : 'eye-off'}
                  onPress={() => setCurrentPasswordVisible(!currentPasswordVisible)}
                />}
              style={styles.input}
              theme={textInputTheme}
              value={currentPassword}
              onChangeText={setCurrentPassword}
            />
            <TextInput
              label="New password"
              secureTextEntry={!newPasswordVisible}
              right={
                <TextInput.Icon
                  icon={newPasswordVisible ? 'eye' : 'eye-off'}
                  onPress={() => setNewPasswordVisible(!newPasswordVisible)}
                />}
              style={styles.input}
              theme={textInputTheme}
              value={newPassword}
              onChangeText={setNewPassword}
            />
            <TextInput
              style={styles.input}
              label="Retype new password"
              secureTextEntry={!retypePasswordVisible}
              right={
                <TextInput.Icon
                  icon={retypePasswordVisible ? 'eye' : 'eye-off'}
                  onPress={() => setRetypePasswordVisible(!retypePasswordVisible)}
                />
              }
              theme={textInputTheme}
              value={retypePassword}
              onChangeText={setRetypePassword}
            />

            <TouchableOpacity >
              <Link href="/forgotPassword"
                style={globalStyles.linkText}>Forgot your password?
              </Link>
            </TouchableOpacity>
            <View>
              <CustomButton
                title="Modify"
                onPress={handleChangePassword}
                color={colors.lightGreen}
                textColor={colors.white}
                labelStyle={{ fontSize: 18 }}
                style={globalStyles.modifyButton} />
            </View>
          </View>
        </ScrollView>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.white,
    padding: 20,
    justifyContent: 'center',
  },

  input: {
    backgroundColor: colors.inputGrey,
    marginBottom: 20,
  },
});

export default ChangePasswordScreen;