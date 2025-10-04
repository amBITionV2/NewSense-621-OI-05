const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

console.log('🚀 Setting up Citizen Complaint Portal...\n');

// Check if Node.js version is compatible
const nodeVersion = process.version;
const majorVersion = parseInt(nodeVersion.slice(1).split('.')[0]);

if (majorVersion < 14) {
  console.error('❌ Node.js version 14 or higher is required. Current version:', nodeVersion);
  process.exit(1);
}

console.log('✅ Node.js version check passed:', nodeVersion);

// Create necessary directories
const directories = [
  'server/uploads',
  'client/public/images',
  'logs'
];

directories.forEach(dir => {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
    console.log(`📁 Created directory: ${dir}`);
  }
});

// Create .env files if they don't exist
const envFiles = [
  {
    source: 'server/env.example',
    target: 'server/.env',
    message: '📄 Created server/.env file from template'
  },
  {
    source: null,
    target: 'client/.env',
    content: 'REACT_APP_GOOGLE_MAPS_API_KEY=your-google-maps-api-key-here\nREACT_APP_API_URL=http://localhost:5000',
    message: '📄 Created client/.env file'
  }
];

envFiles.forEach(({ source, target, content, message }) => {
  if (!fs.existsSync(target)) {
    if (source && fs.existsSync(source)) {
      fs.copyFileSync(source, target);
    } else if (content) {
      fs.writeFileSync(target, content);
    }
    console.log(message);
  }
});

// Install dependencies
console.log('\n📦 Installing dependencies...');

try {
  console.log('Installing root dependencies...');
  execSync('npm install', { stdio: 'inherit' });

  console.log('Installing server dependencies...');
  execSync('cd server && npm install', { stdio: 'inherit' });

  console.log('Installing client dependencies...');
  execSync('cd client && npm install', { stdio: 'inherit' });

  console.log('✅ All dependencies installed successfully!');
} catch (error) {
  console.error('❌ Error installing dependencies:', error.message);
  process.exit(1);
}

// Create a simple start script
const startScript = `#!/bin/bash
echo "🚀 Starting Citizen Complaint Portal..."

# Check if MongoDB is running
if ! pgrep -x "mongod" > /dev/null; then
    echo "⚠️  MongoDB is not running. Please start MongoDB before running the application."
    echo "   On macOS: brew services start mongodb-community"
    echo "   On Ubuntu: sudo systemctl start mongod"
    echo "   On Windows: Start MongoDB service from Services"
    exit 1
fi

# Start the application
npm run dev
`;

fs.writeFileSync('start.sh', startScript);
fs.chmodSync('start.sh', '755');

console.log('\n🎉 Setup completed successfully!');
console.log('\n📋 Next steps:');
console.log('1. Set up your API keys in server/.env and client/.env');
console.log('2. Start MongoDB service');
console.log('3. Run: npm run dev');
console.log('4. Open http://localhost:3000 in your browser');
console.log('\n📚 For detailed setup instructions, see README.md');
console.log('\n🔑 Required API Keys:');
console.log('- Google Maps API Key');
console.log('- OpenAI API Key');
console.log('- Twitter API Keys (optional)');
console.log('- Instagram API Keys (optional)');
console.log('- MongoDB connection string');
