const mongoose = require('mongoose');

const volunteerTaskSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    required: true
  },
  category: {
    type: String,
    enum: ['community_service', 'education', 'healthcare', 'environment', 'disaster_relief', 'social_work', 'other'],
    required: true
  },
  priority: {
    type: String,
    enum: ['low', 'medium', 'high', 'urgent'],
    default: 'medium'
  },
  status: {
    type: String,
    enum: ['open', 'assigned', 'in_progress', 'completed', 'cancelled'],
    default: 'open'
  },
  // Location details
  location: {
    address: {
      type: String,
      required: true
    },
    city: String,
    state: String,
    pincode: String,
    coordinates: {
      latitude: Number,
      longitude: Number
    }
  },
  // Task requirements
  requiredSkills: [{
    type: String,
    trim: true
  }],
  requiredExperience: {
    type: String,
    enum: ['beginner', 'intermediate', 'advanced', 'expert'],
    default: 'beginner'
  },
  maxVolunteers: {
    type: Number,
    default: 1
  },
  currentVolunteers: {
    type: Number,
    default: 0
  },
  // Time requirements
  estimatedDuration: {
    hours: {
      type: Number,
      required: true
    },
    unit: {
      type: String,
      enum: ['hours', 'days', 'weeks'],
      default: 'hours'
    }
  },
  deadline: {
    type: Date,
    required: true
  },
  startDate: {
    type: Date,
    required: true
  },
  endDate: Date,
  // Assignment details
  assignedVolunteers: [{
    volunteerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Volunteer',
      required: true
    },
    assignedDate: {
      type: Date,
      default: Date.now
    },
    status: {
      type: String,
      enum: ['assigned', 'in_progress', 'completed', 'cancelled'],
      default: 'assigned'
    },
    completedDate: Date,
    feedback: String,
    rating: {
      type: Number,
      min: 1,
      max: 5
    },
    hoursWorked: {
      type: Number,
      default: 0
    }
  }],
  // Admin details
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Admin',
    required: true
  },
  assignedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Admin'
  },
  // Task details
  instructions: String,
  resources: [{
    name: String,
    url: String,
    type: {
      type: String,
      enum: ['document', 'video', 'link', 'other']
    }
  }],
  // Feedback and completion
  completionNotes: String,
  adminFeedback: String,
  isCompleted: {
    type: Boolean,
    default: false
  },
  completionDate: Date,
  // System fields
  isActive: {
    type: Boolean,
    default: true
  },
  tags: [{
    type: String,
    trim: true
  }]
}, {
  timestamps: true
});

// Update current volunteers count
volunteerTaskSchema.methods.updateVolunteerCount = function() {
  this.currentVolunteers = this.assignedVolunteers.filter(
    volunteer => volunteer.status !== 'cancelled'
  ).length;
  return this.save();
};

// Check if task is full
volunteerTaskSchema.methods.isFull = function() {
  return this.currentVolunteers >= this.maxVolunteers;
};

// Add volunteer to task
volunteerTaskSchema.methods.addVolunteer = function(volunteerId) {
  if (this.isFull()) {
    throw new Error('Task is already full');
  }
  
  const existingAssignment = this.assignedVolunteers.find(
    assignment => assignment.volunteerId.toString() === volunteerId.toString()
  );
  
  if (existingAssignment) {
    throw new Error('Volunteer is already assigned to this task');
  }
  
  this.assignedVolunteers.push({
    volunteerId,
    assignedDate: new Date(),
    status: 'assigned'
  });
  
  return this.updateVolunteerCount();
};

// Remove volunteer from task
volunteerTaskSchema.methods.removeVolunteer = function(volunteerId) {
  this.assignedVolunteers = this.assignedVolunteers.filter(
    assignment => assignment.volunteerId.toString() !== volunteerId.toString()
  );
  
  return this.updateVolunteerCount();
};

// Complete task
volunteerTaskSchema.methods.completeTask = function(completionNotes) {
  this.status = 'completed';
  this.isCompleted = true;
  this.completionDate = new Date();
  this.completionNotes = completionNotes;
  
  // Mark all volunteer assignments as completed
  this.assignedVolunteers.forEach(assignment => {
    if (assignment.status === 'in_progress') {
      assignment.status = 'completed';
      assignment.completedDate = new Date();
    }
  });
  
  return this.save();
};

module.exports = mongoose.model('VolunteerTask', volunteerTaskSchema);
