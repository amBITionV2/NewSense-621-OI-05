module.exports = {
  // Database
  MONGODB_URI: process.env.MONGODB_URI || 'mongodb://localhost:27017/citizen-complaints',
  
  // Server
  PORT: process.env.PORT || 5000,
  CLIENT_URL: process.env.CLIENT_URL || 'http://localhost:3000',
  
  // JWT
  JWT_SECRET: process.env.JWT_SECRET || 'dev-super-secret-jwt-key-change-in-production',
  
  // Google Maps API (Demo key - replace with your own)
  GOOGLE_MAPS_API_KEY: process.env.GOOGLE_MAPS_API_KEY || 'AIzaSyBvOkBw7uG4QZvX7uG4QZvX7uG4QZvX7uG4',
  
  // OpenAI API (Demo key - replace with your own)
  OPENAI_API_KEY: process.env.OPENAI_API_KEY || 'sk-demo-key-replace-with-your-openai-api-key',
  
  // Twitter API (Optional - leave empty for demo)
  TWITTER_API_KEY: process.env.TWITTER_API_KEY || '',
  TWITTER_API_SECRET: process.env.TWITTER_API_SECRET || '',
  TWITTER_ACCESS_TOKEN: process.env.TWITTER_ACCESS_TOKEN || '',
  TWITTER_ACCESS_TOKEN_SECRET: process.env.TWITTER_ACCESS_TOKEN_SECRET || '',
  
  // Instagram API (Optional - leave empty for demo)
  INSTAGRAM_APP_ID: process.env.INSTAGRAM_APP_ID || '',
  INSTAGRAM_APP_SECRET: process.env.INSTAGRAM_APP_SECRET || '',
  INSTAGRAM_ACCESS_TOKEN: process.env.INSTAGRAM_ACCESS_TOKEN || '',
  
  // Translation API (Optional - uses OpenAI as fallback)
  GOOGLE_TRANSLATE_API_KEY: process.env.GOOGLE_TRANSLATE_API_KEY || ''
};
