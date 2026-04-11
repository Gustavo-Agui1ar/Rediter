import { Button, Header, TextBox } from "@/components/components";
import IconButton from "@/components/IconButton/IconButton";
import { ProfileImage } from "@/components/profile/ProfileImage";
import { configsStyles } from "@/styles/configs.style";
import { styles } from "@/styles/theme";
import { router } from "expo-router";
import { View } from "react-native";

export default function Configs() {
  return (
    <View style={styles.container}>
      <Header title="Configurações" />
      <View style={[styles.content, configsStyles.contentFix]}>
        <View style={configsStyles.iconButtonFix}>
          <IconButton icon="back-row" onPress={() => router.back()} />
        </View>

        <View style={configsStyles.imageFix}>
          <ProfileImage
            imageUrl="https://avatars.githubusercontent.com/u/12345678?v=4"
            size={120}
          />
        </View>

        <View style={configsStyles.textFix}>
          <TextBox placeholder="Nome" />
          <TextBox placeholder="Email" />
          <TextBox placeholder="Senha" />
          <Button
            title="Salvar"
            onPress={() => console.log("Salvar configurações")}
          />
        </View>
      </View>
    </View>
  );
}
