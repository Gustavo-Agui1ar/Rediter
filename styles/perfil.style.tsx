import { ThemeColors } from "@/styles/types/theme.types";
import { makeStyles } from "@/utils/makeStyles.utils";

export const useStylesPerfil = makeStyles((colors: ThemeColors) => ({
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
}));
