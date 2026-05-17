import AlertBanner from "@/components/UI/AlertBanner/AlertBanner";
import { default as Button } from "@/components/UI/Button/button";
import IconButton from "@/components/UI/IconButton/IconButton";
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
}

export default function ProfileActions({
  OwnProfile = false,
  userName = "Usuário",
  description = "",
  initialIsFollowing = false,
  initialIsBlocked = false,
  userId,
  followersCount = 0,
  followingCount = 0,
}: ProfileActionsProps) {
  const styles = useProfileActionsStyles();

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
  });

  return (
    <View style={styles.container}>
      <View style={styles.actionsRow}>
        {!OwnProfile ? (
          <>
            <Button
              title={isFollowing ? "Seguindo" : "Seguir"}
              type={isFollowing ? "border" : "fill"}
              size="small"
              onPress={handleFollowToggle}
              style={styles.followButton}
            />

            <IconButton
              icon="message"
              type="border"
              size={36}
              onPress={() => console.log("Abrir Chat")}
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
        {userName}
      </Text>

      {!!description && (
        <View style={styles.descriptionContainer}>
          <Text style={styles.description}>{description}</Text>
        </View>
      )}

      <View style={styles.followInfo}>
        <Text style={styles.followInfoText}>
          {followersCount.toLocaleString()} seguidores
        </Text>
        <Text style={styles.followInfoText}>
          {followingCount.toLocaleString()} seguindo
        </Text>
      </View>
    </View>
  );
}
