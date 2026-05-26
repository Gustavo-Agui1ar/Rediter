import AlertBanner from "@/components/UI/AlertBanner/AlertBanner";
import { default as Button } from "@/components/UI/Button/button";
import IconButton from "@/components/UI/IconButton/IconButton";
import { useLanguage } from "@/context/LanguageContext";
import { router } from "expo-router";
import { Text, View } from "react-native";
import { useProfileActions } from "./ProfileActions.script";
import { useProfileActionsStyles } from "./ProfileActions.style";
interface ProfileActionsProps {
  OwnProfile?: boolean;
  userName?: string;
  description?: string;
  initialIsFollowing: boolean;
  initialIsBlocked?: boolean;
  userId?: string;
  followersCount?: number;
  followingCount?: number;
  onUpdateProfile?: (
    updatedFields: Partial<{ isFollowing: boolean; isBlocked: boolean }>,
  ) => void;
}

export default function ProfileActions({
  OwnProfile = false,
  userName,
  description = "",
  initialIsFollowing = false,
  initialIsBlocked = false,
  userId,
  followersCount = 0,
  followingCount = 0,
  onUpdateProfile,
}: ProfileActionsProps) {
  const styles = useProfileActionsStyles();
  const { t } = useLanguage();

  const {
    isFollowing,
    isBlocked,
    handleFollowToggle,
    handleGoToConfig,
    handleBlock,
    bannerProps,
  } = useProfileActions({
    userId: userId,
    initialIsFollowing,
    initialIsBlocked,
    OwnProfile,
    onUpdateProfile,
  });

  return (
    <View style={styles.container}>
      <View style={styles.actionsRow}>
        {!OwnProfile ? (
          <>
            <Button
              title={isFollowing ? t("btn_following") : t("btn_follow")}
              type={isFollowing ? "border" : "fill"}
              size="small"
              onPress={handleFollowToggle}
              style={styles.followButton}
            />

            <IconButton
              icon="message"
              type="border"
              size={36}
              onPress={() =>
                router.push(
                  `/Message?targetUserId=${userId}&targetUserName=${userName}`,
                )
              }
            />

            <IconButton
              icon="block"
              type={isBlocked ? "fill" : "border"}
              size={36}
              onPress={handleBlock}
            />
          </>
        ) : (
          <IconButton
            icon="configuration"
            type="border"
            size={36}
            onPress={handleGoToConfig}
          />
        )}
      </View>

      <AlertBanner
        message={bannerProps.message}
        visible={bannerProps.visible}
        alert_type={bannerProps.alert_type}
        style={styles.alertBanner}
      />

      <Text style={styles.nameText} numberOfLines={1} ellipsizeMode="tail">
        {userName || t("default_username")}
      </Text>

      {!!description && (
        <View style={styles.descriptionContainer}>
          <Text style={styles.description}>{description}</Text>
        </View>
      )}

      <View style={styles.followInfo}>
        <Text style={styles.followInfoText}>
          {followersCount.toLocaleString()} {t("profile_followers")}
        </Text>
        <Text style={styles.followInfoText}>
          {followingCount.toLocaleString()} {t("profile_following")}
        </Text>
      </View>
    </View>
  );
}
