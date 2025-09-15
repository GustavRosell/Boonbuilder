# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

BoonBuilder is a Hades II build creator application with a .NET 9 Web API backend and React TypeScript frontend. It allows users to create, share, and browse game builds using an interactive radial menu interface.

## Documentation-First Development Workflow

**CRITICAL**: Always use the comprehensive documentation in `@docs\` as context before making any changes:

- **Read relevant @docs\ files first** - Use documentation as authoritative source for understanding features, architecture, and decisions
- **Update documentation after changes** - Maintain consistency across API.md, CHANGELOG.md, ADR.md, CONTRIBUTING.md, and PRD.md
- **Reference documentation in decisions** - Use existing ADRs and PRD requirements to guide implementation choices
- **Maintain documentation integrity** - Ensure all documentation files remain synchronized when making changes

## Development Commands

### Backend (BoonBuilder.API)
```bash
# Development
cd BoonBuilder.API
dotnet run                    # Start API server (http://localhost:5291)
dotnet build                  # Build the API
dotnet watch run              # Hot reload during development

# Entity Framework & Database
dotnet ef database update     # Apply EF migrations
dotnet ef migrations add <Name> # Create new migration
dotnet ef database drop       # Drop database (Windows: del boonbuilder.db)
dotnet ef migrations list     # List all migrations
dotnet ef migrations script   # Generate SQL script

# Testing & Debugging
dotnet test                   # Run unit tests (if present)
dotnet build --verbosity detailed # Detailed build output for debugging
```

### Frontend (boonbuilder-frontend)
```bash
cd boonbuilder-frontend
# Development
npm start                     # Start dev server (http://localhost:3000)
npm run build                 # Build production bundle
npm test                      # Run tests
npm test -- --coverage       # Run tests with coverage

# Dependencies & Maintenance
npm install                   # Install dependencies
npm audit                     # Check for vulnerabilities
npm outdated                  # Check for outdated packages

# Tailwind CSS
npx tailwindcss -i ./src/index.css -o ./dist/output.css --watch # Watch mode
```

### Database Management
```bash
# Windows (current environment)
del "boonbuilder.db"          # Delete database to recreate with fresh data
del "BoonBuilder.API\boonbuilder.db" # Full path if needed

# Unix/Mac alternative
rm -f boonbuilder.db          # Delete database to recreate with fresh data

# Database is automatically created and seeded on API startup
# Seeding includes all gods, boons, weapons, and prerequisite relationships
```

## Project Structure

```
BoonBuilder/
├── docs/                    # Comprehensive documentation (READ FIRST)
│   ├── PRD.md              # Product requirements and user stories
│   ├── API.md              # Complete API documentation
│   ├── ADR.md              # Architectural decisions
│   ├── CONTRIBUTING.md     # Development guidelines
│   └── CHANGELOG.md        # Version history and changes
├── BoonBuilder.API/         # .NET 9 Web API backend
│   ├── Controllers/        # REST API endpoints
│   ├── Models/            # Entity models and DTOs
│   ├── Services/          # Business logic layer
│   ├── Data/              # EF Core context and seeding
│   └── Program.cs         # Main entry point
├── boonbuilder-frontend/    # React TypeScript frontend
│   ├── src/components/    # React components
│   ├── src/services/      # API client and utilities
│   ├── src/types/         # TypeScript definitions
│   └── package.json       # Dependencies and scripts
├── CLAUDE.md               # This file - development guidance
└── IMAGE_GUIDE.md          # Asset management workflow
```

## Architecture

### Backend Structure (.NET 9 Web API)
- **Program.cs**: Main entry point with EF migrations, CORS, and data seeding
- **Data/BoonBuilderContext.cs**: EF Core DbContext with complex entity relationships
- **Data/BoonSeeder.cs**: Comprehensive Hades II game data seeding (gods, boons, weapons, prerequisites)
- **Models/**: Game entities (God, Boon, DuoBoon, Weapon, WeaponAspect, Build) with proper inheritance
- **Controllers/**: RESTful API endpoints (gods, boons, weapons, builds, auth) with proper HTTP verbs
- **Services/**: Business logic layer (BoonService, BuildService) with interface abstractions

### Frontend Structure (React TypeScript)
- **components/BoonBuilder.tsx**: Main application component with sidebar navigation and state management
- **components/RadialMenu.tsx**: Interactive circular menu for weapon/boon selection with complex state flow
- **types/index.ts**: TypeScript definitions exactly matching backend models and enums
- **services/api.ts**: Axios-based API client with full CRUD operations and error handling
- **utils/boonPrerequisites.ts**: Complex prerequisite validation logic for duo/legendary boons

### Key Data Relationships
- **Gods** → **Boons** (1:Many): Each god has multiple core boons for different slots
- **DuoBoons**: Inherit from Boon, require specific prerequisite combinations
- **Weapons** → **WeaponAspects** (1:Many): Each weapon has multiple selectable aspects
- **Builds**: User-created combinations of weapon aspect + selected boons
- **BoonPrerequisites**: Complex prerequisite system for duo boons with alternative groups

### Critical Implementation Details

#### Enum Synchronization
Frontend and backend enums must match exactly:
- **BoonSlot**: Attack=1, Special=2, Cast=3, Sprint=4, Magick=6 (1-based, note Magick=6)
- **BoonType**: Core=0, Duo=1, Legendary=2, etc.

#### API Data Structure
- Boons returned from API include nested `God` object, not direct `godId`
- Use `boon.god?.godId` for filtering, not `boon.godId`
- WeaponAspects are nested within Weapon objects as `aspects[]`

#### RadialMenu State Management
- **MenuState Flow**: main → weapon → aspect (for weapons) OR main → slot → god → boon (for boons)
- **Filtering Logic**: `boons.filter(boon => boon.god?.godId === selectedGod.godId && boon.slot === selectedSlot)`
- **Type Safety**: renderRadialItem accepts union type `RadialMenuItem | God | Boon | Weapon | WeaponAspect`

#### Database Seeding
- BoonSeeder contains complete Hades II game data with proper IGN image URLs
- Prerequisite system uses AlternativeGroupId for "any boon from group" logic
- Database recreated on startup if schema changes

### Environment Configuration
- **API URL**: Frontend uses `REACT_APP_API_URL` (default: http://localhost:5291/api)
- **Database**: SQLite with automatic migrations on startup (see Database Management section)
- **CORS**: Configured for localhost:3000 (React dev server)
- **Ports**: API (5291), Frontend (3000) - configurable via appsettings.json and package.json

### Development Workflow Patterns
1. **Start backend first**: `cd BoonBuilder.API && dotnet run`
2. **Start frontend**: `cd boonbuilder-frontend && npm start`
3. **Database changes**: Create migration → Update database → Test seeding
4. **Frontend changes**: Component → Type definitions → API service updates
5. **Full rebuild**: Delete database → Restart API (auto-seeds) → Refresh frontend

### Common Development Tasks
- **Add new boon data**: Update `BoonSeeder.cs` → Delete database → Restart API
- **API changes**: Update controller → Update DTOs → Update frontend types/services
- **UI changes**: Update components → Update types if needed → Test with real data
- **Debug issues**: Check browser console, API logs, database contents

### Important Technical Notes
- **Enum Synchronization**: Backend uses 1-based enum values (BoonSlot: Attack=1, Special=2, Cast=3, Sprint=4, Magick=6)
- **API Data Structure**: God relationships in responses are nested objects (`boon.god?.godId`), not direct IDs
- **Database Seeding**: Comprehensive Hades II game data auto-loads on API startup
- **RadialMenu State**: Complex state flow supporting both weapon/aspect and slot/god/boon selection paths
- **Type Safety**: Frontend TypeScript definitions must exactly match backend models

## Troubleshooting

### Common Issues

**Database Issues:**
```bash
# Database locked or corrupted
del "BoonBuilder.API\boonbuilder.db"
cd BoonBuilder.API && dotnet run  # Will recreate and seed

# Migration failures
dotnet ef database drop
dotnet ef database update
```

**Frontend Build Issues:**
```bash
# Clear cache and reinstall
rm -rf node_modules package-lock.json
npm install

# TypeScript errors after API changes
# Check src/types/index.ts matches backend models exactly
```

**API/Frontend Connection Issues:**
- Verify API is running on http://localhost:5291
- Check CORS configuration in Program.cs
- Verify REACT_APP_API_URL environment variable

**Enum Mismatch Errors:**
- Backend enums are 1-based (Attack=1, Special=2, etc.)
- Frontend TypeScript enums must match exactly
- Check both Models/Enums.cs and src/types/index.ts

## Documentation Files

**ALWAYS read relevant @docs\ files as context before making changes:**

- **[docs/PRD.md](docs/PRD.md)**: Product requirements, user stories, and feature specifications
- **[docs/CHANGELOG.md](docs/CHANGELOG.md)**: Version history, changes, and migration notes
- **[docs/ADR.md](docs/ADR.md)**: Architectural decisions and technical rationale
- **[docs/CONTRIBUTING.md](docs/CONTRIBUTING.md)**: Development guidelines, workflows, and coding standards
- **[docs/API.md](docs/API.md)**: Complete API documentation with examples and data models
- **[IMAGE_GUIDE.md](IMAGE_GUIDE.md)**: Asset replacement workflow and image management

### Documentation Maintenance Guidelines

**CRITICAL**: Always update relevant documentation when making changes:

- **Add entries to CHANGELOG.md** for any user-facing changes or bug fixes
- **Create ADR entries** for significant technical or architectural decisions
- **Update API.md** when modifying endpoints, adding new routes, or changing data models
- **Keep PRD.md current** with feature additions, user story changes, or requirement updates
- **Update CONTRIBUTING.md** when changing development workflows, adding new tools, or modifying coding standards
- **Maintain IMAGE_GUIDE.md** when changing asset management processes or directory structures

**Workflow**: Read documentation for context → Make changes → Update documentation → Verify consistency across all affected files.

This documentation-first approach ensures comprehensive project context, facilitates onboarding, and maintains institutional knowledge for long-term development success.

## Recent Development Insights

### Pet System Implementation (September 2025)
- **Backend**: Complete Pet model with EF Core integration, following existing entity patterns
- **API**: RESTful endpoints at `/api/pets` and `/api/pets/{id}` matching controller conventions
- **Database**: Automatic seeding of 5 pets (Frinos, Gale, Hecuba, Raki, Toula) via BoonSeeder
- **Frontend**: Pet slot integration into RadialMenu with proper state management flow

### ImageWithFallback Loading Fix
- **Issue**: Boon images only appeared after page navigation due to stale component state
- **Solution**: Added useEffect to reset component state when src prop changes
- **Pattern**: Always reset loading state when external props change in image components

### LoadoutPanel Redesign
- **Expansion**: Doubled width from 320px to 640px for better boon visibility
- **Layout**: Two-column design with Main Loadout (left) and Special Boons (right)
- **Components**: Extracted LoadoutPanel and LoadoutSlot as reusable components
- **Game Authenticity**: Used provided template images for authentic Hades II styling

### Layout Organization
- **Structure**: Sidebar (left) → Loadout (center) → RadialMenu (right)
- **Slot Ordering**: Weapon → Pet → Attack → Special → Cast → Sprint → Magicka
- **Responsive**: Maintained responsive design principles while expanding loadout size

### Git Commit Strategy
- **Feature-based commits**: Separate commits for Pet system, image fixes, loadout redesign, and assets
- **Clear descriptions**: Descriptive commit messages following conventional commit format
- **Documentation updates**: Synchronized commits with documentation updates for traceability