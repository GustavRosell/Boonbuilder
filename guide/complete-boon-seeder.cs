// Data/BoonSeeder.cs - COMPLETE VERSION WITH ALL BOONS
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

            // Seed ALL Duo Boons
            var duoBoons = GetAllDuoBoons();
            await context.DuoBoons.AddRangeAsync(duoBoons);
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
                new God { GodId = 1, Name = "Aphrodite", IconUrl = "https://static.wikia.nocookie.net/hades_gamepedia_en/images/b/bd/Aphrodite.png", PrimaryElement = ElementType.Air, SecondaryElement = ElementType.Water, StatusEffect = "Weak", Description = "Goddess of Love" },
                new God { GodId = 2, Name = "Apollo", IconUrl = "https://static.wikia.nocookie.net/hades_gamepedia_en/images/5/5a/Apollo.png", PrimaryElement = ElementType.Air, SecondaryElement = ElementType.Fire, StatusEffect = "Daze", Description = "God of the Sun" },
                new God { GodId = 3, Name = "Ares", IconUrl = "https://static.wikia.nocookie.net/hades_gamepedia_en/images/9/9e/Ares.png", PrimaryElement = ElementType.Fire, StatusEffect = "Wounds", Description = "God of War" },
                new God { GodId = 4, Name = "Demeter", IconUrl = "https://static.wikia.nocookie.net/hades_gamepedia_en/images/a/a9/Demeter.png", PrimaryElement = ElementType.Earth, SecondaryElement = ElementType.Water, StatusEffect = "Freeze", Description = "Goddess of Seasons" },
                new God { GodId = 5, Name = "Hephaestus", IconUrl = "https://static.wikia.nocookie.net/hades_gamepedia_en/images/8/88/Hephaestus.png", PrimaryElement = ElementType.Earth, SecondaryElement = ElementType.Fire, StatusEffect = "Glow", Description = "God of the Forge" },
                new God { GodId = 6, Name = "Hera", IconUrl = "https://static.wikia.nocookie.net/hades_gamepedia_en/images/7/76/Hera.png", PrimaryElement = ElementType.Earth, SecondaryElement = ElementType.Aether, StatusEffect = "Hitch", Description = "Queen of Olympus" },
                new God { GodId = 7, Name = "Hestia", IconUrl = "https://static.wikia.nocookie.net/hades_gamepedia_en/images/2/24/Hestia.png", PrimaryElement = ElementType.Fire, StatusEffect = "Scorch", Description = "Goddess of the Hearth" },
                new God { GodId = 8, Name = "Poseidon", IconUrl = "https://static.wikia.nocookie.net/hades_gamepedia_en/images/d/d0/Poseidon.png", PrimaryElement = ElementType.Water, SecondaryElement = ElementType.Aether, StatusEffect = "Slip", Description = "God of the Sea" },
                new God { GodId = 9, Name = "Zeus", IconUrl = "https://static.wikia.nocookie.net/hades_gamepedia_en/images/7/76/Zeus.png", PrimaryElement = ElementType.Air, SecondaryElement = ElementType.Aether, StatusEffect = "Blitz", Description = "King of Olympus" }
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
                IconUrl = "https://static.wikia.nocookie.net/hades_gamepedia_en/images/4/4f/Hammer_Staff_Melino%C3%AB.png",
                Description = "Strike with quick close-range Attacks, or long-range Specials",
                Aspects = new List<WeaponAspect>
                {
                    new WeaponAspect { AspectId = 1, WeaponId = 1, Name = "Aspect of Melinoë", IconUrl = "https://static.wikia.nocookie.net/hades_gamepedia_en/images/4/4f/Hammer_Staff_Melino%C3%AB.png", Description = "Gain up to 60 Maximum Magick", IsHidden = false },
                    new WeaponAspect { AspectId = 2, WeaponId = 1, Name = "Aspect of Circe", IconUrl = "https://static.wikia.nocookie.net/hades_gamepedia_en/images/9/95/Hammer_Staff_Circe.png", Description = "Psychic leash dealing 10 damage every 0.2 sec", IsHidden = false },
                    new WeaponAspect { AspectId = 3, WeaponId = 1, Name = "Aspect of Momus", IconUrl = "https://static.wikia.nocookie.net/hades_gamepedia_en/images/5/54/Hammer_Staff_Momus.png", Description = "Ω Moves fire in place up to 3 times", IsHidden = false }
                }
            });

            // Sister Blades
            weapons.Add(new Weapon
            {
                WeaponId = 2,
                Type = WeaponType.SisterBlades,
                Name = "Sister Blades",
                IconUrl = "https://static.wikia.nocookie.net/hades_gamepedia_en/images/1/1d/Hammer_Daggers_Melino%C3%AB_II.png",
                Description = "Slash with furious Attacks or strike afar with Specials",
                Aspects = new List<WeaponAspect>
                {
                    new WeaponAspect { AspectId = 4, WeaponId = 2, Name = "Aspect of Melinoë", IconUrl = "https://static.wikia.nocookie.net/hades_gamepedia_en/images/1/1d/Hammer_Daggers_Melino%C3%AB_II.png", Description = "Backstab damage upgrades", IsHidden = false },
                    new WeaponAspect { AspectId = 5, WeaponId = 2, Name = "Aspect of Artemis", IconUrl = "https://static.wikia.nocookie.net/hades_gamepedia_en/images/3/33/Aspect_of_Artemis_II.png", Description = "No damage during Ω Attack", IsHidden = false },
                    new WeaponAspect { AspectId = 6, WeaponId = 2, Name = "Aspect of Pan", IconUrl = "https://static.wikia.nocookie.net/hades_gamepedia_en/images/f/f4/Aspect_of_Pan_II.png", Description = "Tracking knives", IsHidden = false }
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
                new Boon { BoonId = 1, Name = "Flutter Strike", Type = BoonType.Core, GodId = 1, Slot = BoonSlot.Attack, Description = "Your Attacks deal more damage to nearby foes", Effect = "Close-up Damage: +80%", IconUrl = "https://static.wikia.nocookie.net/hades_gamepedia_en/images/c/ca/Flutter_Strike_II.png", Element = ElementType.Water, StatusEffect = "Weak" },
                new Boon { BoonId = 2, Name = "Flutter Flourish", Type = BoonType.Core, GodId = 1, Slot = BoonSlot.Special, Description = "Your Specials deal more damage to nearby foes", Effect = "Close-up Damage: +100%", IconUrl = "https://static.wikia.nocookie.net/hades_gamepedia_en/images/f/f1/Flutter_Flourish_II.png", Element = ElementType.Water, StatusEffect = "Weak" },
                new Boon { BoonId = 3, Name = "Rapture Ring", Type = BoonType.Core, GodId = 1, Slot = BoonSlot.Cast, Description = "Your Casts inflict Weak and damage foes", Effect = "Cast Damage: 10 every 0.85 sec", IconUrl = "https://static.wikia.nocookie.net/hades_gamepedia_en/images/3/3a/Rapture_Ring_II.png", Element = ElementType.Air, StatusEffect = "Weak" },
                new Boon { BoonId = 4, Name = "Passion Rush", Type = BoonType.Core, GodId = 1, Slot = BoonSlot.Sprint, Description = "Dashing damages surrounding foes", Effect = "Area Damage: 20", IconUrl = "https://static.wikia.nocookie.net/hades_gamepedia_en/images/5/5b/Passion_Rush_II.png", Element = ElementType.Air, StatusEffect = "Weak" },
                new Boon { BoonId = 5, Name = "Glamour Gain", Type = BoonType.Core, GodId = 1, Slot = BoonSlot.Magick, Description = "Restore Magick while foes are Weak", Effect = "Magick: 6 per sec", IconUrl = "https://static.wikia.nocookie.net/hades_gamepedia_en/images/7/7c/Glamour_Gain_II.png", Element = ElementType.Air, StatusEffect = "Weak" }
            });

            // APOLLO BOONS
            boons.AddRange(new List<Boon>
            {
                new Boon { BoonId = 6, Name = "Nova Strike", Type = BoonType.Core, GodId = 2, Slot = BoonSlot.Attack, Description = "Attacks deal damage in larger area", Effect = "Area Damage", IconUrl = "https://static.wikia.nocookie.net/hades_gamepedia_en/images/1/1e/Nova_Strike_II.png", Element = ElementType.Air, StatusEffect = "Daze" },
                new Boon { BoonId = 7, Name = "Nova Flourish", Type = BoonType.Core, GodId = 2, Slot = BoonSlot.Special, Description = "Specials deal damage in larger area", Effect = "Area Damage", IconUrl = "https://static.wikia.nocookie.net/hades_gamepedia_en/images/3/3f/Nova_Flourish_II.png", Element = ElementType.Air, StatusEffect = "Daze" },
                new Boon { BoonId = 8, Name = "Solar Ring", Type = BoonType.Core, GodId = 2, Slot = BoonSlot.Cast, Description = "Casts inflict Daze and burst", Effect = "Burst Damage", IconUrl = "https://static.wikia.nocookie.net/hades_gamepedia_en/images/5/5a/Solar_Ring_II.png", Element = ElementType.Air, StatusEffect = "Daze" },
                new Boon { BoonId = 9, Name = "Blinding Rush", Type = BoonType.Core, GodId = 2, Slot = BoonSlot.Sprint, Description = "Sprint inflicts Daze", Effect = "Faster Sprint", IconUrl = "https://static.wikia.nocookie.net/hades_gamepedia_en/images/7/7b/Blinding_Rush_II.png", Element = ElementType.Air, StatusEffect = "Daze" },
                new Boon { BoonId = 10, Name = "Lucid Gain", Type = BoonType.Core, GodId = 2, Slot = BoonSlot.Magick, Description = "Stand in Casts to restore Magick", Effect = "Instant Restore", IconUrl = "https://static.wikia.nocookie.net/hades_gamepedia_en/images/9/9d/Lucid_Gain_II.png", Element = ElementType.Air }
            });

            // ARES BOONS
            boons.AddRange(new List<Boon>
            {
                new Boon { BoonId = 11, Name = "Vicious Strike", Type = BoonType.Core, GodId = 3, Slot = BoonSlot.Attack, Description = "Attacks deal more damage and inflict Wounds", Effect = "+20% Damage", IconUrl = "https://static.wikia.nocookie.net/hades_gamepedia_en/images/8/8d/Vicious_Strike_II.png", Element = ElementType.Fire, StatusEffect = "Wounds" },
                new Boon { BoonId = 12, Name = "Vicious Flourish", Type = BoonType.Core, GodId = 3, Slot = BoonSlot.Special, Description = "Specials deal more damage and inflict Wounds", Effect = "+30% Damage", IconUrl = "https://static.wikia.nocookie.net/hades_gamepedia_en/images/2/2f/Vicious_Flourish_II.png", Element = ElementType.Fire, StatusEffect = "Wounds" },
                new Boon { BoonId = 13, Name = "Sword Ring", Type = BoonType.Core, GodId = 3, Slot = BoonSlot.Cast, Description = "Casts create falling blades", Effect = "Blade: 80", IconUrl = "https://static.wikia.nocookie.net/hades_gamepedia_en/images/4/4a/Sword_Ring_II.png", Element = ElementType.Fire, StatusEffect = "Wounds" },
                new Boon { BoonId = 14, Name = "Stabbing Rush", Type = BoonType.Core, GodId = 3, Slot = BoonSlot.Sprint, Description = "Dash creates falling blades", Effect = "Blades: 30", IconUrl = "https://static.wikia.nocookie.net/hades_gamepedia_en/images/6/6b/Stabbing_Rush_II.png", Element = ElementType.Fire },
                new Boon { BoonId = 15, Name = "Grisly Gain", Type = BoonType.Core, GodId = 3, Slot = BoonSlot.Magick, Description = "Weapon strikes spill Plasma", Effect = "10% Chance", IconUrl = "https://static.wikia.nocookie.net/hades_gamepedia_en/images/9/9c/Grisly_Gain_II.png", Element = ElementType.Fire }
            });

            // DEMETER BOONS
            boons.AddRange(new List<Boon>
            {
                new Boon { BoonId = 16, Name = "Ice Strike", Type = BoonType.Core, GodId = 4, Slot = BoonSlot.Attack, Description = "Attacks inflict Freeze", Effect = "+30% Damage", IconUrl = "https://static.wikia.nocookie.net/hades_gamepedia_en/images/9/93/Ice_Strike_II.png", Element = ElementType.Water, StatusEffect = "Freeze" },
                new Boon { BoonId = 17, Name = "Ice Flourish", Type = BoonType.Core, GodId = 4, Slot = BoonSlot.Special, Description = "Specials inflict Freeze", Effect = "+40% Damage", IconUrl = "https://static.wikia.nocookie.net/hades_gamepedia_en/images/9/93/Ice_Flourish_II.png", Element = ElementType.Water, StatusEffect = "Freeze" },
                new Boon { BoonId = 18, Name = "Arctic Ring", Type = BoonType.Core, GodId = 4, Slot = BoonSlot.Cast, Description = "Casts inflict Freeze repeatedly", Effect = "10 per 0.5 sec", IconUrl = "https://static.wikia.nocookie.net/hades_gamepedia_en/images/9/9d/Arctic_Ring_II.png", Element = ElementType.Water, StatusEffect = "Freeze" },
                new Boon { BoonId = 19, Name = "Frigid Rush", Type = BoonType.Core, GodId = 4, Slot = BoonSlot.Sprint, Description = "Sprint forms lingering Gust", Effect = "4 per 0.25 sec", IconUrl = "https://static.wikia.nocookie.net/hades_gamepedia_en/images/e/ee/Frigid_Rush_II.png", Element = ElementType.Water },
                new Boon { BoonId = 20, Name = "Tranquil Gain", Type = BoonType.Core, GodId = 4, Slot = BoonSlot.Magick, Description = "Restore Magick when inactive", Effect = "50% per sec", IconUrl = "https://static.wikia.nocookie.net/hades_gamepedia_en/images/b/be/Tranquil_Gain_II.png", Element = ElementType.Water }
            });

            // HEPHAESTUS BOONS
            boons.AddRange(new List<Boon>
            {
                new Boon { BoonId = 21, Name = "Volcanic Strike", Type = BoonType.Core, GodId = 5, Slot = BoonSlot.Attack, Description = "Attacks can cause blast", Effect = "Blast: 400", IconUrl = "https://static.wikia.nocookie.net/hades_gamepedia_en/images/7/70/Volcanic_Strike_II.png", Element = ElementType.Fire, StatusEffect = "Glow" },
                new Boon { BoonId = 22, Name = "Volcanic Flourish", Type = BoonType.Core, GodId = 5, Slot = BoonSlot.Special, Description = "Specials can cause blast", Effect = "Blast: 500", IconUrl = "https://static.wikia.nocookie.net/hades_gamepedia_en/images/7/70/Volcanic_Flourish_II.png", Element = ElementType.Fire, StatusEffect = "Glow" },
                new Boon { BoonId = 23, Name = "Anvil Ring", Type = BoonType.Core, GodId = 5, Slot = BoonSlot.Cast, Description = "Casts deal damage thrice", Effect = "50 per 1 sec", IconUrl = "https://static.wikia.nocookie.net/hades_gamepedia_en/images/e/e3/Anvil_Ring_II.png", Element = ElementType.Fire },
                new Boon { BoonId = 24, Name = "Smithy Rush", Type = BoonType.Core, GodId = 5, Slot = BoonSlot.Sprint, Description = "Post-dash blast", Effect = "Blast: 200", IconUrl = "https://static.wikia.nocookie.net/hades_gamepedia_en/images/c/c9/Smithy_Rush_II.png", Element = ElementType.Fire },
                new Boon { BoonId = 25, Name = "Tough Gain", Type = BoonType.Core, GodId = 5, Slot = BoonSlot.Magick, Description = "Damage restores Magick", Effect = "150 Magick", IconUrl = "https://static.wikia.nocookie.net/hades_gamepedia_en/images/4/4f/Tough_Gain_II.png", Element = ElementType.Fire }
            });

            // HERA BOONS
            boons.AddRange(new List<Boon>
            {
                new Boon { BoonId = 26, Name = "Sworn Strike", Type = BoonType.Core, GodId = 6, Slot = BoonSlot.Attack, Description = "Attacks inflict Hitch", Effect = "+50% Damage", IconUrl = "https://static.wikia.nocookie.net/hades_gamepedia_en/images/c/cb/Sworn_Strike_II.png", Element = ElementType.Earth, StatusEffect = "Hitch" },
                new Boon { BoonId = 27, Name = "Sworn Flourish", Type = BoonType.Core, GodId = 6, Slot = BoonSlot.Special, Description = "Specials inflict Hitch", Effect = "+60% Damage", IconUrl = "https://static.wikia.nocookie.net/hades_gamepedia_en/images/c/cb/Sworn_Flourish_II.png", Element = ElementType.Earth, StatusEffect = "Hitch" },
                new Boon { BoonId = 28, Name = "Engagement Ring", Type = BoonType.Core, GodId = 6, Slot = BoonSlot.Cast, Description = "Casts inflict Hitch", Effect = "20 per foe", IconUrl = "https://static.wikia.nocookie.net/hades_gamepedia_en/images/4/40/Engagement_Ring_II.png", Element = ElementType.Earth, StatusEffect = "Hitch" },
                new Boon { BoonId = 29, Name = "Nexus Rush", Type = BoonType.Core, GodId = 6, Slot = BoonSlot.Sprint, Description = "Sprint inflicts Hitch", Effect = "Damage: 60", IconUrl = "https://static.wikia.nocookie.net/hades_gamepedia_en/images/d/d4/Nexus_Rush_II.png", Element = ElementType.Earth, StatusEffect = "Hitch" },
                new Boon { BoonId = 30, Name = "Born Gain", Type = BoonType.Core, GodId = 6, Slot = BoonSlot.Magick, Description = "Prime to restore all Magick", Effect = "Prime: 14", IconUrl = "https://static.wikia.nocookie.net/hades_gamepedia_en/images/2/21/Born_Gain_II.png", Element = ElementType.Earth }
            });

            // HESTIA BOONS
            boons.AddRange(new List<Boon>
            {
                new Boon { BoonId = 31, Name = "Flame Strike", Type = BoonType.Core, GodId = 7, Slot = BoonSlot.Attack, Description = "Attacks inflict Scorch", Effect = "Scorch: 30", IconUrl = "https://static.wikia.nocookie.net/hades_gamepedia_en/images/b/b6/Flame_Strike_II.png", Element = ElementType.Fire, StatusEffect = "Scorch" },
                new Boon { BoonId = 32, Name = "Flame Flourish", Type = BoonType.Core, GodId = 7, Slot = BoonSlot.Special, Description = "Specials inflict Scorch", Effect = "Scorch: 35", IconUrl = "https://static.wikia.nocookie.net/hades_gamepedia_en/images/b/b6/Flame_Flourish_II.png", Element = ElementType.Fire, StatusEffect = "Scorch" },
                new Boon { BoonId = 33, Name = "Smolder Ring", Type = BoonType.Core, GodId = 7, Slot = BoonSlot.Cast, Description = "Casts repeatedly inflict Scorch", Effect = "40 per sec", IconUrl = "https://static.wikia.nocookie.net/hades_gamepedia_en/images/2/20/Smolder_Ring_II.png", Element = ElementType.Fire, StatusEffect = "Scorch" },
                new Boon { BoonId = 34, Name = "Heat Rush", Type = BoonType.Core, GodId = 7, Slot = BoonSlot.Sprint, Description = "Sprint leaves cinder trail", Effect = "10 per 0.25 sec", IconUrl = "https://static.wikia.nocookie.net/hades_gamepedia_en/images/2/20/Heat_Rush_II.png", Element = ElementType.Fire },
                new Boon { BoonId = 35, Name = "Cardio Gain", Type = BoonType.Core, GodId = 7, Slot = BoonSlot.Magick, Description = "Damage restores Magick", Effect = "4 per strike", IconUrl = "https://static.wikia.nocookie.net/hades_gamepedia_en/images/9/98/Cardio_Gain_II.png", Element = ElementType.Fire }
            });

            // POSEIDON BOONS
            boons.AddRange(new List<Boon>
            {
                new Boon { BoonId = 36, Name = "Wave Strike", Type = BoonType.Core, GodId = 8, Slot = BoonSlot.Attack, Description = "Attacks hit with splash", Effect = "Splash: 20", IconUrl = "https://static.wikia.nocookie.net/hades_gamepedia_en/images/3/3e/Wave_Strike_II.png", Element = ElementType.Water, StatusEffect = "Slip" },
                new Boon { BoonId = 37, Name = "Wave Flourish", Type = BoonType.Core, GodId = 8, Slot = BoonSlot.Special, Description = "Specials hit with splash", Effect = "Splash: 30", IconUrl = "https://static.wikia.nocookie.net/hades_gamepedia_en/images/3/3e/Wave_Flourish_II.png", Element = ElementType.Water, StatusEffect = "Slip" },
                new Boon { BoonId = 38, Name = "Tidal Ring", Type = BoonType.Core, GodId = 8, Slot = BoonSlot.Cast, Description = "Casts hit with powerful splash", Effect = "Splash: 60", IconUrl = "https://static.wikia.nocookie.net/hades_gamepedia_en/images/a/ad/Tidal_Ring_II.png", Element = ElementType.Water, StatusEffect = "Froth" },
                new Boon { BoonId = 39, Name = "Breaker Rush", Type = BoonType.Core, GodId = 8, Slot = BoonSlot.Sprint, Description = "Sprint knocks away foes", Effect = "Impact: 80", IconUrl = "https://static.wikia.nocookie.net/hades_gamepedia_en/images/c/ce/Breaker_Rush_II.png", Element = ElementType.Water },
                new Boon { BoonId = 40, Name = "Flood Gain", Type = BoonType.Core, GodId = 8, Slot = BoonSlot.Magick, Description = "Omega Moves restore Magick", Effect = "4 sec", IconUrl = "https://static.wikia.nocookie.net/hades_gamepedia_en/images/9/9d/Flood_Gain_II.png", Element = ElementType.Water }
            });

            // ZEUS BOONS
            boons.AddRange(new List<Boon>
            {
                new Boon { BoonId = 41, Name = "Heaven Strike", Type = BoonType.Core, GodId = 9, Slot = BoonSlot.Attack, Description = "Attacks inflict Blitz", Effect = "Blitz: 80", IconUrl = "https://static.wikia.nocookie.net/hades_gamepedia_en/images/8/84/Heaven_Strike_II.png", Element = ElementType.Air, StatusEffect = "Blitz" },
                new Boon { BoonId = 42, Name = "Heaven Flourish", Type = BoonType.Core, GodId = 9, Slot = BoonSlot.Special, Description = "Specials inflict Blitz", Effect = "