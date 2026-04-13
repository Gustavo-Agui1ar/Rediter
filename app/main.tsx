import { Home, MessageCircle, User } from "lucide-react-native";
import React, { useMemo, useState } from "react";
import { KeyboardAvoidingView, View } from "react-native";

import { Header, NavBar, NavItem } from "@/components/components";
import { Colors, styles } from "@/styles/theme";
import { JSX } from "react";

import { LoadingOverlay } from "@/components/Loading/loading";
import { useLoading } from "@/context/loadingContext";
import Feed from "./Views/feed";
import Message from "./Views/message";
import Perfil from "./Views/perfil";

export default function Main() {
  type Tab = "home" | "messages" | "profile";

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
        icon: (
          <Home
            size={24}
            color={currentTab === "home" ? Colors.secondary : Colors.perimary}
          />
        ),
      },
      {
        id: "messages",
        label: "Mensagens",
        icon: (
          <MessageCircle
            size={24}
            color={
              currentTab === "messages" ? Colors.secondary : Colors.perimary
            }
          />
        ),
      },
      {
        id: "profile",
        label: "Perfil",
        icon: (
          <User
            size={24}
            color={
              currentTab === "profile" ? Colors.secondary : Colors.perimary
            }
          />
        ),
      },
    ],
    [currentTab],
  );

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
      </View>
    </KeyboardAvoidingView>
  );
}
