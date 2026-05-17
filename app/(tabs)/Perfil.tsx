import {
  ProfileActions,
  ProfileCover,
  ProfileImage,
} from "@/components/components";
import FeedProfile from "@/components/Features/Profile/FeedProfile/FeedProfile";
import { useTheme } from "@/context/ThemeContext";
import { usePerfil } from "@/scripts/Perfil.script";
import { useGlobalStyles } from "@/styles/global.styles";
import { useStylesPerfil } from "@/styles/perfil.style";
import React, { useEffect, useMemo, useRef } from "react";
import { Animated, View } from "react-native";

const ProfileSkeleton = ({ stylesPerfil, colors }: any) => {
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
        <View style={stylesPerfil.avatarWrapper}>
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
        <Animated.View
          style={[stylesPerfil.skeletonPostCard, { opacity: fadeAnim }]}
        >
          <View style={stylesPerfil.skeletonPostHeader}>
            <View style={stylesPerfil.skeletonPostAvatar} />
            <View style={stylesPerfil.skeletonPostInfo}>
              <View style={stylesPerfil.skeletonPostLine1} />
              <View style={stylesPerfil.skeletonPostLine2} />
            </View>
          </View>
        </Animated.View>
      </View>
    </View>
  );
};

export default function Perfil() {
  const styles = useGlobalStyles();
  const stylesPerfil = useStylesPerfil();
  const { colors } = useTheme();
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
            initialIsFollowing={state.form.isFollowing}
            initialIsBlocked={state.form.isBlocked}
            userId={state.form.userId}
            followersCount={state.form.followers}
            followingCount={state.form.following}
          />
        </View>
      </View>
    ),
    [state.form, stylesPerfil],
  );

  if (state.loading) {
    return (
      <View style={styles.container}>
        <ProfileSkeleton stylesPerfil={stylesPerfil} colors={colors} />
      </View>
    );
  }

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
