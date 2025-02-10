import { useState } from "react";
import { View, StyleSheet, Text, KeyboardAvoidingView, Platform, ScrollView, Keyboard, TouchableWithoutFeedback, TouchableOpacity } from "react-native";
import CustomTextInput from "../components/customTextInput";
import CustomButton from "../components/customButton";
import colors from "../constants/colors";
import { useRouter, Stack } from "expo-router";
import globalStyles from '@/assets/style/globalStylesheet';
import AsyncStorage from '@react-native-async-storage/async-storage';
// for icons https://pictogrammers.com/library/mdi/

const CreateAccount = () => {
  const router = useRouter();
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const apiBaseUrl = Platform.OS === 'android' ? 'http://10.0.2.2:8000' : 'http://localhost:8000';

  const handleCreateAccount = async (e) => {
    e.preventDefault();
  
    if (!firstName || !lastName || !email || !phone || !password || !confirmPassword) {
      setErrorMessage("Please fill in all fields.");
      return;
    }

    if (password !== confirmPassword) {
      setErrorMessage("Passwords do not match.");
      return;
    }

    setErrorMessage("");

    // Mettre à jour formData avec les valeurs actuelles des champs
    const updatedFormData = {
      email: email,
      first_name: firstName,
      last_name: lastName,
      password: password,
      phone: phone,
      lang: 'en', // ou une autre valeur si nécessaire
    };
    
    try {
      const response = await fetch(`${apiBaseUrl}/accounts/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updatedFormData),
      });
  
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'An error occurred.');
      }
    
      const responseData = await response.json();
      console.log(responseData.user);
      try {
        const response = await fetch(`${apiBaseUrl}/session/login/`, {
          method: 'POST',
          headers: {
            'content-Type': 'application/json',
          },
          body: JSON.stringify({
            email: email,
            password: password,
          }),
        });
  
        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || 'An error occurred.');
        }
  
        const responseData = await response.json();
        const token = responseData.token;
        const userInfo = responseData.user
        console.log(userInfo, JSON.stringify(userInfo))
        await AsyncStorage.setItem('authToken', token);
        await AsyncStorage.setItem('userInfo', JSON.stringify(userInfo)); 
        await AsyncStorage.setItem("forms", JSON.stringify([]));
        const a = await AsyncStorage.getItem('forms');
        
        console.log("Token stored:", token, a);
        
        
        router.push("/formsList"); 
      } catch (error) {
        setErrorMessage(error.message);
        console.error("Login error:", error);
      }
    
    } catch (error) {
      console.error(error);
      setErrorMessage(error.message);
      
    }
  };


  // show a warning if a field is missing or something is wrong
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
          <View style={styles.container}>
          <Stack.Screen options={{ headerShown: false }} />
            <Text style={styles.titleText}>Let's get {'\n'}started!</Text>

            <View style={globalStyles.inputContainerLoginCreate}>
              <View style={globalStyles.rowContainer}>
                <View style={styles.halfWidth}>
                  <CustomTextInput
                    label="First name"
                    value={firstName}
                    onChangeText={setFirstName}
                  />
                </View>
                <View style={styles.halfWidth}>
                  <CustomTextInput
                    label="Last name"
                    value={lastName}
                    onChangeText={setLastName}
                  />
                </View>
              </View>

              <CustomTextInput
                label="Enter your email address"
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                leftIcon="at"
              />
              <CustomTextInput
                label="Enter your phone number"
                value={phone}
                onChangeText={setPhone}
                keyboardType="phone-pad"
                leftIcon="pound"
              />
              <CustomTextInput
                label="Enter your password"
                value={password}
                onChangeText={setPassword}
                secureTextEntry
                leftIcon="lock-outline"
              />
              <CustomTextInput
                label="Confirm your password"
                value={confirmPassword}
                onChangeText={setConfirmPassword}
                secureTextEntry
                leftIcon="lock-check-outline"
              />
            </View>

            {errorMessage ? <Text style={globalStyles.errorText}>{errorMessage}</Text> : null}

            <CustomButton
              title="Create account"
              onPress={handleCreateAccount}
              color={colors.darkGreen}
              textColor={colors.white}
              labelStyle={{ fontSize: 18 }}
              style={{ marginTop: 40 }}
            />

            <Text style={globalStyles.footerText}>Already have an account?</Text>
            <TouchableOpacity onPress={() => router.push("/login")}>
              <Text style={globalStyles.linkText}>Log In</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.lightGreen,
    padding: 25,
  },

  titleText: {
    fontSize: 38,
    fontWeight: "bold",
    color: colors.white,
    marginVertical: 40,
    alignSelf: "flex-start",
  },

  halfWidth: {
    width: "48%",
  },
  buttonContainer: {
    marginTop: 40,
  },
});

export default CreateAccount;
