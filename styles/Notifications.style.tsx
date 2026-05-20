import { ThemeColors } from "@/styles/types/theme.types";
import { makeStyles } from "@/utils/makeStyles.utils";

export const useStylesPerfil = makeStyles((colors: ThemeColors) => ({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },

  header: {
    fontSize: 30,
    fontWeight: "800",
    color: colors.textPrimary,
    marginBottom: 28,
    paddingHorizontal: 24,
    letterSpacing: -0.5,
  },

  notificationsContainer: {
    flex: 1,
    paddingHorizontal: 20,
    paddingVertical: 16,
  },

  headerTitle: {
    fontSize: 24,
    fontWeight: "bold",
    color: colors.textPrimary,
    paddingHorizontal: 16,
    paddingVertical: 8,
  },

  sectionTitle: {
    fontSize: 22,
    fontWeight: "700",
    color: colors.textPrimary,
    marginBottom: 18,
    letterSpacing: -0.3,
  },

  listContent: {
    paddingBottom: 120,
  },

  card: {
    flexDirection: "row",
    alignItems: "center",

    paddingVertical: 18,
    paddingHorizontal: 18,

    borderRadius: 22,
    marginBottom: 14,

    backgroundColor: colors.surface,

    shadowColor: "#000",
    shadowOpacity: 0.15,
    shadowRadius: 14,
    shadowOffset: {
      width: 0,
      height: 4,
    },

    elevation: 6,
  },

  cardUnread: {
    borderLeftWidth: 4,
    borderLeftColor: colors.primaryDark,
  },

  cardRead: {
    opacity: 0.75,
    borderWidth: 1,
    borderColor: colors.border,
  },

  iconContainer: {
    width: 42,
    height: 42,
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: colors.primaryDark + "20",
    marginRight: 14,
  },

  messageContainer: {
    flex: 1,
  },

  messageText: {
    fontSize: 15,
    lineHeight: 22,
    color: colors.textPrimary,
    fontWeight: "600",
  },

  messageSecondary: {
    marginTop: 4,
    fontSize: 13,
    color: colors.textSecondary,
  },

  rightContent: {
    alignItems: "flex-end",
    marginLeft: 12,
  },

  timeText: {
    fontSize: 12,
    color: colors.textMuted,
    fontWeight: "600",
  },

  unreadDot: {
    width: 8,
    height: 8,
    borderRadius: 99,
    backgroundColor: colors.primary,
    marginTop: 8,
  },

  floatingButton: {
    position: "absolute",
    bottom: 95,
    right: 24,

    width: 58,
    height: 58,
    borderRadius: 29,

    alignItems: "center",
    justifyContent: "center",

    backgroundColor: colors.primary,

    shadowColor: colors.primary,
    shadowOpacity: 0.4,
    shadowRadius: 12,
    shadowOffset: {
      width: 0,
      height: 6,
    },

    elevation: 8,
  },

  emptyContainer: {
    marginTop: 80,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 32,
  },

  emptyText: {
    marginTop: 12,
    textAlign: "center",
    color: colors.textMuted,
    fontSize: 15,
    lineHeight: 24,
  },
}));
