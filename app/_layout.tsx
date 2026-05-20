import { LanguageProvider } from "@/context/LanguageContext";
import { LoadingProvider } from "@/context/loadingContext";
import { SignalRProvider } from "@/context/NotificationsContext";
import { ThemeProvider, useTheme } from "@/context/ThemeContext";
import { Stack } from "expo-router";

import {
  configureReanimatedLogger,
  ReanimatedLogLevel,
} from "react-native-reanimated";

configureReanimatedLogger({
  level: ReanimatedLogLevel.warn,
  strict: false,
});

function AppStack() {
  const { colors } = useTheme();

  return (
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
    </Stack>
  );
}

export default function Layout() {
  return (
    <LoadingProvider>
      <ThemeProvider>
        <LanguageProvider>
          <SignalRProvider>
            <AppStack />
          </SignalRProvider>
        </LanguageProvider>
      </ThemeProvider>
    </LoadingProvider>
  );
}
