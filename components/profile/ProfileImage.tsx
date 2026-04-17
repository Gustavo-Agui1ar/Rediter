import { Image } from "react-native";

interface ProfileImageProps {
  imageUrl?: string;
  size?: number;
  wrapper?: boolean;
}

export function ProfileImage({
  imageUrl,
  size = 100,
  wrapper,
}: ProfileImageProps) {
  return (
    <Image
      source={
        imageUrl
          ? { uri: imageUrl }
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
