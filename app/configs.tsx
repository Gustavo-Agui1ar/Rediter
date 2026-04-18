import { Button, TextBox } from "@/components/components";
import IconButton from "@/components/IconButton/IconButton";
import { ProfileCover } from "@/components/profile/ProfileCover";
import { ProfileImage } from "@/components/profile/ProfileImage";
import { useLoading } from "@/context/loadingContext";
import { handleSave } from "@/scripts/configs.script";
import { configsStyles } from "@/styles/configs.style";
import { styles } from "@/styles/theme";
import { configs } from "@/utils/configs";
import { pickImage } from "@/utils/filePicker";
import { useLocalSearchParams } from "expo-router";
import { useEffect, useState } from "react";
import { KeyboardAvoidingView, ScrollView, View } from "react-native";

export default function Configs() {
  const { email, name, imageName, coverName } = useLocalSearchParams();
  const { loading, setLoading } = useLoading();

  const [form, setForm] = useState({
    name: (name as string) || "",
    email: (email as string) || "",
    password: "",
  });

  const [profileImage, setProfileImage] = useState<{
    local?: any;
    remote?: string;
    changed?: boolean;
  }>({});
  const [coverImage, setCoverImage] = useState<{
    local?: any;
    remote?: string;
    changed?: boolean;
  }>({});

  useEffect(() => {
    if (imageName) {
      setProfileImage((prev) => ({
        ...prev,
        remote: `${configs.apiUrls[0]}/Picture/GetPicture?name=${encodeURIComponent(imageName as string)}`,
      }));
    }
    if (coverName) {
      setCoverImage((prev) => ({
        ...prev,
        remote: `${configs.apiUrls[0]}/Picture/GetPicture?name=${encodeURIComponent(coverName as string)}`,
      }));
    }
  }, []);

  return (
    <KeyboardAvoidingView style={styles.container} behavior={"height"}>
      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.scroll_content}
        keyboardShouldPersistTaps="handled"
      >
        <View style={[styles.content, configsStyles.contentFix]}>
          <View>
            {/* 🔹 COVER COM OVERLAY */}
            <View style={configsStyles.coverOverlay}>
              <ProfileCover
                imageUrl={
                  coverImage.changed ? coverImage.local?.uri : coverImage.remote
                }
              />
              <IconButton
                icon="edit"
                type="none"
                fullSize
                onPress={() =>
                  pickImage(false).then(
                    (img) =>
                      img && setCoverImage({ local: img, changed: true }),
                  )
                }
              />
            </View>

            {/* 🔹 PROFILE IMAGE COM OVERLAY REDONDO */}
            <View style={configsStyles.profileImageOverlay}>
              <View style={configsStyles.profileImageFix}>
                <ProfileImage
                  imageUrl={
                    profileImage.changed
                      ? profileImage.local?.uri
                      : profileImage.remote
                  }
                  size={120}
                />
                <IconButton
                  icon="edit"
                  type="none"
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
            <TextBox
              placeholder="Nome"
              value={form.name}
              onChangeText={(text: string) => setForm({ ...form, name: text })}
              editable={!loading}
            />
            <TextBox
              placeholder="Email"
              value={form.email}
              onChangeText={(text: string) => setForm({ ...form, email: text })}
              editable={!loading}
            />
            <TextBox
              placeholder="Senha"
              value={form.password}
              onChangeText={(text: string) =>
                setForm({ ...form, password: text })
              }
              secureTextEntry
              editable={!loading}
            />
            <Button
              title="Salvar"
              disabled={loading}
              onPress={() =>
                handleSave({
                  form,
                  profileImage,
                  profileCover: coverImage,
                  setLoading,
                })
              }
            />
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
