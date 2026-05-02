import React from "react";
import { ActivityIndicator, Text, TouchableOpacity, View } from "react-native";

import ProfileImage from "@/components/Features/Profile/ProfileImage";
import DisplayImages from "@/components/Feedback/DisplayImages/DisplayImage";
import IconButton from "@/components/UI/IconButton/IconButton";
import { useGlobalStyles } from "@/styles/global.styles";
import { formatDate } from "@/utils/datePost.utils";
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
  myProfile?: boolean;
  createdAt?: string;
}

export default function Post({
  text,
  imageProfileUrl,
  userName,
  postImageUrl,
  postId,
  Location,
  edited = false,
  myProfile = true,
  createdAt,
}: PostProps) {
  const styles = useGlobalStyles();
  const postStyles = usePostStyles();

  const {
    showOptions,
    isDownloading,
    toggleOptions,
    handleEditPost,
    handleDeletePost,
    handleDownloadMedia,
  } = usePost({
    postId,
    text,
    Location,
    postImageUrl,
  });

  const hasImages = postImageUrl && postImageUrl.length > 0;

  return (
    <View style={postStyles.container}>
      {/* HEADER */}
      <View style={postStyles.header}>
        <View style={postStyles.userInfo}>
          <ProfileImage size={44} wrapper={false} imageName={imageProfileUrl} />
          <View style={postStyles.userTextContainer}>
            <Text style={postStyles.username}>{userName}</Text>
            <View style={postStyles.metaDataContainer}>
              <Text style={postStyles.timeText}>
                {formatDate(createdAt as string)}
              </Text>
              {edited && <Text style={postStyles.editedText}> • Editado</Text>}
            </View>
          </View>
        </View>

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
              {myProfile && (
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
                      <ActivityIndicator size="small" color="#007AFF" />
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
      </View>

      {/* CONTEÚDO */}
      <View style={postStyles.contentBody}>
        {text ? <Text style={postStyles.description}>{text}</Text> : null}

        <View style={postStyles.imageContainer}>
          <DisplayImages files={postImageUrl || []} />
        </View>

        {Location && (
          <View style={postStyles.locationBadge}>
            <Text style={postStyles.locationText}>📍 {Location}</Text>
          </View>
        )}
      </View>

      {/* BARRAS DE AÇÃO */}
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
          <IconButton type="none" icon="like" circle={false} size={44} />
          <Text style={postStyles.actionLabel}>0</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
