import {
  ProfileActions,
  ProfileCover,
  ProfileImage,
  ReloadableContainer,
} from "@/components/components";
import FeedProfile from "@/components/Features/Profile/FeedProfile/FeedProfile";
import { useLoading } from "@/context/loadingContext";
import { useTheme } from "@/context/ThemeContext";
import { createdStyles } from "@/styles/theme";
import { request } from "@/utils/request.utils";
import {
  getProfileBasic,
  isCacheValid,
  saveProfileBasic,
} from "@/utils/storage.utils";
import { useFocusEffect } from "expo-router";
import { useCallback, useEffect, useState } from "react";
import { View } from "react-native";
import { createdStylesPerfil } from "./perfil.style";

export default function Perfil() {
  const { setLoading } = useLoading();

  const [form, setForm] = useState({
    imageUrl: "",
    coverUrl: "",
    userName: "UserName",
    email: "",
  });

  const { colors } = useTheme();
  const styles = createdStyles(colors);
  const stylesPerfil = createdStylesPerfil(colors);

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
      setLoading,
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

  useEffect(() => {
    hydrateProfile();
  }, []);

  useFocusEffect(
    useCallback(() => {
      hydrateProfile();
    }, []),
  );

  return (
    <ReloadableContainer onRefresh={fetchProfile}>
      <View style={styles.container}>
        <View style={stylesPerfil.header}>
          <ProfileCover imageName={form.coverUrl} />

          <View style={stylesPerfil.avatarWrapper}>
            <ProfileImage imageName={form.imageUrl} size={120} />
          </View>
        </View>

        <View style={stylesPerfil.actionsContainer}>
          <ProfileActions canFollow={false} userName={form.userName} />
        </View>

        <View style={stylesPerfil.feedContainer}>
          <FeedProfile />
        </View>
      </View>
    </ReloadableContainer>
  );
}
