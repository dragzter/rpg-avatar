import {
    alchemist,
    artificer,
    barbarian,
    bard,
    beastmaster,
    cleric,
    death_knight,
    druid,
    fighter,
    monk,
    paladin,
    ranger,
    rogue,
    warlock,
    wizard
} from "./characters.js";

export function getRandomSetting(archetype) {
    const character = {
        alchemist,
        artificer,
        barbarian,
        bard,
        beastmaster,
        cleric,
        death_knight,
        druid,
        fighter,
        monk,
        paladin,
        ranger,
        rogue,
        warlock,
        wizard,
    }


    // const archetypeSettings = settings[archetype.toLowerCase()];
    // return archetypeSettings[Math.floor(Math.random() * archetypeSettings.length)];
}