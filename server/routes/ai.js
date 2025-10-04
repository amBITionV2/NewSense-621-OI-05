const express = require('express');
const { body, validationResult } = require('express-validator');
const { auth } = require('../middleware/auth');
const { translateText, learnFromFeedback, getTranslationStats } = require('../services/translationService');
const { generateEducationalVideo } = require('../services/educationalVideoService');
const geminiVeoService = require('../services/geminiVeoService');
const { 
  getYouTubeVideos, 
  getAllYouTubeVideos, 
  getTodaysYouTubeVideo,
  initializeYouTubeVideos,
  getYouTubeVideoAnalytics 
} = require('../services/youtubeVideoService');
const EducationalVideo = require('../models/EducationalVideo');

const router = express.Router();

// @route   POST /api/ai/translate
// @desc    Translate text with AI learning
// @access  Private
router.post('/translate', auth, [
  body('text').trim().isLength({ min: 1 }).withMessage('Text is required'),
  body('targetLanguage').isLength({ min: 2, max: 5 }).withMessage('Target language is required'),
  body('sourceLanguage').optional().isLength({ min: 2, max: 5 }),
  body('context').optional().isIn(['complaint', 'general', 'education', 'feedback'])
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { text, targetLanguage, sourceLanguage = 'auto', context = 'general' } = req.body;

    const result = await translateText(text, targetLanguage, sourceLanguage, context, req.userId);

    res.json({
      message: 'Translation completed',
      ...result
    });
  } catch (error) {
    console.error('Translation error:', error);
    res.status(500).json({ message: 'Translation failed' });
  }
});

// @route   POST /api/ai/translate/feedback
// @desc    Provide feedback for translation learning
// @access  Private
router.post('/translate/feedback', auth, [
  body('translationId').isMongoId().withMessage('Valid translation ID is required'),
  body('feedback').isIn(['correct', 'incorrect', 'partially-correct']).withMessage('Valid feedback is required'),
  body('correctedTranslation').optional().trim().isLength({ min: 1 })
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { translationId, feedback, correctedTranslation } = req.body;

    const updatedTranslation = await learnFromFeedback(translationId, feedback, correctedTranslation);

    res.json({
      message: 'Feedback recorded successfully',
      translation: updatedTranslation
    });
  } catch (error) {
    console.error('Feedback error:', error);
    res.status(500).json({ message: 'Failed to record feedback' });
  }
});

// @route   GET /api/ai/translate/stats
// @desc    Get translation statistics
// @access  Private
router.get('/translate/stats', auth, async (req, res) => {
  try {
    const stats = await getTranslationStats(req.userId);

    res.json({ stats });
  } catch (error) {
    console.error('Stats error:', error);
    res.status(500).json({ message: 'Failed to fetch statistics' });
  }
});

// @route   POST /api/ai/load-youtube-videos
// @desc    Load YouTube videos for a specific category
// @access  Private (Admin)
router.post('/load-youtube-videos', auth, [
  body('category').isIn([
    'civic-responsibility', 'environmental-awareness', 'traffic-rules',
    'waste-management', 'public-safety', 'community-service',
    'digital-citizenship', 'health-hygiene'
  ]).withMessage('Valid category is required'),
  body('language').optional().isLength({ min: 2, max: 5 }),
  body('targetAudience').optional().isIn(['all', 'children', 'adults', 'seniors'])
], async (req, res) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Admin access required' });
    }

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { category, language = 'en', targetAudience = 'all' } = req.body;

    const videos = await getYouTubeVideos(category, language, targetAudience);

    res.json({
      message: 'YouTube videos loaded successfully',
      videos
    });
  } catch (error) {
    console.error('YouTube video loading error:', error);
    res.status(500).json({ message: 'Failed to load YouTube videos' });
  }
});

// @route   POST /api/ai/generate-civic-video
// @desc    Generate civic sense video using Gemini Veo
// @access  Private (Admin)
router.post('/generate-civic-video', auth, [
  body('category').isIn([
    'civic-responsibility', 'environmental-awareness', 'traffic-rules',
    'waste-management', 'public-safety', 'community-service',
    'digital-citizenship', 'health-hygiene'
  ]).withMessage('Valid category is required'),
  body('language').optional().isLength({ min: 2, max: 5 }),
  body('targetAudience').optional().isIn(['all', 'children', 'adults', 'seniors'])
], async (req, res) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Admin access required' });
    }

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { category, language = 'en', targetAudience = 'all' } = req.body;

    const videoContent = await geminiVeoService.generateCivicSenseVideo(category, language, targetAudience);

    res.json({
      message: 'Civic sense video generated successfully with Gemini Veo',
      video: videoContent
    });
  } catch (error) {
    console.error('Civic video generation error:', error);
    res.status(500).json({ message: 'Failed to generate civic sense video' });
  }
});

// @route   POST /api/ai/initialize-youtube-videos
// @desc    Initialize YouTube videos in database
// @access  Private (Admin)
router.post('/initialize-youtube-videos', auth, async (req, res) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Admin access required' });
    }

    await initializeYouTubeVideos();

    res.json({
      message: 'YouTube videos initialized successfully'
    });
  } catch (error) {
    console.error('YouTube video initialization error:', error);
    res.status(500).json({ message: 'Failed to initialize YouTube videos' });
  }
});

// @route   GET /api/ai/civic-videos
// @desc    Get civic sense YouTube videos (public access for educational content)
// @access  Public
router.get('/civic-videos', async (req, res) => {
  try {
    const {
      page = 1,
      limit = 10,
      category,
      language = 'en',
      targetAudience = 'all'
    } = req.query;

    const filters = {
      isPublished: true,
      language: language,
      generationMethod: 'youtube'
    };

    if (category) filters.category = category;
    if (targetAudience !== 'all') filters.targetAudience = targetAudience;

    const videos = await getAllYouTubeVideos(filters);

    // Simple pagination
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;
    const paginatedVideos = videos.slice(startIndex, endIndex);

    res.json({
      videos: paginatedVideos,
      pagination: {
        current: parseInt(page),
        pages: Math.ceil(videos.length / limit),
        total: videos.length
      }
    });
  } catch (error) {
    console.error('Get civic videos error:', error);
    res.status(500).json({ message: 'Failed to fetch civic videos' });
  }
});

// @route   GET /api/ai/civic-videos/analytics
// @desc    Get civic sense YouTube video analytics
// @access  Private (Admin)
router.get('/civic-videos/analytics', auth, async (req, res) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Admin access required' });
    }

    const analytics = await getYouTubeVideoAnalytics();

    res.json({
      message: 'Civic sense YouTube video analytics retrieved successfully',
      analytics
    });
  } catch (error) {
    console.error('Civic video analytics error:', error);
    res.status(500).json({ message: 'Failed to fetch civic video analytics' });
  }
});

// @route   GET /api/ai/videos
// @desc    Get educational YouTube videos (public access for educational content)
// @access  Public
router.get('/videos', async (req, res) => {
  try {
    const {
      page = 1,
      limit = 10,
      category,
      language = 'en',
      targetAudience = 'all'
    } = req.query;

    const filters = {
      isPublished: true,
      language: language,
      generationMethod: 'youtube'
    };

    if (category) filters.category = category;
    if (targetAudience !== 'all') filters.targetAudience = targetAudience;

    const videos = await getAllYouTubeVideos(filters);

    // Simple pagination
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;
    const paginatedVideos = videos.slice(startIndex, endIndex);

    res.json({
      videos: paginatedVideos,
      pagination: {
        current: parseInt(page),
        pages: Math.ceil(videos.length / limit),
        total: videos.length
      }
    });
  } catch (error) {
    console.error('Get videos error:', error);
    res.status(500).json({ message: 'Failed to fetch videos' });
  }
});

// @route   GET /api/ai/videos/daily
// @desc    Get today's educational YouTube video
// @access  Private
router.get('/videos/daily', auth, async (req, res) => {
  try {
    const language = req.user.preferences?.language || 'en';
    const video = await getTodaysYouTubeVideo(language);

    if (!video) {
      return res.status(404).json({ message: 'No daily video available' });
    }

    res.json({ video });
  } catch (error) {
    console.error('Get daily video error:', error);
    res.status(500).json({ message: 'Failed to fetch daily video' });
  }
});

// @route   POST /api/ai/videos/:id/feedback
// @desc    Provide feedback for educational video
// @access  Private
router.post('/videos/:id/feedback', auth, [
  body('rating').isInt({ min: 1, max: 5 }).withMessage('Rating must be between 1 and 5'),
  body('comment').optional().trim().isLength({ min: 5 }).withMessage('Comment must be at least 5 characters')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { rating, comment } = req.body;

    const video = await EducationalVideo.findById(req.params.id);
    if (!video) {
      return res.status(404).json({ message: 'Video not found' });
    }

    video.feedback.push({
      user: req.userId,
      rating,
      comment
    });

    await video.save();

    res.json({
      message: 'Feedback submitted successfully',
      video: await EducationalVideo.findById(req.params.id)
    });
  } catch (error) {
    console.error('Video feedback error:', error);
    res.status(500).json({ message: 'Failed to submit feedback' });
  }
});

module.exports = router;
