import { Header, TextBox } from "@/components/components";
import Posts from "@/components/Features/Profile/Posts/Posts";
import TabBar from "@/components/Layout/TabBar/TabBar";
import { useTheme } from "@/context/ThemeContext";
import { useSearch } from "@/scripts/Search.script";
import { useStyles } from "@/styles/search.styles";
import { Text, View } from "react-native";

export default function Search() {
  const { colors } = useTheme();
  const styles = useStyles();
  const { state, actions } = useSearch();

  function renderHeader() {
    return (
      <Header divider={false}>
        <TextBox
          placeholder="O que você quer ler hoje?"
          value={state.searchQuery}
          onChangeText={actions.setSearchQuery}
          isSearch={true}
          onSearch={actions.handleSearch}
          style={{ width: "100%" }}
        />
      </Header>
    );
  }

  function renderContent() {
    switch (state.activeTab) {
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

      <TabBar
        items={state.tabs}
        active={state.activeTab}
        onChange={actions.setActiveTab}
      />

      <View style={{ flex: 1 }}>{renderContent()}</View>
    </View>
  );
}
