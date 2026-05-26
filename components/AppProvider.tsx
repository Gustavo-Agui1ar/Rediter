import React from "react";

import { LanguageProvider } from "@/context/LanguageContext";
import { LoadingProvider } from "@/context/LoadingContext";
import { SignalRProvider } from "@/context/NotificationsContext";
import { RediterConfigProvider } from "@/context/RediterConfigContext";
import { ThemeProvider } from "@/context/ThemeContext";
import { SafeAreaProvider } from "react-native-safe-area-context";

export function AppProviders({ children }: { children: React.ReactNode }) {
  return (
    <SafeAreaProvider>
      <RediterConfigProvider>
        <LoadingProvider>
          <ThemeProvider>
            <LanguageProvider>
              <SignalRProvider>{children}</SignalRProvider>
            </LanguageProvider>
          </ThemeProvider>
        </LoadingProvider>
      </RediterConfigProvider>
    </SafeAreaProvider>
  );
}
