import { ThemeColors } from "@/styles/types/theme.types";
import { makeStyles } from "@/utils/makeStyles.utils";

export const useStylesForgotPassword = makeStyles((colors: ThemeColors) => ({
  content: {
    flex: 1,
    flexGrow: 0.4,
    width: "80%",
    gap: 20,
    alignItems: "center",
    justifyContent: "center",
  },
}));
