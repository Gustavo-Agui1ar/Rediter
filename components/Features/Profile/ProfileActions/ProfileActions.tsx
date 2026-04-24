import { default as Button } from "@/components/UI/Button/button";
import IconButton from "@/components/UI/IconButton/IconButton";
import { useLoading } from "@/context/loadingContext";
import { request } from "@/utils/request.utils";
import { router } from "expo-router";
import { useState } from "react";
import { Text, View } from "react-native";
import { styles } from "./profileActions.style";

interface ProfileActionsProps {
  canFollow?: boolean;
  userName?: string;
}

export default function ProfileActions({
  canFollow = true,
  userName = "Usuário",
}: ProfileActionsProps) {
  const { setLoading } = useLoading();
  const [isFollowing, setIsFollowing] = useState(false);
  return (
    <View style={styles.container}>
      <View style={styles.nameContainer}>
        <Text style={styles.nameText}>{userName}</Text>
      </View>
      {canFollow && (
        <>
          <View style={styles.buttonWrapper}>
            <Button
              title={isFollowing ? "Seguindo" : "Seguir"}
              type={isFollowing ? "border" : "fill"}
              onPress={updateFollowStatus}
            />
          </View>
          <IconButton icon="message" />
        </>
      )}
      <IconButton icon="configuration" onPress={Config} />
    </View>
  );

  function updateFollowStatus() {
    setIsFollowing((prev) => !prev);
  }

  async function Config() {
    if (!canFollow) {
      var response = await request({
        urlComplement: `/User/GetUser`,
        method: "GET",
        setLoading,
      });

      if (response.ok) {
        var json = await response.json();

        router.push({
          pathname: "/configs",
          params: {
            name: json.name,
            email: json.email,
            imageName: json.imageName,
            coverName: json.imageCover,
          },
        });
      }
    }
  }
}
