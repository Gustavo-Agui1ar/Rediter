import { Header, UserItem } from "@/components/components";
import { useTheme } from "@/context/ThemeContext";
import { useBlockedUsers } from "@/scripts/BlockedUsers.script";
import { useStylesBlockedUsers } from "@/styles/BlockedUsers.style";
import { useRouter } from "expo-router";
import React, { useCallback, useMemo } from "react";
import {
  ActivityIndicator,
  FlatList,
  RefreshControl,
  Text,
  View,
} from "react-native";

const BlockedSkeleton = React.memo(() => {
  const styles = useStylesBlockedUsers();
  return (
    <View style={styles.skeletonContainer}>
      <View style={styles.skeletonAvatar} />
      <View style={styles.skeletonName} />
    </View>
  );
});

interface BlocksProps {
  onRefresh?: () => Promise<void>;
  refreshing?: boolean;
  profileHeader?: React.ReactElement;
  tabBar?: React.ReactElement;
}

export default function Blocks({
  onRefresh,
  refreshing = false,
  profileHeader,
  tabBar,
}: BlocksProps) {
  const { colors } = useTheme();
  const styles = useStylesBlockedUsers();
  const router = useRouter();
  const { users, initialLoading, loadingMore, loadMore, unblockUserLocally } =
    useBlockedUsers();

  const skeletons = useMemo(
    () => [
      { _isSkeleton: true, userID: "sk-1" },
      { _isSkeleton: true, userID: "sk-2" },
      { _isSkeleton: true, userID: "sk-3" },
    ],
    [],
  );

  const displayData = initialLoading ? skeletons : users;

  const renderItem = useCallback(
    ({ item }: { item: any }) => {
      if (item._isSkeleton) {
        return <BlockedSkeleton />;
      }

      return (
        <UserItem user={item} blocked={true} onUnblock={unblockUserLocally} />
      );
    },
    [unblockUserLocally],
  );

  const keyExtractor = useCallback(
    (item: any, index: number) =>
      item.userID?.toString() || item.id?.toString() || index.toString(),
    [],
  );

  const handleEndReached = useCallback(() => {
    if (!initialLoading && !loadingMore) loadMore();
  }, [initialLoading, loadingMore, loadMore]);

  const renderEmptyComponent = useCallback(() => {
    if (initialLoading) return null;
    return (
      <View style={styles.emptyContainer}>
        <Text style={styles.emptyText}>
          Você não possui nenhum usuário bloqueado.
        </Text>
      </View>
    );
  }, [initialLoading, styles]);

  const renderListHeader = useCallback(() => {
    return (
      <>
        {profileHeader}
        {tabBar}
      </>
    );
  }, [profileHeader, tabBar]);

  const renderListFooter = useCallback(() => {
    if (loadingMore) {
      return (
        <View style={styles.footerLoading}>
          <ActivityIndicator size="small" color={colors.primary} />
        </View>
      );
    }
    return <View style={{ height: 40 }} />;
  }, [loadingMore, colors.primary, styles.footerLoading]);

  return (
    <View style={{ flex: 1, backgroundColor: colors.background }}>
      <Header title="Usuários Bloqueados" onBack={() => router.back()} />

      <FlatList
        data={displayData}
        renderItem={renderItem}
        keyExtractor={keyExtractor}
        ListHeaderComponent={renderListHeader}
        ListEmptyComponent={renderEmptyComponent}
        ListFooterComponent={renderListFooter}
        onEndReachedThreshold={0.3}
        onEndReached={handleEndReached}
        refreshControl={
          onRefresh ? (
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          ) : undefined
        }
        contentContainerStyle={[styles.listContent, { minHeight: "100%" }]}
        initialNumToRender={12}
        maxToRenderPerBatch={12}
        windowSize={5}
        removeClippedSubviews={true}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
}
