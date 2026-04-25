import { useTheme } from "@/context/ThemeContext";
import { configs } from "@/utils/configs.utils";
import { Image, ImageProps, View } from "react-native";

interface ProfileCoverProps extends Omit<ImageProps, "source"> {
  imageName?: string;
}

export default function ProfileCover({
  imageName,
  style,
  ...props
}: ProfileCoverProps) {
  const { colors } = useTheme();
  const getFullUrl = () => {
    if (!imageName) return null;

    if (imageName.startsWith("http") || imageName.startsWith("file://")) {
      return imageName;
    }

    return `${configs.apiUrls[0]}/Picture/GetPicture?name=${encodeURIComponent(imageName)}`;
  };

  const finalUri = getFullUrl();

  return (
    <View
      style={{
        width: "100%",
        aspectRatio: 2,
        backgroundColor: colors.divider,
      }}
    >
      <Image
        source={
          finalUri
            ? { uri: finalUri }
            : require("@/assets/images/default_cover_user.jpg")
        }
        style={[{ width: "100%", height: "100%", objectFit: "cover" }, style]}
        {...props}
      />
    </View>
  );
}

export const styleCover = {
  avatarWrapper: {
    position: "absolute" as const,
    bottom: -60,
    left: 20,
  },
};
