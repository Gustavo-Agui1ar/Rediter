import {
  ProfileActions,
  ProfileCover,
  ProfileImage,
  ReloadableContainer,
} from "@/components/components";
import FeedProfile from "@/components/profile/FeedProfile";
import { useLoading } from "@/context/loadingContext";
import { stylesPerfil } from "@/styles/perfil.style";
import { styles } from "@/styles/theme";
import { request } from "@/utils/request.utils";
import { useFocusEffect } from "expo-router";
import { useCallback, useEffect, useState } from "react";
import { View } from "react-native";

export default function Perfil() {
  const { setLoading } = useLoading();

  const [form, setForm] = useState({
    imageUrl: "",
    coverUrl: "",
    userName: "UserName",
  });

  async function loadProfile() {
    var response = await request({
      urlComplement: `/User/GetUser`,
      method: "GET",
      setLoading,
    });

    if (response.ok) {
      var json = await response.json();

      setForm((prev) => ({
        ...prev,
        imageUrl: json.imageName,
        coverUrl: json.imageCover,
        userName: json.name,
      }));
    }
  }

  useEffect(() => {
    loadProfile();
  }, []);

  useFocusEffect(
    useCallback(() => {
      loadProfile();
    }, []),
  );

  return (
    <ReloadableContainer onRefresh={loadProfile}>
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
          <ProfileCover imageName={form.coverUrl} />
          <ProfileImage imageName={form.imageUrl} size={120} wrapper={true} />
        </View>
        <View style={stylesPerfil.containeractionprofile}>
          <View
            style={{
              flex: 1,
              alignItems: "flex-end",
              position: "relative",
              top: 20,
            }}
          >
            <ProfileActions canFollow={false} userName={form.userName} />
          </View>
        </View>
        <FeedProfile />
      </View>
    </ReloadableContainer>
  );
}
