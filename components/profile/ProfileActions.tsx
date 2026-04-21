import { default as Button } from "@/components/Button/button";
import IconButton from "@/components/IconButton/IconButton";
import { useLoading } from "@/context/loadingContext";
import { Colors } from "@/styles/theme";
import { request } from "@/utils/request.utils";
import { router } from "expo-router";
import { useState } from "react";
import { Text, View } from "react-native";
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
    <View
      style={{
        flexDirection: "row",
        marginTop: 20,
        width: "100%",
        alignItems: "flex-end",
        justifyContent: "flex-end",
        gap: 10,
      }}
    >
      <View
        style={{
          flex: 1,
          marginTop: 8,
          marginLeft: 16,
          justifyContent: "center",
          alignItems: "flex-start",
        }}
      >
        <Text
          style={{
            fontSize: 20,
            fontWeight: "bold",
            color: Colors.primaryLight,
            flexWrap: "wrap",
          }}
        >
          {userName}
        </Text>
      </View>
      {canFollow && (
        <>
          <View style={{ flex: 1, marginRight: 10 }}>
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
