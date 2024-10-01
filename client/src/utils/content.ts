import type { ContentItem } from "@/stores/types";

export const SolutionContentItems: ContentItem[] = [
    {
        title: "Unleash Your Imagination with AI",
        text: "Whether you're a dungeon master crafting your next campaign or a player looking to bring your character to life, our AI app lets you generate breathtaking, high-fantasy artwork in just a few clicks. From fierce warriors to magical landscapes, unlock a world of limitless creativity tailored to the RPG universe.",
        imagePosition: "left",
        image: "mage-2.jpg",
        buttonText: "Learn More",
        routerTo: "community-gallery",
    },
    {
        title: "Bring Your Characters to Life",
        text: "Transform your character descriptions into stunning visual representations with our powerful AI tool. Whether it's a noble paladin, a mysterious rogue, or a mystical elven mage, your characters will leap from text to art, capturing the essence of high-fantasy storytelling.",
        imagePosition: "right",
        image: "hunter-2.jpg",
        buttonText: "Learn More",
        routerTo: "community-gallery",
    },
    {
        title: "Custom-Made Art for Campaigns and Adventures",
        text: "Need dynamic visuals for your RPG campaign? Our app generates custom images for your quests, battles, and environments, ensuring your world feels rich and immersive. Elevate your game with personalized art that draws your players deeper into the story.",
        imagePosition: "left",
        image: "alchemist-4.jpeg",
        buttonText: "Learn More",
        routerTo: "community-gallery",
    },
];

export function excerpt(text: string, length: number): string {
    return text.length > length ? text.substring(0, length) + "..." : text;
}