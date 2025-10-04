const mongoose = require('mongoose');

const translationSchema = new mongoose.Schema({
  originalText: {
    type: String,
    required: true
  },
  translatedText: {
    type: String,
    required: true
  },
  sourceLanguage: {
    type: String,
    required: true
  },
  targetLanguage: {
    type: String,
    required: true
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  context: {
    type: String,
    enum: ['complaint', 'general', 'education', 'feedback'],
    default: 'general'
  },
  accuracy: {
    type: Number,
    min: 0,
    max: 1
  },
  userFeedback: {
    type: String,
    enum: ['correct', 'incorrect', 'partially-correct']
  },
  usageCount: {
    type: Number,
    default: 1
  },
  isVerified: {
    type: Boolean,
    default: false
  }
}, {
  timestamps: true
});

// Index for language pairs
translationSchema.index({ sourceLanguage: 1, targetLanguage: 1 });
translationSchema.index({ context: 1 });

module.exports = mongoose.model('Translation', translationSchema);
