# Changelog

All notable changes to BoonBuilder will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Added
- **Pet System**: Complete implementation with 5 selectable pets (Frinos, Gale, Hecuba, Raki, Toula)
  - Backend Pet model with EF Core relationships and database integration
  - Pet API endpoints (`GET /api/pets`, `GET /api/pets/{id}`)
  - Pet selection integrated into RadialMenu navigation flow
  - Pet slot added to loadout with proper ordering: Weapon → Pet → Attack → Special → Cast → Sprint → Magicka
- **Expanded LoadoutPanel**: Redesigned with doubled width (320px → 640px) for comprehensive boon display
  - Two-column layout: Main Loadout (left) + Special Boons (right)
  - Enhanced Special Boons sections with better organization and visual hierarchy
  - Core Boons Summary showing all selected boons with god information
  - Game-authentic slot styling using provided template images
- **Game Template Assets**: Added authentic Hades II slot and pet images for visual consistency
- Enhanced prerequisite system with visual feedback for locked boons
- Grayscale effect and lock badges for unavailable duo/legendary boons
- Prerequisite status chips in current loadout display
- Comprehensive documentation structure (PRD, ADR, API docs)
- IMAGE_GUIDE.md for manual asset replacement workflow

### Changed
- **LoadoutPanel Architecture**: Extracted into reusable components (LoadoutPanel, LoadoutSlot)
- **Layout Organization**: Reorganized to Sidebar → Loadout (center) → RadialMenu (right)
- **Build Details**: Improved with side-by-side name/save button layout
- RadialMenu now shows visual distinction between available and locked boons
- BoonBuilder loadout display includes prerequisite status information
- Enhanced tooltips with prerequisite information for locked boons

### Fixed
- **Image Loading**: Fixed ImageWithFallback component to properly reset state when src prop changes
  - Resolves issue where boon images only appeared after page navigation
  - Images now load immediately when boons are selected/deselected
- Critical bug in BoonBuilder.tsx where unfiltered API response was used instead of properly filtered available boons
- Prerequisite display system now correctly shows locked vs available states

## [0.3.0] - 2025-09-15

### Added
- IMAGE_GUIDE.md with comprehensive instructions for replacing placeholder images
- Apollo boon images converted to WebP format as proof of concept
- Enhanced visual feedback system for boon availability
- Database prerequisites system with alternative group support

### Changed
- Apollo boon images updated from .svg to .webp format in BoonSeeder
- Improved prerequisite validation logic for duo and legendary boons

### Fixed
- Duo and legendary boon image paths corrected in database seeder
- Prerequisites system now properly validates boon combinations

## [0.2.0] - 2025-09-14

### Added
- Weapon selection and weapon aspect management system
- Complete weapon database with all Hades II weapons and aspects
- Weapon aspect selection in build creation workflow
- Enhanced build validation with weapon requirements

### Changed
- Expanded database schema to include weapon aspects
- Updated build model to include selected weapon aspect
- Improved build creation UX with weapon selection flow

### Fixed
- Database seeding improved with comprehensive weapon data
- Build validation now includes weapon aspect requirements

## [0.1.0] - 2025-09-10

### Added
- Initial React TypeScript frontend with Tailwind CSS
- .NET 9 Web API backend with Entity Framework Core
- SQLite database with comprehensive Hades II game data
- Core boon selection system with radial menu interface
- God and boon data seeding with IGN image URLs
- Basic build creation and management functionality
- Duo boon system with prerequisite relationships
- Legendary boon system with multi-boon requirements
- RESTful API endpoints for gods, boons, weapons, and builds
- User authentication system with JWT tokens
- Basic build sharing and management features

### Technical Implementation
- React 19 with TypeScript for type-safe frontend development
- .NET 9 Web API with Entity Framework Code-First approach
- Complex prerequisite system using AlternativeGroupId for OR relationships
- Automatic database migrations and data seeding on startup
- CORS configuration for local development environment
- Comprehensive game data matching Hades II mechanics

### Architecture Decisions
- Chose React + .NET stack for rapid development and scalability
- SQLite for development simplicity with easy migration to PostgreSQL
- Code-First Entity Framework for maintainable database schema
- Radial menu UI pattern for intuitive boon selection
- Prerequisite system design supporting complex boon relationships

---

## Versioning Strategy

BoonBuilder follows semantic versioning (SemVer):

- **MAJOR** version: Incompatible API changes or major UI overhauls
- **MINOR** version: New functionality in a backwards compatible manner
- **PATCH** version: Backwards compatible bug fixes

## Change Categories

- **Added**: New features
- **Changed**: Changes in existing functionality
- **Deprecated**: Soon-to-be removed features
- **Removed**: Now removed features
- **Fixed**: Bug fixes
- **Security**: Security-related improvements

## Migration Notes

### 0.2.0 to 0.3.0
- Database schema updated to include prerequisite relationships
- No manual migration required - automatic on startup
- Image assets may need manual replacement following IMAGE_GUIDE.md

### 0.1.0 to 0.2.0
- Database schema expanded with weapon aspects
- Automatic migration handles database updates
- Existing builds remain compatible

---

## Unreleased Features

Features currently in development or planned for upcoming releases:

- Build sharing via shareable URLs
- Advanced filtering and search functionality
- Community features (ratings, comments, galleries)
- Mobile optimization and responsive improvements
- Build analytics and recommendations
- Integration with streaming platforms
- Automated game data updates

## Known Issues

- Some duo boons may show as locked due to incomplete prerequisite data
- Image assets still using placeholder URLs for non-Apollo boons
- Mobile responsiveness needs optimization for smaller screens
- Build export functionality not yet implemented

## Contributing

See [CONTRIBUTING.md](CONTRIBUTING.md) for details on how to contribute to BoonBuilder development.

## Support

For bug reports and feature requests, please create an issue in the GitHub repository.