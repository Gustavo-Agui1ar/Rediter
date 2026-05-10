import { PostSkeleton } from "@/components/Features/Profile/Posts/Posts";
import ProfileImage from "@/components/Features/Profile/ProfileImage";
import DisplayImages from "@/components/Feedback/DisplayImages/DisplayImage";
import HighLightText from "@/components/UI/HighLightText";
import IconButton from "@/components/UI/IconButton/IconButton";
import { Button, Divider } from "@/components/components";
import { useTheme } from "@/context/ThemeContext";
import { usePostDetails } from "@/scripts/PostDetails.script";
import { usePostDetailsStyles } from "@/styles/PostDetails.style";
import { formatDate } from "@/utils/datePost.utils";
import React from "react";
import { ScrollView, Text, TouchableOpacity, View } from "react-native";

export default function PostDetailsScreen() {
  const {
    postData,
    isLoading,
    isLiked,
    likesCount,
    handleLikePost,
    syncFollowState,
    isFollowing,
  } = usePostDetails();
  const styles = usePostDetailsStyles();
  const { colors } = useTheme();

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      {isLoading ? (
        <PostSkeleton />
      ) : postData ? (
        <View>
          <View style={styles.header}>
            <ProfileImage
              size={50}
              wrapper={false}
              imageName={postData.imageProfileUrl}
            />
            <View style={styles.headerText}>
              <Text
                style={styles.userName}
                numberOfLines={1}
                ellipsizeMode="tail"
              >
                {postData.userName}
              </Text>
              <Text style={styles.timeText}>
                {formatDate(postData.createdAt)}{" "}
                {postData.edited && "• Editado"}
              </Text>
            </View>
            {!postData.ownPost && (
              <View style={styles.followButtonWrapper}>
                <Button
                  title={isFollowing ? "Seguindo" : "Seguir"}
                  size="small"
                  type={isFollowing ? "border" : "fill"}
                  onPress={syncFollowState}
                />
              </View>
            )}
          </View>

          {postData.text ? (
            <HighLightText
              text={postData.text}
              textStyle={styles.postText}
              highlightColor={colors.primary}
            />
          ) : null}

          {postData.imageUrls && postData.imageUrls.length > 0 && (
            <View style={styles.imageContainer}>
              <DisplayImages files={postData.imageUrls} />
            </View>
          )}

          {postData.location ? (
            <View style={styles.locationBadge}>
              <Text
                style={styles.locationText}
                numberOfLines={1}
                ellipsizeMode="tail"
              >
                📍 {postData.location}
              </Text>
            </View>
          ) : null}

          <View style={styles.actionsContainer}>
            <TouchableOpacity activeOpacity={0.6} style={styles.actionGroup}>
              <IconButton type="none" icon="message" circle={false} size={44} />
              <Text style={styles.statText}>0</Text>
            </TouchableOpacity>

            <TouchableOpacity activeOpacity={0.6} style={styles.actionGroup}>
              <IconButton type="none" icon="repeat" circle={false} size={44} />
              <Text style={styles.statText}>0</Text>
            </TouchableOpacity>

            <TouchableOpacity
              activeOpacity={0.6}
              style={styles.actionGroup}
              onPress={handleLikePost}
            >
              <IconButton
                type="none"
                icon={isLiked ? "likeFilled" : "like"}
                iconColor={isLiked ? colors.primaryDark : colors.textPrimary}
                circle={false}
                size={44}
                onPress={handleLikePost}
              />
              <Text style={styles.statText}>{likesCount}</Text>
            </TouchableOpacity>
          </View>

          <Divider />
        </View>
      ) : (
        <View style={styles.notFound}>
          <Text style={styles.notFoundText}>Post não encontrado.</Text>
        </View>
      )}
    </ScrollView>
  );
}
