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
import { configs } from "@/utils/configs";
import { request } from "@/utils/request";
import { getStoreageItem } from "@/utils/storage";
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
    var refresh_token = await getStoreageItem("refresh_token");
    var access_token = await getStoreageItem("user_token");

    const query = new URLSearchParams({
      AccessToken: access_token ?? "",
      RefreshToken: refresh_token ?? "",
    }).toString();

    var response = await request({
      urlComplement: `/User/GetUser?${query}`,
      method: "GET",
      setLoading,
    });

    if (response.ok) {
      var json = await response.json();

      setForm((prev) => ({
        ...prev,
        imageUrl: `${configs.apiUrls[0]}/Picture/GetPicture?name=${encodeURIComponent(
          json.imageName,
        )}`,
        coverUrl: `${configs.apiUrls[0]}/Picture/GetPicture?name=${encodeURIComponent(
          json.imageCover,
        )}`,
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
          <ProfileCover imageUrl={form.coverUrl} />
          <ProfileImage imageUrl={form.imageUrl} size={120} wrapper={true} />
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
