import { Header, IconButton } from "@/components/components";
import { useLanguage } from "@/context/LanguageContext";
import {
  NotificacaoProps,
  useNotifications,
} from "@/scripts/Notification.script";
import { useStylesPerfil } from "@/styles/Notifications.style";
import React, { memo, useCallback } from "react";
import {
  ActivityIndicator,
  FlatList,
  RefreshControl,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

const NotificationItem = memo(
  ({
    item,
    styles,
    t,
    onMarkAsRead,
  }: {
    item: NotificacaoProps;
    styles: any;
    t: any;
    onMarkAsRead: (id: string, postId: string) => void;
  }) => {
    const hora = new Date(item.createdAt).toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });

    const isPostLiked = item.type === "PostLiked";

    return (
      <TouchableOpacity
        activeOpacity={0.7}
        style={[styles.card, item.isRead ? styles.cardRead : styles.cardUnread]}
        onPress={() => {
          if (!item.isRead) {
            onMarkAsRead(item.id, item.postId);
          }
          // Lógica de navegação futura aqui
        }}
      >
        <View style={styles.iconContainer}>
          <IconButton
            icon={isPostLiked ? "likeFilled" : "messageFilled"}
            type="none"
            fullSize
            hasLoading={false}
          />
        </View>

        <View style={styles.messageContainer}>
          <Text style={styles.messageText} numberOfLines={1}>
            {item.senderUsername}
          </Text>
          <Text style={styles.messageSecondary} numberOfLines={2}>
            {isPostLiked
              ? t("message_post_liked")
              : t("message_post_commented")}
          </Text>
        </View>

        <View style={styles.rightContent}>
          <Text style={styles.timeText}>{hora}</Text>
          {!item.isRead && <View style={styles.unreadDot} />}
        </View>
      </TouchableOpacity>
    );
  },
  (prevProps, nextProps) => prevProps.item.isRead === nextProps.item.isRead,
);

export default function HomeScreen() {
  const {
    notificationsList,
    isLoading,
    isRefreshing,
    isLoadingMore,
    onRefresh,
    handleLoadMore,
    handleMarkAsRead,
  } = useNotifications();

  const styles = useStylesPerfil();
  const { t } = useLanguage();

  const renderItem = useCallback(
    ({ item }: { item: NotificacaoProps }) => (
      <NotificationItem
        item={item}
        styles={styles}
        t={t}
        onMarkAsRead={handleMarkAsRead}
      />
    ),
    [styles, t, handleMarkAsRead],
  );

  const renderEmptyComponent = useCallback(
    () => (
      <View style={styles.emptyContainer}>
        <Text style={styles.emptyText}>{t("no_notifications")}</Text>
      </View>
    ),
    [styles, t],
  );

  const renderFooter = useCallback(() => {
    if (!isLoadingMore) return null;
    return (
      <View style={{ paddingVertical: 20 }}>
        <ActivityIndicator size="small" color="#0000ff" />
      </View>
    );
  }, [isLoadingMore]);

  const keyExtractor = useCallback((item: NotificacaoProps) => item.id, []);

  return (
    <View style={styles.container}>
      <Header divider={true}>
        <Text style={styles.headerTitle}>{t("notification_title")}</Text>
      </Header>

      <View style={styles.notificationsContainer}>
        {isLoading ? (
          <View
            style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
          >
            <ActivityIndicator size="large" color="#0000ff" />
          </View>
        ) : (
          <FlatList
            data={notificationsList}
            keyExtractor={keyExtractor}
            renderItem={renderItem}
            contentContainerStyle={styles.listContent}
            showsVerticalScrollIndicator={false}
            ListEmptyComponent={renderEmptyComponent}
            initialNumToRender={10}
            maxToRenderPerBatch={10}
            windowSize={5}
            removeClippedSubviews={true}
            refreshControl={
              <RefreshControl refreshing={isRefreshing} onRefresh={onRefresh} />
            }
            onEndReached={handleLoadMore}
            onEndReachedThreshold={0.5}
            ListFooterComponent={renderFooter}
          />
        )}
      </View>
    </View>
  );
}
