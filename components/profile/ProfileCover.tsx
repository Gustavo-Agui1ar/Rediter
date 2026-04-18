import { Colors } from "@/styles/theme";
import { Image, ImageProps, View } from "react-native";

interface ProfileCoverProps extends ImageProps {
  imageUrl?: string;
}

export function ProfileCover({ imageUrl, ...props }: ProfileCoverProps) {
  return (
    <View
      style={{
        width: "100%",
        aspectRatio: 2,
        backgroundColor: Colors.divider,
      }}
    >
      <Image
        source={
          imageUrl
            ? { uri: imageUrl }
            : require("@/assets/images/default_cover_user.jpg")
        }
        style={{ width: "100%", height: "100%", objectFit: "cover" }}
        {...props}
      />
    </View>
  );
}

export const styleCover = {
  avatarWrapper: {
    position: "absolute",
    bottom: -60, // metade do tamanho (120 / 2)
    left: 20,
  },
};
