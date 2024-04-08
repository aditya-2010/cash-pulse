import Colors from "@/constants/Colors";
import { ClerkProvider, useAuth } from "@clerk/clerk-expo";
import { Ionicons } from "@expo/vector-icons";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import { useFonts } from "expo-font";
import { Link, Stack, useRouter } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { useEffect } from "react";
import { TouchableOpacity } from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import * as SecureStore from "expo-secure-store";

const CLERK_PUBLISHABLE_KEY = process.env.EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY;

const tokenCache = {
  async getToken(key: string) {
    try {
      return SecureStore.getItemAsync(key);
    } catch (err) {
      return null;
    }
  },
  async saveToken(key: string, value: string) {
    try {
      return SecureStore.setItemAsync(key, value);
    } catch (err) {
      return;
    }
  },
};

export {
  // Catch any errors thrown by the Layout component.
  ErrorBoundary,
} from "expo-router";

export const unstable_settings = {
  // Ensure that reloading on `/modal` keeps a back button present.
  initialRouteName: "(tabs)",
};

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

function RootLayout() {
  const router = useRouter();

  const { isLoaded, isSignedIn } = useAuth();

  const [loaded, error] = useFonts({
    SpaceMono: require("../assets/fonts/SpaceMono-Regular.ttf"),
    ...FontAwesome.font,
  });

  useEffect(() => {
    console.log("isSignIn", isSignedIn);
    // router.push("/login");
  }, [isSignedIn]);

  // Expo Router uses Error Boundaries to catch errors in the navigation tree.
  useEffect(() => {
    if (error) throw error;
  }, [error]);

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  if (!loaded) {
    return null;
  }

  return (
    <Stack>
      <Stack.Screen
        name="index"
        options={{
          headerShown: false,
          statusBarTranslucent: true,
        }}
      />

      <Stack.Screen
        name="signup"
        options={{
          title: "",
          headerBackTitle: "",
          statusBarStyle: "dark",
          headerStyle: { backgroundColor: Colors.background },
          headerShadowVisible: false,
          headerLeft: () => (
            <TouchableOpacity onPress={router.back}>
              <Ionicons name="arrow-back" size={34} />
            </TouchableOpacity>
          ),
        }}
      />

      <Stack.Screen
        name="login"
        options={{
          title: "",
          headerBackTitle: "",
          statusBarStyle: "dark",
          headerStyle: { backgroundColor: Colors.background },
          headerShadowVisible: false,
          headerLeft: () => (
            <TouchableOpacity onPress={router.back}>
              <Ionicons name="arrow-back" size={34} />
            </TouchableOpacity>
          ),
          headerRight: () => (
            <Link href={"/help"} asChild>
              <TouchableOpacity>
                <Ionicons name="help-circle-outline" size={34} />
              </TouchableOpacity>
            </Link>
          ),
        }}
      />

      <Stack.Screen name="help" options={{ presentation: "modal" }} />

      <Stack.Screen
        name="verify/[phone]"
        options={{
          title: "",
          headerBackTitle: "",
          statusBarStyle: "dark",
          headerStyle: { backgroundColor: Colors.background },
          headerShadowVisible: false,
          headerLeft: () => (
            <TouchableOpacity onPress={router.back}>
              <Ionicons name="arrow-back" size={34} />
            </TouchableOpacity>
          ),
        }}
      />
    </Stack>
  );
}

export default function RootLayoutNav() {
  return (
    <ClerkProvider
      publishableKey={CLERK_PUBLISHABLE_KEY!}
      tokenCache={tokenCache}
    >
      <GestureHandlerRootView style={{ flex: 1 }}>
        <RootLayout />
      </GestureHandlerRootView>
    </ClerkProvider>
  );
}
