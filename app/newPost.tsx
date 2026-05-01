import {
  AlertBanner,
  Button,
  DisplayImages,
  Header,
  HelperText,
  IconButton,
  TextBox,
} from "@/components/components";
import { useNewPost } from "@/scripts/NewPost.script";
import { useGlobalStyles } from "@/styles/global.styles";
import { useNewPostStyles } from "@/styles/newPost.style";
import { KeyboardAvoidingView, ScrollView, Text, View } from "react-native";
import { EmojiKeyboard } from "rn-emoji-keyboard";

export default function NewPost() {
  const globalStyles = useGlobalStyles();
  const localStyles = useNewPostStyles();
  const { state, actions } = useNewPost();

  return (
    <KeyboardAvoidingView style={globalStyles.container} behavior={"height"}>
      <Header title={state.postId ? "Editar Post" : "Criar Post"} />

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
            placeholder="O que você está pensando?"
            value={state.text}
            onChangeText={actions.onChangeText}
            onFocus={() => actions.setShowEmoji(false)}
          >
            <DisplayImages
              files={state.files}
              onRemoveImage={actions.onRemoveImage}
            />

            <View style={localStyles.actionsContainer}>
              {state.locationName && (
                <View style={localStyles.locationContainer}>
                  <Text style={localStyles.locationText}>
                    📍 Em {state.locationName}
                  </Text>
                  <IconButton
                    icon="close"
                    type="none"
                    size={20}
                    onPress={() => actions.setLocationName(null)}
                  />
                </View>
              )}

              <View style={localStyles.iconBar}>
                <IconButton
                  icon="image"
                  type="fill"
                  size={28}
                  onPress={actions.onAddImage}
                />
                <IconButton
                  icon="emoji"
                  type="fill"
                  size={28}
                  onPress={actions.onToggleEmoji}
                />
                <IconButton
                  icon="location"
                  type="fill"
                  size={28}
                  onPress={actions.onAddLocation}
                />
              </View>
            </View>
          </TextBox>

          {state.helperText && (
            <HelperText
              alert_type={state.helperText.type}
              message={state.helperText.message}
              visible={state.helperText !== null}
            />
          )}

          <Button
            title={state.postId ? "Salvar Edição" : "Publicar"}
            onPress={actions.handlePublish}
          />
        </View>
      </ScrollView>

      {state.showEmoji && (
        <View style={localStyles.emojiContainer}>
          <EmojiKeyboard
            onEmojiSelected={actions.onEmojiSelected}
            allowMultipleSelections
          />
        </View>
      )}
    </KeyboardAvoidingView>
  );
}
