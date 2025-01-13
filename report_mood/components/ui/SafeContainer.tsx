import React, { FC, ReactNode } from 'react';
import { ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ThemedText } from '../ThemedText';

interface Props {
  children: ReactNode;
}

export const SafeContainer: FC<Props> = ({ children }) => {
  return (
    <SafeAreaView className="h-full">
      <ScrollView contentContainerStyle={{ height: '100%' }}>{children}</ScrollView>
    </SafeAreaView>
  );
};
