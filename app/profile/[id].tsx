import {
  FeedProfile,
  ProfileActions,
  ProfileCover,
  ProfileImage,
} from "@/components/components";
import { useUserProfile } from "@/scripts/UserProfile.script";
import { useGlobalStyles } from "@/styles/global.styles";
import { useStylesPerfil } from "@/styles/perfil.style";
import { Ionicons } from "@expo/vector-icons";
import { router, useLocalSearchParams } from "expo-router";
import React, { useCallback, useEffect, useMemo, useRef } from "react";
import { Animated, Pressable, View } from "react-native";

const ProfileSkeleton = ({ stylesPerfil, handleGoBack }: any) => {
  const fadeAnim = useRef(new Animated.Value(0.3)).current;

  useEffect(() => {
    const animation = Animated.loop(
      Animated.sequence([
        Animated.timing(fadeAnim, {
          toValue: 0.7,
          duration: 850,
          useNativeDriver: true,
        }),
        Animated.timing(fadeAnim, {
          toValue: 0.3,
          duration: 850,
          useNativeDriver: true,
        }),
      ]),
    );

    animation.start();
    return () => animation.stop();
  }, [fadeAnim]);

  return (
    <View style={{ width: "100%", flex: 1 }}>
      <View style={stylesPerfil.header}>
        <Animated.View
          style={[stylesPerfil.skeletonCover, { opacity: fadeAnim }]}
        />

        <Pressable onPress={handleGoBack} style={stylesPerfil.backButton}>
          <Ionicons name="arrow-back" size={24} color="#FFF" />
        </Pressable>

        <View style={stylesPerfil.avatarWrapperSkeleton}>
          <Animated.View
            style={[stylesPerfil.skeletonAvatar, { opacity: fadeAnim }]}
          />
        </View>

        <Animated.View
          style={[stylesPerfil.skeletonConfigBtn, { opacity: fadeAnim }]}
        />
      </View>

      <View style={stylesPerfil.skeletonActionsContainer}>
        <Animated.View
          style={[stylesPerfil.skeletonName, { opacity: fadeAnim }]}
        />

        <Animated.View
          style={[stylesPerfil.skeletonBio, { opacity: fadeAnim }]}
        />

        <View style={stylesPerfil.skeletonStatsRow}>
          <Animated.View
            style={[stylesPerfil.skeletonStatBox1, { opacity: fadeAnim }]}
          />

          <Animated.View
            style={[stylesPerfil.skeletonStatBox2, { opacity: fadeAnim }]}
          />
        </View>
      </View>

      <View style={stylesPerfil.skeletonTabsContainer}>
        <Animated.View
          style={[stylesPerfil.skeletonTabItem, { opacity: fadeAnim }]}
        />

        <Animated.View
          style={[stylesPerfil.skeletonTabItem, { opacity: fadeAnim }]}
        />

        <Animated.View
          style={[stylesPerfil.skeletonTabItem, { opacity: fadeAnim }]}
        />
      </View>

      <View style={stylesPerfil.skeletonPostContainer}>
        {[1, 2].map((item) => (
          <Animated.View
            key={item}
            style={[stylesPerfil.skeletonPostCard, { opacity: fadeAnim }]}
          >
            <View style={stylesPerfil.skeletonPostHeader}>
              <View style={stylesPerfil.skeletonPostAvatar} />

              <View style={stylesPerfil.skeletonPostInfo}>
                <View style={stylesPerfil.skeletonPostLine1} />
                <View style={stylesPerfil.skeletonPostLine2} />
              </View>
            </View>

            <View style={stylesPerfil.skeletonPostText} />

            <View style={stylesPerfil.skeletonPostImage} />

            <View style={stylesPerfil.skeletonPostActions}>
              <View style={stylesPerfil.skeletonActionCircle} />
              <View style={stylesPerfil.skeletonActionCircle} />
              <View style={stylesPerfil.skeletonActionCircle} />
            </View>
          </Animated.View>
        ))}
      </View>
    </View>
  );
};

export default function UserProfileScreen() {
  const { id, isOwnProfile } = useLocalSearchParams<{
    id: string;
    isOwnProfile: string;
  }>();

  const ownProfile = isOwnProfile === "true";
  const styles = useGlobalStyles();
  const stylesPerfil = useStylesPerfil();
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
            followersCount={state.profile.followers}
            followingCount={state.profile.following}
            userId={state.profile.userID}
          />
        </View>
      </View>
    );
  }, [state.profile, ownProfile, isFollowing, handleGoBack, stylesPerfil]);

  if (state.loading || !state.profile) {
    return (
      <View style={[styles.container]}>
        <ProfileSkeleton
          stylesPerfil={stylesPerfil}
          handleGoBack={handleGoBack}
        />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={{ flex: 1 }}>
        <FeedProfile
          userId={id}
          headerComponent={ProfileHeader}
          onRefreshProfile={actions.fetchProfile}
          refresh_id={`profile_${id}_refresh`}
          ownProfile={ownProfile}
        />
      </View>
    </View>
  );
}
