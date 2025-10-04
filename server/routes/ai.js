const express = require('express');
const { body, validationResult } = require('express-validator');
const { auth } = require('../middleware/auth');
const { translateText, learnFromFeedback, getTranslationStats } = require('../services/translationService');
const { generateEducationalVideo } = require('../services/educationalVideoService');
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

// @route   POST /api/ai/generate-video
// @desc    Generate educational video content
// @access  Private (Admin)
router.post('/generate-video', auth, [
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

    const videoContent = await generateEducationalVideo(category, language, targetAudience);

    res.json({
      message: 'Educational video generated successfully',
      video: videoContent
    });
  } catch (error) {
    console.error('Video generation error:', error);
    res.status(500).json({ message: 'Failed to generate educational video' });
  }
});

// @route   GET /api/ai/videos
// @desc    Get educational videos
// @access  Private
router.get('/videos', auth, async (req, res) => {
  try {
    const {
      page = 1,
      limit = 10,
      category,
      language = 'en',
      targetAudience = 'all'
    } = req.query;

    const query = {
      isPublished: true,
      language: language
    };

    if (category) query.category = category;
    if (targetAudience !== 'all') query.targetAudience = targetAudience;

    const videos = await EducationalVideo.find(query)
      .sort({ publishedAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await EducationalVideo.countDocuments(query);

    res.json({
      videos,
      pagination: {
        current: parseInt(page),
        pages: Math.ceil(total / limit),
        total
      }
    });
  } catch (error) {
    console.error('Get videos error:', error);
    res.status(500).json({ message: 'Failed to fetch videos' });
  }
});

// @route   GET /api/ai/videos/daily
// @desc    Get today's educational video
// @access  Private
router.get('/videos/daily', auth, async (req, res) => {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const video = await EducationalVideo.findOne({
      isPublished: true,
      publishedAt: { $gte: today },
      language: req.user.preferences?.language || 'en'
    }).sort({ publishedAt: -1 });

    if (!video) {
      // Generate a new daily video if none exists
      const categories = [
        'civic-responsibility', 'environmental-awareness', 'traffic-rules',
        'waste-management', 'public-safety', 'community-service',
        'digital-citizenship', 'health-hygiene'
      ];
      
      const randomCategory = categories[Math.floor(Math.random() * categories.length)];
      
      try {
        const newVideo = await generateEducationalVideo(
          randomCategory,
          req.user.preferences?.language || 'en',
          'all'
        );
        
        return res.json({
          message: 'Daily video generated',
          video: newVideo
        });
      } catch (generateError) {
        return res.status(404).json({ message: 'No daily video available' });
      }
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
