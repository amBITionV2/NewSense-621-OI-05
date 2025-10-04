const { OpenAI } = require('openai');
const EducationalVideo = require('../models/EducationalVideo');

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// Generate educational video content using AI
const generateEducationalVideo = async (category, language = 'en', targetAudience = 'all') => {
  try {
    const categoryPrompts = {
      'civic-responsibility': 'Create educational content about civic responsibility, including voting, community participation, and being a responsible citizen.',
      'environmental-awareness': 'Create educational content about environmental protection, recycling, reducing waste, and sustainable living practices.',
      'traffic-rules': 'Create educational content about traffic rules, road safety, pedestrian rights, and responsible driving.',
      'waste-management': 'Create educational content about proper waste disposal, segregation, composting, and reducing environmental impact.',
      'public-safety': 'Create educational content about public safety, emergency procedures, first aid basics, and community safety measures.',
      'community-service': 'Create educational content about volunteering, community service, helping neighbors, and building stronger communities.',
      'digital-citizenship': 'Create educational content about responsible internet use, online safety, digital privacy, and cyber etiquette.',
      'health-hygiene': 'Create educational content about personal hygiene, public health practices, disease prevention, and healthy living.'
    };

    const audiencePrompts = {
      'children': 'Make the content simple, engaging, and suitable for children aged 6-12. Use simple language and include fun elements.',
      'adults': 'Create comprehensive content for adults with practical examples and real-world applications.',
      'seniors': 'Create content that is clear, easy to understand, and relevant for senior citizens.',
      'all': 'Create content that is accessible and engaging for all age groups.'
    };

    const languagePrompts = {
      'en': 'Create the content in English.',
      'hi': 'Create the content in Hindi.',
      'ta': 'Create the content in Tamil.',
      'te': 'Create the content in Telugu.',
      'bn': 'Create the content in Bengali.',
      'gu': 'Create the content in Gujarati.',
      'mr': 'Create the content in Marathi.',
      'kn': 'Create the content in Kannada.',
      'ml': 'Create the content in Malayalam.',
      'pa': 'Create the content in Punjabi.'
    };

    const prompt = `${categoryPrompts[category]}

${audiencePrompts[targetAudience]}

${languagePrompts[language] || languagePrompts['en']}

Create a comprehensive educational video script that includes:
1. Title (catchy and informative)
2. Introduction (hook the audience)
3. Main content (3-5 key points with examples)
4. Practical tips or actions
5. Conclusion (call to action)

Format the response as:
TITLE: [Title]
DURATION: [Estimated duration in minutes]
DESCRIPTION: [Brief description]
CONTENT: [Full script content]
TAGS: [Relevant hashtags separated by commas]`;

    const response = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: [{ role: 'user', content: prompt }],
      max_tokens: 1500,
      temperature: 0.7,
    });

    const content = response.choices[0].message.content;
    
    // Parse the AI response
    const lines = content.split('\n');
    let title = '';
    let duration = 3; // default 3 minutes
    let description = '';
    let scriptContent = '';
    let tags = [];

    let currentSection = '';
    for (const line of lines) {
      if (line.startsWith('TITLE:')) {
        title = line.replace('TITLE:', '').trim();
        currentSection = 'title';
      } else if (line.startsWith('DURATION:')) {
        const durationText = line.replace('DURATION:', '').trim();
        duration = parseInt(durationText) || 3;
        currentSection = 'duration';
      } else if (line.startsWith('DESCRIPTION:')) {
        description = line.replace('DESCRIPTION:', '').trim();
        currentSection = 'description';
      } else if (line.startsWith('CONTENT:')) {
        currentSection = 'content';
      } else if (line.startsWith('TAGS:')) {
        const tagsText = line.replace('TAGS:', '').trim();
        tags = tagsText.split(',').map(tag => tag.trim()).filter(tag => tag);
        currentSection = 'tags';
      } else if (line.trim() && currentSection === 'content') {
        scriptContent += line + '\n';
      }
    }

    // Create educational video record
    const video = new EducationalVideo({
      title: title || `Educational Content: ${category}`,
      description: description || `Learn about ${category.replace('-', ' ')}`,
      content: scriptContent.trim(),
      category,
      language,
      duration: duration * 60, // convert to seconds
      generatedBy: 'ai',
      aiPrompt: prompt,
      tags: tags.length > 0 ? tags : [category, 'education', 'civic-awareness'],
      targetAudience,
      isPublished: true,
      publishedAt: new Date()
    });

    await video.save();

    // Generate video URL (placeholder - in production, this would integrate with video generation service)
    video.videoUrl = `/api/videos/${video._id}/stream`;
    video.thumbnailUrl = `/api/videos/${video._id}/thumbnail`;
    await video.save();

    return video;
  } catch (error) {
    console.error('Educational video generation error:', error);
    throw error;
  }
};

// Generate daily educational videos
const generateDailyVideos = async () => {
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
      console.log('Daily videos already generated for today');
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
          await generateEducationalVideo(category, 'en', 'all');
          console.log(`Generated daily video for category: ${category}`);
        } catch (error) {
          console.error(`Failed to generate video for category ${category}:`, error);
        }
      }
    }

    // Generate videos in different languages
    for (const language of languages.slice(0, 3)) { // Generate for top 3 languages
      const randomCategory = categories[Math.floor(Math.random() * categories.length)];
      
      try {
        await generateEducationalVideo(randomCategory, language, 'all');
        console.log(`Generated daily video in ${language} for category: ${randomCategory}`);
      } catch (error) {
        console.error(`Failed to generate video in ${language}:`, error);
      }
    }

  } catch (error) {
    console.error('Daily video generation error:', error);
  }
};

// Get video analytics
const getVideoAnalytics = async () => {
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
    console.error('Video analytics error:', error);
    throw error;
  }
};

module.exports = {
  generateEducationalVideo,
  generateDailyVideos,
  getVideoAnalytics
};
