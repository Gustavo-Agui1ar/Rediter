import { useLoading } from "@/context/loadingContext";
import { request } from "@/utils/request";
import { getStoreageItem } from "@/utils/storage";
import { router } from "expo-router";
import { useState } from "react";
import { View } from "react-native";
import { Button } from "../components";
import IconButton from "../IconButton/IconButton";

interface ProfileActionsProps {
  canFollow?: boolean;
}

export default function ProfileActions({
  canFollow = true,
}: ProfileActionsProps) {
  const { setLoading, loading } = useLoading();
  const [isFollowing, setIsFollowing] = useState(false);
  return (
    <View
      style={{
        flexDirection: "row",
        marginTop: 20,
        width: "100%",
        alignItems: "flex-end",
        justifyContent: "flex-end",
      }}
    >
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
      <IconButton icon="configuration" onPress={Config} disabled={loading} />
    </View>
  );

  function updateFollowStatus() {
    setIsFollowing((prev) => !prev);
  }

  async function Config() {
    if (!canFollow) {
      var refresh_token = await getStoreageItem("refresh_token");
      var access_token = await getStoreageItem("user_token");

      const query = new URLSearchParams({
        AccessToken: access_token ?? "",
        RefreshToken: refresh_token ?? "",
      }).toString();

      var response = await request({
        urlComplement: `/User/GetUser?${query}`,
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
