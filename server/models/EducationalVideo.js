const mongoose = require('mongoose');

const educationalVideoSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  content: {
    type: String,
    required: true
  },
  category: {
    type: String,
    enum: [
      'civic-responsibility',
      'environmental-awareness',
      'traffic-rules',
      'waste-management',
      'public-safety',
      'community-service',
      'digital-citizenship',
      'health-hygiene'
    ],
    required: true
  },
  language: {
    type: String,
    default: 'en'
  },
  duration: {
    type: Number, // in seconds
    required: true
  },
  videoUrl: String,
  thumbnailUrl: String,
  youtubeVideoId: String,
  youtubeUrl: String,
  transcript: String,
  subtitles: [{
    language: String,
    url: String
  }],
  generatedBy: {
    type: String,
    enum: ['ai', 'manual'],
    default: 'ai'
  },
  aiPrompt: String,
  tags: [String],
  targetAudience: {
    type: String,
    enum: ['all', 'children', 'adults', 'seniors'],
    default: 'all'
  },
  isPublished: {
    type: Boolean,
    default: false
  },
  publishedAt: Date,
  views: {
    type: Number,
    default: 0
  },
  likes: {
    type: Number,
    default: 0
  },
  shares: {
    type: Number,
    default: 0
  },
  feedback: [{
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    rating: {
      type: Number,
      min: 1,
      max: 5
    },
    comment: String,
    createdAt: {
      type: Date,
      default: Date.now
    }
  }],
  // Gemini Veo specific fields
  learningObjectives: [String],
  practicalTips: [String],
  callToAction: String,
  videoQuality: {
    type: String,
    enum: ['standard', 'hd', '4k'],
    default: 'hd'
  },
  generationMethod: {
    type: String,
    enum: ['youtube', 'gemini-veo', 'openai', 'manual'],
    default: 'youtube'
  }
}, {
  timestamps: true
});

// Index for category and language
educationalVideoSchema.index({ category: 1, language: 1 });
educationalVideoSchema.index({ isPublished: 1, publishedAt: -1 });

module.exports = mongoose.model('EducationalVideo', educationalVideoSchema);
