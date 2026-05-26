import { AppProviders } from "@/components/AppProvider";
import { useTheme } from "@/context/ThemeContext";
import { Stack } from "expo-router";

import {
  configureReanimatedLogger,
  ReanimatedLogLevel,
} from "react-native-reanimated";

import { SafeAreaView } from "react-native-safe-area-context";

configureReanimatedLogger({
  level: ReanimatedLogLevel.warn,
  strict: false,
});

function AppStack() {
  const { colors } = useTheme();

  return (
    <SafeAreaView
      style={{
        flex: 1,
        backgroundColor: colors.background,
      }}
      edges={["top", "bottom"]}
    >
      <Stack
        screenOptions={{
          headerShown: false,
          contentStyle: { backgroundColor: colors.background },
        }}
      >
        <Stack.Screen name="index" />
        <Stack.Screen name="Register" />
        <Stack.Screen name="Verify" />
        <Stack.Screen name="Configs" />
        <Stack.Screen name="forgotPassword" />
        <Stack.Screen name="NewPost" />
        <Stack.Screen name="sendEmail" />
        <Stack.Screen name="BlockedUsers" />
        <Stack.Screen name="profile/[id]" />
        <Stack.Screen name="posts/[id]" />
        <Stack.Screen name="Message" />
      </Stack>
    </SafeAreaView>
  );
}

export default function Layout() {
  return (
    <AppProviders>
      <AppStack />
    </AppProviders>
  );
}
