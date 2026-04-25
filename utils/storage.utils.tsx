import * as SecureStore from "expo-secure-store";

const CACHE_TTL = 1 * 24 * 60 * 60 * 1000;
const PROFILE_KEY = "user_profile_basic";

/* -------- TYPES -------- */

type ProfileBasic = {
  imageUrl: string;
  coverUrl: string;
  userName: string;
  email?: string;
  updatedAt: number;
};

/* -------- MEMORY CACHE -------- */

let memoryProfile: ProfileBasic | null = null;

/* -------- TOKENS -------- */

export async function saveTokens(access: string, refresh: string) {
  await SecureStore.setItemAsync("user_token", access);
  await SecureStore.setItemAsync("refresh_token", refresh);
}

export async function getStoreageItem(key: string) {
  return await SecureStore.getItemAsync(key);
}

export async function deleteTokens() {
  await SecureStore.deleteItemAsync("user_token");
  await SecureStore.deleteItemAsync("refresh_token");
}

/* -------- PROFILE -------- */

export async function saveProfileBasic(data: Omit<ProfileBasic, "updatedAt">) {
  const payload: ProfileBasic = {
    ...data,
    updatedAt: Date.now(),
  };

  memoryProfile = payload;
  await SecureStore.setItemAsync(PROFILE_KEY, JSON.stringify(payload));
}

export async function getProfileBasic(): Promise<ProfileBasic | null> {
  if (memoryProfile) return memoryProfile;

  try {
    const value = await SecureStore.getItemAsync(PROFILE_KEY);
    if (!value) return null;

    const parsed = JSON.parse(value) as ProfileBasic;
    memoryProfile = parsed;

    return parsed;
  } catch {
    await clearProfileBasic();
    return null;
  }
}

export async function saveColorTheme(darkMode: boolean) {
  await SecureStore.setItemAsync("color_theme", darkMode ? "dark" : "light");
}

export async function getColorTheme() {
  const theme = await SecureStore.getItemAsync("color_theme");

  if (!theme) {
    return "dark";
  }

  return theme === "dark" ? "dark" : "light";
}

export async function getValidProfileBasic(): Promise<ProfileBasic | null> {
  const cached = await getProfileBasic();
  if (!cached) return null;

  if (!isCacheValid(cached)) return null;

  return cached;
}

export async function clearProfileBasic() {
  memoryProfile = null;
  await SecureStore.deleteItemAsync(PROFILE_KEY);
}

export async function deleteInfoUser() {
  await deleteTokens();
  await clearProfileBasic();
}

/* -------- VALIDATION -------- */

export function isCacheValid(cached: ProfileBasic) {
  return Date.now() - cached.updatedAt < CACHE_TTL;
}
