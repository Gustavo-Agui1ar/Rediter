import { Header, TextBox } from "@/components/components";
import Posts from "@/components/Features/Profile/Posts/Posts";
import TabBar from "@/components/Layout/TabBar/TabBar";
import { useTheme } from "@/context/ThemeContext";
import { useState } from "react";
import { Text, View } from "react-native";
import { useStyles } from "./search.styles";

export default function Search() {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState("posts");

  const { colors } = useTheme();
  const styles = useStyles();

  function handleSearch() {
    console.log("Buscando por:", searchQuery);
  }

  function renderHeader() {
    return (
      <Header divider={false}>
        <TextBox
          placeholder="O que você quer ler hoje?"
          value={searchQuery}
          onChangeText={setSearchQuery}
          isSearch={true}
          onSearch={handleSearch}
          style={{ width: "100%" }}
        />
      </Header>
    );
  }

  const tabs = [
    { id: "posts", label: "Mais Recentes" },
    { id: "people", label: "Pessoas" },
    { id: "media", label: "Mídias" },
  ];

  function renderContent() {
    switch (activeTab) {
      case "posts":
        return (
          <View style={styles.postsContainer}>
            <Posts myProfile={false} />
          </View>
        );

      case "people":
        return (
          <Text style={{ margin: 20 }}>
            Pessoas relacionadas à sua busca aparecerão aqui.
          </Text>
        );

      case "media":
        return (
          <Text style={{ ...styles.textTitle, margin: 20 }}>
            Mídias relacionadas à sua busca aparecerão aqui.
          </Text>
        );

      default:
        return null;
    }
  }

  return (
    <View style={{ flex: 1, backgroundColor: colors.background }}>
      {renderHeader()}
      <TabBar items={tabs} active={activeTab} onChange={setActiveTab} />
      <View style={{ flex: 1 }}>{renderContent()}</View>
    </View>
  );
}
