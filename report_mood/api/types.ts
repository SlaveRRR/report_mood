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
}
