import { default as Button } from "@/components/UI/Button/button";
import IconButton from "@/components/UI/IconButton/IconButton";
import { router } from "expo-router";
import { useState } from "react";
import { Text, View } from "react-native";
import { useProfileActionsStyles } from "./profileActions.style";

interface ProfileActionsProps {
  canFollow?: boolean;
  userName?: string;
  description?: string;
}

export default function ProfileActions({
  canFollow = true,
  userName = "Usuário",
  description = "",
}: ProfileActionsProps) {
  const [isFollowing, setIsFollowing] = useState(false);

  const styles = useProfileActionsStyles();

  function updateFollowStatus() {
    setIsFollowing((prev) => !prev);
  }

  function goToConfig() {
    if (!canFollow) {
      router.push("/Configs");
    }
  }

  return (
    <View style={styles.container}>
      <View style={styles.row}>
        <Text style={styles.nameText} numberOfLines={1}>
          {userName}
        </Text>

        <View style={styles.actionsRow}>
          {canFollow ? (
            <>
              <Button
                title={isFollowing ? "Seguindo" : "Seguir"}
                type={isFollowing ? "border" : "fill"}
                onPress={updateFollowStatus}
                style={styles.followButton}
              />

              <IconButton icon="message" type="border" size={44} />
            </>
          ) : (
            <IconButton
              icon="configuration"
              type="border"
              size={44}
              onPress={goToConfig}
            />
          )}
        </View>
      </View>

      {description.length > 0 && (
        <View style={styles.row}>
          <Text style={styles.description}>{description}</Text>
        </View>
      )}
    </View>
  );
}
