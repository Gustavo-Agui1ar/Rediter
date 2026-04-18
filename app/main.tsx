import { Header, IconButton, NavBar, NavItem } from "@/components/components";
import { styles } from "@/styles/theme";
import { useLocalSearchParams } from "expo-router";
import React, { JSX, useEffect, useMemo, useState } from "react";
import { KeyboardAvoidingView, View } from "react-native";

import { LoadingOverlay } from "@/components/Loading/loading";
import { useLoading } from "@/context/loadingContext";
import { stylesMain } from "@/styles/main.style";
import Feed from "./Views/feed";
import Message from "./Views/message";
import Perfil from "./Views/perfil";

const validTabs: Tab[] = ["home", "messages", "profile"];
type Tab = "home" | "messages" | "profile";

export default function Main() {
  const { screen } = useLocalSearchParams<{ screen: Tab }>();
  const [currentTab, setCurrentTab] = useState<Tab>("home");
  const { loading } = useLoading();

  const screens: Record<Tab, JSX.Element> = {
    home: <Feed />,
    messages: <Message />,
    profile: <Perfil />,
  };

  const navItems: NavItem<Tab>[] = useMemo(
    () => [
      {
        id: "home",
        label: "Início",
        icon: "home",
      },
      {
        id: "messages",
        label: "Mensagens",
        icon: "message",
      },
      {
        id: "profile",
        label: "Perfil",
        icon: "profile",
      },
    ],
    [currentTab],
  );

  useEffect(() => {
    if (screen && validTabs.includes(screen as Tab)) {
      setCurrentTab(screen);
    }
  }, [screen]);

  return (
    <KeyboardAvoidingView style={styles.container} behavior="height">
      {loading && <LoadingOverlay />}
      {currentTab !== "profile" && <Header />}

      {screens[currentTab]}
      <View style={styles.footer}>
        <NavBar<Tab>
          items={navItems}
          activeId={currentTab}
          onPress={setCurrentTab}
        />

        <View style={stylesMain.floatingButton}>
          <IconButton size={56} circle={false} icon="post" onPress={() => {}} />
        </View>
      </View>
    </KeyboardAvoidingView>
  );
}
