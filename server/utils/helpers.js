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
    wizard,
} from "./characters.js";
import sharp from "sharp";
import { fileTypeFromBuffer } from "file-type";

export function gatherRandomizedCharacterDetails(archetype) {
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
            return "No data available"; // Handle cases where arrays might be empty
        }
        return array[Math.floor(Math.random() * array.length)];
    };

    // Gather random selections from each attribute (independently)
    const randomSetting = getRandomElement(selectedCharacter.settings);
    const randomAppearance = getRandomElement(
        selectedCharacter.physical_appearance
    );
    const randomDetail = getRandomElement(selectedCharacter.details);
    const randomAttire = getRandomElement(selectedCharacter.attire);

    // Return the gathered prompt details
    return {
        setting: randomSetting,
        physical_appearance: randomAppearance,
        details: randomDetail,
        attire: randomAttire,
    };
}

export function excerpt(text, len) {
    return text?.length > len ? text.substring(0, len) + "..." : text;
}

export async function checkAndConvertImage(
    imageBuffer,
    acceptableFormats = ["jpeg", "jpg", "png", "webp"],
    maxResolution = 2048
) {
    // Ensure imageBuffer is a Buffer
    imageBuffer = Buffer.isBuffer(imageBuffer)
        ? imageBuffer
        : Buffer.from(imageBuffer, "base64");

    // Detect file type and normalize format
    const type = await fileTypeFromBuffer(imageBuffer);
    const format = type ? (type.ext === "jpg" ? "jpeg" : type.ext) : null;

    // Check format validity
    if (!format || !acceptableFormats.includes(format)) {
        throw new Error(`Unsupported image format: ${format || "unknown"}`);
    }

    // Load image into sharp
    let image = sharp(imageBuffer);

    // Convert if not acceptable format
    if (format !== "jpeg") {
        console.log(`Converting ${format} to JPEG...`);
        image = image.toFormat("jpeg");
    }

    // Resize if needed
    const metadata = await image.metadata();
    if (metadata.width > maxResolution || metadata.height > maxResolution) {
        console.log(`Resizing image to max dimension ${maxResolution}...`);
        image = image.resize({
            width: Math.min(metadata.width, maxResolution),
            height: Math.min(metadata.height, maxResolution),
            fit: sharp.fit.inside,
        });
    }

    // Convert to base64 data URL format
    const buffer = await image.toBuffer();
    return `data:image/jpeg;base64,${buffer.toString("base64")}`;
}
