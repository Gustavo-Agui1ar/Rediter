import { default as Button } from "@/components/UI/Button/button";
import IconButton from "@/components/UI/IconButton/IconButton";
import { useLoading } from "@/context/loadingContext";
import { useTheme } from "@/context/ThemeContext";
import { router } from "expo-router";
import { useState } from "react";
import { Text, View } from "react-native";
import { createdProfileActionsStyles } from "./profileActions.style";

interface ProfileActionsProps {
  canFollow?: boolean;
  userName?: string;
}

export default function ProfileActions({
  canFollow = true,
  userName = "Usuário",
}: ProfileActionsProps) {
  const { setLoading } = useLoading();
  const [isFollowing, setIsFollowing] = useState(false);

  const { colors } = useTheme();
  const styles = createdProfileActionsStyles(colors);

  function updateFollowStatus() {
    setIsFollowing((prev) => !prev);
  }

  function goToConfig() {
    if (!canFollow) {
      router.push("/configs");
    }
  }

  return (
    <View style={styles.container}>
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
  );
}
