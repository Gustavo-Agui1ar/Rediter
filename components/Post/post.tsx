import { ProfileImage } from "@/components/profile/ProfileImage";
import { styles } from "@/styles/theme";
import { router } from "expo-router";
import { useState } from "react";
import { Text, TouchableOpacity, View } from "react-native";
import { IconButton } from "../components";
import { DisplayImages } from "../DisplayImages/displayImage";
import { postStyles } from "./post.style";

interface PostProps {
  text: string;
  imageProfileUrl?: string;
  userName: string;
  postImageUrl?: string[];
  postId: string;
  Location?: string;
  edited?: boolean;
  myProfile?: boolean;
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
}: PostProps) {
  const [id] = useState(postId);

  const [showOptions, setShowOptions] = useState(false);

  const handleEditPost = () => {
    setShowOptions(false);

    router.push({
      pathname: "/newPost",
      params: {
        isEditing: "true",
        postId: id,
        text: text,
        location: Location || "",
        imageUrls: JSON.stringify(postImageUrl || []),
      },
    });
  };

  return (
    <View style={postStyles.container}>
      {/* HEADER */}
      <View style={[postStyles.header]}>
        {/* Lado Esquerdo do Header: Foto e Nome */}
        <View style={{ flexDirection: "row", alignItems: "center" }}>
          <ProfileImage size={60} wrapper={false} imageName={imageProfileUrl} />
          <Text style={postStyles.username}>
            {userName}{" "}
            {edited && <Text style={postStyles.edited}> - Editado</Text>}
          </Text>
        </View>

        {/* Lado Direito do Header: Botão 3 pontinhos */}
        <View style={{ position: "relative" }}>
          <IconButton
            type="none"
            icon="more-vertical"
            size={28}
            circle={false}
            onPress={() => setShowOptions((prev) => !prev)}
          />

          {showOptions && (
            <View style={styles.editorContainer}>
              {myProfile && (
                <>
                  <TouchableOpacity
                    onPress={handleEditPost}
                    style={postStyles.itemOptionsContainer}
                  >
                    <Text style={{ color: "white", fontSize: 16 }}>
                      Editar Post
                    </Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    onPress={() => {
                      /* Handle Delete */
                    }}
                    style={postStyles.itemOptionsContainer}
                  >
                    <Text style={{ color: "white", fontSize: 16 }}>
                      Excluir Post
                    </Text>
                  </TouchableOpacity>
                </>
              )}
              <TouchableOpacity
                onPress={() => {}}
                style={[
                  postStyles.itemOptionsContainer,
                  postStyles.itemOptionsContainerLast,
                ]}
              >
                <Text style={{ color: "white", fontSize: 16 }}>
                  Dowload Imagens
                </Text>
              </TouchableOpacity>
            </View>
          )}
        </View>
      </View>

      <View style={{ zIndex: 1 }}>
        <Text style={postStyles.description}>{text}</Text>
        <DisplayImages files={postImageUrl || []} />
        {Location && <Text style={postStyles.location}>📍 Em {Location}</Text>}
      </View>
      {/* BARRAS DE AÇÃO */}
      <View style={postStyles.buttonContainer}>
        <IconButton
          type="none"
          icon="repeat"
          circle={false}
          size={36}
          onPress={() => {}}
        />
        <IconButton
          type="none"
          icon="message"
          circle={false}
          size={36}
          onPress={() => {}}
        />
        <IconButton
          type="none"
          icon="like"
          circle={false}
          size={36}
          onPress={() => {}}
        />
      </View>
    </View>
  );
}
