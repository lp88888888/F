// src/composables/useTheme.js
import { useThemeStore } from '@/stores/theme';
import { storeToRefs } from 'pinia';

export function useTheme() {
  const themeStore = useThemeStore();
  const { theme: pageTheme } = storeToRefs(themeStore);
  
  return {
    themeStore,
    pageTheme
  };
}