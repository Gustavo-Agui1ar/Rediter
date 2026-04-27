import { Header, TextBox } from "@/components/components";
import Posts from "@/components/Features/Profile/Posts/Posts";
import { useTheme } from "@/context/ThemeContext";
import { useState } from "react";
import { Text, View } from "react-native";
import {
  MaterialTabBar,
  MaterialTabItem,
  Tabs,
} from "react-native-collapsible-tab-view";
import { useStyles } from "./search.styles";

export default function Search() {
  const [searchQuery, setSearchQuery] = useState("");
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

  return (
    <View style={{ flex: 1, backgroundColor: colors.background }}>
      <Tabs.Container
        renderHeader={renderHeader}
        renderTabBar={(props) => (
          <MaterialTabBar
            {...props}
            activeColor={colors.primaryDark}
            inactiveColor={colors.textMuted}
            indicatorStyle={styles.tabIndicator}
            style={styles.tabBar}
            TabItemComponent={(itemProps) => (
              <MaterialTabItem
                {...itemProps}
                pressColor="transparent"
                pressOpacity={0.8}
              />
            )}
          />
        )}
      >
        {/* ABA 1: MAIS RECENTES */}
        <Tabs.Tab name="posts" label="Mais Recentes">
          <Posts myProfile={false} />
        </Tabs.Tab>

        {/* ABA 2: PESSOAS */}
        <Tabs.Tab name="media" label="Pessoas">
          <Text>Pessoas relacionadas à sua busca aparecerão aqui.</Text>
        </Tabs.Tab>

        {/* ABA 3: CURTIDAS */}
        <Tabs.Tab name="likes" label="Mídias">
          <Text style={{ ...styles.textTitle, margin: 20 }}>
            Mídias relacionadas à sua busca aparecerão aqui.
          </Text>
        </Tabs.Tab>
      </Tabs.Container>
    </View>
  );
}
