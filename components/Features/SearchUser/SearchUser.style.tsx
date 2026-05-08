import { ThemeColors } from "@/styles/types/theme.types";
import { makeStyles } from "@/utils/makeStyles.utils";

export const useStylesSearchUsers = makeStyles((colors: ThemeColors) => ({
  listContent: {
    paddingBottom: 20,
  },
  skeletonContainer: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
    gap: 12,
  },
  skeletonAvatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: colors.border,
  },
  skeletonName: {
    width: 120,
    height: 14,
    borderRadius: 4,
    backgroundColor: colors.border,
  },
  footerLoading: {
    paddingVertical: 20,
    alignItems: "center",
  },
  emptyContainer: {
    padding: 40,
    alignItems: "center",
  },
  emptyText: {
    color: colors.textSecondary,
    textAlign: "center",
  },
}));
