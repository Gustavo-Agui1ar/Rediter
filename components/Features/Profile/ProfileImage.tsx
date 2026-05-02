import { getBaseURL } from "@/utils/configs.utils";
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
    try {
      if (!imageName || typeof imageName !== "string") {
        return null;
      }

      if (imageName.startsWith("http") || imageName.startsWith("file://")) {
        return imageName;
      }

      const baseUrl = getBaseURL();
      return `${baseUrl}/api/pictures/${encodeURIComponent(imageName)}`;
    } catch (error) {
      console.error("Erro interno ao gerar a URI da ProfileImage:", error);
      return null;
    }
  }, [imageName]);

  return (
    <Image
      source={
        finalUri
          ? { uri: finalUri }
          : require("@/assets/images/default_user.svg")
      }
      style={[
        {
          width: size,
          height: size,
          borderRadius: size / 2,
        },
        wrapper
          ? {
              position: "absolute",
              bottom: -(size / 2),
              left: 20,
            }
          : undefined,
      ]}
      contentFit="cover"
      transition={200}
      cachePolicy="memory-disk"
    />
  );
}
