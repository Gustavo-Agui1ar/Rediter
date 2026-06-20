import ProfileImage from "@/components/Features/Profile/ProfileImage";
import Button from "@/components/UI/Button/button";
import HighlightedText from "@/components/UI/HighLightText";
import { useLanguage } from "@/context/LanguageContext";
import { useTheme } from "@/context/ThemeContext";
import { useRouter } from "expo-router";
import { memo } from "react";
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
  isAdminMode?: boolean;
  onDelete?: () => void;
}

export const UserItem = ({
  user,
  searchTerm,
  blocked,
  onUnblock,
  isAdminMode = false,
  onDelete,
}: UserItemProps) => {
  const styles = useStylesUserItem();
  const { colors } = useTheme();
  const router = useRouter();
  const { t } = useLanguage();

  const { handleFollowToggle, buttonTitle, buttonType } = useFollow(
    user.userID,
    user.isFollowing,
    onUnblock,
  );

  const handleGoToProfile = () => {
    router.push({
      pathname: `/profile/${user.userID}` as any,
      params: {
        isOwnProfile: user.ownProfile,
        initialName: user.userName,
        initialAvatar: user.profileImageName,
      } as any,
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

      {isAdminMode && !user.ownProfile ? (
        <View style={styles.buttonContainer}>
          <Button
            title={t("btn_delete")}
            type="remove_border"
            size="small"
            onPress={onDelete}
            fullWidth={false}
          />
        </View>
      ) : (
        <>
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
                title={t("btn_unblock")}
                type="remove_border"
                size="small"
                onPress={() => {
                  if (onUnblock) onUnblock(user.userID as unknown as string);
                }}
                fullWidth={false}
              />
            </View>
          )}
        </>
      )}
    </View>
  );
};

export default memo(UserItem);
