# Overview

CarTunez is a modern car customization and styling company website built with a full-stack architecture. The application provides a comprehensive platform for customers to explore car customization services, view galleries of completed work, use interactive tools to visualize modifications, and request quotes through contact forms. The website features a sleek, automotive-themed design with dynamic components and smooth user interactions.

## Recent Updates (January 2025)
- Successfully implemented real-time image color modification using HTML5 Canvas
- Added interactive sliders for hue, brightness, contrast, and saturation adjustments
- Integrated quick color preset system for instant theme changes
- Implemented canvas-based image processing with downloadable results
- Enhanced customizer tool with live preview functionality

# User Preferences

Preferred communication style: Simple, everyday language.

# System Architecture

## Frontend Architecture
The client-side is built using **React 18** with **TypeScript** and **Vite** as the build tool. The application uses a component-based architecture with:

- **UI Framework**: Custom component system built on top of Radix UI primitives and styled with Tailwind CSS
- **Routing**: Wouter for lightweight client-side routing
- **State Management**: React Query (TanStack Query) for server state management
- **Form Handling**: React Hook Form with Zod validation for type-safe form schemas
- **Styling**: Tailwind CSS with a dark theme and custom design tokens

## Component Structure
The application follows a modular component structure:
- **UI Components**: Reusable components in `@/components/ui/` following shadcn/ui patterns
- **Feature Components**: Business-specific components like `HeroSection`, `CustomizerTool`, `GallerySection`
- **Layout Components**: Navigation, footer, and page structure components

## Backend Architecture
The server is built with **Express.js** using TypeScript and ESM modules:

- **Web Server**: Express.js with middleware for JSON parsing, CORS, and request logging
- **Development Setup**: Vite integration for development with HMR support
- **API Routes**: RESTful API endpoints for contact form submission
- **Error Handling**: Centralized error handling middleware

## Data Storage Solutions
The application uses a hybrid storage approach:

- **Database**: PostgreSQL with Drizzle ORM for type-safe database operations
- **Database Provider**: Neon Database (serverless PostgreSQL)
- **Development Storage**: In-memory storage implementation for development/testing
- **Schema Management**: Drizzle Kit for database migrations and schema management

## File Upload and Storage
File handling capabilities include:
- **Cloud Storage**: Google Cloud Storage integration
- **File Upload UI**: Uppy.js for drag-and-drop file uploads with progress tracking
- **Image Processing**: Support for before/after image comparisons and car customization previews

## Design System
The application implements a comprehensive design system:
- **Color Scheme**: Dark theme with blue/cyan accent colors and automotive styling
- **Typography**: Custom font stack with Inter, DM Sans, and Fira Code
- **Component Library**: Complete set of UI components (buttons, forms, modals, etc.)
- **Responsive Design**: Mobile-first approach with breakpoint-based layouts

## Development Tools
- **Build System**: Vite for fast development and optimized production builds
- **TypeScript**: Full type safety across client and server code
- **ESLint/Prettier**: Code quality and formatting tools
- **Path Mapping**: Absolute imports with `@/` for client code and `@shared/` for shared utilities

# External Dependencies

## Database and ORM
- **@neondatabase/serverless**: Serverless PostgreSQL database connection
- **drizzle-orm**: Type-safe SQL query builder and ORM
- **drizzle-kit**: Database migration and schema management tool

## UI and Styling
- **@radix-ui/react-***: Headless UI components for accessibility and functionality
- **tailwindcss**: Utility-first CSS framework
- **class-variance-authority**: Type-safe variant API for component styling
- **lucide-react**: Icon library for consistent iconography

## File Upload and Storage
- **@google-cloud/storage**: Google Cloud Storage client library
- **@uppy/core**, **@uppy/dashboard**, **@uppy/aws-s3**: File upload functionality
- **@uppy/react**: React integration for Uppy file upload

## Form and Data Management
- **@tanstack/react-query**: Server state management and caching
- **react-hook-form**: Performant form handling with minimal re-renders
- **@hookform/resolvers**: Form validation resolvers
- **zod**: TypeScript-first schema validation

## Development and Build Tools
- **vite**: Next-generation frontend tooling
- **@vitejs/plugin-react**: React support for Vite
- **typescript**: Type safety and developer experience
- **wouter**: Lightweight router for React applications

## Replit Integration
- **@replit/vite-plugin-cartographer**: Replit-specific development tools
- **@replit/vite-plugin-runtime-error-modal**: Enhanced error reporting for development