using BoonBuilder.Models;
using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.Identity;

namespace BoonBuilder.Data
{
    public static class BoonSeeder
    {
        public static async Task SeedAsync(BoonBuilderContext context, UserManager<ApplicationUser> userManager)
        {
            // Only seed if database is empty
            if (await context.Gods.AnyAsync())
                return;

            // Seed Gods
            var gods = GetGods();
            await context.Gods.AddRangeAsync(gods);
            await context.SaveChangesAsync();

            // Seed Weapons and Aspects
            var weapons = GetWeapons();
            await context.Weapons.AddRangeAsync(weapons);
            await context.SaveChangesAsync();

            // Seed ALL Core Boons
            var coreBoons = GetAllCoreBoons();
            await context.Boons.AddRangeAsync(coreBoons);
            await context.SaveChangesAsync();

            // Seed Duo Boons
            var duoBoons = GetAllDuoBoons();
            await context.DuoBoons.AddRangeAsync(duoBoons);
            await context.SaveChangesAsync();

            // Seed Legendary Boons
            var legendaryBoons = GetAllLegendaryBoons();
            await context.Boons.AddRangeAsync(legendaryBoons);
            await context.SaveChangesAsync();

            // Seed Prerequisites
            var prerequisites = GetAllPrerequisites();
            await context.BoonPrerequisites.AddRangeAsync(prerequisites);
            await context.SaveChangesAsync();

            // Seed test user and sample builds
            await SeedTestData(context, userManager);
        }

        private static List<God> GetGods()
        {
            return new List<God>
            {
                new God { GodId = 1, Name = "Aphrodite", IconUrl = "/images/gods/aphrodite.webp", PrimaryElement = ElementType.Air, SecondaryElement = ElementType.Water, StatusEffect = "Weak", Description = "Goddess of Love" },
                new God { GodId = 2, Name = "Apollo", IconUrl = "/images/gods/apollo.webp", PrimaryElement = ElementType.Air, SecondaryElement = ElementType.Fire, StatusEffect = "Daze", Description = "God of the Sun" },
                new God { GodId = 3, Name = "Ares", IconUrl = "/images/gods/ares.webp", PrimaryElement = ElementType.Fire, StatusEffect = "Wounds", Description = "God of War" },
                new God { GodId = 4, Name = "Demeter", IconUrl = "/images/gods/demeter.webp", PrimaryElement = ElementType.Earth, SecondaryElement = ElementType.Water, StatusEffect = "Freeze", Description = "Goddess of Seasons" },
                new God { GodId = 5, Name = "Hephaestus", IconUrl = "/images/gods/hephaestus.webp", PrimaryElement = ElementType.Earth, SecondaryElement = ElementType.Fire, StatusEffect = "Glow", Description = "God of the Forge" },
                new God { GodId = 6, Name = "Hera", IconUrl = "/images/gods/hera.webp", PrimaryElement = ElementType.Earth, SecondaryElement = ElementType.Aether, StatusEffect = "Hitch", Description = "Queen of Olympus" },
                new God { GodId = 7, Name = "Hestia", IconUrl = "/images/gods/hestia.webp", PrimaryElement = ElementType.Fire, StatusEffect = "Scorch", Description = "Goddess of the Hearth" },
                new God { GodId = 8, Name = "Poseidon", IconUrl = "/images/gods/poseidon.webp", PrimaryElement = ElementType.Water, SecondaryElement = ElementType.Aether, StatusEffect = "Slip", Description = "God of the Sea" },
                new God { GodId = 9, Name = "Zeus", IconUrl = "/images/gods/zeus.webp", PrimaryElement = ElementType.Air, SecondaryElement = ElementType.Aether, StatusEffect = "Blitz", Description = "King of Olympus" }
            };
        }

        private static List<Weapon> GetWeapons()
        {
            var weapons = new List<Weapon>();

            // Witch's Staff
            weapons.Add(new Weapon
            {
                WeaponId = 1,
                Type = WeaponType.WitchStaff,
                Name = "Witch's Staff",
                IconUrl = "/images/weapons/placeholder.webp",
                Description = "Strike with quick close-range Attacks, or long-range Specials",
                Aspects = new List<WeaponAspect>
                {
                    new WeaponAspect { AspectId = 1, WeaponId = 1, Name = "Aspect of Melinoë", IconUrl = "/images/weapons/placeholder.webp", Description = "Gain up to 60 Maximum Magick", IsHidden = false },
                    new WeaponAspect { AspectId = 2, WeaponId = 1, Name = "Aspect of Circe", IconUrl = "/images/aspects/aspect_circe.webp", Description = "Psychic leash dealing 10 damage every 0.2 sec", IsHidden = false },
                    new WeaponAspect { AspectId = 3, WeaponId = 1, Name = "Aspect of Momus", IconUrl = "/images/aspects/aspect_momus.webp", Description = "Ω Moves fire in place up to 3 times", IsHidden = false }
                }
            });

            // Sister Blades
            weapons.Add(new Weapon
            {
                WeaponId = 2,
                Type = WeaponType.SisterBlades,
                Name = "Sister Blades",
                IconUrl = "/images/weapons/placeholder.webp",
                Description = "Slash with furious Attacks or strike afar with Specials",
                Aspects = new List<WeaponAspect>
                {
                    new WeaponAspect { AspectId = 4, WeaponId = 2, Name = "Aspect of Melinoë", IconUrl = "/images/weapons/placeholder.webp", Description = "Backstab damage upgrades", IsHidden = false },
                    new WeaponAspect { AspectId = 5, WeaponId = 2, Name = "Aspect of Artemis", IconUrl = "/images/aspects/aspect_artemis.webp", Description = "No damage during Ω Attack", IsHidden = false },
                    new WeaponAspect { AspectId = 6, WeaponId = 2, Name = "Aspect of Pan", IconUrl = "/images/aspects/aspect_pan.webp", Description = "Tracking knives", IsHidden = false }
                }
            });

            // Umbral Flames
            weapons.Add(new Weapon
            {
                WeaponId = 3,
                Type = WeaponType.UmbralFlames,
                Name = "Umbral Flames",
                IconUrl = "/images/weapons/placeholder.webp",
                Description = "Launch damaging ranged Attacks as you move, or Specials that orbit around you",
                Aspects = new List<WeaponAspect>
                {
                    new WeaponAspect { AspectId = 7, WeaponId = 3, Name = "Aspect of Melinoë", IconUrl = "/images/weapons/placeholder.webp", Description = "Upgrades increase duration of rotating flames", IsHidden = false },
                    new WeaponAspect { AspectId = 8, WeaponId = 3, Name = "Aspect of Moros", IconUrl = "/images/aspects/aspect_moros.webp", Description = "Lingering Ω Attacks explode upon hit by Special", IsHidden = false },
                    new WeaponAspect { AspectId = 9, WeaponId = 3, Name = "Aspect of Eos", IconUrl = "/images/aspects/aspect_eos.webp", Description = "Attacks grow in size and follow Melinoë during sprinting", IsHidden = false },
                    new WeaponAspect { AspectId = 10, WeaponId = 3, Name = "Aspect of Supay", IconUrl = "/images/aspects/aspect_supay.webp", Description = "Hidden aspect with underworld effects", IsHidden = true }
                }
            });

            // Moonstone Axe
            weapons.Add(new Weapon
            {
                WeaponId = 4,
                Type = WeaponType.MoonstoneAxe,
                Name = "Moonstone Axe",
                IconUrl = "/images/weapons/placeholder.webp",
                Description = "Sweep through foes with slow but devastating Attacks or defend with Specials",
                Aspects = new List<WeaponAspect>
                {
                    new WeaponAspect { AspectId = 11, WeaponId = 4, Name = "Aspect of Melinoë", IconUrl = "/images/weapons/placeholder.webp", Description = "Upgrades improve attack recovery time", IsHidden = false },
                    new WeaponAspect { AspectId = 12, WeaponId = 4, Name = "Aspect of Charon", IconUrl = "/images/aspects/aspect_charon.webp", Description = "Increases Cast duration for both Cast and Ω Cast", IsHidden = false },
                    new WeaponAspect { AspectId = 13, WeaponId = 4, Name = "Aspect of Thanatos", IconUrl = "/images/aspects/aspect_thanatos.webp", Description = "Increases Attack Speed and +13% Critical chance for Ω Moves", IsHidden = false },
                    new WeaponAspect { AspectId = 14, WeaponId = 4, Name = "Aspect of Nergal", IconUrl = "/images/aspects/aspect_nergal.webp", Description = "Hidden aspect with war-themed effects", IsHidden = true }
                }
            });

            // Argent Skull
            weapons.Add(new Weapon
            {
                WeaponId = 5,
                Type = WeaponType.ArgentSkull,
                Name = "Argent Skull",
                IconUrl = "/images/weapons/placeholder.webp",
                Description = "Blast foes with explosive Attacks and retrieve Shells with lunging Specials",
                Aspects = new List<WeaponAspect>
                {
                    new WeaponAspect { AspectId = 15, WeaponId = 5, Name = "Aspect of Melinoë", IconUrl = "/images/weapons/placeholder.webp", Description = "Upgrades improve Shell damage", IsHidden = false },
                    new WeaponAspect { AspectId = 16, WeaponId = 5, Name = "Aspect of Medea", IconUrl = "/images/aspects/aspect_medea.webp", Description = "Enhances explosive Attacks with additional effects", IsHidden = false },
                    new WeaponAspect { AspectId = 17, WeaponId = 5, Name = "Aspect of Persephone", IconUrl = "/images/aspects/aspect_persephone.webp", Description = "Improves Shell retrieval speed and explosive damage", IsHidden = false },
                    new WeaponAspect { AspectId = 18, WeaponId = 5, Name = "Aspect of Hel", IconUrl = "/images/aspects/aspect_hel.webp", Description = "Hidden aspect with death-themed effects", IsHidden = true }
                }
            });

            // Black Coat
            weapons.Add(new Weapon
            {
                WeaponId = 6,
                Type = WeaponType.BlackCoat,
                Name = "Black Coat",
                IconUrl = "/images/weapons/placeholder.webp",
                Description = "Guard and retaliate with mighty Attacks, ensuring none escape with seeking Specials",
                Aspects = new List<WeaponAspect>
                {
                    new WeaponAspect { AspectId = 19, WeaponId = 6, Name = "Aspect of Melinoë", IconUrl = "/images/weapons/placeholder.webp", Description = "Guard and retaliate with mighty Attacks", IsHidden = false },
                    new WeaponAspect { AspectId = 20, WeaponId = 6, Name = "Aspect of Selene", IconUrl = "/images/aspects/aspect_selene.webp", Description = "Enhances Attacks with lunar magic", IsHidden = false },
                    new WeaponAspect { AspectId = 21, WeaponId = 6, Name = "Aspect of Nyx", IconUrl = "/images/aspects/aspect_nyx.webp", Description = "Strengthens Specials with night-themed effects", IsHidden = false },
                    new WeaponAspect { AspectId = 22, WeaponId = 6, Name = "Aspect of Shiva", IconUrl = "/images/aspects/aspect_shiva.webp", Description = "Hidden aspect with destructive effects", IsHidden = true }
                }
            });

            return weapons;
        }

        private static List<Boon> GetAllCoreBoons()
        {
            var boons = new List<Boon>();

            // APHRODITE BOONS
            boons.AddRange(new List<Boon>
            {
                new Boon { BoonId = 1, Name = "Flutter Strike", Type = BoonType.Core, GodId = 1, Slot = BoonSlot.Attack, Description = "Your Attacks deal more damage to nearby foes", Effect = "Close-up Damage: +80%", IconUrl = "/images/boons/core/flutter_strike.webp", Element = ElementType.Water, StatusEffect = "Weak" },
                new Boon { BoonId = 2, Name = "Flutter Flourish", Type = BoonType.Core, GodId = 1, Slot = BoonSlot.Special, Description = "Your Specials deal more damage to nearby foes", Effect = "Close-up Damage: +100%", IconUrl = "/images/boons/core/flutter_flourish.webp", Element = ElementType.Water, StatusEffect = "Weak" },
                new Boon { BoonId = 3, Name = "Rapture Ring", Type = BoonType.Core, GodId = 1, Slot = BoonSlot.Cast, Description = "Your Casts inflict Weak and damage foes", Effect = "Cast Damage: 10 every 0.85 sec", IconUrl = "/images/boons/core/rapture_ring.webp", Element = ElementType.Air, StatusEffect = "Weak" },
                new Boon { BoonId = 4, Name = "Passion Rush", Type = BoonType.Core, GodId = 1, Slot = BoonSlot.Sprint, Description = "Dashing damages surrounding foes", Effect = "Area Damage: 20", IconUrl = "/images/boons/core/passion_rush.webp", Element = ElementType.Air, StatusEffect = "Weak" },
                new Boon { BoonId = 5, Name = "Glamour Gain", Type = BoonType.Core, GodId = 1, Slot = BoonSlot.Magick, Description = "Restore Magick while foes are Weak", Effect = "Magick: 6 per sec", IconUrl = "/images/boons/core/glamour_gain.webp", Element = ElementType.Air, StatusEffect = "Weak" }
            });

            // APOLLO BOONS
            boons.AddRange(new List<Boon>
            {
                new Boon { BoonId = 6, Name = "Nova Strike", Type = BoonType.Core, GodId = 2, Slot = BoonSlot.Attack, Description = "Attacks deal damage in larger area", Effect = "Area Damage", IconUrl = "/images/boons/core/nova_strike.webp", Element = ElementType.Air, StatusEffect = "Daze" },
                new Boon { BoonId = 7, Name = "Nova Flourish", Type = BoonType.Core, GodId = 2, Slot = BoonSlot.Special, Description = "Specials deal damage in larger area", Effect = "Area Damage", IconUrl = "/images/boons/core/nova_flourish.webp", Element = ElementType.Air, StatusEffect = "Daze" },
                new Boon { BoonId = 8, Name = "Solar Ring", Type = BoonType.Core, GodId = 2, Slot = BoonSlot.Cast, Description = "Casts inflict Daze and burst", Effect = "Burst Damage", IconUrl = "/images/boons/core/solar_ring.webp", Element = ElementType.Air, StatusEffect = "Daze" },
                new Boon { BoonId = 9, Name = "Blinding Sprint", Type = BoonType.Core, GodId = 2, Slot = BoonSlot.Sprint, Description = "Sprint inflicts Daze", Effect = "Faster Sprint", IconUrl = "/images/boons/core/blinding_sprint.webp", Element = ElementType.Air, StatusEffect = "Daze" },
                new Boon { BoonId = 10, Name = "Lucid Gain", Type = BoonType.Core, GodId = 2, Slot = BoonSlot.Magick, Description = "Stand in Casts to restore Magick", Effect = "Instant Restore", IconUrl = "/images/boons/core/lucid_gain.webp", Element = ElementType.Air }
            });

            // ARES BOONS
            boons.AddRange(new List<Boon>
            {
                new Boon { BoonId = 11, Name = "Vicious Strike", Type = BoonType.Core, GodId = 3, Slot = BoonSlot.Attack, Description = "Attacks deal more damage and inflict Wounds", Effect = "+20% Damage", IconUrl = "/images/boons/core/vicious_strike.webp", Element = ElementType.Fire, StatusEffect = "Wounds" },
                new Boon { BoonId = 12, Name = "Vicious Flourish", Type = BoonType.Core, GodId = 3, Slot = BoonSlot.Special, Description = "Specials deal more damage and inflict Wounds", Effect = "+30% Damage", IconUrl = "/images/boons/core/vicious_flourish.webp", Element = ElementType.Fire, StatusEffect = "Wounds" },
                new Boon { BoonId = 13, Name = "Blade Rift", Type = BoonType.Core, GodId = 3, Slot = BoonSlot.Cast, Description = "Casts create falling blades", Effect = "Blade: 80", IconUrl = "/images/boons/core/blade_rift.webp", Element = ElementType.Fire, StatusEffect = "Wounds" },
                new Boon { BoonId = 14, Name = "Battle Sprint", Type = BoonType.Core, GodId = 3, Slot = BoonSlot.Sprint, Description = "Sprint creates falling blades", Effect = "Blades: 30", IconUrl = "/images/boons/core/battle_sprint.webp", Element = ElementType.Fire },
                new Boon { BoonId = 15, Name = "Blood Frenzy", Type = BoonType.Core, GodId = 3, Slot = BoonSlot.Magick, Description = "Weapon strikes spill Blood", Effect = "10% Chance", IconUrl = "/images/boons/core/blood_frenzy.webp", Element = ElementType.Fire }
            });

            // DEMETER BOONS
            boons.AddRange(new List<Boon>
            {
                new Boon { BoonId = 16, Name = "Frost Strike", Type = BoonType.Core, GodId = 4, Slot = BoonSlot.Attack, Description = "Attacks inflict Freeze", Effect = "+30% Damage", IconUrl = "/images/boons/core/frost_strike.webp", Element = ElementType.Water, StatusEffect = "Freeze" },
                new Boon { BoonId = 17, Name = "Frost Flourish", Type = BoonType.Core, GodId = 4, Slot = BoonSlot.Special, Description = "Specials inflict Freeze", Effect = "+40% Damage", IconUrl = "/images/boons/core/frost_flourish.webp", Element = ElementType.Water, StatusEffect = "Freeze" },
                new Boon { BoonId = 18, Name = "Frozen Touch", Type = BoonType.Core, GodId = 4, Slot = BoonSlot.Cast, Description = "Casts inflict Freeze repeatedly", Effect = "10 per 0.5 sec", IconUrl = "/images/boons/core/frozen_touch.webp", Element = ElementType.Water, StatusEffect = "Freeze" },
                new Boon { BoonId = 19, Name = "Frigid Sprint", Type = BoonType.Core, GodId = 4, Slot = BoonSlot.Sprint, Description = "Sprint forms lingering frost", Effect = "4 per 0.25 sec", IconUrl = "/images/boons/core/frigid_sprint.webp", Element = ElementType.Water },
                new Boon { BoonId = 20, Name = "Rare Crop", Type = BoonType.Core, GodId = 4, Slot = BoonSlot.Magick, Description = "Restore Magick when inactive", Effect = "50% per sec", IconUrl = "/images/boons/core/rare_crop.webp", Element = ElementType.Water }
            });

            // HEPHAESTUS BOONS
            boons.AddRange(new List<Boon>
            {
                new Boon { BoonId = 21, Name = "Volcanic Strike", Type = BoonType.Core, GodId = 5, Slot = BoonSlot.Attack, Description = "Attacks can cause blast", Effect = "Blast: 200", IconUrl = "/images/boons/core/volcanic_strike.webp", Element = ElementType.Fire, StatusEffect = "Glow" },
                new Boon { BoonId = 22, Name = "Volcanic Flourish", Type = BoonType.Core, GodId = 5, Slot = BoonSlot.Special, Description = "Specials can cause blast", Effect = "Blast: 400", IconUrl = "/images/boons/core/volcanic_flourish.webp", Element = ElementType.Fire, StatusEffect = "Glow" },
                new Boon { BoonId = 23, Name = "Molten Touch", Type = BoonType.Core, GodId = 5, Slot = BoonSlot.Cast, Description = "Casts deal damage thrice", Effect = "Triple damage", IconUrl = "/images/boons/core/molten_touch.webp", Element = ElementType.Fire },
                new Boon { BoonId = 24, Name = "Forge Sprint", Type = BoonType.Core, GodId = 5, Slot = BoonSlot.Sprint, Description = "Post-dash blast", Effect = "Blast: 100", IconUrl = "/images/boons/core/forge_sprint.webp", Element = ElementType.Fire },
                new Boon { BoonId = 25, Name = "Smoldering Air", Type = BoonType.Core, GodId = 5, Slot = BoonSlot.Magick, Description = "Damage restores Magick", Effect = "150 Magick", IconUrl = "/images/boons/core/smoldering_air.webp", Element = ElementType.Fire }
            });

            // HERA BOONS
            boons.AddRange(new List<Boon>
            {
                new Boon { BoonId = 26, Name = "Nexus Strike", Type = BoonType.Core, GodId = 6, Slot = BoonSlot.Attack, Description = "Attacks inflict Hitch", Effect = "Hitch damage", IconUrl = "/images/boons/core/nexus_strike.webp", Element = ElementType.Earth, StatusEffect = "Hitch" },
                new Boon { BoonId = 27, Name = "Nexus Flourish", Type = BoonType.Core, GodId = 6, Slot = BoonSlot.Special, Description = "Specials inflict Hitch", Effect = "Hitch damage", IconUrl = "/images/boons/core/nexus_flourish.webp", Element = ElementType.Earth, StatusEffect = "Hitch" },
                new Boon { BoonId = 28, Name = "Engagement Ring", Type = BoonType.Core, GodId = 6, Slot = BoonSlot.Cast, Description = "Casts inflict Hitch", Effect = "Hitch damage", IconUrl = "/images/boons/core/engagement_ring.webp", Element = ElementType.Earth, StatusEffect = "Hitch" },
                new Boon { BoonId = 29, Name = "Nexus Sprint", Type = BoonType.Core, GodId = 6, Slot = BoonSlot.Sprint, Description = "Sprint inflicts Hitch", Effect = "Hitch on contact", IconUrl = "/images/boons/core/nexus_sprint.webp", Element = ElementType.Earth, StatusEffect = "Hitch" },
                new Boon { BoonId = 30, Name = "Greater Recall", Type = BoonType.Core, GodId = 6, Slot = BoonSlot.Magick, Description = "Prime to restore all Magick", Effect = "Magick restoration", IconUrl = "/images/boons/core/greater_recall.webp", Element = ElementType.Earth }
            });

            // HESTIA BOONS
            boons.AddRange(new List<Boon>
            {
                new Boon { BoonId = 31, Name = "Flame Strike", Type = BoonType.Core, GodId = 7, Slot = BoonSlot.Attack, Description = "Attacks inflict Scorch", Effect = "Scorch damage", IconUrl = "/images/boons/core/flame_strike.webp", Element = ElementType.Fire, StatusEffect = "Scorch" },
                new Boon { BoonId = 32, Name = "Flame Flourish", Type = BoonType.Core, GodId = 7, Slot = BoonSlot.Special, Description = "Specials inflict Scorch", Effect = "Scorch damage", IconUrl = "/images/boons/core/flame_flourish.webp", Element = ElementType.Fire, StatusEffect = "Scorch" },
                new Boon { BoonId = 33, Name = "Hearth Gain", Type = BoonType.Core, GodId = 7, Slot = BoonSlot.Cast, Description = "Casts repeatedly inflict Scorch", Effect = "Repeated Scorch", IconUrl = "/images/boons/core/hearth_gain.webp", Element = ElementType.Fire, StatusEffect = "Scorch" },
                new Boon { BoonId = 34, Name = "Soot Sprint", Type = BoonType.Core, GodId = 7, Slot = BoonSlot.Sprint, Description = "Sprint destroys ranged shots", Effect = "Scorch on foes", IconUrl = "/images/boons/core/soot_sprint.webp", Element = ElementType.Fire },
                new Boon { BoonId = 35, Name = "Controlled Burn", Type = BoonType.Core, GodId = 7, Slot = BoonSlot.Magick, Description = "Damage restores Magick", Effect = "Magick restoration", IconUrl = "/images/boons/core/controlled_burn.webp", Element = ElementType.Fire }
            });

            // POSEIDON BOONS
            boons.AddRange(new List<Boon>
            {
                new Boon { BoonId = 36, Name = "Wave Strike", Type = BoonType.Core, GodId = 8, Slot = BoonSlot.Attack, Description = "Attacks hit with splash", Effect = "Splash damage", IconUrl = "/images/boons/core/wave_strike.webp", Element = ElementType.Water, StatusEffect = "Slip" },
                new Boon { BoonId = 37, Name = "Wave Flourish", Type = BoonType.Core, GodId = 8, Slot = BoonSlot.Special, Description = "Specials hit with splash", Effect = "Splash damage", IconUrl = "/images/boons/core/wave_flourish.webp", Element = ElementType.Water, StatusEffect = "Slip" },
                new Boon { BoonId = 38, Name = "Tidal Ring", Type = BoonType.Core, GodId = 8, Slot = BoonSlot.Cast, Description = "Casts hit with powerful splash", Effect = "Splash damage", IconUrl = "/images/boons/core/tidal_ring.webp", Element = ElementType.Water },
                new Boon { BoonId = 39, Name = "Breaker Sprint", Type = BoonType.Core, GodId = 8, Slot = BoonSlot.Sprint, Description = "Sprint knocks away foes", Effect = "Knockback damage", IconUrl = "/images/boons/core/breaker_sprint.webp", Element = ElementType.Water },
                new Boon { BoonId = 40, Name = "Flood Gain", Type = BoonType.Core, GodId = 8, Slot = BoonSlot.Magick, Description = "Spirit Bubble appears", Effect = "Spirit Bubble", IconUrl = "/images/boons/core/flood_gain.webp", Element = ElementType.Water }
            });

            // ZEUS BOONS
            boons.AddRange(new List<Boon>
            {
                new Boon { BoonId = 41, Name = "Heaven Strike", Type = BoonType.Core, GodId = 9, Slot = BoonSlot.Attack, Description = "Attacks inflict Blitz", Effect = "Blitz damage", IconUrl = "/images/boons/core/heaven_strike.webp", Element = ElementType.Air, StatusEffect = "Blitz" },
                new Boon { BoonId = 42, Name = "Heaven Flourish", Type = BoonType.Core, GodId = 9, Slot = BoonSlot.Special, Description = "Specials inflict Blitz", Effect = "Blitz damage", IconUrl = "/images/boons/core/heaven_flourish.webp", Element = ElementType.Air, StatusEffect = "Blitz" },
                new Boon { BoonId = 43, Name = "Storm Ring", Type = BoonType.Core, GodId = 9, Slot = BoonSlot.Cast, Description = "Casts cause lightning bolts", Effect = "Lightning bolt damage", IconUrl = "/images/boons/core/storm_ring.webp", Element = ElementType.Air, StatusEffect = "Blitz" },
                new Boon { BoonId = 44, Name = "Thunder Rush", Type = BoonType.Core, GodId = 9, Slot = BoonSlot.Sprint, Description = "Dashing causes lightning bolts", Effect = "Lightning bolt damage", IconUrl = "/images/boons/core/thunder_rush.webp", Element = ElementType.Air },
                new Boon { BoonId = 45, Name = "Ionic Gain", Type = BoonType.Core, GodId = 9, Slot = BoonSlot.Magick, Description = "Aether Font appears", Effect = "Magick restoration", IconUrl = "/images/boons/core/ionic_gain.webp", Element = ElementType.Air }
            });

            return boons;
        }

        private static async Task SeedTestData(BoonBuilderContext context, UserManager<ApplicationUser> userManager)
        {
            // Create test user
            if (await userManager.FindByNameAsync("test123") == null)
            {
                var testUser = new ApplicationUser
                {
                    UserName = "test123",
                    Email = "test@boonbuilder.com",
                    DisplayName = "Test User",
                    CreatedAt = DateTime.UtcNow,
                    EmailConfirmed = true
                };

                var result = await userManager.CreateAsync(testUser, "Test1234!");
                if (result.Succeeded)
                {
                    // Create a sample build
                    var sampleBuild = new Build
                    {
                        Name = "Sample Zeus Build",
                        Description = "A powerful Zeus-focused build for beginners",
                        AuthorId = testUser.Id,
                        WeaponAspectId = 1, // Aspect of Melinoë
                        Difficulty = BuildDifficulty.Easy,
                        Tier = BuildTier.A,
                        IsFeatured = true,
                        IsPublic = true,
                        LikeCount = 10,
                        CreatedAt = DateTime.UtcNow,
                        UpdatedAt = DateTime.UtcNow,
                        PlaystyleTags = "[\"Beginner-friendly\", \"Lightning\", \"High damage\"]"
                    };

                    await context.Builds.AddAsync(sampleBuild);
                    await context.SaveChangesAsync();

                    // Add boons to the build
                    var buildBoons = new List<BuildBoon>
                    {
                        new BuildBoon { BuildId = sampleBuild.BuildId, BoonId = 41, Slot = BoonSlot.Attack, Order = 1 }, // Heaven Strike
                        new BuildBoon { BuildId = sampleBuild.BuildId, BoonId = 42, Slot = BoonSlot.Special, Order = 2 }, // Heaven Flourish
                        new BuildBoon { BuildId = sampleBuild.BuildId, BoonId = 43, Slot = BoonSlot.Cast, Order = 3 }, // Storm Ring
                        new BuildBoon { BuildId = sampleBuild.BuildId, BoonId = 44, Slot = BoonSlot.Sprint, Order = 4 }, // Thunder Rush
                        new BuildBoon { BuildId = sampleBuild.BuildId, BoonId = 45, Slot = BoonSlot.Magick, Order = 5 } // Ionic Gain
                    };

                    await context.BuildBoons.AddRangeAsync(buildBoons);
                    await context.SaveChangesAsync();
                }
            }
        }

        private static List<DuoBoon> GetAllDuoBoons()
        {
            var duoBoons = new List<DuoBoon>();

            // APHRODITE COMBINATIONS
            duoBoons.AddRange(new List<DuoBoon>
            {
                new DuoBoon
                {
                    BoonId = 100,
                    Name = "Burning Desire",
                    Type = BoonType.Duo,
                    FirstGodId = 1, // Aphrodite
                    SecondGodId = 7, // Hestia
                    Description = "Scorch duration on Weak foes becomes infinite",
                    Effect = "Infinite Scorch on Weak foes",
                    IconUrl = "/images/weapons/placeholder.webp",
                    Element = ElementType.Aether
                },
                new DuoBoon
                {
                    BoonId = 101,
                    Name = "Carnal Pleasure",
                    Type = BoonType.Duo,
                    FirstGodId = 1, // Aphrodite
                    SecondGodId = 3, // Ares
                    Description = "25% chance to create Heartthrob when collecting Blood Drop",
                    Effect = "25% Heartthrob from Blood",
                    IconUrl = "/images/weapons/placeholder.webp",
                    Element = ElementType.Aether
                },
                new DuoBoon
                {
                    BoonId = 102,
                    Name = "Ecstatic Obsession",
                    Type = BoonType.Duo,
                    FirstGodId = 1, // Aphrodite
                    SecondGodId = 6, // Hera
                    Description = "Foes required +2 (or more)",
                    Effect = "+2 foe requirement",
                    IconUrl = "/images/weapons/placeholder.webp",
                    Element = ElementType.Aether
                },
                new DuoBoon
                {
                    BoonId = 103,
                    Name = "Hearty Appetite",
                    Type = BoonType.Duo,
                    FirstGodId = 1, // Aphrodite
                    SecondGodId = 4, // Demeter
                    Description = "+10% bonus damage per 50 Life",
                    Effect = "+10% damage per 50 Life",
                    IconUrl = "/images/boons/duo/hearty_appetite.webp",
                    Element = ElementType.Aether
                },
                new DuoBoon
                {
                    BoonId = 104,
                    Name = "Island Getaway",
                    Type = BoonType.Duo,
                    FirstGodId = 1, // Aphrodite
                    SecondGodId = 8, // Poseidon
                    Description = "+15% damage resistance",
                    Effect = "+15% damage resistance",
                    IconUrl = "/images/boons/duo/island_getaway.webp",
                    Element = ElementType.Aether
                },
                new DuoBoon
                {
                    BoonId = 105,
                    Name = "Love Handles",
                    Type = BoonType.Duo,
                    FirstGodId = 1, // Aphrodite
                    SecondGodId = 5, // Hephaestus
                    Description = "Heartthrob area damage: 120",
                    Effect = "Heartthrob area damage",
                    IconUrl = "/images/weapons/placeholder.webp",
                    Element = ElementType.Aether
                },
                new DuoBoon
                {
                    BoonId = 106,
                    Name = "Romantic Spark",
                    Type = BoonType.Duo,
                    FirstGodId = 1, // Aphrodite
                    SecondGodId = 9, // Zeus
                    Description = "+80% bonus Blitz damage",
                    Effect = "+80% Blitz damage",
                    IconUrl = "/images/boons/duo/romantic_spark.webp",
                    Element = ElementType.Aether
                },
                new DuoBoon
                {
                    BoonId = 107,
                    Name = "Sunny Disposition",
                    Type = BoonType.Duo,
                    FirstGodId = 1, // Aphrodite
                    SecondGodId = 2, // Apollo
                    Description = "+2 bonus Heartthrobs",
                    Effect = "+2 Heartthrobs",
                    IconUrl = "/images/boons/duo/sunny_disposition.webp",
                    Element = ElementType.Aether
                }
            });

            // APOLLO COMBINATIONS
            duoBoons.AddRange(new List<DuoBoon>
            {
                new DuoBoon
                {
                    BoonId = 108,
                    Name = "Beach Ball",
                    Type = BoonType.Duo,
                    FirstGodId = 2, // Apollo
                    SecondGodId = 8, // Poseidon
                    Description = "300 blast damage after 2 seconds",
                    Effect = "300 blast damage",
                    IconUrl = "/images/boons/duo/beach_ball.webp",
                    Element = ElementType.Aether
                },
                new DuoBoon
                {
                    BoonId = 109,
                    Name = "Cutting Edge",
                    Type = BoonType.Duo,
                    FirstGodId = 2, // Apollo
                    SecondGodId = 3, // Ares
                    Description = "+50% blade area of effect",
                    Effect = "+50% blade AoE",
                    IconUrl = "/images/weapons/placeholder.webp",
                    Element = ElementType.Aether
                },
                new DuoBoon
                {
                    BoonId = 110,
                    Name = "Glorious Disaster",
                    Type = BoonType.Duo,
                    FirstGodId = 2, // Apollo
                    SecondGodId = 9, // Zeus
                    Description = "Channel Magick into Ω Cast for repeated lightning",
                    Effect = "20 damage every 0.13 sec",
                    IconUrl = "/images/boons/duo/glorious_disaster.webp",
                    Element = ElementType.Aether
                },
                new DuoBoon
                {
                    BoonId = 111,
                    Name = "Rude Awakening",
                    Type = BoonType.Duo,
                    FirstGodId = 2, // Apollo
                    SecondGodId = 5, // Hephaestus
                    Description = "+300 bonus blast damage",
                    Effect = "+300 blast damage",
                    IconUrl = "/images/boons/duo/sun_worshiper.webp",
                    Element = ElementType.Aether
                },
                new DuoBoon
                {
                    BoonId = 112,
                    Name = "Sun Worshiper",
                    Type = BoonType.Duo,
                    FirstGodId = 2, // Apollo
                    SecondGodId = 6, // Hera
                    Description = "+200% servant damage",
                    Effect = "+200% servant damage",
                    IconUrl = "/images/weapons/placeholder.webp",
                    Element = ElementType.Aether
                },
                new DuoBoon
                {
                    BoonId = 113,
                    Name = "Tropical Cyclone",
                    Type = BoonType.Duo,
                    FirstGodId = 2, // Apollo
                    SecondGodId = 4, // Demeter
                    Description = "70 gale damage every 0.5 seconds",
                    Effect = "70 gale damage/0.5s",
                    IconUrl = "/images/boons/duo/torrential_downpour.webp",
                    Element = ElementType.Aether
                },
                new DuoBoon
                {
                    BoonId = 114,
                    Name = "Warm Breeze",
                    Type = BoonType.Duo,
                    FirstGodId = 2, // Apollo
                    SecondGodId = 7, // Hestia
                    Description = "3 life restoration every second",
                    Effect = "3 life/sec",
                    IconUrl = "/images/weapons/placeholder.webp",
                    Element = ElementType.Aether
                }
            });

            return duoBoons;
        }

        private static List<Boon> GetAllLegendaryBoons()
        {
            return new List<Boon>
            {
                new Boon
                {
                    BoonId = 200,
                    Name = "All Together",
                    Type = BoonType.Legendary,
                    GodId = 6, // Hera
                    Description = "+1 to all 5 elements plus 1 Infusion Boon for each",
                    Effect = "+1 all elements + Infusions",
                    IconUrl = "/images/weapons/placeholder.webp",
                    Element = ElementType.Aether
                },
                new Boon
                {
                    BoonId = 201,
                    Name = "Fire Away",
                    Type = BoonType.Legendary,
                    GodId = 7, // Hestia
                    Description = "400 Scorch damage every 3 seconds",
                    Effect = "400 Scorch every 3s",
                    IconUrl = "/images/weapons/placeholder.webp",
                    Element = ElementType.Fire
                },
                new Boon
                {
                    BoonId = 202,
                    Name = "King Tide",
                    Type = BoonType.Legendary,
                    GodId = 8, // Poseidon
                    Description = "+200% splash damage vs Guardians (boss fights)",
                    Effect = "+200% splash vs bosses",
                    IconUrl = "/images/boons/legendary/king_tide.webp",
                    Element = ElementType.Water
                },
                new Boon
                {
                    BoonId = 203,
                    Name = "Shocking Loss",
                    Type = BoonType.Legendary,
                    GodId = 9, // Zeus
                    Description = "20% chance for instant destruction of non-boss enemies",
                    Effect = "20% instant kill",
                    IconUrl = "/images/boons/legendary/shocking_loss.webp",
                    Element = ElementType.Air
                },
                new Boon
                {
                    BoonId = 204,
                    Name = "Perfect Shot",
                    Type = BoonType.Legendary,
                    GodId = 2, // Apollo
                    Description = "Cast effects trigger on all foes in area",
                    Effect = "Cast AoE effects",
                    IconUrl = "/images/boons/legendary/perfect_shot.webp",
                    Element = ElementType.Air
                },
                new Boon
                {
                    BoonId = 205,
                    Name = "Passion Flare",
                    Type = BoonType.Legendary,
                    GodId = 1, // Aphrodite
                    Description = "Weak effects spread between nearby foes",
                    Effect = "Weak spreads",
                    IconUrl = "/images/weapons/placeholder.webp",
                    Element = ElementType.Air
                },
                new Boon
                {
                    BoonId = 206,
                    Name = "Unending Stamina",
                    Type = BoonType.Legendary,
                    GodId = 3, // Ares
                    Description = "Wounds prevent healing and spread on death",
                    Effect = "Wounds spread",
                    IconUrl = "/images/weapons/placeholder.webp",
                    Element = ElementType.Fire
                },
                new Boon
                {
                    BoonId = 207,
                    Name = "Winter Harvest",
                    Type = BoonType.Legendary,
                    GodId = 4, // Demeter
                    Description = "Frozen foes shatter at 10% health for area damage",
                    Effect = "Frozen foes shatter",
                    IconUrl = "/images/boons/legendary/winter_harvest.webp",
                    Element = ElementType.Earth
                },
                new Boon
                {
                    BoonId = 208,
                    Name = "Volcanic Ash",
                    Type = BoonType.Legendary,
                    GodId = 5, // Hephaestus
                    Description = "Blast effects create damaging fields",
                    Effect = "Blast creates fields",
                    IconUrl = "/images/weapons/placeholder.webp",
                    Element = ElementType.Fire
                }
            };
        }

        private static List<BoonPrerequisite> GetAllPrerequisites()
        {
            var prerequisites = new List<BoonPrerequisite>();

            // Burning Desire prerequisites (Aphrodite + Hestia)
            prerequisites.AddRange(new List<BoonPrerequisite>
            {
                new BoonPrerequisite { BoonId = 100, RequiredBoonId = 3, IsAlternative = true, AlternativeGroupId = 1 }, // Rapture Ring
                new BoonPrerequisite { BoonId = 100, RequiredBoonId = 4, IsAlternative = true, AlternativeGroupId = 1 }, // Passion Rush
                new BoonPrerequisite { BoonId = 100, RequiredBoonId = 5, IsAlternative = true, AlternativeGroupId = 1 }, // Glamour Gain
                new BoonPrerequisite { BoonId = 100, RequiredBoonId = 31, IsAlternative = true, AlternativeGroupId = 2 }, // Flame Strike
                new BoonPrerequisite { BoonId = 100, RequiredBoonId = 32, IsAlternative = true, AlternativeGroupId = 2 }, // Flame Flourish
                new BoonPrerequisite { BoonId = 100, RequiredBoonId = 33, IsAlternative = true, AlternativeGroupId = 2 }  // Smolder Ring
            });

            // Carnal Pleasure prerequisites (Aphrodite + Ares)
            prerequisites.AddRange(new List<BoonPrerequisite>
            {
                new BoonPrerequisite { BoonId = 101, RequiredBoonId = 15, IsAlternative = false, AlternativeGroupId = 3 }, // Grisly Gain (required)
                new BoonPrerequisite { BoonId = 101, RequiredBoonId = 1, IsAlternative = true, AlternativeGroupId = 4 }, // Any Aphrodite core
                new BoonPrerequisite { BoonId = 101, RequiredBoonId = 2, IsAlternative = true, AlternativeGroupId = 4 },
                new BoonPrerequisite { BoonId = 101, RequiredBoonId = 3, IsAlternative = true, AlternativeGroupId = 4 },
                new BoonPrerequisite { BoonId = 101, RequiredBoonId = 4, IsAlternative = true, AlternativeGroupId = 4 },
                new BoonPrerequisite { BoonId = 101, RequiredBoonId = 5, IsAlternative = true, AlternativeGroupId = 4 }
            });

            // Romantic Spark prerequisites (Aphrodite + Zeus)
            prerequisites.AddRange(new List<BoonPrerequisite>
            {
                new BoonPrerequisite { BoonId = 106, RequiredBoonId = 1, IsAlternative = true, AlternativeGroupId = 5 }, // Any Aphrodite core
                new BoonPrerequisite { BoonId = 106, RequiredBoonId = 2, IsAlternative = true, AlternativeGroupId = 5 },
                new BoonPrerequisite { BoonId = 106, RequiredBoonId = 3, IsAlternative = true, AlternativeGroupId = 5 },
                new BoonPrerequisite { BoonId = 106, RequiredBoonId = 4, IsAlternative = true, AlternativeGroupId = 5 },
                new BoonPrerequisite { BoonId = 106, RequiredBoonId = 5, IsAlternative = true, AlternativeGroupId = 5 },
                new BoonPrerequisite { BoonId = 106, RequiredBoonId = 41, IsAlternative = true, AlternativeGroupId = 6 }, // Heaven Strike
                new BoonPrerequisite { BoonId = 106, RequiredBoonId = 42, IsAlternative = true, AlternativeGroupId = 6 }  // Heaven Flourish
            });

            // Cutting Edge prerequisites (Apollo + Ares)
            prerequisites.AddRange(new List<BoonPrerequisite>
            {
                new BoonPrerequisite { BoonId = 109, RequiredBoonId = 6, IsAlternative = true, AlternativeGroupId = 7 }, // Any Apollo core
                new BoonPrerequisite { BoonId = 109, RequiredBoonId = 7, IsAlternative = true, AlternativeGroupId = 7 },
                new BoonPrerequisite { BoonId = 109, RequiredBoonId = 8, IsAlternative = true, AlternativeGroupId = 7 },
                new BoonPrerequisite { BoonId = 109, RequiredBoonId = 9, IsAlternative = true, AlternativeGroupId = 7 },
                new BoonPrerequisite { BoonId = 109, RequiredBoonId = 10, IsAlternative = true, AlternativeGroupId = 7 },
                new BoonPrerequisite { BoonId = 109, RequiredBoonId = 13, IsAlternative = true, AlternativeGroupId = 8 }, // Sword Ring
                new BoonPrerequisite { BoonId = 109, RequiredBoonId = 14, IsAlternative = true, AlternativeGroupId = 8 }  // Stabbing Rush
            });

            // Legendary prerequisites (require 3 specific boons from same god)
            // All Together (Hera Legendary)
            prerequisites.AddRange(new List<BoonPrerequisite>
            {
                new BoonPrerequisite { BoonId = 200, RequiredBoonId = 26, IsAlternative = false, AlternativeGroupId = 9 }, // Sworn Strike
                new BoonPrerequisite { BoonId = 200, RequiredBoonId = 28, IsAlternative = false, AlternativeGroupId = 9 }, // Engagement Ring
                new BoonPrerequisite { BoonId = 200, RequiredBoonId = 30, IsAlternative = false, AlternativeGroupId = 9 }  // Born Gain
            });

            // Fire Away (Hestia Legendary)
            prerequisites.AddRange(new List<BoonPrerequisite>
            {
                new BoonPrerequisite { BoonId = 201, RequiredBoonId = 31, IsAlternative = false, AlternativeGroupId = 10 }, // Flame Strike
                new BoonPrerequisite { BoonId = 201, RequiredBoonId = 32, IsAlternative = false, AlternativeGroupId = 10 }, // Flame Flourish
                new BoonPrerequisite { BoonId = 201, RequiredBoonId = 33, IsAlternative = false, AlternativeGroupId = 10 }  // Smolder Ring
            });

            // Shocking Loss (Zeus Legendary)
            prerequisites.AddRange(new List<BoonPrerequisite>
            {
                new BoonPrerequisite { BoonId = 203, RequiredBoonId = 41, IsAlternative = false, AlternativeGroupId = 11 }, // Heaven Strike
                new BoonPrerequisite { BoonId = 203, RequiredBoonId = 42, IsAlternative = false, AlternativeGroupId = 11 }, // Heaven Flourish
                new BoonPrerequisite { BoonId = 203, RequiredBoonId = 43, IsAlternative = false, AlternativeGroupId = 11 }  // Storm Ring
            });

            return prerequisites;
        }
    }
}