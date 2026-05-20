import { useLanguage } from "@/context/LanguageContext";
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

import {
  AlertBanner,
  Button,
  Divider,
  IconButton,
  ProfileCover,
  ProfileImage,
  TextBox,
  Toogle,
} from "@/components/components";
import { Dropdown } from "@/components/UI/DropDown/DropDown";
import { useTheme } from "@/context/ThemeContext";
import { useConfigs } from "@/scripts/Configs.script";
import { useConfigsStyles } from "@/styles/configs.style";
import { useGlobalStyles } from "@/styles/global.styles";
import { ChevronRight } from "lucide-react-native";
import React from "react";

const LANGUAGE_OPTIONS = [
  { label: "Português", value: "pt" },
  { label: "English", value: "en" },
];

export default function Configs() {
  const { state, actions } = useConfigs();
  const configsStyles = useConfigsStyles();
  const styles = useGlobalStyles();
  const { theme, toggleTheme, colors } = useTheme();
  const { t } = useLanguage();

  const currentDescLength = state.form.description?.length ?? 0;

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.scroll_content}
        keyboardShouldPersistTaps="handled"
      >
        <View style={[styles.content, configsStyles.configsContainer]}>
          <View>
            <View style={configsStyles.coverOverlay}>
              <ProfileCover
                imageName={
                  state.coverImage.changed
                    ? state.coverImage.local?.uri
                    : state.coverImage.remote
                }
              />
              <IconButton
                icon="edit"
                type="overlay"
                size={64}
                fullSize
                onPress={actions.handlePickCover}
              />
            </View>

            <View style={configsStyles.profileImageOverlay}>
              <View style={configsStyles.profileImageFix}>
                <ProfileImage
                  imageName={
                    state.profileImage.changed
                      ? state.profileImage.local?.uri
                      : state.profileImage.remote
                  }
                  size={120}
                />
                <IconButton
                  icon="edit"
                  type="overlay"
                  fullSize
                  onPress={actions.handlePickProfileImage}
                />
              </View>
            </View>
          </View>

          <View style={configsStyles.contentTextFix}>
            <Divider text={t("config_section_about")} />

            <AlertBanner
              message={state.error || undefined}
              visible={!!state.error}
              alert_type="error"
            />
            <AlertBanner
              message={state.successMsg || undefined}
              visible={!!state.successMsg}
              alert_type="success"
            />

            <TextBox
              placeholder={t("config_placeholder_name")}
              value={state.form.name}
              onChangeText={(text: string) =>
                actions.onChangeForm("name", text)
              }
              editable={!state.loading}
            />

            <TextBox
              placeholder={t("config_placeholder_description")}
              value={state.form.description}
              onChangeText={(text: string) =>
                actions.onChangeForm("description", text)
              }
            >
              <Text
                style={{
                  alignSelf: "flex-end",
                  fontSize: 12,
                  fontWeight: "bold",
                  color:
                    currentDescLength >= state.maxDescriptionLength
                      ? colors.error
                      : colors.textSecondary,
                }}
              >
                {currentDescLength} / {state.maxDescriptionLength}
              </Text>
            </TextBox>

            <Divider text={t("config_section_security")} />

            <TextBox
              placeholder={t("config_placeholder_email")}
              value={state.form.email}
              onChangeText={(text: string) =>
                actions.onChangeForm("email", text)
              }
              editable={!state.loading}
            />

            <TextBox
              placeholder={t("config_placeholder_password")}
              value={state.form.password}
              onChangeText={(text: string) =>
                actions.onChangeForm("password", text)
              }
              secureTextEntry
              editable={!state.loading}
            />

            <Button
              title={t("btn_save")}
              disabled={state.loading}
              onPress={actions.handleSave}
            />

            <Divider text={t("config_section_privacy")} />

            <TouchableOpacity
              style={configsStyles.labelContainer}
              onPress={actions.goToBlockedUsers}
            >
              <View style={configsStyles.iconButtonContainer}>
                <IconButton icon="block" type="none" />
                <Text style={configsStyles.label}>
                  {t("config_label_blocked")}
                </Text>
              </View>
              <ChevronRight size={24} color={colors.textSecondary} />
            </TouchableOpacity>

            <Divider text={t("config_section_appearance")} />

            <View style={configsStyles.labelContainer}>
              <View style={configsStyles.iconButtonContainer}>
                <IconButton icon="moon" type="none" />
                <Text style={configsStyles.label}>
                  {t("config_label_dark_mode")}
                </Text>
              </View>
              <Toogle value={theme === "dark"} onValueChange={toggleTheme} />
            </View>

            <View
              style={[
                configsStyles.labelContainer,
                { alignItems: "center", justifyContent: "space-between" },
              ]}
            >
              <View style={configsStyles.iconButtonContainer}>
                <IconButton icon="language" type="none" />
                <Text style={configsStyles.label}>
                  {t("config_label_language")}
                </Text>
              </View>

              <View style={{ width: 140 }}>
                <Dropdown
                  selectedValue={state.lan}
                  onValueChange={(val: string) => actions.setLan(val)}
                  options={LANGUAGE_OPTIONS}
                />
              </View>
            </View>

            <Divider text={t("config_section_logout")} />
            <View style={configsStyles.lastContainerConfig}>
              <Button
                title={t("btn_delete_account")}
                type="remove_border"
                onPress={() => actions.deleteAccount()}
                disabled={state.loading}
              />

              <Button
                title={t("btn_logout")}
                type="remove_fill"
                onPress={() => actions.logOut()}
                disabled={state.loading}
              />
            </View>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
