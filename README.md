# NewSense-621-OI-05: AI-Powered Citizen Complaint Portal with Volunteer Management System

An intelligent citizen complaint management system that leverages AI to automate civic issue reporting, social media engagement, educational content generation, and comprehensive volunteer management. This project enables citizens to report civic issues with precise location mapping, automated social media posting, continuous learning translation capabilities, and a gamified volunteer system for community engagement.

## 🎯 Project Overview

NewSense-621-OI-05 is a comprehensive civic engagement platform that combines cutting-edge AI technology with user-friendly design to create a powerful tool for community improvement. The system empowers citizens to actively participate in civic life through complaint reporting and volunteer opportunities while providing administrators with the tools they need to respond effectively to community needs.

### 🌟 Key Highlights
- **AI-Powered Automation**: Intelligent complaint processing and social media management
- **Volunteer Management System**: Complete gamified volunteer platform with points, badges, and achievements
- **Real-time Analytics**: Comprehensive dashboard with demographic insights and trend analysis
- **Educational Integration**: Curated YouTube videos promoting civic responsibility
- **Multi-language Support**: Smart translation system that learns from user feedback
- **Community Engagement**: Interactive maps and social features for community building
- **Government Intelligence**: Advanced citizen database with demographic analytics

## 🚀 Live Demo

**Frontend**: http://localhost:3000  
**Backend API**: http://localhost:5000

### Demo Credentials
- **Citizen**: `demo@example.com` / `password`
- **Admin**: `admin@example.com` / `password`
- **Volunteer**: Register through the volunteer registration page

## 🌟 Features

### Core Functionality
- **Location-Based Reporting**: Report issues with precise location mapping using Google Maps integration
- **AI-Powered Social Media**: Automatic posting to Twitter and Instagram until issues are resolved
- **Smart Translation**: AI learns and translates content continuously as users interact
- **Educational Content**: Curated YouTube videos about civic responsibility and community awareness
- **Community Integration**: Real-time community feed showing user reports with hardcoded sample data
- **Voice-to-Text**: Speech recognition for easy complaint submission in multiple languages
- **Real-time Analytics**: Comprehensive dashboard with demographic insights and trend analysis
- **Interactive Maps**: Live issue tracking with color-coded priority levels
- **Mobile Responsive**: Optimized for all devices with touch-friendly interface

### 🎮 Volunteer Management System

#### **Volunteer Registration & Management**
- **Multi-step Registration**: Comprehensive volunteer registration with skills, interests, and availability
- **Citizen-Volunteer Integration**: Citizens can register as volunteers while maintaining their citizen status
- **Admin Volunteer Management**: Complete admin interface for volunteer verification and management
- **Profile Management**: Detailed volunteer profiles with skills, experience, and preferences

#### **Gamification System**
- **Points System**: Volunteers earn 10-25 points per task based on complexity and performance
- **Badge Progression**: Bronze → Silver → Gold → Platinum → Diamond ranks based on points
- **Achievement System**: Special achievements for milestones and exceptional performance
- **Rating System**: 5-star rating system that affects badge progression
- **Visual Recognition**: Beautiful badge displays with icons and color-coded ranks

#### **Task Management**
- **Admin Task Creation**: Admins can create custom volunteer tasks with detailed requirements
- **Complaint-to-Task Conversion**: Citizen complaints automatically become volunteer opportunities
- **Hardcoded Community Tasks**: 8+ pre-defined community service tasks always available
- **Task Filtering**: Advanced filtering by category, priority, location, and skills
- **Task Assignment**: Volunteers can apply for tasks and track their progress

#### **Volunteer Dashboard Features**
- **Performance Tracking**: Points, badges, achievements, and task completion statistics
- **Available Tasks**: Browse and apply for volunteer opportunities
- **Progress Visualization**: Visual progress bars and achievement tracking
- **Task History**: Complete history of completed tasks and ratings received

### Complaint Management
- **Categorized Reporting**: Report potholes, garbage issues, street lighting, water supply, sewage, traffic signals, and more
- **Priority Levels**: Set urgency levels (Low, Medium, High, Urgent)
- **Media Upload**: Attach photos and videos to complaints
- **Real-time Tracking**: Monitor complaint status and receive updates
- **Admin Dashboard**: Comprehensive management interface for administrators
- **Community Visibility**: User reports appear in community feed for public engagement
- **Live Report Indicators**: Visual badges distinguish real user reports from sample data

### AI Features
- **Social Media Automation**: AI generates and posts content to social platforms
- **Continuous Learning**: Translation system improves with user feedback
- **Educational Video Integration**: Curated YouTube videos about civic responsibility
- **Smart Categorization**: Automatic issue classification and routing
- **Predictive Analytics**: AI-powered insights for proactive issue resolution
- **Natural Language Processing**: Intelligent complaint analysis and sentiment detection
- **Automated Workflow**: Smart routing and priority assignment based on AI analysis
- **Spam Detection**: AI-powered NLP models to identify and filter spam reports
- **Duplicate Prevention**: Intelligent content similarity analysis to prevent duplicate complaints
- **Content Quality Assurance**: Automated validation and quality scoring for reports

### Advanced Analytics & Government Intelligence
- **Citizen Demographics**: Comprehensive database with age, gender, religion, caste, occupation, and location data
- **Policy Analytics**: Real-time insights into citizen needs, complaint patterns, and demographic trends
- **Geographic Intelligence**: Location-based data analysis for infrastructure planning and resource allocation
- **Government Dashboard**: Specialized interface for government officials with citizen data insights
- **Demographic Profiling**: Detailed citizen profiles for targeted policy implementation
- **Trend Analysis**: Registration patterns and complaint resolution trends for strategic planning
- **Performance Metrics**: Resolution rates, response times, and citizen satisfaction tracking
- **Interactive Charts**: Bar charts, pie charts, and trend visualizations for data visualization
- **Real-time Monitoring**: Live dashboard updates and notifications for government agencies
- **Data Export**: Comprehensive reports and analytics for government agencies and policy makers
- **Evidence-Based Governance**: Data-driven decision making for policy formulation and implementation

## 🛠️ Technology Stack

### Frontend
- **React 18**: Modern UI framework with hooks and functional components
- **Tailwind CSS**: Utility-first CSS framework for responsive design
- **Lucide React**: Beautiful, customizable SVG icons
- **Chart.js & React-Chartjs-2**: Interactive data visualization
- **Leaflet**: Interactive maps for location-based features
- **Axios**: HTTP client for API communication
- **React Router**: Client-side routing and navigation
- **Framer Motion**: Smooth animations and transitions
- **React Hot Toast**: User-friendly notifications

### Backend
- **Node.js & Express**: Server-side JavaScript runtime and web framework
- **MongoDB**: NoSQL database for flexible data storage
- **Mongoose**: MongoDB object modeling for Node.js
- **JWT**: JSON Web Tokens for secure authentication
- **bcrypt**: Password hashing for security
- **Multer**: File upload handling for media attachments
- **Express Rate Limit**: API rate limiting for security
- **Helmet**: Security headers middleware
- **Express Validator**: Input validation and sanitization

### AI & Integration
- **OpenAI API**: AI-powered content generation and translation
- **Google Maps API**: Location services and mapping
- **Twitter API**: Social media automation
- **Instagram API**: Visual content sharing
- **YouTube API**: Educational video integration
- **Google Generative AI**: Advanced AI capabilities
- **Transformers.js**: Client-side AI processing

### Development Tools
- **Concurrently**: Run multiple npm scripts simultaneously
- **Nodemon**: Auto-restart server during development
- **ESLint**: Code linting and quality assurance
- **Git**: Version control and collaboration

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
   cd NewSense-621-OI-05
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

5. **Populate sample data**
   ```bash
   cd server
   node scripts/populateVolunteerData.js
   ```

6. **Start the development servers**

   **For Windows PowerShell:**
   ```powershell
   # Terminal 1 - Start Backend Server
   cd server
   npm start
   
   # Terminal 2 - Start Frontend Server  
   cd client
   npm start
   ```

   **For Linux/Mac:**
   ```bash
   npm run dev
   ```

   This will start:
   - Backend server on http://localhost:5000
   - Frontend React app on http://localhost:3000

## 📁 Project Structure

```
NewSense-621-OI-05/
├── client/                 # React frontend
│   ├── public/
│   ├── src/
│   │   ├── components/     # Reusable UI components
│   │   │   ├── Analytics.js
│   │   │   ├── Footer.js
│   │   │   ├── IssueDetailsModal.js
│   │   │   ├── LeafletMap.js
│   │   │   ├── LoadingSpinner.js
│   │   │   ├── Navbar.js
│   │   │   └── SkeletonLoader.js
│   │   ├── context/       # React context for state management
│   │   │   └── AuthContext.js
│   │   ├── pages/         # Page components
│   │   │   ├── AdminDashboard.js
│   │   │   ├── AdminVolunteers.js
│   │   │   ├── AdminVolunteerTasks.js
│   │   │   ├── CitizenVolunteerRegister.js
│   │   │   ├── Community.js
│   │   │   ├── ComplaintDetails.js
│   │   │   ├── CreateComplaint.js
│   │   │   ├── Dashboard.js
│   │   │   ├── EducationalVideos.js
│   │   │   ├── Home.js
│   │   │   ├── Login.js
│   │   │   ├── Profile.js
│   │   │   ├── Register.js
│   │   │   ├── Translation.js
│   │   │   ├── VolunteerDashboard.js
│   │   │   ├── VolunteerLogin.js
│   │   │   └── VolunteerRegister.js
│   │   ├── config.js
│   │   ├── index.css
│   │   └── index.js
│   └── package.json
├── server/                 # Node.js backend
│   ├── models/            # MongoDB models
│   │   ├── Admin.js
│   │   ├── Complaint.js
│   │   ├── EducationalVideo.js
│   │   ├── Translation.js
│   │   ├── User.js
│   │   ├── Volunteer.js
│   │   └── VolunteerTask.js
│   ├── routes/            # API routes
│   │   ├── admin.js
│   │   ├── ai.js
│   │   ├── auth.js
│   │   ├── complaints.js
│   │   ├── volunteer-admin.js
│   │   └── volunteers.js
│   ├── services/          # Business logic services
│   │   ├── duplicateDetectionService.js
│   │   ├── educationalVideoService.js
│   │   ├── geminiVeoService.js
│   │   ├── socialMediaService.js
│   │   ├── translationService.js
│   │   └── youtubeVideoService.js
│   ├── middleware/        # Express middleware
│   │   └── auth.js
│   ├── utils/             # Utility functions
│   │   └── cloudinary.js
│   ├── scripts/           # Database scripts
│   │   └── populateVolunteerData.js
│   ├── uploads/           # File uploads
│   ├── index.js
│   └── package.json
├── VOLUNTEER_SYSTEM_SUMMARY.md
├── package.json           # Root package.json
└── README.md
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
- `GET /api/complaints/public` - Get public complaints for community feed
- `GET /api/complaints/:id` - Get single complaint
- `PUT /api/complaints/:id/status` - Update complaint status
- `POST /api/complaints/:id/feedback` - Submit feedback

### Volunteer Management
- `POST /api/volunteers/register` - Register as volunteer
- `POST /api/volunteers/login` - Volunteer login
- `GET /api/volunteers/profile` - Get volunteer profile
- `PUT /api/volunteers/profile` - Update volunteer profile
- `GET /api/volunteers/tasks` - Get available tasks
- `GET /api/volunteers/my-tasks` - Get assigned tasks
- `POST /api/volunteers/tasks/:id/apply` - Apply for task
- `PUT /api/volunteers/tasks/:id/status` - Update task status

### Admin Volunteer Management
- `GET /api/admin/volunteers` - Get all volunteers
- `GET /api/admin/volunteers/:id` - Get volunteer details
- `PUT /api/admin/volunteers/:id/status` - Update volunteer status
- `PUT /api/admin/volunteers/:id/verification` - Update verification status
- `POST /api/admin/volunteers/volunteer-tasks` - Create volunteer task
- `GET /api/admin/volunteers/volunteer-tasks` - Get all volunteer tasks
- `PUT /api/admin/volunteers/volunteer-tasks/:id` - Update volunteer task

### AI Services
- `POST /api/ai/translate` - Translate text
- `POST /api/ai/translate/feedback` - Provide translation feedback
- `GET /api/ai/translate/stats` - Get translation statistics
- `POST /api/ai/generate-video` - Generate educational video
- `GET /api/ai/videos` - Get educational videos
- `GET /api/ai/videos/daily` - Get today's educational video

### Admin
- `GET /api/admin/dashboard` - Admin dashboard statistics
- `GET /api/admin/complaints` - Get complaints (admin view)
- `GET /api/admin/users` - Get all users
- `GET /api/admin/citizens` - Get citizen demographics
- `GET /api/admin/citizen-stats` - Get citizen statistics

## 🎮 Volunteer System Features

### **Gamification System**
- **Points System**: 
  - Base points: 10 per task
  - Rating bonus: 2-10 points (based on 1-5 star rating)
  - Priority bonus: 5-15 points (based on task priority)
  - Hours bonus: 2 points per hour worked

- **Badge Progression**:
  - **Bronze**: 0-99 points
  - **Silver**: 100-199 points
  - **Gold**: 200-299 points
  - **Platinum**: 300-399 points
  - **Diamond**: 400+ points

- **Achievements**:
  - First Task (Complete 1 task)
  - Task Master (Complete 10 tasks)
  - High Performer (Average rating 4.5+)
  - Point Collector (Earn 100+ points)
  - Community Helper (Complete 5 community service tasks)

### **Sample Data**
- **5 Pre-populated Volunteers** with different ranks and achievements
- **5 Database-stored Volunteer Tasks**
- **8+ Hardcoded Community Service Tasks** always available

## 📊 Sample Data Overview

### **Volunteers (5)**
1. **John Smith** - Silver Badge (150 points, 8 tasks)
2. **Sarah Johnson** - Gold Badge (320 points, 15 tasks)
3. **Mike Chen** - Gold Badge (450 points, 22 tasks)
4. **Emily Davis** - Bronze Badge (80 points, 4 tasks)
5. **David Wilson** - Pending Approval (0 points, 0 tasks)

### **Hardcoded Community Tasks (8)**
1. **Community Garden Maintenance** (Community Service)
2. **Senior Center Meal Service** (Healthcare)
3. **Environmental Cleanup Drive** (Environment)
4. **Digital Literacy Workshop** (Education)
5. **Food Bank Distribution** (Social Work)
6. **Emergency Shelter Support** (Social Work - Urgent)
7. **Youth Mentorship Program** (Education)
8. **Disaster Relief Preparation** (Disaster Relief)

## 🏛️ Government Database Management System

### Comprehensive Citizen Database
The platform serves as a powerful **Government Intelligence System** with detailed citizen demographics that provide unprecedented insights for evidence-based governance:

#### **Demographic Data Collection**
- **Personal Information**: Name, email, phone, address with precise location mapping
- **Age & Gender Distribution**: Detailed age groups and gender demographics for targeted policies
- **Religious & Cultural Data**: Religion and caste information for inclusive policy making
- **Occupational Profiles**: Employment status and occupation categories for economic planning
- **Geographic Coverage**: Location-based data for regional development and infrastructure planning

#### **Government Benefits**
- **Policy Intelligence**: Real-time insights into citizen needs and preferences
- **Evidence-Based Governance**: Data-driven decision making for policy formulation
- **Resource Allocation**: Geographic and demographic data for optimal resource distribution
- **Performance Tracking**: Monitor government service delivery and citizen satisfaction
- **Strategic Planning**: Long-term planning based on demographic trends and patterns
- **Quality Assurance**: AI-powered spam detection and duplicate prevention for clean data
- **Efficiency Optimization**: Automated content validation reduces manual processing time
- **Data Integrity**: NLP models ensure high-quality, actionable citizen reports

#### **Analytics Dashboard for Government**
- **Citizen Demographics**: Visual representation of age, gender, religion, caste distributions
- **Geographic Intelligence**: Location-based analysis for infrastructure planning
- **Trend Analysis**: Registration patterns and complaint resolution trends
- **Performance Metrics**: Government service delivery and response times
- **Export Capabilities**: Comprehensive reports for government agencies

## 📈 Impact & Benefits

### For Citizens
- **Empowerment**: Easy-to-use platform for civic engagement
- **Transparency**: Real-time tracking of complaint resolution
- **Education**: Access to curated civic responsibility content
- **Community**: Connect with like-minded citizens and local issues
- **Efficiency**: AI-powered automation reduces manual effort
- **Volunteer Opportunities**: Gamified system encourages community participation

### For Volunteers
- **Recognition**: Badge system provides status and recognition
- **Engagement**: Gamification encourages volunteer participation
- **Skill Development**: Diverse tasks help volunteers develop new skills
- **Community Impact**: Track and measure volunteer contributions
- **Flexibility**: Choose tasks that match interests and availability

### For Government & Administrators
- **Citizen Database**: Comprehensive demographic data (age, gender, religion, caste, occupation, location)
- **Policy Intelligence**: Real-time insights for evidence-based governance and policy making
- **Geographic Analytics**: Location-based data for infrastructure planning and resource allocation
- **Demographic Insights**: Detailed citizen profiles for targeted policy implementation
- **Trend Analysis**: Registration patterns and complaint resolution trends for strategic planning
- **Performance Metrics**: Resolution rates, response times, and citizen satisfaction tracking
- **Data Export**: Comprehensive reports for government agencies and policy makers
- **Scalability**: Handle large volumes of citizen data efficiently
- **Volunteer Management**: Complete oversight of volunteer system and community engagement

### For Communities
- **Awareness**: Educational content promotes civic responsibility
- **Participation**: Increased citizen engagement in local governance
- **Transparency**: Public visibility of community issues and resolutions
- **Collaboration**: Platform for community-driven problem solving
- **Progress**: Measurable improvement in civic infrastructure
- **Volunteer Network**: Strong community of engaged volunteers

## 🔮 Future Enhancements

- **Mobile App**: React Native mobile application
- **Voice Reporting**: Enhanced voice-to-text complaint submission
- **AR Integration**: Augmented reality for issue visualization
- **Blockchain**: Transparent complaint tracking
- **IoT Integration**: Smart city sensor data integration
- **Advanced Analytics**: Machine learning for predictive insights
- **Real-time Notifications**: Push notifications for community updates
- **Volunteer Matching**: AI-powered volunteer-task matching
- **Social Features**: Volunteer networking and team formation
- **Advanced Gamification**: More achievement types and social recognition

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- OpenAI for AI capabilities
- Google Maps for location services
- MongoDB for database services
- React community for excellent documentation
- All contributors and volunteers who make this project possible

---

**NewSense-621-OI-05** - Empowering communities through technology and civic engagement! 🚀