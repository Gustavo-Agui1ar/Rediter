import { makeStyles } from "@/utils/makeStyles.utils";

export const usePostStyles = makeStyles((colors: any) => ({
  container: {
    width: "100%",
    padding: 16,
    backgroundColor: colors.background,
    borderWidth: 1.2,
    borderRadius: 12,
    borderColor: colors.disabled,
    marginBottom: 4,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    zIndex: 100,
  },
  userInfo: {
    flexDirection: "row",
    alignItems: "center",
  },
  optionsWrapper: {
    position: "relative",
  },
  dropdownMenu: {
    position: "absolute",
    right: 0,
    top: 30,
    backgroundColor: colors.background,
    borderRadius: 8,
    minWidth: 170,
    borderWidth: 1,
    borderColor: colors.divider,
    elevation: 5,
    shadowColor: colors.black,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    zIndex: 999,
  },
  username: {
    fontSize: 16,
    color: colors.textPrimary,
  },
  edited: {
    fontSize: 11,
    color: colors.textMuted,
    marginTop: 2,
  },
  contentBody: {
    marginTop: 12,
    zIndex: 1,
  },
  description: {
    fontSize: 15,
    lineHeight: 22,
    color: colors.textSecondary,
    marginBottom: 10,
  },
  location: {
    fontSize: 12,
    fontWeight: "600",
    color: colors.textMuted,
    marginTop: 8,
  },
  buttonContainer: {
    flexDirection: "row",
    marginTop: 16,
    justifyContent: "space-between",
    paddingHorizontal: 20,
  },
  actionButton: {
    padding: 8,
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
  },

  optionTextDelete: {
    color: colors.error,
    fontSize: 15,
  },
}));
