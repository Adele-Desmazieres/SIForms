import { useState } from "react";
import { View, StyleSheet, Text, TextInput, Keyboard, TouchableOpacity, TouchableWithoutFeedback, Platform, KeyboardAvoidingView, ScrollView } from "react-native";
import { CameraView, CameraType, useCameraPermissions } from "expo-camera";
import { Divider, IconButton } from "react-native-paper";
import { LinearGradient } from "expo-linear-gradient";
import CustomButton from "../components/customButton";
import colors from "../constants/colors";
import { useRouter, Stack } from "expo-router";
import ArrowButton from "@/components/arrowButton";

const QRScreen = () => {
  const router = useRouter();
  const [facing, setFacing] = useState<CameraType>("back");
  const [permission, requestPermission] = useCameraPermissions();
  const [isCameraEnabled, setIsCameraEnabled] = useState(false);
  const [link, setLink] = useState('');

  // if (!permission) {
  //   return <View />;
  // }

  // if (!permission.granted) {
  //   return (
  //     <View style={styles.permissionContainer}>
  //       <Text style={styles.message}>We need your permission to show the camera</Text>
  //       <CustomButton
  //         title="Grant Permission"
  //         onPress={requestPermission}
  //         color={colors.darkGreen}
  //         textColor={colors.white}
  //       />
  //     </View>
  //   );
  // }

  const handleScanPress = async () => {
    if (!permission || !permission.granted) {
      const result = await requestPermission();
      if (!result.granted) {
        console.log("Permission not granted");
        return;
      }
    }
    setIsCameraEnabled(true);
    console.log("Camera enabled");
  };

  const toggleCameraFacing = () => {
    setFacing((current) => (current === "back" ? "front" : "back"));
  };

  const handleLinkSubmit = () => {
    console.log("Link submitted: ", link);
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
            <Stack.Screen options={{ title: "New Site" }} />
            {/* Camera Section */}

            <View style={styles.scanLinkContainer}>
              <IconButton
                icon="qrcode-scan"
                size={40}
                style={styles.Icon}
                iconColor={colors.darkGrey}
              />
              <Text style={styles.linkQrText}>Scan QR Code</Text>
              <View style={styles.cameraWrapper}>
                {isCameraEnabled ? (
                  <CameraView style={styles.camera} facing={facing} />
                ) : (
                  <LinearGradient
                    colors={["rgba(187, 245, 106, 0.7)", "rgba(83, 116, 33, 0.12)"]}
                    style={styles.cameraGradient} >
                    <Text style={styles.disabledText}>Camera is disabled. {'\n'} Click on the button below</Text>
                  </LinearGradient>
                )}
              </View>
              {/* <IconButton
            icon="camera-flip-outline"
            size={25}
            style={styles.Icon}
            iconColor={colors.darkGrey}
            onPress={toggleCameraFacing}
            />  */}
              <CustomButton
                title="Scan"
                onPress={() => handleScanPress()}
                color={colors.lightGreen}
                textColor={colors.white}
                labelStyle={{ fontSize: 18 }}
                style={styles.scanButton}
              />
            </View>

            {/* Divider */}
            <View style={styles.dividerContainer}>
              <Divider style={styles.divider} />
              <Text style={styles.orText}>OR</Text>
              <Divider style={styles.divider} />
            </View>

            {/* Use Link Section */}
            <View style={styles.scanLinkContainer} >
              <IconButton
                icon="link-variant"
                size={40}
                style={styles.Icon}
                iconColor={colors.darkGrey}
              />
              <Text style={styles.linkQrText}>Use Link</Text>
              <View style={styles.inputRow}>
                <TextInput
                  style={styles.input}
                  value={link}
                  onChangeText={setLink}
                  placeholder="Enter your link here"
                  keyboardType="url"
                // onSubmitEditing={Keyboard.dismiss}
                />
                <ArrowButton onPress={handleLinkSubmit} />
              </View>
            </View>
            {/* Add the logic to show the "No code" link if already authenticated */}
            {/* Divider */}
            <View style={styles.dividerContainer}>
              <Divider style={styles.divider} />
              <Text style={styles.orText}>OR</Text>
              <Divider style={styles.divider} />
            </View>
            <TouchableOpacity onPress={() => router.push("/chooseForm")}>
              <Text style={styles.noCode}>Empty form</Text>
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
    paddingVertical: 20,
    alignItems: "center",
    justifyContent: "space-around",
  },
  permissionContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  message: {
    textAlign: "center",
    marginBottom: 20,
    color: colors.darkGreen,
    fontSize: 16,
  },
  cameraWrapper: {
    width: "70%",
    aspectRatio: 1,
    borderRadius: 20,
    overflow: "hidden",
    backgroundColor: colors.lightGrey,
    marginBottom: 5,
  },
  camera: {
    flex: 1,
  },
  cameraGradient: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  scanButton: {
    marginTop: 10,
  },
  dividerContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  divider: {
    flex: 0.40,
    height: 1,
    backgroundColor: colors.lightGrey,
  },
  orText: {
    marginHorizontal: 10,
    color: colors.lightGrey,
    fontSize: 16,
    fontWeight: "bold",
  },

  Icon: {
    alignSelf: "center",
  },

  linkQrText: {
    fontSize: 18,
    color: colors.darkGrey,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 10,
  },
  inputRow: {
    flexDirection: "row",
    alignItems: "center",
    width: "90%",
  },
  input: {
    flex: 1,
    backgroundColor: colors.white,
    borderColor: colors.white,
    borderWidth: 1,
    borderRadius: 25,
    height: 50,
    paddingHorizontal: 15,
    fontSize: 16,
    color: colors.darkGrey,
  },
  scanLinkContainer: {
    alignItems: "center",
    backgroundColor: colors.veryLightGrey,
    height: "auto",
    width: "85%",
    padding: 15,
    borderRadius: 20,
  },


  disabledText: {
    color: colors.white,
    fontSize: 16,
    textAlign: "center",
  },
  noCode: {
    color: colors.darkGreen,
    fontSize: 20,
    fontWeight: "bold",
    textDecorationLine: "underline",
    marginTop: 10,
  },

});

export default QRScreen;
