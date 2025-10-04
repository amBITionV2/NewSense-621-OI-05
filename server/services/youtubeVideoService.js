const EducationalVideo = require('../models/EducationalVideo');

// Curated YouTube videos about civic sense topics
const youtubeVideos = {
  'civic-responsibility': [
    {
      title: 'What is Civic Responsibility?',
      description: 'Learn about the importance of civic responsibility and how to be an active citizen in your community.',
      content: 'Civic responsibility is the duty of citizens to participate in the democratic process and contribute to the well-being of their community. This includes voting, staying informed about local issues, and actively engaging in community activities.',
      youtubeVideoId: '9nQ8QyNvjqM', // TED-Ed: How to be a good citizen
      youtubeUrl: 'https://www.youtube.com/watch?v=9nQ8QyNvjqM',
      duration: 180, // 3 minutes
      thumbnailUrl: 'https://img.youtube.com/vi/9nQ8QyNvjqM/maxresdefault.jpg',
      category: 'civic-responsibility',
      language: 'en',
      targetAudience: 'all',
      tags: ['civic-responsibility', 'citizenship', 'community', 'education'],
      learningObjectives: [
        'Understand what civic responsibility means',
        'Learn about the rights and duties of citizens',
        'Discover ways to contribute to your community'
      ],
      practicalTips: [
        'Vote in local and national elections',
        'Participate in community meetings',
        'Volunteer for local causes',
        'Stay informed about local issues'
      ],
      callToAction: 'Start by attending your next local community meeting and see how you can get involved!'
    },
    {
      title: 'How to Be a Good Citizen',
      description: 'Simple steps to become a responsible and engaged citizen in your community.',
      content: 'Being a good citizen involves following laws, respecting others, participating in community activities, and contributing to the common good. It means being informed, engaged, and willing to help others in your community.',
      youtubeVideoId: '8ZtInClXe1Q', // Crash Course: Government and Politics - Citizenship
      youtubeUrl: 'https://www.youtube.com/watch?v=8ZtInClXe1Q',
      duration: 240, // 4 minutes
      thumbnailUrl: 'https://img.youtube.com/vi/8ZtInClXe1Q/maxresdefault.jpg',
      category: 'civic-responsibility',
      language: 'en',
      targetAudience: 'all',
      tags: ['citizenship', 'responsibility', 'community', 'engagement'],
      learningObjectives: [
        'Learn the basic principles of good citizenship',
        'Understand community engagement',
        'Discover volunteer opportunities'
      ],
      practicalTips: [
        'Follow local laws and regulations',
        'Respect your neighbors and community',
        'Participate in local events',
        'Report issues to authorities'
      ],
      callToAction: 'Look for volunteer opportunities in your area and start making a difference today!'
    }
  ],
  'environmental-awareness': [
    {
      title: 'Environmental Protection for Everyone',
      description: 'Learn simple ways to protect the environment and make a positive impact on our planet.',
      content: 'Environmental protection is everyone\'s responsibility. Learn about sustainable living practices, reducing waste, conserving resources, and making eco-friendly choices that benefit our planet and future generations.',
      youtubeVideoId: 'WfGMYdalClU', // TED-Ed: How to reduce your carbon footprint
      youtubeUrl: 'https://www.youtube.com/watch?v=WfGMYdalClU',
      duration: 300, // 5 minutes
      thumbnailUrl: 'https://img.youtube.com/vi/WfGMYdalClU/maxresdefault.jpg',
      category: 'environmental-awareness',
      language: 'en',
      targetAudience: 'all',
      tags: ['environment', 'sustainability', 'protection', 'green-living'],
      learningObjectives: [
        'Understand environmental challenges',
        'Learn sustainable living practices',
        'Discover ways to reduce your carbon footprint'
      ],
      practicalTips: [
        'Reduce, reuse, and recycle',
        'Use public transportation when possible',
        'Conserve water and energy',
        'Support eco-friendly businesses'
      ],
      callToAction: 'Start with one small change today - maybe use a reusable water bottle!'
    }
  ],
  'traffic-rules': [
    {
      title: 'Traffic Rules and Road Safety',
      description: 'Essential traffic rules and road safety tips for pedestrians and drivers.',
      content: 'Understanding and following traffic rules is essential for everyone\'s safety on the road. Learn about traffic signals, pedestrian rights, safe driving practices, and how to be a responsible road user.',
      youtubeVideoId: 'X5WqVZzrZqY', // Road Safety Awareness Video
      youtubeUrl: 'https://www.youtube.com/watch?v=X5WqVZzrZqY',
      duration: 360, // 6 minutes
      thumbnailUrl: 'https://img.youtube.com/vi/X5WqVZzrZqY/maxresdefault.jpg',
      category: 'traffic-rules',
      language: 'en',
      targetAudience: 'all',
      tags: ['traffic', 'safety', 'rules', 'road-safety'],
      learningObjectives: [
        'Learn basic traffic rules',
        'Understand road safety principles',
        'Know pedestrian rights and responsibilities'
      ],
      practicalTips: [
        'Always use crosswalks when available',
        'Follow traffic signals and signs',
        'Wear helmets when cycling',
        'Never use mobile phones while driving'
      ],
      callToAction: 'Practice safe driving and walking habits every day!'
    }
  ],
  'waste-management': [
    {
      title: 'Proper Waste Management',
      description: 'Learn how to properly dispose of waste and contribute to a cleaner environment.',
      content: 'Proper waste management is crucial for maintaining a clean and healthy environment. Learn about waste segregation, recycling practices, composting, and how to reduce your environmental footprint through better waste disposal habits.',
      youtubeVideoId: 'OagTXWfaXEo', // Waste Management and Recycling Educational Video
      youtubeUrl: 'https://www.youtube.com/watch?v=OagTXWfaXEo',
      duration: 240, // 4 minutes
      thumbnailUrl: 'https://img.youtube.com/vi/OagTXWfaXEo/maxresdefault.jpg',
      category: 'waste-management',
      language: 'en',
      targetAudience: 'all',
      tags: ['waste', 'recycling', 'environment', 'cleanliness'],
      learningObjectives: [
        'Understand waste segregation',
        'Learn recycling practices',
        'Know proper disposal methods'
      ],
      practicalTips: [
        'Separate organic and inorganic waste',
        'Use separate bins for different types of waste',
        'Compost organic waste at home',
        'Reduce single-use plastics'
      ],
      callToAction: 'Start segregating your waste at home today!'
    }
  ],
  'public-safety': [
    {
      title: 'Public Safety Awareness',
      description: 'Important tips for staying safe in public spaces and emergency situations.',
      content: 'Public safety is a shared responsibility that requires awareness, preparation, and cooperation. Learn about emergency procedures, safety protocols, and how to contribute to a safer community for everyone.',
      youtubeVideoId: 'hJ1j37oE4LI', // Public Safety and Emergency Preparedness
      youtubeUrl: 'https://www.youtube.com/watch?v=hJ1j37oE4LI',
      duration: 300, // 5 minutes
      thumbnailUrl: 'https://img.youtube.com/vi/hJ1j37oE4LI/maxresdefault.jpg',
      category: 'public-safety',
      language: 'en',
      targetAudience: 'all',
      tags: ['safety', 'emergency', 'public-safety', 'awareness'],
      learningObjectives: [
        'Learn basic safety principles',
        'Understand emergency procedures',
        'Know how to report safety issues'
      ],
      practicalTips: [
        'Be aware of your surroundings',
        'Report suspicious activities',
        'Know emergency contact numbers',
        'Follow safety guidelines in public spaces'
      ],
      callToAction: 'Stay alert and help keep your community safe!'
    }
  ],
  'community-service': [
    {
      title: 'The Power of Community Service',
      description: 'Discover how community service can make a positive impact and bring people together.',
      content: 'Community service is a powerful way to make a positive impact in your neighborhood and beyond. Learn about volunteer opportunities, the benefits of helping others, and how service strengthens communities and builds connections.',
      youtubeVideoId: 'Z7dLU6fk9QY', // Community Service and Volunteering
      youtubeUrl: 'https://www.youtube.com/watch?v=Z7dLU6fk9QY',
      duration: 360, // 6 minutes
      thumbnailUrl: 'https://img.youtube.com/vi/Z7dLU6fk9QY/maxresdefault.jpg',
      category: 'community-service',
      language: 'en',
      targetAudience: 'all',
      tags: ['volunteering', 'community', 'service', 'helping'],
      learningObjectives: [
        'Understand the value of community service',
        'Learn about volunteer opportunities',
        'Discover ways to help others'
      ],
      practicalTips: [
        'Join local volunteer organizations',
        'Help neighbors in need',
        'Participate in community clean-up drives',
        'Mentor younger community members'
      ],
      callToAction: 'Find a local volunteer opportunity and start making a difference!'
    }
  ],
  'digital-citizenship': [
    {
      title: 'Digital Citizenship and Online Safety',
      description: 'Learn how to be a responsible digital citizen and stay safe online.',
      content: 'Digital citizenship involves using technology responsibly, safely, and ethically. Learn about online safety, protecting personal information, cyberbullying prevention, and how to be a positive influence in digital spaces.',
      youtubeVideoId: 'X6HoyvN4Ur0', // Digital Citizenship and Online Safety
      youtubeUrl: 'https://www.youtube.com/watch?v=X6HoyvN4Ur0',
      duration: 300, // 5 minutes
      thumbnailUrl: 'https://img.youtube.com/vi/X6HoyvN4Ur0/maxresdefault.jpg',
      category: 'digital-citizenship',
      language: 'en',
      targetAudience: 'all',
      tags: ['digital', 'online-safety', 'cyber-security', 'internet'],
      learningObjectives: [
        'Understand digital citizenship principles',
        'Learn online safety practices',
        'Know how to protect personal information'
      ],
      practicalTips: [
        'Use strong, unique passwords',
        'Be cautious with personal information',
        'Think before you post online',
        'Report cyberbullying and harassment'
      ],
      callToAction: 'Practice good digital citizenship in all your online interactions!'
    }
  ],
  'health-hygiene': [
    {
      title: 'Public Health and Hygiene',
      description: 'Essential health and hygiene practices for personal and community well-being.',
      content: 'Good health and hygiene practices are essential for personal well-being and community health. Learn about proper hygiene habits, disease prevention, and how individual health choices impact the broader community.',
      youtubeVideoId: 'YQaAGmFNEzs', // Public Health and Hygiene Education
      youtubeUrl: 'https://www.youtube.com/watch?v=YQaAGmFNEzs',
      duration: 240, // 4 minutes
      thumbnailUrl: 'https://img.youtube.com/vi/YQaAGmFNEzs/maxresdefault.jpg',
      category: 'health-hygiene',
      language: 'en',
      targetAudience: 'all',
      tags: ['health', 'hygiene', 'wellness', 'public-health'],
      learningObjectives: [
        'Learn basic hygiene practices',
        'Understand public health principles',
        'Know how to prevent disease spread'
      ],
      practicalTips: [
        'Wash hands regularly with soap',
        'Cover your mouth when coughing or sneezing',
        'Maintain personal cleanliness',
        'Stay home when sick'
      ],
      callToAction: 'Make good hygiene a daily habit for better health!'
    }
  ]
};

// Get YouTube videos for a specific category
const getYouTubeVideos = async (category, language = 'en', targetAudience = 'all') => {
  try {
    // Check if videos already exist in database
    const existingVideos = await EducationalVideo.find({
      category,
      language,
      targetAudience,
      generationMethod: 'youtube'
    });

    if (existingVideos.length > 0) {
      return existingVideos;
    }

    // If no videos exist, create them from curated list
    const categoryVideos = youtubeVideos[category] || [];
    const createdVideos = [];

    for (const videoData of categoryVideos) {
      const video = new EducationalVideo({
        ...videoData,
        isPublished: true,
        publishedAt: new Date(),
        views: Math.floor(Math.random() * 1000) + 100,
        likes: Math.floor(Math.random() * 100) + 10,
        shares: Math.floor(Math.random() * 50) + 5
      });

      await video.save();
      createdVideos.push(video);
    }

    return createdVideos;
  } catch (error) {
    console.error('Error getting YouTube videos:', error);
    throw error;
  }
};

// Get all YouTube videos
const getAllYouTubeVideos = async (filters = {}) => {
  try {
    const query = {
      generationMethod: 'youtube',
      isPublished: true,
      ...filters
    };

    const videos = await EducationalVideo.find(query)
      .sort({ publishedAt: -1 });

    return videos;
  } catch (error) {
    console.error('Error getting all YouTube videos:', error);
    throw error;
  }
};

// Get today's featured YouTube video
const getTodaysYouTubeVideo = async (language = 'en') => {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // Try to find a video published today
    let video = await EducationalVideo.findOne({
      generationMethod: 'youtube',
      isPublished: true,
      language,
      publishedAt: { $gte: today }
    }).sort({ publishedAt: -1 });

    // If no video for today, get a random one
    if (!video) {
      const videos = await EducationalVideo.find({
        generationMethod: 'youtube',
        isPublished: true,
        language
      });

      if (videos.length > 0) {
        video = videos[Math.floor(Math.random() * videos.length)];
      }
    }

    return video;
  } catch (error) {
    console.error('Error getting today\'s YouTube video:', error);
    throw error;
  }
};

// Initialize YouTube videos in database
const initializeYouTubeVideos = async () => {
  try {
    console.log('Initializing YouTube videos...');
    
    const categories = Object.keys(youtubeVideos);
    
    for (const category of categories) {
      await getYouTubeVideos(category, 'en', 'all');
      console.log(`Initialized videos for category: ${category}`);
    }
    
    console.log('YouTube videos initialization completed!');
  } catch (error) {
    console.error('Error initializing YouTube videos:', error);
    throw error;
  }
};

// Get video analytics
const getYouTubeVideoAnalytics = async () => {
  try {
    const totalVideos = await EducationalVideo.countDocuments({ generationMethod: 'youtube' });
    const totalViews = await EducationalVideo.aggregate([
      { $match: { generationMethod: 'youtube' } },
      { $group: { _id: null, totalViews: { $sum: '$views' } } }
    ]);

    const categoryStats = await EducationalVideo.aggregate([
      { $match: { generationMethod: 'youtube' } },
      { $group: { _id: '$category', count: { $sum: 1 }, totalViews: { $sum: '$views' } } }
    ]);

    return {
      totalVideos,
      totalViews: totalViews[0]?.totalViews || 0,
      categoryStats
    };
  } catch (error) {
    console.error('Error getting YouTube video analytics:', error);
    throw error;
  }
};

module.exports = {
  getYouTubeVideos,
  getAllYouTubeVideos,
  getTodaysYouTubeVideo,
  initializeYouTubeVideos,
  getYouTubeVideoAnalytics
};
