import React, { useState } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';
import { Languages, ArrowRightLeft, ThumbsUp, ThumbsDown, RotateCcw } from 'lucide-react';
import LoadingSpinner from '../components/LoadingSpinner';

const Translation = () => {
  const [formData, setFormData] = useState({
    text: '',
    sourceLanguage: 'auto',
    targetLanguage: 'hi',
    context: 'general'
  });
  const [translation, setTranslation] = useState(null);
  const [loading, setLoading] = useState(false);
  const [feedback, setFeedback] = useState('');

  const languages = [
    { code: 'auto', name: 'Auto-detect' },
    { code: 'en', name: 'English' },
    { code: 'hi', name: 'Hindi' },
    { code: 'ta', name: 'Tamil' },
    { code: 'te', name: 'Telugu' },
    { code: 'bn', name: 'Bengali' },
    { code: 'gu', name: 'Gujarati' },
    { code: 'mr', name: 'Marathi' },
    { code: 'kn', name: 'Kannada' },
    { code: 'ml', name: 'Malayalam' },
    { code: 'pa', name: 'Punjabi' }
  ];

  const contexts = [
    { value: 'general', label: 'General' },
    { value: 'complaint', label: 'Complaint' },
    { value: 'education', label: 'Education' },
    { value: 'feedback', label: 'Feedback' }
  ];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleTranslate = async (e) => {
    e.preventDefault();
    
    if (!formData.text.trim()) {
      return;
    }

    setLoading(true);
    try {
      const response = await axios.post('/api/ai/translate', formData);
      setTranslation(response.data);
    } catch (error) {
      console.error('Translation error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleFeedback = async (feedbackType) => {
    if (!translation?.translationId) return;

    try {
      await axios.post('/api/ai/translate/feedback', {
        translationId: translation.translationId,
        feedback: feedbackType
      });
      setFeedback(feedbackType);
      toast.success('Feedback recorded! Thank you for helping improve our AI.');
    } catch (error) {
      console.error('Feedback error:', error);
    }
  };

  const swapLanguages = () => {
    setFormData(prev => ({
      ...prev,
      sourceLanguage: prev.targetLanguage,
      targetLanguage: prev.sourceLanguage === 'auto' ? 'en' : prev.sourceLanguage
    }));
  };

  const resetForm = () => {
    setFormData({
      text: '',
      sourceLanguage: 'auto',
      targetLanguage: 'hi',
      context: 'general'
    });
    setTranslation(null);
    setFeedback('');
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4 max-w-4xl">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">AI Translation</h1>
          <p className="text-gray-600">
            Translate text with AI that learns and improves from your feedback.
          </p>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <form onSubmit={handleTranslate} className="space-y-6">
            {/* Language Selection */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  From
                </label>
                <select
                  name="sourceLanguage"
                  value={formData.sourceLanguage}
                  onChange={handleChange}
                  className="input-field"
                >
                  {languages.map(lang => (
                    <option key={lang.code} value={lang.code}>
                      {lang.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex items-end justify-center">
                <button
                  type="button"
                  onClick={swapLanguages}
                  className="p-2 text-gray-500 hover:text-gray-700 transition-colors duration-200"
                >
                  <ArrowRightLeft className="w-5 h-5" />
                </button>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  To
                </label>
                <select
                  name="targetLanguage"
                  value={formData.targetLanguage}
                  onChange={handleChange}
                  className="input-field"
                >
                  {languages.filter(lang => lang.code !== 'auto').map(lang => (
                    <option key={lang.code} value={lang.code}>
                      {lang.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Context Selection */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Context
              </label>
              <div className="flex flex-wrap gap-2">
                {contexts.map(context => (
                  <label key={context.value} className="flex items-center">
                    <input
                      type="radio"
                      name="context"
                      value={context.value}
                      checked={formData.context === context.value}
                      onChange={handleChange}
                      className="sr-only"
                    />
                    <span className={`px-3 py-1 rounded-full text-sm font-medium cursor-pointer transition-colors duration-200 ${
                      formData.context === context.value 
                        ? 'bg-blue-100 text-blue-800' 
                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                    }`}>
                      {context.label}
                    </span>
                  </label>
                ))}
              </div>
            </div>

            {/* Text Input */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Text to Translate
              </label>
              <textarea
                name="text"
                value={formData.text}
                onChange={handleChange}
                rows={4}
                className="input-field"
                placeholder="Enter the text you want to translate..."
              />
            </div>

            {/* Submit Button */}
            <div className="flex justify-between">
              <button
                type="button"
                onClick={resetForm}
                className="btn-secondary"
              >
                <RotateCcw className="w-4 h-4 mr-2" />
                Reset
              </button>
              <button
                type="submit"
                disabled={loading || !formData.text.trim()}
                className="btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <>
                    <LoadingSpinner size="small" />
                    <span className="ml-2">Translating...</span>
                  </>
                ) : (
                  <>
                    <Languages className="w-4 h-4 mr-2" />
                    Translate
                  </>
                )}
              </button>
            </div>
          </form>

          {/* Translation Result */}
          {translation && (
            <div className="mt-8 pt-6 border-t border-gray-200">
              <div className="mb-4">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Translation</h3>
                <div className="bg-gray-50 rounded-lg p-4">
                  <p className="text-gray-800">{translation.translatedText}</p>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div className="text-sm text-gray-500">
                  <p>Detected language: {translation.detectedLanguage}</p>
                  <p>Confidence: {Math.round(translation.confidence * 100)}%</p>
                </div>

                <div className="flex items-center space-x-2">
                  <span className="text-sm text-gray-600">Was this translation helpful?</span>
                  <button
                    onClick={() => handleFeedback('correct')}
                    className={`p-2 rounded-full transition-colors duration-200 ${
                      feedback === 'correct' 
                        ? 'bg-green-100 text-green-600' 
                        : 'text-gray-400 hover:text-green-600'
                    }`}
                  >
                    <ThumbsUp className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleFeedback('incorrect')}
                    className={`p-2 rounded-full transition-colors duration-200 ${
                      feedback === 'incorrect' 
                        ? 'bg-red-100 text-red-600' 
                        : 'text-gray-400 hover:text-red-600'
                    }`}
                  >
                    <ThumbsDown className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* AI Learning Info */}
          <div className="mt-8 pt-6 border-t border-gray-200">
            <div className="bg-blue-50 rounded-lg p-4">
              <h4 className="font-semibold text-blue-900 mb-2">How AI Learning Works</h4>
              <p className="text-sm text-blue-800">
                Our AI translation system continuously learns from your feedback. When you rate translations 
                as correct or incorrect, it helps improve future translations for you and other users. 
                The more feedback you provide, the better the AI becomes at understanding context and 
                providing accurate translations.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Translation;
