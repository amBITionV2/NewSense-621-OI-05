const { OpenAI } = require('openai');
const axios = require('axios');
const Translation = require('../models/Translation');

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// Google Translate API (fallback)
const translateWithGoogle = async (text, targetLanguage, sourceLanguage = 'auto') => {
  try {
    const response = await axios.post(
      `https://translation.googleapis.com/language/translate/v2?key=${process.env.GOOGLE_TRANSLATE_API_KEY}`,
      {
        q: text,
        target: targetLanguage,
        source: sourceLanguage,
        format: 'text'
      }
    );

    return {
      translatedText: response.data.data.translations[0].translatedText,
      detectedLanguage: response.data.data.translations[0].detectedSourceLanguage
    };
  } catch (error) {
    console.error('Google Translate error:', error);
    throw error;
  }
};

// OpenAI Translation with context learning
const translateWithOpenAI = async (text, targetLanguage, sourceLanguage = 'auto', context = 'general') => {
  try {
    // Get similar translations from database for context
    const similarTranslations = await Translation.find({
      sourceLanguage: sourceLanguage === 'auto' ? { $exists: true } : sourceLanguage,
      targetLanguage,
      context,
      isVerified: true
    }).limit(5);

    const contextExamples = similarTranslations.map(t => 
      `Source: ${t.originalText}\nTranslation: ${t.translatedText}`
    ).join('\n\n');

    const prompt = `You are an expert translator specializing in ${context} content. Translate the following text from ${sourceLanguage} to ${targetLanguage}.

${contextExamples ? `Here are some examples of similar translations:\n${contextExamples}\n\n` : ''}

Text to translate: "${text}"

Provide only the translation without any explanations or additional text.`;

    const response = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: [{ role: 'user', content: prompt }],
      max_tokens: 500,
      temperature: 0.3,
    });

    return {
      translatedText: response.choices[0].message.content.trim(),
      detectedLanguage: sourceLanguage === 'auto' ? 'detected' : sourceLanguage
    };
  } catch (error) {
    console.error('OpenAI translation error:', error);
    throw error;
  }
};

// Main translation function with learning capability
const translateText = async (text, targetLanguage, sourceLanguage = 'auto', context = 'general', userId = null) => {
  try {
    // Check if we have a cached translation
    const cachedTranslation = await Translation.findOne({
      originalText: text,
      targetLanguage,
      sourceLanguage: sourceLanguage === 'auto' ? { $exists: true } : sourceLanguage,
      context
    });

    if (cachedTranslation && cachedTranslation.isVerified) {
      // Increment usage count
      cachedTranslation.usageCount += 1;
      await cachedTranslation.save();
      
      return {
        translatedText: cachedTranslation.translatedText,
        detectedLanguage: cachedTranslation.sourceLanguage,
        translationId: cachedTranslation._id,
        confidence: cachedTranslation.accuracy || 0.8
      };
    }

    let translationResult;
    let translationMethod = 'openai';

    try {
      // Try OpenAI first for better context understanding
      translationResult = await translateWithOpenAI(text, targetLanguage, sourceLanguage, context);
    } catch (openaiError) {
      console.log('OpenAI translation failed, falling back to Google Translate');
      translationResult = await translateWithGoogle(text, targetLanguage, sourceLanguage);
      translationMethod = 'google';
    }

    // Save translation to database for learning
    const translation = new Translation({
      originalText: text,
      translatedText: translationResult.translatedText,
      sourceLanguage: translationResult.detectedLanguage,
      targetLanguage,
      user: userId,
      context,
      accuracy: translationMethod === 'openai' ? 0.9 : 0.7,
      usageCount: 1
    });

    await translation.save();

    return {
      translatedText: translationResult.translatedText,
      detectedLanguage: translationResult.detectedLanguage,
      translationId: translation._id,
      confidence: translation.accuracy
    };
  } catch (error) {
    console.error('Translation error:', error);
    throw new Error('Translation failed');
  }
};

// Learn from user feedback
const learnFromFeedback = async (translationId, feedback, correctedTranslation = null) => {
  try {
    const translation = await Translation.findById(translationId);
    if (!translation) {
      throw new Error('Translation not found');
    }

    translation.userFeedback = feedback;
    
    if (feedback === 'correct') {
      translation.accuracy = Math.min(1.0, translation.accuracy + 0.1);
      translation.isVerified = true;
    } else if (feedback === 'incorrect' && correctedTranslation) {
      translation.translatedText = correctedTranslation;
      translation.accuracy = Math.max(0.1, translation.accuracy - 0.2);
    } else if (feedback === 'partially-correct' && correctedTranslation) {
      translation.translatedText = correctedTranslation;
      translation.accuracy = Math.max(0.1, translation.accuracy - 0.1);
    }

    await translation.save();

    // Update similar translations based on learning
    if (feedback === 'correct') {
      await Translation.updateMany(
        {
          _id: { $ne: translationId },
          originalText: translation.originalText,
          targetLanguage: translation.targetLanguage,
          context: translation.context
        },
        { $inc: { accuracy: 0.05 } }
      );
    }

    return translation;
  } catch (error) {
    console.error('Learning from feedback error:', error);
    throw error;
  }
};

// Get translation statistics
const getTranslationStats = async (userId = null) => {
  try {
    const query = userId ? { user: userId } : {};
    
    const stats = await Translation.aggregate([
      { $match: query },
      {
        $group: {
          _id: null,
          totalTranslations: { $sum: 1 },
          averageAccuracy: { $avg: '$accuracy' },
          totalUsage: { $sum: '$usageCount' },
          verifiedTranslations: {
            $sum: { $cond: ['$isVerified', 1, 0] }
          }
        }
      }
    ]);

    const languagePairs = await Translation.aggregate([
      { $match: query },
      {
        $group: {
          _id: {
            source: '$sourceLanguage',
            target: '$targetLanguage'
          },
          count: { $sum: 1 },
          averageAccuracy: { $avg: '$accuracy' }
        }
      },
      { $sort: { count: -1 } },
      { $limit: 10 }
    ]);

    return {
      overall: stats[0] || {
        totalTranslations: 0,
        averageAccuracy: 0,
        totalUsage: 0,
        verifiedTranslations: 0
      },
      languagePairs
    };
  } catch (error) {
    console.error('Get translation stats error:', error);
    throw error;
  }
};

module.exports = {
  translateText,
  learnFromFeedback,
  getTranslationStats,
  translateWithOpenAI,
  translateWithGoogle
};
