import {
  AlertBanner,
  Button,
  DisplayImages,
  Header,
  HelperText,
  IconButton,
  TextBox,
} from "@/components/components";
import { useLanguage } from "@/context/LanguageContext";
import { useNewPost } from "@/scripts/NewPost.script";
import { useGlobalStyles } from "@/styles/global.styles";
import { useNewPostStyles } from "@/styles/newPost.style";
import { useCallback, useEffect, useRef, useState } from "react";
import {
  Keyboard,
  KeyboardAvoidingView,
  ScrollView,
  Text,
  View,
} from "react-native";
import { EmojiKeyboard } from "rn-emoji-keyboard";

const MAX_CHARACTERS = 250;
const WARNING_LIMIT = 200;

type HelperTextType = {
  message: string;
  type: "error" | "warning" | "success";
} | null;

export default function NewPost() {
  const globalStyles = useGlobalStyles();
  const localStyles = useNewPostStyles();
  const { state, actions } = useNewPost();
  const { t } = useLanguage();
  const [text, setText] = useState("");
  const [files, setFiles] = useState<any[]>([]);
  const [locationName, setLocationName] = useState<string | null>(null);
  const [showEmoji, setShowEmoji] = useState(false);
  const [helperText, setHelperText] = useState<HelperTextType>(null);
  const validationTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    setText(state.initialData.text);
    setFiles(state.initialData.files);
    setLocationName(state.initialData.locationName);
  }, [state.initialData]);

  useEffect(() => {
    return () => {
      if (validationTimer.current) clearTimeout(validationTimer.current);
    };
  }, []);

  const validateText = useCallback((value: string) => {
    if (value.length > MAX_CHARACTERS) {
      setHelperText({
        message: `Você ultrapassou o limite de ${MAX_CHARACTERS} caracteres.`,
        type: "error",
      });
    } else if (value.length > WARNING_LIMIT) {
      setHelperText({
        message: `Você está quase atingindo o limite de ${MAX_CHARACTERS} caracteres.`,
        type: "warning",
      });
    } else {
      setHelperText(null);
    }
  }, []);

  const onChangeText = useCallback(
    (newText: string) => {
      setText(newText);
      actions.clearAlerts();

      if (validationTimer.current) clearTimeout(validationTimer.current);

      validationTimer.current = setTimeout(() => {
        validateText(newText);
      }, 250);
    },
    [validateText, actions],
  );

  const handleEmojiSelected = useCallback(
    (emojiObject: { emoji: string }) => {
      setText((prev) => {
        const novoTexto = prev + emojiObject.emoji;
        validateText(novoTexto);
        return novoTexto;
      });
      actions.clearAlerts();
    },
    [validateText, actions],
  );

  const handleToggleEmoji = useCallback(() => {
    Keyboard.dismiss();
    setShowEmoji((prev) => !prev);
  }, []);

  const handleAddImage = useCallback(async () => {
    const img = await actions.pickNewImage();
    if (img) setFiles((prev) => [...prev, img]);
  }, [actions]);

  const handleRemoveImage = useCallback((indexToRemove: number) => {
    setFiles((prev) => prev.filter((_, i) => i !== indexToRemove));
  }, []);

  const handleAddLocation = useCallback(() => {
    actions.fetchLocation(setLocationName);
  }, [actions]);

  const submitPost = useCallback(async () => {
    actions.clearAlerts();

    if (text.trim() === "" && files.length === 0) {
      actions.setAlertBanner({
        message: "O post não pode estar vazio. Adicione texto ou uma imagem.",
        type: "error",
      });
      return;
    }

    if (text.length > MAX_CHARACTERS) {
      actions.setAlertBanner({
        message: `O texto excedeu o limite máximo de ${MAX_CHARACTERS} caracteres.`,
        type: "error",
      });
      return;
    }

    const isSuccess = await actions.handlePublish(
      text,
      locationName,
      files,
      state.initialData.postId,
    );

    if (isSuccess) {
      setText("");
      setFiles([]);
      setLocationName(null);
      setShowEmoji(false);
    }
  }, [text, files, locationName, state.initialData.postId, actions]);

  return (
    <KeyboardAvoidingView style={globalStyles.container} behavior={"height"}>
      <Header
        title={
          state.initialData.postId
            ? t("new_post_header_edit")
            : t("new_post_header_create")
        }
      />

      <ScrollView
        style={globalStyles.container}
        contentContainerStyle={globalStyles.scroll_content}
        keyboardShouldPersistTaps="handled"
      >
        <View style={[globalStyles.content, localStyles.contentWrapper]}>
          <AlertBanner
            message={state.alertBanner?.message || undefined}
            visible={!!state.alertBanner}
            alert_type={state.alertBanner?.type || "error"}
          />

          <TextBox
            placeholder={t("new_post_placeholder")}
            value={text}
            onChangeText={onChangeText}
            onFocus={() => setShowEmoji(false)}
          >
            <DisplayImages files={files} onRemoveImage={handleRemoveImage} />

            <View style={localStyles.actionsContainer}>
              {locationName && (
                <View style={localStyles.locationContainer}>
                  <Text style={localStyles.locationText}>
                    {t("new_post_location_prefix")} {locationName}
                  </Text>
                  <IconButton
                    icon="close"
                    type="none"
                    size={20}
                    onPress={() => setLocationName(null)}
                  />
                </View>
              )}

              <View style={localStyles.iconBar}>
                <IconButton
                  icon="image"
                  type="fill"
                  size={28}
                  onPress={handleAddImage}
                />
                <IconButton
                  icon="emoji"
                  type="fill"
                  size={28}
                  onPress={handleToggleEmoji}
                />
                <IconButton
                  icon="location"
                  type="fill"
                  size={28}
                  onPress={handleAddLocation}
                />
              </View>
            </View>
          </TextBox>

          {helperText && (
            <HelperText
              alert_type={helperText.type}
              message={helperText.message}
              visible={helperText !== null}
            />
          )}

          <Button
            title={
              state.initialData.postId
                ? t("new_post_btn_save_edit")
                : t("new_post_btn_publish")
            }
            onPress={submitPost}
          />
        </View>
      </ScrollView>

      {showEmoji && (
        <View style={localStyles.emojiContainer}>
          <EmojiKeyboard
            onEmojiSelected={handleEmojiSelected}
            allowMultipleSelections
          />
        </View>
      )}
    </KeyboardAvoidingView>
  );
}
