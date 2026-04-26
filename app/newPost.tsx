import {
  Button,
  DisplayImages,
  Header,
  IconButton,
  TextBox,
} from "@/components/components";
import { useLoading } from "@/context/loadingContext";
import { NewPostScript } from "@/scripts/newPost.script";
import { useGlobalStyles } from "@/styles/global.styles";
import { useNewPostStyles } from "@/styles/newPost.style";
import { pickImage } from "@/utils/filePicker.utils";
import { handleGetLocation } from "@/utils/location.utils";
import { useLocalSearchParams } from "expo-router";
import { useEffect, useState } from "react";
import {
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
  const [locationName, setLocationName] = useState<string | null>(null);
  const { setLoading } = useLoading();
  const [postId, setPostId] = useState<string | null>(null);

  const params = useLocalSearchParams();

  const globalStyles = useGlobalStyles();
  const localStyles = useNewPostStyles();

  const isEditingParam = params.isEditing;
  const postIdParam = params.postId;
  const textParam = params.text;
  const locationParam = params.location;
  const imageUrlsParam = params.imageUrls;

  useEffect(() => {
    if (isEditingParam === "true") {
      if (postIdParam && typeof postIdParam === "string") {
        setPostId(postIdParam);
      }

      if (textParam && typeof textParam === "string") {
        setText(textParam);
      }

      if (locationParam && typeof locationParam === "string") {
        setLocationName(locationParam);
      }

      if (imageUrlsParam && typeof imageUrlsParam === "string") {
        try {
          const parsedImages = JSON.parse(imageUrlsParam);
          setFiles(parsedImages);
        } catch (e) {
          console.error("Erro ao fazer parse das imagens", e);
        }
      }
    }
  }, [isEditingParam, postIdParam, textParam, locationParam, imageUrlsParam]);

  return (
    <KeyboardAvoidingView style={globalStyles.container} behavior={"height"}>
      <ScrollView
        style={globalStyles.container}
        contentContainerStyle={globalStyles.scroll_content}
        keyboardShouldPersistTaps="handled"
      >
        <Header title={postId ? "Editar Post" : "Criar Post"} />

        <View style={[globalStyles.content, localStyles.contentWrapper]}>
          <TextBox
            placeholder="O que você está pensando?"
            value={text}
            onChangeText={setText}
            onFocus={() => setShowEmoji(false)}
          >
            <DisplayImages
              files={files}
              onRemoveImage={(index) =>
                new NewPostScript().handleRemoveImage({
                  indexToRemove: index,
                  setFiles,
                })
              }
            />

            <View style={localStyles.actionsContainer}>
              {locationName && (
                <View style={localStyles.locationContainer}>
                  <Text style={localStyles.locationText}>
                    📍 Em {locationName}
                  </Text>
                  <IconButton
                    icon="close"
                    type="none"
                    size={20}
                    onPress={() => setLocationName(null)}
                  />
                </View>
              )}

              {/* BARRAS DE BOTÕES */}
              <View style={localStyles.iconBar}>
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
                  onPress={async () =>
                    await handleGetLocation({ setLocationName })
                  }
                />
              </View>
            </View>
          </TextBox>
          <Button
            title={postId ? "Salvar Edição" : "Publicar"}
            onPress={() =>
              new NewPostScript().handlePublish({
                text,
                files,
                locationName,
                setLoading,
                postId: postId ?? undefined,
              })
            }
          />
        </View>
      </ScrollView>

      {/* Renderização do seletor de Emojis */}
      {showEmoji && (
        <View style={localStyles.emojiContainer}>
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
