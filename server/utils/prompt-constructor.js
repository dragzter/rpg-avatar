import { art_style } from "./art-style.js";
import { gatherRandomizedCharacterDetails } from "./helpers.js";

export function promptConstructor(promptDetails, randomize) {
    const character_details = gatherRandomizedCharacterDetails(
        promptDetails.archetype || "fighter"
    );
    const character_art_style =
        art_style[promptDetails.art_style || "stylized_realism"];

    if (randomize) {
        return `*AI* A fantasy RPG image of a ${promptDetails.archetype.replace("_", " ")} in the ${character_art_style?.replace("_", " ")}. ${character_details.physical_appearance} ${character_details.details} Wearing ${character_details.attire} ${character_details.setting} *AI*`;
    } else {
        if (
            promptDetails.prompt?.startsWith("*AI*") &&
            promptDetails.prompt?.includes("*AI*")
        ) {
            console.log("Prompt already contains AI tags");
            return promptDetails.prompt;
        }

        return `A fantasy RPG image of a ${promptDetails.archetype.replace("_", " ")} in the    ${character_art_style.replace("_", " ")}${promptDetails.prompt ? ", (Emphasize these details: " + promptDetails.prompt + ", 1.4)" : ""})`;
    }
}

export function promptConstructorV2(promptDetails) {
    const character_art_style =
        art_style[promptDetails.art_style || "stylized_realism"];

    return `A fantasy RPG image of a ${promptDetails?.archetype?.replace("_", " ")} in the ${promptDetails.art_style} art style. ${character_art_style?.replace("_", " ")}${promptDetails?.prompt ? ", (Emphasize these details: " + promptDetails?.prompt + ", 1.4)" : ""})`;
}

export function promptEnhance(promptString) {
    const possibleTerms = [
        "female",
        "girl",
        "brunette",
        "woman",
        "lady",
        "princess",
        "queen",
        "goddess",
        "feminine",
        "she",
    ];
    if (promptString?.includes("female")) {
        return (
            promptString.replaceAll('"', "") +
            " She is gorgeous, perfect body, fit physique, perfect hourglass figure, large breasts. Perfect face"
        );
    }

    return promptString;
}
