import { IconButton } from "@/components/components";
import { configs } from "@/utils/configs.utils";
import { DimensionValue, Image, View } from "react-native";

interface DisplayImagesProps {
  files: any[];
  onRemoveImage?: (index: number) => void;
}

export function DisplayImages({ files, onRemoveImage }: DisplayImagesProps) {
  if (!files || files.length === 0) return null;

  const getColumns = (length: number) => {
    if (length === 1) return 1;
    if (length <= 4) return 2;
    return 3;
  };

  const numColumns = getColumns(files.length);
  const size: DimensionValue = `${100 / numColumns}%`;

  const getImageUri = (item: any) => {
    // Cenário 1: É um objeto (expo-image-picker)
    if (item && typeof item === "object" && item.uri) {
      return item.uri;
    }

    // Cenário 2: É apenas uma string
    if (typeof item === "string") {
      if (item.startsWith("http") || item.startsWith("file://")) {
        return item;
      }
      return `${configs.apiUrls[0]}/Picture/GetPicture?name=${encodeURIComponent(item)}`;
    }

    return "";
  };

  return (
    <View
      style={{
        flexDirection: "row",
        flexWrap: "wrap",
        marginHorizontal: -4,
        marginTop: 16,
      }}
    >
      {files.map((file, index) => (
        <View key={index} style={{ width: size, padding: 4 }}>
          <View
            style={{
              width: "100%",
              aspectRatio: 1,
              borderRadius: 8,
              overflow: "hidden",
            }}
          >
            <Image
              source={{ uri: getImageUri(file) }}
              style={{ width: "100%", height: "100%" }}
            />

            {onRemoveImage && (
              <View style={{ position: "absolute", top: 8, right: 8 }}>
                <IconButton
                  icon="close"
                  type="none"
                  size={32}
                  onPress={() => onRemoveImage(index)}
                />
              </View>
            )}
          </View>
        </View>
      ))}
    </View>
  );
}
