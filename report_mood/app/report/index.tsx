import React, { useState, useEffect } from 'react';
import { View, Alert, ScrollView } from 'react-native';
import { Text, Card, Button as UIButton, RadioGroup, RadioButton, Slider } from 'react-native-ui-lib';
import Animated, { useSharedValue, useAnimatedStyle, withTiming } from 'react-native-reanimated';
import axios from 'axios';

export default function Report() {
  const [questions, setQuestions] = useState([
    {
      question: 'Какой ваш любимый цвет?',
      options: ['Красный', 'Синий', 'Зеленый', 'Желтый'],
      type: 'choice',
    },
    {
      question: 'Как вы оцениваете свою удовлетворенность работой?',
      type: 'scale',
    },
    {
      question: 'Что вы предпочитаете на завтрак?',
      options: ['Кашу', 'Бутерброды', 'Яйца', 'Фрукты'],
      type: 'choice',
    },
  ]);
  const [currentStep, setCurrentStep] = useState(0);
  const [answers, setAnswers] = useState({});
  const [sliderValue, setSliderValue] = useState(0); // Для шкальных вопросов
  const [isLoading, setIsLoading] = useState(false);
  const direction = useSharedValue(0); // -1 для назад, 1 для вперед

  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [
        {
          translateX: withTiming(direction.value * 350, { duration: 300 }),
        },
      ],
      opacity: withTiming(direction.value === 0 ? 1 : 0, { duration: 300 }),
    };
  });

  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        setIsLoading(false);
      } catch (error) {
        Alert.alert('Ошибка', 'Не удалось загрузить опрос.');
        setIsLoading(false);
        console.error(error);
      }
    };

    fetchQuestions();
  }, []);

  const handleAnswer = (questionIndex, option) => {
    setAnswers({ ...answers, [questionIndex]: option });
  };

  const handleSliderAnswer = (value) => {
    setSliderValue(value);
    handleAnswer(currentStep, value);
  };

  const handleNext = () => {
    if (currentStep < questions.length - 1) {
      direction.value = 1;
      setTimeout(() => {
        direction.value = 0;
        setCurrentStep(currentStep + 1);
        if (questions[currentStep + 1].type === 'scale') {
          setSliderValue(0); // Сброс значения слайдера
        }
      }, 200);
    } else {
      submitAnswers();
    }
  };

  const handleBack = () => {
    if (currentStep > 0) {
      direction.value = -1;
      setTimeout(() => {
        direction.value = 0;
        setCurrentStep(currentStep - 1);
      }, 300);
    }
  };

  const submitAnswers = async () => {
    try {
      await axios.post('https://example.com/api/submit-survey', { answers }); // Замените на реальный URL
      Alert.alert('Успех', 'Ваши ответы успешно отправлены!');
      setAnswers({});
      setCurrentStep(0);
    } catch (error) {
      Alert.alert('Ошибка', 'Не удалось отправить ответы.');
      console.error(error);
    }
  };

  if (isLoading) {
    return (
      <View className="flex-1 justify-center items-center">
        <Text className="text-lg text-gray-600">Загрузка...</Text>
      </View>
    );
  }

  if (questions.length === 0) {
    return (
      <View className="flex-1 p-4 bg-gray-100">
        <Text className="text-2xl font-bold">Нет доступных вопросов.</Text>
      </View>
    );
  }

  const currentQuestion = questions[currentStep];

  return (
    <ScrollView>
      <View className="flex-1 p-4 bg-gray-100">
        <Text className="text-2xl font-bold mb-4">Прохождение опроса</Text>

        <Animated.View style={animatedStyle} className="flex-1">
          <Card className="p-4 mb-4">
            <Text className="text-lg font-bold mb-4">{currentQuestion.question}</Text>

            {currentQuestion.type === 'choice' && (
              <RadioGroup
                onValueChange={(value) => handleAnswer(currentStep, value)}
                initialValue={answers[currentStep]}
              >
                {currentQuestion.options.map((option, index) => (
                  <RadioButton key={index} value={option} label={option} className="my-2" />
                ))}
              </RadioGroup>
            )}

            {currentQuestion.type === 'scale' && (
              <View className="mt-4">
                <Slider
                  minimumValue={1}
                  maximumValue={10}
                  step={1}
                  value={sliderValue}
                  onValueChange={handleSliderAnswer}
                />
                <Text className="text-center mt-2 text-lg">
                  Выбранное значение: <Text className="font-bold">{sliderValue}</Text>
                </Text>
              </View>
            )}

            <View className="flex-row justify-between mt-4">
              {currentStep > 0 && (
                <UIButton label="Назад" onPress={handleBack} className="bg-blue-500 text-white px-4 py-2" />
              )}

              <UIButton
                label={currentStep < questions.length - 1 ? 'Далее' : 'Отправить'}
                onPress={handleNext}
                className="bg-green-500 text-white px-4 py-2"
              />
            </View>
          </Card>
        </Animated.View>

        <Text className="text-center text-lg mt-2">{`Вопрос ${currentStep + 1} из ${questions.length}`}</Text>
      </View>
    </ScrollView>
  );
}
