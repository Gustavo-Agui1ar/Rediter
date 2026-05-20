import { ThemeColors } from "@/styles/types/theme.types";
import { makeStyles } from "@/utils/makeStyles.utils";

export const useDropdownStyles = makeStyles((colors: ThemeColors) => ({
  trigger: {
    height: 56,
    borderRadius: 18,
    paddingHorizontal: 18,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: colors.surface ?? "#141B2D",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.06)",
    shadowColor: colors.black,
    shadowOffset: {
      width: 0,
      height: 8,
    },

    shadowOpacity: 0.12,
    shadowRadius: 12,
    elevation: 4,
  },

  disabled: {
    opacity: 0.45,
  },

  triggerText: {
    color: colors.textPrimary ?? "#F3F4F6",
    fontSize: 15,
    fontWeight: "500",
  },

  chevron: {
    color: colors.textMuted ?? "#9CA3AF",
    fontSize: 18,
    marginTop: -2,
  },

  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.45)",
    justifyContent: "center",
    paddingHorizontal: 24,
  },

  modal: {
    backgroundColor: colors.surface ?? "#141B2D",
    borderRadius: 24,
    paddingVertical: 10,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.06)",
    shadowColor: colors.black,

    shadowOffset: {
      width: 0,
      height: 12,
    },

    shadowOpacity: 0.25,
    shadowRadius: 20,
    elevation: 10,
  },

  option: {
    height: 52,
    paddingHorizontal: 18,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    borderRadius: 14,
    marginHorizontal: 8,
  },

  selectedOption: {
    backgroundColor: "rgba(99,102,241,0.14)",
  },

  optionText: {
    color: colors.textPrimary ?? "#F3F4F6",
    fontSize: 15,
    fontWeight: "500",
  },

  selectedOptionText: {
    color: colors.textPrimary ?? "#F3F4F6",
  },

  dot: {
    width: 8,
    height: 8,
    borderRadius: 999,
    backgroundColor: colors.primary ?? "#F3F4F6",
  },
}));
