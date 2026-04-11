import { ProfileImage } from "@/components/profile/ProfileImage";
import { Image, Text, View } from "react-native";

export default function Post() {
  return (
    <View
      style={{
        width: "100%",
        padding: 16,
        borderColor: "#333",
        borderWidth: 1,
        borderRadius: 8,
        marginBottom: 16,
      }}
    >
      <ProfileImage
        imageUrl="https://avatars.githubusercontent.com/u/12345678?v=4"
        size={60}
        wrapper={false}
      />
      <Image
        source={{
          uri: "https://images.unsplash.com/photo-1506744038136-46273834b3fb?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8cHJvZmlsZSUyMGNvdmVyfGVufDB8fDB8fHww&w=1000&q=80",
        }}
        style={{
          width: "100%",
          height: 200,
          borderRadius: 8,
          marginBottom: 8,
          marginTop: 8,
        }}
      />

      <Text style={{ fontSize: 16, fontWeight: "bold", marginBottom: 8 }}>
        Título do Post
      </Text>
      <Text style={{ fontSize: 14, color: "#CCC" }}>
        Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec vel
        sapien nec ipsum fermentum commodo. Curabitur ac ligula quis metus
        efficitur tincidunt.
      </Text>
    </View>
  );
}
