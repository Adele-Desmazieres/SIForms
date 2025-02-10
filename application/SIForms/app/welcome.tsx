import { View, StyleSheet, Text, Image } from "react-native";
import { useRouter, Stack } from "expo-router";
import { Divider, IconButton, TouchableRipple } from "react-native-paper";
import CustomButton from "../components/customButton";
import colors from "../constants/colors";

const WelcomePage = () => {
  const router = useRouter();
  return (
    <View style={styles.container}>
      <Stack.Screen options={{ headerShown: false }} />
      <View style={styles.logoContainer}>
        <IconButton
          icon="account-wrench-outline"
          size={90}
          style={styles.logoIcon}
          iconColor={colors.darkGreen}
        />
        <Text style={styles.title}>Welcome!</Text>
        <Text style={styles.subtitle}>to SIForms</Text>
      </View>

      {/* Button Section */}

      <CustomButton
        title="Log In"
        onPress={() => router.push("/login")}
        color={colors.darkGreen}
        textColor={colors.white}
        labelStyle={{ fontSize: 20, fontWeight: "bold" }}
        style={{ marginTop: 20, width: 300 }}
      />
      <CustomButton
        title="Sign Up"
        onPress={() => router.push("/createAccount")}
        color={colors.darkGreen}
        textColor={colors.white}
        labelStyle={{ fontSize: 20, fontWeight: "bold" }}
        style={{ marginTop: 30, width: 300 }}
      />

      {/* Divider */}
      <View style={styles.dividerContainer}>
        <Divider style={styles.divider} />
        <Text style={styles.orText}>OR</Text>
        <Divider style={styles.divider} />
      </View>

      {/* QR Code Section */}
      <View style={styles.qrContainer}>
        <Image
          source={require("../assets/images/qr-link-logo.png")}
          style={styles.qrIcon}
        />
        <TouchableRipple onPress={() => router.push("/scanQrLink")}>
          <Text style={styles.scanText}>Scan QR / Use Link</Text>
        </TouchableRipple>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.white,
    justifyContent: "center",
    alignItems: "center",
    padding: 10,
  },
  logoContainer: {
    alignItems: "center",
    marginBottom: 20,
  },
  logoIcon: {
    marginBottom: 7,
  },
  title: {
    fontSize: 42,
    fontWeight: "bold",
    color: colors.darkGreen,
  },
  subtitle: {
    fontSize: 30,
    fontWeight: "bold",
    color: colors.darkGreen,
    marginTop: -10,
  },

  dividerContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 40,
  },
  divider: {
    flex: 0.4,
    height: 1.5,
    backgroundColor: colors.lightGreen,
  },
  orText: {
    marginHorizontal: 10,
    color: colors.lightGreen,
    fontSize: 16,
    fontWeight: "bold",
  },
  qrContainer: {
    alignItems: "center",
  },
  qrIcon: {
    width: 50,
    height: 78,
    marginBottom: 20,
  },

  scanText: {
    color: colors.darkGreen,
    fontSize: 20,
    fontWeight: "bold",
    textDecorationLine: "underline",
  },
});

export default WelcomePage;
