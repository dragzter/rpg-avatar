import { PromptModel } from "../db/model.js";


// Fix the prompt dates
export async function updatePromptDatesToISO() {
    try {
        // Fetch all prompts
        const prompts = await PromptModel.find({}).exec();

        console.log("Updating prompt dates to ISO format...", prompts);
        const updatePromises = prompts.map(async (prompt) => {
            let updatedDate = new Date(prompt.created);


            // If the date was successfully converted, save the updated ISO date
            if (!isNaN(updatedDate)) {
                prompt.created = updatedDate.toISOString();
                return prompt.save(); // Save the updated prompt
            }
        });

        // Wait for all updates to complete
        await Promise.all(updatePromises);

        console.log('All dates have been updated to ISO format.');
    } catch (err) {
        console.error('Error updating prompt dates:', err);
    }
}
