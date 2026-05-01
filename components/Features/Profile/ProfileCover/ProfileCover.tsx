import { ImageUtils } from "@/utils/imageUri.utils";
import { Image, ImageProps } from "expo-image";
import React, { useMemo } from "react";
import { View } from "react-native";
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

  const finalUri = useMemo(() => {
    console.log("Gerando URI para ProfileCover com imageName:", imageName);
    return ImageUtils.getProfileImageUri(imageName);
  }, [imageName]);

  return (
    <View style={styles.container}>
      <Image
        source={
          finalUri
            ? { uri: finalUri }
            : require("@/assets/images/default_cover_user.svg")
        }
        placeholder={require("@/assets/images/default_cover_user.svg")}
        contentFit="cover"
        style={[styles.image, style]}
        transition={200}
        cachePolicy="memory-disk"
        onError={(e) => console.log("[Expo Image Error]:", e.error)}
        {...props}
      />
    </View>
  );
}
