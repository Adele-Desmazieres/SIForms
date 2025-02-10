import { Stack, useRouter, useSegments } from "expo-router";
import { useState, useEffect } from "react";
import NetInfo from "@react-native-community/netinfo";
import { SnackbarProvider, useSnackbar } from "@/context/SnackbarProvider";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { ActivityIndicator, View } from "react-native";
import colors from "@/constants/colors";
// import { AuthProvider, useAuth } from "@/context/AuthContext";

export default function RootLayout() {
  return (
    <SnackbarProvider>
      <LayoutContent />
    </SnackbarProvider>
  );
}

function LayoutContent() {
  const router = useRouter();
  const segments = useSegments(); 
  const [isConnected, setConnected] = useState<boolean | null>(null);
  const [wasOffline, setWasOffline] = useState(false);
  const { showSnackbar } = useSnackbar();
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const checkAuth = async () => {
      const token = await AsyncStorage.getItem("authToken");
      setIsAuthenticated(!!token); // Convert token existence to boolean
      setLoading(false);
    };

    checkAuth();
  }, []);

  //  Redirect unauthenticated users to the welcome page
  useEffect(() => {
    if (!loading) {
      const publicRoutes = ["login", "createAccount", "forgotPassword", "index"]; // Pages accessible without authentication
      if (!isAuthenticated && !publicRoutes.includes(segments[0])) {
        router.replace("/login"); // Redirect unauthenticated users
      }
    }
  }, [isAuthenticated, loading, segments]);

  // Check for internet connection (display snackbar when connection is lost or restored)
  useEffect(() => {
    const unsubscribe = NetInfo.addEventListener((state) => {
      const online = !!state.isConnected && !!state.isInternetReachable;

      if (isConnected !== null && !online) {
        showSnackbar("You lost internet connection", colors.darkRed);
        setWasOffline(true);
      } else if (isConnected !== null && online && wasOffline) {
        showSnackbar("Internet connection restored", colors.darkGreen);
        setWasOffline(false);
      }
      setConnected(online);
    });

    return () => {
      unsubscribe();
    };
  }, [isConnected, wasOffline]);

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: colors.white }}>
        <ActivityIndicator size="large" color={colors.lightGreen} />
      </View>
    );
  }

  return <Stack />;
}
