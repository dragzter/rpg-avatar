export const AvatarHomeViewContent = {
    page: "home",
    sections: {
        hero: {
            id: "hero",
            content: {
                title: "Transform Yourself into an AI-Generated Avatar",
                text: "Upload your photo and let AI craft a stunning, high-quality avatar of you. Whether for social media, gaming, or just for fun, create a unique digital identity that stands out.",
                buttons: [makeButton("/create-avatar", "Get Started", "primary")],
            },
        },
        page_cta_heading: {
            id: "page_cta_heading",
            content: {
                title: `Create Your Own RPG Character with AI – <span> Create Stunning Avatars Instantly!</span>`,
            },
        },
        solutions: {
            id: "cta",
            content: [
                {
                    title: "Make Every Occasion Memorable",
                    text: "Step into a fantasy world with custom AI-generated avatars. Whether it’s for a holiday, birthday, or just for fun, transform yourself into a historical icon, a mythical hero, or anything you can imagine.",
                    routerTo: "/create-avatar",
                    buttonText: "Create Avatar",
                    imagePosition: "left",
                    image: "avatar_ad_55.png",
                },
                {
                    title: "Instant Avatars, Anytime, Anywhere",
                    text: "Creating your AI-powered avatar has never been easier. Simply upload a face image and select a base image from our extensive library—or use your own! Our AI takes care of the rest, delivering a polished and lifelike avatar in seconds.",
                    routerTo: "/create-avatar",
                    buttonText: "Create Avatar",
                    imagePosition: "right",
                    image: "avatar_ad_57.png",
                },
                {
                    title: "Your Face, Your Fantasy",
                    text: "Turn yourself into the character of your dreams with AI-generated avatars. Whether you want to be a medieval knight, a sci-fi warrior, or a timeless legend, simply upload your face and match it with a striking base image. Perfect for gaming, social media, or just having fun with friends!",
                    routerTo: "/create-avatar",
                    buttonText: "Create Avatar",
                    imagePosition: "left",
                    image: "avatar_1.jpg",
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
