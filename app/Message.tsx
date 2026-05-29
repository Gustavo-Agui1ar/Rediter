import { Header, TextBox } from "@/components/components"; // Remova IconButton se não for usar os checks agora
import { useLanguage } from "@/context/LanguageContext";
import { useTheme } from "@/context/ThemeContext";
import { MessageDTO, useChat } from "@/scripts/Message.script"; // Importando o DTO correto
import { useChatStyles } from "@/styles/Message.style";
import { useLocalSearchParams, useRouter } from "expo-router";
import { memo, useCallback, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  KeyboardAvoidingView,
  Platform,
  Text,
  View,
} from "react-native";

type ChatStyles = ReturnType<typeof useChatStyles>;

const MessageBubble = memo(
  ({ item, styles }: { item: MessageDTO; styles: ChatStyles }) => {
    const hora = new Date(item.createdAt).toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });

    const isMe = item.isMine;

    return (
      <View
        style={[
          styles.bubbleWrapper,
          isMe ? styles.wrapperMe : styles.wrapperThem,
        ]}
      >
        <View
          style={[styles.bubble, isMe ? styles.bubbleMe : styles.bubbleThem]}
        >
          <Text style={isMe ? styles.textMe : styles.textThem}>
            {item.content}
          </Text>

          <View style={styles.timeContainer}>
            <Text style={isMe ? styles.timeMe : styles.timeThem}>{hora}</Text>

            {/* TODO: A implementar futuramente (Read Receipts).
               Como o MessageDTO atual não possui isRead, essa parte pode ser 
               removida temporariamente ou deixada apenas o check simples (sem o double-check).
            */}
          </View>
        </View>
      </View>
    );
  },
  (prev, next) => prev.item.messageId === next.item.messageId,
);

export default function ChatScreen() {
  const router = useRouter();

  const { chatId, targetUserId, targetUserName } = useLocalSearchParams<{
    chatId?: string;
    targetUserId?: string;
    targetUserName?: string;
  }>();

  const styles = useChatStyles();
  const { colors } = useTheme();
  const { t } = useLanguage();
  const [inputText, setInputText] = useState("");

  const { messages, isLoading, isLoadingMore, loadMessages, sendMessage } =
    useChat({
      chatId: chatId || null,
      receiverId: targetUserId || null,
      isDirect: !!targetUserId,
    });

  const handleSend = () => {
    if (!inputText.trim()) return;
    sendMessage(inputText);
    setInputText("");
  };

  const renderItem = useCallback(
    ({ item }: { item: MessageDTO }) => (
      <MessageBubble item={item} styles={styles} />
    ),
    [styles],
  );

  const keyExtractor = useCallback((item: MessageDTO) => item.messageId, []);

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
      keyboardVerticalOffset={Platform.OS === "ios" ? 90 : 0}
    >
      {/* Opcional: Você pode passar o targetUserName como título do cabeçalho
         quando estiver em um chat 1:1. 
      */}
      <Header
        divider={true}
        onBack={() => router.back()}
        title={targetUserName}
      />

      <View style={styles.chatArea}>
        {isLoading && messages.length === 0 ? ( // Mostra o loader de tela cheia apenas na carga inicial
          <ActivityIndicator
            size="large"
            color={colors.primary}
            style={styles.loader}
          />
        ) : (
          <FlatList
            data={messages}
            keyExtractor={keyExtractor}
            renderItem={renderItem}
            inverted
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.listContent}
            keyboardDismissMode="on-drag"
            keyboardShouldPersistTaps="handled"
            onEndReached={() => loadMessages(true)}
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

      <View style={[styles.inputContainer, { paddingBottom: 12 }]}>
        <TextBox
          placeholder={t("type_a_message")}
          value={inputText}
          onChangeText={setInputText}
          multiline
          maxLength={500}
          autoCapitalize="sentences"
          enablesReturnKeyAutomatically
          icon="send"
          onIconPress={handleSend}
        />
      </View>
    </KeyboardAvoidingView>
  );
}
