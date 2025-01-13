import { Context, ContextProviderProps, Tokens } from './types';
import { createContext, useEffect, useState } from 'react';
import { api } from '@/api';
import { useToast } from '@/hooks/useToast';
import { router, useRootNavigationState } from 'expo-router';
import { User } from '@/api/types';
import { saveTokens } from '@/utils';
import * as SecureStore from 'expo-secure-store';

export const context = createContext({} as Context);

const { Provider } = context;

export const ContextProvider = ({ children }: ContextProviderProps) => {
  const [auth, setAuth] = useState(false);
  const [user, setUser] = useState({} as User);
  const [navigationReady, setNavigationReady] = useState(false);
  const { toast } = useToast();

  const checkAuth = async () => {
    const token = await SecureStore.getItemAsync('refresh_token');

    if (token) {
      try {
        const { data } = await api.refreshToken({ refresh_token: token });

        await saveTokens(data);
        setAuth(true);
        const { data: dataUser } = await api.getMe();
        setUser(dataUser);
      } catch (error) {
        toast((error as { message: string }).message);
      }
    } else {
      router.replace('/signin');
    }
  };

  const rootNavigation = useRootNavigationState();

  useEffect(() => {
    if (!rootNavigation) {
      return;
    }
    setNavigationReady(true);
    checkAuth();
  }, []);

  return <Provider value={{ auth, setAuth, user, navigationReady }}>{children}</Provider>;
};
