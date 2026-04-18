import { Button, Header, IconButton, TextBox } from "@/components/components";
import { styles } from "@/styles/theme";
import { pickImage } from "@/utils/filePicker";
import * as Location from "expo-location";
import { useState } from "react";
import {
  Alert,
  DimensionValue,
  Image,
  Keyboard,
  KeyboardAvoidingView,
  ScrollView,
  Text,
  View,
} from "react-native";
import { EmojiKeyboard } from "rn-emoji-keyboard";

export default function NewPost() {
  const [files, setFiles] = useState<any[]>([]);
  const [showEmoji, setShowEmoji] = useState(false);
  const [text, setText] = useState("");

  // Novo estado para armazenar a localização
  const [locationName, setLocationName] = useState<string | null>(null);

  const getColumns = (length: number) => {
    if (length === 1) return 1;
    if (length <= 4) return 2;
    return 3;
  };

  const numColumns = getColumns(files.length);
  const size: DimensionValue = `${100 / numColumns}%`;

  const handleGetLocation = async () => {
    try {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        Alert.alert(
          "Aviso",
          "Precisamos de permissão para acessar sua localização.",
        );
        return;
      }

      let currentPosition = await Location.getLastKnownPositionAsync({});

      if (!currentPosition) {
        currentPosition = await Location.getCurrentPositionAsync({
          accuracy: Location.Accuracy.Lowest,
          timeInterval: 10000,
        });
      }

      if (!currentPosition) {
        Alert.alert("Aviso", "Ligue o GPS do seu celular para fazer check-in.");
        return;
      }

      let address = await Location.reverseGeocodeAsync(currentPosition.coords);

      console.log("Endereço obtido:", address);

      if (address.length > 0) {
        const city = address[0].city || address[0].subregion;
        const region = address[0].region;
        setLocationName(`${city}, ${region}`);
      }
    } catch (error) {
      console.error("Erro ao obter localização:", error);
      Alert.alert(
        "Erro",
        "Não foi possível obter a localização. Verifique se o GPS está ligado.",
      );
    }
  };

  return (
    <KeyboardAvoidingView style={styles.container} behavior={"height"}>
      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.scroll_content}
        keyboardShouldPersistTaps="handled"
      >
        <Header title="Criar Post" />

        <View
          style={[
            styles.content,
            { justifyContent: "flex-start", paddingTop: 16, width: "95%" },
          ]}
        >
          <TextBox
            placeholder="O que você está pensando?"
            value={text}
            onChangeText={setText}
            onFocus={() => setShowEmoji(false)}
          >
            {/* IMAGENS */}
            {files.length > 0 && (
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
                        source={{ uri: file.uri }}
                        style={{ width: "100%", height: "100%" }}
                      />
                      <View style={{ position: "absolute", top: 8, right: 8 }}>
                        <IconButton
                          icon="close"
                          type="none"
                          size={32}
                          onPress={() =>
                            setFiles((prev) =>
                              prev.filter((_, i) => i !== index),
                            )
                          }
                        />
                      </View>
                    </View>
                  </View>
                ))}
              </View>
            )}

            <View style={{ marginTop: 16, gap: 12 }}>
              {locationName && (
                <View
                  style={{ flexDirection: "row", alignItems: "center", gap: 6 }}
                >
                  <Text
                    style={{
                      color: "#a0a0a0",
                      fontSize: 14,
                      fontWeight: "bold",
                    }}
                  >
                    📍 Em {locationName}
                  </Text>
                  <IconButton
                    icon="close"
                    type="none"
                    size={20}
                    onPress={() => setLocationName(null)} // Botão para remover a localização
                  />
                </View>
              )}

              {/* BARRAS DE BOTÕES */}
              <View
                style={{
                  alignSelf: "flex-start",
                  flexDirection: "row",
                  gap: 10,
                }}
              >
                <IconButton
                  icon="image"
                  type="fill"
                  size={28}
                  onPress={async () => {
                    const result = await pickImage();
                    if (result) setFiles((prev) => [...prev, result]);
                  }}
                />
                <IconButton
                  icon="emoji"
                  type="fill"
                  size={28}
                  onPress={() => {
                    Keyboard.dismiss();
                    setShowEmoji((prev) => !prev);
                  }}
                />
                <IconButton
                  icon="location"
                  type="fill"
                  size={28}
                  onPress={handleGetLocation}
                />
              </View>
            </View>
          </TextBox>
          <Button title="Publicar" />
        </View>
      </ScrollView>

      {/* Renderização do seletor de Emojis */}
      {showEmoji && (
        <View
          style={{
            height: 320,
            backgroundColor: "#fff",
            borderTopWidth: 1,
            borderColor: "#e0e0e0",
          }}
        >
          <EmojiKeyboard
            onEmojiSelected={(emojiObject) =>
              setText((prev) => prev + emojiObject.emoji)
            }
            allowMultipleSelections
          />
        </View>
      )}
    </KeyboardAvoidingView>
  );
}
