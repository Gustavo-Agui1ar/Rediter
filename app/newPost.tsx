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
import React from "react";
import { KeyboardAvoidingView, ScrollView, Text, View } from "react-native";
import { EmojiKeyboard } from "rn-emoji-keyboard";

export default function NewPost() {
  const globalStyles = useGlobalStyles();
  const localStyles = useNewPostStyles();
  const { state, actions } = useNewPost();
  const { t } = useLanguage();

  return (
    <KeyboardAvoidingView style={globalStyles.container} behavior={"height"}>
      <Header
        title={
          state.postId ? t("new_post_header_edit") : t("new_post_header_create")
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
                    {t("new_post_location_prefix")} {state.locationName}
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
            title={
              state.postId
                ? t("new_post_btn_save_edit")
                : t("new_post_btn_publish")
            }
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
