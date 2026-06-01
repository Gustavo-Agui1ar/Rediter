import { TextSize } from "@/styles/global.styles";
import { makeStyles } from "@/utils/makeStyles.utils";
import { ThemeColors } from "./types/theme.types";

export const useChatStyles = makeStyles((colors: ThemeColors) => ({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },

  headerContent: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },

  headerTitle: {
    fontSize: TextSize.md,
    fontWeight: "bold",
    color: colors.textPrimary,
  },

  chatArea: {
    flex: 1,
    paddingBottom: 16,
  },

  listContent: {
    paddingHorizontal: 16,
    paddingBottom: 16,
    gap: 8,
  },

  loader: {
    marginTop: 20,
  },

  footerLoader: {
    marginVertical: 10,
  },

  typingIndicatorWrapper: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingBottom: 8,
    gap: 8,
  },
  typingText: {
    fontSize: 12,
    fontStyle: "italic",
  },

  noMessagesContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 32,
  },

  noMessagesText: {
    color: colors.textSecondary,
    fontSize: 16,
    textAlign: "center",
    lineHeight: 24,
  },

  bubbleWrapper: {
    width: "100%",
    marginVertical: 2,
    flexDirection: "row",
  },

  wrapperMe: {
    justifyContent: "flex-end",
  },

  wrapperThem: {
    justifyContent: "flex-start",
  },

  senderName: {
    fontSize: 12,
    color: colors.textMuted,
    marginBottom: 8,
    marginLeft: 4,
  },

  bubble: {
    maxWidth: "80%",
    minWidth: 80,
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 18,
    elevation: 1,
    shadowColor: "#000",
    shadowOpacity: 0.06,
    shadowRadius: 3,
    shadowOffset: { width: 0, height: 1 },
  },

  bubbleMe: {
    backgroundColor: colors.chatBubbleMe,
    borderBottomRightRadius: 4,
  },

  bubbleThem: {
    backgroundColor: colors.chatBubbleThem,
    borderBottomLeftRadius: 4,
  },

  textMe: {
    fontSize: 16,
    lineHeight: 22,
    color: colors.chatTextMe,
  },

  textThem: {
    fontSize: 16,
    lineHeight: 22,
    color: colors.chatTextThem,
  },

  timeContainer: {
    flexDirection: "row",
    justifyContent: "flex-end",
    alignItems: "center",
    marginTop: 4,
    gap: 4,
  },

  timeMe: {
    fontSize: 11,
    color: colors.chatTimeMe,
  },

  timeThem: {
    fontSize: 11,
    color: colors.chatTimeThem,
  },

  checkMarks: {
    fontSize: 12,
    fontWeight: "bold",
  },

  checkMarksSent: {
    color: colors.chatStatusUnread,
  },

  checkMarksRead: {
    color: colors.chatStatusRead,
  },

  inputContainer: {
    flexDirection: "row",
    paddingHorizontal: 12,
    paddingTop: 12,
    backgroundColor: colors.background,
    alignItems: "flex-end",
    borderTopWidth: 1,
    borderTopColor: colors.border,
    width: "100%",
  },

  textInput: {
    flex: 1,
    backgroundColor: colors.surface,
    borderRadius: 24,
    paddingHorizontal: 18,
    paddingTop: 12,
    paddingBottom: 12,
    maxHeight: 120,
    fontSize: 16,
    color: colors.textPrimary,
  },

  sendButton: {
    marginLeft: 10,
    marginBottom: 0,
    backgroundColor: colors.primary,
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: "center",
    alignItems: "center",
  },

  sendButtonDisabled: {
    backgroundColor: colors.disabled,
    opacity: 0.6,
  },
}));
