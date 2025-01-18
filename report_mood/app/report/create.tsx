//@ts-nocheck
import React, { useContext, useEffect, useState } from 'react';
import { View, TextInput, StyleSheet, Button, Alert, ScrollView, ActivityIndicator } from 'react-native';
import {
  Text,
  Card,
  Button as UIButton,
  RadioGroup,
  RadioButton,
  Icon,
  Assets,
  Slider,
  TextArea,
  Picker,
  Typography,
  PickerModes,
} from 'react-native-ui-lib';
import axios from 'axios';
import { IconSymbol } from '@/components/ui/IconSymbol';
import { AnimatedButton } from '@/components/AnimatedButton';
import { ThemedView } from '@/components/ThemedView';
import { questionsData } from '@/data';
import { ThemedText } from '@/components/ThemedText';
import { api } from '@/api';
import { Question, User } from '@/api/types';
import { router } from 'expo-router';
import { useToast } from '@/hooks/useToast';
import { context } from '@/context';

export default function CreateReportScreen() {
  const { user } = useContext(context);

  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentQuestion, setCurrentQuestion] = useState('');
  const [currentOptions, setCurrentOptions] = useState(['', '']);
  const [currentQuestionType, setCurrentQuestionType] = useState<'multipleChoice' | 'scale'>('multipleChoice');

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');

  const [isLoading, setIsLoading] = useState(false);
  const [peopleList, setPeopleList] = useState<{ label: string; value: string; labelStyle: string }[]>([]);

  const [selectedPeople, setSelectedPeople] = useState<number[]>([]);

  const addOption = () => {
    setCurrentOptions([...currentOptions, '']);
  };

  const removeOption = (index: number) => {
    if (currentOptions.length > 2) {
      const updatedOptions = currentOptions.filter((_, i) => i !== index);
      setCurrentOptions(updatedOptions);
    } else {
      Alert.alert('Ошибка', 'Должно быть минимум два варианта ответа.');
    }
  };

  const removeQuestion = (index: number) => {
    const updatedQuestions = questions.filter((_, i) => i !== index);
    setQuestions(updatedQuestions);
  };

  const updateOption = (text: string, index: number) => {
    const updatedOptions = [...currentOptions];
    updatedOptions[index] = text;
    setCurrentOptions(updatedOptions);
  };

  const addQuestion = () => {
    if (selectedPeople.length === 0) {
      return Alert.alert('Ошибка', 'Список людей не может быть пустым.');
    }

    if (!currentQuestion.trim()) {
      return Alert.alert('Ошибка', 'Вопрос не может быть пустым.');
    }

    if (currentQuestionType === 'multipleChoice') {
      if (currentOptions.some((option) => !option.trim())) {
        return Alert.alert('Ошибка', 'Все варианты ответа должны быть заполнены.');
      }
    }

    const newQuestion: Question = {
      question: currentQuestion,
      options: currentQuestionType === 'multipleChoice' ? currentOptions : [],
      type: currentQuestionType,
    };

    setQuestions([...questions, newQuestion]);
    setCurrentQuestion('');
    setCurrentOptions(['', '']);
    setCurrentQuestionType('multipleChoice');
  };
  const { toast } = useToast();
  const submitSurvey = async () => {
    if (questions.length === 0) {
      return Alert.alert('Ошибка', 'Вы не добавили ни одного вопроса.');
    }
    if (questions.length < 5) {
      return Alert.alert('В опросе должно быть минимум 5 вопросов.');
    }
    if (!title.trim() || !description.trim()) {
      return Alert.alert('У опроса должно быть название и описание.');
    }
    setIsLoading(true);
    try {
      const response = await api.createSurvey({
        description,
        questions,
        title,
        created_by: user.id,
        assigned_users: selectedPeople.map((el) => ({ id: el, is_complete: false })),
      });
      toast('Опрос успешно создан!');

      return router.replace('/profile');
    } catch (error) {
      toast('Ошибка,Не удалось отправить опрос');
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleQuickQuestions = () => {
    Alert.alert('Быстрый опрос', 'Подобрали для вас 10 быстрых вопросов, хотитие использовать?', [
      {
        text: 'Нет',
        style: 'cancel',
      },
      {
        text: 'Да',
        onPress: () => {
          setQuestions(questionsData);
        },
      },
    ]);
  };

  useEffect(() => {
    const getPeopleList = async () => {
      setIsLoading(true);
      try {
        const { data } = await api.getUsers();
        setPeopleList(
          data
            .filter((el) => el.id !== user.id)
            .map((item) => ({ label: item.username, value: item.id, labelStyle: Typography.text65 as string }))
        );
      } catch (error) {
        toast((error as { message: string }).message);
      } finally {
        setIsLoading(false);
      }
    };
    getPeopleList();
  }, []);

  if (isLoading) {
    return (
      <ScrollView>
        <ThemedView className="h-screen pt-2">
          <ActivityIndicator size={'large'} />
        </ThemedView>
      </ScrollView>
    );
  }

  return (
    <ScrollView>
      <ThemedView style={styles.container}>
        <ThemedView className="flex flex-row px-2  items-center justify-between">
          <Text style={styles.title}>Создать Опрос</Text>
          <ThemedView className="items-center mt-6">
            <AnimatedButton>
              <UIButton
                onPress={handleQuickQuestions}
                className="flex-row items-center bg-purple-600 px-6 py-3 rounded-full shadow-lg"
                style={{ elevation: 4 }}
              >
                <IconSymbol color={'white'} size={24} name="quiz" />
              </UIButton>
            </AnimatedButton>
          </ThemedView>
        </ThemedView>

        <Card style={styles.card}>
          <ThemedText style={styles.label}>Название опроса</ThemedText>
          <TextInput
            style={styles.input}
            value={title}
            onChangeText={(text) => setTitle(text)}
            placeholder="Название"
          />
          <ThemedText style={styles.label}>Описание опроса</ThemedText>
          <TextInput
            style={styles.textArea}
            placeholder="Дайте краткое описание..."
            placeholderTextColor="#888888"
            multiline
            value={description}
            onChangeText={(text) => setDescription(text)}
            numberOfLines={8}
            maxLength={150}
          />

          <ThemedText style={styles.label}>Назначенные сотрудники</ThemedText>
          <ThemedView className="border border-[#ccc] rounded-full p-2 w-full">
            <Picker
              value={selectedPeople}
              placeholder={'Добавить людей к опросу'}
              onChange={(items) => setSelectedPeople(items)}
              mode={Picker.modes.MULTI}
              showSearch
              searchPlaceholder={'Поиск сотрудника'}
              items={peopleList}
            />
          </ThemedView>
          <Text style={styles.label}>Введите вопрос:</Text>
          <TextInput
            style={styles.input}
            value={currentQuestion}
            onChangeText={setCurrentQuestion}
            placeholder="Ваш вопрос"
          />
          <Text style={styles.label}>Тип вопроса:</Text>
          <RadioGroup
            initialValue={currentQuestionType}
            onValueChange={(value: string) => setCurrentQuestionType(value as 'multipleChoice' | 'scale')}
          >
            <RadioButton value="multipleChoice" label="Множественный выбор" />
            <RadioButton marginT-10 marginB-10 value="scale" label="Шкала (1-10)" />
          </RadioGroup>
          {currentQuestionType === 'multipleChoice' && (
            <>
              <Text style={styles.label}>Варианты ответа:</Text>
              {currentOptions.map((option, index) => (
                <View key={index} style={styles.optionContainer}>
                  <TextInput
                    style={styles.input}
                    value={option}
                    onChangeText={(text) => updateOption(text, index)}
                    placeholder={`Вариант ${index + 1}`}
                  />
                  <UIButton
                    label="Удалить"
                    onPress={() => removeOption(index)}
                    style={styles.removeOptionButton}
                    size="small"
                  />
                </View>
              ))}
              <UIButton label="Добавить вариант ответа" onPress={addOption} style={styles.addOptionButton} />
            </>
          )}
          <UIButton label="Добавить вопрос" onPress={addQuestion} style={styles.addQuestionButton} />
          <UIButton label="Отправить опрос" onPress={submitSurvey} style={styles.submitButton} />
          <Text style={styles.questionsTitle}>Добавленные вопросы:</Text>
          {questions.map((item, index) => (
            <Card key={index} style={styles.questionCard}>
              <Text style={styles.questionText}>{item.question}</Text>
              {item.type === 'multipleChoice' ? (
                <RadioGroup>
                  {item.options.map((option, optIndex) => (
                    <RadioButton key={optIndex} label={option} disabled style={styles.disabledRadioButton} />
                  ))}
                </RadioGroup>
              ) : (
                <View style={styles.sliderContainer}>
                  <Text>1</Text>
                  <Slider minimumValue={1} maximumValue={10} step={1} disabled containerStyle={styles.slider} />
                  <Text>10</Text>
                </View>
              )}
              <UIButton
                label="Удалить"
                onPress={() => removeQuestion(index)}
                style={styles.removeQuestionButton}
                size="small"
              />
            </Card>
          ))}
        </Card>
      </ThemedView>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    paddingBottom: 10,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  card: {
    marginBottom: 16,
    padding: 16,
  },
  label: {
    fontSize: 16,
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    padding: 8,
    marginBottom: 8,
  },
  sliderContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginVertical: 8,
  },
  slider: {
    flex: 1,
    marginHorizontal: 8,
  },
  optionContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  removeQuestionButton: {
    marginTop: 10,
    width: 110,
    backgroundColor: '#e63515',
    color: '#fff',
  },
  removeOptionButton: {
    marginLeft: 8,
    backgroundColor: '#FF6347',
    color: '#fff',
  },
  addOptionButton: {
    marginVertical: 8,
  },
  addQuestionButton: {
    backgroundColor: '#4CAF50',
    color: '#fff',
  },
  submitButton: {
    backgroundColor: '#2196F3',
    color: '#fff',
    marginTop: 16,
  },
  questionsTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginTop: 16,
  },
  textArea: {
    height: 150,
    padding: 16,
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#CCCCCC',
    textAlignVertical: 'top', // Ensure text starts at the top-left
    fontSize: 16,
    marginBottom: 10,
  },
  questionCard: {
    marginTop: 8,
    padding: 16,
    backgroundColor: '#fff',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ccc',
  },
  questionText: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  disabledRadioButton: {
    marginVertical: 4,
  },
});
