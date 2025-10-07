# BoonBuilder

BoonBuilder is a comprehensive Hades II build creator application that empowers players to create, optimize, and share character builds through an intuitive, game-accurate interface. Built with React TypeScript and .NET 9, it features an interactive radial menu system and complete prerequisite validation for duo and legendary boons.

## Features

- **Interactive Build Creation**: Visual radial menu for selecting weapons, aspects, and boons
- **Comprehensive Game Data**: Complete Hades II database with all gods, boons, weapons, and aspects
- **Smart Prerequisite System**: Real-time validation of duo and legendary boon requirements
- **Visual Feedback**: Clear indication of available vs locked boons with prerequisite information
- **Build Management**: Save, name, and organize multiple character builds
- **Asset Support**: High-quality WebP images with comprehensive asset management system

## Quick Start

### Prerequisites
- Node.js 18+
- .NET 9 SDK
- Git

### Development Setup

1. **Clone the repository:**
   ```bash
   git clone https://github.com/your-username/boonbuilder.git
   cd boonbuilder
   ```

2. **Start the backend:**
   ```bash
   cd BoonBuilder.API
   dotnet restore
   dotnet run  # Runs on http://localhost:5291
   ```

3. **Start the frontend:**
   ```bash
   cd boonbuilder-frontend
   npm install
   npm start   # Runs on http://localhost:3000
   ```

4. **Open your browser** to http://localhost:3000

## Documentation

Comprehensive documentation is available in the `/docs` folder:

- **[Product Requirements Document (PRD)](docs/PRD.md)** - Product vision, user stories, and feature specifications
- **[API Documentation](docs/API.md)** - Complete REST API reference with examples
- **[Architecture Decision Records (ADR)](docs/ADR.md)** - Technical decisions and rationale
- **[Contributing Guide](docs/CONTRIBUTING.md)** - Development workflows and coding standards
- **[Changelog](docs/CHANGELOG.md)** - Version history and release notes
- **[Image Guide](IMAGE_GUIDE.md)** - Asset replacement and management workflow

## Technology Stack

- **Frontend**: React 19, TypeScript, Tailwind CSS
- **Backend**: .NET 9 Web API, Entity Framework Core
- **Database**: SQLite (development), PostgreSQL (production ready)
- **Authentication**: JWT with refresh tokens
- **Assets**: WebP images with CDN support

## Architecture

BoonBuilder uses a modern full-stack architecture:

- **React Frontend**: Component-based UI with TypeScript for type safety
- **Radial Menu System**: Intuitive circular interface for game-like navigation
- **RESTful API**: Clean separation between client and server
- **Code-First Database**: Entity Framework with automatic migrations
- **Complex Prerequisites**: Flexible validation system supporting OR/AND logic

## Development

### Key Commands

```bash
# Backend
cd BoonBuilder.API
dotnet run              # Start API server
dotnet build           # Build the API
dotnet ef migrations add <Name>  # Create migration

# Frontend
cd boonbuilder-frontend
npm start              # Start dev server
npm run build          # Production build
npm test              # Run tests

# Database
rm boonbuilder.db     # Reset database (auto-recreates on startup)
```

### Project Structure

```
BoonBuilder/
├── docs/                    # Comprehensive documentation
├── BoonBuilder.API/         # .NET 9 Web API
├── boonbuilder-frontend/    # React TypeScript app
├── CLAUDE.md               # Claude Code instructions
├── IMAGE_GUIDE.md          # Asset management guide
└── README.md              # This file
```

## Contributing

We welcome contributions! Please read our [Contributing Guide](docs/CONTRIBUTING.md) for:

- Development environment setup
- Code style guidelines
- Testing requirements
- Pull request process
- Asset contribution workflow

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments

- Hades II by Supergiant Games for the incredible source material
- Community contributors for game data and asset support
- IGN and other sources for placeholder images (to be replaced following legal guidelines)

---

For detailed technical information, architecture decisions, and API documentation, please refer to the comprehensive documentation in the `/docs` folder.
