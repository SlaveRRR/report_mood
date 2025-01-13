import { ThemedText } from '@/components/ThemedText';
import { contextToast } from '@/context';
import { ReactNode, useContext } from 'react';

export const useToast = () => {
  const { setVisible, setContent } = useContext(contextToast);

  const toast = (content: ReactNode) => {
    setContent(typeof content === 'string' ? <ThemedText className="p-3 rounded-xl">{content}</ThemedText> : content);
    setVisible(true);
  };
  return { toast };
};
