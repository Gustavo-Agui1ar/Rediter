import ProfileImage from "@/components/Features/Profile/ProfileImage";
import DisplayImages from "@/components/Feedback/DisplayImages/DisplayImage";
import HighlightedText from "@/components/UI/HighLightText";
import IconButton from "@/components/UI/IconButton/IconButton";
import { useAuth } from "@/context/AuthContext";
import { useLanguage } from "@/context/LanguageContext";
import { useTheme } from "@/context/ThemeContext";
import { useGlobalStyles } from "@/styles/global.styles";
import { useFormattedDate } from "@/utils/datePost.utils";
import { memo, useMemo } from "react";
import {
  ActivityIndicator,
  Pressable,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { usePost } from "./Post.script";
import { usePostStyles } from "./Post.style";

interface PostProps {
  text: string;
  imageProfileUrl?: string;
  userName: string;
  postImageUrl?: string[];
  postId: string;
  Location?: string;
  edited?: boolean;
  createdAt?: string;
  searchTerm?: string;
  ownProfile: boolean;
  countLikes?: number;
  countComments?: number;
  liked?: boolean;
  canGoToProfile?: boolean;
  userId: string;
  isReply?: boolean;
  onDelete?: () => void;
}

const EMPTY_IMAGE_ARRAY: string[] = [];

function Post({
  text,
  imageProfileUrl,
  userName,
  postImageUrl,
  postId,
  Location,
  edited = false,
  createdAt,
  searchTerm = "",
  ownProfile = false,
  countLikes = 0,
  countComments = 0,
  liked = false,
  canGoToProfile = true,
  userId,
  isReply = false,
  onDelete,
}: PostProps) {
  const styles = useGlobalStyles();
  const postStyles = usePostStyles();
  const { colors } = useTheme();
  const { isAdmin } = useAuth();

  const {
    showOptions,
    isDownloading,
    isLiked,
    likesCount,
    toggleOptions,
    handleEditPost,
    handleDeletePost,
    handleDownloadMedia,
    handleLikePost,
    handleGoToProfile,
    handleClickPost,
    setShowOptions,
  } = usePost({
    postId,
    text,
    Location,
    postImageUrl,
    countLikes,
    liked,
    userId,
    isOwnProfile: ownProfile,
  });

  const { t } = useLanguage();
  const safeImageUrls = postImageUrl || EMPTY_IMAGE_ARRAY;
  const hasImages = safeImageUrls.length > 0;
  const hasOptions = ownProfile || hasImages || isAdmin;

  const downloadingOpacityStyle = useMemo(
    () => ({ opacity: isDownloading ? 0.5 : 1 }),
    [isDownloading],
  );

  const likedTextStyle = useMemo(
    () => (isLiked ? { color: colors.textPrimary } : undefined),
    [isLiked, colors.textPrimary],
  );

  return (
    <Pressable
      style={[postStyles.container, isReply && postStyles.containerReply]}
      onPress={handleClickPost}
    >
      <View style={postStyles.header}>
        <View style={postStyles.userInfo}>
          <TouchableOpacity
            disabled={!canGoToProfile}
            onPress={handleGoToProfile}
          >
            <ProfileImage
              size={44}
              wrapper={false}
              imageName={imageProfileUrl}
            />
          </TouchableOpacity>
          <View style={postStyles.userTextContainer}>
            <View style={postStyles.metaDataContainer}>
              <HighlightedText
                text={userName}
                searchTerm={searchTerm}
                textStyle={postStyles.username}
                highlightColor={colors.primary}
              />
            </View>
            <View style={postStyles.metaDataContainer}>
              {createdAt && (
                <Text style={postStyles.timeText}>
                  {useFormattedDate(createdAt)}
                </Text>
              )}
              {edited && (
                <Text style={postStyles.editedText}> • {t("post_edited")}</Text>
              )}
            </View>
          </View>
        </View>

        {hasOptions && (
          <View style={postStyles.optionsWrapper}>
            <IconButton
              type="none"
              icon="more-vertical"
              size={32}
              circle={false}
              onPress={toggleOptions}
            />

            {showOptions && (
              <>
                <Pressable
                  style={postStyles.invisibleOverlay}
                  onPress={() => setShowOptions(false)}
                />

                <View
                  style={[
                    styles.editorContainer,
                    postStyles.dropdownMenu,
                    { zIndex: 10 },
                  ]}
                >
                  {ownProfile && (
                    <>
                      <TouchableOpacity
                        onPress={handleEditPost}
                        style={postStyles.itemOptionsContainer}
                      >
                        <Text style={postStyles.optionText}>
                          {t("btn_edit")}
                        </Text>
                      </TouchableOpacity>

                      <TouchableOpacity
                        onPress={handleDeletePost}
                        style={postStyles.itemOptionsContainer}
                      >
                        <Text style={postStyles.optionTextDelete}>
                          {t("btn_delete")}
                        </Text>
                      </TouchableOpacity>
                    </>
                  )}

                  {isAdmin && !ownProfile && (
                    <TouchableOpacity
                      onPress={onDelete ? onDelete : handleDeletePost}
                      style={postStyles.itemOptionsContainer}
                    >
                      <Text style={postStyles.optionTextDelete}>
                        {t("btn_delete")} (Admin)
                      </Text>
                    </TouchableOpacity>
                  )}

                  {hasImages && (
                    <TouchableOpacity
                      disabled={isDownloading}
                      onPress={handleDownloadMedia}
                      style={[
                        postStyles.itemOptionsContainer,
                        postStyles.itemOptionsContainerLast,
                        downloadingOpacityStyle,
                      ]}
                    >
                      {isDownloading ? (
                        <View style={postStyles.downloadingIndicator}>
                          <ActivityIndicator
                            size="small"
                            color={colors.primary}
                          />
                          <Text style={postStyles.optionText}>
                            {t("comment_sending")}
                          </Text>
                        </View>
                      ) : (
                        <Text style={postStyles.optionText}>
                          {t("btn_save")}
                        </Text>
                      )}
                    </TouchableOpacity>
                  )}
                </View>
              </>
            )}
          </View>
        )}
      </View>

      <View
        style={[postStyles.contentBody, isReply && postStyles.contentBodyReply]}
      >
        {!!text && (
          <HighlightedText
            text={text}
            searchTerm={searchTerm}
            textStyle={postStyles.description}
            highlightColor={colors.primary}
          />
        )}

        {hasImages && (
          <View style={postStyles.imageContainer}>
            <DisplayImages files={safeImageUrls} />
          </View>
        )}

        {!!Location && (
          <View style={postStyles.locationBadge}>
            <Text style={postStyles.locationText}>📍 {Location}</Text>
          </View>
        )}
      </View>

      <View
        style={[
          postStyles.buttonContainer,
          isReply && postStyles.buttonContainerReply,
        ]}
      >
        <TouchableOpacity activeOpacity={0.6} style={postStyles.actionGroup}>
          <IconButton type="none" icon="message" circle={false} size={44} />
          <Text style={postStyles.actionLabel}>{countComments}</Text>
        </TouchableOpacity>

        <TouchableOpacity activeOpacity={0.6} style={postStyles.actionGroup}>
          <IconButton type="none" icon="repeat" circle={false} size={44} />
          <Text style={postStyles.actionLabel}>0</Text>
        </TouchableOpacity>

        <TouchableOpacity activeOpacity={0.6} style={postStyles.actionGroup}>
          <IconButton
            type="none"
            icon={isLiked ? "likeFilled" : "like"}
            iconColor={isLiked ? colors.primaryDark : undefined}
            circle={false}
            size={44}
            onPress={handleLikePost}
          />
          <Text style={[postStyles.actionLabel, likedTextStyle]}>
            {likesCount}
          </Text>
        </TouchableOpacity>
      </View>
    </Pressable>
  );
}

const areEqual = (prevProps: PostProps, nextProps: PostProps) => {
  return (
    prevProps.postId === nextProps.postId &&
    prevProps.liked === nextProps.liked &&
    prevProps.countLikes === nextProps.countLikes &&
    prevProps.countComments === nextProps.countComments &&
    prevProps.searchTerm === nextProps.searchTerm &&
    prevProps.isReply === nextProps.isReply &&
    prevProps.postImageUrl?.length === nextProps.postImageUrl?.length
  );
};

export default memo(Post, areEqual);
