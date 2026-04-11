import FeedProfile from "@/components/profile/FeedProfile";
import ProfileActions from "@/components/profile/ProfileActions";
import { ProfileCover } from "@/components/profile/ProfileCover";
import { ProfileImage } from "@/components/profile/ProfileImage";
import { stylesPerfil } from "@/styles/perfil.style";
import { styles } from "@/styles/theme";
import { View } from "react-native";

export default function Perfil() {
  return (
    <View
      style={[
        styles.content,
        {
          justifyContent: "flex-start",
        },
      ]}
    >
      <View
        style={{ position: "relative", width: "100%", alignItems: "center" }}
      >
        <ProfileCover imageUrl="https://images.unsplash.com/photo-1506744038136-46273834b3fb?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8cHJvZmlsZSUyMGNvdmVyfGVufDB8fDB8fHww&w=1000&q=80" />
        <ProfileImage
          imageUrl="https://avatars.githubusercontent.com/u/12345678?v=4"
          size={120}
          wrapper={true}
        />
      </View>
      <View style={stylesPerfil.containeractionprofile}>
        <View style={{ flex: 0.6 }} />

        <View
          style={{
            flex: 1,
            alignItems: "flex-end",
          }}
        >
          <ProfileActions canFollow={false} />
        </View>
      </View>
      <FeedProfile />
    </View>
  );
}
