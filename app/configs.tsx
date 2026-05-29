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
import { useLanguage } from "@/context/LanguageContext";
import { useTheme } from "@/context/ThemeContext";
import { useConfigs } from "@/scripts/Configs.script";
import { useConfigsStyles } from "@/styles/configs.style";
import { useGlobalStyles } from "@/styles/global.styles";
import { ChevronRight } from "lucide-react-native";
import { useCallback, useEffect, useState } from "react";
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

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
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  useEffect(() => {
    setName(state.initialData.name);
    setDescription(state.initialData.description);
    setEmail(state.initialData.email);
    setPassword("");
  }, [state.initialData]);

  const onChangeName = useCallback((text: string) => setName(text), []);
  const onChangeDescription = useCallback(
    (text: string) => setDescription(text),
    [],
  );
  const onChangeEmail = useCallback((text: string) => setEmail(text), []);
  const onChangePassword = useCallback((text: string) => setPassword(text), []);

  const submitConfigs = useCallback(async () => {
    const success = await actions.handleSave({
      name,
      email,
      description,
      password,
    });
    if (success) {
      setPassword("");
    }
  }, [actions, name, email, description, password]);

  const currentDescLength = description.length;

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
              value={name}
              onChangeText={onChangeName}
              editable={!state.loading}
            />

            <TextBox
              placeholder={t("config_placeholder_description")}
              value={description}
              onChangeText={onChangeDescription}
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
              value={email}
              onChangeText={onChangeEmail}
              editable={!state.loading}
            />

            <TextBox
              placeholder={t("config_placeholder_password")}
              value={password}
              onChangeText={onChangePassword}
              secureTextEntry
              editable={!state.loading}
            />

            <Button
              title={t("btn_save")}
              disabled={state.loading}
              onPress={submitConfigs}
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
                onPress={actions.deleteAccount}
                disabled={state.loading}
              />

              <Button
                title={t("btn_logout")}
                type="remove_fill"
                onPress={actions.logOut}
                disabled={state.loading}
              />
            </View>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
