import React, { useState } from 'react';
import { View, TextInput, StyleSheet, Button, Alert, ScrollView } from 'react-native';
import { Text, Card, Button as UIButton, RadioGroup, RadioButton } from 'react-native-ui-lib';
import axios from 'axios';

interface Question {
  options: string[];
  question: string;
}
export default function CreateReportScreen() {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentQuestion, setCurrentQuestion] = useState('');
  const [currentOptions, setCurrentOptions] = useState(['', '']);

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

  const updateOption = (text: string, index: number) => {
    const updatedOptions = [...currentOptions];
    updatedOptions[index] = text;
    setCurrentOptions(updatedOptions);
  };

  const addQuestion = () => {
    if (!currentQuestion.trim()) {
      Alert.alert('Ошибка', 'Вопрос не может быть пустым.');
      return;
    }
    if (currentOptions.some((option) => !option.trim())) {
      Alert.alert('Ошибка', 'Все варианты ответа должны быть заполнены.');
      return;
    }

    setQuestions([...questions, { question: currentQuestion, options: currentOptions }]);
    setCurrentQuestion('');
    setCurrentOptions(['', '']);
  };

  const submitSurvey = async () => {
    if (questions.length === 0) {
      Alert.alert('Ошибка', 'Вы не добавили ни одного вопроса.');
      return;
    }
    if (questions.length < 5) {
      Alert.alert('В опросе должно быть минимум 5 вопросов.');
      return;
    }

    try {
      const response = await axios.post('https://example.com/api/surveys', { questions });
      Alert.alert('Успех', 'Опрос успешно отправлен!');
      setQuestions([]);
    } catch (error) {
      Alert.alert('Ошибка', 'Не удалось отправить опрос.');
      console.error(error);
    }
  };

  return (
    <ScrollView>
      <View style={styles.container}>
        <Text style={styles.title}>Создать Опрос</Text>

        <Card style={styles.card}>
          <Text style={styles.label}>Введите вопрос:</Text>
          <TextInput
            style={styles.input}
            value={currentQuestion}
            onChangeText={setCurrentQuestion}
            placeholder="Ваш вопрос"
          />

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
          <UIButton label="Добавить вопрос" onPress={addQuestion} style={styles.addQuestionButton} />
        </Card>

        <UIButton label="Отправить опрос" onPress={submitSurvey} style={styles.submitButton} />

        <Text style={styles.questionsTitle}>Добавленные вопросы:</Text>
        {questions.map((item, index) => (
          <Card key={index} style={styles.questionCard}>
            <Text style={styles.questionText}>{item.question}</Text>
            <RadioGroup>
              {item.options.map((option, optIndex) => (
                <RadioButton key={optIndex} label={option} disabled style={styles.disabledRadioButton} />
              ))}
            </RadioGroup>
          </Card>
        ))}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#f5f5f5',
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
    flex: 1,
  },
  optionContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
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
