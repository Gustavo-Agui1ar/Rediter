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

  content_fields: {
    width: "100%",
    gap: 24,
  },

  fieldContainer: {
    marginBottom: 0,
    gap: 8,
  },

  helperText: {
    paddingLeft: 8,
  },

  forgotPasswordLink: {
    alignSelf: "flex-end",
    marginBottom: 24,
  },

  googleIcon: {
    width: 20,
    height: 20,
  },

  signUpRow: {
    marginTop: 10,
  },
}));
