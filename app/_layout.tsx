import { LoadingProvider } from "@/context/loadingContext";
import { Colors } from "@/styles/theme";
import { Stack } from "expo-router";

export default function Layout() {
  return (
    <LoadingProvider>
      <Stack
        screenOptions={{
          headerShown: false,
          contentStyle: { backgroundColor: Colors.primary },
        }}
      >
        <Stack.Screen name="index" />
        <Stack.Screen name="register" />
        <Stack.Screen name="verify" />
        <Stack.Screen name="main" />
        <Stack.Screen name="configs" />
      </Stack>
    </LoadingProvider>
  );
}
