import { useThemeColor } from '@/hooks/useThemeColor';
import React, { FC } from 'react';
import { TextInput, TextInputProps } from 'react-native';

interface Props extends TextInputProps {
  lightColor?: string;
  darkColor?: string;
}

export const ThemedInput: FC<Props> = ({ lightColor, darkColor, className, ...props }) => {
  const color = useThemeColor({ light: lightColor, dark: darkColor }, 'text');

  return (
    <TextInput
      {...props}
      style={{
        color,
      }}
      className={`w-full px-3 py-2 mt-1 border rounded-md ${className}`}
    />
  );
};
