import * as ImagePicker from "expo-image-picker";

export async function pickImage(isSquare: boolean = true) {
  const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
  if (!permission.granted) throw new Error("Sem permissão");

  const result = await ImagePicker.launchImageLibraryAsync({
    mediaTypes: ["images"],
    quality: 1,
    allowsEditing: false,
  });

  if (result.canceled) return null;
  return result.assets[0];
}
