import React from "react";
import { StyleSheet, View } from "react-native";
import CreateAccount from "./createAccount";
import WelcomePage from "./welcome";
import Login from "./login";
import EditProfile from "./editProfile";
import ChangePasswordScreen from "./editPassword";
import EditPreferences from "./editPreferences";
import ProfileScreen from "./profile";
import Settings from "./settings";
import NoWifi from "./noWifi";
import ChooseForm from "./chooseForm";
import ListForms from "./formsList";
import ForgotPassword from "./forgotPassword";
import { SnackbarProvider } from "@/context/SnackbarProvider";
import DynamicForm from "./form";

// redirect to the correct screen based on if the user is already logged in
// if the user is logged in, redirect to the formsList screen else redirect to the welcome screen

export default function Index() {
  return (
    <View style={styles.container}>
      {/* <Login /> */}
      {/* <CreateAccount /> */}
      <WelcomePage/>
      {/* <DynamicForm  />  */}
      {/* <EditProfile/> */}
      {/* <ChangePasswordScreen/> */}
      {/* <EditPreferences/> */}
      {/* <ProfileScreen/> */}
      {/* <NoWifi/> */}
      {/* <ListForms /> */}
      {/* <ChooseForm/> */}
      {/* <Settings/> */}
      {/* <ForgotPassword/> */}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
