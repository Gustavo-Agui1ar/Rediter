import {
  Header,
  IconButton,
  LoadingOverlay,
  NavBar,
} from "@/components/components";
import { createdStyles } from "@/styles/theme";
import { router, useLocalSearchParams } from "expo-router";
import React, { JSX, useEffect, useMemo, useState } from "react";
import { KeyboardAvoidingView, View } from "react-native";

import { NavItem } from "@/components/Layout/NavBar/navbar";
import Feed from "@/components/Views/feed";
import Message from "@/components/Views/message";
import Perfil from "@/components/Views/Perfil/perfil";
import { useLoading } from "@/context/loadingContext";
import { useTheme } from "@/context/ThemeContext";
import { createdStylesMain } from "@/styles/main.style";

const validTabs: Tab[] = ["home", "messages", "profile"];
type Tab = "home" | "messages" | "profile";

export default function Main() {
  const { screen } = useLocalSearchParams<{ screen: Tab }>();
  const [currentTab, setCurrentTab] = useState<Tab>("home");
  const { loading } = useLoading();

  const { colors } = useTheme();
  const stylesMain = createdStylesMain(colors);
  const styles = createdStyles(colors);

  const screens: Record<Tab, JSX.Element> = {
    home: <Feed />,
    messages: <Message />,
    profile: <Perfil />,
  };

  const navItems: NavItem<Tab>[] = useMemo(
    () => [
      { id: "home", label: "Início", icon: "home" },
      { id: "messages", label: "Mensagens", icon: "message" },
      { id: "profile", label: "Perfil", icon: "profile" },
    ],
    [],
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

      <View style={styles.fill}>{screens[currentTab]}</View>

      <View style={stylesMain.footerContainer}>
        <NavBar<Tab>
          items={navItems}
          activeId={currentTab}
          onPress={setCurrentTab}
        />

        <View style={stylesMain.floatingButton}>
          <IconButton
            size={56}
            circle={false}
            icon="post"
            onPress={() => router.push("/newPost")}
          />
        </View>
      </View>
    </KeyboardAvoidingView>
  );
}
