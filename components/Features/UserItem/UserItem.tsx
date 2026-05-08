import ProfileImage from "@/components/Features/Profile/ProfileImage";
import Button from "@/components/UI/Button/button";
import HighlightedText from "@/components/UI/HighLightText";
import { useTheme } from "@/context/ThemeContext";
import React, { memo } from "react";
import { Text, View } from "react-native";
import { useFollow } from "./UserItem.script";
import { useStylesUserItem } from "./UserItem.style";

interface UserItemProps {
  user: { userid: number; userName: string; profileImageName: string };
  searchTerm: string;
}

const UserItem = ({ user, searchTerm }: UserItemProps) => {
  const styles = useStylesUserItem();
  const { colors } = useTheme();
  const { handleFollowToggle, buttonTitle, buttonType } = useFollow(
    user.userid,
  );

  return (
    <View style={styles.container}>
      <View style={styles.userInfo}>
        <ProfileImage size={44} imageName={user.profileImageName} />

        <Text style={styles.userName} numberOfLines={1} ellipsizeMode="tail">
          <HighlightedText
            text={user.userName}
            searchTerm={searchTerm}
            textStyle={styles.userName}
            highlightColor={colors.primary}
          />
        </Text>
      </View>

      <View style={styles.buttonContainer}>
        <Button
          title={buttonTitle}
          type={buttonType}
          size="small"
          onPress={handleFollowToggle}
          fullWidth={false}
        />
      </View>
    </View>
  );
};

export default memo(UserItem);
