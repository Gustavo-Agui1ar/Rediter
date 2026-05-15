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
  userId?: string;
}

export default function ProfileActions({
  OwnProfile = false,
  userName = "Usuário",
  description = "",
  initialIsFollowing = false,
  userId,
}: ProfileActionsProps) {
  const styles = useProfileActionsStyles();
  const { isFollowing, handleFollowToggle, handleGoToConfig } =
    useProfileActions({
      userId: userId,
      initialIsFollowing,
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
            <IconButton icon="message" type="border" size={36} />
            <IconButton icon="block" type="border" size={36} />
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

      <Text style={styles.nameText} numberOfLines={1} ellipsizeMode="tail">
        {userName}
      </Text>

      {!!description && (
        <View style={styles.descriptionContainer}>
          <Text style={styles.description}>{description}</Text>
        </View>
      )}
      <View style={styles.followInfo}>
        <Text style={styles.followInfoText}>10k seguidores</Text>
        <Text style={styles.followInfoText}>500 seguindo</Text>
      </View>
    </View>
  );
}
