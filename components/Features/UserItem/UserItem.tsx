import ProfileImage from "@/components/Features/Profile/ProfileImage";
import Button from "@/components/UI/Button/button";
import HighlightedText from "@/components/UI/HighLightText";
import { useTheme } from "@/context/ThemeContext";
import { useRouter } from "expo-router";
import React, { memo } from "react";
import { Pressable, Text, View } from "react-native";
import { useFollow } from "./UserItem.script";
import { useStylesUserItem } from "./UserItem.style";

interface UserItemProps {
  user: {
    userID: number;
    userName: string;
    profileImageName: string;
    description: string;
    ownProfile: boolean;
    isFollowing: boolean;
  };
  searchTerm?: string;
  blocked?: boolean;
  onUnblock?: (userId: string) => void;
}

const UserItem = ({ user, searchTerm, blocked, onUnblock }: UserItemProps) => {
  const styles = useStylesUserItem();
  const { colors } = useTheme();
  const router = useRouter();
  const { handleFollowToggle, buttonTitle, buttonType, handleUnlockUser } =
    useFollow(user.userID, user.isFollowing, onUnblock);
  const handleGoToProfile = () => {
    router.push({
      pathname: `/profile/${user.userID}` as any,
      params: { isOwnProfile: user.ownProfile } as any,
    });
  };

  return (
    <View style={styles.container}>
      <Pressable
        onPress={handleGoToProfile}
        style={({ pressed }) => [styles.userInfo, pressed && { opacity: 0.6 }]}
      >
        <ProfileImage size={44} imageName={user.profileImageName} />
        <View style={styles.containerUser}>
          <Text style={styles.userName} numberOfLines={1} ellipsizeMode="tail">
            <HighlightedText
              text={user.userName}
              searchTerm={searchTerm}
              textStyle={styles.userName}
              highlightColor={colors.primary}
            />
          </Text>
          <Text style={styles.textDescription} numberOfLines={1}>
            {user.description || ""}
          </Text>
        </View>
      </Pressable>
      {!user.ownProfile && !blocked && (
        <View style={styles.buttonContainer}>
          <Button
            title={buttonTitle}
            type={buttonType}
            size="small"
            onPress={handleFollowToggle}
            fullWidth={false}
          />
        </View>
      )}
      {blocked && (
        <View style={styles.blockedContainer}>
          <Button
            title="Desbloquear"
            type="remove_border"
            size="small"
            onPress={handleUnlockUser}
            fullWidth={false}
          />
        </View>
      )}
    </View>
  );
};

export default memo(UserItem);
