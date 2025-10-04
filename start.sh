#!/bin/bash
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
