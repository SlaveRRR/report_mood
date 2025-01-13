import { api } from '@/api';
import { SignInParams, SignUpParams } from '@/api/types';
import { Tokens } from '@/context/types';
import * as SecureStore from 'expo-secure-store';

export const saveTokens = async (tokens: Tokens) => {
  await SecureStore.setItemAsync('access_token', tokens.access_token);
  await SecureStore.setItemAsync('refresh_token', tokens.refresh_token);
};

export const deleteTokens = async () => {
  await SecureStore.deleteItemAsync('access_token');
  await SecureStore.deleteItemAsync('refresh_token');
};

export const signIn = async (formData: SignInParams) => {
  try {
    const { data } = await api.signIn(formData);

    await saveTokens(data);
  } catch (error) {
    throw error;
  }
};

export const signUp = async (formData: SignUpParams) => {
  try {
    const { data } = await api.signUp(formData);

    await saveTokens(data);
  } catch (error) {
    throw error;
  }
};

export const signOut = async () => {
  try {
    const token = await SecureStore.getItemAsync('refresh_token');
    await api.logout({ refresh_token: token as string });

    await deleteTokens();
  } catch (error) {
    throw error;
  }
};
