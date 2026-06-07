import { Button, Header, ProfileImage, TextBox } from "@/components/components";
import { useLanguage } from "@/context/LanguageContext";
import { useTheme } from "@/context/ThemeContext";
import { SearchedUserDTO, useSearchUsers } from "@/scripts/CreateGroup.script";
import { useStylesCreateGroup } from "@/styles/CreateGroup.style";
import { useApi } from "@/utils/request.utils";
import { useRouter } from "expo-router";
import { Check, X } from "lucide-react-native";
import { useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  Pressable,
  ScrollView,
  Text,
  View,
} from "react-native";

export default function CreateGroup() {
  const router = useRouter();
  const { colors } = useTheme();
  const { t } = useLanguage();
  const { request } = useApi();
  const styles = useStylesCreateGroup();

  const [groupName, setGroupName] = useState("");
  const [selectedUsers, setSelectedUsers] = useState<
    Map<string, SearchedUserDTO>
  >(new Map());
  const [isCreating, setIsCreating] = useState(false);

  const { query, setQuery, users, isLoading } = useSearchUsers();

  const toggleUserSelection = (user: SearchedUserDTO) => {
    const newMap = new Map(selectedUsers);
    if (newMap.has(user.userID)) {
      newMap.delete(user.userID);
    } else {
      newMap.set(user.userID, user);
    }
    setSelectedUsers(newMap);
  };

  const handleCreateGroup = async () => {
    if (!groupName.trim()) {
      alert(t("group_name_required"));
      return;
    }
    if (selectedUsers.size === 0) {
      alert(t("select_at_least_one_user"));
      return;
    }

    setIsCreating(true);
    try {
      const participantIds = Array.from(selectedUsers.keys());

      await request({
        urlComplement: "/api/chats/group",
        method: "POST",
        data: {
          title: groupName,
          participantsIds: participantIds,
        },
      });

      router.back();
    } catch (error) {
      console.error(t("create_group_failed"), error);
      alert(t("create_group_failed_message"));
    } finally {
      setIsCreating(false);
    }
  };

  return (
    <View style={{ flex: 1, backgroundColor: colors.background }}>
      <Header divider={true}>
        <Text
          style={{
            fontSize: 18,
            fontWeight: "bold",
            color: colors.textPrimary,
          }}
        >
          {t("create_group")}
        </Text>
      </Header>

      <View style={styles.content}>
        <View style={styles.inputSection}>
          <Text style={[styles.sectionTitle, { color: colors.textSecondary }]}>
            {t("enter_group_name")}
          </Text>
          <TextBox
            placeholder={t("enter_group_name_description")}
            value={groupName}
            onChangeText={setGroupName}
          />
        </View>

        {selectedUsers.size > 0 && (
          <View style={styles.selectedSection}>
            <Text
              style={[styles.sectionTitle, { color: colors.textSecondary }]}
            >
              {t("participants")} ({selectedUsers.size})
            </Text>

            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.selectedScrollContent}
            >
              {Array.from(selectedUsers.values()).map((user) => (
                <Pressable
                  key={`selected-${user.userID}`}
                  style={styles.selectedAvatarContainer}
                  onPress={() => toggleUserSelection(user)}
                >
                  <View style={styles.avatarWrapper}>
                    {user.profileImageName ? (
                      <ProfileImage
                        imageName={user.profileImageName}
                        size={56}
                      />
                    ) : (
                      <View
                        style={[
                          styles.fallbackAvatar,
                          {
                            backgroundColor: colors.primary,
                            width: 56,
                            height: 56,
                            borderRadius: 28,
                          },
                        ]}
                      >
                        <Text style={[styles.fallbackText, { fontSize: 24 }]}>
                          {user.userName
                            ? user.userName.charAt(0).toUpperCase()
                            : "?"}
                        </Text>
                      </View>
                    )}

                    <View
                      style={[
                        styles.removeBadge,
                        { borderColor: colors.background },
                      ]}
                    >
                      <X size={12} color="#FFF" />
                    </View>
                  </View>

                  <Text
                    style={[
                      styles.selectedAvatarName,
                      { color: colors.textPrimary },
                    ]}
                    numberOfLines={1}
                  >
                    {user.userName ? user.userName.split(" ")[0] : "Sem Nome"}
                  </Text>
                </Pressable>
              ))}
            </ScrollView>
          </View>
        )}

        <View style={styles.inputSection}>
          <TextBox
            placeholder={t("search_users_by_name_or_username")}
            value={query}
            onChangeText={setQuery}
          />
        </View>

        <View
          style={[styles.resultsHeader, { borderBottomColor: colors.border }]}
        >
          <Text
            style={[
              styles.sectionTitle,
              { color: colors.textSecondary, marginBottom: 0 },
            ]}
          >
            {t("search_results")} ({users.length})
          </Text>
        </View>

        {isLoading ? (
          <ActivityIndicator
            size="large"
            color={colors.primary}
            style={{ marginTop: 32 }}
          />
        ) : (
          <FlatList
            data={users}
            keyExtractor={(item) => item.userID}
            contentContainerStyle={{ paddingBottom: 100 }}
            renderItem={({ item }) => {
              const isSelected = selectedUsers.has(item.userID);

              return (
                <Pressable
                  style={[styles.userRow, { borderBottomColor: colors.border }]}
                  onPress={() => toggleUserSelection(item)}
                >
                  {item.profileImageName ? (
                    <ProfileImage imageName={item.profileImageName} size={48} />
                  ) : (
                    <View
                      style={[
                        styles.fallbackAvatar,
                        {
                          backgroundColor: colors.primary,
                          width: 48,
                          height: 48,
                          borderRadius: 24,
                        },
                      ]}
                    >
                      <Text style={styles.fallbackText}>
                        {item.userName
                          ? item.userName.charAt(0).toUpperCase()
                          : "?"}
                      </Text>
                    </View>
                  )}

                  <View style={styles.userInfo}>
                    <Text
                      style={[styles.userName, { color: colors.textPrimary }]}
                    >
                      {item.userName || "Sem Nome"}
                    </Text>
                    <Text
                      style={[
                        styles.userHandle,
                        { color: colors.textSecondary },
                      ]}
                    >
                      @{item.userName || "desconhecido"}
                    </Text>
                  </View>

                  <View
                    style={[
                      styles.checkbox,
                      { borderColor: colors.border },
                      isSelected && {
                        backgroundColor: colors.primary,
                        borderColor: colors.primary,
                      },
                    ]}
                  >
                    {isSelected && <Check size={16} color="#FFF" />}
                  </View>
                </Pressable>
              );
            }}
          />
        )}
      </View>

      {groupName.trim().length > 0 && selectedUsers.size > 0 && (
        <View style={{ paddingHorizontal: 24 }}>
          <Button
            title="Criar Grupo"
            type="fill"
            size="large"
            onPress={handleCreateGroup}
            fullWidth
            disabled={isCreating}
            style={styles.createButton}
          />
        </View>
      )}
    </View>
  );
}
