import { ThemeColors } from "@/styles/types/theme.types";
import { makeStyles } from "@/utils/makeStyles.utils";

export const useStylesPerfil = makeStyles((colors: ThemeColors) => {
  // Define a cor base do esqueleto usando o seu tema com um fallback seguro
  const skeletonBg = colors.border || "#2A2A35";
  const elementBg = colors.background || "#121214";

  return {
    header: {
      width: "100%",
      backgroundColor: colors.surface,
    },

    avatarWrapper: {
      position: "absolute",
      bottom: -60,
      left: 20,
      alignSelf: "center",
    },

    actionsContainer: {
      marginTop: 70,
      paddingHorizontal: 8,
      width: "100%",
    },

    feedContainer: {
      flex: 1,
      width: "100%",
    },

    // ========================================================================
    // SKELETON
    // ========================================================================

    skeletonCover: {
      width: "100%",
      height: 220,
      backgroundColor: skeletonBg,
    },

    backButton: {
      position: "absolute",
      top: 40,
      left: 16,
      backgroundColor: "rgba(0,0,0,0.4)",
      padding: 8,
      borderRadius: 20,
      zIndex: 10,
    },

    avatarWrapperSkeleton: {
      position: "absolute",
      left: 16,
      bottom: -50,
      zIndex: 5,
    },

    skeletonAvatar: {
      width: 100,
      height: 100,
      borderRadius: 50,
      backgroundColor: skeletonBg,
      borderWidth: 4,
      borderColor: elementBg,
    },

    skeletonConfigBtn: {
      position: "absolute",
      right: 16,
      bottom: -20,
      width: 42,
      height: 42,
      borderRadius: 21,
      backgroundColor: skeletonBg,
      borderWidth: 2,
      borderColor: elementBg,
    },

    skeletonActionsContainer: {
      paddingTop: 64,
      paddingHorizontal: 16,
    },

    skeletonName: {
      width: 220,
      height: 24,
      borderRadius: 8,
      backgroundColor: skeletonBg,
      marginBottom: 12,
    },

    skeletonBio: {
      width: "75%",
      height: 14,
      borderRadius: 6,
      backgroundColor: skeletonBg,
      marginBottom: 18,
    },

    skeletonStatsRow: {
      flexDirection: "row",
      alignItems: "center",
      gap: 12,
    },

    skeletonStatBox1: {
      width: 90,
      height: 14,
      borderRadius: 6,
      backgroundColor: skeletonBg,
    },

    skeletonStatBox2: {
      width: 90,
      height: 14,
      borderRadius: 6,
      backgroundColor: skeletonBg,
    },

    skeletonTabsContainer: {
      flexDirection: "row",
      justifyContent: "space-around",
      alignItems: "center",
      marginTop: 24,
      paddingBottom: 12,
      borderBottomWidth: 1,
      borderBottomColor: skeletonBg,
    },

    skeletonTabItem: {
      width: 60,
      height: 16,
      borderRadius: 8,
      backgroundColor: skeletonBg,
    },

    skeletonPostContainer: {
      paddingHorizontal: 12,
      paddingTop: 12,
      gap: 16,
    },

    skeletonPostCard: {
      width: "100%",
      borderRadius: 16,
      backgroundColor: "#111320",
      padding: 14,
    },

    skeletonPostHeader: {
      flexDirection: "row",
      alignItems: "center",
      marginBottom: 14,
    },

    skeletonPostAvatar: {
      width: 42,
      height: 42,
      borderRadius: 21,
      backgroundColor: skeletonBg,
    },

    skeletonPostInfo: {
      marginLeft: 12,
    },

    skeletonPostLine1: {
      width: 140,
      height: 12,
      borderRadius: 4,
      backgroundColor: skeletonBg,
      marginBottom: 6,
    },

    skeletonPostLine2: {
      width: 90,
      height: 10,
      borderRadius: 4,
      backgroundColor: skeletonBg,
    },

    skeletonPostText: {
      width: "60%",
      height: 12,
      borderRadius: 4,
      backgroundColor: skeletonBg,
      marginBottom: 16,
    },

    skeletonPostImage: {
      width: "100%",
      height: 220,
      borderRadius: 14,
      backgroundColor: skeletonBg,
      marginBottom: 16,
    },

    skeletonPostActions: {
      flexDirection: "row",
      alignItems: "center",
      gap: 16,
    },

    skeletonActionCircle: {
      width: 26,
      height: 26,
      borderRadius: 13,
      backgroundColor: skeletonBg,
    },
  };
});
