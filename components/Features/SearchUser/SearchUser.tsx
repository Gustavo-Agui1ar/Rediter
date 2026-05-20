import UserItem from "@/components/Features/UserItem/UserItem";
import { useLanguage } from "@/context/LanguageContext";
import { useTheme } from "@/context/ThemeContext";
import React, { useCallback } from "react";
import {
  ActivityIndicator,
  RefreshControl,
  SectionList,
  Text,
  View,
} from "react-native";
import { useSearchUsers } from "./SearchUser.script";
import { useStylesSearchUsers } from "./SearchUser.style";

const UserSkeleton = () => {
  const styles = useStylesSearchUsers();
  return (
    <View style={styles.skeletonContainer}>
      <View style={styles.skeletonAvatar} />
      <View style={styles.skeletonName} />
    </View>
  );
};
interface SearchUsersProps {
  searchTerm: string;
  onRefresh?: () => Promise<void>;
  refreshing?: boolean;
  profileHeader?: React.ReactElement;
  tabBar?: React.ReactElement;
}

export default function SearchUsers({
  searchTerm,
  onRefresh,
  refreshing = false,
  profileHeader,
  tabBar,
}: SearchUsersProps) {
  const { colors } = useTheme();
  const styles = useStylesSearchUsers();
  const { t } = useLanguage();

  const { users, initialLoading, loadingMore, loadMore } =
    useSearchUsers(searchTerm);

  const displayData = initialLoading
    ? ([
        { _isSkeleton: true, id: "sk-1" },
        { _isSkeleton: true, id: "sk-2" },
        { _isSkeleton: true, id: "sk-3" },
      ] as any)
    : users;

  const renderItem = useCallback(
    ({ item }: { item: any }) => {
      if (item._isSkeleton) {
        return <UserSkeleton />;
      }
      return <UserItem user={item} searchTerm={searchTerm} />;
    },
    [searchTerm],
  );

  const renderSectionFooter = useCallback(
    ({ section }: any) => {
      if (section.data.length === 0 && !initialLoading) {
        const emptyMessage = searchTerm
          ? `${t("error_no_users_for")} "${searchTerm}"`
          : t("search_users_start_typing");

        return (
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>{emptyMessage}</Text>
          </View>
        );
      }
      return null;
    },
    [initialLoading, searchTerm, styles.emptyContainer, styles.emptyText, t],
  );

  return (
    <SectionList
      sections={[{ data: displayData }]}
      renderItem={renderItem}
      keyExtractor={(item, index) => item.id?.toString() || index.toString()}
      ListHeaderComponent={profileHeader}
      renderSectionHeader={() => tabBar || <></>}
      stickySectionHeadersEnabled={true}
      renderSectionFooter={renderSectionFooter}
      onEndReachedThreshold={0.3}
      onEndReached={() => {
        if (!initialLoading && !loadingMore) loadMore();
      }}
      refreshControl={
        onRefresh ? (
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        ) : undefined
      }
      contentContainerStyle={[styles.listContent, { minHeight: "100%" }]}
      ListFooterComponent={
        loadingMore ? (
          <View style={styles.footerLoading}>
            <ActivityIndicator size="small" color={colors.primary} />
          </View>
        ) : (
          <View style={{ height: 40 }} />
        )
      }
    />
  );
}
