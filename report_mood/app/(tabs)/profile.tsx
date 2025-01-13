import { api } from '@/api';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { context } from '@/context';
import { signOut } from '@/utils';
import { router } from 'expo-router';
import { useContext, useState } from 'react';
import { Alert, View } from 'react-native';
import { Avatar, Button, Picker, Typography } from 'react-native-ui-lib';

export default function TabTwoScreen() {
  const { user } = useContext(context);
  const [currentValue, setCurrentValue] = useState();

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
          return router.replace('/signin');
        },
      },
    ]);
  };
  return (
    <>
      <ThemedView className="flex px-2 pt-4 flex-row justify-between items-center">
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
          Роль: {user.role}
        </ThemedText>
        {user.role === 'HR' && <Button hyperlink>Создать опрос</Button>}
      </ThemedView>

      <Picker
        value={currentValue}
        placeholder={'Добавить людей к опросу'}
        onChange={() => console.log('changed')}
        mode={Picker.modes.MULTI}
        showSearch
        selectionLimit={3}
        searchPlaceholder={'Search a language'}
        items={[
          { label: 'JavaScript', value: 'js', labelStyle: Typography.text65 },
          { label: 'Java', value: 'java', labelStyle: Typography.text65 },
          { label: 'Python', value: 'python', labelStyle: Typography.text65 },
          { label: 'C++', value: 'c++', disabled: true, labelStyle: Typography.text65 },
          { label: 'Perl', value: 'perl', labelStyle: Typography.text65 },
        ]}
      ></Picker>
    </>
  );
}
