const { GoogleGenerativeAI } = require('@google/generative-ai');
const EducationalVideo = require('../models/EducationalVideo');
const fs = require('fs').promises;
const path = require('path');

// Initialize Gemini AI
const genAI = new GoogleGenerativeAI(process.env.GOOGLE_AI_API_KEY);

// Gemini Veo video generation service
class GeminiVeoService {
  constructor() {
    this.model = genAI.getGenerativeModel({ model: 'gemini-1.5-pro' });
  }

  // Generate educational video content using Gemini
  async generateCivicSenseVideo(category, language = 'en', targetAudience = 'all') {
    try {
      const categoryPrompts = {
        'civic-responsibility': {
          title: 'Being a Responsible Citizen',
          prompt: `Create an engaging educational video script about civic responsibility. Focus on:
          - Voting rights and importance of participating in democracy
          - Community involvement and volunteering
          - Respecting public property and spaces
          - Following laws and regulations
          - Being informed about local issues
          - Helping neighbors and community members
          - Environmental responsibility
          - Digital citizenship and online behavior
          
          Make it educational, inspiring, and practical with real-world examples.`,
          duration: 4,
          tags: ['civic-responsibility', 'democracy', 'community', 'voting', 'citizenship']
        },
        'environmental-awareness': {
          title: 'Protecting Our Environment',
          prompt: `Create an educational video script about environmental awareness and protection. Include:
          - Importance of recycling and waste reduction
          - Water conservation techniques
          - Energy saving practices
          - Tree planting and green spaces
          - Reducing plastic usage
          - Sustainable transportation
          - Wildlife protection
          - Climate change awareness
          
          Make it actionable with practical tips citizens can implement daily.`,
          duration: 5,
          tags: ['environment', 'sustainability', 'recycling', 'conservation', 'green-living']
        },
        'traffic-rules': {
          title: 'Road Safety and Traffic Rules',
          prompt: `Create an educational video script about traffic rules and road safety. Cover:
          - Traffic signal meanings and importance
          - Pedestrian safety and crosswalk usage
          - Speed limits and safe driving
          - Helmet and seatbelt usage
          - Parking regulations
          - Public transport etiquette
          - Emergency vehicle priority
          - Road rage prevention
          
          Focus on practical safety measures and legal requirements.`,
          duration: 4,
          tags: ['traffic-safety', 'road-rules', 'pedestrian-safety', 'driving', 'transport']
        },
        'waste-management': {
          title: 'Smart Waste Management',
          prompt: `Create an educational video script about proper waste management. Include:
          - Waste segregation at source
          - Composting organic waste
          - Recycling different materials
          - Hazardous waste disposal
          - Reducing single-use plastics
          - Community clean-up initiatives
          - Waste-to-energy concepts
          - Circular economy principles
          
          Provide practical steps for effective waste management at home and community level.`,
          duration: 5,
          tags: ['waste-management', 'recycling', 'composting', 'sustainability', 'clean-community']
        },
        'public-safety': {
          title: 'Public Safety Awareness',
          prompt: `Create an educational video script about public safety. Cover:
          - Emergency contact numbers and procedures
          - First aid basics and emergency response
          - Fire safety and prevention
          - Natural disaster preparedness
          - Personal safety in public spaces
          - Cybersecurity and online safety
          - Community watch programs
          - Reporting suspicious activities
          
          Make it practical with actionable safety measures.`,
          duration: 4,
          tags: ['public-safety', 'emergency-response', 'first-aid', 'security', 'preparedness']
        },
        'community-service': {
          title: 'Building Strong Communities',
          prompt: `Create an educational video script about community service and engagement. Include:
          - Volunteering opportunities and benefits
          - Organizing community events
          - Supporting local businesses
          - Mentoring and education programs
          - Elderly care and assistance
          - Youth development programs
          - Cultural preservation
          - Community problem-solving
          
          Inspire active community participation and social responsibility.`,
          duration: 5,
          tags: ['community-service', 'volunteering', 'social-responsibility', 'community-building', 'civic-engagement']
        },
        'digital-citizenship': {
          title: 'Responsible Digital Citizenship',
          prompt: `Create an educational video script about digital citizenship. Cover:
          - Online privacy and data protection
          - Cyberbullying prevention and response
          - Digital literacy and fact-checking
          - Responsible social media usage
          - Online safety for children and adults
          - Digital rights and responsibilities
          - Technology for social good
          - Digital divide awareness
          
          Focus on ethical and safe online behavior.`,
          duration: 4,
          tags: ['digital-citizenship', 'online-safety', 'cyber-security', 'digital-literacy', 'internet-ethics']
        },
        'health-hygiene': {
          title: 'Community Health and Hygiene',
          prompt: `Create an educational video script about public health and hygiene. Include:
          - Personal hygiene practices
          - Public health measures
          - Disease prevention strategies
          - Mental health awareness
          - Healthy lifestyle choices
          - Community health initiatives
          - Vaccination importance
          - Health emergency response
          
          Promote healthy living and community well-being.`,
          duration: 4,
          tags: ['public-health', 'hygiene', 'disease-prevention', 'mental-health', 'wellness']
        }
      };

      const audienceModifiers = {
        'children': 'Use simple language, colorful examples, and engaging storytelling suitable for ages 6-12.',
        'adults': 'Provide comprehensive information with practical examples and real-world applications.',
        'seniors': 'Use clear, easy-to-understand language with relevant examples for older adults.',
        'all': 'Create content that is accessible and engaging for all age groups.'
      };

      const languageModifiers = {
        'en': 'Create the content in clear, professional English.',
        'hi': 'Create the content in Hindi with proper grammar and cultural context.',
        'ta': 'Create the content in Tamil with local cultural references.',
        'te': 'Create the content in Telugu with regional context.',
        'bn': 'Create the content in Bengali with cultural relevance.',
        'gu': 'Create the content in Gujarati with local context.',
        'mr': 'Create the content in Marathi with regional relevance.',
        'kn': 'Create the content in Kannada with local context.',
        'ml': 'Create the content in Malayalam with regional relevance.',
        'pa': 'Create the content in Punjabi with cultural context.'
      };

      const categoryInfo = categoryPrompts[category];
      if (!categoryInfo) {
        throw new Error(`Invalid category: ${category}`);
      }

      const prompt = `${categoryInfo.prompt}

${audienceModifiers[targetAudience]}

${languageModifiers[language] || languageModifiers['en']}

Create a comprehensive educational video script that includes:
1. Engaging title and hook
2. Clear learning objectives
3. Main content with 3-5 key points and examples
4. Practical tips and actionable steps
5. Call to action for community involvement
6. Summary and key takeaways

Format the response as:
TITLE: [Engaging Title]
DURATION: [Duration in minutes]
DESCRIPTION: [Brief description of the video content]
LEARNING_OBJECTIVES: [3-5 key learning points]
CONTENT: [Full script with clear sections]
PRACTICAL_TIPS: [5-7 actionable tips]
CALL_TO_ACTION: [Encouraging community participation]
TAGS: [Relevant hashtags separated by commas]`;

      const result = await this.model.generateContent(prompt);
      const response = await result.response;
      const content = response.text();

      // Parse the AI response
      const parsedContent = this.parseVideoContent(content, categoryInfo);
      
      // Create video record
      const video = new EducationalVideo({
        title: parsedContent.title || categoryInfo.title,
        description: parsedContent.description || `Learn about ${category.replace('-', ' ')}`,
        content: parsedContent.content,
        category,
        language,
        duration: (parsedContent.duration || categoryInfo.duration) * 60, // convert to seconds
        generatedBy: 'ai',
        aiPrompt: prompt,
        tags: parsedContent.tags || categoryInfo.tags,
        targetAudience,
        isPublished: true,
        publishedAt: new Date(),
        // Add Gemini-specific fields
        learningObjectives: parsedContent.learningObjectives,
        practicalTips: parsedContent.practicalTips,
        callToAction: parsedContent.callToAction
      });

      await video.save();

      // Generate video using Gemini Veo (simulated for now)
      const videoUrl = await this.generateVideoWithVeo(parsedContent, video._id);
      video.videoUrl = videoUrl;
      video.thumbnailUrl = `/api/videos/${video._id}/thumbnail`;
      await video.save();

      return video;
    } catch (error) {
      console.error('Gemini Veo video generation error:', error);
      throw error;
    }
  }

  // Parse the AI response content
  parseVideoContent(content, categoryInfo) {
    const lines = content.split('\n');
    let title = '';
    let duration = categoryInfo.duration;
    let description = '';
    let learningObjectives = [];
    let scriptContent = '';
    let practicalTips = [];
    let callToAction = '';
    let tags = categoryInfo.tags;

    let currentSection = '';
    for (const line of lines) {
      if (line.startsWith('TITLE:')) {
        title = line.replace('TITLE:', '').trim();
        currentSection = 'title';
      } else if (line.startsWith('DURATION:')) {
        const durationText = line.replace('DURATION:', '').trim();
        duration = parseInt(durationText) || categoryInfo.duration;
        currentSection = 'duration';
      } else if (line.startsWith('DESCRIPTION:')) {
        description = line.replace('DESCRIPTION:', '').trim();
        currentSection = 'description';
      } else if (line.startsWith('LEARNING_OBJECTIVES:')) {
        const objectivesText = line.replace('LEARNING_OBJECTIVES:', '').trim();
        learningObjectives = objectivesText.split(',').map(obj => obj.trim()).filter(obj => obj);
        currentSection = 'objectives';
      } else if (line.startsWith('CONTENT:')) {
        currentSection = 'content';
      } else if (line.startsWith('PRACTICAL_TIPS:')) {
        const tipsText = line.replace('PRACTICAL_TIPS:', '').trim();
        practicalTips = tipsText.split(',').map(tip => tip.trim()).filter(tip => tip);
        currentSection = 'tips';
      } else if (line.startsWith('CALL_TO_ACTION:')) {
        callToAction = line.replace('CALL_TO_ACTION:', '').trim();
        currentSection = 'cta';
      } else if (line.startsWith('TAGS:')) {
        const tagsText = line.replace('TAGS:', '').trim();
        tags = tagsText.split(',').map(tag => tag.trim()).filter(tag => tag);
        currentSection = 'tags';
      } else if (line.trim() && currentSection === 'content') {
        scriptContent += line + '\n';
      }
    }

    return {
      title,
      duration,
      description,
      learningObjectives,
      content: scriptContent.trim(),
      practicalTips,
      callToAction,
      tags
    };
  }

  // Generate video using Gemini Veo (simulated implementation)
  async generateVideoWithVeo(content, videoId) {
    try {
      // This is a simulated implementation
      // In a real implementation, you would integrate with Gemini Veo API
      console.log('Generating video with Gemini Veo for video ID:', videoId);
      
      // Simulate video generation process
      const videoUrl = `/api/videos/${videoId}/stream`;
      
      // In a real implementation, you would:
      // 1. Send the script to Gemini Veo API
      // 2. Wait for video generation to complete
      // 3. Download the generated video
      // 4. Store it in your media storage
      // 5. Return the video URL
      
      return videoUrl;
    } catch (error) {
      console.error('Video generation with Veo failed:', error);
      throw error;
    }
  }

  // Generate daily civic sense videos
  async generateDailyCivicSenseVideos() {
    try {
      const categories = [
        'civic-responsibility', 'environmental-awareness', 'traffic-rules',
        'waste-management', 'public-safety', 'community-service',
        'digital-citizenship', 'health-hygiene'
      ];

      const languages = ['en', 'hi', 'ta', 'te', 'bn', 'gu', 'mr', 'kn', 'ml', 'pa'];

      // Check if daily videos already exist for today
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      const existingVideos = await EducationalVideo.countDocuments({
        publishedAt: { $gte: today },
        generatedBy: 'ai'
      });

      if (existingVideos >= categories.length) {
        console.log('Daily civic sense videos already generated for today');
        return;
      }

      // Generate videos for each category
      for (const category of categories) {
        const existingCategoryVideo = await EducationalVideo.findOne({
          category,
          publishedAt: { $gte: today },
          generatedBy: 'ai'
        });

        if (!existingCategoryVideo) {
          try {
            await this.generateCivicSenseVideo(category, 'en', 'all');
            console.log(`Generated daily civic sense video for category: ${category}`);
          } catch (error) {
            console.error(`Failed to generate video for category ${category}:`, error);
          }
        }
      }

      // Generate videos in different languages
      for (const language of languages.slice(0, 3)) { // Generate for top 3 languages
        const randomCategory = categories[Math.floor(Math.random() * categories.length)];
        
        try {
          await this.generateCivicSenseVideo(randomCategory, language, 'all');
          console.log(`Generated daily civic sense video in ${language} for category: ${randomCategory}`);
        } catch (error) {
          console.error(`Failed to generate video in ${language}:`, error);
        }
      }

    } catch (error) {
      console.error('Daily civic sense video generation error:', error);
    }
  }

  // Get civic sense video analytics
  async getCivicSenseAnalytics() {
    try {
      const analytics = await EducationalVideo.aggregate([
        {
          $group: {
            _id: null,
            totalVideos: { $sum: 1 },
            totalViews: { $sum: '$views' },
            totalLikes: { $sum: '$likes' },
            totalShares: { $sum: '$shares' },
            averageRating: { $avg: '$feedback.rating' }
          }
        }
      ]);

      const categoryStats = await EducationalVideo.aggregate([
        {
          $group: {
            _id: '$category',
            count: { $sum: 1 },
            totalViews: { $sum: '$views' },
            averageRating: { $avg: '$feedback.rating' }
          }
        },
        { $sort: { totalViews: -1 } }
      ]);

      const languageStats = await EducationalVideo.aggregate([
        {
          $group: {
            _id: '$language',
            count: { $sum: 1 },
            totalViews: { $sum: '$views' }
          }
        },
        { $sort: { totalViews: -1 } }
      ]);

      return {
        overall: analytics[0] || {
          totalVideos: 0,
          totalViews: 0,
          totalLikes: 0,
          totalShares: 0,
          averageRating: 0
        },
        categoryStats,
        languageStats
      };
    } catch (error) {
      console.error('Civic sense analytics error:', error);
      throw error;
    }
  }
}

module.exports = new GeminiVeoService();
