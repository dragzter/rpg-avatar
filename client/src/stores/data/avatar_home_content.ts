export const AvatarHomeViewContent = {
    page: "home",
    sections: {
        hero: {
            id: "hero",
            content: {
                title: "Design Your Fantasy with Our Advanced, easy to use AI Tools",
                text:
                    "Choose your creative path: Use our RPG avatar maker and character creator" +
                    " to design unique AI RPG avatars, or generate custom AI art" +
                    " and professional 2D game assets that bring your projects to life.",
                buttons: [makeButton("/create-avatar", "Get Started", "primary")],
            },
        },
        page_cta_heading: {
            id: "page_cta_heading",
            content: {
                title: `Design Your Own RPG Character with AI – <span>Create Stunning Avatars & Game Assets Instantly!</span>`,
            },
        },
        solutions: {
            id: "cta",
            content: [
                {
                    title: "Transform Into Your Own Hero",
                    text: "Step into a world of fantasy with our RPG avatar maker. Transform your photo into a high-quality RPG avatar that captures your unique style—perfect for gamers and digital storytellers alike.",
                    routerTo: "/create-avatar",
                    buttonText: "Create RPG Avatar",
                    imagePosition: "left",
                    image: "avatar_ad_55.png",
                },
                {
                    title: "Instant, High-Quality Presets",
                    text:
                        "Our AI character creator makes it easy to generate professional RPG" +
                        " avatars and AI art in seconds. Use our library of presets to generate" +
                        " stunning images.",
                    routerTo: "/gallery",
                    buttonText: "Use Preset Library",
                    imagePosition: "right",
                    image: "avatar_100.png",
                },
                {
                    title: "Epic Fantasy Characters",
                    text:
                        "Immerse yourself in fantasy with our advanced RPG character creator.  Select from a list of " +
                        "preset archetypes and see them created in" +
                        " vivid" +
                        " detail.",
                    routerTo: "/generate-image",
                    buttonText: "Create Characters",
                    imagePosition: "left",
                    image: "character_creator.png",
                },
                // {
                //     title: "Your Face, Your Fantasy",
                //     text: "Whether you’re aiming to be a medieval knight or a futuristic warrior, our tool seamlessly blends your photo with epic fantasy elements. Get ready to create legendary RPG avatars and dynamic AI characters.",
                //     routerTo: "/create-avatar",
                //     buttonText: "Create Your Avatar",
                //     imagePosition: "left",
                //     image: "avatar_1.jpg",
                // },

                // {
                //     title: "Stunning AI Art & Avatars",
                //     text: "Our AI art generator produces breathtaking artwork alongside custom RPG avatars. Perfect for digital galleries, concept art, or unique social media visuals, let your creativity soar.",
                //     routerTo: "/ai-art",
                //     buttonText: "Explore AI Art",
                //     imagePosition: "left",
                //     image: "ai_art.png",
                // },
                // New Entry: 2D Game Assets
                {
                    title: "Professional AI Game Assets",
                    text: "Boost your game development with our AI-powered tool that creates high-quality 2D assets. From sprites to backgrounds, generate custom AI game assets that bring your digital worlds to life.",
                    routerTo: "/2d-game-assets",
                    buttonText: "Generate Art",
                    imagePosition: "right",
                    image: "2d_assets_2_sm.png",
                },
            ],
        },
    },
};

function makeButton(link: string, link_text: string, buttonType = "primary") {
    const buttons = {
        primary: {
            class: "btn-primary btn",
        },
        secondary: {
            class: "btn-secondary btn",
        },
    };

    return {
        link,
        link_text,
        button_classes: buttons[buttonType].class,
    };
}
