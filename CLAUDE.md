# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

BoonBuilder is a Hades II build creator application with a .NET 9 Web API backend and React TypeScript frontend. It allows users to create, share, and browse game builds using an interactive radial menu interface.

## Development Commands

### Backend (BoonBuilder.API)
```bash
cd BoonBuilder.API
dotnet run                    # Start API server (http://localhost:5291)
dotnet build                  # Build the API
dotnet ef database update     # Apply EF migrations
dotnet ef migrations add <Name> # Create new migration
```

### Frontend (boonbuilder-frontend)
```bash
cd boonbuilder-frontend
npm start                     # Start dev server (http://localhost:3000)
npm run build                 # Build production bundle
npm test                      # Run tests
```

### Database Management
```bash
rm -f boonbuilder.db          # Delete database to recreate with fresh data
# Database is automatically created and seeded on API startup
```

## Architecture

### Backend Structure
- **Program.cs**: Main entry point with EF migrations and data seeding
- **Data/BoonBuilderContext.cs**: EF Core DbContext with complex relationships
- **Data/BoonSeeder.cs**: Comprehensive game data seeding (gods, boons, weapons, prerequisites)
- **Models/**: Game entities (God, Boon, DuoBoon, Weapon, WeaponAspect, Build)
- **Controllers/**: RESTful API endpoints for gods, boons, weapons, builds, auth
- **Services/**: Business logic layer (BoonService, BuildService)

### Frontend Structure
- **components/BoonBuilder.tsx**: Main application component with sidebar navigation
- **components/RadialMenu.tsx**: Interactive circular menu for selecting weapons/boons
- **types/index.ts**: TypeScript definitions matching backend models
- **services/api.ts**: Axios-based API client with full CRUD operations

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
- **Database**: SQLite with automatic migrations on startup
- **CORS**: Configured for localhost:3000 (React dev server)

### Important Notes
- Backend uses 1-based enum values, frontend must match
- God relationships in API responses are nested objects, not IDs
- Database automatically seeds comprehensive game data on startup
- RadialMenu supports both weapon/aspect and boon selection workflows