import { configs } from "@/utils/configs.utils";
import { Image, ImageProps, View } from "react-native";
import { useStylesProfileCover } from "./ProfileCover.style";

interface ProfileCoverProps extends Omit<ImageProps, "source"> {
  imageName?: string;
}

export default function ProfileCover({
  imageName,
  style,
  ...props
}: ProfileCoverProps) {
  const styles = useStylesProfileCover();

  const getFullUrl = () => {
    if (!imageName) return null;

    if (imageName.startsWith("http") || imageName.startsWith("file://")) {
      return imageName;
    }

    return `${configs.apiUrls[0]}/Picture/GetPicture?name=${encodeURIComponent(imageName)}`;
  };

  const finalUri = getFullUrl();

  return (
    <View style={styles.container}>
      <Image
        source={
          finalUri
            ? { uri: finalUri }
            : require("@/assets/images/default_cover_user.jpg")
        }
        style={[styles.image, style]}
        {...props}
      />
    </View>
  );
}
