import Constants from 'expo-constants';

// Lấy cấu hình từ Expo Constants
const expoConfig = Constants.expoConfig;

// Xuất các biến môi trường
export const API_BASE_URL = expoConfig?.extra?.apiBaseUrl || 'http://localhost:3000';
export const GOOGLE_MAPS_API_KEY = expoConfig?.extra?.apiMapKey || '';
export const ENVIRONMENT = expoConfig?.extra?.environment || 'development';

// Hàm kiểm tra xem có phải môi trường development không
export const isDevelopment = () => ENVIRONMENT === 'development';

// Hàm kiểm tra xem có phải môi trường production không
export const isProduction = () => ENVIRONMENT === 'production';

// Log cấu hình (chỉ trong development)
if (isDevelopment()) {
  console.log('🔧 Environment config:', {
    API_BASE_URL,
    GOOGLE_MAPS_API_KEY,
    ENVIRONMENT,
    // Không log API_KEY vì lý do bảo mật
  });
}