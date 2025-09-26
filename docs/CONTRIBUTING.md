# Contributing to BoonBuilder

Thank you for your interest in contributing to BoonBuilder! This guide will help you get started with development, understand our processes, and make meaningful contributions to the project.

## Table of Contents
- [Getting Started](#getting-started)
- [Development Environment](#development-environment)
- [Project Structure](#project-structure)
- [Development Workflow](#development-workflow)
- [Coding Standards](#coding-standards)
- [Testing Guidelines](#testing-guidelines)
- [Database Management](#database-management)
- [Asset Contributions](#asset-contributions)
- [Submitting Changes](#submitting-changes)
- [Release Process](#release-process)

## Getting Started

### Prerequisites
- Node.js 18+ with npm
- .NET 9 SDK
- Git
- Code editor (VS Code recommended)

### Initial Setup
1. **Clone the repository**
   ```bash
   git clone https://github.com/your-username/boonbuilder.git
   cd boonbuilder
   ```

2. **Backend Setup**
   ```bash
   cd BoonBuilder.API
   dotnet restore
   dotnet build
   dotnet run  # Starts on http://localhost:5291
   ```

3. **Frontend Setup**
   ```bash
   cd boonbuilder-frontend
   npm install
   npm start   # Starts on http://localhost:3000
   ```

4. **Verify Installation**
   - Backend: Visit http://localhost:5291/api/gods
   - Frontend: Visit http://localhost:3000
   - Both should load successfully

## Development Environment

### Recommended VS Code Extensions
- C# Dev Kit
- ESLint
- Prettier
- TypeScript and JavaScript Language Features
- Tailwind CSS IntelliSense
- REST Client (for API testing)

### Environment Configuration
Create `.env.local` in `boonbuilder-frontend/`:
```
REACT_APP_API_URL=http://localhost:5291/api
```

### Database Management
- Development uses SQLite (`boonbuilder.db`)
- Production uses PostgreSQL (Railway)
- Database auto-created and seeded on API startup
- Reset database: `rm boonbuilder.db` then restart API

### Railway Deployment
For detailed Railway deployment instructions, see [RAILWAY.md](RAILWAY.md).

**Quick Deploy Steps:**
1. **API Service:** Connect to GitHub, set root to project root
2. **Frontend Service:** Connect to GitHub, set root to `boonbuilder-frontend/`
3. **PostgreSQL Service:** Add PostgreSQL service and link to API
4. **Environment Variables:**
   - Frontend: `REACT_APP_API_URL=https://your-api.railway.app/api`
   - API: Automatically configured with DATABASE_URL

**Common Issues:**
- "Dockerfile does not exist": Check `dockerfilePath` in `railway.toml`
- npm build fails: Ensure Dockerfile uses `npm ci` (not `--only=production`)
- Service sleeps: Set `sleepApplication = false` in `railway.toml`

## Project Structure

```
BoonBuilder/
├── docs/                      # Documentation
├── BoonBuilder.API/          # .NET Web API
│   ├── Controllers/          # API endpoints
│   ├── Data/                 # EF Context and seeding
│   ├── Models/               # Data models
│   ├── Services/             # Business logic
│   └── Migrations/           # EF migrations
├── boonbuilder-frontend/     # React TypeScript app
│   ├── src/
│   │   ├── components/       # React components
│   │   ├── services/         # API clients
│   │   ├── types/            # TypeScript definitions
│   │   └── utils/            # Helper functions
│   └── public/
│       └── images/           # Static assets
└── IMAGE_GUIDE.md           # Asset replacement guide
```

## Development Workflow

### Branching Strategy
- `main`: Production-ready code
- `develop`: Integration branch for features
- `feature/description`: New features
- `fix/description`: Bug fixes
- `docs/description`: Documentation updates

### Commit Message Format
Follow conventional commits:
```
type(scope): description

feat(frontend): add boon filtering by god
fix(api): resolve prerequisite validation bug
docs(contributing): update development setup
style(ui): improve radial menu spacing
refactor(backend): simplify prerequisite logic
test(api): add boon prerequisite test cases
```

Types: `feat`, `fix`, `docs`, `style`, `refactor`, `test`, `chore`

### Development Process
1. Create feature branch from `develop`
2. Make changes following coding standards
3. Test changes thoroughly
4. Update relevant documentation
5. Submit pull request to `develop`
6. Address code review feedback
7. Squash and merge when approved

## Coding Standards

### Backend (.NET)
- Follow Microsoft C# coding conventions
- Use PascalCase for public members
- Use camelCase for private/internal members
- Include XML documentation for public APIs
- Keep methods under 50 lines when possible

**Example:**
```csharp
/// <summary>
/// Validates boon prerequisites for the given selection
/// </summary>
/// <param name="boonId">Target boon to validate</param>
/// <param name="selectedBoonIds">Currently selected boons</param>
/// <returns>True if prerequisites are met</returns>
public async Task<bool> ValidateBoonPrerequisitesAsync(int boonId, IList<int> selectedBoonIds)
{
    // Implementation...
}
```

### Frontend (React/TypeScript)
- Use functional components with hooks
- Prefer TypeScript interfaces over types
- Follow React naming conventions (PascalCase for components)
- Use descriptive prop names
- Keep components under 200 lines

**Example:**
```typescript
interface BoonCardProps {
  boon: Boon;
  isSelected: boolean;
  isAvailable: boolean;
  onSelect: (boonId: number) => void;
}

export const BoonCard: React.FC<BoonCardProps> = ({
  boon,
  isSelected,
  isAvailable,
  onSelect
}) => {
  // Component implementation...
};
```

### CSS/Styling
- Use Tailwind CSS utility classes
- Create custom classes only for complex patterns
- Follow mobile-first responsive design
- Maintain consistent spacing (4px increments)

## Testing Guidelines

### Backend Testing
```bash
cd BoonBuilder.API
dotnet test
```

**Test Categories:**
- Unit tests for business logic
- Integration tests for API endpoints
- Database tests with in-memory provider

**Example Test:**
```csharp
[Fact]
public async Task ValidateBoonPrerequisites_WithValidSelection_ReturnsTrue()
{
    // Arrange
    var service = new BoonService(mockContext);
    var selectedBoons = new List<int> { 1, 6 }; // Aphrodite + Apollo

    // Act
    var result = await service.ValidateBoonPrerequisitesAsync(107, selectedBoons);

    // Assert
    Assert.True(result);
}
```

### Frontend Testing
```bash
cd boonbuilder-frontend
npm test
```

**Test Categories:**
- Component rendering tests
- User interaction tests
- API integration tests
- Utility function tests

**Example Test:**
```typescript
test('renders boon card with correct information', () => {
  const mockBoon = { boonId: 1, name: 'Flutter Strike', /* ... */ };

  render(<BoonCard boon={mockBoon} isSelected={false} isAvailable={true} onSelect={jest.fn()} />);

  expect(screen.getByText('Flutter Strike')).toBeInTheDocument();
});
```

### Test Coverage Goals
- Backend: >80% code coverage
- Frontend: >70% code coverage
- Critical paths: 100% coverage

## Database Management

### Schema Changes
1. Modify models in `Models/` directory
2. Generate migration:
   ```bash
   dotnet ef migrations add DescriptiveName
   ```
3. Review generated migration files
4. Test migration on fresh database
5. Update seed data if necessary

### Adding Game Data
1. Update `Data/BoonSeeder.cs`
2. Follow existing patterns for data structure
3. Test with fresh database creation
4. Verify data integrity and relationships

### Prerequisites System
When adding new duo/legendary boons:
```csharp
// Add to GetAllPrerequisites() method
prerequisites.Add(new BoonPrerequisite
{
    BoonId = 999,                    // New boon ID
    RequiredBoonId = 1,              // Required boon
    IsAlternative = true,            // Part of OR group
    AlternativeGroupId = 10          // Group alternatives
});
```

## Asset Contributions

### Image Assets
Follow the [IMAGE_GUIDE.md](../IMAGE_GUIDE.md) for detailed instructions:

1. **Format Requirements:**
   - WebP format preferred
   - Square aspect ratio (1:1)
   - Minimum 64x64px, maximum 512x512px
   - Optimized file size

2. **Naming Conventions:**
   ```
   /public/images/gods/{god_name}.webp
   /public/images/boons/core/{boon_name}.webp
   /public/images/boons/duo/{boon_name}.webp
   /public/images/boons/legendary/{boon_name}.webp
   /public/images/weapons/{weapon_name}.webp
   ```

3. **Attribution:**
   - Document source in commit message
   - Ensure proper licensing/fair use
   - Credit original creators when applicable

### Asset Quality Standards
- High contrast for visibility
- Consistent lighting and color temperature
- Remove backgrounds where appropriate
- Optimize for both light and dark themes

## Submitting Changes

### Pull Request Process
1. **Before Creating PR:**
   - Ensure all tests pass
   - Update documentation
   - Add entry to CHANGELOG.md
   - Verify no merge conflicts

2. **PR Description Template:**
   ```markdown
   ## Description
   Brief summary of changes and motivation.

   ## Type of Change
   - [ ] Bug fix
   - [ ] New feature
   - [ ] Breaking change
   - [ ] Documentation update

   ## Testing
   Describe testing performed and results.

   ## Screenshots
   Include screenshots for UI changes.

   ## Checklist
   - [ ] Code follows project style guidelines
   - [ ] Self-review completed
   - [ ] Documentation updated
   - [ ] Tests added/updated
   - [ ] CHANGELOG.md updated
   ```

3. **Review Process:**
   - Automated checks must pass
   - At least one code review required
   - Address all feedback before merge
   - Squash commits when merging

### Code Review Guidelines

**For Authors:**
- Keep PRs focused and reasonably sized
- Provide clear description and context
- Test changes thoroughly before submitting
- Respond promptly to review feedback

**For Reviewers:**
- Check for code correctness and style
- Verify tests cover new functionality
- Consider performance and security implications
- Provide constructive, specific feedback
- Approve when satisfied with changes

## Release Process

### Version Numbering
Follow semantic versioning (SemVer):
- `MAJOR.MINOR.PATCH`
- Major: Breaking changes
- Minor: New features, backwards compatible
- Patch: Bug fixes, backwards compatible

### Release Checklist
1. **Prepare Release:**
   - Update version numbers
   - Finalize CHANGELOG.md
   - Test full application functionality
   - Verify database migrations

2. **Create Release:**
   - Tag release in git
   - Create GitHub release
   - Deploy to staging environment
   - Perform smoke tests

3. **Post-Release:**
   - Monitor for issues
   - Update documentation
   - Communicate changes to users

## Communication

### Getting Help
- **Questions:** Create GitHub Discussion
- **Bug Reports:** Create GitHub Issue with template
- **Feature Requests:** Create GitHub Issue with template
- **Security Issues:** Contact maintainers directly

### Issue Templates
Use provided templates for:
- Bug reports (include reproduction steps)
- Feature requests (include use case)
- Documentation improvements
- Performance issues

### Community Guidelines
- Be respectful and inclusive
- Provide helpful, constructive feedback
- Focus on the code, not the person
- Welcome newcomers and help them learn

## Development Tips

### Performance Considerations
- Database queries: Use eager loading for related data
- Frontend: Implement proper memoization for expensive calculations
- Images: Optimize asset sizes and formats
- API: Consider pagination for large datasets

### Common Pitfalls
- **Enum Synchronization:** Keep frontend/backend enums aligned
- **Database Relationships:** Use proper navigation properties
- **State Management:** Avoid unnecessary re-renders
- **Error Handling:** Provide meaningful error messages

### Debugging Tools
- Backend: Use Visual Studio debugging or `dotnet watch`
- Frontend: React DevTools, browser developer tools
- Database: DB Browser for SQLite
- API: Postman or REST Client extension

---

Thank you for contributing to BoonBuilder! Your efforts help make the tool better for the entire Hades II community.