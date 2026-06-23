"use client";

import { useSyncExternalStore } from "react";
import { getMockUser, type MockUser } from "@/lib/courses";

export const MOCK_USER_STORAGE_KEY = "sacf_university_user_id";
export const MOCK_USER_EVENT = "sacf-user-change";

function subscribe(callback: () => void) {
  window.addEventListener("storage", callback);
  window.addEventListener(MOCK_USER_EVENT, callback);

  return () => {
    window.removeEventListener("storage", callback);
    window.removeEventListener(MOCK_USER_EVENT, callback);
  };
}

function getSnapshot(): MockUser | null {
  return getMockUser(window.localStorage.getItem(MOCK_USER_STORAGE_KEY));
}

function getServerSnapshot(): MockUser | null {
  return null;
}

export function useMockUser() {
  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}

export function setMockUser(userId: string) {
  window.localStorage.setItem(MOCK_USER_STORAGE_KEY, userId);
  window.dispatchEvent(new Event(MOCK_USER_EVENT));
}

export function clearMockUser() {
  window.localStorage.removeItem(MOCK_USER_STORAGE_KEY);
  window.dispatchEvent(new Event(MOCK_USER_EVENT));
}
