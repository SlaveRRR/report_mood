import axios from 'axios';
import {
  AssignPeopleToSurveyParams,
  SignInParams,
  SignUpParams,
  Survey,
  SurveyData,
  SurveyParams,
  TokensResponse,
} from './types';
import * as SecureStore from 'expo-secure-store';
import { User } from '@/context/types';
const apiUrl = 'http://192.168.3.15:8000/api/';

export const axiosInstance = axios.create({
  baseURL: apiUrl,
});

axiosInstance.interceptors.request.use((config) => {
  const token = SecureStore.getItem('access_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

axiosInstance.interceptors.response.use(
  (config) => {
    return config;
  },
  async (error) => {
    const originalRequest = error.config;
    if (error.response && error.response.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      try {
        const response = await axios.get(`${apiUrl}token/refresh/`);
        SecureStore.setItem('access_token', response.data['access_token']);
        SecureStore.setItem('refresh_token', response.data['refresh_token']);
        return await axiosInstance.request(originalRequest);
      } catch (error) {
        console.log(error);
      }
    }
  }
);

class Api {
  async signIn(data: SignInParams) {
    return axios.post<TokensResponse>(`${apiUrl}signin/`, data);
  }

  async signUp(data: SignUpParams) {
    return axios.post<TokensResponse>(`${apiUrl}signup/`, data);
  }

  async refreshToken(token: Pick<TokensResponse, 'refresh_token'>) {
    return axios.post<TokensResponse>(`${apiUrl}token/refresh/`, token);
  }

  async logout(token: Pick<TokensResponse, 'refresh_token'>) {
    return axiosInstance.post('logout/', token);
  }
  async getMe() {
    return axiosInstance.get<User>('users/me/');
  }
  async getUsers() {
    return axiosInstance.get<User[]>('users');
  }
  async getHRSurveys() {
    return axiosInstance.get('surveys/hr_surveys');
  }
  async createSurvey(data: SurveyParams) {
    return axiosInstance.post('surveys/', data);
  }
  async assignUsersToSurvey(data: AssignPeopleToSurveyParams[]) {
    return axiosInstance.post('surveys/assign_users/', data);
  }
  async getUserSurveys() {
    return axiosInstance.get<Survey[]>('surveys/assigned_to_me/');
  }
  async getSurveyById(id: string) {
    return axiosInstance.get<Survey>(`surveys/${id}/`);
  }
  async completeSurvey({ id, answers }: SurveyData) {
    return axiosInstance.post(`surveys/${id}/complete/`, { answers: answers });
  }
}

export const api = new Api();
