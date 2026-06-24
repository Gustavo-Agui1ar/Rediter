import Post from "@/components/Features/Post/Post";
import { PostSkeleton } from "@/components/Features/Profile/Posts/PostSkeleton";
import ProfileImage from "@/components/Features/Profile/ProfileImage";
import DisplayImages from "@/components/Feedback/DisplayImages/DisplayImage";
import HighLightText from "@/components/UI/HighLightText";
import IconButton from "@/components/UI/IconButton/IconButton";
import { Button, Divider, TextBox } from "@/components/components";
import { useLanguage } from "@/context/LanguageContext";
import { useTheme } from "@/context/ThemeContext";
import { usePostDetails } from "@/scripts/PostDetails.script";
import { usePostDetailsStyles } from "@/styles/PostDetails.style";
import { useFormattedDate } from "@/utils/datePost.utils";
import { useCallback, useMemo, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  FlatList,
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import Animated, { LinearTransition } from "react-native-reanimated";
import { EmojiKeyboard } from "rn-emoji-keyboard";

export default function PostDetailsScreen() {
  const { functions, states } = usePostDetails();
  const styles = usePostDetailsStyles();
  const { colors } = useTheme();
  const { t } = useLanguage();

  const {
    postData,
    isLoading,
    isLiked,
    likesCount,
    isFollowing,
    comments,
    isLoadingComments,
    hasMoreComments,
    isSendingReply,
  } = states;

  const {
    syncFollowState,
    handleLikePost,
    fetchComments,
    handleSendReply,
    pickNewImage,
    fetchLocation,
    handleGoToProfile,
  } = functions;

  const [commentText, setCommentText] = useState("");
  const [replyFiles, setReplyFiles] = useState<any[]>([]);
  const [replyLocation, setReplyLocation] = useState<string | null>(null);
  const [isInputFocused, setIsInputFocused] = useState(false);
  const [showEmoji, setShowEmoji] = useState(false);

  const onAddImage = useCallback(async () => {
    const result = await pickNewImage();
    if (result) setReplyFiles((prev) => [...prev, result]);
  }, [pickNewImage]);

  const onRemoveImage = useCallback((indexToRemove: number) => {
    setReplyFiles((prev) => prev.filter((_, i) => i !== indexToRemove));
  }, []);

  const onAddLocation = useCallback(() => {
    fetchLocation(setReplyLocation);
  }, [fetchLocation]);

  const onToggleEmoji = useCallback(() => {
    Keyboard.dismiss();
    setShowEmoji((prev) => !prev);
  }, []);

  const submitReply = useCallback(async () => {
    if (commentText.trim() === "" && replyFiles.length === 0) {
      Alert.alert("Aviso", "A resposta não pode estar vazia.");
      return;
    }

    Keyboard.dismiss();

    const isSuccess = await handleSendReply(
      commentText,
      replyLocation,
      replyFiles,
    );

    if (isSuccess) {
      setCommentText("");
      setReplyFiles([]);
      setReplyLocation(null);
      setIsInputFocused(false);
      setShowEmoji(false);
    }
  }, [commentText, replyFiles, replyLocation, handleSendReply]);

  const onEmojiSelected = useCallback((emojiObject: { emoji: string }) => {
    setCommentText((prev) => prev + emojiObject.emoji);
  }, []);

  const formattedDate = useFormattedDate(postData?.createdAt || "");

  const listHeader = useMemo(() => {
    if (isLoading) return <PostSkeleton />;

    if (!postData) {
      return (
        <View style={styles.notFound}>
          <Text style={styles.notFoundText}>Post não encontrado.</Text>
        </View>
      );
    }

    return (
      <View>
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.userinfo}
            activeOpacity={0.7}
            onPress={handleGoToProfile}
          >
            <ProfileImage
              size={50}
              wrapper={false}
              imageName={postData.profileImageName}
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
                {formattedDate} {postData.edited && "• " + t("post_edited")}
              </Text>
            </View>
          </TouchableOpacity>

          {!postData.ownPost && (
            <View style={styles.followButtonWrapper}>
              <Button
                title={isFollowing ? t("btn_following") : t("btn_follow")}
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

        {postData.location && (
          <View style={styles.locationBadge}>
            <Text
              style={styles.locationText}
              numberOfLines={1}
              ellipsizeMode="tail"
            >
              📍 {postData.location}
            </Text>
          </View>
        )}

        <View style={styles.actionsContainer}>
          <TouchableOpacity activeOpacity={0.6} style={styles.actionGroup}>
            <IconButton type="none" icon="message" circle={false} size={44} />
            <Text style={styles.statText}>{comments.length}</Text>
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

        <View style={styles.commentHeader}>
          <Text style={styles.countCommentsText}>
            {comments.length > 0
              ? `${comments.length} ${comments.length === 1 ? t("comment_one") : t("comment_other")}`
              : t("comment_none")}
          </Text>

          {comments.length > 0 && (
            <Text style={styles.moreRecentText}>
              {t("comment_more_recent")}
            </Text>
          )}
        </View>
      </View>
    );
  }, [
    isLoading,
    postData,
    isFollowing,
    isLiked,
    likesCount,
    comments.length,
    colors,
    styles,
    syncFollowState,
    handleLikePost,
  ]);

  const keyExtractor = useCallback((item: any) => item.id.toString(), []);

  const handleEndReached = useCallback(() => {
    if (hasMoreComments && !isLoadingComments) {
      fetchComments(true);
    }
  }, [hasMoreComments, isLoadingComments, fetchComments]);

  const renderCommentItem = useCallback(
    ({ item }: any) => (
      <View style={{ paddingLeft: 8 }}>
        <Post
          userName={item.userName}
          text={item.text}
          imageProfileUrl={item.profileImageName}
          postImageUrl={item.imageUrls || []}
          postId={item.id}
          createdAt={item.createdAt}
          countLikes={item.likesCount}
          countComments={item.commentsCount}
          liked={item.likedByCurrentUser}
          userId={item.userId}
          ownProfile={item.ownPost || false}
          canGoToProfile={true}
          isReply={true}
        />
      </View>
    ),
    [],
  );

  const emptyComponent = useMemo(() => {
    if (isLoadingComments && comments.length === 0 && postData) {
      return (
        <ActivityIndicator
          size="small"
          color={colors.primary}
          style={{ marginTop: 20 }}
        />
      );
    }
    return null;
  }, [isLoadingComments, comments.length, postData, colors.primary]);

  const footerComponent = useMemo(() => {
    if (isLoadingComments && comments.length > 0) {
      return (
        <ActivityIndicator
          size="small"
          color={colors.primary}
          style={{ marginVertical: 20 }}
        />
      );
    }
    return null;
  }, [isLoadingComments, comments.length, colors.primary]);

  return (
    <KeyboardAvoidingView
      style={{ flex: 1, backgroundColor: colors.background }}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      keyboardVerticalOffset={Platform.select({
        ios: 90,
        android: 80,
      })}
    >
      <FlatList
        style={[styles.container, { flex: 1 }]}
        contentContainerStyle={[styles.content, { paddingBottom: 20 }]}
        data={comments}
        keyExtractor={keyExtractor}
        onEndReached={handleEndReached}
        onEndReachedThreshold={0.5}
        ListHeaderComponent={listHeader}
        ListEmptyComponent={emptyComponent}
        ListFooterComponent={footerComponent}
        renderItem={renderCommentItem}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
        removeClippedSubviews={Platform.OS === "android"}
        maxToRenderPerBatch={10}
      />

      {!isLoadingComments && postData && (
        <Animated.View
          layout={LinearTransition.duration(150)}
          style={[
            styles.bottomInputContainer,
            {
              borderTopWidth: 1,
              borderColor: colors.border,
              paddingTop: 10,
              paddingBottom: Platform.OS === "ios" ? 24 : 10,
              backgroundColor: colors.background,
            },
          ]}
        >
          {replyLocation && (
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                paddingBottom: 6,
              }}
            >
              <Text style={{ color: colors.primary, fontSize: 13, flex: 1 }}>
                📍 {replyLocation}
              </Text>
            </View>
          )}

          {replyFiles.length > 0 && (
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                paddingBottom: 8,
                gap: 12,
              }}
            >
              <Text style={{ color: colors.primary, fontSize: 13 }}>
                {replyFiles.length} {t("comment_attached_images")}
              </Text>
              <TouchableOpacity onPress={() => onRemoveImage(0)}>
                <Text
                  style={{
                    color: colors.error || "red",
                    fontSize: 12,
                    fontWeight: "bold",
                  }}
                >
                  {t("btn_remove")}
                </Text>
              </TouchableOpacity>
            </View>
          )}

          <View style={styles.inputWrapper}>
            <TextBox
              placeholder={
                isSendingReply ? t("comment_sending") : t("comment_post")
              }
              placeholderTextColor={colors.disabled}
              multiline
              maxLength={280}
              value={commentText}
              onChangeText={setCommentText}
              onFocus={() => {
                setIsInputFocused(true);
                setShowEmoji(false);
              }}
              onBlur={() => setIsInputFocused(false)}
              editable={!isSendingReply}
              icon="send"
              onIconPress={submitReply}
            />
          </View>

          {isInputFocused && (
            <View style={styles.toolbarContainer}>
              <View style={styles.toolbarIcons}>
                <IconButton
                  icon="image"
                  size={36}
                  type="none"
                  iconColor={colors.primary}
                  disabled={isSendingReply}
                  onPress={onAddImage}
                />
                <IconButton
                  icon="emoji"
                  size={36}
                  type="none"
                  iconColor={colors.primary}
                  disabled={isSendingReply}
                  onPress={onToggleEmoji}
                />
                <IconButton
                  icon="location"
                  size={36}
                  type="none"
                  iconColor={colors.primary}
                  disabled={isSendingReply}
                  onPress={onAddLocation}
                />
              </View>

              {isSendingReply && (
                <ActivityIndicator size="small" color={colors.primary} />
              )}
            </View>
          )}
        </Animated.View>
      )}

      {showEmoji && (
        <Animated.View
          style={{ height: 250 }}
          layout={LinearTransition.duration(150)}
        >
          <EmojiKeyboard
            onEmojiSelected={onEmojiSelected}
            allowMultipleSelections
          />
        </Animated.View>
      )}
    </KeyboardAvoidingView>
  );
}
