import { ProfileImage } from "@/components/profile/ProfileImage";
import { Image, Text, View } from "react-native";
import { IconButton } from "../components";
import { postStyles } from "./post.style";

export default function Post() {
  return (
    <View style={postStyles.container}>
      <View style={postStyles.header}>
        <ProfileImage size={60} wrapper={false} />
        <Text style={postStyles.username}>Username</Text>
      </View>

      <Text style={postStyles.description}>
        Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec vel
        sapien nec ipsum fermentum commodo. Curabitur ac ligula quis metus
        efficitur tincidunt.
      </Text>
      <Image
        source={{
          uri: "https://images.unsplash.com/photo-1506744038136-46273834b3fb?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8cHJvZmlsZSUyMGNvdmVyfGVufDB8fDB8fHww&w=1000&q=80",
        }}
        style={postStyles.image}
      />
      <View
        style={{
          flexDirection: "row",
          marginTop: 16,
          justifyContent: "space-around",
        }}
      >
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
