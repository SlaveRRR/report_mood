//@ts-nocheck
import { api } from '@/api';
import { Survey } from '@/api/types';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { context } from '@/context';
import { useToast } from '@/hooks/useToast';
import { signOut } from '@/utils';
import axios from 'axios';
import { router } from 'expo-router';
import { useContext, useEffect, useState } from 'react';
import { ListRenderItem, ScrollView, Image } from 'react-native';
import {
  ActivityIndicator,
  Alert,
  FlatList,
  Pressable,
  StyleSheet,
  TouchableHighlight,
  TouchableOpacity,
} from 'react-native';
import { Avatar, Button, Card, GridList, Text } from 'react-native-ui-lib';

const API_KEY = '6diZeeyWQ-b8C3k9w-9fbOedmgADULMxciJa1bgbPoE';

export default function TabTwoScreen() {
  const { user, setAuth } = useContext(context);
  const [currentValue, setCurrentValue] = useState();
  const [surveys, setSurveys] = useState<Survey[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleLogOut = () => {
    Alert.alert('Выход из профиля', 'Вы уверены, что хотите выйти из профиля?', [
      {
        text: 'Нет',
        style: 'cancel',
      },
      {
        text: 'Да',
        onPress: async () => {
          await signOut();
          setAuth(false);
          return router.replace('/signin');
        },
      },
    ]);
  };

  useEffect(() => {
    const getData = async () => {
      setIsLoading(true);
      try {
        const { data } = await api.getHRSurveys();

        setSurveys(data);
      } catch (error) {
        toast('Ошибка при получени созданных опросов');
      } finally {
        setIsLoading(false);
      }
    };
    if (user?.role === 'HR') {
      getData();
    }
  }, []);

  const [images, setImages] = useState<string[]>([]);

  useEffect(() => {
    const fetchImages = async () => {
      setIsLoading(true);
      try {
        const response = await axios.get('https://api.unsplash.com/photos/random', {
          params: { count: surveys.length, query: 'office' },
          headers: {
            Authorization: `Client-ID ${API_KEY}`,
          },
        });
        const urls = response.data.map((item: any) => item.urls.small);
        console.log(urls);
        setImages(urls);
      } catch (error) {
        console.error('Error fetching images:', error);
      } finally {
        setIsLoading(false);
      }
    };
    if (surveys) {
      fetchImages();
    }
  }, [surveys]);

  if (isLoading) {
    return (
      <ThemedView className="h-screen pt-2">
        <ActivityIndicator size={'large'} />
      </ThemedView>
    );
  }

  return (
    <ScrollView>
      <ThemedView className="px-2 pb-2">
        <ThemedView className="flex pt-4 flex-row justify-between items-center">
          <ThemedText className="mb-4" type="title">
            Профиль
          </ThemedText>
          <Button
            onPress={handleLogOut}
            $backgroundDangerHeavy
            backgroundColor={'transparent'}
            label="Выйти"
            className="px-9 py-2 border-2 border-red-500"
          />
        </ThemedView>
        <ThemedView className="pt-10 flex flex-col gap-4 items-center px-1">
          <Avatar
            size={80}
            imageStyle={{
              objectFit: 'contain',
            }}
            source={{
              uri: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQqGQ8dQ-LMiMmTEyBijR0FzpQHC7tH6qTE2g&s',
            }}
            label={'user'}
          />

          <ThemedText className="self-start" type="subtitle">
            Пользователь: {user.username}
          </ThemedText>
          <ThemedText className="self-start" type="subtitle">
            Позиция: {user.position}
          </ThemedText>
          <ThemedText className="self-start" type="subtitle">
            Возраст: {user.age}
          </ThemedText>
          {user.role === 'HR' && (
            <>
              <ThemedText>Созданные опросы</ThemedText>
              <GridList
                data={surveys}
                keyExtractor={(item) => item?.id?.toString() as string}
                renderItem={({ item, index }): { item: Survey } => (
                  <TouchableOpacity activeOpacity={0.9} onPress={() => router.push(`/report/${item.id}`)}>
                    <Card key={item.id} style={styles.card} enableShadow>
                      <Text style={styles.title}>Название опроса: {item.title}</Text>
                      <Text style={styles.text} text100 color="#888888">
                        Количество прохождений: {item.total_completions}
                      </Text>
                      <Text style={item.total_completions > 0 ? styles.textAnalyticsSuccess : styles.textAnalyticsFail}>
                        {item.total_completions > 0 ? 'Аналитика по опросу' : 'Аналитики пока нет('}
                      </Text>
                      {images[index] && (
                        <Image source={{ uri: images[index] }} style={styles.image} resizeMode="cover" />
                      )}
                    </Card>
                  </TouchableOpacity>
                )}
                numColumns={2}
                itemSpacing={10}
              />

              <Button size={'large'} hyperlink onPress={() => router.push('/report/create')} label="Создать опрос">
                Создать опрос
              </Button>
            </>
          )}
        </ThemedView>
      </ThemedView>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#F0F0F0',
    borderRadius: 10,
    padding: 10,
    maxWidth: 150,
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
    fontSize: 14,
    color: '#888',
  },
  image: {
    marginTop: 20,
    width: '100%',
    height: 120,
    borderRadius: 8,
  },
  textAnalyticsSuccess: {
    marginTop: 10,
    padding: 5,
    borderRadius: 10,
    fontSize: 16,
    color: 'white',
    backgroundColor: 'green',
  },
  textAnalyticsFail: {
    marginTop: 10,
    padding: 5,
    borderRadius: 10,
    fontSize: 16,
    color: 'white',
    backgroundColor: 'red',
  },
});
