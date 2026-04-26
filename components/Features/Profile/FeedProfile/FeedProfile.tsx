import Midiagrid from "@/components/Features/Profile/Midia/Midia";
import Posts from "@/components/Features/Profile/Posts/Posts";
import { NavItem } from "@/components/Layout/NavBar/navbar";
import TabBar from "@/components/Layout/TabBar/TabBar";
import { useMemo, useState } from "react";
import { View } from "react-native";
import { useFeedStyles } from "./FeedProfile.style";

type Tab = "posts" | "media" | "likes";

interface FeedProfileProps {
  headerComponent: React.ReactNode;
  onRefreshProfile: () => Promise<void>;
}

export default function FeedProfile({
  headerComponent,
  onRefreshProfile,
}: FeedProfileProps) {
  const [currentTab, setCurrentTab] = useState<Tab>("posts");
  const styles = useFeedStyles();

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

  const CombinedHeader = (
    <View>
      {headerComponent}
      <TabBar items={navItems} active={currentTab} onChange={setCurrentTab} />
    </View>
  );

  return (
    <View style={styles.container}>
      <View
        style={[
          styles.tabContainer,
          currentTab !== "posts" && { display: "none" },
        ]}
      >
        {/* Envia para os posts */}
        <Posts
          ListHeaderComponent={CombinedHeader}
          onRefreshProfile={onRefreshProfile}
        />
      </View>

      <View
        style={[
          styles.mediaContainer,
          currentTab !== "media" && { display: "none" },
        ]}
      >
        {/* Envia para as mídias */}
        <Midiagrid
          isMyProfile={true}
          ListHeaderComponent={CombinedHeader}
          onRefreshProfile={onRefreshProfile}
        />
      </View>

      {/* ... aba de likes */}
    </View>
  );
}
