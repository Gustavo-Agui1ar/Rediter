import {
  Header,
  IconButton,
  NavBar,
  TextBox
} from "@/components/components";
import { useGlobalStyles } from "@/styles/global.styles";
import { router, useLocalSearchParams } from "expo-router";
import React, { JSX, useEffect, useMemo, useState } from "react";
import { View } from "react-native";

import { NavItem } from "@/components/Layout/NavBar/navbar";
import Feed from "@/components/Views/feed";
import Message from "@/components/Views/message";
import Perfil from "@/components/Views/Perfil/perfil";
import { useLoading } from "@/context/loadingContext";
import { useStylesMain } from "@/styles/main.style";

const validTabs: Tab[] = ["home", "messages", "profile"];
type Tab = "home" | "messages" | "profile";

export default function Main() {
  const { screen } = useLocalSearchParams<{ screen: Tab }>();
  const [currentTab, setCurrentTab] = useState<Tab>("home");
  const [searchQuery, setSearchQuery] = useState(""); // Estado para a pesquisa
  const { loading } = useLoading();

  const stylesMain = useStylesMain();
  const styles = useGlobalStyles();

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

  // Função para disparar a busca
  const handleSearch = () => {
    console.log("Buscando por:", searchQuery);
    // Aqui você pode disparar um evento ou chamar uma função do Feed
  };

  return (
    <View style={{ flex: 1 }}>
      {currentTab !== "profile" && (
        <Header>
          {currentTab === "home" && (
            <TextBox
              placeholder="Buscar..."
              value={searchQuery}
              onChangeText={setSearchQuery}
              isSearch={true}
              onSearch={handleSearch}
              style={{ width: "100%" }}
            />
          )}
        </Header>
      )}

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
            type="fill"
            onPress={() => router.push("/newPost")}
          />
        </View>
      </View>
    </View>
  );
}
