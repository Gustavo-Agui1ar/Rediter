import React, { memo } from "react";
import { View } from "react-native";
import { useStylesPosts } from "./Posts.style";

export const PostSkeleton = memo(() => {
  const styles = useStylesPosts();
  return (
    <View style={styles.postContainer}>
      <View style={styles.skeletonHeader}>
        <View style={styles.skeletonAvatar} />
        <View style={styles.skeletonNameInfo}>
          <View style={[styles.skeletonTextBar, { width: 120 }]} />
          <View style={[styles.skeletonTextBar, { width: 80, height: 10 }]} />
        </View>
      </View>
      <View
        style={[styles.skeletonTextBar, { width: "100%", marginBottom: 8 }]}
      />
      <View style={[styles.skeletonTextBar, { width: "80%" }]} />
      <View style={styles.skeletonImage} />
    </View>
  );
});
