import {
  ProfileActions,
  ProfileCover,
  ProfileImage,
} from "@/components/components";
import FeedProfile from "@/components/Features/Profile/FeedProfile/FeedProfile";
import { usePerfil } from "@/scripts/Perfil.script";
import { useGlobalStyles } from "@/styles/global.styles";
import { useStylesPerfil } from "@/styles/perfil.style";
import { useMemo } from "react";
import { View } from "react-native";

export default function Perfil() {
  const styles = useGlobalStyles();
  const stylesPerfil = useStylesPerfil();
  const { state, actions } = usePerfil();
  const ProfileHeader = useMemo(
    () => (
      <View style={{ width: "100%" }}>
        <View style={stylesPerfil.header}>
          <ProfileCover imageName={state.form.coverUrl} />
          <View style={stylesPerfil.avatarWrapper}>
            <ProfileImage imageName={state.form.imageUrl} size={120} />
          </View>
        </View>

        <View style={stylesPerfil.actionsContainer}>
          <ProfileActions
            OwnProfile={true}
            userName={state.form.userName}
            description={state.form.description}
          />
        </View>
      </View>
    ),
    [state.form, stylesPerfil],
  );

  return (
    <View style={[styles.container]}>
      <View style={[stylesPerfil.feedContainer]}>
        <FeedProfile
          headerComponent={ProfileHeader}
          onRefreshProfile={actions.fetchProfile}
          refresh_id="perfil_refresh"
          ownProfile={true}
        />
      </View>
    </View>
  );
}
