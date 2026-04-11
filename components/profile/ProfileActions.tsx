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
      <IconButton icon="configuration" onPress={Config} />
    </View>
  );

  function updateFollowStatus() {
    setIsFollowing((prev) => !prev);
  }

  function Config() {
    console.log("Config: ", canFollow);
    if (!canFollow) {
      router.push("/configs");
    }
  }
}
