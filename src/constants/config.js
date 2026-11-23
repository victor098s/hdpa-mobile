import { Platform } from 'react-native';

// No emulador Android, localhost aponta para o próprio emulador, 10.0.2.2 aponta para o computador host.
// No iOS Simulator ou Web, localhost aponta diretamente para a máquina host.
const DEFAULT_HOST = Platform.OS === 'android' ? 'http://10.0.2.2:3000' : 'http://localhost:3000';

export const API_BASE_URL = DEFAULT_HOST;

export const ENDPOINTS = {
  LOGIN: `${API_BASE_URL}/auth/login`,
  POR_VEST: `${API_BASE_URL}/porVest`,
  SELECT_VIEW: `${API_BASE_URL}/selectView`,
};
