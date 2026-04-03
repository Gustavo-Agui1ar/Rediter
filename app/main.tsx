import { Header, NavBar, NavItem } from "@/components/components";
import { Colors, styles } from "@/styles/theme";
import { Home, MessageCircle, User } from "lucide-react-native";
import React, { useState } from "react";
import { KeyboardAvoidingView, Text, View } from "react-native";
import Perfil from "./Views/perfil";

export default function Main() {
  // 1. Estado para saber qual aba está ativa
  const [currentTab, setCurrentTab] = useState("home");

  const navItems: NavItem[] = [
    {
      id: "home",
      label: "Início",
      icon: (
        <Home
          size={24}
          color={currentTab === "home" ? Colors.secondary : Colors.secondary}
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
            currentTab === "messages" ? Colors.secondary : Colors.secondary
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
          color={currentTab === "profile" ? Colors.secondary : Colors.secondary}
        />
      ),
    },
  ];

  const renderContent = () => {
    switch (currentTab) {
      case "home":
        return (
          <Text style={{ color: Colors.quaternary }}>Bem-vindo à Home!</Text>
        );
      case "messages":
        return (
          <Text style={{ color: Colors.quaternary }}>Suas Mensagens aqui.</Text>
        );
      case "profile":
        return <Perfil />;
      default:
        return null;
    }
  };

  return (
    <KeyboardAvoidingView style={[styles.container]} behavior="height">
      <Header></Header>
      <View style={[styles.content]}>{renderContent()}</View>

      <View style={[styles.footer]}>
        <NavBar
          items={navItems}
          activeId={currentTab}
          onPress={(id) => setCurrentTab(id)}
        />
      </View>
    </KeyboardAvoidingView>
  );
}
