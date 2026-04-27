import { Header, IconButton, NavBar } from "@/components/components";
import { Tabs, router } from "expo-router";
import React, { useMemo } from "react";
import { View } from "react-native";

import { NavItem } from "@/components/Layout/NavBar/navbar";
import { useStylesMain } from "@/styles/main.style";
// 1. Importe o seu hook de tema
import { useTheme } from "@/context/ThemeContext";

type Tab = "home" | "message" | "Perfil/Perfil" | "Search/search";

export default function TabLayout() {
  const stylesMain = useStylesMain();
  const { colors } = useTheme();

  const navItems: NavItem<Tab>[] = useMemo(
    () => [
      { id: "home", label: "Início", icon: "home" },
      { id: "Search/search", label: "Buscar", icon: "search" },
      { id: "message", label: "Mensagens", icon: "message" },
      { id: "Perfil/Perfil", label: "Perfil", icon: "profile" },
    ],
    [],
  );

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        sceneStyle: {
          backgroundColor: colors.background,
        },
      }}
      tabBar={({ state, navigation }) => {
        const currentRoute = state.routeNames[state.index] as Tab;

        return (
          <View style={stylesMain.footerContainer}>
            <NavBar<Tab>
              items={navItems}
              activeId={currentRoute}
              onPress={(tabId) => {
                navigation.navigate(tabId);
              }}
            />

            <View style={stylesMain.floatingButton}>
              <IconButton
                size={56}
                circle={false}
                icon="post"
                type="fill"
                onPress={() => router.push("/newPost")}
              />
            </View>
          </View>
        );
      }}
    >
      <Tabs.Screen
        name="home"
        options={{
          headerShown: true,
          header: () => <Header />,
        }}
      />

      <Tabs.Screen name="Search/search" options={{ headerShown: false }} />

      <Tabs.Screen
        name="message"
        options={{
          headerShown: true,
          header: () => <Header />,
        }}
      />

      <Tabs.Screen name="Perfil/Perfil" options={{ headerShown: false }} />
    </Tabs>
  );
}
