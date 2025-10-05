const { pipeline } = require('@xenova/transformers');
const Complaint = require('../models/Complaint');

class DuplicateDetectionService {
  constructor() {
    this.model = null;
    this.initialized = false;
  }

  async initialize() {
    if (this.initialized) return;
    
    try {
      console.log('Initializing sentence transformer model...');
      this.model = await pipeline('feature-extraction', 'Xenova/all-MiniLM-L6-v2');
      this.initialized = true;
      console.log('Sentence transformer model loaded successfully');
    } catch (error) {
      console.error('Error initializing sentence transformer:', error);
      throw error;
    }
  }

  async generateEmbedding(text) {
    if (!this.initialized) {
      await this.initialize();
    }

    try {
      const result = await this.model(text, { pooling: 'mean', normalize: true });
      return Array.from(result.data);
    } catch (error) {
      console.error('Error generating embedding:', error);
      throw error;
    }
  }

  calculateCosineSimilarity(embedding1, embedding2) {
    if (embedding1.length !== embedding2.length) {
      throw new Error('Embeddings must have the same length');
    }

    let dotProduct = 0;
    let norm1 = 0;
    let norm2 = 0;

    for (let i = 0; i < embedding1.length; i++) {
      dotProduct += embedding1[i] * embedding2[i];
      norm1 += embedding1[i] * embedding1[i];
      norm2 += embedding2[i] * embedding2[i];
    }

    norm1 = Math.sqrt(norm1);
    norm2 = Math.sqrt(norm2);

    if (norm1 === 0 || norm2 === 0) {
      return 0;
    }

    return dotProduct / (norm1 * norm2);
  }

  async findSimilarComplaints(newComplaint, threshold = 0.8) {
    try {
      // Generate embedding for the new complaint
      const complaintText = `${newComplaint.title} ${newComplaint.description}`.toLowerCase();
      const newEmbedding = await this.generateEmbedding(complaintText);

      // Get all existing complaints from the same category
      const existingComplaints = await Complaint.find({
        category: newComplaint.category,
        status: { $in: ['open', 'in-progress'] }
      }).select('_id title description createdAt');

      const similarComplaints = [];

      for (const existingComplaint of existingComplaints) {
        const existingText = `${existingComplaint.title} ${existingComplaint.description}`.toLowerCase();
        const existingEmbedding = await this.generateEmbedding(existingText);
        
        const similarity = this.calculateCosineSimilarity(newEmbedding, existingEmbedding);
        
        if (similarity >= threshold) {
          similarComplaints.push({
            complaint: existingComplaint,
            similarity: similarity
          });
        }
      }

      // Sort by similarity (highest first)
      similarComplaints.sort((a, b) => b.similarity - a.similarity);

      return similarComplaints;
    } catch (error) {
      console.error('Error finding similar complaints:', error);
      throw error;
    }
  }

  async checkForDuplicates(newComplaint, threshold = 0.8) {
    try {
      const similarComplaints = await this.findSimilarComplaints(newComplaint, threshold);
      
      if (similarComplaints.length > 0) {
        return {
          isDuplicate: true,
          similarComplaints: similarComplaints,
          highestSimilarity: similarComplaints[0].similarity
        };
      }

      return {
        isDuplicate: false,
        similarComplaints: [],
        highestSimilarity: 0
      };
    } catch (error) {
      console.error('Error checking for duplicates:', error);
      throw error;
    }
  }

}

module.exports = new DuplicateDetectionService();
