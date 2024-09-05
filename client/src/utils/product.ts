export const API = {
    products: import.meta.env.VITE_APP_API_URL + "/api/products",
    productById: import.meta.env.VITE_APP_API_URL + "/api/product",
    prices: import.meta.env.VITE_APP_API_URL + "/api/prices",
    checkout: import.meta.env.VITE_APP_API_URL + "/api/checkout",
    image: import.meta.env.VITE_APP_API_URL + "/api/image",
    image_v2: import.meta.env.VITE_APP_API_URL + "/api/image-v2",
    get_user: import.meta.env.VITE_APP_API_URL + "/api/user",
    redeem_code: import.meta.env.VITE_APP_API_URL + "/api/redeem",
};

export function getCurrencyLabel(amount: number) {
    const formattedAmount = (amount / 100).toFixed(2); // Convert cents to dollars and format to 2 decimal places

    console.log(formattedAmount);
    return new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "USD",
    }).format(parseFloat(formattedAmount));
}
