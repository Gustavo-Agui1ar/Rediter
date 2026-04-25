import { LoadingProvider } from "@/context/loadingContext";
import { ThemeProvider, useTheme } from "@/context/ThemeContext";
import { Stack } from "expo-router";

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
      <Stack.Screen name="register" />
      <Stack.Screen name="verify" />
      <Stack.Screen name="main" />
      <Stack.Screen name="configs" />
      <Stack.Screen name="forgotPassword" />
      <Stack.Screen name="newPost" />
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
