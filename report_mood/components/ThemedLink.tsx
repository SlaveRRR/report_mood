import { useThemeColor } from '@/hooks/useThemeColor';
import { LinkProps, Link } from 'expo-router';

interface ThemedLinkProps extends LinkProps {
  lightColor?: string;
  darkColor?: string;
  children: React.ReactNode;
}

export const ThemedLink = ({ children, lightColor, darkColor, ...props }: ThemedLinkProps) => {
  const color = useThemeColor({ light: lightColor, dark: darkColor }, 'text');
  return (
    <Link style={{ color }} {...props}>
      {children}
    </Link>
  );
};
