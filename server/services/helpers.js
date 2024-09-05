export function getRandomSetting(archetype) {
    const attire = {
        alchemist: "Wears a leather coat with pockets for potions.",
        artificer: "Adorned in a tool-laden apron and reinforced clothing.",
        barbarian: "Draped in fur and leather, with tribal markings.",
        bard: "Wears colorful garments with a lute and feathered cap.",
        beastmaster: "Clad in rugged leathers with animal totems.",
        berserker: "Minimal armor, with scars and war paint.",
        cleric: "Robed in holy vestments with a deity symbol.",
        druid: "Dressed in earthy tones with a cloak of leaves.",
        fighter: "Wears chainmail or plate, ready for combat.",
        hunter: "Camouflaged gear with a hooded cloak.",
        inquisitor: "Clad in dark robes with symbols of authority.",
        monk: "Wears simple robes with bandaged fists.",
        necromancer: "Wears tattered black robes with bones.",
        paladin: "Clad in shining armor with a holy emblem.",
        ranger: "Wears leather armor with a hooded cloak.",
        rogue: "Dark, form-fitting leather armor for stealth.",
        shaman: "Adorned in tribal garb with a staff.",
        sorcerer: "Elegant robes with arcane patterns.",
        spellsword: "Light armor with an enchanted sword.",
        swashbuckler: "Stylish attire with a sash and rapier.",
        warlock: "Dark robes with occult symbols."
    };

    const settings = {
        alchemist: [
            "A mystical laboratory filled with bubbling potions and arcane ingredients.",
            "A secluded forest grove, surrounded by rare herbs and plants.",
            "A grand alchemical tower with shelves of ancient tomes and magical artifacts.",
            "A dark underground cave with glowing crystals and exotic minerals.",
            "A bustling market stall where the alchemist sells their potions to adventurers."
        ],
        artificer: [
            "A cluttered workshop filled with gears, tools, and half-finished inventions.",
            "A steampunk cityscape with towering machines and intricate clockwork.",
            "A war-torn battlefield where the artificer repairs magical constructs.",
            "A royal forge where the artificer crafts weapons for the kingdom.",
            "A secret laboratory hidden beneath a bustling city, filled with experimental devices."
        ],
        barbarian: [
            "A frozen tundra, battling against the harsh elements.",
            "A dense jungle, surviving among wild creatures.",
            "A nomadic camp, resting after a successful raid.",
            "A mountain peak, challenging the gods in single combat.",
            "A burning village, exacting revenge on invaders."
        ],
        bard: [
            "A lively tavern, entertaining a rowdy crowd with tales of adventure.",
            "A royal court, performing before a king and his nobles.",
            "A secluded forest glade, composing a ballad inspired by nature.",
            "A bustling marketplace, gathering stories from passing travelers.",
            "A pirate ship, singing sea shanties to keep the crew's spirits high."
        ],
        beastmaster: [
            "A wild forest, commanding beasts to protect their territory.",
            "A rocky canyon, taming wild creatures native to the region.",
            "A secluded cave, surrounded by loyal animal companions.",
            "A vast savannah, leading a pack of wild predators.",
            "A dark swamp, communicating with ancient and mysterious creatures."
        ],
        berserker: [
            "Atop a sheer cliff, fighting off enemies",
            "A battlefield, unleashing fury upon hordes of enemies.",
            "A gladiatorial arena, fighting to the death for glory.",
            "A dense forest, hunting dangerous game.",
            "A burning village, consumed by rage and vengeance.",
            "A snow-covered mountain, surviving against impossible odds."
        ],
        cleric: [
            "A grand cathedral, praying for divine guidance.",
            "A battlefield, healing the wounded in the heat of combat.",
            "A holy shrine, performing sacred rituals.",
            "A sacred grove, communing with nature spirits.",
            "A small village, protecting the innocent from dark forces."
        ],
        druid: [
            "A lush forest, surrounded by wild animals and ancient trees.",
            "A sacred grove, performing rituals under the full moon.",
            "A mountain peak, calling upon the spirits of the wind.",
            "A tranquil meadow, meditating amidst blooming flowers.",
            "A stormy coastline, controlling the fury of the sea."
        ],
        fighter: [
            "A war-room, reading a large map and discussing a battle plan, surrounded by other fighters",
            "A training ground, honing their combat skills.",
            "A battlefield, leading a charge against enemies.",
            "A gladiatorial arena, fighting for honor and glory.",
            "A war-torn village, defending the helpless.",
            "A royal court, acting as a bodyguard to the king."
        ],
        hunter: [
            "A dense forest, tracking prey with precision.",
            "A mountain range, hunting wild game for survival.",
            "A jungle, navigating through thick foliage in search of a target.",
            "A frozen tundra, stalking a dangerous beast.",
            "A desolate desert, surviving against all odds while on the hunt."
        ],
        inquisitor: [
            "A dark dungeon, interrogating prisoners for hidden truths.",
            "A shadowy alley, tracking down heretics and outlaws.",
            "A grand cathedral, delivering sermons with righteous fury.",
            "A remote village, uncovering hidden evils among the populace.",
            "A battlefield, seeking out and destroying corruption."
        ],
        monk: [
            "A mountain monastery, training in the ways of peace and combat.",
            "A tranquil garden, meditating under a waterfall.",
            "A bustling city, spreading wisdom and protecting the weak.",
            "A sacred temple, mastering the art of martial combat.",
            "A desert oasis, maintaining balance and inner peace."
        ],
        necromancer: [
            "A dark crypt, raising the dead to do their bidding.",
            "A haunted forest, communing with restless spirits.",
            "A cursed battlefield, reanimating fallen soldiers.",
            "A decaying tower, studying ancient texts of forbidden magic.",
            "A desolate wasteland, surrounded by undead minions."
        ],
        paladin: [
            "A grand cathedral, praying for divine guidance before a battle.",
            "A castle battlement, defending against a siege.",
            "A holy shrine, protecting pilgrims from dark forces.",
            "A battlefield, leading a charge against evil.",
            "A sacred grove, where the paladin renews their oath of justice."
        ],
        ranger: [
            "A dense forest, blending seamlessly with the trees.",
            "A snowy mountain, tracking enemies across difficult terrain.",
            "A dark cave, exploring uncharted territory.",
            "A hidden valley, protecting a secret refuge.",
            "A wild plains, riding alongside wild horses."
        ],
        rogue: [
            "A shadowy alley, plotting the next big heist.",
            "A noble's mansion, sneaking through the corridors to steal priceless artifacts.",
            "A crowded marketplace, picking pockets in the bustling crowd.",
            "A hidden thieves' guild, planning a dangerous mission.",
            "A dark forest, ambushing unsuspecting travelers."
        ],
        shaman: [
            "A sacred grove, communing with ancestral spirits.",
            "A volcanic landscape, controlling the fury of the earth.",
            "A desert oasis, calling upon water spirits for guidance.",
            "A stormy coastline, channeling the power of the storm.",
            "A snow-covered tundra, invoking the spirits of the wind."
        ],
        sorcerer: [
            "A mystical tower, studying ancient tomes of arcane knowledge.",
            "A dark cave, summoning elemental forces.",
            "A grand hall, demonstrating their power to awed onlookers.",
            "A stormy coastline, harnessing the power of the sea.",
            "A hidden sanctum, crafting powerful magical artifacts."
        ],
        spellsword: [
            "A battlefield, casting spells while wielding a flaming sword.",
            "A ruined temple, seeking ancient magical knowledge.",
            "A grand arena, demonstrating their combat prowess.",
            "A mystical forest, fending off magical creatures.",
            "A cursed castle, battling against dark forces."
        ],
        swashbuckler: [
            "A pirate ship, dueling on the deck with a cutlass.",
            "A bustling tavern, charming the crowd with tales of adventure.",
            "A noble's mansion, sneaking through the corridors to steal priceless artifacts.",
            "A crowded marketplace, performing acrobatic feats.",
            "A remote island, searching for hidden treasure."
        ],
        warlock: [
            "A foreboding ruin, reading ancient scrolls",
            "A dark forest, communing with otherworldly entities.",
            "A forbidden library, studying ancient texts of dark magic.",
            "A cursed castle, making pacts with malevolent forces.",
            "A shadowy cave, performing dark rituals.",
            "A stormy coastline, summoning eldritch beings from the depths."
        ]
    };

    const archetypeSettings = settings[archetype.toLowerCase()];
    return archetypeSettings[Math.floor(Math.random() * archetypeSettings.length)];
}