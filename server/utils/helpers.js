import {
    alchemist,
    artificer,
    barbarian,
    bard,
    beastmaster,
    berserker,
    cleric,
    death_knight,
    druid,
    fighter,
    inquisitor,
    monk,
    necromancer,
    paladin,
    ranger,
    rogue,
    shaman,
    spellsword,
    warlock,
    wizard
} from "./characters.js";

export function gatherRandomizedCharacterDetails(archetype) {
    console.log(archetype)
    // Define all character types
    const characters = {
        alchemist,
        artificer,
        barbarian,
        bard,
        inquisitor,
        beastmaster,
        necromancer,
        cleric,
        death_knight,
        druid,
        fighter,
        monk,
        shaman,
        paladin,
        berserker,
        spellsword,
        ranger,
        rogue,
        warlock,
        wizard,
    };

    const selectedCharacter = characters[archetype];

    if (!selectedCharacter) {
        throw new Error("Invalid archetype provided");
    }

    // Helper function to get a random element from an array
    const getRandomElement = (array) => {
        if (!array || array.length === 0) {
            return "No data available";  // Handle cases where arrays might be empty
        }
        return array[Math.floor(Math.random() * array.length)];
    };

    // Gather random selections from each attribute (independently)
    const randomSetting = getRandomElement(selectedCharacter.settings);
    const randomAppearance = getRandomElement(selectedCharacter.physical_appearance);
    const randomDetail = getRandomElement(selectedCharacter.details);
    const randomAttire = getRandomElement(selectedCharacter.attire);

    // Return the gathered prompt details
    return {
        setting: randomSetting,
        physical_appearance: randomAppearance,
        details: randomDetail,
        attire: randomAttire
    };
}
