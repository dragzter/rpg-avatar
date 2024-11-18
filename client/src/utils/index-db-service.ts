const DB_NAME = "AvatarApp";
const STORE_NAME = "BaseImages";
const MAX_IMAGES = 6;

// Initialize IndexedDB
export function initializeDB() {
    return new Promise((resolve, reject) => {
        const request = indexedDB.open(DB_NAME, 1);
        request.onupgradeneeded = (event: any) => {
            const db = event.target?.result;
            db.createObjectStore(STORE_NAME, { keyPath: "id", autoIncrement: true });
        };
        request.onsuccess = (event: any) => resolve(event.target?.result);
        request.onerror = (event: any) => reject(event.target?.error);
    });
}

// Save an image to IndexedDB
export async function saveImageToIndexedDB(file) {
    const db: any = await initializeDB();
    const transaction = db.transaction(STORE_NAME, "readwrite");
    const store = transaction.objectStore(STORE_NAME);

    const countRequest = store.count();
    countRequest.onsuccess = () => {
        if (countRequest.result < MAX_IMAGES) {
            store.add({ file });
        }
    };

    transaction.oncomplete = () => console.log("Image saved to IndexedDB.");
    transaction.onerror = (event) => console.error("Error saving image:", event.target.error);
}

// Retrieve all images from IndexedDB
export async function getAllImagesFromIndexedDB() {
    const db: any = await initializeDB();
    const transaction = db.transaction(STORE_NAME, "readonly");
    const store = transaction.objectStore(STORE_NAME);

    return new Promise((resolve, reject) => {
        const request = store.getAll();
        request.onsuccess = () => resolve(request.result);
        request.onerror = (event) => reject(event.target.error);
    });
}

// Delete an image by ID
export async function deleteImageFromIndexedDB(id) {
    const db: any = await initializeDB();
    const transaction = db.transaction(STORE_NAME, "readwrite");
    const store = transaction.objectStore(STORE_NAME);
    store.delete(id);
    transaction.oncomplete = () => console.log("Image deleted from IndexedDB.");
}
