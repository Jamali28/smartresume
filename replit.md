# Overview

SmartResume is a modern AI-powered resume builder application that helps users create professional resumes optimized for specific job descriptions. The application leverages GPT-4 to analyze job postings and automatically enhance resume content to better match employer requirements. It features a multi-step resume creation process, multiple professional templates, PDF export capabilities, and cover letter generation functionality.

# User Preferences

Preferred communication style: Simple, everyday language.

# System Architecture

## Frontend Architecture
The client is built using React with TypeScript and follows a modern component-based architecture:

- **React Router**: Uses Wouter for lightweight client-side routing
- **State Management**: TanStack Query for server state management and caching
- **Form Handling**: React Hook Form with Zod validation for type-safe form management
- **UI Framework**: Radix UI primitives with shadcn/ui components for consistent, accessible design
- **Styling**: Tailwind CSS with CSS variables for theming and responsive design
- **Build Tool**: Vite for fast development and optimized production builds

The frontend follows a page-based structure with components organized into reusable UI elements, custom hooks, and utility functions.

## Backend Architecture
The server uses Express.js with TypeScript in a RESTful API pattern:

- **Framework**: Express.js with middleware for JSON parsing, logging, and error handling
- **Database ORM**: Drizzle ORM with type-safe schema definitions
- **Authentication**: Replit Auth integration with OpenID Connect and session management
- **API Design**: RESTful endpoints with proper HTTP status codes and error handling
- **File Structure**: Modular organization with separate files for routes, database, and services

## Data Storage Solutions
The application uses PostgreSQL as the primary database with Drizzle ORM:

- **Database**: PostgreSQL (Neon serverless) with connection pooling
- **Schema Management**: Drizzle Kit for migrations and schema changes
- **Session Storage**: PostgreSQL-backed session store for authentication persistence
- **Data Models**: Strongly typed schemas for users, resumes, and cover letters with JSON fields for flexible content storage

## Authentication and Authorization
Authentication is handled through Replit's integrated auth system:

- **Provider**: Replit OpenID Connect (OIDC) authentication
- **Session Management**: Express-session with PostgreSQL store
- **Authorization**: Middleware-based protection for authenticated routes
- **User Management**: Automatic user creation and profile synchronization

## External Service Integrations

### AI Integration
- **OpenAI GPT-4**: Core AI service for resume optimization and cover letter generation
- **Use Cases**: Job description analysis, content enhancement, match scoring, and personalized recommendations

### PDF Generation
- **Custom HTML/CSS Engine**: Server-side PDF generation using HTML templates
- **Templates**: Multiple professional resume layouts with consistent styling

### Development Tools
- **Replit Platform**: Integrated development environment with automatic deployment
- **Vite Plugins**: Development enhancements including error overlays and hot module replacement

## Key Design Patterns

### Data Flow
The application follows a unidirectional data flow pattern:
1. User input through React Hook Form
2. Client-side validation with Zod schemas
3. API requests via TanStack Query
4. Server-side processing and database operations
5. Response caching and UI updates

### Error Handling
Comprehensive error handling across all layers:
- Client-side form validation and user feedback
- API error responses with meaningful messages
- Database transaction management
- Graceful fallbacks for AI service failures

### Security Considerations
- CSRF protection through session-based authentication
- Input validation and sanitization
- Secure cookie configuration
- Database query parameterization via Drizzle ORM

### Performance Optimizations
- React Query caching for reduced API calls
- Lazy loading of components and routes
- Optimized bundle splitting with Vite
- Database connection pooling