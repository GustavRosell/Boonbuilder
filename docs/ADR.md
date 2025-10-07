# Architecture Decision Records (ADR)

This document captures key architectural and technical decisions made during BoonBuilder development, including the context, options considered, and rationale for each choice.

---

## ADR-001: Technology Stack Selection

**Date**: September 2025
**Status**: Accepted
**Context**: Need to choose primary technology stack for rapid development of gaming tool

### Decision
- **Frontend**: React 19 with TypeScript and Tailwind CSS
- **Backend**: .NET 9 Web API with Entity Framework Core
- **Database**: SQLite (development), PostgreSQL (production ready)
- **Deployment**: Cloud-based hosting with CDN

### Rationale
- React provides excellent component ecosystem and developer experience
- TypeScript ensures type safety across complex game data models
- .NET 9 offers mature, high-performance web API capabilities
- Entity Framework simplifies database operations and migrations
- Stack combination enables rapid prototyping with production scalability

### Consequences
- Positive: Fast development velocity, strong typing, excellent tooling
- Negative: Learning curve for developers unfamiliar with .NET
- Risk: Dependency on Microsoft ecosystem for backend

---

## ADR-002: Database Design - Code First vs Database First

**Date**: September 2025
**Status**: Accepted

### Decision
Use Entity Framework Code-First approach with automatic migrations

### Context
Complex game data relationships require careful database design. Two primary approaches:
1. Database-First: Design schema, generate models
2. Code-First: Define models, generate schema

### Options Considered
- **Database-First**: Traditional approach, explicit schema control
- **Code-First**: Model-driven development, automatic migrations
- **Hybrid**: Manual schema with code models

### Decision Rationale
Code-First chosen for:
- Rapid iteration during development
- Version control friendly model definitions
- Automatic migration generation
- Better integration with .NET ecosystem
- Easier testing with in-memory databases

### Implementation Details
```csharp
// Example model definition
public class DuoBoon : Boon
{
    public int FirstGodId { get; set; }
    public int SecondGodId { get; set; }
    public God FirstGod { get; set; }
    public God SecondGod { get; set; }
}
```

### Consequences
- Positive: Fast schema changes, good developer experience
- Negative: Less direct SQL control, potential migration complexity
- Monitoring: Track migration performance and rollback procedures

---

## ADR-003: UI Pattern for Boon Selection

**Date**: September 2025
**Status**: Accepted

### Decision
Implement radial/circular menu interface for boon selection

### Context
Hades II has 9 gods with 5 boon slots each, plus weapons and aspects. Need intuitive navigation.

### Options Considered
1. **Traditional Grid/List**: Standard table or card layout
2. **Radial Menu**: Circular selection interface
3. **Tree Navigation**: Hierarchical drill-down
4. **Tabbed Interface**: Tab per god/category

### Decision Rationale
Radial menu chosen for:
- Visually distinctive and memorable
- Efficient use of screen space
- Intuitive categorization (gods around circle)
- Scales well to mobile devices
- Matches gaming aesthetic expectations

### Technical Implementation
```typescript
interface RadialMenuItem {
  id: string;
  label: string;
  icon: string;
  angle: number;
  onClick: () => void;
}
```

### Consequences
- Positive: Unique UX, efficient navigation, visually appealing
- Negative: Custom implementation complexity, accessibility challenges
- Risk: May not be familiar to all users

---

## ADR-004: Prerequisite System Design

**Date**: September 2025
**Status**: Accepted

### Decision
Implement flexible prerequisite system using AlternativeGroupId for OR relationships

### Context
Duo and legendary boons have complex prerequisite requirements:
- Some require ANY boon from a god (OR relationship)
- Others require specific boons (AND relationship)
- Some require combinations of both patterns

### Options Considered
1. **Simple Foreign Keys**: One prerequisite per boon
2. **JSON Configuration**: Store prerequisites as JSON
3. **Separate Prerequisite Table**: Dedicated prerequisite entities
4. **Graph Database**: Use graph relationships

### Decision Rationale
Separate table with AlternativeGroupId chosen for:
- Flexible OR/AND logic support
- Queryable with standard SQL
- Clear data relationships
- Extensible for future complexity
- Performance friendly for real-time validation

### Implementation Details
```csharp
public class BoonPrerequisite
{
    public int BoonId { get; set; }              // Target boon
    public int RequiredBoonId { get; set; }     // Required boon
    public bool IsAlternative { get; set; }     // Part of OR group
    public int AlternativeGroupId { get; set; } // Group OR alternatives
}
```

### Validation Logic
- Group prerequisites by AlternativeGroupId
- Each group must have at least one satisfied prerequisite
- All groups must be satisfied for boon availability

### Consequences
- Positive: Flexible, performant, clear data model
- Negative: Complex validation logic, requires careful seeding
- Future: May need optimization for very complex prerequisites

---

## ADR-005: Image Asset Management Strategy

**Date**: September 2025
**Status**: Accepted

### Decision
Manual image replacement with comprehensive documentation over automated scraping

### Context
Game assets needed for authentic user experience. Options include:
1. Automated scraping from game files or wikis
2. Manual replacement following documented process
3. Placeholder images with user-contributed assets

### Decision Rationale
Manual process chosen for:
- Legal compliance and copyright respect
- Quality control over asset selection
- Avoids scraping terms-of-service violations
- Enables proper attribution and licensing
- Provides clear audit trail for assets

### Implementation
- Created IMAGE_GUIDE.md with step-by-step process
- WebP format for optimal compression and quality
- Organized directory structure matching game categories
- Apollo boons implemented as proof-of-concept

### Consequences
- Positive: Legal compliance, high quality assets, clear process
- Negative: Time-intensive, requires manual updates
- Risk: Incomplete asset coverage during development

---

## ADR-006: State Management Approach

**Date**: September 2025
**Status**: Accepted

### Decision
React built-in state management (useState, useEffect) with prop drilling

### Context
Application needs to manage complex state including:
- Selected weapon and aspect
- Current boon selections per slot
- Available vs locked boon states
- Build metadata and validation

### Options Considered
1. **React Built-in**: useState, useContext, useReducer
2. **Redux Toolkit**: Centralized state management
3. **Zustand**: Lightweight state management
4. **React Query**: Server state + local state

### Decision Rationale
Built-in React state chosen for:
- Simplicity and minimal dependencies
- Sufficient for current application complexity
- Good performance characteristics
- Team familiarity and rapid development
- Easy debugging and testing

### Implementation Pattern
```typescript
// Central state in BoonBuilder component
const [selectedBuild, setSelectedBuild] = useState<Build>(initialBuild);
const [availableDuoBoons, setAvailableDuoBoons] = useState<DuoBoon[]>([]);

// Pass state and setters to child components
<RadialMenu
  items={currentItems}
  onItemSelect={handleItemSelect}
  selectedBuild={selectedBuild}
/>
```

### Migration Path
If complexity grows, can migrate to:
1. useContext for reducing prop drilling
2. useReducer for complex state transitions
3. External library if performance requires

### Consequences
- Positive: Simple, fast development, minimal learning curve
- Negative: Potential prop drilling, manual optimization needed
- Risk: May need refactoring if state complexity grows significantly

---

## ADR-007: API Design Principles

**Date**: September 2025
**Status**: Accepted

### Decision
RESTful API design with domain-specific endpoints

### Context
API needs to serve:
- Static game data (gods, boons, weapons)
- Dynamic user data (builds, preferences)
- Complex queries (available boons, prerequisites)

### Design Principles
1. **REST-based**: Standard HTTP methods and status codes
2. **Domain-focused**: Endpoints organized by business entities
3. **Nested resources**: Related data accessible through parent resources
4. **Query parameters**: Filtering and pagination support

### API Structure
```
GET /api/gods                    # All gods
GET /api/gods/{id}/boons        # Boons for specific god
GET /api/boons/core             # All core boons grouped by god
GET /api/boons/available        # Available boons given selections
GET /api/weapons                # All weapons with aspects
GET /api/builds                 # User builds (authenticated)
POST /api/builds                # Create new build
```

### Authentication Strategy
- JWT tokens for user authentication
- Refresh token pattern for security
- Anonymous access for public data
- User-scoped access for private builds

### Consequences
- Positive: Standard patterns, easy to understand and consume
- Negative: Multiple requests needed for complex scenarios
- Future: Consider GraphQL for complex query optimization

---

## ADR-008: Build Validation Strategy

**Date**: September 2025
**Status**: Accepted

### Decision
Real-time client-side validation with server-side verification

### Context
Build validation needs to:
- Provide immediate user feedback
- Ensure data integrity on server
- Handle complex prerequisite logic
- Support incomplete builds during creation

### Implementation Approach
1. **Client-side**: Immediate UI feedback and prevention
2. **API validation**: Server-side verification on save
3. **Database constraints**: Final data integrity layer

### Validation Rules
- Weapon and aspect selection required
- Maximum one boon per slot per build
- Prerequisite validation for duo/legendary boons
- Build name and description requirements

### Error Handling
```typescript
// Client-side validation
const validateBuild = (build: Build): ValidationResult => {
  const errors: string[] = [];

  if (!build.weaponAspectId) {
    errors.push("Weapon aspect is required");
  }

  // Additional validations...

  return { isValid: errors.length === 0, errors };
};
```

### Consequences
- Positive: Great user experience, data integrity
- Negative: Validation logic duplication, complexity
- Risk: Client/server validation drift requires monitoring

---

## ADR-009: Documentation Strategy

**Date**: September 2025
**Status**: Accepted

### Decision
Comprehensive documentation with multiple formats for different audiences

### Context
Project needs documentation for:
- Developers (current and future)
- Users and content creators
- Product stakeholders
- System administrators

### Documentation Structure
```
/docs/
├── PRD.md          # Product requirements and vision
├── CHANGELOG.md    # Version history and changes
├── ADR.md          # Architectural decisions
├── CONTRIBUTING.md # Development guidelines
└── API.md          # Complete API documentation
```

### Additional Documentation
- **CLAUDE.md**: Claude Code integration instructions
- **IMAGE_GUIDE.md**: Asset replacement workflow
- **README.md**: Quick start and overview

### Maintenance Strategy
- Update CHANGELOG.md with every release
- Create ADR entries for significant decisions
- Keep API.md synchronized with endpoint changes
- Review and update PRD.md quarterly

### Consequences
- Positive: Clear project context, easier onboarding, decision tracking
- Negative: Documentation maintenance overhead
- Risk: Documentation drift if not maintained consistently

---

## Future ADRs

Decisions that may require ADRs in the future:

- **Caching Strategy**: Client-side vs server-side vs CDN caching
- **Monitoring and Analytics**: Application performance and user behavior tracking
- **Deployment Strategy**: CI/CD pipeline, environment management
- **Security Model**: Advanced authentication, rate limiting, data protection
- **Mobile Strategy**: PWA vs native apps vs responsive optimization
- **Internationalization**: Multi-language support and localization
- **Performance Optimization**: Code splitting, lazy loading, bundle optimization

---

## ADR Template

For future architectural decisions, use this template:

```markdown
## ADR-XXX: Decision Title

**Date**: YYYY-MM-DD
**Status**: Proposed | Accepted | Deprecated | Superseded

### Context
Describe the situation and problem requiring a decision.

### Decision
State the architecture decision and overall approach.

### Options Considered
List alternative approaches that were evaluated.

### Decision Rationale
Explain why this decision was made, including trade-offs.

### Implementation Details
Technical specifics, code examples, configuration.

### Consequences
Positive and negative outcomes, risks, future considerations.
```