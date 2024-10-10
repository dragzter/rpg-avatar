export const API = {
    products: import.meta.env.VITE_APP_API_URL + "/api/products",
    productById: import.meta.env.VITE_APP_API_URL + "/api/product",
    prices: import.meta.env.VITE_APP_API_URL + "/api/prices",
    checkout: import.meta.env.VITE_APP_API_URL + "/api/checkout",
    image: import.meta.env.VITE_APP_API_URL + "/api/image",
    start_image_v2_task: import.meta.env.VITE_APP_API_URL + "/api/task-image-v2",
    start_premium_image: import.meta.env.VITE_APP_API_URL + "/api/repl/start-image-task",
    get_user: import.meta.env.VITE_APP_API_URL + "/api/user",
    redeem_code: import.meta.env.VITE_APP_API_URL + "/api/redeem",
    redeem_code_v2: import.meta.env.VITE_APP_API_URL + "/api/redeem-v2",
    sign_disclaimer: import.meta.env.VITE_APP_API_URL + "/api/user/sign-disclaimer",
    cancel_task: import.meta.env.VITE_APP_API_URL + "/api/cancel-task",
    check_task_status: import.meta.env.VITE_APP_API_URL + "/api/task-status",
    check_premium_task_status: import.meta.env.VITE_APP_API_URL + "/api/repl/image-status",
    start_checkout_session: import.meta.env.VITE_APP_API_URL + "/api/checkout",
    get_finished_images: import.meta.env.VITE_APP_API_URL + "/api/get-images",
    admin_add_codes: import.meta.env.VITE_APP_API_URL + "/api/codes",
    admin_get_token_codes: import.meta.env.VITE_APP_API_URL + "/api/codes/token",
    upload_images: import.meta.env.VITE_APP_API_URL + "/api/upload",
    random_prompt: import.meta.env.VITE_APP_API_URL + "/api/random-prompt",
    delete_user: import.meta.env.VITE_APP_API_URL + "/api/user/delete",
    fb_test_delete_user: import.meta.env.VITE_APP_API_URL + "/api/facebook/data-deletion-callback",
    surprise_prompt: import.meta.env.VITE_APP_API_URL + "/api/surprise-prompt",
    get_images: import.meta.env.VITE_APP_API_URL + "/api/images",
    delete_image: import.meta.env.VITE_APP_API_URL + "/api/image/delete",
    get_user_prompts: import.meta.env.VITE_APP_API_URL + "/api/user/prompts",
    get_prompt: import.meta.env.VITE_APP_API_URL + "/api/prompt",
    delete_prompt: import.meta.env.VITE_APP_API_URL + "/api/prompt/delete",
    delete_many_prompts: import.meta.env.VITE_APP_API_URL + "/api/prompts/delete",
    publish_image: import.meta.env.VITE_APP_API_URL + "/api/image/publish",
    unpublish_image: import.meta.env.VITE_APP_API_URL + "/api/image/unpublish",
    cancel_flux_image: import.meta.env.VITE_APP_API_URL + "/api/repl/cancel",
};

export const STORAGE_KEYS = {
    thumbnails: "thumbnails",
    images: "images",
    user: "user",
    task_id: "task_id",
    images_requested_on: "images_requested_on",
    new_images: "new_images",
};

export const ApiTaskStatus = {
    PENDING: "pending",
    COMPLETE: "complete",
    FAILED: "failed",
    CANCELED: "canceled",
    TIMEOUT: "timeout",
};

export function getCurrencyLabel(amount: number) {
    const formattedAmount = (amount / 100).toFixed(2); // Convert cents to dollars and format to 2 decimal places

    return new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "USD",
    }).format(parseFloat(formattedAmount));
}

export function scrollToOffer(cssId, param, urlParamValue) {
    const urlParams = new URLSearchParams(window.location.search);
    const productOffer = urlParams.get(param);
    if (productOffer === urlParamValue) {
        const productPasses = document.getElementById(cssId);
        if (productPasses) {
            productPasses.scrollIntoView({behavior: "smooth"});
        }
    }
};
