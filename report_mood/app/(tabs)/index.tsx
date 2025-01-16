//@ts-nocheck
import { Image, StyleSheet, TouchableOpacity, ScrollView, ActivityIndicator } from 'react-native';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { useContext, useEffect, useState } from 'react';
import { context } from '@/context';
import { router } from 'expo-router';
import { api } from '@/api';
import { useToast } from '@/hooks/useToast';
import { Survey } from '@/api/types';
import { GridList, Card, Text } from 'react-native-ui-lib';

export default function HomeScreen() {
  const { auth, user } = useContext(context);

  const [isLoading, setIsLoading] = useState(false);
  const [surveys, setSurveys] = useState<Survey[]>([]);
  const { toast } = useToast();

  useEffect(() => {
    const getData = async () => {
      setIsLoading(true);
      try {
        const { data } = await api.getUserSurveys();

        setSurveys(data);
      } catch (error) {
        toast('Ошибка при получении назначенных опросов');
      } finally {
        setIsLoading(false);
      }
    };

    if (user && user?.role === 'сотрудник') {
      getData();
    }
  }, [user]);

  if (isLoading || !user) {
    return (
      <ThemedView>
        <ActivityIndicator size={'large'} />
      </ThemedView>
    );
  }

  return (
    <ThemedView className="px-5  h-screen pt-5">
      <ThemedText type="title">Добро пожаловать в report mood!</ThemedText>
      {user.role === 'сотрудник' && (
        <ThemedView>
          <ThemedText className="text-center mb-4">Мои опросы</ThemedText>
          <GridList
            data={surveys}
            keyExtractor={(item) => item?.id?.toString() as string}
            renderItem={({ item }): { item: Survey } => (
              <TouchableOpacity activeOpacity={0.9} onPress={() => router.push(`/report/${item.id}`)}>
                <Card key={item.id} style={styles.card} enableShadow>
                  <Text style={styles.title}>Название опроса: {item.title}</Text>
                  <Text style={styles.text}>Нужно пройти!</Text>
                </Card>
              </TouchableOpacity>
            )}
            numColumns={2}
            itemSpacing={10}
          />
        </ThemedView>
      )}
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#F0F0F0',
    borderRadius: 10,
    padding: 10,
    maxWidth: 160,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#5e10ac',
    marginBottom: 8,
  },
  text: {
    padding: 5,
    borderWidth: 2,
    borderRadius: 10,
    textAlign: 'center',
    backgroundColor: '#000000',
    fontSize: 14,
    color: '#f4f4f4',
  },
});
