#!/bin/bash

# SmartResume - Push to GitHub Script
# Run this script after creating your GitHub repository

echo "🚀 SmartResume - GitHub Push Script"
echo "=================================="

# Check if repository URL is provided
if [ -z "$1" ]; then
    echo "❌ Please provide your GitHub repository URL"
    echo "Usage: ./push-to-github.sh <repository-url>"
    echo "Example: ./push-to-github.sh https://github.com/Jamali28/smartresume.git"
    exit 1
fi

REPO_URL=$1

echo "📝 Setting up Git configuration..."
git config user.name "Jamali28"
git config user.email "jamali28@users.noreply.github.com"

echo "📦 Adding all files to Git..."
git add .

echo "💬 Creating initial commit..."
git commit -m "Initial commit: SmartResume AI-powered resume builder

Features:
- AI-powered resume optimization with Google Gemini
- Multiple professional templates
- Cover letter generation
- PDF export functionality
- Secure authentication with Replit Auth
- Responsive design with Tailwind CSS
- Full-stack TypeScript application"

echo "🔗 Adding remote repository..."
git remote add origin $REPO_URL

echo "⬆️ Pushing to GitHub..."
git branch -M main
git push -u origin main

echo "✅ Successfully pushed SmartResume to GitHub!"
echo "🌐 Your repository: $REPO_URL"
echo ""
echo "Next steps:"
echo "1. Set up environment variables in your deployment platform"
echo "2. Configure your database connection"
echo "3. Add your Google AI API key"
echo "4. Deploy your application"