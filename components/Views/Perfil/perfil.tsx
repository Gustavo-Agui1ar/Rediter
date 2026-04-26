import {
  ProfileActions,
  ProfileCover,
  ProfileImage,
} from "@/components/components";
// 🚨 Removi o ReloadableContainer das importações
import FeedProfile from "@/components/Features/Profile/FeedProfile/FeedProfile";
import { useGlobalStyles } from "@/styles/global.styles";
import { request } from "@/utils/request.utils";
import {
  getProfileBasic,
  isCacheValid,
  saveProfileBasic,
} from "@/utils/storage.utils";
import { useFocusEffect } from "expo-router";
import { useCallback, useState } from "react";
import { View } from "react-native";
import { useStylesPerfil } from "./perfil.style";

export default function Perfil() {
  const [form, setForm] = useState({
    imageUrl: "",
    coverUrl: "",
    userName: "UserName",
    email: "",
  });

  const styles = useGlobalStyles();
  const stylesPerfil = useStylesPerfil();

  function applyProfile(data: any) {
    setForm({
      imageUrl: data.imageUrl || "",
      coverUrl: data.coverUrl || "",
      userName: data.userName || "",
      email: data.email || "",
    });
  }

  async function fetchProfile() {
    const response = await request({
      urlComplement: `/User/GetUser`,
      method: "GET",
    });

    if (response.ok) {
      const json = await response.json();

      const data = {
        imageUrl: json.imageName,
        coverUrl: json.imageCover,
        userName: json.name,
        email: json.email,
      };

      applyProfile(data);
      await saveProfileBasic(data);
    }
  }

  async function hydrateProfile() {
    const cached = await getProfileBasic();
    if (cached) {
      applyProfile(cached);

      if (!isCacheValid(cached)) {
        fetchProfile();
      }
      return;
    }

    fetchProfile();
  }

  useFocusEffect(
    useCallback(() => {
      hydrateProfile();
    }, []),
  );

  const ProfileHeader = (
    <View style={{ width: "100%" }}>
      <View style={stylesPerfil.header}>
        <ProfileCover imageName={form.coverUrl} />

        <View style={stylesPerfil.avatarWrapper}>
          <ProfileImage imageName={form.imageUrl} size={120} />
        </View>
      </View>

      <View style={stylesPerfil.actionsContainer}>
        <ProfileActions canFollow={false} userName={form.userName} />
      </View>
    </View>
  );

  return (
    <View style={[styles.container]}>
      <View style={[stylesPerfil.feedContainer]}>
        <FeedProfile
          headerComponent={ProfileHeader}
          onRefreshProfile={fetchProfile}
        />
      </View>
    </View>
  );
}
