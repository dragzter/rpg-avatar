import {art_style} from "./art-style.js";
import {gatherRandomizedCharacterDetails} from "./helpers.js";

export function promptConstructor(promptDetails, randomize) {
    const character_details = gatherRandomizedCharacterDetails(promptDetails.archetype || "fighter");
    const character_art_style = art_style[promptDetails.art_style || "stylized_realism"]

    if (randomize) {
        return `*AI* A fantasy RPG image of a ${promptDetails.archetype.replace("_", " ")} in the ${character_art_style?.replace("_", " ")}. Characters Appearance: ${character_details.physical_appearance}Scene details: ${character_details.details}Character Attire: ${character_details.attire}${promptDetails.prompt ? "(Emphasize these details: " + promptDetails.prompt + ", 1.4)." : ""},Art Style: ${character_art_style}.*AI*`
    } else {
        if (promptDetails.prompt.startsWith("*AI*") && promptDetails.prompt.includes("*AI*")) {
            console.log("Prompt already contains AI tags")
            return promptDetails.prompt
        }

        return `A fantasy RPG image of a ${promptDetails.archetype.replace("_", " ")} in the ${character_art_style.replace("_", " ")}${promptDetails.prompt ? ", (Emphasize these details: " + promptDetails.prompt + ", 1.4)" : ""})`
    }
}



