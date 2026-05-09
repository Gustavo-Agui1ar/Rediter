import { UserItem } from "@/components/components";
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

  return (
    <SectionList
      sections={[{ data: displayData }]}
      renderItem={renderItem}
      keyExtractor={(item, index) => item.id?.toString() || index.toString()}
      ListHeaderComponent={profileHeader}
      renderSectionHeader={() => tabBar || <></>}
      stickySectionHeadersEnabled={true}
      renderSectionFooter={({ section }) => {
        if (section.data.length === 0 && !initialLoading) {
          return (
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyText}>
                {searchTerm
                  ? `Nenhum usuário encontrado para "${searchTerm}"`
                  : "Comece a digitar para buscar pessoas"}
              </Text>
            </View>
          );
        }
        return null;
      }}
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
