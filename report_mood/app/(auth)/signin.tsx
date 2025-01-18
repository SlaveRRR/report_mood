import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { ActivityIndicator, Button, ScrollView, TextInput, TouchableOpacity, View } from 'react-native';
import { useForm, Controller } from 'react-hook-form';
import { router } from 'expo-router';
import { ThemedInput } from '@/components/ThemedInput';
import { ThemedLink } from '@/components/ThemedLink';

import { api } from '@/api';
import { useToast } from '@/hooks/useToast';
import { useContext, useState } from 'react';
import { context } from '@/context';
import { signIn } from '@/utils';

interface Props {}

const Signin = ({}: Props) => {
  const { handleSubmit, control } = useForm();
  const { toast } = useToast();
  const { setAuth } = useContext(context);

  const onSubmit = async (formData) => {
    setLoading(true);
    try {
      const status = await signIn(formData);
      if (status === 200) {
        router.replace('/(tabs)');
        setAuth(true);
      }
    } catch (error) {
      toast((error as { message: string }).message);
    } finally {
      setLoading(false);
    }
  };

  const [loading, setLoading] = useState(false);
  return (
    <ScrollView>
      <ThemedView className="p-4">
        <ThemedText className="text-2xl font-bold text-center mb-3">Авторизация</ThemedText>
        <ThemedText className="mb-2 block">Имя пользователя</ThemedText>
        <Controller
          control={control}
          render={({ field: { onChange, value } }) => (
            <ThemedInput id="username" onChangeText={(value) => onChange(value)} value={value} />
          )}
          name="username"
          rules={{ required: true }}
        />
        <ThemedText className="mb-2 block">Пароль</ThemedText>
        <Controller
          control={control}
          render={({ field: { onChange, value } }) => (
            <ThemedInput
              id="password"
              className="mb-2"
              secureTextEntry
              onChangeText={(value) => onChange(value)}
              value={value}
            />
          )}
          name="password"
          rules={{ required: true }}
        />
        <TouchableOpacity className="mb-2">
          <View>
            {loading ? (
              <ActivityIndicator animating={loading} />
            ) : (
              <Button
                title="Войти"
                onPress={handleSubmit(onSubmit)}
                className=" text-white font-bold py-2 px-4 rounded"
              />
            )}
          </View>
        </TouchableOpacity>

        <View>
          <ThemedLink href={'/signup'}>Впервые здесь?</ThemedLink>
        </View>
      </ThemedView>
    </ScrollView>
  );
};

export default Signin;
