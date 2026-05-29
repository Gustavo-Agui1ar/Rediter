import { pickImage } from "@/utils/filePicker.utils";
import { handleGetLocation } from "@/utils/location.utils";
import { useApi } from "@/utils/request.utils";
import { router, useLocalSearchParams } from "expo-router";
import {
  startTransition,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { Alert, DeviceEventEmitter, Keyboard } from "react-native";
export interface SinglePostData {
  id: string;
  userName: string;
  text: string;
  profileImageName?: string;
  imageUrls?: string[];
  location?: string;
  edited?: boolean;
  createdAt: string;
  likesCount: number;
  likedByCurrentUser: boolean;
  userId: string;
  ownPost?: boolean;
}

export function usePostDetails() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { request } = useApi();
  const [postData, setPostData] = useState<SinglePostData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isLiked, setIsLiked] = useState(false);
  const [likesCount, setLikesCount] = useState(0);
  const [isFollowing, setIsFollowing] = useState(false);
  const [userId, setUserId] = useState<string>("");
  const [isOwnProfile, setIsOwnProfile] = useState(false);
  const [comments, setComments] = useState<SinglePostData[]>([]);
  const [isLoadingComments, setIsLoadingComments] = useState(false);
  const [hasMoreComments, setHasMoreComments] = useState(true);
  const isFetchingCommentsRef = useRef(false);
  const hasMoreCommentsRef = useRef(true);
  const lastCursorRef = useRef<{ createdAt: string; id: string } | null>(null);
  const [commentText, setCommentText] = useState("");
  const [isInputFocused, setIsInputFocused] = useState(false);
  const [replyFiles, setReplyFiles] = useState<any[]>([]);
  const [replyLocation, setReplyLocation] = useState<string | null>(null);
  const [showEmoji, setShowEmoji] = useState(false);
  const [isSendingReply, setIsSendingReply] = useState(false);

  const fetchComments = useCallback(
    async (isLoadMore: boolean = false) => {
      if (!id || isFetchingCommentsRef.current) return;
      if (isLoadMore && !hasMoreCommentsRef.current) return;

      isFetchingCommentsRef.current = true;
      startTransition(() => setIsLoadingComments(true));

      if (!isLoadMore) {
        hasMoreCommentsRef.current = true;
        startTransition(() => setHasMoreComments(true));
        lastCursorRef.current = null;
      }

      try {
        const pageSize = 10;
        const params = new URLSearchParams({ pageSize: String(pageSize) });

        if (isLoadMore && lastCursorRef.current) {
          params.append("lastCreatedAt", lastCursorRef.current.createdAt);
          params.append("lastId", lastCursorRef.current.id);
        }

        const data: SinglePostData[] = await request({
          urlComplement: `/api/posts/${id}/comments?${params.toString()}`,
          method: "GET",
          hasLoading: false,
        });

        const newComments = Array.isArray(data) ? data : [];

        if (newComments.length < pageSize) {
          hasMoreCommentsRef.current = false;
          startTransition(() => setHasMoreComments(false));
        }

        if (newComments.length > 0) {
          const lastItem = newComments[newComments.length - 1];
          lastCursorRef.current = {
            createdAt: lastItem.createdAt,
            id: lastItem.id,
          };
        }

        startTransition(() => {
          setComments((prev) =>
            isLoadMore ? [...prev, ...newComments] : newComments,
          );
        });
      } catch (error) {
        console.error("Erro ao carregar comentários:", error);
      } finally {
        isFetchingCommentsRef.current = false;
        startTransition(() => setIsLoadingComments(false));
      }
    },
    [id, request],
  );

  const handleGoToProfile = useCallback(() => {
    router.push({
      pathname: `/profile/${userId}` as any,
      params: {
        isOwnProfile: String(isOwnProfile),
        initialName: postData?.userName,
        initialAvatar: postData?.profileImageName,
      } as any,
    });
  }, [userId, isOwnProfile, postData]);

  useEffect(() => {
    let isMounted = true;

    async function fetchSinglePost() {
      if (!id) {
        if (isMounted) startTransition(() => setIsLoading(false));
        return;
      }

      try {
        startTransition(() => setIsLoading(true));

        const data = await request({
          urlComplement: `/api/posts/${id}`,
          method: "GET",
          hasLoading: false,
        });

        if (isMounted) {
          startTransition(() => {
            setPostData(data);
            setIsOwnProfile(data.ownPost || false);
            setUserId(data.postUserID);
            setIsLiked(data.likedByCurrentUser);
            setLikesCount(data.likesCount);
            setIsFollowing(data.isFollowing || false);
          });
        }
      } catch (error) {
        console.error("Erro ao carregar o post:", error);
        if (isMounted) startTransition(() => setPostData(null));
      } finally {
        if (isMounted) startTransition(() => setIsLoading(false));
      }
    }

    fetchSinglePost();
    return () => {
      isMounted = false;
    };
  }, [id, request]);

  useEffect(() => {
    if (id) fetchComments(false);
  }, [id, fetchComments]);

  useEffect(() => {
    const subscription = DeviceEventEmitter.addListener(
      "refresh_comments",
      () => fetchComments(false),
    );
    return () => subscription.remove();
  }, [fetchComments]);

  const handleLikePost = useCallback(async () => {
    if (!id) return;
    const wasLiked = isLiked;

    startTransition(() => {
      setIsLiked(!wasLiked);
      setLikesCount((prev) => (wasLiked ? prev - 1 : prev + 1));
    });

    try {
      await request({
        urlComplement: `/api/posts/${id}/like`,
        method: wasLiked ? "DELETE" : "POST",
        hasLoading: false,
      });
    } catch (error) {
      startTransition(() => {
        setIsLiked(wasLiked);
        setLikesCount((prev) => (wasLiked ? prev + 1 : prev - 1));
      });
      Alert.alert("Erro", "Não foi possível processar sua curtida.");
    }
  }, [id, isLiked, request]);

  const syncFollowState = useCallback(() => {
    startTransition(() => setIsFollowing((prev) => !prev));
  }, []);

  const onAddImage = useCallback(async () => {
    try {
      const result = await pickImage();
      if (result) {
        startTransition(() => setReplyFiles((prev) => [...prev, result]));
      }
    } catch {
      Alert.alert("Erro", "Erro ao acessar a galeria de imagens.");
    }
  }, []);

  const onRemoveImage = useCallback((indexToRemove: number) => {
    startTransition(() => {
      setReplyFiles((prev) => prev.filter((_, i) => i !== indexToRemove));
    });
  }, []);

  const onToggleEmoji = useCallback(() => {
    Keyboard.dismiss();
    startTransition(() => setShowEmoji((prev) => !prev));
  }, []);

  const onEmojiSelected = useCallback((emojiObject: { emoji: string }) => {
    setCommentText((prev) => prev + emojiObject.emoji);
  }, []);

  const onAddLocation = useCallback(async () => {
    try {
      await handleGetLocation({ setLocationName: setReplyLocation });
    } catch {
      Alert.alert("Erro", "Não foi possível obter sua localização.");
    }
  }, []);

  const createReplyFormData = useCallback(() => {
    const formData = new FormData();
    formData.append("Text", commentText);
    formData.append("ParentPostId", id || "");
    if (replyLocation) formData.append("LocationName", replyLocation);

    replyFiles.forEach((fileAsset) => {
      if (fileAsset?.uri) {
        const uriParts = fileAsset.uri.split("/");
        formData.append("Pictures", {
          uri: fileAsset.uri,
          name:
            fileAsset.fileName ||
            uriParts[uriParts.length - 1] ||
            `image-${Date.now()}.jpg`,
          type: fileAsset.mimeType || "image/jpeg",
        } as any);
      }
    });

    return formData;
  }, [commentText, replyLocation, replyFiles, id]);

  const handleSendReply = useCallback(async () => {
    if (commentText.trim() === "" && replyFiles.length === 0) {
      Alert.alert("Aviso", "A resposta não pode estar vazia.");
      return;
    }

    try {
      startTransition(() => setIsSendingReply(true));

      await request({
        urlComplement: `/api/posts/${id}/comments`,
        method: "POST",
        data: createReplyFormData(),
        hasLoading: false,
      });

      startTransition(() => {
        setCommentText("");
        setReplyFiles([]);
        setReplyLocation(null);
        setIsInputFocused(false);
      });
      Keyboard.dismiss();
      DeviceEventEmitter.emit("refresh_comments");
    } catch (error) {
      console.error("Erro ao enviar resposta:", error);
      Alert.alert(
        "Erro",
        "Não foi possível enviar a resposta. Tente novamente.",
      );
    } finally {
      startTransition(() => setIsSendingReply(false));
    }
  }, [commentText, replyFiles, id, request, createReplyFormData]);

  return useMemo(
    () => ({
      states: {
        postData,
        isLoading,
        isLiked,
        likesCount,
        isFollowing,
        comments,
        isLoadingComments,
        hasMoreComments,
        commentText,
        isInputFocused,
        replyFiles,
        replyLocation,
        showEmoji,
        isSendingReply,
      },
      functions: {
        handleGoToProfile,
        fetchComments,
        setCommentText,
        setIsInputFocused,
        handleLikePost,
        syncFollowState,
        onAddImage,
        onRemoveImage,
        onToggleEmoji,
        onEmojiSelected,
        onAddLocation,
        handleSendReply,
      },
    }),
    [
      postData,
      isLoading,
      isLiked,
      likesCount,
      isFollowing,
      comments,
      isLoadingComments,
      hasMoreComments,
      commentText,
      isInputFocused,
      replyFiles,
      replyLocation,
      showEmoji,
      isSendingReply,
      handleGoToProfile,
      fetchComments,
      handleLikePost,
      syncFollowState,
      onAddImage,
      onRemoveImage,
      onToggleEmoji,
      onEmojiSelected,
      onAddLocation,
      handleSendReply,
    ],
  );
}
