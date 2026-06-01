import { ThemeColors } from "@/styles/types/theme.types";
import { makeStyles } from "@/utils/makeStyles.utils";
import { StyleSheet } from "react-native";

export const useStylesCreateGroup = makeStyles((colors: ThemeColors) => ({
  content: {
    flex: 1,
    padding: 16,
  },
  inputSection: {
    marginTop: 8,
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: "600",
    marginBottom: 8,
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  selectedSection: {
    marginBottom: 16,
  },
  selectedScrollContent: {
    paddingVertical: 8,
    paddingRight: 16,
  },
  selectedAvatarContainer: {
    alignItems: "center",
    width: 72,
    marginRight: 12,
  },
  avatarWrapper: {
    position: "relative",
    marginBottom: 8,
  },
  removeBadge: {
    position: "absolute",
    top: -4,
    right: -6,
    backgroundColor: colors.error,
    width: 22,
    height: 22,
    borderRadius: 11,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 2,
  },
  selectedAvatarName: {
    fontSize: 12,
    fontWeight: "500",
    textAlign: "center",
  },
  resultsHeader: {
    paddingBottom: 8,
    borderBottomWidth: StyleSheet.hairlineWidth,
    marginBottom: 8,
  },
  userRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  fallbackAvatar: {
    justifyContent: "center",
    alignItems: "center",
  },
  fallbackText: {
    color: colors.white,
    fontWeight: "bold",
    fontSize: 18,
  },
  userInfo: {
    flex: 1,
    marginLeft: 12,
  },
  userName: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 2,
  },
  userHandle: {
    fontSize: 14,
  },
  checkbox: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    justifyContent: "center",
    alignItems: "center",
  },
  createButton: {
    borderRadius: 28,
    marginBottom: 16,
  },
  createButtonText: {
    color: colors.white,
    fontSize: 16,
    fontWeight: "bold",
  },
}));
