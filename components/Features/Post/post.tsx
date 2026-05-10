import ProfileImage from "@/components/Features/Profile/ProfileImage";
import DisplayImages from "@/components/Feedback/DisplayImages/DisplayImage";
import HighlightedText from "@/components/UI/HighLightText";
import IconButton from "@/components/UI/IconButton/IconButton";
import { useTheme } from "@/context/ThemeContext";
import { useGlobalStyles } from "@/styles/global.styles";
import { formatDate } from "@/utils/datePost.utils";
import React, { memo } from "react";
// 1. Adicione o Pressable nas importações
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
  liked?: boolean;
  canGoToProfile?: boolean;
  userId: string;
}

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
  liked = false,
  canGoToProfile = true,
  userId,
}: PostProps) {
  const styles = useGlobalStyles();
  const postStyles = usePostStyles();
  const { colors } = useTheme();

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
  } = usePost({
    postId,
    text,
    Location,
    postImageUrl,
    countLikes,
    liked,
    userId,
  });

  const hasImages = postImageUrl && postImageUrl.length > 0;
  const hasOptions = !ownProfile || hasImages;

  return (
    <Pressable style={postStyles.container} onPress={handleClickPost}>
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
              <Text style={postStyles.timeText}>
                {formatDate(createdAt as string)}
              </Text>
              {edited && <Text style={postStyles.editedText}> • Editado</Text>}
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
              <View style={[styles.editorContainer, postStyles.dropdownMenu]}>
                {!ownProfile && (
                  <>
                    <TouchableOpacity
                      onPress={handleEditPost}
                      style={postStyles.itemOptionsContainer}
                    >
                      <Text style={postStyles.optionText}>Editar Post</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                      onPress={handleDeletePost}
                      style={postStyles.itemOptionsContainer}
                    >
                      <Text style={postStyles.optionTextDelete}>
                        Excluir Post
                      </Text>
                    </TouchableOpacity>
                  </>
                )}

                {hasImages && (
                  <TouchableOpacity
                    disabled={isDownloading}
                    onPress={handleDownloadMedia}
                    style={[
                      postStyles.itemOptionsContainer,
                      postStyles.itemOptionsContainerLast,
                      { opacity: isDownloading ? 0.5 : 1 },
                    ]}
                  >
                    {isDownloading ? (
                      <View
                        style={{
                          flexDirection: "row",
                          alignItems: "center",
                          gap: 6,
                        }}
                      >
                        <ActivityIndicator
                          size="small"
                          color={colors.primary}
                        />
                        <Text style={postStyles.optionText}>Baixando...</Text>
                      </View>
                    ) : (
                      <Text style={postStyles.optionText}>Salvar Mídia</Text>
                    )}
                  </TouchableOpacity>
                )}
              </View>
            )}
          </View>
        )}
      </View>

      <View style={postStyles.contentBody}>
        {text ? (
          <HighlightedText
            text={text}
            searchTerm={searchTerm}
            textStyle={postStyles.description}
            highlightColor={colors.primary}
          />
        ) : null}

        <View style={postStyles.imageContainer}>
          <DisplayImages files={postImageUrl || []} />
        </View>

        {Location && (
          <View style={postStyles.locationBadge}>
            <Text style={postStyles.locationText}>📍 {Location}</Text>
          </View>
        )}
      </View>

      <View style={postStyles.buttonContainer}>
        <TouchableOpacity activeOpacity={0.6} style={postStyles.actionGroup}>
          <IconButton type="none" icon="message" circle={false} size={44} />
          <Text style={postStyles.actionLabel}>0</Text>
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
          <Text
            style={[
              postStyles.actionLabel,
              isLiked && { color: colors.textPrimary },
            ]}
          >
            {likesCount}
          </Text>
        </TouchableOpacity>
      </View>
    </Pressable>
  );
}

export default memo(Post);
