import { NavBar, NavItem, ProfileCover } from "@/components/components";
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
      },
      {
        id: "media",
        label: "Mídia",
      },
      {
        id: "likes",
        label: "Curtidas",
      },
    ],
    [],
  );

  const items = Array.from({ length: 20 });

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
        return (
          <View
            style={{
              width: "100%",
              padding: 8,
              flexDirection: "row",
              flexWrap: "wrap",
              gap: 8,
            }}
          >
            {items.map((_, index) => (
              <View key={index} style={{ width: "49%" }}>
                <ProfileCover />
              </View>
            ))}
          </View>
        );
      case "likes":
        return (
          <View style={{ width: "100%", padding: 16 }}>
            <Post></Post>
            <Post></Post>
            <Post></Post>
          </View>
        );
    }
  }

  return (
    <View style={{ width: "100%" }}>
      <View
        style={{
          width: "100%",
          minHeight: 50,
        }}
      >
        <NavBar<Tab>
          items={navItems}
          activeId={currentTab}
          onPress={setCurrentTab}
        />
      </View>
      <ScrollView contentContainerStyle={{ paddingBottom: 16 }}>
        {renderContent()}
      </ScrollView>
    </View>
  );
}
