import { useImageUtils } from "@/utils/imageUri.utils";
import { Image, ImageProps } from "expo-image";
import { memo, useCallback, useMemo } from "react";
import { View } from "react-native";
import { useStylesProfileCover } from "./ProfileCover.style";

interface ProfileCoverProps extends Omit<ImageProps, "source"> {
  imageName?: string;
}

const DEFAULT_COVER_IMAGE = require("@/assets/images/default_cover_user.svg");

const ProfileCover = ({ imageName, style, ...props }: ProfileCoverProps) => {
  const styles = useStylesProfileCover();
  const { getSafeUri } = useImageUtils();

  const imageSource = useMemo(() => {
    return getSafeUri(imageName, false) || DEFAULT_COVER_IMAGE;
  }, [imageName]);

  const combinedStyle = useMemo(() => {
    return [styles.image, style];
  }, [styles.image, style]);

  const handleError = useCallback((e: any) => {
    if (__DEV__) {
      console.log("[Expo Image Error]:", e.error);
    }
  }, []);

  return (
    <View style={styles.container}>
      <Image
        source={imageSource}
        placeholder={DEFAULT_COVER_IMAGE}
        contentFit="cover"
        style={combinedStyle}
        transition={200}
        cachePolicy="memory-disk"
        onError={handleError}
        {...props}
      />
    </View>
  );
};

export default memo(ProfileCover);
