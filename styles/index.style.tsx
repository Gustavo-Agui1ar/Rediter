import { makeStyles } from "@/utils/makeStyles.utils";
import { ThemeColors } from "./types/theme.types";

export const useIndexStyle = makeStyles((colors: ThemeColors) => ({
  content_login: {
    width: "100%",
    maxWidth: 420,
    alignSelf: "center",
    padding: 20,
    justifyContent: "center",
    alignItems: "stretch",
    gap: 24,
  },

  content_fields: {
    width: "100%",
    gap: 20,
  },

  fieldContainer: {
    width: "100%",
    gap: 4,
  },

  helperText: {
    paddingLeft: 4,
  },

  forgotPasswordLink: {
    alignSelf: "flex-end",
    marginTop: -8,
    marginBottom: 8,
  },

  googleIcon: {
    width: 24,
    height: 24,
  },

  signUpRow: {
    marginTop: 16,
    alignItems: "center",
    justifyContent: "center",
  },
}));
