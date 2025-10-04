// Simple in-memory database for demo purposes
class MockDatabase {
  constructor() {
    this.users = [];
    this.complaints = [];
    this.translations = [];
    this.educationalVideos = [];
    this.nextId = 1;
  }

  generateId() {
    return (this.nextId++).toString();
  }

  // User operations
  createUser(userData) {
    const user = {
      _id: this.generateId(),
      ...userData,
      createdAt: new Date(),
      updatedAt: new Date()
    };
    this.users.push(user);
    return user;
  }

  findUserByEmail(email) {
    return this.users.find(user => user.email === email);
  }

  findUserById(id) {
    return this.users.find(user => user._id === id);
  }

  updateUser(id, updates) {
    const index = this.users.findIndex(user => user._id === id);
    if (index !== -1) {
      this.users[index] = { ...this.users[index], ...updates, updatedAt: new Date() };
      return this.users[index];
    }
    return null;
  }

  // Complaint operations
  createComplaint(complaintData) {
    const complaint = {
      _id: this.generateId(),
      ...complaintData,
      createdAt: new Date(),
      updatedAt: new Date(),
      status: 'open',
      updates: []
    };
    this.complaints.push(complaint);
    return complaint;
  }

  findComplaints(query = {}) {
    let filtered = [...this.complaints];
    
    if (query.user) {
      filtered = filtered.filter(c => c.user === query.user);
    }
    if (query.category) {
      filtered = filtered.filter(c => c.category === query.category);
    }
    if (query.status) {
      filtered = filtered.filter(c => c.status === query.status);
    }
    
    return filtered.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  }

  findComplaintById(id) {
    return this.complaints.find(c => c._id === id);
  }

  updateComplaint(id, updates) {
    const index = this.complaints.findIndex(c => c._id === id);
    if (index !== -1) {
      this.complaints[index] = { ...this.complaints[index], ...updates, updatedAt: new Date() };
      return this.complaints[index];
    }
    return null;
  }

  // Translation operations
  createTranslation(translationData) {
    const translation = {
      _id: this.generateId(),
      ...translationData,
      createdAt: new Date(),
      updatedAt: new Date()
    };
    this.translations.push(translation);
    return translation;
  }

  findTranslations(query = {}) {
    return this.translations.filter(t => {
      if (query.sourceLanguage && t.sourceLanguage !== query.sourceLanguage) return false;
      if (query.targetLanguage && t.targetLanguage !== query.targetLanguage) return false;
      if (query.context && t.context !== query.context) return false;
      return true;
    });
  }

  // Educational video operations
  createEducationalVideo(videoData) {
    const video = {
      _id: this.generateId(),
      ...videoData,
      createdAt: new Date(),
      updatedAt: new Date(),
      isPublished: true,
      publishedAt: new Date(),
      views: 0,
      likes: 0,
      shares: 0,
      feedback: []
    };
    this.educationalVideos.push(video);
    return video;
  }

  findEducationalVideos(query = {}) {
    let filtered = [...this.educationalVideos];
    
    if (query.category) {
      filtered = filtered.filter(v => v.category === query.category);
    }
    if (query.language) {
      filtered = filtered.filter(v => v.language === query.language);
    }
    if (query.isPublished !== undefined) {
      filtered = filtered.filter(v => v.isPublished === query.isPublished);
    }
    
    return filtered.sort((a, b) => new Date(b.publishedAt) - new Date(a.publishedAt));
  }
}

// Create a singleton instance
const mockDB = new MockDatabase();

// Create some demo data
const demoUser = mockDB.createUser({
  name: 'Demo User',
  email: 'demo@example.com',
  password: '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', // password
  phone: '1234567890',
  role: 'citizen',
  location: {
    address: '123 Demo Street',
    city: 'Demo City',
    state: 'Demo State',
    country: 'India',
    pincode: '123456'
  },
  preferences: {
    language: 'en',
    notifications: {
      email: true,
      sms: false,
      push: true
    }
  },
  isActive: true,
  lastLogin: new Date()
});

const adminUser = mockDB.createUser({
  name: 'Admin User',
  email: 'admin@example.com',
  password: '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', // password
  phone: '0987654321',
  role: 'admin',
  location: {
    address: '456 Admin Avenue',
    city: 'Admin City',
    state: 'Admin State',
    country: 'India',
    pincode: '654321'
  },
  preferences: {
    language: 'en',
    notifications: {
      email: true,
      sms: true,
      push: true
    }
  },
  isActive: true,
  lastLogin: new Date()
});

// Create some demo complaints
mockDB.createComplaint({
  user: demoUser._id,
  title: 'Pothole on Main Street',
  description: 'There is a large pothole on Main Street near the intersection that is causing traffic issues and vehicle damage.',
  category: 'potholes',
  priority: 'high',
  location: {
    address: 'Main Street, Demo City',
    coordinates: { lat: 28.6139, lng: 77.2090 },
    city: 'Demo City',
    state: 'Demo State',
    country: 'India',
    pincode: '123456'
  },
  images: [],
  videos: [],
  socialMediaPosts: []
});

mockDB.createComplaint({
  user: demoUser._id,
  title: 'Garbage Collection Issue',
  description: 'Garbage has not been collected for the past 3 days in our neighborhood.',
  category: 'garbage',
  priority: 'medium',
  location: {
    address: 'Residential Area, Demo City',
    coordinates: { lat: 28.6140, lng: 77.2091 },
    city: 'Demo City',
    state: 'Demo State',
    country: 'India',
    pincode: '123456'
  },
  images: [],
  videos: [],
  socialMediaPosts: []
});

// Create some demo educational videos
mockDB.createEducationalVideo({
  title: 'Civic Responsibility',
  description: 'Learn about your role as a responsible citizen in building a better community.',
  content: 'This video covers the basics of civic responsibility...',
  category: 'civic-responsibility',
  language: 'en',
  duration: 180,
  videoUrl: '/api/videos/demo/stream',
  thumbnailUrl: '/api/videos/demo/thumbnail',
  generatedBy: 'ai',
  tags: ['civic', 'responsibility', 'community'],
  targetAudience: 'all'
});

module.exports = mockDB;
