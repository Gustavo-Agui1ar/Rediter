import { ThemeColors } from "@/styles/types/theme.types";
import { makeStyles } from "@/utils/makeStyles.utils";

const constValues = {
  gap: 20,
  opacity: 0.6,
  postContainerPadding: 16,
  postContainerMarginBottom: 16,
  postContainerBorderRadius: 8,
  skeletonHeaderMarginBottom: 12,
  skeletonAvatarSize: 45,
  skeletonAvatarBorderRadius: 22.5,
  skeletonNameInfoMarginLeft: 12,
  skeletonNameInfoGap: 6,
  skeletonTextBarHeight: 12,
  skeletonTextBarBorderRadius: 4,
  skeletonImageHeight: 200,
  skeletonImageBorderRadius: 8,
  skeletonImageMarginTop: 15,
};

export const useStylesPosts = makeStyles((colors: ThemeColors) => ({
  listContent: {
    flexGrow: 1,
    width: "100%",
    paddingHorizontal: 8,
    paddingBottom: 20,
    gap: constValues.gap,
  },
  footerLoading: {
    paddingVertical: 20,
  },
  emptyText: {
    textAlign: "center",
    marginTop: 50,
    color: colors.textMuted,
    fontSize: 16,
    fontWeight: "bold",
  },

  emptyContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },

  headerContainer: {
    position: "relative",
    bottom: -14,
  },

  // --- Estilos do Skeleton e Container ---
  postContainer: {
    backgroundColor: colors.background,
    padding: constValues.postContainerPadding,
    marginBottom: constValues.postContainerMarginBottom,
    borderRadius: constValues.postContainerBorderRadius,
  },
  skeletonHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: constValues.skeletonHeaderMarginBottom,
  },
  skeletonAvatar: {
    width: constValues.skeletonAvatarSize,
    height: constValues.skeletonAvatarSize,
    borderRadius: constValues.skeletonAvatarBorderRadius,
    backgroundColor: colors.border || "#E1E9EE",
    opacity: constValues.opacity,
  },
  skeletonNameInfo: {
    marginLeft: constValues.skeletonNameInfoMarginLeft,
    gap: constValues.skeletonNameInfoGap,
  },
  skeletonTextBar: {
    height: constValues.skeletonTextBarHeight,
    backgroundColor: colors.border || "#E1E9EE",
    borderRadius: constValues.skeletonTextBarBorderRadius,
    opacity: constValues.opacity,
  },
  skeletonImage: {
    width: "100%",
    height: constValues.skeletonImageHeight,
    backgroundColor: colors.border || "#E1E9EE",
    borderRadius: constValues.skeletonImageBorderRadius,
    marginTop: constValues.skeletonImageMarginTop,
    opacity: constValues.opacity,
  },
}));
