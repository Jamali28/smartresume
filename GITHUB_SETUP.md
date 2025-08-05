# How to Push SmartResume to GitHub

Since Replit has some Git restrictions, here's how to manually push your code to GitHub:

## Option 1: Download and Push (Recommended)

### Step 1: Download Project Files
1. In Replit, click the three dots menu (⋯) next to "Files"
2. Select "Download as zip"
3. Extract the zip file on your computer

### Step 2: Set Up GitHub Repository
1. Go to https://github.com/Jamali28/smartresume
2. If the repository doesn't exist yet, create it:
   - Click "New repository"
   - Name: `smartresume`
   - Description: `AI-powered resume builder with Google Gemini integration`
   - Keep it **Public** or **Private** (your choice)
   - **Don't** check "Initialize with README"

### Step 3: Push Code from Your Computer
Open terminal/command prompt in your downloaded folder and run:

```bash
# Initialize Git
git init

# Configure Git (replace with your email)
git config user.name "Jamali28"
git config user.email "your-email@example.com"

# Add all files
git add .

# Create initial commit
git commit -m "Initial commit: SmartResume AI-powered resume builder

Features:
- AI-powered resume optimization with Google Gemini
- Multiple professional templates  
- Cover letter generation
- PDF export functionality
- Secure authentication with Replit Auth
- Responsive design with Tailwind CSS
- Full-stack TypeScript application"

# Add remote repository
git remote add origin https://github.com/Jamali28/smartresume.git

# Push to GitHub
git branch -M main
git push -u origin main
```

## Option 2: Manual File Upload

If you prefer not to use Git commands:

1. Go to https://github.com/Jamali28/smartresume
2. Click "uploading an existing file"
3. Drag and drop all your project files
4. Write commit message: "Initial commit: SmartResume application"
5. Click "Commit changes"

## Important Files to Include

Make sure these key files are in your repository:

### Root Files
- `package.json` - Dependencies and scripts
- `package-lock.json` - Dependency versions
- `tsconfig.json` - TypeScript configuration
- `vite.config.ts` - Build configuration
- `tailwind.config.ts` - Styling configuration
- `drizzle.config.ts` - Database configuration
- `README.md` - Project documentation
- `.gitignore` - Files to ignore

### Frontend (`client/` folder)
- `client/src/App.tsx` - Main React app
- `client/src/pages/` - All page components
- `client/src/components/` - UI components
- `client/src/hooks/` - Custom React hooks
- `client/src/lib/` - Utility functions
- `client/index.html` - HTML template

### Backend (`server/` folder)
- `server/index.ts` - Express server
- `server/routes.ts` - API endpoints
- `server/storage.ts` - Database operations
- `server/replitAuth.ts` - Authentication
- `server/services/` - AI and PDF services

### Shared (`shared/` folder)
- `shared/schema.ts` - Database schema

## Environment Variables for Deployment

When you deploy elsewhere, you'll need these environment variables:

```env
# Database
DATABASE_URL=your_postgresql_connection_string

# AI Service
GOOGLE_API_KEY=your_google_ai_api_key

# Authentication
SESSION_SECRET=your_random_session_secret
REPL_ID=your_repl_id
REPLIT_DOMAINS=your_domains
ISSUER_URL=https://replit.com/oidc

# Environment
NODE_ENV=production
```

## Deployment Options

Once on GitHub, you can deploy to:

- **Vercel**: Connect GitHub repo, auto-deploys
- **Netlify**: Connect GitHub repo, auto-deploys  
- **Railway**: Connect GitHub repo, includes database
- **Render**: Connect GitHub repo, includes database
- **Heroku**: Connect GitHub repo, add database addon

## Next Steps After Pushing

1. ✅ Code is now in your GitHub repository
2. 🚀 Choose a deployment platform
3. 🔑 Set up environment variables
4. 🗄️ Configure PostgreSQL database
5. 🤖 Add your Google AI API key
6. 🌐 Deploy and test your application

Your SmartResume application is now ready to be deployed anywhere!