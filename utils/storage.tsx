import * as SecureStore from "expo-secure-store";

export async function saveTokens(access: string, refresh: string) {
  await SecureStore.setItemAsync("user_token", access);
  await SecureStore.setItemAsync("refresh_token", refresh);
}

export async function getStoreageItem(key: string) {
  return await SecureStore.getItemAsync(key);
}

// Para recuperar depois em outras telas:
// const token = await SecureStore.getItemAsync('user_token');
