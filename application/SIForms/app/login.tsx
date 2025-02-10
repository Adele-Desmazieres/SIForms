import { useState } from "react";
import { View, StyleSheet, Text, Keyboard, TouchableOpacity, KeyboardAvoidingView, TouchableWithoutFeedback, Platform, ScrollView } from "react-native";
import { useRouter, Stack } from "expo-router";
import CustomTextInput from "../components/customTextInput";
import CustomButton from "../components/customButton";
import colors from "../constants/colors";
import globalStyles from '@/assets/style/globalStylesheet';
import AsyncStorage from '@react-native-async-storage/async-storage';


const Login = () => {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState(null);

  const apiBaseUrl = Platform.OS === 'android' ? 'http://10.0.2.2:8000' : 'http://localhost:8000';

  const hardcodedForms = [
    { id: "1", site: "Building 142", type: "Information on the electrical network and its equipment", status: "submitted", date: '01/12/2025' },
    { id: "2", site: "Jussieu", type: "Information on the electrical network and its equipment", status: "draft", date: "01/11/2025" },
    { id: "3", site: "Centre", type: "Information on the electrical network and its equipment", status: "submitted", date: "12/03/2024" },
];
  const handleLogin = async () => {
      if (!email || !password) {
        setErrorMessage("Email and password are required.");
        return;
      }
  
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
        
        await AsyncStorage.setItem('authToken', token);
        await AsyncStorage.setItem('userInfo', JSON.stringify(userInfo)); 
        console.log("Stored userInfo after login:", userInfo);
        console.log("Token stored:", token);
       
        await AsyncStorage.setItem("forms", JSON.stringify(hardcodedForms));
        console.log("Stored forms:", hardcodedForms);
        
        router.push("/formsList"); 
      } catch (error) {
        setErrorMessage(error.message);
        console.error("Login error:", error);
      }
    
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
          <View style={styles.container}>
          <Stack.Screen options={{ headerShown: false }} />
            <Text style={styles.titleText}>Log in</Text>

            <View style={globalStyles.inputContainerLoginCreate}>
              <CustomTextInput
                label="Enter your email address"
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                leftIcon="at"
              />
              <CustomTextInput
                label="Enter your password"
                value={password}
                onChangeText={setPassword}
                secureTextEntry
                leftIcon="lock-outline"
              />
            </View>

            {errorMessage && <Text style={globalStyles.errorText}>{errorMessage}</Text>}

            <TouchableOpacity >
              <Text style={globalStyles.linkText}>Forgot your password?</Text>
            </TouchableOpacity>

            <CustomButton
              title="Log in"
              onPress={handleLogin}
              color={colors.lightGreen}
              textColor={colors.white}
              labelStyle={{ fontSize: 18 }}
              style={{ marginTop: 40, }}
            />

            <Text style={globalStyles.footerText}>Don't have an account?</Text>
            <TouchableOpacity onPress={() => router.push("/createAccount")}>
              <Text style={globalStyles.linkText}>Sign Up</Text>
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
    backgroundColor: colors.white,
    padding: 25,
  },

  titleText: {
    fontSize: 38,
    fontWeight: "bold",
    color: colors.lightGreen,
    marginVertical: 40,
    alignSelf: "flex-start",
  },

});

export default Login;
