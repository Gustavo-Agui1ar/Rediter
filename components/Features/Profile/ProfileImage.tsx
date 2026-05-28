import { useRediterBaseConfigs } from "@/context/RediterConfigContext";
import { useImageUtils } from "@/utils/imageUri.utils";
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
  const { getSafeUri } = useImageUtils();

  const imageSource = useMemo(() => {
    return getSafeUri(imageName) || DEFAULT_USER_IMAGE;
  }, [imageName, baseUrl]);

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
