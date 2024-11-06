function getModelRequestBoilerPlate() {
    const aspect_ratio = (request) =>
        request.size.width !== 1024 ? "custom" : "1:1";

    return {
        flux_11_pro: {
            get: (req) => {
                return {
                    prompt: req.prompt,
                    disable_safety_checker: true,
                    output_quality: 100,
                    output_format: "jpg",
                    width: req.size?.width || 1024, // max 1440
                    height: req.size?.height || 1024, // max 1440
                    aspect_ratio: aspect_ratio(req),
                    safety_tolerance: 5,
                    prompt_upsampling: true,
                };
            },
            cost: 3,
        },
        flux_pro: {
            get: (req) => {
                return {
                    prompt: req.prompt,
                    disable_safety_checker: true,
                    output_quality: 100,
                    output_format: "jpg",
                    steps: 30,
                    width: req.size?.width || 1024, // max 1440
                    height: req.size?.height || 1024, // max 1440
                    guidance: req.adherence || 3,
                    interval: 2,
                    aspect_ratio: aspect_ratio(req),
                    safety_tolerance: 5,
                    prompt_upsampling: true,
                };
            },
            cost: 4,
        },
        flux_schnell: {
            get: (req) => {
                return {
                    prompt: req.prompt,
                    go_fast: false,
                    megapixels: "1",
                    num_outputs: req.count || 1,
                    aspect_ratio: "1:1",
                    output_format: "jpg",
                    output_quality: 100,
                    num_inference_steps: 4,
                    disable_safety_checker: true,
                    width: 1024,
                    height: 1024,
                };
            },
            cost: 1,
        },
    };
}
function getPresets() {
    return {
        preset_1: {
            name: "Bikini photo shoot",
            prompt: "from the hips up image, incredibly gorgeous brunette woman wearing black bikini on a beach",
            adherence: 3, // guidance
            size: {
                width: 1024,
                height: 1024,
            },
        },
        preset_2: {
            name: "Club Duo",
            prompt:
                "close up 2 gorgeous and voluptuous girls, one brunette and one blonde with" +
                " flowing hair, early 20s, smiling, slender bodies, dancing on the crowded dance" +
                " floor, facing the camera in a night club, wearing a tank-top and tight spandex shorts, electronic dance club vibes",
            adherence: 3, // guidance
            size: {
                width: 1024,
                height: 1024,
            },
        },
        preset_3: {
            name: "Sylvan Goddess",
            prompt: "Close up image of gorgeous sylvan sorceress, white hair, voluptuous and slender, bare legs, wearing low cut sheer dress adorned with intricate nature patterns and real flowers, she is sitting by a waterfall, looking straight on at the camera enjoying herself, sensual pose, high res photography ",
            adherence: 3, // guidance
            size: {
                width: 1024,
                height: 1024,
            },
        },
        preset_4: {
            name: "Forest Siren",
            prompt:
                "Close up image of gorgeous woman model, voluptuous and slender, arms" +
                " resting on her head, wearing low cut sheer green dress adorned with intricate nature patterns and real flowers, she is by a waterfall , eyes closed as if enjoying herself, sensual pose, high res photography ",
            adherence: 3, // guidance
            size: {
                width: 1024,
                height: 1024,
            },
        },
        preset_5: {
            name: "Battle Priestess",
            prompt: "a gorgeous brunette battle priestess, voluptuous and fit, long flowing hair, wearing a low cut white silk dress with slit in front and metallic armor accents, wearing high heels and her legs are bare, sitting on a stone infront of an ancient stone structure, sensual pose",
            adherence: 3, // guidance
            size: {
                width: 1024,
                height: 1024,
            },
        },
        preset_6: {
            name: "Looking Back",
            prompt: "close up gorgeous and voluptuous brunette with flowing hair, early 20s, smiling, turned away and looking back, slender body, behind the bar at a night club, backless, lowcut tight black dress, dark trendy atmosphere, dance vibes",
            adherence: 3, // guidance
            size: {
                width: 1024,
                height: 1024,
            },
        },
        preset_7: {
            name: "Sheer Magic",
            prompt: "insanely gorgeous brunette, smiling, incredibly voluptuous, slender, sitting next to a river, she's holding a black flower, low cut sheer black and pink robe, intricate magical patterns, legs bare, barefoot, detailed, fantasy adventure vibes",
            adherence: 3, // guidance
            size: {
                width: 1024,
                height: 1024,
            },
        },
        preset_8: {
            name: "The Dance",
            prompt:
                "Insanely gorgeous brunette girl, dancing at a night club.  She is very" +
                " attractive, voluptuous, fit and toned.  She's wearing a white tank top and cut off shorts, dancing on a dark dance floor, lots of people dancing in the background",
            adherence: 3, // guidance
            size: {
                width: 1024,
                height: 1024,
            },
        },
        preset_9: {
            name: "Prayer",
            prompt:
                "insanely gorgeous priestess, incredibly voluptuous, slender, kneeling" +
                " before a shrine, eyes closed, low cut white dress, legs bare, barefoot",
            adherence: 3, // guidance
            size: {
                width: 1024,
                height: 1024,
            },
        },
        preset_10: {
            name: "Battle Weary Warrior",
            prompt: "in a mountain pass, a stunning fighter in torn, revealing chainmail fights with deadly speed. Her face contorted with desperation, she slices through enemies with her swords, the dim light flickering against her toned, exposed skin. The cavern echoes with the sounds of chaos as she battles in the darkness, surrounded by the roar of enemies closing in.",
            adherence: 3, // guidance
            size: {
                width: 1024,
                height: 1024,
            },
        },
        preset_11: {
            name: "At The Villa",
            prompt: "a gorgeous brunette, voluptuous and fit, she is posing in a sensual setting, sitting on a stone, legs crossed,  italian stone villa. barefoot and bare-legged, sensual atmosphere, she has long, flowing hair, low cut red dress, bare legs ",
            adherence: 3, // guidance
            size: {
                width: 1024,
                height: 1024,
            },
        },
        preset_12: {
            name: "Leather-clad Rogue",
            prompt: "a gorgeous brunette, voluptuous and fit, she is standing next to a stone wall sitting on the floor, legs stretched out. barefoot, sensual atmosphere, dagger in hand long flowing hair, low cut leather tunic, bare legs, adventurous  atmosphere ",
            adherence: 3, // guidance
            size: {
                width: 1024,
                height: 1024,
            },
        },
        preset_13: {
            name: "Blue Sorceress",
            prompt: "a gorgeous brunette mage, voluptuous and fit, she is standing in an ancient library, sitting on the floor, legs stretched out.  In a great mansion, light piercing the room through a window above, barefoot, sensual atmosphere, magical staff in hand long flowing hair, low cut blue dress, bare legs, magical atmosphere ",
            adherence: 3, // guidance
            size: {
                width: 1024,
                height: 1024,
            },
        },
        preset_14: {
            name: "Pool-side Dreams",
            prompt: "Create a close-up, photorealistic, high-quality image of a stunning brunette with wavy hair, wearing a sleek pink bikini. She leans against the edge of the pool, her arms resting on the tiles as she gazes off into the distance, her body glistening from the water. The natural light reflects off her toned figure, capturing the serene, luxurious atmosphere of a sunlit summer day by the pool.",
            adherence: 3, // guidance
            size: {
                width: 1024,
                height: 1024,
            },
        },
        preset_15: {
            name: "Golden Bikini",
            prompt: "A stunning brunette with long wavy hair sits barefoot on the soft sands of a tropical beach, her legs stretched out in front of her. She wears a shimmering gold bikini that hugs her slim yet voluptuous figure, her skin glowing in the warm sunset light. Her toes sink into the sand as she leans back on her arms, gazing peacefully at the horizon, the waves gently lapping at the shore behind her.",
            adherence: 3, // guidance
            size: {
                width: 1024,
                height: 1024,
            },
        },
        preset_16: {
            name: "The Baseball Fan",
            prompt:
                "Insanely gorgeous blonde girl, wearing a baseball hat at an amusement park" +
                " cheering She is very attractive, voluptuous, fit and toned. Wearing cutoffs and flannel shirt, close up shot, ultra detail, photorealistic photography ",
            adherence: 3, // guidance
            size: {
                width: 1024,
                height: 1024,
            },
        },
        preset_17: {
            name: "Pool-side Dreams Redux",
            prompt: "Create a close-up, photorealistic, high-quality image of a brunette with wet, wavy hair, wearing a strappy black bikini. She sits on the edge of the pool, droplets of water glistening on her toned body as she leans back, enjoying the sun. The natural light enhances the sleek lines of her fit figure, capturing a calm, sun-soaked poolside moment",
            adherence: 3, // guidance
            size: {
                width: 1024,
                height: 1024,
            },
        },
    };
}

function getPresetConfig(config_id, model) {
    const presets = getPresets();
    const model_boiler_plate = getModelRequestBoilerPlate();

    return {
        input: model_boiler_plate[model].get(presets[config_id]),
        cost: model_boiler_plate[model].cost,
        nsfw_pass: true,
        rpg_presets: false,
        randomize: false,
        count: 1,
        model,
    };
}

export { getPresetConfig };
