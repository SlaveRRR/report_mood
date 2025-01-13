import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { ActivityIndicator, Button, TextInput, TouchableOpacity, View } from 'react-native';
import { useForm, Controller } from 'react-hook-form';
import { ThemedLink } from '@/components/ThemedLink';
import { ThemedInput } from '@/components/ThemedInput';
import { RadioGroup, RadioButton, Text, Toast } from 'react-native-ui-lib';

import { useContext, useState } from 'react';

import { api } from '@/api';

import { useToast } from '@/hooks/useToast';
import { context } from '@/context';
import { router } from 'expo-router';
import { signUp } from '@/utils';

const Signup = () => {
  const { handleSubmit, control } = useForm({
    shouldFocusError: true,
    mode: 'onChange',
    reValidateMode: 'onChange',
  });
  const { toast } = useToast();
  const { setAuth } = useContext(context);

  const onSubmit = async (formData) => {
    setLoading(true);
    try {
      await signUp(formData);

      router.replace('/(tabs)');
      setAuth(true);
    } catch (error) {
      toast((error as { message: string }).message);
    } finally {
      setLoading(false);
    }
  };
  const [loading, setLoading] = useState(false);

  return (
    <ThemedView className="p-4">
      <ThemedText className="text-2xl font-bold text-center mb-3">Регистрация</ThemedText>

      <ThemedText className="mb-2 block">Имя пользователя</ThemedText>

      <Controller
        control={control}
        render={({ field: { onChange, value }, fieldState }) => (
          <>
            <ThemedInput id="username" onChangeText={(value) => onChange(value)} value={value} />
            <Text className="text-red-500 mt-2 mb-2">{fieldState?.error?.message}</Text>
          </>
        )}
        name="username"
        rules={{ required: { message: 'Укажите имя пользователя!', value: true } }}
      />
      <ThemedText className="mb-2 block">Email</ThemedText>

      <Controller
        control={control}
        render={({ field: { onChange, value }, fieldState }) => (
          <>
            <ThemedInput id="email" inputMode="email" onChangeText={(value) => onChange(value)} value={value} />
            <Text className="text-red-500 mt-2 mb-2">{fieldState?.error?.message}</Text>
          </>
        )}
        name="email"
        rules={{ required: { message: 'Укажите email!', value: true } }}
      />
      <ThemedText className="mb-2 block">Пароль</ThemedText>
      <Controller
        control={control}
        render={({ field: { onChange, value }, fieldState }) => (
          <>
            <ThemedInput
              className="mb-2"
              id="password"
              secureTextEntry
              onChangeText={(value) => onChange(value)}
              value={value}
            />
            <Text className="text-red-500 mt-2 mb-2">{fieldState?.error?.message}</Text>
          </>
        )}
        name="password"
        rules={{ required: { message: 'Укажите пароль!', value: true } }}
      />
      <ThemedText className="mb-2 block">Роль</ThemedText>
      <Controller
        control={control}
        render={({ field: { onChange, value }, fieldState }) => (
          <>
            <RadioGroup initialValue={value} onValueChange={onChange}>
              <RadioButton value={'сотрудник'} label={'сотрудник'} />
              <RadioButton marginT-10 value={'HR'} label={'HR'} />
            </RadioGroup>
            <Text className="text-red-500 mt-2 mb-2">{fieldState?.error?.message}</Text>
          </>
        )}
        name="role"
        rules={{ required: { message: 'Укажите свою роль!', value: true } }}
      />

      <TouchableOpacity className="mb-2">
        <View>
          {loading ? (
            <ActivityIndicator animating={loading} />
          ) : (
            <Button
              title="Зарегистриоваться"
              onPress={handleSubmit(onSubmit)}
              className=" text-white font-bold py-2 px-4 rounded"
            />
          )}
        </View>
      </TouchableOpacity>
      <View>
        <ThemedLink href={'/signin'}>Уже есть аккаунт?</ThemedLink>
      </View>
    </ThemedView>
  );
};

export default Signup;
