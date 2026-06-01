import React from "react";

import { AuthProvider } from "@/context/AuthContext";
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
        <AuthProvider>
          <LoadingProvider>
            <ThemeProvider>
              <LanguageProvider>
                <SignalRProvider>{children}</SignalRProvider>
              </LanguageProvider>
            </ThemeProvider>
          </LoadingProvider>
        </AuthProvider>
      </RediterConfigProvider>
    </SafeAreaProvider>
  );
}
