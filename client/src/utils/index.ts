export const API = {
    products: import.meta.env.VITE_APP_API_URL + "/api/products",
    productById: import.meta.env.VITE_APP_API_URL + "/api/product",
    prices: import.meta.env.VITE_APP_API_URL + "/api/prices",
    checkout: import.meta.env.VITE_APP_API_URL + "/api/checkout",
    image: import.meta.env.VITE_APP_API_URL + "/api/image",
    start_image_v2_task:
        import.meta.env.VITE_APP_API_URL + "/api/task-image-v2",
    get_user: import.meta.env.VITE_APP_API_URL + "/api/user",
    redeem_code: import.meta.env.VITE_APP_API_URL + "/api/redeem",
    redeem_code_v2: import.meta.env.VITE_APP_API_URL + "/api/redeem-v2",
    sign_disclaimer:
        import.meta.env.VITE_APP_API_URL + "/api/user/sign-disclaimer",
    cancel_task: import.meta.env.VITE_APP_API_URL + "/api/cancel-task",
    check_task_status: import.meta.env.VITE_APP_API_URL + "/api/task-status",
    start_checkout_session: import.meta.env.VITE_APP_API_URL + "/api/checkout",
    get_finished_images: import.meta.env.VITE_APP_API_URL + "/api/get-images",
    admin_add_codes: import.meta.env.VITE_APP_API_URL + "/api/codes",
    admin_get_token_codes:
        import.meta.env.VITE_APP_API_URL + "/api/codes/token",
    upload_images: import.meta.env.VITE_APP_API_URL + "/api/upload",
    random_prompt: import.meta.env.VITE_APP_API_URL + "/api/random-prompt",
    delete_user: import.meta.env.VITE_APP_API_URL + "/api/user/delete",
    fb_test_delete_user:
        import.meta.env.VITE_APP_API_URL +
        "/api/facebook/data-deletion-callback",
    surprise_prompt: import.meta.env.VITE_APP_API_URL + "/api/surprise-prompt",
};

export const ApiTaskStatus = {
    PENDING: "pending",
    COMPLETE: "complete",
    FAILED: "failed",
    CANCELED: "canceled",
    TIMEOUT: "timeout",
};

export const ImageOptions = [
    {
        label: "512x512",
        size: {
            width: 512,
            height: 512,
        },
        ratio: "1:1",
        cssClass: "ratio-1x1",
        recommended: false,
    },
    {
        label: "1024x1024",
        size: {
            width: 1024,
            height: 1024,
        },
        ratio: "1:1",
        cssClass: "ratio-1x1",
        recommended: true,
    },
    // {
    //     label: "2048x2048",
    //     size: {
    //         width: 2048,
    //         height: 2048,
    //     },
    //     ratio: "1:1",
    //     cssClass: "ratio-1x1",
    //     recommended: false,
    // },
    {
        label: "1280x1024",
        size: {
            width: 1280,
            height: 1024,
        },
        ratio: "5:4",
        cssClass: "ratio-5x4",
        recommended: false,
    },
    {
        label: "1536x1024",
        size: {
            width: 1536,
            height: 1024,
        },
        ratio: "3:2",
        cssClass: "ratio-3x2",
        recommended: false,
    },
];

export function getCurrencyLabel(amount: number) {
    const formattedAmount = (amount / 100).toFixed(2); // Convert cents to dollars and format to 2 decimal places

    return new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "USD",
    }).format(parseFloat(formattedAmount));
}
