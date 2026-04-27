import {
  Button,
  Divider,
  HelperText,
  IconButton,
  ProfileCover,
  ProfileImage,
  TextBox,
  Toogle,
} from "@/components/components";
import { useLoading } from "@/context/loadingContext";
import { useTheme } from "@/context/ThemeContext";
import { handleSave } from "@/scripts/configs.script";
import { useConfigsStyles } from "@/styles/configs.style";
import { useGlobalStyles } from "@/styles/global.styles";
import { pickImage } from "@/utils/filePicker.utils";
import { deleteAccount, logOut } from "@/utils/login.utils";
import { request } from "@/utils/request.utils";
import * as Storage from "@/utils/storage.utils";
import { useEffect, useState } from "react";
import { KeyboardAvoidingView, ScrollView, Text, View } from "react-native";

export default function Configs() {
  const { loading, setLoading } = useLoading();
  const [error, setError] = useState<string | null>(null);

  const configsStyles = useConfigsStyles();
  const styles = useGlobalStyles();

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
  });

  const [profileImage, setProfileImage] = useState<any>({});
  const [coverImage, setCoverImage] = useState<any>({});
  const { theme, toggleTheme } = useTheme();

  useEffect(() => {
    async function hydrateProfile() {
      const cached = await Storage.getProfileBasic();

      if (cached) {
        applyProfile(cached);
      } else {
        const response = await request({
          urlComplement: `/User/GetUser`,
          method: "GET",
          setLoading: cached ? undefined : setLoading,
        });

        if (response.ok) {
          const json = await response.json();

          const data = {
            userName: json.name,
            email: json.email,
            imageUrl: json.imageName,
            coverUrl: json.imageCover,
          };

          applyProfile(data);

          await Storage.saveProfileBasic(data);
        }
      }
    }

    function applyProfile(data: any) {
      setForm((prev) => ({
        ...prev,
        name: data.userName || "",
        email: data.email || "",
      }));

      setProfileImage({ remote: data.imageUrl });
      setCoverImage({ remote: data.coverUrl });
    }

    hydrateProfile();
  }, []);

  return (
    <KeyboardAvoidingView style={styles.container} behavior={"height"}>
      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.scroll_content}
        keyboardShouldPersistTaps="handled"
      >
        <View style={[styles.content]}>
          <View>
            {/* COVER */}
            <View style={configsStyles.coverOverlay}>
              <ProfileCover
                imageName={
                  coverImage.changed ? coverImage.local?.uri : coverImage.remote
                }
              />
              <IconButton
                icon="edit"
                type="overlay"
                size={64}
                fullSize
                onPress={() =>
                  pickImage(false).then(
                    (img) =>
                      img && setCoverImage({ local: img, changed: true }),
                  )
                }
              />
            </View>

            {/* PROFILE */}
            <View style={configsStyles.profileImageOverlay}>
              <View style={configsStyles.profileImageFix}>
                <ProfileImage
                  imageName={
                    profileImage.changed
                      ? profileImage.local?.uri
                      : profileImage.remote
                  }
                  size={120}
                />
                <IconButton
                  icon="edit"
                  type="overlay"
                  fullSize
                  onPress={() =>
                    pickImage(true).then(
                      (img) =>
                        img && setProfileImage({ local: img, changed: true }),
                    )
                  }
                />
              </View>
            </View>
          </View>

          <View style={configsStyles.contentTextFix}>
            <Divider text="Informações da Conta" />
            <HelperText message={error || undefined} visible={!!error} />

            <TextBox
              placeholder="Nome"
              value={form.name}
              onChangeText={(text: string) =>
                setForm((prev) => ({ ...prev, name: text }))
              }
              editable={!loading}
            />

            <TextBox
              placeholder="Email"
              value={form.email}
              onChangeText={(text: string) =>
                setForm((prev) => ({ ...prev, email: text }))
              }
              editable={!loading}
            />

            <TextBox
              placeholder="Senha"
              value={form.password}
              onChangeText={(text: string) =>
                setForm((prev) => ({ ...prev, password: text }))
              }
              secureTextEntry
              editable={!loading}
            />

            <Button
              title="Salvar"
              disabled={loading}
              onPress={async () => {
                setError(null);

                const err = await handleSave({
                  form,
                  profileImage,
                  profileCover: coverImage,
                  setLoading,
                });

                if (!err) {
                  await Storage.saveProfileBasic({
                    imageUrl: profileImage.local?.uri || profileImage.remote,
                    coverUrl: coverImage.local?.uri || coverImage.remote,
                    userName: form.name,
                    email: form.email,
                  });
                }

                if (err) setError(err);
              }}
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

            <Button
              title="Excluir Conta"
              type="remove_border"
              onPress={async () => deleteAccount()}
              disabled={loading}
            />

            <Button
              title="Sair"
              type="remove_fill"
              onPress={async () => logOut()}
              disabled={loading}
            />
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
