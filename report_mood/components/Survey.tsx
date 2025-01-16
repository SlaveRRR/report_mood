import React, { useState, useEffect, useCallback } from 'react';
import { View, Alert, ScrollView, ActivityIndicator } from 'react-native';
import { Text, Card, Button as UIButton, RadioGroup, RadioButton, Slider } from 'react-native-ui-lib';
import Animated, { useSharedValue, useAnimatedStyle, withTiming } from 'react-native-reanimated';
import axios from 'axios';
import { Survey } from '@/api/types';
import { api } from '@/api';
import { router } from 'expo-router';
import { useToast } from '@/hooks/useToast';

export const SurveyComponent = ({ survey }: { survey: Survey }) => {
  const [questions, setQuestions] = useState(survey.questions);

  const [currentStep, setCurrentStep] = useState(0);
  const [answers, setAnswers] = useState({});
  const [sliderValue, setSliderValue] = useState(0); // Для шкальных вопросов
  const [isLoading, setIsLoading] = useState(false);
  const direction = useSharedValue(0); // -1 для назад, 1 для вперед
  const { toast } = useToast();
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

  const handleAnswer = useCallback((questionIndex: number, option) => {
    const q = questions[questionIndex].question;
    setAnswers((prev) => ({ ...prev, [q]: option }));
  }, []);

  const handleSliderAnswer = (value: number) => {
    setSliderValue(value);
    handleAnswer(currentStep, value);
  };

  const submitAnswers = async () => {
    setIsLoading(true);
    try {
      const response = await api.completeSurvey({ id: survey.id, answers });
      if (response?.status === 200) {
        toast('Вы успешно прошли опрос!');
        return router.replace('/');
      }
    } catch (error) {
      Alert.alert('Ошибка', 'Не удалось отправить ответы.');
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <View className="flex-1 justify-center items-center">
        <ActivityIndicator size={'large'} />
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

  return (
    <ScrollView>
      <View className="flex-1 p-4 bg-gray-100">
        <Text className="text-2xl font-bold mb-4">Прохождение опроса</Text>

        <Animated.View style={animatedStyle} className="flex-1">
          <Card className="p-4 mb-4">
            <Text className="text-lg font-bold mb-4">{currentQuestion.question}</Text>

            {currentQuestion.type === 'multipleChoice' && (
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
};
