import { makeStyles } from "@/utils/makeStyles.utils";
import { ThemeColors } from "./types/theme.types";

export const useIndexStyle = makeStyles((colors: ThemeColors) => ({
  content_login: {
    flex: 1,
    flexGrow: 0.7,
    width: "80%",
    gap: 20,
    alignItems: "center",
    justifyContent: "center",
    margin: "auto",
  },
}));
