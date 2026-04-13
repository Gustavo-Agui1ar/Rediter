import { Button, Header, TextBox } from "@/components/components";
import IconButton from "@/components/IconButton/IconButton";
import { ProfileImage } from "@/components/profile/ProfileImage";
import { useLoading } from "@/context/loadingContext";
import { configsStyles } from "@/styles/configs.style";
import { styles } from "@/styles/theme";
import { request } from "@/utils/request";
import { getStoreageItem } from "@/utils/storage";
import * as ImagePicker from "expo-image-picker";
import { router, useLocalSearchParams } from "expo-router";
import { useState } from "react";
import { View } from "react-native";

export default function Configs() {
  const { email, name } = useLocalSearchParams();
  const [nameState, setNameState] = useState(name as string);
  const [emailState, setEmailState] = useState(email as string);
  const [image, setImage] = useState<ImagePicker.ImagePickerAsset | null>(null);
  return (
    <View style={styles.container}>
      <Header title="Configurações" />
      <View style={[styles.content, configsStyles.contentFix]}>
        <View style={configsStyles.iconButtonFix}>
          <IconButton icon="back-row" onPress={() => router.back()} />
        </View>

        <View style={{ alignItems: "center" }}>
          <View>
            <ProfileImage imageUrl={image?.uri} size={120} />

            <View
              style={{
                position: "absolute",
                bottom: 0,
                right: 0,
              }}
            >
              <IconButton icon="edit" onPress={handlePickImage} />
            </View>
          </View>
        </View>

        <View style={configsStyles.textFix}>
          <TextBox
            placeholder="Nome"
            value={nameState}
            onChangeText={setNameState}
          />
          <TextBox
            placeholder="Email"
            value={emailState}
            onChangeText={setEmailState}
          />
          <TextBox placeholder="Senha" />
          <Button title="Salvar" onPress={handleSave} />
        </View>
      </View>
    </View>
  );

  async function handlePickImage() {
    const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (!permission.granted) {
      alert("Permissão necessária para acessar as fotos");
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 1,
      allowsEditing: true,
      aspect: [1, 1],
    });

    if (!result.canceled) {
      setImage(result.assets[0]);
    }
  }

  async function handleSave() {
    const formData = new FormData();

    if (image) {
      formData.append("file", {
        uri: image.uri,
        name: image.fileName ?? "profile.jpg",
        type: image.mimeType ?? "image/jpeg",
      } as any);
    }

    var refresh_token = await getStoreageItem("refresh_token");

    formData.append("name", nameState);
    formData.append("email", emailState);
    formData.append("RefreshToken", refresh_token ?? "");

    try {
      const response = await request({
        urlComplement: "/User/UpdateProfile",
        method: "POST",
        body: formData,
        setLoading: useLoading,
      });

      const data = await response.json();
      console.log("Sucesso:", data);
    } catch (err) {
      console.log("Erro:", err);
    }
  }
}
