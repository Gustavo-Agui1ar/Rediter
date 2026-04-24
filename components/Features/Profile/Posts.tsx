import Post from "@/components/Features/Post/post";
import { useLoading } from "@/context/loadingContext";
import { Colors } from "@/styles/theme";
import { request } from "@/utils/request.utils";
import { useEffect, useState } from "react";
import {
  DeviceEventEmitter,
  RefreshControl,
  ScrollView,
  Text,
} from "react-native";

export default function Posts() {
  const [posts, setPosts] = useState<any[]>([]);
  const { setLoading } = useLoading();

  const [refreshing, setRefreshing] = useState(false);
  const fetchFirstPage = async (isCommand = false) => {
    if (!isCommand && posts.length > 0) {
      return;
    }

    try {
      if (!refreshing) setLoading(true);

      const pageSize = 10;

      const url = `/Post/GetPostUser?pageSize=${pageSize}`;

      const response = await request({
        urlComplement: url,
        method: "GET",
      });

      if (response) {
        var json = await response.json();
        setPosts(json || []);
      }
    } catch (error: any) {
      console.error("Erro ao carregar posts:", error.response?.data || error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchFirstPage(false);

    const subscription = DeviceEventEmitter.addListener("refresh_posts", () => {
      fetchFirstPage(true);
    });

    return () => {
      subscription.remove();
    };
  }, []);

  const onRefresh = () => {
    setRefreshing(true);
    fetchFirstPage(true);
  };

  return (
    <ScrollView
      contentContainerStyle={{ padding: 16, flexGrow: 1, gap: 16 }}
      refreshControl={
        <RefreshControl
          refreshing={refreshing}
          onRefresh={onRefresh}
          tintColor={Colors.primary}
          colors={[Colors.primary]}
        />
      }
    >
      {posts.length === 0 ? (
        <Text
          style={{
            textAlign: "center",
            margin: "auto",
            color: Colors.textMuted,
            fontSize: 16,
            fontWeight: "bold",
            marginTop: 50,
          }}
        >
          Nenhum post encontrado
        </Text>
      ) : (
        posts.map((post, index) => (
          <Post
            key={post.postId || post.id || index}
            userName={post.userName}
            text={post.text}
            imageProfileUrl={post.imageProfileUrl}
            postImageUrl={post.imageUrls}
            postId={post.postId || post.id}
            Location={post.Location || post.location}
            edited={post.edited}
          />
        ))
      )}
    </ScrollView>
  );
}
