const { TwitterApi } = require('twitter-api-v2');
const axios = require('axios');
const Complaint = require('../models/Complaint');

// Initialize Twitter client
const twitterClient = new TwitterApi({
  appKey: process.env.TWITTER_API_KEY,
  appSecret: process.env.TWITTER_API_SECRET,
  accessToken: process.env.TWITTER_ACCESS_TOKEN,
  accessSecret: process.env.TWITTER_ACCESS_TOKEN_SECRET,
});

// Generate AI-powered social media content
const generateSocialMediaContent = async (complaint) => {
  const { OpenAI } = require('openai');
  const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
  });

  try {
    const prompt = `Create engaging social media posts for a citizen complaint about ${complaint.category} in ${complaint.location.city || complaint.location.address}. 

Complaint details:
- Title: ${complaint.title}
- Description: ${complaint.description}
- Location: ${complaint.location.address}
- Priority: ${complaint.priority}

Create:
1. A Twitter post (max 280 characters) that's informative and encourages community awareness
2. An Instagram caption (max 2200 characters) with relevant hashtags

Make the posts engaging, informative, and encourage civic responsibility. Include relevant hashtags and emojis.`;

    const response = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: [{ role: 'user', content: prompt }],
      max_tokens: 500,
      temperature: 0.7,
    });

    const content = response.choices[0].message.content;
    
    // Parse the response to extract Twitter and Instagram content
    const lines = content.split('\n');
    let twitterContent = '';
    let instagramContent = '';
    let currentPlatform = '';

    for (const line of lines) {
      if (line.toLowerCase().includes('twitter')) {
        currentPlatform = 'twitter';
      } else if (line.toLowerCase().includes('instagram')) {
        currentPlatform = 'instagram';
      } else if (line.trim() && currentPlatform) {
        if (currentPlatform === 'twitter') {
          twitterContent += line.trim() + ' ';
        } else if (currentPlatform === 'instagram') {
          instagramContent += line.trim() + ' ';
        }
      }
    }

    return {
      twitter: twitterContent.trim(),
      instagram: instagramContent.trim()
    };
  } catch (error) {
    console.error('Error generating social media content:', error);
    // Fallback content
    return {
      twitter: `🚨 New ${complaint.category} complaint reported in ${complaint.location.city || 'our city'}. Let's work together for a better community! #CitizenComplaint #CommunityService`,
      instagram: `🚨 Community Alert: New ${complaint.category} complaint reported in ${complaint.location.city || 'our city'}. 

📍 Location: ${complaint.location.address}
📝 Issue: ${complaint.title}

Let's work together to build a better community! Report issues, stay informed, and take action for positive change.

#CitizenComplaint #CommunityService #CivicResponsibility #${complaint.category.replace('-', '')} #CommunityAction`
    };
  }
};

// Post to Twitter
const postToTwitter = async (complaint, content) => {
  try {
    const tweet = await twitterClient.v2.tweet({
      text: content,
      media: {
        media_ids: [] // Add image upload logic if needed
      }
    });

    return {
      platform: 'twitter',
      postId: tweet.data.id,
      url: `https://twitter.com/user/status/${tweet.data.id}`,
      postedAt: new Date(),
      status: 'posted'
    };
  } catch (error) {
    console.error('Twitter posting error:', error);
    return {
      platform: 'twitter',
      status: 'failed',
      error: error.message
    };
  }
};

// Post to Instagram
const postToInstagram = async (complaint, content) => {
  try {
    // Instagram Basic Display API implementation
    // Note: This is a simplified version. Full implementation would require proper Instagram Business API setup
    
    const instagramResponse = await axios.post('https://graph.instagram.com/me/media', {
      image_url: '', // Add complaint image if available
      caption: content,
      access_token: process.env.INSTAGRAM_ACCESS_TOKEN
    });

    return {
      platform: 'instagram',
      postId: instagramResponse.data.id,
      url: `https://www.instagram.com/p/${instagramResponse.data.id}/`,
      postedAt: new Date(),
      status: 'posted'
    };
  } catch (error) {
    console.error('Instagram posting error:', error);
    return {
      platform: 'instagram',
      status: 'failed',
      error: error.message
    };
  }
};

// Main function to post to social media
const postToSocialMedia = async (complaint) => {
  try {
    // Generate AI content
    const content = await generateSocialMediaContent(complaint);
    
    const socialMediaPosts = [];

    // Post to Twitter
    if (process.env.TWITTER_API_KEY) {
      const twitterPost = await postToTwitter(complaint, content.twitter);
      socialMediaPosts.push(twitterPost);
    }

    // Post to Instagram
    if (process.env.INSTAGRAM_ACCESS_TOKEN) {
      const instagramPost = await postToInstagram(complaint, content.instagram);
      socialMediaPosts.push(instagramPost);
    }

    // Update complaint with social media posts
    await Complaint.findByIdAndUpdate(complaint._id, {
      $push: { socialMediaPosts: { $each: socialMediaPosts } }
    });

    return socialMediaPosts;
  } catch (error) {
    console.error('Social media posting error:', error);
    throw error;
  }
};

// Schedule recurring posts for unresolved complaints
const scheduleRecurringPosts = async () => {
  try {
    const unresolvedComplaints = await Complaint.find({
      status: { $in: ['open', 'in-progress'] },
      createdAt: { $lt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) } // Older than 7 days
    });

    for (const complaint of unresolvedComplaints) {
      // Check if last social media post was more than 3 days ago
      const lastPost = complaint.socialMediaPosts
        .sort((a, b) => new Date(b.postedAt) - new Date(a.postedAt))[0];

      if (!lastPost || new Date() - new Date(lastPost.postedAt) > 3 * 24 * 60 * 60 * 1000) {
        await postToSocialMedia(complaint);
      }
    }
  } catch (error) {
    console.error('Scheduling recurring posts error:', error);
  }
};

module.exports = {
  postToSocialMedia,
  scheduleRecurringPosts,
  generateSocialMediaContent
};
