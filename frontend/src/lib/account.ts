export interface AccountProfile {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  name?: string;
  picture?: string;
}

export interface SavedAddress {
  id: string;
  email: string;
  nickname: string;
  firstName: string;
  lastName: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  zip: string;
  isDefault: boolean;
  createdAt?: string;
  updatedAt?: string;
}

const ACCOUNT_PROFILE_KEY = "totemood_account_profile";
const ACCOUNT_TOKEN_KEY = "totemood_account_token";

export const EMPTY_ACCOUNT_PROFILE: AccountProfile = {
  firstName: "",
  lastName: "",
  email: "",
  phone: "",
};

export interface AccountSession {
  token: string;
  user: AccountProfile;
}

export function getStoredAccountProfile(): AccountProfile {
  if (typeof window === "undefined") return EMPTY_ACCOUNT_PROFILE;

  try {
    const stored = window.localStorage.getItem(ACCOUNT_PROFILE_KEY);
    if (!stored) return EMPTY_ACCOUNT_PROFILE;
    return { ...EMPTY_ACCOUNT_PROFILE, ...JSON.parse(stored) };
  } catch {
    return EMPTY_ACCOUNT_PROFILE;
  }
}

export function saveStoredAccountProfile(profile: AccountProfile) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(ACCOUNT_PROFILE_KEY, JSON.stringify(profile));
}

export function getStoredAccountToken() {
  if (typeof window === "undefined") return "";
  return window.localStorage.getItem(ACCOUNT_TOKEN_KEY) || "";
}

export function saveStoredAccountSession(session: AccountSession) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(ACCOUNT_TOKEN_KEY, session.token);
  saveStoredAccountProfile(session.user);
}

export function clearStoredAccountProfile() {
  if (typeof window === "undefined") return;
  window.localStorage.removeItem(ACCOUNT_PROFILE_KEY);
  window.localStorage.removeItem(ACCOUNT_TOKEN_KEY);
}

export function accountAuthHeaders(): Record<string, string> {
  const token = getStoredAccountToken();
  return token ? { Authorization: `Bearer ${token}` } : {};
}
