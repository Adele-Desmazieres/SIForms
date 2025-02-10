import CustomButton from '@/components/customButton';
import colors from '@/constants/colors';
import React, { useState } from 'react';
import { View, Text, StyleSheet, KeyboardAvoidingView, Platform, ScrollView, Keyboard, TouchableWithoutFeedback } from 'react-native';
import { TextInput, Avatar, Snackbar } from 'react-native-paper';
import globalStyles from '@/assets/style/globalStylesheet';
import { useSnackbar } from '../context/SnackbarProvider';
import { Stack } from 'expo-router';

const ChangePasswordScreen = () => {
  const [currentPasswordVisible, setCurrentPasswordVisible] = useState(false);
  const [newPasswordVisible, setNewPasswordVisible] = useState(false);
  const [retypePasswordVisible, setRetypePasswordVisible] = useState(false);
  const { showSnackbar } = useSnackbar();

  const handleResetPassword = () => {
    // if ok show snackbar that a link was sent to the email
    // else show error message saying that the email is not valid and doesn't have an account in the system
    // setSnackbarMessage('Reset link sent successfully!');
    // setSnackbarVisible(true);

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
      <Stack.Screen options={{ title: "Forgot Password" }} />

      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <ScrollView
          contentContainerStyle={{ flexGrow: 1 }}
          keyboardShouldPersistTaps="handled"
        >
          <View style={globalStyles.containerSettings}>
            <Avatar.Icon
              size={87}
              icon="lock-question"
              color={colors.white}
              style={globalStyles.avatarIcon}
            />
            <Text style={globalStyles.titleSettings}>Forgot your password?</Text>
            <Text style={globalStyles.description}>
              Enter the email address associated with this account and we will send you a link to reset your password.
            </Text>


            <TextInput
              style={styles.input}
              label="Enter your email address"
              keyboardType="email-address"
              theme={textInputTheme}
            />

            <View>
              <CustomButton
                title="Send"
                onPress={handleResetPassword}
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