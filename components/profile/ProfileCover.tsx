import { Image, View } from "react-native";

interface ProfileCoverProps {
  imageUrl: string;
}

export function ProfileCover({ imageUrl }: ProfileCoverProps) {
  return (
    <View
      style={{
        width: "100%",
        aspectRatio: 2,
        backgroundColor: "#333",
      }}
    >
      <Image
        source={{ uri: imageUrl }}
        style={{ width: "100%", height: "100%" }}
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
