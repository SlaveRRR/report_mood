export interface TokensResponse {
  access_token: string;
  refresh_token: string;
}

export interface SignInParams {
  username: string;
  password: string;
}

export interface SignUpParams extends SignInParams {
  role: string;
  email: string;
}

export interface User {
  id: string;
  username: string;
  role: 'сотрудник' | 'HR';
  email: string;
  position: string;
  age: number;
}

export interface Survey {
  id: number;
  title: string | null;
  description: string | null;
  total_completions: number | null;
  created_at: string | null;
  questions: Question[];
  completions: SurveyCompletion[];
}

export interface SurveyCompletion {
  name: string;
  age: number;
  position: string;
  answers: Record<string, number>;
}

export interface SurveyParams {
  title: string;
  description: string;
  questions: Question[];
  created_by: number;
  assigned_users: number[];
}

export interface Question {
  options: string[];
  question: string;
  type: 'multipleChoice' | 'scale'; // Тип вопроса: выбор или шкала
}

export interface AssignPeopleToSurveyParams {
  id: number;
}

export interface SurveyData {
  id: number;
  answers: Record<string, number>;
}
