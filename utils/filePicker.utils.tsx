import * as DocumentPicker from "expo-document-picker";

export async function pickImage() {
  const result = await DocumentPicker.getDocumentAsync({
    type: "image/png", // Força apenas PNG para manter o efeito
    copyToCacheDirectory: true,
  });

  if (result.canceled) return null;

  // Retorna no mesmo formato que o seu código já espera
  return {
    uri: result.assets[0].uri,
    width: 0, // O DocumentPicker não dá as dimensões de cara
    height: 0,
  };
}
