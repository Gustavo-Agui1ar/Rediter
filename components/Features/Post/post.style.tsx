import { ThemeColors } from "@/styles/types/theme.types";
import { makeStyles } from "@/utils/makeStyles.utils";

export const usePostStyles = makeStyles((colors: ThemeColors) => ({
  container: {
    width: "100%",
    paddingVertical: 16,
    paddingHorizontal: 20,
    backgroundColor: colors.background,
    borderWidth: 1,
    borderColor: colors.divider,
    borderRadius: 12,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    zIndex: 10,
  },
  userInfo: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  userTextContainer: {
    marginLeft: 12,
    justifyContent: "center",
  },
  username: {
    fontSize: 16,
    fontWeight: "700",
    color: colors.textPrimary,
    marginBottom: 2,
  },
  metaDataContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  timeText: {
    fontSize: 13,
    color: colors.textMuted,
  },
  editedText: {
    fontSize: 13,
    color: colors.textMuted,
    fontStyle: "italic",
  },
  optionsWrapper: {
    position: "relative",
    left: 8,
    top: -8,
  },
  dropdownMenu: {
    position: "absolute",
    right: 0,
    top: 36,
    backgroundColor: colors.background,
    borderRadius: 12,
    minWidth: 160,
    borderWidth: 1,
    borderColor: colors.divider,
    elevation: 4,
    shadowColor: colors.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    zIndex: 999,
  },
  contentBody: {
    marginTop: 12,
    zIndex: 1,
  },
  description: {
    fontSize: 15,
    lineHeight: 22,
    color: colors.textPrimary,
    marginBottom: 12,
  },
  imageContainer: {
    borderRadius: 12,
    overflow: "hidden",
  },
  locationBadge: {
    alignSelf: "flex-start",
    backgroundColor: colors.divider,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 16,
    marginTop: 12,
  },
  locationText: {
    fontSize: 12,
    fontWeight: "500",
    color: colors.textSecondary,
  },
  buttonContainer: {
    flexDirection: "row",
    marginTop: 18,
    justifyContent: "space-between",
    paddingRight: 40,
  },
  actionGroup: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    paddingVertical: 4,
  },
  actionLabel: {
    fontSize: 13,
    color: colors.textMuted,
    fontWeight: "500",
  },
  itemOptionsContainer: {
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: colors.divider,
  },
  itemOptionsContainerLast: {
    borderBottomWidth: 0,
  },
  optionText: {
    color: colors.textPrimary,
    fontSize: 15,
    fontWeight: "500",
  },
  optionTextDelete: {
    color: colors.error,
    fontSize: 15,
    fontWeight: "500",
  },
}));
