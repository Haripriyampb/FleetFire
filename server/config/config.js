import dotenv from 'dotenv';

dotenv.config();

const config = {
  port: process.env.PORT || 5000,
  nodeEnv: process.env.NODE_ENV || 'development',
  jwtSecret: process.env.JWT_SECRET || 'your_super_secret_jwt_key',
  jwtExpire: process.env.JWT_EXPIRE || '7d',
  
  // Google APIs
  googleMapsApiKey: process.env.GOOGLE_MAPS_API_KEY,
  googleDirectionsApiKey: process.env.GOOGLE_DIRECTIONS_API_KEY,
  
  // File Upload
  uploadDir: process.env.UPLOAD_DIR || './uploads',
  maxFileSize: process.env.MAX_FILE_SIZE || 5242880,
  
  // URLs
  apiUrl: process.env.API_URL || 'http://localhost:5000',
  clientUrl: process.env.CLIENT_URL || 'http://localhost:5173',
  
  // Database
  dbUrl: process.env.DATABASE_URL,
};

export default config;
