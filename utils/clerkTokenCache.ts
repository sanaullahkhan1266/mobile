import * as SecureStore from 'expo-secure-store';

export const tokenCache = {
  getToken: async (key: string) => {
    try {
      return await SecureStore.getItemAsync(key);
    } catch (err) {
      return null;
    }
  },
  saveToken: async (key: string, value: string) => {
    try {
      await SecureStore.setItemAsync(key, value);
    } catch (err) {
      // noop
    }
  },
  clearToken: async (key: string) => {
    try {
      await SecureStore.deleteItemAsync(key);
    } catch (err) {
      // noop
    }
  },
};
