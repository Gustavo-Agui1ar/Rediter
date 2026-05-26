import { Header, IconButton, TextBox } from "@/components/components";
import { useLanguage } from "@/context/LanguageContext";
import { useTheme } from "@/context/ThemeContext";
import { MensagemProps, useChat } from "@/scripts/Message.script";
import { useChatStyles } from "@/styles/Message.style";
import { useLocalSearchParams, useRouter } from "expo-router";
import React, { memo, useCallback, useState } from "react";
import {
    ActivityIndicator,
    FlatList,
    KeyboardAvoidingView,
    Platform,
    Text,
    View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

// Tipagem correta para os estilos inferidos do hook
type ChatStyles = ReturnType<typeof useChatStyles>;

// ============================================================================
// COMPONENTE: BALÃO DE MENSAGEM
// ============================================================================
const MessageBubble = memo(
  ({
    item,
    isMe,
    styles,
  }: {
    item: MensagemProps;
    isMe: boolean;
    styles: ChatStyles;
  }) => {
    const hora = new Date(item.createdAt).toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });
    const { colors } = useTheme();

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

            {isMe && (
              <Text
                style={[
                  styles.checkMarks,
                  item.isRead ? styles.checkMarksRead : styles.checkMarksSent,
                ]}
              >
                {/* Dica: Substitua por ícones como Ionicons (name="checkmark-done-outline") */}
                <IconButton
                  icon={item.isRead ? "double-check" : "check"}
                  type="none"
                  iconColor={
                    item.isRead ? colors.primary : colors.textSecondary
                  }
                  size={32}
                />
              </Text>
            )}
          </View>
        </View>
      </View>
    );
  },
  (prev, next) =>
    prev.item.id === next.item.id && prev.item.isRead === next.item.isRead,
);

// ============================================================================
// TELA PRINCIPAL
// ============================================================================
export default function ChatScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets(); // Lida com o entalhe/home bar do iOS

  const { targetUserId, targetUserName, currentUserId } = useLocalSearchParams<{
    targetUserId: string;
    targetUserName: string;
    currentUserId: string;
  }>();

  const styles = useChatStyles();
  const [inputText, setInputText] = useState("");
  const { t } = useLanguage();

  const { messages, isLoading, isLoadingMore, loadMessages, sendMessage } =
    useChat(targetUserId, currentUserId);

  const handleSend = () => {
    if (!inputText.trim()) return;
    sendMessage(inputText);
    setInputText("");
  };

  const renderItem = useCallback(
    ({ item }: { item: MensagemProps }) => (
      <MessageBubble
        item={item}
        isMe={item.senderId === currentUserId}
        styles={styles}
      />
    ),
    [currentUserId, styles],
  );

  const { colors } = useTheme();
  const keyExtractor = useCallback((item: MensagemProps) => item.id, []);

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
      keyboardVerticalOffset={Platform.OS === "ios" ? 90 : 0}
    >
      <Header divider={true} onBack={() => router.back()} />

      <View style={styles.chatArea}>
        {isLoading ? (
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
            keyboardDismissMode="on-drag" // Fecha o teclado ao rolar
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
