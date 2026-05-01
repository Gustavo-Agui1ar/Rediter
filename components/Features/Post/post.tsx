import { router } from "expo-router";
import React, { useState } from "react";
import {
  Alert,
  DeviceEventEmitter,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

import ProfileImage from "@/components/Features/Profile/ProfileImage";
import DisplayImages from "@/components/Feedback/DisplayImages/DisplayImage";
import IconButton from "@/components/UI/IconButton/IconButton";
import { useGlobalStyles } from "@/styles/global.styles";
import { formatDate } from "@/utils/datePost.utils";
import { useApi } from "@/utils/request.utils";
import { usePostStyles } from "./post.style";

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
  const [showOptions, setShowOptions] = useState(false);

  const styles = useGlobalStyles();
  const postStyles = usePostStyles();
  const { request } = useApi();
  const handleEditPost = () => {
    setShowOptions(false);
    router.push({
      pathname: "/NewPost",
      params: {
        isEditing: "true",
        postId: postId,
        text: text,
        location: Location || "",
        imageUrls: JSON.stringify(postImageUrl || []),
      },
    });
  };

  const handleDeletePost = () => {
    Alert.alert(
      "Excluir Publicação",
      "Deseja realmente apagar este post? Esta ação não pode ser desfeita.",
      [
        {
          text: "Cancelar",
          style: "cancel",
          onPress: () => setShowOptions(false),
        },
        {
          text: "Excluir",
          style: "destructive",
          onPress: async () => {
            const response = await request({
              urlComplement: `/api/posts/${postId}`,
              method: "DELETE",
            });
            if (response.ok) {
              DeviceEventEmitter.emit("refresh_posts");
            }
          },
        },
      ],
    );
  };

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
            onPress={() => setShowOptions((prev) => !prev)}
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
              <TouchableOpacity
                onPress={() => setShowOptions(false)}
                style={[
                  postStyles.itemOptionsContainer,
                  postStyles.itemOptionsContainerLast,
                ]}
              >
                <Text style={postStyles.optionText}>Salvar Mídia</Text>
              </TouchableOpacity>
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
