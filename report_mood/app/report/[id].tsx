import { api } from '@/api';
import { Survey } from '@/api/types';
import { Statistics } from '@/components/Statistics';
import { SurveyComponent } from '@/components/Survey';
import { ThemedView } from '@/components/ThemedView';
import { context } from '@/context';
import { useToast } from '@/hooks/useToast';
import { useLocalSearchParams } from 'expo-router';
import { useContext, useEffect, useState } from 'react';
import { ActivityIndicator } from 'react-native';

export default function CurrentReport() {
  const { auth, user } = useContext(context);
  const params = useLocalSearchParams();
  const [isLoading, setIsLoading] = useState(false);
  const [survey, setSurvey] = useState<Survey>();
  const { toast } = useToast();

  useEffect(() => {
    const getData = async () => {
      setIsLoading(true);
      try {
        const { data } = await api.getSurveyById(params.id as string);

        setSurvey(data);
      } catch (error) {
        toast('Ошибка при получении опроса');
      } finally {
        setIsLoading(false);
      }
    };

    if (user && user?.role === 'HR') {
      getData();
    }
  }, [auth]);

  if (isLoading || !user || !survey) {
    return (
      <ThemedView>
        <ActivityIndicator size={'large'} />
      </ThemedView>
    );
  }

  return user.role === 'сотрудник' ? (
    <SurveyComponent survey={survey} />
  ) : (
    <Statistics completions={survey.completions} questions={survey.questions} />
  );
}
