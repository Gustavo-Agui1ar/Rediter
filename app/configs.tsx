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
import { useTheme } from "@/context/ThemeContext";
import { useConfigsStyles } from "@/styles/configs.style";
import { useGlobalStyles } from "@/styles/global.styles";
import { KeyboardAvoidingView, ScrollView, Text, View } from "react-native";

import { useConfigs } from "@/scripts/Configs.script";

export default function Configs() {
  const { state, actions } = useConfigs();
  const { theme, toggleTheme } = useTheme();
  const { colors } = useTheme();
  const configsStyles = useConfigsStyles();
  const styles = useGlobalStyles();

  const renderCharCounter = () => {
    const currentLength = state.form.description?.length ?? 0;
    return (
      <Text
        style={{
          alignSelf: "flex-end",
          fontSize: 12,
          fontWeight: "bold",
          color:
            currentLength >= state.maxDescriptionLength
              ? colors.error
              : colors.textSecondary,
        }}
      >
        {currentLength} / {state.maxDescriptionLength}
      </Text>
    );
  };

  return (
    <KeyboardAvoidingView style={styles.container} behavior={"height"}>
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
            <Divider text="Sobre Você" />

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
              placeholder="Nome"
              value={state.form.name}
              onChangeText={(text: string) =>
                actions.onChangeForm("name", text)
              }
              editable={!state.loading}
            />

            <TextBox
              placeholder="Descrição"
              value={state.form.description}
              onChangeText={(text: string) =>
                actions.onChangeForm("description", text)
              }
            >
              {renderCharCounter()}
            </TextBox>
            <Divider text="Segurança" />

            <TextBox
              placeholder="Email"
              value={state.form.email}
              onChangeText={(text: string) =>
                actions.onChangeForm("email", text)
              }
              editable={!state.loading}
            />

            <TextBox
              placeholder="Nova Senha"
              value={state.form.password}
              onChangeText={(text: string) =>
                actions.onChangeForm("password", text)
              }
              secureTextEntry
              editable={!state.loading}
            />

            <Button
              title="Salvar"
              disabled={state.loading}
              onPress={actions.handleSave}
            />

            <Divider text="Visualização" />

            <View style={configsStyles.labelContainer}>
              <View style={configsStyles.iconButtonContainer}>
                <IconButton icon="moon" type="none" />
                <Text style={configsStyles.label}>Modo Escuro</Text>
              </View>
              <Toogle value={theme === "dark"} onValueChange={toggleTheme} />
            </View>

            <Divider text="Log-out" />
            <View style={configsStyles.lastContainerConfig}>
              <Button
                title="Excluir Conta"
                type="remove_border"
                onPress={() => actions.deleteAccount()}
                disabled={state.loading}
              />

              <Button
                title="Sair"
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
