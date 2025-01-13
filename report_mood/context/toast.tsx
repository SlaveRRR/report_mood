import { createContext, ReactNode, useState } from 'react';
import { Toast } from 'react-native-ui-lib';
import { ContextToast, ToastProviderProps } from './types';

import { View } from 'react-native';
import { ThemedText } from '@/components/ThemedText';

export const contextToast = createContext({} as ContextToast);

export const ToastProvider = ({ children }: ToastProviderProps) => {
  const [visible, setVisible] = useState(false);

  const [content, setContent] = useState<ReactNode>(<ThemedText></ThemedText>);

  return (
    <contextToast.Provider value={{ visible, setVisible, content, setContent }}>
      {children}
      <View>
        <Toast visible={visible} swipeable position={'bottom'} autoDismiss={5000} onDismiss={() => setVisible(false)}>
          {content}
        </Toast>
      </View>
    </contextToast.Provider>
  );
};
