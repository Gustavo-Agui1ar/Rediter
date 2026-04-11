import { NavBar, NavItem } from "@/components/components";
import Post from "@/components/Post/post";
import { useMemo, useState } from "react";
import { ScrollView, View } from "react-native";

type Tab = "posts" | "media" | "likes";

export default function FeedProfile() {
  const [currentTab, setCurrentTab] = useState<Tab>("posts");

  const navItems: NavItem<Tab>[] = useMemo(
    () => [
      {
        id: "posts",
        label: "Posts",
        icon: null,
      },
      {
        id: "media",
        label: "Mídia",
        icon: null,
      },
      {
        id: "likes",
        label: "Curtidas",
        icon: null,
      },
    ],
    [],
  );

  function renderContent() {
    switch (currentTab) {
      case "posts":
        return (
          <View style={{ width: "100%", padding: 16 }}>
            <Post></Post>
            <Post></Post>
            <Post></Post>
          </View>
        );
      case "media":
        return <View>{/* Grid de mídia */}</View>;
      case "likes":
        return <View>{/* Posts curtidos */}</View>;
    }
  }

  return (
    <View style={{ width: "100%", flex: 1 }}>
      <View
        style={{
          width: "100%",
          flex: 0.15,
        }}
      >
        <NavBar<Tab>
          items={navItems}
          activeId={currentTab}
          onPress={setCurrentTab}
        />
      </View>
      <ScrollView
        style={{ width: "100%", flex: 1 }}
        contentContainerStyle={{ paddingBottom: 16 }}
      >
        {renderContent()}
      </ScrollView>
    </View>
  );
}
