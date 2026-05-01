import { LoadingProvider } from "@/context/loadingContext";
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
      initialRouteName="Index"
      screenOptions={{
        headerShown: false,
        contentStyle: { backgroundColor: colors.background },
      }}
    >
      <Stack.Screen name="Index" />
      <Stack.Screen name="register" />
      <Stack.Screen name="verify" />
      <Stack.Screen name="Configs" />
      <Stack.Screen name="forgotPassword" />
      <Stack.Screen name="NewPost" />
      <Stack.Screen name="sendEmail" />
    </Stack>
  );
}

export default function Layout() {
  return (
    <LoadingProvider>
      <ThemeProvider>
        <AppStack />
      </ThemeProvider>
    </LoadingProvider>
  );
}
