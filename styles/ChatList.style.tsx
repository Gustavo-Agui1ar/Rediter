import { ThemeColors } from "@/styles/types/theme.types";
import { makeStyles } from "@/utils/makeStyles.utils";

export const useStylesChatsList = makeStyles((colors: ThemeColors) => ({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: "bold",
    color: colors.textPrimary,
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  centerContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },

  plusButton: {
    position: "absolute",
    right: -6,
    bottom: 16,
  },

  emptyText: {
    color: colors.textSecondary,
    fontSize: 16,
    textAlign: "center",
  },
  listContent: {
    paddingBottom: 24,
  },
  footerLoader: {
    marginVertical: 16,
  },

  // Estilo do Item da Lista
  chatItem: {
    flexDirection: "row",
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: colors.divider || "rgba(0,0,0,0.05)",
    alignItems: "center",
  },
  chatItemPressed: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.05)", // Feedback visual ao clicar
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: colors.primaryDark || "#ccc",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 16,
  },
  avatarText: {
    color: "#fff",
    fontSize: 20,
    fontWeight: "bold",
  },
  chatInfo: {
    flex: 1,
    justifyContent: "center",
  },
  chatHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 4,
  },
  userName: {
    fontSize: 16,
    fontWeight: "bold",
    color: colors.textPrimary,
    flex: 1,
    marginRight: 8,
  },
  timeText: {
    fontSize: 12,
    color: colors.textSecondary,
  },
  chatFooter: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  lastMessage: {
    fontSize: 14,
    color: colors.textSecondary,
    flex: 1,
    marginRight: 16,
  },
  unreadBadge: {
    backgroundColor: colors.primaryDark || colors.primary,
    borderRadius: 16,
    paddingHorizontal: 2,
    paddingVertical: 2,
    minWidth: 22,
    alignItems: "center",
  },
  unreadText: {
    color: colors.white,
    fontSize: 12,
    fontWeight: "bold",
  },
}));
