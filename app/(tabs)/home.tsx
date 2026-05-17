import { Header, SearchPosts } from "@/components/components";
import TabBar from "@/components/Layout/TabBar/TabBar";
import { useLoading } from "@/context/loadingContext";
import { useTheme } from "@/context/ThemeContext";
import React, { useState } from "react";
import { Text, View } from "react-native";

// ============================================================================
// CONFIGURAÇÃO DAS ABAS
// ============================================================================
const FEED_TABS = [
  { id: "following", label: "Seguindo" },
  { id: "foryou", label: "Para Você" }, // Você também pode usar "Explorar"
];

export default function HomeFeedScreen() {
  const { colors } = useTheme();
  const { loading: globalLoading } = useLoading();

  // Estado local para gerenciar a aba ativa (iniciando em 'Seguindo')
  const [activeTab, setActiveTab] = useState(FEED_TABS[0].id);

  // ============================================================================
  // RENDERIZAÇÃO DO CABEÇALHO
  // ============================================================================
  function renderHeader() {
    return (
      <Header divider={false}>
        {/* Substituímos o TextBox por um título simples do App ou da Seção */}
        <Text
          style={{
            fontSize: 24,
            fontWeight: "bold",
            color: colors.textPrimary,
            paddingHorizontal: 16,
            paddingVertical: 8,
          }}
        >
          Rediter
        </Text>
      </Header>
    );
  }

  // ============================================================================
  // RENDERIZAÇÃO DO CONTEÚDO (FEED)
  // ============================================================================
  function renderContent() {
    switch (activeTab) {
      case "following":
        return (
          <View style={{ flex: 1 }}>
            <SearchPosts
              key={`tab-following`}
              searchTerm=""
              refreshing={globalLoading}
              feedMode="following"
            />
          </View>
        );

      case "foryou":
        return (
          <View style={{ flex: 1 }}>
            <SearchPosts
              key={`tab-foryou`}
              searchTerm=""
              refreshing={globalLoading}
              feedMode="foryou"
            />
          </View>
        );

      default:
        return null;
    }
  }

  // ============================================================================
  // RENDERIZAÇÃO PRINCIPAL
  // ============================================================================
  return (
    <View style={{ flex: 1, backgroundColor: colors.background }}>
      {renderHeader()}

      <TabBar items={FEED_TABS} active={activeTab} onChange={setActiveTab} />

      {/* O flex: 1 garante que a lista ocupe todo o espaço restante abaixo da TabBar */}
      <View style={{ flex: 1 }}>{renderContent()}</View>
    </View>
  );
}
