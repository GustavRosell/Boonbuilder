# Boonbuilder

Hi,

I want to create a fully functioning web app with c#, .net, blazor, and for frontend; some sort of react/typescript/tailwind css or regular css - not sure, whatever is best capable and fastest and best for unique and modern interactive radial pie designs.

This app is called the "Boonbuilder" It is much like "MetaTFT" for Teamfight Tactics, where you can find the meta for best builds currently in the game, but this app, is for Hades II. (And perhaps 1 also for a later update.)

In this project, I want something that reminds of MetaTFT. in the navbar to the left, there should be a "Home Page", "Browse Builds"(should view featured builds), "Your builds", "Build Creator"(Create your own build), "community builds"(Community builds), and "favorite builds"(shows your favorited builds through all these pages.)

Heres a more detailed description of all these pages:

### Home Page
Nothing yet really, just a home page welcoming for now.
You need some way to log in, of course.
A normal login, with authentication through email/discord?
Can we create this ui/ux, without much backend? And for now just have a testuser seed data acount, like test123 username and 1234 password e.g.

### Build Creator
This is where the magic happens. This is the "hard stuff" to program and create.
The builder page should be divided in 2:

# Loadout Menu
A type of "Character menu", which starts with empty slots, for Weapon, boons, etc. but will be replaced with the name and icon of weapon/boon etc. when chosen from the Radial Menu.

# Radial Menu
An extremely interactive and modern-like Radial Menu. Like a Pie Menu or a Circular Menu. But super nice and clean to use.

It should have some sort of "default view", with Weapon, Attack, Special, Cast, Sprint and Magick.

You should first choose your weapon and aspect. 
You do this by clicking the empty "Weapon" icon in radial menu. Here, you get the new option between choosing between each of the 6 weapons. If you click one weapon, it should then give you the option between the 3 aspects of the weapon. When chosen a weapon and aspect, it should be filled in the loadout, and the radial menu should go back to the standard page, where you again can choose between Weapon, Attack, Special, Cast, Sprint and Magick.'

Then, you should click on one of the "Core Slots", e.g "Attack", which opens up a new set of options to choose from; each god has one type of "Attack", which should then have an icon for each. It is the same flow for All of the core slots: Attack, Special, Cast, Sprint and Magick.

If you ever hover over a final icon, it should show the description in a small text box.

### Tier List // Browse Builds
A list of builds, ranked in "S to d-tier". There should also be other ways to filter, like only showing builds for a certain item, or even a certain aspect within an item. Or level of playstyle (some builds are much harder mechanically than others).
All of these things will be hard to determine, and for a "simple" starter platform, most of these should just be able to get ticked off when you create them.

When you click a build in the list, it should expand, and show the loadout just like the loadout is in "Build Creator" when it's filled.

### Your Builds
The builds you've created, the ones from your "log in" only.

When you click a build in the list, it should expand, and show the loadout just like the loadout is in "Build Creator" when it's filled.

### Favorite Builds
Should be a list of builds, just like "Browse Builds", but whenver you've been in "Browse builds" or "Your Builds", you can "Favorite" builds, by click a heart icon or something similar when you're viewing them.
When you click on a favorite build, it should be inspected just like in Browse Builds and Your Builds

When you click a build in the list, it should expand, and show the loadout just like the loadout is in "Build Creator" when it's filled.


# Hades II Nocturnal Arms

## Witch's Staff

- **Weapon Icon**: https://static.wikia.nocookie.net/hades_gamepedia_en/images/4/4f/Hammer_Staff_Melino%C3%AB.png/revision/latest?cb=20240604225046

- **Aspect of Melinoë**:
  - **Description**: Strike with a quick close-range Attack, or long-range Specials and Ω Moves. Gain up to 60 Maximum Magick and Power for your Specials.
  - **Icon link**: https://static.wikia.nocookie.net/hades_gamepedia_en/images/4/4f/Hammer_Staff_Melino%C3%AB.png/revision/latest?cb=20240604225046

- **Aspect of Circe**:
  - **Description**: Whenever you use your Casts, your familiar creates a psychic leash dealing 10 damage every 0.2 sec. Requires careful positioning for maximum effect.
  - **Icon link**: https://static.wikia.nocookie.net/hades_gamepedia_en/images/9/95/Hammer_Staff_Circe.png/revision/latest?cb=20240604225047

- **Aspect of Momus**:
  - **Description**: Your Ω Moves fire in place up to 3 times with a 1.5-sec delay at max rank, enhancing Magick efficiency.
  - **Icon link**: https://static.wikia.nocookie.net/hades_gamepedia_en/images/5/54/Hammer_Staff_Momus.png/revision/latest?cb=20240604225047

- **Aspect of Anubis (Hidden)**:
  - **Description**: Enhances the staff with death-themed abilities, possibly increasing damage or adding unique Ω effects (speculative).
  - **Icon link**: https://static.wikia.nocookie.net/hades_gamepedia_en/images/8/82/HammerStaff_42.png/revision/latest/scale-to-width-down/75?cb=20250618092757

## Sister Blades

- **Weapon Icon**: https://static.wikia.nocookie.net/hades_gamepedia_en/images/1/1d/Hammer_Daggers_Melino%C3%AB_II.png/revision/latest?cb=20240604225945

- **Aspect of Melinoë**:
  - **Description**: Slash with furious Attacks or strike afar with a flurry of Specials. Upgrades improve backstab damage.
  - **Icon link**: https://static.wikia.nocookie.net/hades_gamepedia_en/images/1/1d/Hammer_Daggers_Melino%C3%AB_II.png/revision/latest?cb=20240604225945

- **Aspect of Artemis**:
  - **Description**: Prevents damage during Ω Attack channeling and increases critical hit frequency.
  - **Icon link**: https://static.wikia.nocookie.net/hades_gamepedia_en/images/3/33/Aspect_of_Artemis_II.png/revision/latest?cb=20240604225945

- **Aspect of Pan**:
  - **Description**: Special knives track enemies and summon additional blades during the channel.
  - **Icon link**: https://static.wikia.nocookie.net/hades_gamepedia_en/images/f/f4/Aspect_of_Pan_II.png/revision/latest?cb=20240604225945

- **Aspect of Morrigan (Hidden)**:
  - **Description**: Likely enhances blade attacks with mystical or blood-themed effects, possibly increasing speed or damage (speculative).
  - **Icon link**: https://static.wikia.nocookie.net/hades_gamepedia_en/images/7/73/HammerDaggers_42.png/revision/latest/scale-to-width-down/75?cb=20250618184122

## Umbral Flames

- **Weapon Icon**: https://static.wikia.nocookie.net/hades_gamepedia_en/images/5/53/Hammer_Torch_Melino%C3%AB.png/revision/latest?cb=20240604225945

- **Aspect of Melinoë**:
  - **Description**: Launch damaging ranged Attacks as you move, or Specials that orbit around you. Upgrades increase duration of rotating flames.
  - **Icon link**: https://static.wikia.nocookie.net/hades_gamepedia_en/images/5/53/Hammer_Torch_Melino%C3%AB.png/revision/latest?cb=20240604225945

- **Aspect of Moros**:
  - **Description**: Lingering Ω Attacks explode upon hit by the Special, with upgrades enhancing blast damage.
  - **Icon link**: https://static.wikia.nocookie.net/hades_gamepedia_en/images/a/ad/Hammer_Torch_Moros.png/revision/latest?cb=20240604225945

- **Aspect of Eos**:
  - **Description**: Attacks grow in size and follow Melinoë during sprinting, with upgrades improving fully-grown attack damage.
  - **Icon link**: https://static.wikia.nocookie.net/hades_gamepedia_en/images/4/45/Hammer_Torch_Eos.png/revision/latest?cb=20240604225945

- **Aspect of Supay (Hidden)**:
  - **Description**: Likely enhances flames with underworld or sacrificial effects, possibly increasing range or damage (speculative).
  - **Icon link**: https://static.wikia.nocookie.net/hades_gamepedia_en/images/c/cc/HammerTorch_42.png/revision/latest/scale-to-width-down/75?cb=20250618230512

## Moonstone Axe

- **Weapon Icon**: https://static.wikia.nocookie.net/hades_gamepedia_en/images/e/ea/Hammer_Axe_Melino%C3%AB.png/revision/latest?cb=20240604225944

- **Aspect of Melinoë**:
  - **Description**: Sweep through foes with slow but devastating Attacks or defend with Specials. Upgrades improve attack recovery time.
  - **Icon link**: https://static.wikia.nocookie.net/hades_gamepedia_en/images/e/ea/Hammer_Axe_Melino%C3%AB.png/revision/latest?cb=20240604225944

- **Aspect of Charon**:
  - **Description**: Increases Cast duration for both Cast and Ω Cast, enhancing defensive capabilities.
  - **Icon link**: https://static.wikia.nocookie.net/hades_gamepedia_en/images/d/d4/Hammer_Axe_Charon.png/revision/latest?cb=20240604225945

- **Aspect of Thanatos**:
  - **Description**: Increases Attack Speed for Attacks (not Ω) and adds up to 13% Critical chance for Ω Moves.
  - **Icon link**: https://static.wikia.nocookie.net/hades_gamepedia_en/images/7/7d/Hammer_Axe_Thanatos.png/revision/latest?cb=20240604225945

- **Aspect of Nergal (Hidden)**:
  - **Description**: Likely enhances axe with pestilence or war-themed effects, possibly boosting damage or area effects (speculative).
  - **Icon link**: https://static.wikia.nocookie.net/hades_gamepedia_en/images/2/2a/HammerAxe_43.png/revision/latest/scale-to-width-down/75?cb=20250617204255

## Argent Skull

- **Weapon Icon**: https://static.wikia.nocookie.net/hades_gamepedia_en/images/a/a5/Aspect_of_Melino%C3%AB_II.png/revision/latest/scale-to-width-down/75?cb=20240604225946

- **Aspect of Melinoë**:
  - **Description**: Blast foes with explosive Attacks and retrieve Shells with lunging Specials. Upgrades improve Shell damage.
  - **Icon link**: https://static.wikia.nocookie.net/hades_gamepedia_en/images/a/a5/Aspect_of_Melino%C3%AB_II.png/revision/latest/scale-to-width-down/75?cb=20240604225946

- **Aspect of Medea**:
  - **Description**: Enhances explosive Attacks with additional effects, possibly increasing blast radius or damage.
  - **Icon link**: https://static.wikia.nocookie.net/hades_gamepedia_en/images/7/74/Aspect_of_Medea_II.png/revision/latest?cb=20240604225945

- **Aspect of Persephone**:
  - **Description**: Improves Shell retrieval speed and explosive damage output.
  - **Icon link**: https://static.wikia.nocookie.net/hades_gamepedia_en/images/f/f8/Aspect_of_Persephone_II.png/revision/latest/scale-to-width-down/75?cb=20240604225946

- **Aspect of Hel (Hidden)**:
  - **Description**: Likely enhances skull with underworld or death-themed effects, possibly increasing explosion frequency (speculative).
  - **Icon link**: https://static.wikia.nocookie.net/hades_gamepedia_en/images/b/bf/HammerLob_16.png/revision/latest/scale-to-width-down/75?cb=20250618230557

## Black Coat

- **Weapon Icon**: https://static.wikia.nocookie.net/hades_gamepedia_en/images/5/56/Coat_Melino%C3%AB.png/revision/latest/scale-to-width-down/75?cb=20241113133239

- **Aspect of Melinoë**:
  - **Description**: Guard and retaliate with mighty Attacks, ensuring none escape with seeking Specials.
  - **Icon link**: https://static.wikia.nocookie.net/hades_gamepedia_en/images/5/56/Coat_Melino%C3%AB.png/revision/latest/scale-to-width-down/75?cb=20241113133239

- **Aspect of Selene**:
  - **Description**: Enhances Attacks with lunar magic, possibly increasing damage or adding unique effects.
  - **Icon link**: https://static.wikia.nocookie.net/hades_gamepedia_en/images/3/35/Coat_Selene.png/revision/latest/scale-to-width-down/75?cb=20241113133304

- **Aspect of Nyx**:
  - **Description**: Strengthens Specials with night-themed effects, ensuring powerful seeking attacks.
  - **Icon link**: https://static.wikia.nocookie.net/hades_gamepedia_en/images/5/57/Coat_Nyx.png/revision/latest/scale-to-width-down/75?cb=20241113133317

- **Aspect of Shiva (Hidden)**:
  - **Description**: Likely enhances the coat with destructive or transformative effects, possibly boosting damage or range (speculative).
  - **Icon link**: https://static.wikia.nocookie.net/hades_gamepedia_en/images/d/dc/HammerSuit_16.png/revision/latest/scale-to-width-down/75?cb=20250617230730

**2.2 Boons**

The boons within Hades II are divided in 3 types of boons:


## Core Boons

# Hades II Core Boons

## Aphrodite Core Boons

- **Attack**:
  - **Name**: Flutter Strike
  - **Ability**: Close-up Damage: +80%
  - **Description**: Your Attacks deal more damage to nearby foes.
  - **Element**: Water
  - **Icon link**: https://static.wikia.nocookie.net/hades_gamepedia_en/images/c/ca/Flutter_Strike_II.png/revision/latest?cb=20250804105102

- **Special**: 
  - **Name**: Flutter Flourish
  - **Ability**: Close-up Damage: +100%
  - **Description**: Your Specials deal more damage to nearby foes.
  - **Element**: Water
  - **Icon link**: https://static.wikia.nocookie.net/hades_gamepedia_en/images/f/f1/Flutter_Flourish_II.png/revision/latest?cb=20250804105102

- **Cast**:
  - **Name**: Rapture Ring
  - **Ability**: Cast Damage: 10 (every 0.85 sec.)
  - **Description**: Your Casts inflict Weak and damage foes while dragging them toward the center.
  - **Element**: Air
  - **Icon link**: https://static.wikia.nocookie.net/hades_gamepedia_en/images/3/3a/Rapture_Ring_II.png/revision/latest?cb=20250804105102

- **Sprint**: 
  - **Name**: Passion Rush
  - **Ability**: Area Damage: 20
  - **Description**: Dashing damages surrounding foes and inflicts Weak, and once again when you stop.
  - **Element**: Air
  - **Icon link**: https://static.wikia.nocookie.net/hades_gamepedia_en/images/5/5b/Passion_Rush_II.png/revision/latest?cb=20250804105102

- **Magick**:
  - **Name**: Glamour Gain
  - **Ability**: Magick Restoration: 6 (every 1 sec.)
  - **Description**: You inflict Weak on nearby foes and gradually restore Magick while any nearby foe is Weak.
  - **Element**: Air
  - **Icon link**: https://static.wikia.nocookie.net/hades_gamepedia_en/images/7/7c/Glamour_Gain_II.png/revision/latest?cb=20250804105102

## Ares Core Boons

- **Attack**:
  - **Name**: Vicious Strike
  - **Ability**: Attack Damage: +20%
  - **Description**: Your Attacks deal more damage and inflict Wounds.
  - **Element**: Fire
  - **Icon link**: https://static.wikia.nocookie.net/hades_gamepedia_en/images/8/8d/Vicious_Strike_II.png/revision/latest?cb=20250804105102

- **Special**: 
  - **Name**: Vicious Flourish
  - **Ability**: Special Damage: +30%
  - **Description**: Your Specials deal more damage and inflict Wounds.
  - **Element**: Fire
  - **Icon link**: https://static.wikia.nocookie.net/hades_gamepedia_en/images/2/2f/Vicious_Flourish_II.png/revision/latest?cb=20250804105102

- **Cast**:
  - **Name**: Sword Ring
  - **Ability**: Blade Damage: 80
  - **Description**: Your Casts create a falling blade over each foe in the binding circle.
  - **Element**: Fire
  - **Icon link**: https://static.wikia.nocookie.net/hades_gamepedia_en/images/4/4a/Sword_Ring_II.png/revision/latest?cb=20250804105102

- **Sprint**: 
  - **Name**: Stabbing Rush
  - **Ability**: Blades Damage: 30
  - **Description**: Your Dash creates a row of falling blades along your path.
  - **Element**: Fire
  - **Icon link**: https://static.wikia.nocookie.net/hades_gamepedia_en/images/6/6b/Stabbing_Rush_II.png/revision/latest?cb=20250804105102

- **Magick**:
  - **Name**: Grisly Gain
  - **Ability**: Chance of Plasma: 10
  - **Description**: Striking foes with your Weapon may spill Plasma, which also restores 10 Magick.
  - **Element**: Fire
  - **Icon link**: https://static.wikia.nocookie.net/hades_gamepedia_en/images/9/9c/Grisly_Gain_II.png/revision/latest?cb=20250804105102

## Apollo Core Boons

- **Attack**:
  - **Name**: Nova Strike
  - **Ability**: Increased Area Damage
  - **Description**: Your Attacks deal more damage in a larger area.
  - **Element**: Air
  - **Icon link**: https://static.wikia.nocookie.net/hades_gamepedia_en/images/1/1e/Nova_Strike_II.png/revision/latest?cb=20250804105102

- **Special**: 
  - **Name**: Nova Flourish
  - **Ability**: Increased Area Damage
  - **Description**: Your Specials deal more damage in a larger area.
  - **Element**: Air
  - **Icon link**: https://static.wikia.nocookie.net/hades_gamepedia_en/images/3/3f/Nova_Flourish_II.png/revision/latest?cb=20250804105102

- **Cast**:
  - **Name**: Solar Ring
  - **Ability**: Burst Damage
  - **Description**: Your Casts inflict Daze and deal a burst of damage before they expire.
  - **Element**: Air
  - **Icon link**: https://static.wikia.nocookie.net/hades_gamepedia_en/images/5/5a/Solar_Ring_II.png/revision/latest?cb=20250804105102

- **Sprint**: 
  - **Name**: Blinding Rush
  - **Ability**: Faster Sprint
  - **Description**: Your Sprint is faster and inflicts Daze on nearby foes.
  - **Element**: Air
  - **Icon link**: https://static.wikia.nocookie.net/hades_gamepedia_en/images/7/7b/Blinding_Rush_II.png/revision/latest?cb=20250804105102

- **Magick**:
  - **Name**: Lucid Gain
  - **Ability**: Magick Restoration
  - **Description**: If you stand in your Casts when they expire, immediately restore Magick.
  - **Element**: Air
  - **Icon link**: https://static.wikia.nocookie.net/hades_gamepedia_en/images/9/9d/Lucid_Gain_II.png/revision/latest?cb=20250804105102

## Demeter Core Boons

- **Attack**:
  - **Name**: Ice Strike
  - **Ability**: Freeze Damage
  - **Description**: Your Attacks deal more damage and inflict Freeze.
  - **Element**: Water
  - **Icon link**: https://static.wikia.nocookie.net/hades_gamepedia_en/images/2/2c/Ice_Strike_II.png/revision/latest?cb=20250804105102

- **Special**: 
  - **Name**: Ice Flourish
  - **Ability**: Freeze Damage
  - **Description**: Your Specials deal more damage and inflict Freeze.
  - **Element**: Water
  - **Icon link**: https://static.wikia.nocookie.net/hades_gamepedia_en/images/4/4d/Ice_Flourish_II.png/revision/latest?cb=20250804105102

- **Cast**:
  - **Name**: Arctic Ring
  - **Ability**: Repeated Damage
  - **Description**: Your Casts inflict Freeze and repeatedly deal damage to foes in the binding circle.
  - **Element**: Water
  - **Icon link**: https://static.wikia.nocookie.net/hades_gamepedia_en/images/6/6e/Arctic_Ring_II.png/revision/latest?cb=20250804105102

- **Sprint**: 
  - **Name**: Frigid Rush
  - **Ability**: Gust Creation
  - **Description**: Your Sprint forms a Gust around you that lingers after you stop.
  - **Element**: Water
  - **Icon link**: https://static.wikia.nocookie.net/hades_gamepedia_en/images/8/8f/Frigid_Rush_II.png/revision/latest?cb=20250804105102

- **Magick**:
  - **Name**: Tranquil Gain
  - **Ability**: Magick Restoration
  - **Description**: After remaining inactive for 1 sec., rapidly restore Magick until you act.
  - **Element**: Water
  - **Icon link**: https://static.wikia.nocookie.net/hades_gamepedia_en/images/0/0a/Tranquil_Gain_II.png/revision/latest?cb=20250804105102

## Hephaestus Core Boons

- **Attack**:
  - **Name**: Volcanic Strike
  - **Ability**: Blast Damage: 200
  - **Description**: Your Attacks occasionally create a blast that deals 200 damage in the area.
  - **Element**: Fire
  - **Icon link**: https://static.wikia.nocookie.net/hades_gamepedia_en/images/1/1b/Volcanic_Strike_II.png/revision/latest?cb=20250804105102

- **Special**: 
  - **Name**: Heaven Flourish
  - **Ability**: Blast Damage: 400
  - **Description**: Your Specials occasionally create a blast that deals 400 damage in the area.
  - **Element**: Fire
  - **Icon link**: https://static.wikia.nocookie.net/hades_gamepedia_en/images/3/3c/Heaven_Flourish_II.png/revision/latest?cb=20250804105102

- **Cast**:
  - **Name**: Anvil Ring
  - **Ability**: Triple Damage
  - **Description**: Your Casts deal damage 3 times in succession to foes in the binding circle.
  - **Element**: Fire
  - **Icon link**: https://static.wikia.nocookie.net/hades_gamepedia_en/images/5/5d/Anvil_Ring_II.png/revision/latest?cb=20250804105102

- **Sprint**: 
  - **Name**: Smithy Rush
  - **Ability**: Blast Damage: 100
  - **Description**: After you Dash, occasionally create a blast that deals 100 damage around a nearby foe.
  - **Element**: Fire
  - **Icon link**: https://static.wikia.nocookie.net/hades_gamepedia_en/images/7/7e/Smithy_Rush_II.png/revision/latest?cb=20250804105102

- **Magick**:
  - **Name**: Tough Gain
  - **Ability**: Damage Resistance and Magick Restoration
  - **Description**: Whenever you take damage, shrug some of it off and restore 150 Magick.
  - **Element**: Fire
  - **Icon link**: https://static.wikia.nocookie.net/hades_gamepedia_en/images/9/9f/Tough_Gain_II.png/revision/latest?cb=20250804105102

## Hera Core Boons

- **Attack**:
  - **Name**: Sworn Strike
  - **Ability**: Hitch Damage
  - **Description**: Your Attacks deal more damage and inflict Hitch.
  - **Element**: Earth
  - **Icon link**: https://static.wikia.nocookie.net/hades_gamepedia_en/images/2/2a/Sworn_Strike_II.png/revision/latest?cb=20250804105102

- **Special**: 
  - **Name**: Sworn Flourish
  - **Ability**: Hitch Damage
  - **Description**: Your Specials deal more damage and inflict Hitch.
  - **Element**: Earth
  - **Icon link**: https://static.wikia.nocookie.net/hades_gamepedia_en/images/4/4b/Sworn_Flourish_II.png/revision/latest?cb=20250804105102

- **Cast**:
  - **Name**: Engagement Ring
  - **Ability**: Hitch Damage
  - **Description**: Your Casts inflict Hitch and immediately deal damage based on foes in the binding circle.
  - **Element**: Earth
  - **Icon link**: https://static.wikia.nocookie.net/hades_gamepedia_en/images/6/6c/Engagement_Ring_II.png/revision/latest?cb=20250804105102

- **Sprint**: 
  - **Name**: Nexus Rush
  - **Ability**: Hitch on Contact
  - **Description**: Your Sprint inflicts Hitch on contact with foes and deals damage when it does.
  - **Element**: Earth
  - **Icon link**: https://static.wikia.nocookie.net/hades_gamepedia_en/images/8/8d/Nexus_Rush_II.png/revision/latest?cb=20250804105102

- **Magick**:
  - **Name**: Born Gain
  - **Ability**: Magick Restoration
  - **Description**: Whenever you run out of Magick, Prime until the next Location to restore all Magick.
  - **Element**: Earth
  - **Icon link**: https://static.wikia.nocookie.net/hades_gamepedia_en/images/0/0e/Born_Gain_II.png/revision/latest?cb=20250804105102

## Hestia Core Boons

- **Attack**:
  - **Name**: Flame Strike
  - **Ability**: Scorch Damage
  - **Description**: Your Attacks inflict Scorch.
  - **Element**: Fire
  - **Icon link**: https://static.wikia.nocookie.net/hades_gamepedia_en/images/1/1f/Flame_Strike_II.png/revision/latest?cb=20250804105102

- **Special**: 
  - **Name**: Flame Flourish
  - **Ability**: Scorch Damage
  - **Description**: Your Specials inflict Scorch.
  - **Element**: Fire
  - **Icon link**: https://static.wikia.nocookie.net/hades_gamepedia_en/images/3/3a/Flame_Flourish_II.png/revision/latest?cb=20250804105102

- **Cast**:
  - **Name**: Smolder Ring
  - **Ability**: Repeated Scorch Damage
  - **Description**: Your Casts repeatedly inflict Scorch on foes in the binding circle.
  - **Element**: Fire
  - **Icon link**: https://static.wikia.nocookie.net/hades_gamepedia_en/images/5/5b/Smolder_Ring_II.png/revision/latest?cb=20250804105102

- **Sprint**: 
  - **Name**: Heat Rush
  - **Ability**: Scorch on Foes
  - **Description**: Your Sprint destroys most ranged shots near you and inflicts Scorch on foes that fired.
  - **Element**: Fire
  - **Icon link**: https://static.wikia.nocookie.net/hades_gamepedia_en/images/7/7c/Heat_Rush_II.png/revision/latest?cb=20250804105102

- **Magick**:
  - **Name**: Cardio Gain
  - **Ability**: Magick Restoration
  - **Description**: Whenever your Attack or Special deal damage, restore Magick.
  - **Element**: Fire
  - **Icon link**: https://static.wikia.nocookie.net/hades_gamepedia_en/images/9/9d/Cardio_Gain_II.png/revision/latest?cb=20250804105102

## Poseidon Core Boons

- **Attack**:
  - **Name**: Wave Strike
  - **Ability**: Splash Damage
  - **Description**: Your Attacks hit foes with a splash that knocks other foes away.
  - **Element**: Water
  - **Icon link**: https://static.wikia.nocookie.net/hades_gamepedia_en/images/2/2e/Wave_Strike_II.png/revision/latest?cb=20250804105102

- **Special**: 
  - **Name**: Wave Flourish
  - **Ability**: Splash Damage
  - **Description**: Your Specials hit foes with a splash that knocks other foes away.
  - **Element**: Water
  - **Icon link**: https://static.wikia.nocookie.net/hades_gamepedia_en/images/4/4f/Wave_Flourish_II.png/revision/latest?cb=20250804105102

- **Cast**:
  - **Name**: Tidal Ring
  - **Ability**: Splash Damage
  - **Description**: Your Casts also immediately hit foes in front of you with a powerful splash.
  - **Element**: Water
  - **Icon link**: https://static.wikia.nocookie.net/hades_gamepedia_en/images/6/6a/Tidal_Ring_II.png/revision/latest?cb=20250804105102

- **Sprint**: 
  - **Name**: Breaker Sprint
  - **Ability**: Knockback Damage
  - **Description**: Whenever you Sprint, you can damage and knock away the first foe you run into.
  - **Element**: Water
  - **Icon link**: https://static.wikia.nocookie.net/hades_gamepedia_en/images/8/8b/Breaker_Sprint_II.png/revision/latest?cb=20250804105102

- **Magick**:
  - **Name**: Flood Gain
  - **Ability**: Spirit Bubble
  - **Description**: After you strike foes with your Weapon, a Spirit Bubble may appear.
  - **Element**: Water
  - **Icon link**: https://static.wikia.nocookie.net/hades_gamepedia_en/images/0/0c/Flood_Gain_II.png/revision/latest?cb=20250804105102

## Zeus Core Boons

- **Attack**:
  - **Name**: Heaven Strike
  - **Ability**: Blitz Damage
  - **Description**: Your Attacks inflict Blitz.
  - **Element**: Air
  - **Icon link**: https://static.wikia.nocookie.net/hades_gamepedia_en/images/2/21/Heaven_Strike_II.png/revision/latest?cb=20250222151053

- **Special**: 
  - **Name**: Heaven Flourish
  - **Ability**: Blitz Damage
  - **Description**: Your Specials inflict Blitz.
  - **Element**: Air
  - **Icon link**: https://static.wikia.nocookie.net/hades_gamepedia_en/images/4/4d/Heaven_Flourish_II.png/revision/latest?cb=20250804105102

- **Cast**:
  - **Name**: Storm Ring
  - **Ability**: Lightning Bolt Damage
  - **Description**: Your Casts cause lightning bolts to repeatedly strike 1 foe at a time in the binding circle.
  - **Element**: Air
  - **Icon link**: https://static.wikia.nocookie.net/hades_gamepedia_en/images/6/6e/Storm_Ring_II.png/revision/latest?cb=20250804105102

- **Sprint**: 
  - **Name**: Thunder Rush
  - **Ability**: Lightning Bolt Damage
  - **Description**: Dashing causes surrounding foes to be struck by lightning bolts.
  - **Element**: Air
  - **Icon link**: https://static.wikia.nocookie.net/hades_gamepedia_en/images/8/8f/Thunder_Rush_II.png/revision/latest?cb=20250804105102

- **Magick**:
  - **Name**: Ionic Gain
  - **Ability**: Magick Restoration
  - **Description**: In each Encounter, an Aether Font appears in the area and restores all Magick when used.
  - **Element**: Air
  - **Icon link**: https://static.wikia.nocookie.net/hades_gamepedia_en/images/0/0a/Ionic_Gain_II.png/revision/latest?cb=20250804105102


# Non-Standard Boons


# NPC Boons
