import { ProfileImage } from "@/components/profile/ProfileImage";
import { Image, Text, View } from "react-native";
import { postStyles } from "./post.style";

export default function Post() {
  return (
    <View style={postStyles.container}>
      <ProfileImage size={60} wrapper={false} />
      <Image
        source={{
          uri: "https://images.unsplash.com/photo-1506744038136-46273834b3fb?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8cHJvZmlsZSUyMGNvdmVyfGVufDB8fDB8fHww&w=1000&q=80",
        }}
        style={postStyles.image}
      />

      <Text style={postStyles.tittle}>Título do Post</Text>
      <Text style={postStyles.description}>
        Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec vel
        sapien nec ipsum fermentum commodo. Curabitur ac ligula quis metus
        efficitur tincidunt.
      </Text>
    </View>
  );
}
