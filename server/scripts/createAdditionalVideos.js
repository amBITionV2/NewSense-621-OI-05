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

// Additional sample videos in different languages and for different audiences
const additionalVideos = [
  {
    title: "नागरिक जिम्मेदारी - हिंदी में",
    description: "समुदाय के लिए अपनी जिम्मेदारी को समझें और सक्रिय नागरिक बनें।",
    content: `# नागरिक जिम्मेदारी

## परिचय
एक जिम्मेदार नागरिक होना हमारा कर्तव्य है। आइए सीखते हैं कि कैसे अपने समुदाय में सकारात्मक योगदान दें।

## मुख्य बिंदु

### 1. मतदान का अधिकार
- सभी चुनावों में मतदान करें
- राजनीतिक मुद्दों के बारे में जानकारी रखें
- लोकतांत्रिक प्रक्रियाओं में भाग लें

### 2. समुदायिक भागीदारी
- स्थानीय समूहों में शामिल हों
- सार्वजनिक बैठकों में भाग लें
- स्वयंसेवा करें

### 3. सार्वजनिक संपत्ति का सम्मान
- सार्वजनिक स्थानों को साफ रखें
- वैंडलिज्म की रिपोर्ट करें
- सार्वजनिक सुविधाओं का सही उपयोग करें

## व्यावहारिक सुझाव
1. मतदाता पंजीकरण कराएं
2. पड़ोसी निगरानी कार्यक्रमों में शामिल हों
3. संदिग्ध गतिविधियों की रिपोर्ट करें
4. स्थानीय व्यवसायों का समर्थन करें
5. दैनिक रूप से अच्छे नागरिक बनें

## कार्रवाई का आह्वान
आज से शुरू करें! एक तरीका चुनें जिससे आप अपने समुदाय में योगदान दे सकें।`,
    category: "civic-responsibility",
    language: "hi",
    duration: 300,
    tags: ["civic-responsibility", "democracy", "community", "voting", "citizenship", "hindi"],
    learningObjectives: [
      "नागरिक भागीदारी के महत्व को समझना",
      "मतदान अधिकारों के बारे में जानना",
      "समुदाय विकास में योगदान के तरीके",
      "सार्वजनिक संपत्ति के सम्मान की पहचान",
      "नागरिक जिम्मेदारियों के बारे में जागरूकता"
    ],
    practicalTips: [
      "मतदाता पंजीकरण कराएं और सभी चुनावों में भाग लें",
      "स्थानीय समुदाय समूहों में शामिल हों",
      "सार्वजनिक स्थानों को साफ रखें",
      "स्थानीय सरकारी गतिविधियों के बारे में जानकारी रखें",
      "स्थानीय व्यवसायों का समर्थन करें"
    ],
    callToAction: "आज से शुरू करें! मतदाता पंजीकरण कराएं और स्थानीय समुदाय समूह में शामिल हों।",
    generationMethod: "gemini-veo",
    videoQuality: "hd",
    isPublished: true,
    publishedAt: new Date()
  },
  {
    title: "Children's Guide to Being Good Citizens",
    description: "A fun and engaging guide for children to learn about civic responsibility and community participation.",
    content: `# Children's Guide to Being Good Citizens

## Introduction
Hello young citizens! Let's learn how to be good citizens and help make our community a better place.

## Fun Learning Points

### 1. Being Kind and Helpful
- Help your friends and neighbors
- Share toys and books
- Be polite and respectful

### 2. Taking Care of Our Community
- Don't litter - use trash cans
- Take care of plants and trees
- Keep playgrounds clean

### 3. Learning About Our Country
- Learn about our flag and anthem
- Understand our rights and duties
- Respect our traditions

### 4. Being a Good Student
- Listen to teachers
- Help classmates
- Follow school rules

### 5. Family Responsibilities
- Help with household chores
- Respect family members
- Be responsible for your things

## Fun Activities
1. Plant a tree in your neighborhood
2. Organize a clean-up day with friends
3. Learn about local heroes
4. Create a community art project
5. Start a kindness club

## Call to Action
Be a superhero citizen! Start by helping one person today and remember - even small acts of kindness make a big difference!`,
    category: "civic-responsibility",
    language: "en",
    duration: 240,
    tags: ["civic-responsibility", "children", "education", "community", "citizenship"],
    learningObjectives: [
      "Learn about kindness and helping others",
      "Understand community care responsibilities",
      "Develop respect for country and traditions",
      "Practice good student behavior",
      "Recognize family responsibilities"
    ],
    practicalTips: [
      "Help friends and neighbors daily",
      "Keep public spaces clean",
      "Learn about your country's history",
      "Be a good student and classmate",
      "Help with family responsibilities"
    ],
    callToAction: "Be a superhero citizen! Start by helping one person today and make your community a better place!",
    generationMethod: "gemini-veo",
    videoQuality: "hd",
    isPublished: true,
    publishedAt: new Date(),
    targetAudience: "children"
  },
  {
    title: "Senior Citizens: Active Community Participation",
    description: "A comprehensive guide for senior citizens to stay active and contribute to community development.",
    content: `# Senior Citizens: Active Community Participation

## Introduction
Age is just a number! Senior citizens have valuable experience and wisdom to share with their communities.

## Key Areas of Contribution

### 1. Mentoring and Guidance
- Share life experiences with younger generations
- Provide career guidance and advice
- Support educational initiatives

### 2. Community Leadership
- Join senior citizen associations
- Participate in local governance
- Advocate for senior-friendly policies

### 3. Cultural Preservation
- Share traditional knowledge
- Teach cultural practices
- Preserve local history

### 4. Health and Wellness
- Maintain physical and mental health
- Participate in senior fitness programs
- Support health awareness campaigns

### 5. Social Engagement
- Join community groups
- Attend social events
- Build intergenerational connections

## Practical Tips
1. Join senior citizen clubs and associations
2. Volunteer at schools and community centers
3. Share your skills and knowledge
4. Stay physically and mentally active
5. Advocate for senior-friendly policies

## Call to Action
Your experience is valuable! Share your wisdom, stay active, and continue contributing to your community's growth and development.`,
    category: "community-service",
    language: "en",
    duration: 360,
    tags: ["senior-citizens", "community-service", "mentoring", "leadership", "cultural-preservation"],
    learningObjectives: [
      "Understand the value of senior citizen contributions",
      "Learn about mentoring and guidance opportunities",
      "Recognize community leadership roles",
      "Identify cultural preservation responsibilities",
      "Develop active aging strategies"
    ],
    practicalTips: [
      "Join senior citizen associations",
      "Volunteer at community organizations",
      "Share knowledge with younger generations",
      "Stay physically and mentally active",
      "Advocate for senior-friendly policies"
    ],
    callToAction: "Your experience matters! Share your wisdom and continue making a positive impact in your community.",
    generationMethod: "gemini-veo",
    videoQuality: "hd",
    isPublished: true,
    publishedAt: new Date(),
    targetAudience: "seniors"
  },
  {
    title: "தமிழில் சிவிக் உணர்வு",
    description: "சமூக பொறுப்பு மற்றும் சமூக பங்களிப்பு பற்றி தமிழில் கற்றுக்கொள்ளுங்கள்।",
    content: `# தமிழில் சிவிக் உணர்வு

## அறிமுகம்
ஒரு பொறுப்பான குடிமகனாக இருப்பது நமது கடமை. நமது சமூகத்தில் நேர்மறையான பங்களிப்பை எவ்வாறு அளிப்பது என்பதைக் கற்றுக்கொள்வோம்.

## முக்கிய கற்றல் புள்ளிகள்

### 1. வாக்களிப்பு உரிமை
- அனைத்து தேர்தல்களிலும் வாக்களிக்கவும்
- அரசியல் விவகாரங்களைப் பற்றி தகவலுடன் இருங்கள்
- ஜனநாயக செயல்முறைகளில் பங்கேற்கவும்

### 2. சமூக பங்கேற்பு
- உள்ளூர் சமூக குழுக்களில் சேரவும்
- பொது கூட்டங்களில் கலந்துகொள்ளவும்
- சமூக சேவைக்கு தன்னார்வலராக இருங்கள்

### 3. பொது சொத்துக்களை மதித்தல்
- பொது இடங்களை சுத்தமாக வைத்திருங்கள்
- சேதங்களை அதிகாரிகளிடம் புகாரளிக்கவும்
- பொது வசதிகளை பொறுப்புடன் பயன்படுத்தவும்

## நடைமுறை குறிப்புகள்
1. வாக்காளர் பதிவு செய்து அனைத்து தேர்தல்களிலும் பங்கேற்கவும்
2. உள்ளூர் சமூக குழுக்களில் சேரவும்
3. பொது இடங்களை சுத்தமாக வைத்திருங்கள்
4. உள்ளூர் அரசு செயல்பாடுகளைப் பற்றி தகவலுடன் இருங்கள்
5. உள்ளூர் வணிகங்களை ஆதரிக்கவும்

## செயலுக்கான அழைப்பு
இன்றே தொடங்குங்கள்! உங்கள் சமூகத்திற்கு பங்களிக்க ஒரு வழியை அடையாளம் காணுங்கள்.`,
    category: "civic-responsibility",
    language: "ta",
    duration: 300,
    tags: ["civic-responsibility", "tamil", "community", "democracy", "citizenship"],
    learningObjectives: [
      "சமூக பங்கேற்பின் முக்கியத்துவத்தை புரிந்துகொள்ளுதல்",
      "வாக்களிப்பு உரிமைகளைப் பற்றி அறிந்துகொள்ளுதல்",
      "சமூக வளர்ச்சியில் பங்களிப்பு வழிகளை அடையாளம் காணுதல்",
      "பொது சொத்துக்களை மதிப்பதை அறிந்துகொள்ளுதல்",
      "குடிமை பொறுப்புகளைப் பற்றி விழிப்புணர்வு"
    ],
    practicalTips: [
      "வாக்காளர் பதிவு செய்து அனைத்து தேர்தல்களிலும் பங்கேற்கவும்",
      "உள்ளூர் சமூக குழுக்களில் சேரவும்",
      "பொது இடங்களை சுத்தமாக வைத்திருங்கள்",
      "உள்ளூர் அரசு செயல்பாடுகளைப் பற்றி தகவலுடன் இருங்கள்",
      "உள்ளூர் வணிகங்களை ஆதரிக்கவும்"
    ],
    callToAction: "இன்றே தொடங்குங்கள்! வாக்காளர் பதிவு செய்து உள்ளூர் சமூக குழுவில் சேரவும்.",
    generationMethod: "gemini-veo",
    videoQuality: "hd",
    isPublished: true,
    publishedAt: new Date()
  }
];

// Function to create additional videos
const createAdditionalVideos = async () => {
  try {
    console.log('🎥 Creating additional sample videos...\n');

    // Create additional videos
    for (let i = 0; i < additionalVideos.length; i++) {
      const videoData = additionalVideos[i];
      
      const video = new EducationalVideo({
        ...videoData,
        videoUrl: `/api/videos/additional-${i + 1}/stream`,
        thumbnailUrl: `/api/videos/additional-${i + 1}/thumbnail`
      });

      await video.save();
      console.log(`✅ Created: "${video.title}" (${video.language}, ${video.category})`);
    }

    console.log('\n🎉 Additional videos created successfully!');
    console.log(`📊 Total additional videos created: ${additionalVideos.length}`);
    
    // Display summary
    console.log('\n📋 Generated additional videos:');
    additionalVideos.forEach((video, index) => {
      console.log(`   ${index + 1}. ${video.title} (${video.language}, ${video.category})`);
    });

    console.log('\n🌍 Now available in multiple languages:');
    console.log('   • English (8 videos)');
    console.log('   • Hindi (1 video)');
    console.log('   • Tamil (1 video)');
    console.log('   • Children-specific content');
    console.log('   • Senior citizen focused content');

  } catch (error) {
    console.error('❌ Error creating additional videos:', error);
  }
};

// Main execution
const main = async () => {
  try {
    await connectDB();
    await createAdditionalVideos();
    
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

module.exports = { createAdditionalVideos };
