import Posts from "@/components/Features/Profile/Posts";
import ProfileCover from "@/components/Features/Profile/ProfileCover";
import { NavItem } from "@/components/Layout/NavBar/navbar";
import TabBar from "@/components/Layout/TabBar/TabBar";
import { useTheme } from "@/context/ThemeContext";
import { useMemo, useState } from "react";
import { ScrollView, View } from "react-native";
import { createdFeedStyles } from "./FeedProfile.style";

type Tab = "posts" | "media" | "likes";

export default function FeedProfile() {
  const [currentTab, setCurrentTab] = useState<Tab>("posts");

  const { colors } = useTheme();
  const styles = createdFeedStyles(colors);

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
      <TabBar items={navItems} active={currentTab} onChange={setCurrentTab} />

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

        {currentTab === "likes" && <View style={styles.likesContainer} />}
      </ScrollView>
    </View>
  );
}
