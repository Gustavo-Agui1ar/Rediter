import { useApi } from "@/utils/request.utils";
import { useLocalSearchParams } from "expo-router";
import { useCallback, useEffect, useState } from "react";
import { Alert } from "react-native";

export interface SinglePostData {
  id: string;
  userName: string;
  text: string;
  imageProfileUrl?: string;
  imageUrls?: string[];
  location?: string;
  edited?: boolean;
  createdAt: string;
  likesCount: number;
  likedByCurrentUser: boolean;
  postUserId: string;
  isFollowing: boolean;
  ownPost: boolean;
}

export function usePostDetails() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { request } = useApi();
  const [postData, setPostData] = useState<SinglePostData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isFollowing, setIsFollowing] = useState(false);
  const [isLiked, setIsLiked] = useState(false);
  const [likesCount, setLikesCount] = useState(0);

  useEffect(() => {
    async function fetchSinglePost() {
      if (!id) {
        setIsLoading(false);
        return;
      }

      try {
        setIsLoading(true);
        const response = await request({
          urlComplement: `/api/posts/${id}`,
          method: "GET",
        });

        if (response.ok) {
          const data = await response.json();
          setPostData(data);
          setIsFollowing(data.isFollowing);
          setIsLiked(data.likedByCurrentUser);
          setLikesCount(data.likesCount);
        } else {
          setPostData(null);
        }
      } catch (error) {
        console.error("Erro ao carregar o post:", error);
        setPostData(null);
      } finally {
        setIsLoading(false);
      }
    }

    fetchSinglePost();
  }, [id, request]);

  const syncFollowState = async () => {
    try {
      const followStateCurrently = !isFollowing;

      setIsFollowing((prev) => !prev);

      const url = followStateCurrently
        ? `/api/users/${postData?.postUserId}/follow`
        : `/api/users/${postData?.postUserId}/unfollow`;
      const method = followStateCurrently ? "POST" : "DELETE";

      request({ urlComplement: url, method, hasLoading: false });
    } catch (error) {
      console.error("Erro ao sincronizar follow:", error);
    }
  };

  const handleLikePost = useCallback(() => {
    if (!id) return;

    const wasLiked = isLiked;
    setIsLiked((prev) => !prev);
    setLikesCount((prev) => (wasLiked ? prev - 1 : prev + 1));

    request({
      urlComplement: `/api/posts/${id}/like`,
      method: wasLiked ? "DELETE" : "POST",
    })
      .then((response) => {
        if (response && !response.ok) throw new Error("Erro na API");
      })
      .catch((error) => {
        setIsLiked(wasLiked);
        setLikesCount((prev) => (wasLiked ? prev + 1 : prev - 1));
        Alert.alert("Erro", "Não foi possível processar sua curtida.");
      });
  }, [id, isLiked, request]);

  return {
    postData,
    isLoading,
    isLiked,
    likesCount,
    isFollowing,
    handleLikePost,
    syncFollowState,
  };
}
