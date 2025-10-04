const mongoose = require('mongoose');
const EducationalVideo = require('../models/EducationalVideo');
require('dotenv').config();

// Connect to MongoDB
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/citizen-complaint-system');
    console.log('MongoDB connected successfully');
  } catch (error) {
    console.error('MongoDB connection error:', error);
    process.exit(1);
  }
};

// Sample video data
const sampleVideos = [
  {
    title: "Being a Responsible Citizen",
    description: "Learn about your civic duties and how to contribute to your community effectively.",
    content: `# Being a Responsible Citizen

## Introduction
Welcome to our civic education series! Today, we'll explore what it means to be a responsible citizen and how you can make a positive impact in your community.

## Key Learning Points

### 1. Voting Rights and Democracy
- Exercise your right to vote in all elections
- Stay informed about political issues and candidates
- Participate in democratic processes

### 2. Community Involvement
- Join local community groups and organizations
- Attend town hall meetings and public forums
- Volunteer for community service projects

### 3. Respecting Public Property
- Keep public spaces clean and litter-free
- Report vandalism and damage to authorities
- Use public facilities responsibly

### 4. Following Laws and Regulations
- Obey traffic rules and regulations
- Pay taxes on time
- Respect others' rights and property

### 5. Being Informed
- Stay updated on local news and issues
- Educate yourself about government policies
- Share accurate information with others

## Practical Tips
1. Register to vote and participate in elections
2. Join neighborhood watch programs
3. Report suspicious activities to authorities
4. Support local businesses and initiatives
5. Practice good citizenship daily

## Call to Action
Start today by identifying one way you can contribute to your community. Whether it's volunteering, voting, or simply being a good neighbor, every action counts!`,
    category: "civic-responsibility",
    language: "en",
    duration: 300, // 5 minutes
    tags: ["civic-responsibility", "democracy", "community", "voting", "citizenship"],
    learningObjectives: [
      "Understand the importance of civic participation",
      "Learn about voting rights and democratic processes",
      "Identify ways to contribute to community development",
      "Recognize the value of respecting public property",
      "Develop awareness of civic responsibilities"
    ],
    practicalTips: [
      "Register to vote and participate in all elections",
      "Join local community groups and volunteer",
      "Keep public spaces clean and report issues",
      "Stay informed about local government activities",
      "Support local businesses and community initiatives"
    ],
    callToAction: "Take the first step today by registering to vote and joining a local community group. Your active participation makes our democracy stronger!",
    generationMethod: "gemini-veo",
    videoQuality: "hd",
    isPublished: true,
    publishedAt: new Date()
  },
  {
    title: "Environmental Protection for Everyone",
    description: "Discover simple ways to protect our environment and create a sustainable future for all.",
    content: `# Environmental Protection for Everyone

## Introduction
Our environment is our shared home. Let's learn how to protect it for current and future generations.

## Key Learning Points

### 1. Reduce, Reuse, Recycle
- Minimize waste by reducing consumption
- Reuse items whenever possible
- Recycle materials properly

### 2. Water Conservation
- Fix leaky taps and pipes
- Use water-saving appliances
- Collect rainwater for gardening

### 3. Energy Efficiency
- Use LED bulbs and energy-efficient appliances
- Turn off lights and electronics when not in use
- Consider renewable energy sources

### 4. Sustainable Transportation
- Walk or cycle for short distances
- Use public transportation
- Carpool when possible

### 5. Green Living
- Plant trees and maintain gardens
- Use eco-friendly products
- Support sustainable businesses

## Practical Tips
1. Carry reusable bags and water bottles
2. Compost organic waste at home
3. Use public transport or carpool
4. Plant native trees and plants
5. Support local environmental initiatives

## Call to Action
Start your environmental journey today! Choose one eco-friendly practice and make it a daily habit. Together, we can create a greener, healthier planet!`,
    category: "environmental-awareness",
    language: "en",
    duration: 360, // 6 minutes
    tags: ["environment", "sustainability", "recycling", "conservation", "green-living"],
    learningObjectives: [
      "Understand the importance of environmental protection",
      "Learn practical ways to reduce environmental impact",
      "Identify sustainable living practices",
      "Recognize the role of individual actions in conservation",
      "Develop eco-friendly habits"
    ],
    practicalTips: [
      "Use reusable bags and water bottles daily",
      "Compost organic waste at home",
      "Choose public transport or carpool",
      "Plant trees and maintain green spaces",
      "Support eco-friendly businesses"
    ],
    callToAction: "Make a commitment to protect our environment! Start with one green habit today and inspire others to join the movement.",
    generationMethod: "gemini-veo",
    videoQuality: "hd",
    isPublished: true,
    publishedAt: new Date()
  },
  {
    title: "Road Safety Rules Everyone Should Know",
    description: "Essential traffic rules and safety measures to keep yourself and others safe on the road.",
    content: `# Road Safety Rules Everyone Should Know

## Introduction
Road safety is everyone's responsibility. Let's learn the essential rules that keep us all safe.

## Key Learning Points

### 1. Traffic Signals
- Red means STOP - never proceed
- Yellow means CAUTION - prepare to stop
- Green means GO - but check for safety first

### 2. Pedestrian Safety
- Use designated crosswalks and footpaths
- Look both ways before crossing
- Make eye contact with drivers
- Avoid using phones while walking

### 3. Speed Limits
- Always follow posted speed limits
- Reduce speed in school zones and residential areas
- Adjust speed for weather conditions

### 4. Seatbelts and Helmets
- Always wear seatbelts in vehicles
- Use helmets when riding motorcycles or bicycles
- Ensure children are properly secured

### 5. Emergency Vehicles
- Pull over and stop for emergency vehicles
- Never follow emergency vehicles closely
- Give them right of way

## Practical Tips
1. Always wear your seatbelt
2. Never drive under the influence
3. Keep a safe following distance
4. Use turn signals properly
5. Stay alert and avoid distractions

## Call to Action
Commit to being a responsible road user. Follow traffic rules, respect others, and help create safer roads for everyone!`,
    category: "traffic-rules",
    language: "en",
    duration: 240, // 4 minutes
    tags: ["traffic-safety", "road-rules", "pedestrian-safety", "driving", "transport"],
    learningObjectives: [
      "Understand essential traffic rules and regulations",
      "Learn pedestrian safety measures",
      "Recognize the importance of following speed limits",
      "Identify proper use of safety equipment",
      "Develop responsible road behavior"
    ],
    practicalTips: [
      "Always wear seatbelts and helmets",
      "Follow speed limits and traffic signals",
      "Use crosswalks and footpaths",
      "Keep safe following distances",
      "Stay alert and avoid distractions"
    ],
    callToAction: "Be a responsible road user! Follow traffic rules, respect others, and help create safer roads for everyone.",
    generationMethod: "gemini-veo",
    videoQuality: "hd",
    isPublished: true,
    publishedAt: new Date()
  },
  {
    title: "Smart Waste Management at Home",
    description: "Learn effective waste segregation and management techniques for a cleaner environment.",
    content: `# Smart Waste Management at Home

## Introduction
Proper waste management starts at home. Let's learn how to handle waste responsibly.

## Key Learning Points

### 1. Waste Segregation
- Separate wet and dry waste
- Sort recyclable materials
- Keep hazardous waste separate

### 2. Composting
- Create compost from organic waste
- Use compost for gardening
- Reduce kitchen waste

### 3. Recycling
- Identify recyclable materials
- Clean items before recycling
- Support recycling programs

### 4. Reduce Waste
- Buy only what you need
- Choose products with less packaging
- Repair instead of replacing

### 5. Proper Disposal
- Use designated waste bins
- Follow local disposal guidelines
- Report illegal dumping

## Practical Tips
1. Keep separate bins for different waste types
2. Start a home composting system
3. Buy products with minimal packaging
4. Repair and reuse items when possible
5. Participate in community clean-up drives

## Call to Action
Transform your home into a waste management champion! Start segregating waste today and inspire your neighbors to do the same.`,
    category: "waste-management",
    language: "en",
    duration: 300, // 5 minutes
    tags: ["waste-management", "recycling", "composting", "sustainability", "clean-community"],
    learningObjectives: [
      "Learn proper waste segregation techniques",
      "Understand composting and recycling processes",
      "Identify ways to reduce waste generation",
      "Recognize the importance of proper disposal",
      "Develop sustainable waste management habits"
    ],
    practicalTips: [
      "Separate wet and dry waste at source",
      "Start composting organic waste",
      "Recycle paper, plastic, and metal",
      "Reduce packaging waste",
      "Participate in community clean-up"
    ],
    callToAction: "Start your waste management journey today! Segregate waste properly and help create a cleaner, healthier community.",
    generationMethod: "gemini-veo",
    videoQuality: "hd",
    isPublished: true,
    publishedAt: new Date()
  },
  {
    title: "Public Safety First",
    description: "Essential safety measures and emergency procedures to protect yourself and your community.",
    content: `# Public Safety First

## Introduction
Safety is everyone's responsibility. Let's learn how to stay safe and help others in emergencies.

## Key Learning Points

### 1. Emergency Contacts
- Know important emergency numbers
- Keep contacts updated
- Share emergency info with family

### 2. First Aid Basics
- Learn basic first aid techniques
- Keep first aid kits at home and work
- Know when to call for medical help

### 3. Fire Safety
- Install smoke detectors
- Have fire extinguishers ready
- Plan escape routes

### 4. Personal Safety
- Be aware of your surroundings
- Trust your instincts
- Report suspicious activities

### 5. Community Safety
- Join neighborhood watch programs
- Report safety hazards
- Help vulnerable community members

## Practical Tips
1. Memorize emergency contact numbers
2. Learn basic first aid and CPR
3. Install safety equipment at home
4. Stay alert in public spaces
5. Participate in community safety programs

## Call to Action
Become a safety champion in your community! Learn first aid, report hazards, and help create a safer environment for everyone.`,
    category: "public-safety",
    language: "en",
    duration: 300, // 5 minutes
    tags: ["public-safety", "emergency-response", "first-aid", "security", "preparedness"],
    learningObjectives: [
      "Learn essential emergency contact information",
      "Understand basic first aid techniques",
      "Recognize fire safety measures",
      "Develop personal safety awareness",
      "Identify community safety responsibilities"
    ],
    practicalTips: [
      "Memorize emergency numbers",
      "Learn first aid and CPR",
      "Install smoke detectors",
      "Stay alert in public spaces",
      "Join neighborhood watch"
    ],
    callToAction: "Make safety a priority! Learn first aid, report hazards, and help create a safer community for everyone.",
    generationMethod: "gemini-veo",
    videoQuality: "hd",
    isPublished: true,
    publishedAt: new Date()
  },
  {
    title: "Building Strong Communities",
    description: "Discover how community service and engagement create stronger, more connected neighborhoods.",
    content: `# Building Strong Communities

## Introduction
Strong communities are built through active participation and mutual support. Let's explore how you can contribute.

## Key Learning Points

### 1. Volunteering
- Find volunteer opportunities
- Share your skills and time
- Make a positive impact

### 2. Community Events
- Participate in local events
- Organize community activities
- Celebrate diversity together

### 3. Supporting Local Business
- Shop at local stores
- Support neighborhood services
- Promote local entrepreneurs

### 4. Mentoring and Education
- Share knowledge with others
- Support educational programs
- Help children and youth

### 5. Elderly Care
- Assist senior citizens
- Provide companionship
- Help with daily tasks

## Practical Tips
1. Join local volunteer organizations
2. Attend community meetings
3. Support local businesses
4. Mentor young people
5. Help elderly neighbors

## Call to Action
Be the change in your community! Start volunteering, support local initiatives, and help build stronger, more connected neighborhoods.`,
    category: "community-service",
    language: "en",
    duration: 360, // 6 minutes
    tags: ["community-service", "volunteering", "social-responsibility", "community-building", "civic-engagement"],
    learningObjectives: [
      "Understand the importance of community service",
      "Learn about volunteering opportunities",
      "Recognize ways to support local businesses",
      "Identify mentoring and education roles",
      "Develop community engagement skills"
    ],
    practicalTips: [
      "Join volunteer organizations",
      "Attend community meetings",
      "Support local businesses",
      "Mentor young people",
      "Help elderly neighbors"
    ],
    callToAction: "Start your community service journey today! Find volunteer opportunities and help build a stronger, more connected community.",
    generationMethod: "gemini-veo",
    videoQuality: "hd",
    isPublished: true,
    publishedAt: new Date()
  },
  {
    title: "Digital Citizenship in the Modern World",
    description: "Learn responsible online behavior and digital safety practices for the internet age.",
    content: `# Digital Citizenship in the Modern World

## Introduction
Being a good digital citizen means using technology responsibly and safely. Let's learn how to navigate the digital world.

## Key Learning Points

### 1. Online Privacy
- Protect your personal information
- Use strong passwords
- Be careful with social media

### 2. Cyberbullying Prevention
- Recognize cyberbullying
- Report inappropriate behavior
- Support victims

### 3. Digital Literacy
- Verify information before sharing
- Recognize fake news
- Use reliable sources

### 4. Responsible Social Media
- Think before you post
- Respect others online
- Use privacy settings

### 5. Online Safety
- Avoid suspicious links
- Keep software updated
- Use secure networks

## Practical Tips
1. Use strong, unique passwords
2. Verify information before sharing
3. Be respectful online
4. Protect your privacy
5. Report cyberbullying

## Call to Action
Become a responsible digital citizen! Use technology safely, respect others online, and help create a positive digital environment.`,
    category: "digital-citizenship",
    language: "en",
    duration: 300, // 5 minutes
    tags: ["digital-citizenship", "online-safety", "cyber-security", "digital-literacy", "internet-ethics"],
    learningObjectives: [
      "Understand online privacy and security",
      "Learn to prevent and report cyberbullying",
      "Develop digital literacy skills",
      "Recognize responsible social media use",
      "Practice safe internet behavior"
    ],
    practicalTips: [
      "Use strong passwords and privacy settings",
      "Verify information before sharing",
      "Be respectful and kind online",
      "Report cyberbullying and harassment",
      "Keep software and devices updated"
    ],
    callToAction: "Be a responsible digital citizen! Use technology safely and help create a positive online environment for everyone.",
    generationMethod: "gemini-veo",
    videoQuality: "hd",
    isPublished: true,
    publishedAt: new Date()
  },
  {
    title: "Community Health and Hygiene",
    description: "Essential health and hygiene practices to keep yourself and your community healthy and safe.",
    content: `# Community Health and Hygiene

## Introduction
Good health and hygiene practices protect not just you, but your entire community. Let's learn the essentials.

## Key Learning Points

### 1. Personal Hygiene
- Wash hands regularly with soap
- Maintain personal cleanliness
- Practice good oral hygiene

### 2. Public Health
- Cover mouth when coughing/sneezing
- Stay home when sick
- Get vaccinated when recommended

### 3. Mental Health
- Take care of your mental wellbeing
- Seek help when needed
- Support others' mental health

### 4. Healthy Lifestyle
- Eat nutritious food
- Exercise regularly
- Get adequate sleep

### 5. Community Health
- Support public health initiatives
- Participate in health programs
- Help vulnerable community members

## Practical Tips
1. Wash hands for at least 20 seconds
2. Cover your mouth when coughing
3. Stay home when you're sick
4. Eat a balanced diet
5. Exercise regularly

## Call to Action
Take charge of your health and help protect your community! Practice good hygiene, stay healthy, and support public health initiatives.`,
    category: "health-hygiene",
    language: "en",
    duration: 300, // 5 minutes
    tags: ["public-health", "hygiene", "disease-prevention", "mental-health", "wellness"],
    learningObjectives: [
      "Learn essential personal hygiene practices",
      "Understand public health measures",
      "Recognize mental health importance",
      "Develop healthy lifestyle habits",
      "Identify community health responsibilities"
    ],
    practicalTips: [
      "Wash hands regularly with soap",
      "Cover mouth when coughing",
      "Stay home when sick",
      "Eat nutritious food",
      "Exercise and sleep well"
    ],
    callToAction: "Protect your health and your community! Practice good hygiene, stay healthy, and support public health initiatives.",
    generationMethod: "gemini-veo",
    videoQuality: "hd",
    isPublished: true,
    publishedAt: new Date()
  }
];

// Function to create sample videos
const createSampleVideos = async () => {
  try {
    console.log('🎥 Creating sample civic sense videos...\n');

    // Clear existing sample videos
    await EducationalVideo.deleteMany({ generationMethod: 'gemini-veo' });
    console.log('🧹 Cleared existing sample videos');

    // Create new sample videos
    for (let i = 0; i < sampleVideos.length; i++) {
      const videoData = sampleVideos[i];
      
      const video = new EducationalVideo({
        ...videoData,
        videoUrl: `/api/videos/sample-${i + 1}/stream`,
        thumbnailUrl: `/api/videos/sample-${i + 1}/thumbnail`
      });

      await video.save();
      console.log(`✅ Created: "${video.title}" (${video.category})`);
    }

    console.log('\n🎉 Sample videos created successfully!');
    console.log(`📊 Total videos created: ${sampleVideos.length}`);
    
    // Display summary
    console.log('\n📋 Generated sample videos:');
    sampleVideos.forEach((video, index) => {
      console.log(`   ${index + 1}. ${video.title} (${video.category})`);
    });

    console.log('\n🚀 Videos are now available in the educational videos section!');
    console.log('💡 Users can access these AI-generated civic sense educational content.');

  } catch (error) {
    console.error('❌ Error creating sample videos:', error);
  }
};

// Main execution
const main = async () => {
  try {
    await connectDB();
    await createSampleVideos();
    
  } catch (error) {
    console.error('❌ Script execution failed:', error);
  } finally {
    await mongoose.connection.close();
    console.log('\n🔌 Database connection closed.');
    process.exit(0);
  }
};

// Run the script
if (require.main === module) {
  main();
}

module.exports = { createSampleVideos };
