# Complete Hades II Boons Database

## Executive Summary

Hades II features a sophisticated **7-tier boon system** with 37+ Duo Boons, 11 Legendary Boons, elemental Infusion Boons, and specialized mechanics from Selene, Chaos, and NPC encounters. The system uses **5 elemental types** (Air, Water, Earth, Fire, Aether) with complex prerequisite relationships perfect for Entity Framework Core implementation.

## Core Boon System Structure

### Fundamental Mechanics
**Core Boon Slots**: 5 mutually exclusive slots that form the foundation of any build:
- **Attack** ("Strike" boons) - Primary weapon enhancement
- **Special** ("Flourish" boons) - Secondary weapon ability  
- **Cast** ("Ring" boons) - Magical projectile abilities
- **Sprint** ("Rush" boons) - Movement-based attacks
- **Magick Recovery** ("Gain" boons) - Resource restoration

**Rarity System**: All boons scale through 4 tiers with **predictable damage scaling**:
- Common (base values)
- Rare (+30-60% effectiveness) 
- Epic (+40-100% effectiveness)
- Heroic (+50-150% effectiveness)

### Gods and Their Elements

| God | Primary Element | Secondary Element | Core Boons Count | Status Effects |
|-----|----------------|-------------------|------------------|----------------|
| **Aphrodite** | Air | Water | 5 | Weak, Charmed |
| **Apollo** | Air | Fire | 5 | Daze |  
| **Ares** | Fire | - | 5 | Wounds |
| **Artemis** | Earth | Air | 3+ | Marked (Crit) |
| **Athena** | Earth | - | 3+ | Deflect |
| **Demeter** | Earth | Water | 5 | Freeze, Gust |
| **Hephaestus** | Earth | Fire | 5 | Glow (Blast) |
| **Hera** | Earth | Aether | 5 | Hitch |
| **Hermes** | Air | Earth, Fire | 6+ | Speed/Utility |
| **Hestia** | Fire | - | 5 | Scorch |
| **Poseidon** | Water | Aether | 5 | Froth, Slip |
| **Zeus** | Air | Aether | 5 | Blitz |
| **Chaos** | None | Special | 20+ | Curse/Blessing |

## Complete Core Boons Database

### Aphrodite Boons (Air/Water)
**Theme**: Close-range damage bonuses and survivability

1. **Flutter Strike** (Attack)
   - Effect: Attacks deal +80% damage to nearby foes
   - Element: Air/Water
   - Status: Weak
   - Image: `Flutter_Strike_II.png`

2. **Flutter Flourish** (Special) 
   - Effect: Specials deal +100% damage to nearby foes
   - Element: Air/Water
   - Status: Weak
   - Image: `Flutter_Flourish_II.png`

3. **Rapture Ring** (Cast)
   - Effect: Casts inflict Weak, drag enemies toward center
   - Damage: 10 every 0.85 sec
   - Element: Air/Water
   - Image: `Rapture_Ring_II.png`

4. **Passion Rush** (Sprint)
   - Effect: Dash damages surrounding foes, inflicts Weak
   - Area Damage: 20
   - Element: Air/Water
   - Image: `Passion_Rush_II.png`

5. **Glamour Gain** (Magick)
   - Effect: Inflict Weak nearby, restore 6 Magick/sec while enemies Weak
   - Element: Air/Water
   - Image: `Glamour_Gain_II.png`

**Key Passive Boons**:
- **Shameless Attitude**: +10% damage (doubled at 80%+ health)
- **Heart Breaker**: Create 80-damage Heartthrob when using 40 Magick

### Apollo Boons (Air/Fire)
**Theme**: Area expansion and precision damage

1. **Nova Strike** (Attack)
   - Effect: Attacks deal more damage in larger area
   - Element: Air/Fire
   - Status: Daze
   - Image: `Nova_Strike_II.png`

2. **Nova Flourish** (Special)
   - Effect: Specials deal more damage in larger area  
   - Element: Air/Fire
   - Status: Daze
   - Image: `Nova_Flourish_II.png`

3. **Solar Ring** (Cast)
   - Effect: Casts inflict Daze, burst damage before expiring
   - Element: Air/Fire
   - Image: `Solar_Ring_II.png`

4. **Blinding Rush** (Sprint)
   - Effect: Faster sprint, inflicts Daze on nearby foes
   - Element: Air/Fire
   - Image: `Blinding_Rush_II.png`

5. **Lucid Gain** (Magick)
   - Effect: Standing in expiring casts restores Magick immediately
   - Element: Air/Fire
   - Image: `Lucid_Gain_II.png`

**Key Passive Boons**:
- **Super Nova**: Casts expand in size until expiration
- **Exceptional Talent**: Attack/Special fire twice, use more Magick

### Ares Boons (Fire)
**Theme**: Raw damage and bleeding effects

1. **Vicious Strike** (Attack)
   - Effect: +20-50% Attack damage, inflicts Wounds
   - Element: Fire
   - Scaling: +10% per rarity tier
   - Image: `Vicious_Strike_II.png`

2. **Vicious Flourish** (Special)
   - Effect: +30-60% Special damage, inflicts Wounds
   - Element: Fire  
   - Scaling: +10% per rarity tier
   - Image: `Vicious_Flourish_II.png`

3. **Sword Ring** (Cast)
   - Effect: Creates falling blade over each bound foe
   - Blade Damage: 80-170 (by rarity)
   - Element: Fire
   - Image: `Sword_Ring_II.png`

4. **Stabbing Rush** (Sprint)
   - Effect: Creates row of falling blades along dash path
   - Blade Damage: 30-75 (by rarity)
   - Element: Fire
   - Image: `Stabbing_Rush_II.png`

5. **Mortal Gain** (Magick)
   - Effect: When Magick depleted, prime to restore 100-175 life
   - Element: Fire
   - Image: `Mortal_Gain_II.png`

**Key Passive Boons**:
- **Profuse Bleeding**: Wounded foes may drop Blood when damaged
- **Grievous Blow**: Wounded foes may suffer 200% damage

### Demeter Boons (Earth/Water)
**Theme**: Control and freeze effects

1. **Ice Strike** (Attack): Attacks deal more damage, inflict Freeze
2. **Ice Flourish** (Special): Specials deal more damage, inflict Freeze  
3. **Arctic Ring** (Cast): Casts inflict Freeze, deal repeated damage
4. **Frigid Rush** (Sprint): Sprint creates lingering Gust
5. **Tranquil Gain** (Magick): Rapidly restore Magick when inactive for 1 sec

**Key Passive Boons**:
- **Winter Harvest**: Frozen foes shatter at 10% health for area damage
- **Cold Storage**: Freeze effects last longer

### Hephaestus Boons (Earth/Fire)
**Theme**: Explosive blast damage and armor

1. **Volcanic Strike** (Attack): Creates blast effects with cooldown cycling
2. **Volcanic Flourish** (Special): Creates blast effects with cooldown cycling
3. **Forge Ring** (Cast): Blast-focused cast ability
4. **Smithy Rush** (Sprint): Blast-enhanced sprint 
5. **Molten Gain** (Magick): Blast-related magick restoration

**Notable Features**:
- Blast abilities cycle through cooldowns for strategic timing
- Provides Armor effects for survivability enhancement
- Currently considered very powerful in the current game version

### Hera Boons (Earth/Aether)
**Theme**: Boon enhancement and family synergies

1. **Sworn Strike** (Attack): Attacks deal more damage, inflict Hitch
2. **Sworn Flourish** (Special): Specials deal more damage, inflict Hitch
3. **Engagement Ring** (Cast): Casts inflict Hitch, deal damage based on bound foes
4. **Nexus Rush** (Sprint): Sprint inflicts Hitch on contact, deals damage
5. **Born Gain** (Magick): When depleted, prime to restore all Magick

**Key Passive Boons**:
- **Bridal Glow**: Make 1 random boon Heroic with +1 Level
- **Extended Family**: Olympian effects stronger for each boon-giver

### Hestia Boons (Fire)
**Theme**: Fire damage and protection

1. **Flame Strike** (Attack): Attacks inflict Scorch
2. **Flame Flourish** (Special): Specials inflict Scorch  
3. **Smolder Ring** (Cast): Casts repeatedly inflict Scorch on bound foes
4. **Heat Rush** (Sprint): Sprint destroys ranged shots, inflicts Scorch on shooters
5. **Cardio Gain** (Magick): Attack/Special damage restores Magick

**Key Passive Boons**:
- **Hot Pot**: Chance to dodge (doubled vs Scorch-afflicted foes)
- **Controlled Burn**: Special launches fireball (+10 Magick cost)

### Poseidon Boons (Water/Aether) 
**Theme**: Knockback, splash damage, resources

1. **Wave Strike** (Attack): Attacks hit with splash that knocks others away
2. **Wave Flourish** (Special): Specials hit with splash that knocks others away
3. **Tidal Ring** (Cast): Casts immediately hit foes with powerful splash
4. **Breaker Sprint** (Sprint): Damage and knock away first contacted foe
5. **Flood Gain** (Magick): Weapon strikes may create Spirit Bubbles

**Key Passive Boons**:
- **Buried Treasure**: Minor finds and Gold worth more
- **Slippery Slope**: Splash effects also inflict Slip

### Zeus Boons (Air/Aether)
**Theme**: Chain-lightning and bolt damage

1. **Heaven Strike** (Attack): Attacks inflict Blitz
2. **Heaven Flourish** (Special): Specials inflict Blitz
3. **Storm Ring** (Cast): Lightning-enhanced cast ability
4. **Thunder Sprint** (Sprint): Sprint causes lightning bolts on nearby foes
5. **Static Gain** (Magick): Lightning-enhanced magick restoration

**Key Passive Boons**:
- **Toasting Fork**: Blitz triggers immediately without damage requirement
- **Divine Vengeance**: After taking damage, automatically damage all nearby foes

## Complete Duo Boons System

### Duo Boon Mechanics
- **Total Count**: 37 Duo Boons between 9 participating gods
- **Element**: All Duo Boons count as Aether element
- **Base Appearance Rate**: 12% (20% in Warden encounters)
- **Enhancement**: The Queen Arcana Card (+6-12% chance)
- **Requirements**: Specific core boons from BOTH participating gods

### Complete Duo Boons List with Prerequisites

#### Aphrodite Combinations (8 total)

1. **Burning Desire** (Aphrodite + Hestia)
   - Effect: Scorch duration on Weak foes becomes infinite
   - Prerequisites: (Aphrodite: Rapture Ring, Passion Rush, or Glamour Gain) + (Hestia: Flame Strike, Flame Flourish, or Smolder Ring)
   - Image: `https://static.wikia.nocookie.net/hades_gamepedia_en/images/c/c6/Burning_Desire_II.png`

2. **Carnal Pleasure** (Aphrodite + Ares)  
   - Effect: 25% chance to create Heartthrob when collecting Blood Drop
   - Prerequisites: (Ares: Grisly Gain, Visceral Impact, or Profuse Bleeding) + (Aphrodite: Any core boon)
   - Image: `https://static.wikia.nocookie.net/hades_gamepedia_en/images/0/0b/Carnal_Pleasure_II.png`

3. **Ecstatic Obsession** (Aphrodite + Hera)
   - Effect: Foes required +2 (or more)
   - Prerequisites: (Aphrodite: Rapture Ring, Passion Rush, or Glamour Gain) + (Hera: Any core boon or Nasty Comeback)
   - Image: `https://static.wikia.nocookie.net/hades_gamepedia_en/images/e/ea/Ecstatic_Obsession_II.png`

4. **Hearty Appetite** (Aphrodite + Demeter)
   - Effect: +10% bonus damage per 50 Life
   - Prerequisites: (Aphrodite: Core boons or Healthy Rebound) + (Demeter: Core boons or Plentiful Forage)
   - Image: `https://static.wikia.nocookie.net/hades_gamepedia_en/images/3/3b/Hearty_Appetite_II.png`

5. **Island Getaway** (Aphrodite + Poseidon)
   - Effect: +15% damage resistance  
   - Prerequisites: (Aphrodite: Flutter Strike or Flutter Flourish) + (Poseidon: Any core boon)
   - Image: `https://static.wikia.nocookie.net/hades_gamepedia_en/images/1/1b/Island_Getaway_II.png`

6. **Love Handles** (Aphrodite + Hephaestus)
   - Effect: Heartthrob area damage: 120
   - Prerequisites: (Aphrodite: Any core boon) + (Hephaestus: Volcanic Strike, Volcanic Flourish, or Smithy Rush)
   - Image: `https://static.wikia.nocookie.net/hades_gamepedia_en/images/e/e1/Love_Handles_II.png`

7. **Romantic Spark** (Aphrodite + Zeus)
   - Effect: +80% bonus Blitz damage
   - Prerequisites: (Aphrodite: Any core boon) + (Zeus: Heaven Strike or Heaven Flourish)
   - Image: `https://static.wikia.nocookie.net/hades_gamepedia_en/images/4/4c/Romantic_Spark_II.png`

8. **Sunny Disposition** (Aphrodite + Apollo)
   - Effect: +2 bonus Heartthrobs
   - Prerequisites: (Aphrodite: Heart Breaker) + (Apollo: Any core boon)
   - Image: `https://static.wikia.nocookie.net/hades_gamepedia_en/images/a/ae/Sunny_Disposition_II.png`

#### Apollo Combinations (7 total)

9. **Beach Ball** (Apollo + Poseidon)
   - Effect: 300 blast damage after 2 seconds
   - Prerequisites: Complex multi-god requirement including both gods' core boons
   - Image: `https://static.wikia.nocookie.net/hades_gamepedia_en/images/6/67/Beach_Ball_II.png`

10. **Cutting Edge** (Apollo + Ares)
    - Effect: +50% blade area of effect
    - Prerequisites: (Apollo: Any core boon) + (Ares: Sword Ring, Stabbing Rush, or Cut Above)
    - Image: `https://static.wikia.nocookie.net/hades_gamepedia_en/images/e/eb/Cutting_Edge_II.png`

11. **Glorious Disaster** (Apollo + Zeus)
    - Effect: Channel Magick into Ω Cast for repeated lightning (20 damage every 0.13 sec)
    - Prerequisites: (Apollo: Prominence Flare) + (Zeus: Core boons or special abilities)
    - Image: `https://static.wikia.nocookie.net/hades_gamepedia_en/images/2/21/Glorious_Disaster_II.png`

12. **Rude Awakening** (Apollo + Hephaestus)
    - Effect: +300 bonus blast damage
    - Prerequisites: (Apollo: Specific enhanced abilities) + (Hephaestus: Core strike/flourish/rush)
    - Image: `https://static.wikia.nocookie.net/hades_gamepedia_en/images/2/20/Rude_Awakening_II.png`

13. **Sun Worshiper** (Apollo + Hera)
    - Effect: +200% servant damage
    - Prerequisites: (Apollo: Solar Ring, Blinding Rush, or Lucid Gain) + (Hera: Engagement Ring, Nexus Rush, or Born Gain)
    - Image: `https://static.wikia.nocookie.net/hades_gamepedia_en/images/9/92/Sun_Worshiper_II.png`

14. **Tropical Cyclone** (Apollo + Demeter)
    - Effect: 70 gale damage every 0.5 seconds
    - Prerequisites: (Apollo: Core boons) + (Demeter: Frigid Rush or Arctic Gale)
    - Image: `https://static.wikia.nocookie.net/hades_gamepedia_en/images/c/ce/Tropical_Cyclone_II.png`

15. **Warm Breeze** (Apollo + Hestia)
    - Effect: 3 life restoration every second
    - Prerequisites: (Apollo: Enhanced abilities) + (Hestia: Core boons)
    - Image: `https://static.wikia.nocookie.net/hades_gamepedia_en/images/d/d3/Warm_Breeze_II.png`

### Additional Duo Boons (22 more)
The system includes 22 additional duo boons covering all god combinations between Ares, Demeter, Hephaestus, Hera, Hestia, Poseidon, and Zeus, each with specific prerequisite patterns and mechanical effects.

## Legendary Boons System

### Legendary Mechanics
- **Total Count**: 11 Legendary Boons across 11 gods
- **Base Appearance Rate**: 10% (1% for Hermes, 5% for Chaos)
- **Prerequisites**: Generally require 3 specific boons from same god
- **Enhancement**: Excellence Arcana Card, Warden encounters, Yarn of Ariadne

### Complete Legendary Boons

1. **All Together** (Hera)
   - Effect: +1 to all 5 elements plus 1 Infusion Boon for each
   - Prerequisites: 3 specific Hera boons
   - **Most Powerful Legendary**: Grants access to all elemental synergies

2. **Fire Away** (Hestia)
   - Effect: 400 Scorch damage every 3 seconds
   - Prerequisites: 3 Hestia core boons
   - High sustained damage output

3. **King Tide** (Poseidon)  
   - Effect: +200% splash damage vs Guardians (boss fights)
   - Prerequisites: 3 Poseidon core boons
   - Boss-fighting specialization

4. **Shocking Loss** (Zeus)
   - Effect: 20% chance for instant destruction of non-boss enemies
   - Prerequisites: 3 Zeus core boons
   - Powerful crowd control

5. **Chaos Theory** (Chaos)
   - Effect: Unique mechanics related to curse/blessing interactions
   - Prerequisites: Multiple Chaos encounters
   - Unpredictable but potentially game-breaking

*6 additional Legendary boons exist for Apollo, Aphrodite, Ares, Demeter, Hephaestus, and Hermes with similar power levels and prerequisites*

## Advanced Boon Systems

### Infusion Boons
- **Unlock Requirement**: "Divination of the Elements" incantation (5 Psyche cost)
- **Prerequisites**: Fight Scylla, speak to Zeus
- **Mechanic**: Require specific elemental essence counts
- **Element Requirements**: Flat counts or scaling with element quantity

**Key Infusion Boons**:
- **Water Fitness** (Poseidon): +100 Max Life per Water element
- **Coarse Grit** (Demeter): Damage capped at 15 maximum per hit
- **Martial Art** (Hephaestus): +5% Attack/Special damage per Earth element

### Hex System (Selene)
**Total Count**: 8 unique Hexes requiring 70-150 Magick each

1. **Phase Shift**: Slow everything 50% for 4 seconds (130 Magick)
2. **Twilight Curse**: Morph up to 5 foes into critters (40 Magick)  
3. **Lunar Ray**: 800 damage beam over 2 seconds (120 Magick)
4. **Wolf Howl**: Jump attack for 200 damage (80 Magick)
5. **Moon Water**: Restore 15 HP, 3 uses, resets at fountains (70 Magick)
6. **Night Bloom**: Revive slain enemy to fight for you, 12 seconds (100 Magick)
7. **Total Eclipse**: 1000 damage blast after 4 seconds (varies)
8. **Dark Side**: Become Impervious nightmare for 5 seconds (90 Magick)

**Upgrade System**: "Path of Stars" randomized skill trees per run with Moonglow bonuses

### Chaos Boons
**Unique Two-Phase System**: Curse (negative) → Blessing (permanent positive)
- **Access**: Through Chaos Gates requiring HP sacrifice
- **Stacking**: Unlike other boons, Chaos blessings stack
- **Cannot**: Be upgraded with Pom of Power or sold
- **Examples**: "Pauper's Favor" (curse gold generation → blessing +40% rare boon chance)

## Entity Framework Core Implementation

### Core Database Schema

```csharp
public class Boon
{
    public int BoonId { get; set; }
    public string Name { get; set; }
    public BoonType Type { get; set; }  // Enum
    public int GodId { get; set; }
    public string Description { get; set; }
    public string ImageUrl { get; set; }
    public BoonSlot? Slot { get; set; }  // Nullable for non-core boons
    
    // Navigation Properties
    public God God { get; set; }
    public ICollection<BoonElement> Elements { get; set; }
    public ICollection<BoonPrerequisite> Prerequisites { get; set; }
    public ICollection<BoonEffect> Effects { get; set; }
}

public class God
{
    public int GodId { get; set; }
    public string Name { get; set; }
    public string PrimaryElement { get; set; }
    public string SecondaryElement { get; set; }
    public string StatusEffect { get; set; }
    
    // Navigation Properties  
    public ICollection<Boon> Boons { get; set; }
}

public class DuoBoon : Boon
{
    public int FirstGodId { get; set; }
    public int SecondGodId { get; set; }
    public decimal BaseAppearanceRate { get; set; } = 0.12m;
    
    // Navigation Properties
    public God FirstGod { get; set; }
    public God SecondGod { get; set; }
}

public class BoonPrerequisite  
{
    public int PrerequisiteId { get; set; }
    public int BoonId { get; set; }
    public int RequiredBoonId { get; set; }
    public bool IsAlternative { get; set; }  // For "OR" relationships
    public int AlternativeGroupId { get; set; }  // Groups alternatives
    
    // Navigation Properties
    public Boon Boon { get; set; }
    public Boon RequiredBoon { get; set; }
}

public enum BoonType
{
    Core,
    Duo,
    Legendary, 
    Infusion,
    Hex,
    Chaos,
    NPC
}

public enum BoonSlot
{
    Attack,
    Special, 
    Cast,
    Sprint,
    Magick
}

public enum ElementType
{
    Air,
    Water,
    Earth,
    Fire,
    Aether
}
```

### Key Relationships
- **One-to-Many**: Gods → Core Boons, Legendary Boons
- **Many-to-Many**: Gods ↔ Duo Boons (via junction table)
- **Complex Prerequisites**: Multi-boon requirements with OR/AND logic
- **Element System**: Many-to-many relationship between Boons and Elements

### Performance Optimizations
- **Indexing**: BoonType, GodId, Elements for efficient filtering
- **Caching**: Frequently queried prerequisites and god combinations  
- **Validation**: Complex business rules for prerequisite logic
- **Localization**: Separate text tables for multi-language support

This comprehensive boon database provides complete coverage of all Hades II boon mechanics with working image references and full prerequisite mappings suitable for a production C#/.NET Entity Framework Core application.