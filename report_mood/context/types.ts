import { TokensResponse, User } from '@/api/types';
import { Dispatch, ReactNode, SetStateAction } from 'react';

export type Tokens = TokensResponse;

export interface ContextProviderProps {
  children: React.ReactNode;
}

export interface Context {
  auth: boolean;
  setAuth: Dispatch<SetStateAction<boolean>>;
  user: User;
  navigationReady: boolean;
}

export interface ContextToast {
  visible: boolean;
  setVisible: Dispatch<SetStateAction<boolean>>;
  content: ReactNode;
  setContent: Dispatch<SetStateAction<ReactNode>>;
}

export interface ToastProviderProps {
  children: React.ReactNode;
}
