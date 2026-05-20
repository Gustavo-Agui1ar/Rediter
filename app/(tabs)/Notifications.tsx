import { Header, IconButton } from "@/components/components";
import { useLanguage } from "@/context/LanguageContext";
import { useSignalR } from "@/context/NotificationsContext";
import { useStylesPerfil } from "@/styles/Notifications.style";
import React, { memo, useCallback } from "react";
import { FlatList, Text, View } from "react-native";

interface NotificacaoProps {
  id: string;
  recipientUserId: string;
  senderUserId: string;
  postId: string;
  type: string;
  isRead: boolean;
  createdAt: string;
}

const NotificationItem = memo(
  ({ item, styles, t }: { item: NotificacaoProps; styles: any; t: any }) => {
    const hora = new Date(item.createdAt).toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });

    const isPostLiked = item.type === "PostLiked";

    return (
      <View
        style={[styles.card, item.isRead ? styles.cardRead : styles.cardUnread]}
      >
        <View style={styles.iconContainer}>
          <IconButton
            icon={isPostLiked ? "likeFilled" : "notifications"}
            type="none"
            fullSize
          />
        </View>

        <View style={styles.messageContainer}>
          <Text style={styles.messageText} numberOfLines={1}>
            {item.senderUserId}
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
      </View>
    );
  },
);

export default function HomeScreen() {
  const { notifications } = useSignalR();
  const styles = useStylesPerfil();
  const { t } = useLanguage();

  const renderItem = useCallback(
    ({ item }: { item: NotificacaoProps }) => (
      <NotificationItem item={item} styles={styles} t={t} />
    ),
    [styles, t],
  );

  const renderEmptyComponent = useCallback(
    () => (
      <View style={styles.emptyContainer}>
        <Text style={{ fontSize: 40, marginBottom: 10 }}>📭</Text>
        <Text style={styles.emptyText}>{t("no_notifications")}</Text>
      </View>
    ),
    [styles, t],
  );

  const keyExtractor = useCallback((item: NotificacaoProps) => item.id, []);

  return (
    <View style={styles.container}>
      <Header divider={true}>
        <Text style={styles.headerTitle}>{t("notification_title")}</Text>
      </Header>

      <View style={styles.notificationsContainer}>
        <FlatList
          data={notifications}
          keyExtractor={keyExtractor}
          renderItem={renderItem}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={renderEmptyComponent}
          initialNumToRender={10}
          maxToRenderPerBatch={10}
          windowSize={5}
          removeClippedSubviews={true}
        />
      </View>
    </View>
  );
}
