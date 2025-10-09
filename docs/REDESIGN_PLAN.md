# BoonBuilder V2: Game-Authentic Redesign Plan

**Status**: 🔄 Active Development - Phase 2 (UI Implementation)
**Strategy**: UI-First with Parallel Development (Non-Destructive)
**Created**: 2025-10-08
**Last Major Update**: 2025-10-09
**Progress**: Phase 1 Complete, Phase 2 ~60% Complete

---

## 📋 Table of Contents
1. [Overview](#overview)
2. [Recent Progress](#recent-progress)
3. [Session History](#session-history)
4. [Architecture Changes](#architecture-changes)
5. [God Categorization System](#god-categorization-system)
6. [Core vs Non-Core Boon System](#core-vs-non-core-boon-system)
7. [UI Components](#ui-components)
8. [Implementation Phases](#implementation-phases)
9. [Data Structure Templates](#data-structure-templates)
10. [Mock Data Structure](#mock-data-structure)
11. [Backend Integration Guide](#backend-integration-guide)
12. [Progress Checklist](#progress-checklist)
13. [Technical Decisions](#technical-decisions)
14. [Immediate Next Steps](#immediate-next-steps)
15. [Rollback Strategy](#rollback-strategy)

---

## Overview

### Vision
Transform BoonBuilder to match Hades II's actual in-game UI with proper god categorization, dual radial menus for core/non-core boon selection, and a game-authentic loadout panel that mirrors the screenshot provided.

### Key Features
- **Dual Radial Menu System**: Separate menus for core boons (slot-based) and non-core boons (god-based)
- **God Categorization**: Core Gods, Non-Standard Gods, NPC Gods, Allies (22 gods total)
- **Game-Authentic Loadout**: Matches Hades II UI with greyed-out empty slots and proper boon placement
- **View Toggle**: Switch between Radial Menu and List/Grid View
- **Non-Destructive Development**: New page alongside existing Creator (can coexist or replace)

### Development Strategy
**Phase 1**: UI-first with mock data (no backend changes)
**Phase 2**: Backend model updates (while gathering real game data)
**Phase 3**: Integration and data seeding
**Phase 4**: Polish and production switch

---

## Recent Progress

### ✅ Phase 1: Documentation & Mock Data (Complete)
- ✅ Created comprehensive REDESIGN_PLAN.md
- ✅ Created `mockBoonData.ts` with god categorization system
- ✅ Defined data structure templates for backend integration
- ✅ Established 22-god system (9 Core, 3 Non-Standard, 4 NPC, 6 Allies)

### 🔄 Phase 2: UI Implementation (~60% Complete)

**Completed Components:**
- ✅ **BoonBuilderV2.tsx**: Main container with three-column layout
  - Loadout Panel (left) | Radial Menu/List (center) | Details + Controls (right)
  - God categorization in radial menu (Core, Non-Standard, NPC, Allies)
  - Sample non-core boons display
  - Duo and legendary boon sections with availability tracking

- ✅ **BuildControlsPanel.tsx**: Build metadata and actions
  - Build name and description (300 character limit)
  - Favorites toggle
  - Tier selection (S/A/B/C/D)
  - Difficulty selection (Easy/Medium/Hard/Expert)
  - Save build button
  - Quick stats display

- ✅ **BoonDetailsPanel.tsx**: Interactive boon information display
  - Hover-based boon preview
  - **Pin/Highlight System** (Major Feature):
    - Click any boon to pin it
    - Purple glow visual feedback on pinned boons
    - Hover temporarily overrides pinned display
    - Return to pinned boon when hover ends
    - "Clear Selection" button (always at bottom)
  - Comprehensive boon information (description, effect, status, element)
  - Duo/Legendary collaboration display

- ✅ **AvailableSpecialBoonsIndicator.tsx**: Duo/Legendary availability alerts
  - Expandable notification panel
  - Shows eligible duo and legendary boons
  - Visual indicators for prerequisite fulfillment

- ✅ **ImageWithFallback.tsx**: Robust image loading component
  - 1-second timeout to prevent infinite loading
  - Fallback chain: .webp → .png → .svg → icon
  - Proper positioning with flexbox layout
  - Loading spinner with smooth transitions

**In Progress / Pending:**
- 🔲 **LoadoutPanelV2**: Needs game-authentic styling refactor
  - Current: Basic two-column layout
  - Needed: Hades II screenshot-accurate styling with greyed-out empty slots

- 🔲 **DualRadialMenu System**: Separate radial menus for core vs non-core
  - Current: Single radial menu with god categories
  - Needed: Side-by-side or tabbed core/non-core radial interface

- 🔲 **ViewToggle Component**: Switch between radial and list views
  - Needed: Toggle button above selection area
  - List view for grid-based boon browsing

### 🔲 Phase 3-8: Not Started
- Backend model updates
- Data gathering and seeding
- Backend integration
- Polish and testing
- Production deployment

---

## Session History

### October 9, 2025: Pin/Highlight System & UX Polish

**Major Feature: Boon Pin/Highlight Functionality**
- Implemented click-to-pin system for all boon types (core, non-core, duo, legendary)
- Added purple glow visual feedback (`bg-purple-600/30, border-purple-500/70, shadow-lg`)
- Hover temporarily shows different boon, returns to pinned when hover ends
- "Clear Selection" button in BoonDetailsPanel (always visible at bottom)
- Updated `isPinned` logic: `!!pinnedBoon && (!hoveredBoon || (hoveredBoon.boonId === pinnedBoon.boonId))`

**BuildControlsPanel Improvements:**
- Character limit increase: 180 → 300 characters
- Description textarea expanded: 3 rows → 6 rows
- Centered labels using flexbox layout
- Character counter moved to top-right with color warning (yellow at 300)
- Removed redundant "Build description" label

**UI Refinements:**
- Replaced "Boon Selection" text with boon logo image (`/images/Other/boon_logo.webp`)
- Completely removed scrollbar while maintaining scroll functionality
  - Applied to all scrollable areas via `index.css`
  - Uses `scrollbar-width: none` and `::-webkit-scrollbar { width: 0 }`

**ImageWithFallback Fixes:**
- Reduced timeout from 3 seconds → 1 second for better hover responsiveness
- Fixed positioning issues with loading spinner
- Outer container properly inherits sizing classes
- Loading overlay uses `absolute inset-0` without className inheritance
- Relative spinner size (`w-1/3 h-1/3`) with max constraints

**TypeScript Type Fixes:**
- Updated `hoveredBoon` state type: `Boon | null` → `Boon | AvailableBoon | null`
- Resolved type mismatch errors when hovering over duo/legendary boons

**BoonDetailsPanel Layout:**
- Restructured with flexbox for pinned bottom button
- Scrollable content area with fixed "Clear Selection" button at bottom
- Button always visible regardless of content length

---

## Architecture Changes

### Current Architecture
```
Creator Page:
- Single Radial Menu (main → slot → god → boon)
- LoadoutPanel shows: Weapon + Familiar + Core Boons
- Separate sections for Duo/Legendary boons
- Available boons shown in grid on right side
```

### New Architecture (V2)
```
BoonBuilder V2 Page:
- Dual Radial Menu System:
  1. Core Boons Radial: main → slot → core gods → core boons
  2. Non-Core Boons Radial: main → god category → god → non-core boons
- Game-Authentic Loadout Panel:
  - Left Column: Weapon + Familiar + Core Slots (greyed when empty)
  - Right Column: Non-Core Boons Pool + Duo/Legendary sections
- Toggle Switch: Radial ↔ List View
```

---

## God Categorization System

### GodType Enum (Backend)
```csharp
public enum GodType
{
    CoreGods = 1,        // Standard Olympians
    NonStandardGods = 2, // Chaos, Hermes, Selene
    NPCGods = 3,         // Artemis, Athena, Dionysus, Hades
    Allies = 4           // Arachne, Narcissus, Echo, Medea, Circe, Icarus
}
```

### God Distribution (22 Total)

#### 1. Core Gods / Olympians (9)
- **Aphrodite**: Weak, Charmed | Air + Water
- **Apollo**: Daze, Double Attack chance | Air + Fire
- **Ares**: Wounds, damage boost | Fire
- **Demeter**: Freeze, Gust, health restoration | Earth + Water
- **Hephaestus**: Glow, Blast, Armor | Earth + Fire
- **Hera**: Hitch, rarity boost, family boons | Earth + Aether
- **Hestia**: Scorch (DoT), projectile protection | Fire
- **Poseidon**: Knockback, Froth, Splash | Water + Aether
- **Zeus**: Blitz, Bolt, Chain-Lightning | Air + Aether

#### 2. Non-Standard Gods (3)
- **Chaos**: Variety of bonuses after debuff period
- **Hermes**: Mobility, speed, evasion, wealth
- **Selene**: Hex boons (activated via Magick)

#### 3. NPC Gods (4)
- **Artemis**: Critical Hits, Marked status (appears in Erebus, Oceanus, Ephyra)
- **Athena**: Deflect effects, defense (Mount Olympus with Gorgon Amulet)
- **Dionysus**: Hangover, Festive Fog, survivability (Mount Olympus)
- **Hades**: Advantages against Chronos (Tartarus)

#### 4. Allies (6)
- **Arachne**: Armor and temporary boons (Erebus)
- **Narcissus**: Supplies, rare resources, Death Defiance (Oceanus)
- **Echo**: Duplicates rewards and resources (Fields of Mourning)
- **Medea**: Curse-based boons, damage over time (Ephyra)
- **Circe**: Witchcraft, transformation, Arcana activation (Rift of Thessaly)
- **Icarus**: Armor, Power increase, supplies (Thessaly/Olympus)

---

## Core vs Non-Core Boon System

### Slot Name Mapping (Game-Accurate)
```typescript
// Display names (UI)
Attack → "Strike"
Special → "Flourish"
Cast → "Ring"
Sprint → "Rush"
Magick → "Gain"

// Enum values remain unchanged (backend compatibility)
BoonSlot.Attack = 1
BoonSlot.Special = 2
BoonSlot.Cast = 3
BoonSlot.Sprint = 4
BoonSlot.Magick = 6
```

### Core Boons (Slot-Based)
- **Definition**: Boons that occupy one of the 5 core slots (Attack/Special/Cast/Sprint/Magick)
- **Type**: `BoonType.Core = 1`
- **Selection Flow**: Slot → God → Boon
- **Visual**: Greyed-out slot template when empty, replaced by boon icon when selected
- **Gods**: Only Core Gods (Olympians) can provide core boons

### Non-Core Boons (Passive/Special)
- **Definition**: Boons that don't occupy core slots (passive effects, enhancements, utilities)
- **Types**:
  - `BoonType.Chaos = 4` (Chaos boons)
  - `BoonType.Hex = 6` (Selene Magick-activated)
  - `BoonType.Godsent = 7` (NPC/Ally boons)
  - `BoonType.Infusion = 5` (Elemental infusions)
- **Selection Flow**: God Category → God → Boon
- **Visual**: Displayed in separate pool/list area, not tied to slots
- **Gods**: All god types can provide non-core boons

### Duo & Legendary Boons
- **Unchanged**: Still require prerequisites from core boons
- **Display**: Shown in separate section below non-core pool
- **Availability**: Dynamically calculated based on selected core boons

---

## UI Components

### 1. BoonBuilderV2.tsx (Main Container)
**Purpose**: Top-level component managing state and layout
**State**:
```typescript
interface BuildStateV2 {
  weapon?: Weapon;
  aspect?: WeaponAspect;
  familiar?: Familiar;
  familiarAbility?: FamiliarAbility;
  coreBoons: Map<BoonSlot, Boon>;      // Slot-based core boons
  nonCoreBoons: Boon[];                 // Array of non-core boons
  duoBoons: AvailableBoon[];
  legendaryBoons: AvailableBoon[];
  name: string;
  description: string;
}
```

**Layout**:
```
┌─────────────┬──────────────────────┬──────────────────────┐
│   Sidebar   │   Loadout Panel      │   Dual Radial Menus  │
│   (Reused)  │   (Game-Authentic)   │   (Core + Non-Core)  │
└─────────────┴──────────────────────┴──────────────────────┘
```

### 2. LoadoutPanelV2.tsx (Game-Authentic Display)
**Purpose**: Display current build matching Hades II screenshot

**Layout**:
```
┌─────────────────────┬────────────────────────┐
│   MAIN LOADOUT      │   NON-CORE POOL        │
│                     │                        │
│   [Weapon Icon]     │   ┌──────────────────┐ │
│   Weapon Name       │   │ Non-Core Boons   │ │
│                     │   │ [icon] [icon]    │ │
│   [Familiar Icon]   │   │ [icon] [icon]    │ │
│   Familiar Name     │   │ ...              │ │
│                     │   └──────────────────┘ │
│   ┌───────────────┐ │                        │
│   │ CORE BOONS    │ │   ┌──────────────────┐ │
│   │               │ │   │ DUO BOONS        │ │
│   │ [Attack]      │ │   │ [icon] [icon]    │ │
│   │ [Special]     │ │   └──────────────────┘ │
│   │ [Cast]        │ │                        │
│   │ [Sprint]      │ │   ┌──────────────────┐ │
│   │ [Magick]      │ │   │ LEGENDARY BOONS  │ │
│   │               │ │   │ [icon] [icon]    │ │
│   └───────────────┘ │   └──────────────────┘ │
└─────────────────────┴────────────────────────┘
```

**Key Features**:
- Empty slots show greyed-out template images
- Selected boons replace templates with actual icon
- Non-core boons displayed separately from core slots
- Matches provided Hades II screenshot exactly

### 3. DualRadialMenu.tsx (New Component)
**Purpose**: Side-by-side radial menus for different selection flows

**Structure**:
```typescript
interface DualRadialMenuProps {
  // Core Radial (Left)
  coreMenuActive: boolean;
  onSelectCoreBoon: (boon: Boon, slot: BoonSlot) => void;

  // Non-Core Radial (Right)
  nonCoreMenuActive: boolean;
  onSelectNonCoreBoon: (boon: Boon) => void;

  // Shared props
  gods: GodWithType[];
  boons: Boon[];
  // ... other props
}
```

**Visual Layout**:
```
┌────────────────────┬────────────────────┐
│   CORE RADIAL      │   NON-CORE RADIAL  │
│                    │                    │
│   [Radial Menu]    │   [Radial Menu]    │
│   for slot-based   │   for god-based    │
│   selection        │   selection        │
└────────────────────┴────────────────────┘
```

### 4. CoreBoonRadial.tsx (Left Radial)
**Purpose**: Select core boons via slot → god → boon flow

**Menu States**:
```typescript
type CoreMenuState = 'main' | 'slot_selection' | 'god_selection' | 'boon_selection';
```

**Flow**:
1. **Main**: Show 5 core slots (Attack, Special, Cast, Sprint, Magick)
2. **Slot Selected**: Show Core Gods (9 Olympians)
3. **God Selected**: Show core boons for selected god + slot
4. **Boon Selected**: Add to build, return to main

### 5. NonCoreBoonRadial.tsx (Right Radial)
**Purpose**: Select non-core boons via category → god → boon flow

**Menu States**:
```typescript
type NonCoreMenuState = 'main' | 'category_selection' | 'god_selection' | 'boon_selection';
```

**Flow**:
1. **Main**: Show 4 god categories (Core, NonStandard, NPC, Allies)
2. **Category Selected**: Show gods in that category
3. **God Selected**: Show non-core boons for selected god
4. **Boon Selected**: Add to non-core pool, return to main

### 6. ViewToggle.tsx (New Component)
**Purpose**: Toggle between Radial and List views

**States**:
```typescript
type ViewMode = 'radial' | 'list';
```

**Behavior**:
- **Radial Mode**: Show dual radial menus
- **List Mode**: Show grid/list of all boons (similar to current Available Boons grid)
- Toggle button placed above the radial/list area

---

## Implementation Phases

### ✅ Phase 1: Documentation & Mock Data (In Progress)
**Goal**: Create planning documents and placeholder data for UI development
**Tasks**:
- [x] Create `docs/REDESIGN_PLAN.md` (this file)
- [ ] Create `mockBoonData.ts` with 22 gods and sample boons
- [ ] Create `mockBoonDataTemplates.ts` for user to fill real game data
- [ ] Document slot name mappings and GodType enum

**No Backend Changes Required**

---

### 🔲 Phase 2: UI Implementation with Mock Data
**Goal**: Build complete UI with placeholder data (no backend dependency)
**Tasks**:
- [ ] Create `BoonBuilderV2.tsx` main container
- [ ] Create `LoadoutPanelV2.tsx` matching game screenshot
- [ ] Create `DualRadialMenu.tsx` wrapper component
- [ ] Create `CoreBoonRadial.tsx` for slot-based selection
- [ ] Create `NonCoreBoonRadial.tsx` for god-based selection
- [ ] Create `ViewToggle.tsx` for view switching
- [ ] Add new route to sidebar navigation (`/boon-builder-v2`)
- [ ] Test all UI flows with mock data

**Deliverable**: Fully functional UI prototype using placeholder data

---

### 🔲 Phase 3: Backend Model Updates
**Goal**: Update database schema to support god categorization
**Tasks**:
- [ ] Add `GodType` enum to `Models/Enums.cs`
- [ ] Update `God.cs` model with `GodType` property
- [ ] Create EF migration: `dotnet ef migrations add AddGodTypeToGods`
- [ ] Apply migration: `dotnet ef database update`
- [ ] Update `BoonSeeder.cs` to assign `CoreGods` to existing 9 gods
- [ ] Update `GodsController.cs` to return `GodType` in API responses
- [ ] Update frontend `types/index.ts` to include `GodType` enum

**Deliverable**: Database schema supports god categorization

---

### 🔲 Phase 4: Data Gathering (User-Led)
**Goal**: Collect complete Hades II game data for 13 new gods
**Tasks**:
- [ ] Gather data for 3 Non-Standard Gods (Chaos, Hermes, Selene)
- [ ] Gather data for 4 NPC Gods (Artemis, Athena, Dionysus, Hades)
- [ ] Gather data for 6 Allies (Arachne, Narcissus, Echo, Medea, Circe, Icarus)
- [ ] List all non-core boons for each god (with full properties)
- [ ] Collect icon URLs for all new gods and boons
- [ ] Verify status effects and elemental alignments

**Reference**: See "Data Structure Templates" section below for required format

---

### 🔲 Phase 5: Backend Data Seeding
**Goal**: Seed database with real game data
**Tasks**:
- [ ] Update `BoonSeeder.cs` with 13 new gods (using gathered data)
- [ ] Add non-core boon seeding methods
- [ ] Seed Chaos boons (`BoonType.Chaos`)
- [ ] Seed Hex boons (`BoonType.Hex`)
- [ ] Seed Godsent boons (`BoonType.Godsent`)
- [ ] Seed Infusion boons for all gods
- [ ] Delete database and restart API to apply seeding
- [ ] Verify data via API endpoints

**Deliverable**: Database contains all 22 gods and complete boon data

---

### 🔲 Phase 6: Backend Integration
**Goal**: Connect UI to real API instead of mock data
**Tasks**:
- [ ] Update `services/api.ts` to handle god categories
- [ ] Replace mock data imports with API calls in `BoonBuilderV2.tsx`
- [ ] Filter gods by `GodType` for radial menu categories
- [ ] Update boon filtering to distinguish core vs non-core
- [ ] Test prerequisite system with new boon types
- [ ] Verify duo/legendary availability calculations

**Deliverable**: Fully functional app with real game data

---

### 🔲 Phase 7: Polish & Testing
**Goal**: Refine UX and prepare for production
**Tasks**:
- [ ] Add loading states for API calls
- [ ] Implement error handling and fallbacks
- [ ] Polish animations and transitions
- [ ] Add tooltips and help text
- [ ] Test all god categories and boon selections
- [ ] Verify slot name mappings display correctly
- [ ] Mobile responsiveness check
- [ ] Cross-browser testing

**Deliverable**: Production-ready BoonBuilder V2

---

### 🔲 Phase 8: Production Switch
**Goal**: Deploy V2 as primary experience
**Options**:
1. **Replace Creator**: Update route `/creator` to use `BoonBuilderV2`
2. **Coexist**: Keep both pages (rename old to "Classic Creator")
3. **Toggle**: Add setting to switch between V1/V2

**Tasks**:
- [ ] Choose deployment strategy
- [ ] Update navigation accordingly
- [ ] Archive or remove old Creator page
- [ ] Update documentation (CLAUDE.md, API.md, etc.)

---

## Data Structure Templates

### Template 1: New God Entry (For BoonSeeder.cs)
```csharp
new God
{
    GodId = [NEXT_ID],
    Name = "[God Name]",
    IconUrl = "/images/gods/[god_name]/[god_name]_logo.png",
    InfusionIconUrl = "/images/gods/[god_name]/infusion/[infusion_name].webp",
    PrimaryElement = ElementType.[Element],
    SecondaryElement = ElementType.[Element] | null,
    StatusEffect = "[Status Effect Name]",
    Description = "[Brief description]",
    GodType = GodType.[CoreGods|NonStandardGods|NPCGods|Allies]
}
```

**Example - Chaos**:
```csharp
new God
{
    GodId = 10,
    Name = "Chaos",
    IconUrl = "/images/gods/chaos/chaos_logo.png",
    InfusionIconUrl = null, // Chaos might not have infusions
    PrimaryElement = null, // Chaos is elementless
    SecondaryElement = null,
    StatusEffect = "None",
    Description = "Primordial entity offering power through trials",
    GodType = GodType.NonStandardGods
}
```

### Template 2: Non-Core Boon Entry
```csharp
new Boon
{
    BoonId = [NEXT_ID],
    Name = "[Boon Name]",
    Type = BoonType.[Chaos|Hex|Godsent|Infusion],
    GodId = [God ID],
    Slot = null, // Non-core boons don't occupy slots
    Description = "[Full description]",
    Effect = "[Mechanical effect]",
    IconUrl = "/images/boons/[god_name]/[boon_type]/[boon_name].webp",
    Element = ElementType.[Element] | null,
    StatusEffect = "[Status if applicable]",
    IsPassive = true | false
}
```

**Example - Hermes Speed Boon**:
```csharp
new Boon
{
    BoonId = 501,
    Name = "Greatest Reflex",
    Type = BoonType.Godsent,
    GodId = 11, // Hermes
    Slot = null,
    Description = "You move significantly faster",
    Effect = "+20% Movement Speed",
    IconUrl = "/images/boons/hermes/godsent/greatest_reflex.webp",
    Element = null,
    StatusEffect = "",
    IsPassive = true
}
```

### Template 3: Mock Data God (TypeScript)
```typescript
const mockGod: GodWithType = {
  godId: 10,
  name: "Chaos",
  iconUrl: "/images/gods/chaos/chaos_logo.png",
  primaryElement: null,
  secondaryElement: null,
  statusEffect: "None",
  description: "Primordial entity offering power through trials",
  godType: GodType.NonStandardGods
};
```

---

## Mock Data Structure

### File: `boonbuilder-frontend/src/data/mockBoonData.ts`

**Purpose**: Provide placeholder data for UI development without backend dependency

**Structure**:
```typescript
// Extended enum for mock data
export enum GodType {
  CoreGods = 1,
  NonStandardGods = 2,
  NPCGods = 3,
  Allies = 4
}

export interface GodWithType extends God {
  godType: GodType;
}

// Mock gods (22 total)
export const mockGods: GodWithType[] = [
  // Core Gods (9) - Use existing + add godType
  { ...existingAphrodite, godType: GodType.CoreGods },
  // ... (8 more Olympians)

  // Non-Standard Gods (3)
  {
    godId: 10,
    name: "Chaos",
    iconUrl: "/images/slots/familiar.png", // Placeholder
    primaryElement: null,
    secondaryElement: null,
    statusEffect: "None",
    description: "Primordial entity offering power through trials",
    godType: GodType.NonStandardGods
  },
  // ... Hermes, Selene

  // NPC Gods (4)
  // ... Artemis, Athena, Dionysus, Hades

  // Allies (6)
  // ... Arachne, Narcissus, Echo, Medea, Circe, Icarus
];

// Mock non-core boons
export const mockNonCoreBoons: Boon[] = [
  {
    boonId: 500,
    name: "Chaos Boon Placeholder",
    type: BoonType.Chaos,
    godId: 10,
    slot: null,
    description: "A mysterious boon from Chaos",
    effect: "Grants power after trials",
    iconUrl: "/images/slots/attack.png", // Placeholder
    element: null,
    statusEffect: "",
    isPassive: true
  },
  // ... more placeholder boons
];

// Helper to filter by god type
export const getGodsByType = (godType: GodType): GodWithType[] => {
  return mockGods.filter(g => g.godType === godType);
};
```

---

## Backend Integration Guide

### Step 1: Update Enums (Backend)
**File**: `BoonBuilder.API/Models/Enums.cs`

```csharp
public enum GodType
{
    CoreGods = 1,
    NonStandardGods = 2,
    NPCGods = 3,
    Allies = 4
}

// Update BoonType if needed
public enum BoonType
{
    Core = 1,
    Duo = 2,
    Legendary = 3,
    Chaos = 4,
    Infusion = 5,
    Hex = 6,
    Godsent = 7
}
```

### Step 2: Update God Model (Backend)
**File**: `BoonBuilder.API/Models/God.cs`

```csharp
public class God
{
    public int GodId { get; set; }
    public string Name { get; set; } = string.Empty;
    public string IconUrl { get; set; } = string.Empty;
    public string? InfusionIconUrl { get; set; }
    public ElementType? PrimaryElement { get; set; }
    public ElementType? SecondaryElement { get; set; }
    public string StatusEffect { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;
    public GodType GodType { get; set; } // NEW PROPERTY

    // Navigation properties (unchanged)
    public ICollection<Boon> Boons { get; set; } = new List<Boon>();
    public ICollection<DuoBoon> PrimaryDuoBoons { get; set; } = new List<DuoBoon>();
    public ICollection<DuoBoon> SecondaryDuoBoons { get; set; } = new List<DuoBoon>();
}
```

### Step 3: Create Migration
```bash
cd BoonBuilder.API
dotnet ef migrations add AddGodTypeToGods
dotnet ef database update
```

### Step 4: Update BoonSeeder (Backend)
**File**: `BoonBuilder.API/Data/BoonSeeder.cs`

```csharp
private static List<God> GetGods()
{
    return new List<God>
    {
        // Update existing 9 gods with GodType
        new God {
            GodId = 1,
            Name = "Aphrodite",
            // ... existing properties ...
            GodType = GodType.CoreGods
        },
        // ... (8 more Olympians with CoreGods)

        // Add 13 new gods
        new God {
            GodId = 10,
            Name = "Chaos",
            IconUrl = "/images/gods/chaos/chaos_logo.png",
            PrimaryElement = null,
            SecondaryElement = null,
            StatusEffect = "None",
            Description = "Primordial entity offering power through trials",
            GodType = GodType.NonStandardGods
        },
        // ... (12 more new gods)
    };
}

// Add new seeding method
private static List<Boon> GetAllNonCoreBoons()
{
    return new List<Boon>
    {
        // Chaos boons
        new Boon {
            BoonId = 500,
            Name = "Strike Flourish",
            Type = BoonType.Chaos,
            GodId = 10,
            Slot = null,
            Description = "Your Strike and Flourish deal more damage but you take damage from traps",
            Effect = "+40% Attack/Special Damage, +30% Trap Damage Taken",
            IconUrl = "/images/boons/chaos/strike_flourish.webp",
            IsPassive = false
        },
        // ... more non-core boons
    };
}
```

### Step 5: Update Frontend Types
**File**: `boonbuilder-frontend/src/types/index.ts`

```typescript
export enum GodType {
  CoreGods = 1,
  NonStandardGods = 2,
  NPCGods = 3,
  Allies = 4
}

export interface God {
  godId: number;
  name: string;
  iconUrl: string;
  infusionIconUrl?: string;
  primaryElement: ElementType | null;
  secondaryElement?: ElementType | null;
  statusEffect: string;
  description: string;
  godType: GodType; // NEW PROPERTY
}
```

### Step 6: Update BuildState Interface
**File**: `boonbuilder-frontend/src/types/index.ts`

```typescript
export interface BuildState {
  weapon?: Weapon;
  aspect?: WeaponAspect;
  familiar?: Familiar;
  familiarAbility?: FamiliarAbility;
  coreBoons: Map<BoonSlot, Boon>;    // RENAMED from 'boons'
  nonCoreBoons: Boon[];              // NEW: Array of non-core boons
  duoBoons: AvailableBoon[];
  legendaryBoons: AvailableBoon[];
  name: string;
  description: string;
}
```

---

## Progress Checklist

### Phase 1: Documentation ✅ (Complete)
- [x] Create REDESIGN_PLAN.md
- [x] Create mockBoonData.ts
- [x] Create data collection templates for user

### Phase 2: UI with Mock Data 🔄 (~60% Complete)
- [x] Create BoonBuilderV2.tsx container
- [x] Create BuildControlsPanel.tsx
- [x] Create BoonDetailsPanel.tsx (with pin/highlight functionality)
- [x] Create AvailableSpecialBoonsIndicator.tsx
- [x] Implement god categorization in radial menu
- [x] Implement sample non-core boons display
- [x] Add duo/legendary availability tracking
- [ ] Refactor LoadoutPanel with game-authentic styling
- [ ] Create DualRadialMenu.tsx (separate core/non-core radials)
- [ ] Create ViewToggle.tsx (radial ↔ list)
- [ ] Add route to sidebar (currently accessible, needs nav item)
- [ ] Test all UI flows comprehensively

### Phase 3: Backend Models 🔲
- [ ] Add GodType enum to backend
- [ ] Update God model
- [ ] Create and apply migration
- [ ] Update BoonSeeder for existing gods
- [ ] Update API responses

### Phase 4: Data Gathering 🔲 (User-Led)
- [ ] Chaos god + boons
- [ ] Hermes god + boons
- [ ] Selene god + boons
- [ ] Artemis god + boons
- [ ] Athena god + boons
- [ ] Dionysus god + boons
- [ ] Hades god + boons
- [ ] Arachne ally + boons
- [ ] Narcissus ally + boons
- [ ] Echo ally + boons
- [ ] Medea ally + boons
- [ ] Circe ally + boons
- [ ] Icarus ally + boons

### Phase 5: Backend Seeding 🔲
- [ ] Seed 13 new gods
- [ ] Seed non-core boons
- [ ] Verify API responses

### Phase 6: Integration 🔲
- [ ] Replace mock data with API calls
- [ ] Test god categorization
- [ ] Test core vs non-core flows
- [ ] Verify duo/legendary prerequisites

### Phase 7: Polish 🔲
- [ ] Loading states
- [ ] Error handling
- [ ] Animations
- [ ] Testing

### Phase 8: Production 🔲
- [ ] Choose deployment strategy
- [ ] Update routes
- [ ] Update documentation

---

## Technical Decisions

### Decision 1: Parallel Development Strategy
**Rationale**: Create new `/boon-builder-v2` route instead of modifying existing Creator
**Benefits**:
- Zero risk to existing functionality
- Easy A/B comparison during development
- Can develop UI without backend changes
- Simple rollback if needed

**Implementation**: Add new sidebar item, keep both pages functional

---

### Decision 2: UI-First with Mock Data
**Rationale**: Build complete visual prototype before backend changes
**Benefits**:
- Allows user to gather data in parallel
- Frontend and backend teams can work independently
- Early visual feedback for stakeholders
- Faster iteration on UX

**Implementation**: Create `mockBoonData.ts` with placeholder data

---

### Decision 3: Dual Radial Menu System
**Rationale**: Separate radial menus for different selection flows
**Benefits**:
- Matches game's conceptual separation of core vs non-core
- Clearer UX (slot-based vs god-based)
- Reduces menu depth complexity
- Better visual organization

**Alternative Considered**: Single radial with mode toggle → Rejected (too complex)

---

### Decision 4: Slot Name Display Mapping
**Rationale**: Use game-accurate names in UI while keeping enum values
**Benefits**:
- Authentic Hades II experience
- No breaking changes to backend
- Simple display-layer mapping

**Implementation**:
```typescript
const slotDisplayNames: Record<BoonSlot, string> = {
  [BoonSlot.Attack]: "Strike",
  [BoonSlot.Special]: "Flourish",
  [BoonSlot.Cast]: "Ring",
  [BoonSlot.Sprint]: "Rush",
  [BoonSlot.Magick]: "Gain"
};
```

---

### Decision 5: God Categorization via Enum
**Rationale**: Use `GodType` enum instead of boolean flags
**Benefits**:
- Scalable (easy to add new categories)
- Type-safe filtering
- Clear semantic meaning
- Matches game's conceptual groupings

**Alternative Considered**: Boolean flags (`isCoreGod`, `isNPC`) → Rejected (not scalable)

---

### Decision 6: Separate Core vs Non-Core in BuildState
**Rationale**: Split `boons` into `coreBoons` (Map) and `nonCoreBoons` (Array)
**Benefits**:
- Clear semantic distinction
- Core boons remain slot-indexed (Map)
- Non-core boons are order-independent (Array)
- Easier filtering and display logic

**Migration Path**:
```typescript
// Old
boons: Map<BoonSlot, Boon>

// New
coreBoons: Map<BoonSlot, Boon>  // Slot-based core boons
nonCoreBoons: Boon[]             // Array of passive/special boons
```

---

## Immediate Next Steps

### 🎯 Priority 1: LoadoutPanel Refactor (Next Session)
**Goal**: Create game-authentic loadout display matching Hades II screenshot

**Tasks**:
- Refactor current basic two-column layout
- Add greyed-out empty slot templates (weapon, familiar, core boons)
- Match Hades II visual styling (borders, spacing, backgrounds)
- Implement slot hover states
- Add visual feedback for empty vs filled slots
- Ensure responsive layout for different screen sizes

**Reference**: Use provided Hades II screenshot as design specification

---

### 🎯 Priority 2: Dual Radial Menu System (Following Session)
**Goal**: Separate radial menus for core vs non-core boon selection

**Tasks**:
- Create `DualRadialMenu.tsx` wrapper component
- **Option A (Side-by-Side)**:
  - Left radial: Core boons (slot → god → boon flow)
  - Right radial: Non-core boons (category → god → boon flow)
- **Option B (Tabbed)**:
  - Single radial with tab switcher
  - "Core Boons" tab vs "Non-Core Boons" tab
- Implement state management for dual selection contexts
- Add visual indicators for which radial is active
- Test navigation flows for both radials

**Decision Point**: Side-by-side vs tabbed approach (user preference)

---

### 🎯 Priority 3: View Toggle Component
**Goal**: Switch between radial menu and list/grid view

**Tasks**:
- Create `ViewToggle.tsx` component
- Add toggle button above selection area (🔄 icon or text button)
- **Radial View**: Current radial menu system
- **List View**: Grid-based boon browsing with filters
- Persist view preference in local storage
- Smooth transition animation between views

---

### 🔧 Priority 4: Polish & UX Enhancements

**Error Handling:**
- Add error popups for invalid selections
- Validation dialogs for incomplete builds
- Connection error handling for API calls
- User-friendly error messages

**Helper System:**
- Add tooltip components for complex features
- Question mark (?) icons with explanations
- Onboarding guide for first-time users
- Keyboard shortcut hints

**Layout Optimization:**
- Compact view toggle for loadout panel
- Resize radial menu area dynamically
- Maximize radial menu space when needed
- Responsive breakpoints for different screen sizes

---

### 🔮 Future Features (Post-Phase 2)

**Keepsakes System:**
- Add keepsake selection panel
- Keepsake effects display
- Integration with build state
- Visual indicators for equipped keepsakes

**Arcana Cards:**
- Arcana card selection interface
- Passive bonus display
- Build synergy calculations
- Arcana deck builder

**Additional Enhancements:**
- Build import/export functionality
- Share build via URL
- Community build ratings
- Build comparison tool
- Build templates and presets

---

### 📅 Suggested Timeline

**Week 1 (Current):**
- ✅ Pin/highlight system (completed)
- ✅ UI polish and refinements (completed)
- 🔲 LoadoutPanel refactor

**Week 2:**
- 🔲 Dual radial menu system
- 🔲 View toggle component
- 🔲 Error handling and validation

**Week 3:**
- 🔲 Helper system and tooltips
- 🔲 Layout optimization
- 🔲 Comprehensive testing

**Week 4:**
- 🔲 Backend integration preparation
- 🔲 Data gathering (user-led)
- 🔲 Production readiness assessment

---

## Rollback Strategy

### If V2 Needs to be Reverted

#### Option 1: Keep Both Pages (Recommended)
1. Leave old Creator page at `/creator`
2. Keep new page at `/boon-builder-v2`
3. Let users choose preferred version
4. Gather feedback before deprecating old version

**Effort**: Minimal (just maintain two routes)

#### Option 2: Remove V2 Route
1. Remove `/boon-builder-v2` route from sidebar
2. Delete `BoonBuilderV2.tsx` and related components
3. Revert to old Creator as primary
4. Database changes persist but aren't used (no harm)

**Effort**: Low (remove route, keep old page)

#### Option 3: Full Rollback (Backend Included)
1. Revert migration: `dotnet ef migrations remove`
2. Drop `GodType` column from database
3. Remove V2 UI components
4. Revert `God` model changes

**Effort**: Medium (requires database rollback)

### Recommended Approach
- Start with **Option 1** (coexistence)
- Gather user feedback for 2-4 weeks
- Decide to deprecate old version or iterate on V2
- Only use **Option 3** if fundamental architecture issues arise

---

## Next Steps

### Immediate Actions (Completed ✅)
1. ✅ Complete this document
2. ✅ Create `mockBoonData.ts` with placeholder gods/boons
3. ✅ Create `BoonBuilderV2.tsx` with radial layout and god categorization
4. ✅ Implement BuildControlsPanel and BoonDetailsPanel
5. ✅ Add pin/highlight functionality for boons

### Current Sprint (This Week)
1. 🎯 Refactor LoadoutPanel with game-authentic Hades II styling
2. 🎯 Create DualRadialMenu system (core vs non-core)
3. 🎯 Add ViewToggle component (radial ↔ list)
4. 🎯 Implement error popups and validation dialogs
5. 🎯 Add helper tooltips and guide system

### Next Sprint (Following Week)
1. 🔲 Layout optimization and compact view toggle
2. 🔲 Comprehensive UI testing and bug fixes
3. 🔲 Wire up route in sidebar navigation
4. 🔲 Performance optimization and polish

### Phase 3: Backend Integration (Future)
1. 🔲 User gathers complete game data for 13 gods
2. 🔲 Implement backend model changes (GodType enum)
3. 🔲 Seed database with real data
4. 🔲 Connect UI to real API endpoints

### Phase 4: Production (Future)
1. 🔲 Cross-browser and device testing
2. 🔲 Production deployment
3. 🔲 Documentation updates (CLAUDE.md, API.md, CHANGELOG.md)
4. 🔲 User feedback and iteration

---

## Questions & Notes

### Open Questions
1. **Dual Radial**: Side-by-side or tabbed interface for core/non-core menus?
2. **View Toggle**: Should List view replace radial or show alongside?
3. **Migration**: Deprecate old Creator or keep both long-term?
4. **Keepsakes/Arcana**: Integration timeline and priority?

### Notes for User
- **Data Format**: Use templates in "Data Structure Templates" section
- **Images**: Verify all icon paths match your asset structure
- **Priority**: Focus on completing Phase 2 UI before backend integration
- **Testing**: Test each component thoroughly before moving to next
- **Keepsakes/Arcana**: Plan for post-Phase 2 integration

### Recent Decisions
- ✅ Pin/highlight system implemented for better UX
- ✅ Scrollbar completely hidden for cleaner aesthetic
- ✅ Character limit increased to 300 for detailed build descriptions
- ✅ Image loading timeout reduced to 1s for better responsiveness

---

**Document Version**: 2.0
**Last Updated**: 2025-10-09
**Author**: Claude Code
**Status**: Living Document (actively maintained during development)
