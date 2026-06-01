import { Header, ProfileImage } from "@/components/components";
import { useLanguage } from "@/context/LanguageContext";
import { useTheme } from "@/context/ThemeContext";
import { useChatsList, UserChatDTO } from "@/scripts/ChatLists.script";
import { useStylesChatsList } from "@/styles/ChatList.style";
import { useRouter } from "expo-router";
import { Plus, Users } from "lucide-react-native";
import { useCallback } from "react";
import {
  ActivityIndicator,
  FlatList,
  Pressable,
  RefreshControl,
  Text,
  View,
} from "react-native";

export default function Message() {
  const router = useRouter();
  const { colors } = useTheme();
  const { t } = useLanguage();
  const styles = useStylesChatsList();

  const {
    chats,
    isLoading,
    isRefreshing,
    isLoadingMore,
    loadChats,
    refreshChats,
  } = useChatsList();

  const openChat = useCallback(
    (chat: UserChatDTO) => {
      router.push({
        pathname: "/Message",
        params: {
          chatId: chat.chatId,
          targetUserId: chat.targetUserId,
          targetUserName: chat.titleChat,
        },
      });
    },
    [router],
  );

  const getAvatarColor = useCallback((text: string) => {
    let hash = 0;

    for (let i = 0; i < text.length; i++) {
      hash = text.charCodeAt(i) + ((hash << 5) - hash);
    }

    const hue = 260 + ((Math.abs(hash) % 80) - 40);

    return `hsl(${hue}, 70%, 55%)`;
  }, []);

  const renderItem = useCallback(
    ({ item }: { item: UserChatDTO }) => {
      const date = new Date(item.lastUpdatedAt + "Z");
      const timeString = date.toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      });

      return (
        <Pressable
          style={({ pressed }) => [
            styles.chatItem,
            pressed && styles.chatItemPressed,
          ]}
          onPress={() => openChat(item)}
        >
          {item.targetUserImage ? (
            <View style={styles.avatar}>
              <ProfileImage imageName={item.targetUserImage} size={50} />
            </View>
          ) : (
            <View
              style={[
                styles.avatar,
                {
                  backgroundColor: getAvatarColor(item.titleChat || "?"),
                },
              ]}
            >
              <Text style={styles.avatarText}>
                {item.titleChat ? item.titleChat.charAt(0).toUpperCase() : "?"}
              </Text>
            </View>
          )}

          <View style={styles.chatInfo}>
            <View style={styles.chatHeader}>
              <Text style={styles.userName} numberOfLines={1}>
                {item.titleChat}
              </Text>
              <Text style={styles.timeText}>{timeString}</Text>
            </View>

            <View style={styles.chatFooter}>
              <Text style={styles.lastMessage} numberOfLines={1}>
                {item.lastMessageContent ||
                  t("no_messages_yet") ||
                  "Sem mensagens ainda."}
              </Text>

              {item.unreadCount && item.unreadCount > 0 ? (
                <View style={styles.unreadBadge}>
                  <Text style={styles.unreadText}>{item.unreadCount}</Text>
                </View>
              ) : null}
            </View>
          </View>
        </Pressable>
      );
    },
    [styles, t, getAvatarColor, colors.primary, openChat],
  );

  return (
    <View style={styles.container}>
      <Header divider={true}>
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
            width: "100%",
            paddingRight: 16,
          }}
        >
          <Text style={styles.headerTitle}>{t("messages")}</Text>

          <Pressable
            onPress={() => router.push("/CreateGroup")}
            style={({ pressed }) => [
              {
                opacity: pressed ? 0.7 : 1,
                padding: 4,
                position: "relative",
              },
            ]}
          >
            <Users color={colors.primaryDark} size={24} />
            <Plus color={colors.primary} size={16} style={styles.plusButton} />
          </Pressable>
        </View>
      </Header>

      {isLoading && !isRefreshing ? (
        <View style={styles.centerContainer}>
          <ActivityIndicator size="large" color={colors.primary} />
        </View>
      ) : chats.length === 0 ? (
        <View style={styles.centerContainer}>
          <Text style={styles.emptyText}>
            {t("no_chats_found") || "Nenhuma conversa encontrada."}
          </Text>
        </View>
      ) : (
        <FlatList
          data={chats}
          keyExtractor={(item) => item.chatId}
          renderItem={renderItem}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl
              refreshing={isRefreshing}
              onRefresh={refreshChats}
              colors={[colors.primary]}
              tintColor={colors.primary}
            />
          }
          onEndReached={() => loadChats(true)}
          onEndReachedThreshold={0.5}
          ListFooterComponent={
            isLoadingMore ? (
              <ActivityIndicator
                size="small"
                color={colors.primary}
                style={styles.footerLoader}
              />
            ) : null
          }
        />
      )}
    </View>
  );
}
