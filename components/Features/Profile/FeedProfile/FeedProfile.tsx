import { NavBar, NavItem, ProfileCover } from "@/components/components";
import { useMemo, useState } from "react";
import { ScrollView, View } from "react-native";
import Posts from "../Posts";
import { styles } from "./FeedProfile.style";

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
    <View style={styles.container}>
      <View style={styles.navBarContainer}>
        <NavBar<Tab>
          items={navItems}
          activeId={currentTab}
          onPress={setCurrentTab}
        />
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        {currentTab === "posts" && (
          <View style={styles.tabContainer}>
            <Posts />
          </View>
        )}

        {currentTab === "media" && (
          <View style={styles.mediaContainer}>
            {items.map((_, index) => (
              <View key={index} style={styles.mediaItem}>
                <ProfileCover />
              </View>
            ))}
          </View>
        )}

        {currentTab === "likes" && <View style={styles.likesContainer}></View>}
      </ScrollView>
    </View>
  );
}
