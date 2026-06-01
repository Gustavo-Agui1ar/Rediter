import { IconButton, NavBar } from "@/components/components";
import { NavItem } from "@/components/Layout/NavBar/navbar";
import { useAuth } from "@/context/AuthContext"; // ✅ IMPORTADO
import { useLanguage } from "@/context/LanguageContext";
import { useSignalR } from "@/context/NotificationsContext";
import { useTheme } from "@/context/ThemeContext";
import { useStylesMain } from "@/styles/main.style";
import { Tabs, router } from "expo-router";
import { useCallback, useEffect, useMemo } from "react";
import { View } from "react-native";

type Tab = "home" | "message" | "Perfil" | "Search" | "Notifications" | "Admin";

export default function TabLayout() {
  const stylesMain = useStylesMain();
  const { colors } = useTheme();
  const { t } = useLanguage();
  const { isAdmin } = useAuth();

  const { unreadCount, clearUnreadCount, registerAndSendPushToken } =
    useSignalR();

  useEffect(() => {
    registerAndSendPushToken();
  }, [registerAndSendPushToken]);

  const navItems: NavItem<Tab>[] = useMemo(() => {
    const items: NavItem<Tab>[] = [
      { id: "home", label: t("tab_home"), icon: "home" },
      { id: "Search", label: t("tab_search"), icon: "search" },
      {
        id: "Notifications",
        label: t("tab_notifications"),
        icon: "notifications",
        badge: unreadCount > 0 ? unreadCount : undefined,
      },
      { id: "message", label: t("tab_messages"), icon: "message" },
      { id: "Perfil", label: t("tab_profile"), icon: "profile" },
    ];

    if (isAdmin) {
      items.push({
        id: "Admin",
        label: "Admin",
        icon: "shield",
      });
    }

    return items;
  }, [t, unreadCount, isAdmin]); // 'isAdmin' adicionado como dependência

  const handleNewPost = useCallback(() => {
    router.push("/NewPost");
  }, []);

  const renderTabBar = useCallback(
    ({ state, navigation }: any) => {
      const currentRoute = state.routeNames[state.index] as Tab;

      return (
        <View style={stylesMain.footerContainer}>
          <NavBar<Tab>
            items={navItems}
            activeId={currentRoute}
            onPress={(tabId) => {
              if (tabId === "Notifications") {
                clearUnreadCount();
              }
              navigation.navigate(tabId);
            }}
          />

          <View style={stylesMain.floatingButton}>
            <IconButton
              size={56}
              circle={false}
              icon="post"
              type="fill"
              onPress={handleNewPost}
            />
          </View>
        </View>
      );
    },
    [stylesMain, navItems, clearUnreadCount, handleNewPost],
  );

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        sceneStyle: {
          backgroundColor: colors.background,
        },
      }}
      tabBar={renderTabBar}
    >
      <Tabs.Screen name="home" />

      <Tabs.Screen name="Search" />

      <Tabs.Screen name="message" />

      <Tabs.Screen name="Notifications" />

      <Tabs.Screen name="Perfil" />

      <Tabs.Screen
        name="Admin"
        options={{
          href: isAdmin ? "/Admin" : null,
        }}
      />
    </Tabs>
  );
}
