# NewSense-621-OI-05: AI-Powered Citizen Complaint Portal

An intelligent citizen complaint management system that leverages AI to automate civic issue reporting, social media engagement, and educational content generation. This project enables citizens to report civic issues with precise location mapping, automated social media posting, and continuous learning translation capabilities.

## 🚀 Live Demo

**Frontend**: http://localhost:3000  
**Backend API**: http://localhost:5000

### Demo Credentials
- **Citizen**: `demo@example.com` / `password`
- **Admin**: `admin@example.com` / `password`

## 🌟 Features

### Core Functionality
- **Location-Based Reporting**: Report issues with precise location mapping using Google Maps integration
- **AI-Powered Social Media**: Automatic posting to Twitter and Instagram until issues are resolved
- **Smart Translation**: AI learns and translates content continuously as users interact
- **Educational Content**: Daily AI-generated videos about civic responsibility and community awareness

### Complaint Management
- **Categorized Reporting**: Report potholes, garbage issues, street lighting, water supply, sewage, traffic signals, and more
- **Priority Levels**: Set urgency levels (Low, Medium, High, Urgent)
- **Media Upload**: Attach photos and videos to complaints
- **Real-time Tracking**: Monitor complaint status and receive updates
- **Admin Dashboard**: Comprehensive management interface for administrators

### AI Features
- **Social Media Automation**: AI generates and posts content to social platforms
- **Continuous Learning**: Translation system improves with user feedback
- **Educational Video Generation**: Daily AI-created content about civic responsibility
- **Smart Categorization**: Automatic issue classification and routing

## 🚀 Quick Start

### Prerequisites
- Node.js (v14 or higher)
- MongoDB
- Google Maps API Key
- OpenAI API Key
- Social Media API Keys (Twitter, Instagram)

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd citizen-complaint-portal
   ```

2. **Install dependencies**
   ```bash
   npm run install-all
   ```

3. **Set up environment variables**
   ```bash
   # Copy the example environment file
   cp server/env.example server/.env
   
   # Edit server/.env with your API keys
   MONGODB_URI=mongodb://localhost:27017/citizen-complaints
   GOOGLE_MAPS_API_KEY=your-google-maps-api-key
   OPENAI_API_KEY=your-openai-api-key
   TWITTER_API_KEY=your-twitter-api-key
   TWITTER_API_SECRET=your-twitter-api-secret
   TWITTER_ACCESS_TOKEN=your-twitter-access-token
   TWITTER_ACCESS_TOKEN_SECRET=your-twitter-access-token-secret
   INSTAGRAM_ACCESS_TOKEN=your-instagram-access-token
   JWT_SECRET=your-super-secret-jwt-key
   ```

4. **Set up client environment**
   ```bash
   # Create client/.env file
   echo "REACT_APP_GOOGLE_MAPS_API_KEY=your-google-maps-api-key" > client/.env
   ```

5. **Start the development servers**
   ```bash
   npm run dev
   ```

   This will start:
   - Backend server on http://localhost:5000
   - Frontend React app on http://localhost:3000

## 📁 Project Structure

```
citizen-complaint-portal/
├── client/                 # React frontend
│   ├── public/
│   ├── src/
│   │   ├── components/     # Reusable UI components
│   │   ├── context/       # React context for state management
│   │   ├── pages/         # Page components
│   │   └── utils/         # Utility functions
│   └── package.json
├── server/                 # Node.js backend
│   ├── models/            # MongoDB models
│   ├── routes/            # API routes
│   ├── services/          # Business logic services
│   ├── middleware/        # Express middleware
│   ├── utils/             # Utility functions
│   └── package.json
└── package.json           # Root package.json
```

## 🔧 API Endpoints

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `GET /api/auth/me` - Get current user
- `PUT /api/auth/profile` - Update user profile

### Complaints
- `POST /api/complaints` - Create new complaint
- `GET /api/complaints` - Get complaints (with filters)
- `GET /api/complaints/:id` - Get single complaint
- `PUT /api/complaints/:id/status` - Update complaint status
- `POST /api/complaints/:id/feedback` - Submit feedback

### AI Services
- `POST /api/ai/translate` - Translate text
- `POST /api/ai/translate/feedback` - Provide translation feedback
- `GET /api/ai/translate/stats` - Get translation statistics
- `POST /api/ai/generate-video` - Generate educational video
- `GET /api/ai/videos` - Get educational videos
- `GET /api/ai/videos/daily` - Get today's educational video

### Admin
- `GET /api/admin/dashboard` - Admin dashboard statistics
- `GET /api/admin/complaints` - Get all complaints
- `PUT /api/admin/complaints/:id/assign` - Assign complaint
- `GET /api/admin/users` - Get all users
- `PUT /api/admin/users/:id/status` - Update user status
- `GET /api/admin/analytics` - Get comprehensive analytics

## 🗄️ Database Schema

### Users
- Personal information (name, email, phone)
- Location data
- Role-based access (citizen, admin, moderator)
- Preferences and settings

### Complaints
- Issue details (title, description, category, priority)
- Location with coordinates
- Media attachments
- Status tracking and updates
- Social media posts
- User feedback and ratings

### Translations
- Original and translated text
- Language pairs
- User feedback for learning
- Accuracy tracking

### Educational Videos
- AI-generated content
- Categories and tags
- User engagement metrics
- Multi-language support

## 🤖 AI Integration

### OpenAI Integration
- **Content Generation**: Educational videos and social media posts
- **Translation**: Multi-language support with context learning
- **Text Processing**: Complaint categorization and summarization

### Social Media Automation
- **Twitter**: Automated posting with AI-generated content
- **Instagram**: Visual content with captions
- **Scheduling**: Recurring posts for unresolved issues

### Continuous Learning
- **Translation Feedback**: User corrections improve AI accuracy
- **Content Optimization**: Social media engagement drives content improvement
- **Pattern Recognition**: Issue categorization becomes more accurate over time

## 🎨 UI/UX Features

### Modern Design
- **Responsive Layout**: Works on desktop, tablet, and mobile
- **Dark/Light Themes**: User preference support
- **Accessibility**: WCAG compliant design
- **Interactive Maps**: Google Maps integration for location selection

### User Experience
- **Real-time Updates**: Socket.io for live notifications
- **File Upload**: Drag-and-drop media upload
- **Progress Tracking**: Visual status indicators
- **Multi-language**: Support for multiple languages

## 🔒 Security Features

- **JWT Authentication**: Secure token-based authentication
- **Input Validation**: Comprehensive form validation
- **Rate Limiting**: API rate limiting to prevent abuse
- **Helmet.js**: Security headers
- **CORS Configuration**: Proper cross-origin resource sharing
- **Password Hashing**: bcrypt for secure password storage

## 📊 Analytics & Reporting

### Dashboard Metrics
- Total complaints and resolution rates
- Category-wise distribution
- User engagement statistics
- AI performance metrics

### Real-time Monitoring
- Live complaint tracking
- Social media engagement
- Translation accuracy
- Video viewership

## 🚀 Deployment

### Production Build
```bash
# Build the React app
cd client && npm run build

# Start production server
cd server && npm start
```

### Environment Variables for Production
- Set up MongoDB Atlas or production MongoDB instance
- Configure production API keys
- Set up proper CORS origins
- Configure SSL certificates

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

For support, email support@citizenportal.com or create an issue in the repository.

## 🔮 Future Enhancements

- **Mobile App**: React Native mobile application
- **Voice Reporting**: Voice-to-text complaint submission
- **AR Integration**: Augmented reality for issue visualization
- **Blockchain**: Transparent complaint tracking
- **IoT Integration**: Smart city sensor data integration
- **Advanced Analytics**: Machine learning for predictive insights

---

Built with ❤️ for better communities 
