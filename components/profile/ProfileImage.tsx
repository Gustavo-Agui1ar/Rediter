import { configs } from "@/utils/configs";
import { Image } from "react-native";

interface ProfileImageProps {
  imageName?: string;
  size?: number;
  wrapper?: boolean;
}

export function ProfileImage({
  imageName,
  size = 100,
  wrapper,
}: ProfileImageProps) {
  const getFullUrl = () => {
    if (!imageName) return null;

    if (imageName.startsWith("http") || imageName.startsWith("file://")) {
      return imageName;
    }

    return `${configs.apiUrls[0]}/Picture/GetPicture?name=${encodeURIComponent(imageName)}`;
  };

  const finalUri = getFullUrl();

  return (
    <Image
      source={
        finalUri
          ? { uri: finalUri }
          : require("@/assets/images/default_user.png")
      }
      style={{
        width: size,
        height: size,
        borderRadius: size / 2,
        ...(wrapper && {
          position: "absolute",
          bottom: -(size / 2),
          left: 20,
        }),
      }}
    />
  );
}
