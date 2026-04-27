import { ThemeColors } from "@/styles/types/theme.types";
import { makeStyles } from "@/utils/makeStyles.utils";
import { Dimensions } from "react-native";

const { width } = Dimensions.get("window");

const GAP = 6;
export const PADDING_HORIZONTAL = 8;
const AVAILABLE_WIDTH = width - PADDING_HORIZONTAL * 2 - GAP;
const ITEM_WIDTH = AVAILABLE_WIDTH / 2;

export const useMidiaStyles = makeStyles((colors: ThemeColors) => ({
  listContainer: {
    paddingBottom: 20,
    gap: GAP,
  },
  columnWrapper: {
    gap: GAP,
    paddingHorizontal: PADDING_HORIZONTAL,
  },
  imageWrapper: {
    width: ITEM_WIDTH,
    aspectRatio: 1.0,
    backgroundColor: colors.background,
    borderRadius: 4,

    shadowColor: colors.black || "#000000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.15,
    shadowRadius: 3.84,

    elevation: 3,
  },
  image: {
    width: "100%",
    height: "100%",
    borderRadius: 4,
  },

  skeletonGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    paddingHorizontal: PADDING_HORIZONTAL,
    gap: GAP,
    justifyContent: "space-between",
  },
  skeletonItem: {
    backgroundColor: colors.border || "#E0E0E0",
    marginBottom: GAP,
    borderRadius: 4,
  },

  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  emptyStateContainer: {
    padding: 20,
    alignItems: "center",
    marginTop: 50,
  },
  emptyStateText: {
    color: colors.textSecondary,
  },
  modalSafeArea: {
    flex: 1,
    backgroundColor: colors.overlayDark,
  },
  modalHeader: {
    position: "absolute",
    top: 0,
    right: 0,
    zIndex: 10,
  },
  modalCarouselItem: {
    width: width,
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  modalCarouselImage: {
    width: width,
    flex: 1,
  },

  headerContainer: {
    width: "100%",
    padding: 0,
  },
}));
