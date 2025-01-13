import { Image, StyleSheet, Platform, ScrollView } from 'react-native';

import { HelloWave } from '@/components/HelloWave';
import ParallaxScrollView from '@/components/ParallaxScrollView';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useContext, useEffect } from 'react';
import { context } from '@/context';
import { router, useRootNavigationState } from 'expo-router';

export default function HomeScreen() {
  const { auth, navigationReady } = useContext(context);

  useEffect(() => {
    if (!auth && navigationReady) {
      router.replace('/signin');
    }
  }, []);

  return (
    <>
      <ThemedView className="px-5" style={styles.titleContainer}>
        <ThemedText type="title">Добро пожаловать в report mood!</ThemedText>
        <HelloWave />
      </ThemedView>
      <ThemedView>
        <ThemedText>Мои опросы</ThemedText>
      </ThemedView>
    </>
  );
}

const styles = StyleSheet.create({
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  stepContainer: {
    gap: 8,
    marginBottom: 8,
  },
  reactLogo: {
    height: 178,
    width: 290,
    bottom: 0,
    left: 0,
    position: 'absolute',
  },
});
