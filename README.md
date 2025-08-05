# SmartResume - AI-Powered Resume Builder

A modern full-stack SaaS application that helps users create professional resumes optimized for specific job descriptions using AI.

## Features

- 🤖 **AI-Powered Optimization**: Uses Google Gemini to analyze job descriptions and enhance resume content
- 📄 **Multiple Templates**: Professional resume templates to choose from
- 📝 **Cover Letter Generation**: AI-generated cover letters tailored to job descriptions
- 🔐 **Secure Authentication**: Replit Auth integration with session management
- 📊 **Match Scoring**: Shows how well your resume matches job requirements
- 📱 **Responsive Design**: Works perfectly on desktop and mobile
- 💾 **PDF Export**: Generate professional PDF resumes
- ☁️ **Cloud Storage**: Your resumes are saved securely in the cloud

## Tech Stack

### Frontend
- **React** with TypeScript
- **Tailwind CSS** for styling
- **shadcn/ui** components
- **React Hook Form** with Zod validation
- **TanStack Query** for state management
- **Wouter** for routing
- **Vite** for build tooling

### Backend
- **Express.js** with TypeScript
- **PostgreSQL** with Drizzle ORM
- **Replit Auth** for authentication
- **Google Gemini AI** for content generation
- **Custom PDF generation** using HTML/CSS

## Getting Started

### Prerequisites
- Node.js 18+
- PostgreSQL database
- Google AI API key
- Replit account (for auth)

### Environment Variables
```
DATABASE_URL=your_postgresql_connection_string
GOOGLE_API_KEY=your_google_ai_api_key
SESSION_SECRET=your_session_secret
REPL_ID=your_repl_id
REPLIT_DOMAINS=your_replit_domains
ISSUER_URL=https://replit.com/oidc
```

### Installation

1. Clone the repository:
```bash
git clone https://github.com/Jamali28/smartresume.git
cd smartresume
```

2. Install dependencies:
```bash
npm install
```

3. Set up your environment variables in `.env`

4. Push database schema:
```bash
npm run db:push
```

5. Start the development server:
```bash
npm run dev
```

The app will be available at `http://localhost:5000`

## Project Structure

```
├── client/src/           # React frontend
│   ├── components/       # Reusable UI components
│   ├── pages/           # Application pages
│   ├── hooks/           # Custom React hooks
│   └── lib/             # Utility functions
├── server/              # Express backend
│   ├── services/        # AI and PDF services
│   └── routes.ts        # API routes
├── shared/              # Shared types and schemas
└── database/            # Database schema and migrations
```

## API Endpoints

- `GET /api/auth/user` - Get current user
- `GET /api/login` - Initiate login flow
- `GET /api/logout` - Logout user
- `GET /api/resumes` - Get user's resumes
- `POST /api/resumes` - Create new resume
- `POST /api/resumes/:id/optimize` - AI optimize resume
- `POST /api/resumes/:id/pdf` - Generate PDF
- `POST /api/cover-letters` - Generate cover letter

## Features in Detail

### AI Resume Optimization
The app analyzes job descriptions and automatically:
- Enhances skill descriptions
- Adds relevant keywords
- Improves experience bullet points
- Suggests missing skills
- Provides match scoring

### Template System
Choose from multiple professional templates:
- Modern Clean
- Classic Professional
- Creative Design
- ATS-Optimized

### PDF Generation
High-quality PDF export with:
- Professional formatting
- Consistent styling
- Print-ready output
- Multiple template layouts

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if needed
5. Submit a pull request

## License

MIT License - see LICENSE file for details

## Support

For support or questions, please open an issue on GitHub.

---

Built with ❤️ using modern web technologies