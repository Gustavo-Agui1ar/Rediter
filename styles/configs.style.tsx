import { makeStyles } from "@/utils/makeStyles.utils";
import { ThemeColors } from "./types/theme.types";

export const useConfigsStyles = makeStyles((colors: ThemeColors) => ({
  imageFix: {
    alignItems: "center",
    marginBottom: 20,
    position: "absolute",
    top: 10,
  },

  label: {
    fontSize: 16,
    color: colors.textMuted,
  },

  iconButtonContainer: {
    flexDirection: "row",
    justifyContent: "flex-start",
    alignItems: "center",
    gap: 10,
  },

  labelContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
  },

  lastContainerConfig: {
    minHeight: 100,
    gap: 24,
    paddingBottom: 60,
  },

  iconButtonFix: {
    justifyContent: "flex-start",
    width: "100%",
    marginBottom: 20,
  },

  contentTextFix: {
    gap: 25,
    marginTop: -40,
    width: "90%",
  },

  coverOverlay: {
    position: "relative",
    overflow: "hidden",
    borderRadius: 10,
  },

  configsContainer: {
    paddingBottom: 20,
  },

  profileImageOverlay: {
    alignItems: "flex-start",
    marginTop: -60,
    marginLeft: 20,
  },

  profileImageFix: {
    borderRadius: 60,
    overflow: "hidden",
    position: "relative",
    backgroundColor: colors.background,
  },
}));
