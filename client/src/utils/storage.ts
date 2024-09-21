export const storage = {
    g: (key) => {
        try {
            const item = localStorage.getItem(key);

            // Check if the item is valid JSON
            if (item) {
                try {
                    return JSON.parse(item);
                } catch {
                    // If parsing fails, return as a plain string
                    return item;
                }
            }

            return null;
        } catch (error) {
            console.error(`Error getting key "${key}" from localStorage`, error);
            return null;
        }
    },

    s: (key, value) => {
        try {
            if (typeof value === "string") {
                localStorage.setItem(key, value);
                return;
            }

            localStorage.setItem(key, JSON.stringify(value));
        } catch (error) {
            console.error(`Error setting key "${key}" in localStorage`, error);
        }
    },

    rm: (key) => {
        try {
            localStorage.removeItem(key);
        } catch (error) {
            console.error(`Error removing key "${key}" from localStorage`, error);
        }
    },

    clr: () => {
        try {
            localStorage.clear();
        } catch (error) {
            console.error("Error clearing localStorage", error);
        }
    }
};