import { useRediterBaseConfigs } from "@/context/RediterConfigContext";
import { Image, ImageStyle } from "expo-image";
import { memo, useMemo } from "react";
import { StyleProp } from "react-native";

interface ProfileImageProps {
  imageName?: string;
  size?: number;
  wrapper?: boolean;
}

const DEFAULT_USER_IMAGE = require("@/assets/images/default_user.svg");

const ProfileImage = ({
  imageName,
  size = 100,
  wrapper,
}: ProfileImageProps) => {
  const { baseUrl } = useRediterBaseConfigs();

  const finalUri = useMemo(() => {
    try {
      if (!imageName || typeof imageName !== "string") {
        return null;
      }

      if (imageName.startsWith("http") || imageName.startsWith("file://")) {
        return imageName;
      }

      return `${baseUrl}/api/pictures/${encodeURIComponent(imageName)}`;
    } catch (error) {
      console.error("Erro interno ao gerar a URI da ProfileImage:", error);
      return null;
    }
  }, [imageName]);

  const imageSource = useMemo(() => {
    return finalUri ? { uri: finalUri } : DEFAULT_USER_IMAGE;
  }, [finalUri]);

  const imageStyle = useMemo<StyleProp<ImageStyle>>(() => {
    const baseStyle = {
      width: size,
      height: size,
      borderRadius: size / 2,
    };

    if (wrapper) {
      return [
        baseStyle,
        {
          position: "absolute" as const,
          bottom: -(size / 2),
          left: 20,
        },
      ];
    }

    return baseStyle;
  }, [size, wrapper]);

  return (
    <Image
      source={imageSource}
      style={imageStyle}
      contentFit="cover"
      transition={200}
      cachePolicy="memory-disk"
    />
  );
};

export default memo(ProfileImage);
