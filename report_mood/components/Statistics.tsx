import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList, ScrollView, Dimensions } from 'react-native';
import { BarChart, PieChart } from 'react-native-chart-kit';
import Animated, { useSharedValue, useAnimatedStyle, withTiming } from 'react-native-reanimated';
import { GestureHandlerRootView, TouchableOpacity } from 'react-native-gesture-handler';
import { Picker } from '@react-native-picker/picker';
import { Question, SurveyCompletion } from '@/api/types';

const screenWidth = Dimensions.get('window').width;

interface StatisticsProps {
  completions: SurveyCompletion[];
  questions: Question[];
}

export const Statistics = ({ completions, questions }: StatisticsProps) => {
  const moodValue = useSharedValue(0);
  const [selectedQuestion, setSelectedQuestion] = useState<string | null>(null);

  useEffect(() => {
    moodValue.value = withTiming(1, { duration: 1000 });
  }, []);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: moodValue.value }],
    opacity: moodValue.value,
  }));

  const allQuestions = completions.flatMap(({ answers }) => Object.keys(answers));
  const uniqueQuestions = Array.from(new Set(allQuestions)).map((question, index) => ({
    id: index + 1,
    question,
  }));

  const numericQuestions = completions.flatMap(({ answers }) =>
    Object.entries(answers).filter(([_, value]) => typeof value === 'number')
  );

  const averages = numericQuestions.reduce((acc, [question, value]) => {
    acc[question] = (acc[question] || []).concat(value);
    return acc;
  }, {} as Record<string, number[]>);

  const averageScores = Object.keys(averages).map((question, index) => ({
    question,
    average: averages[question].reduce((a, b) => a + b, 0) / averages[question].length,
    id: uniqueQuestions.find((q) => q.question === question)?.id || index + 1,
  }));

  const textAnswers = completions.flatMap(({ answers }) =>
    Object.entries(answers).filter(([_, value]) => typeof value === 'string')
  );

  const textCounts = textAnswers.reduce((acc, [question, value]) => {
    acc[question] = acc[question] || {};
    acc[question][value] = (acc[question][value] || 0) + 1;
    return acc;
  }, {} as Record<string, Record<string, number>>);

  const positiveNumericResponses = averageScores.filter((item) => item.average > 5).length;

  const positiveTextResponses = textAnswers.filter(([_, value]) => value.toLowerCase() === 'да').length;

  const moodScore =
    (positiveNumericResponses / averageScores.length) * 0.7 + (positiveTextResponses / textAnswers.length) * 0.3;

  const pieData = selectedQuestion
    ? Object.keys(textCounts[selectedQuestion] || {}).map((key, index) => ({
        name: key,
        count: textCounts[selectedQuestion][key],
        color: ['#f39c12', '#e74c3c', '#8e44ad', '#3498db', '#2ecc71'][index % 5],
        legendFontColor: '#7F7F7F',
        legendFontSize: 12,
      }))
    : [];

  const barData = {
    labels: averageScores.map((item) => `${item.id}`),
    datasets: [
      {
        data: averageScores.map((item) => item.average),
      },
    ],
  };

  const onPressMood = () => {
    moodValue.value = 0;
    moodValue.value = withTiming(1, { duration: 1000 });
  };

  return (
    <GestureHandlerRootView>
      <ScrollView className="px-2">
        <Text style={styles.header}>Общий отчет о настроении</Text>
        <TouchableOpacity onPress={onPressMood}>
          <Animated.View
            style={[
              styles.moodContainer,
              animatedStyle,
              {
                backgroundColor: moodScore > 0.5 ? '#c8e6c9' : '#ffcdd2',
              },
            ]}
          >
            <Text style={styles.moodText}>
              {moodScore > 0.5 ? 'Настроение позитивное!' : 'Настроение требует улучшений'}
            </Text>
            <Text style={styles.moodDetails}>
              Положительных числовых ответов: {positiveNumericResponses} из {averageScores.length}
            </Text>
            <Text style={styles.moodDetails}>
              Положительных текстовых ответов: {positiveTextResponses} из {textAnswers.length}
            </Text>
          </Animated.View>
        </TouchableOpacity>

        <Text style={styles.header}>Средние оценки по числовым вопросам</Text>
        <ScrollView horizontal>
          <BarChart
            data={barData}
            width={screenWidth * 1.5}
            height={220}
            chartConfig={chartConfig}
            style={styles.chart}
          />
        </ScrollView>

        <Text style={styles.header}>Выберите вопрос для анализа текстовых ответов</Text>
        <Picker
          selectedValue={selectedQuestion}
          onValueChange={(itemValue) => setSelectedQuestion(itemValue)}
          style={styles.picker}
        >
          <Picker.Item label="Выберите вопрос" value={null} />
          {Object.keys(textCounts).map((question, index) => (
            <Picker.Item key={index} label={question} value={question} />
          ))}
        </Picker>

        {selectedQuestion && (
          <>
            <Text style={styles.header}>Распределение текстовых ответов</Text>
            <Text style={styles.selectedQuestion}>{selectedQuestion}</Text>
            <PieChart
              data={pieData}
              width={screenWidth - 20}
              height={220}
              chartConfig={chartConfig}
              accessor="count"
              backgroundColor="transparent"
              paddingLeft="15"
              style={styles.chart}
            />
          </>
        )}

        <Text style={styles.header}>Таблица вопросов</Text>
        <FlatList
          data={questions}
          keyExtractor={(item, index) => `item_${index}`}
          scrollEnabled={false}
          renderItem={({ item }) => (
            <View style={styles.tableRow}>
              <Text style={[styles.tableCell, styles.cellId]}>
                {questions.findIndex((i) => i.question === item.question) + 1}.
              </Text>
              <View style={styles.cellContent}>
                <Text style={styles.tableQuestion}>{item.question}</Text>
                <Text style={styles.tableAnswers}>Варианты: {item.options.join(', ') || 'Вопрос с выбором цифры'}</Text>
              </View>
            </View>
          )}
        />
      </ScrollView>
    </GestureHandlerRootView>
  );
};

const chartConfig = {
  backgroundGradientFrom: '#f4f4f4',
  backgroundGradientTo: '#ffffff',
  color: (opacity = 1) => `rgba(0, 123, 255, ${opacity})`,
  labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
  propsForDots: {
    r: '6',
    strokeWidth: '2',
    stroke: '#ffffff',
  },
};

const styles = StyleSheet.create({
  header: {
    fontSize: 18,
    fontWeight: 'bold',
    marginVertical: 10,
    textAlign: 'center',
    color: '#333333',
  },
  selectedQuestion: {
    textAlign: 'center',
  },
  chart: {
    marginVertical: 8,
    borderRadius: 16,
  },
  picker: {
    height: 50,
    width: '100%',
    marginVertical: 10,
    borderColor: '#ddd',
    borderWidth: 1,
    borderRadius: 8,
    backgroundColor: '#f9f9f9',
  },
  tableRow: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
    paddingVertical: 8,
    paddingHorizontal: 10,
    alignItems: 'center',
  },
  tableCell: {
    fontSize: 14,
    color: '#333333',
  },
  cellId: {
    width: 30,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  cellContent: {
    flex: 1,
    paddingLeft: 10,
  },
  tableQuestion: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 4,
    color: '#555555',
  },
  tableAnswers: {
    fontSize: 14,
    color: '#777777',
  },
  moodContainer: {
    padding: 20,
    borderRadius: 10,
    marginVertical: 10,
    alignItems: 'center',
  },
  moodText: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#333333',
  },
  moodDetails: {
    fontSize: 14,
    color: '#555555',
  },
});
