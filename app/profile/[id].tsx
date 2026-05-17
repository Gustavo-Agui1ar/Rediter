import {
  Button,
  ProfileActions,
  ProfileCover,
  ProfileImage,
} from "@/components/components";
import FeedProfile from "@/components/Features/Profile/FeedProfile/FeedProfile";
import { useTheme } from "@/context/ThemeContext";
import { useUserProfile } from "@/scripts/UserProfile.script";
import { useGlobalStyles } from "@/styles/global.styles";
import { useStylesPerfil } from "@/styles/perfil.style";
import { Ionicons } from "@expo/vector-icons";
import { router, useLocalSearchParams } from "expo-router";
import React, { useCallback, useMemo } from "react";
import { ActivityIndicator, Pressable, Text, View } from "react-native";

export default function UserProfileScreen() {
  const { id, isOwnProfile } = useLocalSearchParams<{
    id: string;
    isOwnProfile: string;
  }>();

  const ownProfile = isOwnProfile === "true";
  const styles = useGlobalStyles();
  const stylesPerfil = useStylesPerfil();
  const { colors } = useTheme();

  const { state, actions } = useUserProfile(id);
  const isFollowing = state.profile?.isFollowing || false;

  const handleGoBack = useCallback(() => {
    if (router.canGoBack()) {
      router.back();
    } else {
      router.replace("/");
    }
  }, []);

  const ProfileHeader = useMemo(() => {
    if (!state.profile) return null;

    return (
      <View style={{ width: "100%" }}>
        <View style={stylesPerfil.header}>
          <ProfileCover imageName={state.profile.imageCover} />

          <Pressable
            onPress={handleGoBack}
            style={{
              position: "absolute",
              top: 40,
              left: 16,
              backgroundColor: "rgba(0,0,0,0.4)",
              padding: 8,
              borderRadius: 20,
              zIndex: 10,
            }}
            hitSlop={{ top: 15, bottom: 15, left: 15, right: 15 }}
          >
            <Ionicons name="arrow-back" size={24} color="#FFF" />
          </Pressable>

          <View style={stylesPerfil.avatarWrapper}>
            <ProfileImage imageName={state.profile.imageName} size={120} />
          </View>
        </View>

        <View style={stylesPerfil.actionsContainer}>
          <ProfileActions
            OwnProfile={ownProfile}
            userName={state.profile.name}
            description={state.profile.description}
            initialIsFollowing={isFollowing}
            initialIsBlocked={state.profile.isBlocked}
            userId={state.profile.userID}
          />
        </View>
      </View>
    );
  }, [state.profile, ownProfile, isFollowing, handleGoBack, stylesPerfil]);

  if (state.loading && !state.profile) {
    return (
      <View
        style={[
          styles.container,
          { justifyContent: "center", alignItems: "center" },
        ]}
      >
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  if (!state.profile) {
    return (
      <View
        style={[
          styles.container,
          { justifyContent: "center", alignItems: "center" },
        ]}
      >
        <Text style={{ color: colors.textPrimary }}>
          Usuário não encontrado.
        </Text>
        <Button
          title="Voltar"
          onPress={handleGoBack}
          fullWidth={false}
          style={{ marginTop: 16 }}
        />
      </View>
    );
  }

  return (
    <View style={[styles.container]}>
      <View style={[stylesPerfil.feedContainer]}>
        <FeedProfile
          userId={id}
          ownProfile={ownProfile}
          headerComponent={ProfileHeader}
          onRefreshProfile={actions.fetchProfile}
          refresh_id={`refresh_profile_${id}`}
        />
      </View>
    </View>
  );
}
