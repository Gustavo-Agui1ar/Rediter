import { default as Button } from "@/components/UI/Button/button";
import IconButton from "@/components/UI/IconButton/IconButton";
import { router } from "expo-router";
import { useState } from "react";
import { Text, View } from "react-native";
import { useProfileActionsStyles } from "./profileActions.style";

interface ProfileActionsProps {
  OwnProfile?: boolean;
  userName?: string;
  description?: string;
  initialIsFollowing?: boolean;
}

export default function ProfileActions({
  OwnProfile = false,
  userName = "Usuário",
  description = "",
  initialIsFollowing,
}: ProfileActionsProps) {
  const [isFollowing, setIsFollowing] = useState(initialIsFollowing);
  const styles = useProfileActionsStyles();

  const updateFollowStatus = () => setIsFollowing((prev) => !prev);
  const goToConfig = () => OwnProfile && router.push("/Configs");
  return (
    <View style={styles.container}>
      <View style={styles.actionsRow}>
        {!OwnProfile ? (
          <>
            <Button
              title={isFollowing ? "Seguindo" : "Seguir"}
              type={isFollowing ? "border" : "fill"}
              size="small"
              onPress={updateFollowStatus}
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
            onPress={goToConfig}
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
