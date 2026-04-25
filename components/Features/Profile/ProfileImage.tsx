import { configs } from "@/utils/configs.utils";
import { Image } from "expo-image";
import React, { useMemo } from "react";

interface ProfileImageProps {
  imageName?: string;
  size?: number;
  wrapper?: boolean;
}

export default function ProfileImage({
  imageName,
  size = 100,
  wrapper,
}: ProfileImageProps) {
  const finalUri = useMemo(() => {
    if (!imageName) return null;

    if (imageName.startsWith("http") || imageName.startsWith("file://")) {
      return imageName;
    }

    return `${configs.apiUrls[0]}/Picture/GetPicture?name=${encodeURIComponent(imageName)}`;
  }, [imageName]);

  return (
    <Image
      source={
        finalUri
          ? { uri: finalUri }
          : require("@/assets/images/default_user.png")
      }
      style={[
        {
          width: size,
          height: size,
          borderRadius: size / 2,
        },
        wrapper && {
          position: "absolute",
          bottom: -(size / 2),
          left: 20,
        },
      ]}
      contentFit="cover"
      transition={200}
      cachePolicy="memory-disk"
    />
  );
}
