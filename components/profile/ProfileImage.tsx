import { Image } from "react-native";

interface ProfileImageProps {
  imageUrl?: string;
  size?: number;
  wrapper?: boolean;
}
const defaultImage = "https://cdn-icons-png.flaticon.com/512/149/149071.png"; // avatar genérico

export function ProfileImage({
  imageUrl,
  size = 100,
  wrapper,
}: ProfileImageProps) {
  return (
    <Image
      source={{ uri: imageUrl || defaultImage }}
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
