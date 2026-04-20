import { NavBar, NavItem, ProfileCover } from "@/components/components";
import { useMemo, useState } from "react";
import { ScrollView, View } from "react-native";
import Posts from "./Posts";

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
        <View style={{ display: currentTab === "posts" ? "flex" : "none" }}>
          <Posts />
        </View>

        <View style={{ display: currentTab === "media" ? "flex" : "none" }}>
          <View
            style={{
              width: "100%",
              flex: 1,
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
        </View>

        <View
          style={{
            display: currentTab === "likes" ? "flex" : "none",
            width: "100%",
            padding: 16,
            flex: 1,
            gap: 16,
          }}
        ></View>
      </ScrollView>
    </View>
  );
}
