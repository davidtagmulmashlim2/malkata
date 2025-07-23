"use client";

// This is a simple client-side storage for base64 images to avoid localStorage quota issues.
// In a real-world app, you'd use a cloud storage service like Firebase Storage.

const DB_NAME = 'MalkataImageDB';
const STORE_NAME = 'ImageStore';
const DB_VERSION = 1;

interface ImageRecord {
    key: string;
    data: string;
}

let db: IDBDatabase | null = null;
let dbPromise: Promise<IDBDatabase> | null = null;

function getDb(): Promise<IDBDatabase> {
    if (db) {
        return Promise.resolve(db);
    }
    if (dbPromise) {
        return dbPromise;
    }

    dbPromise = new Promise((resolve, reject) => {
        if (typeof window === 'undefined') {
            return reject(new Error('IndexedDB not available on server'));
        }

        const request = indexedDB.open(DB_NAME, DB_VERSION);

        request.onerror = () => {
            console.error('IndexedDB error:', request.error);
            reject(request.error);
        };

        request.onsuccess = (event) => {
            db = (event.target as IDBOpenDBRequest).result;
            resolve(db);
        };

        request.onupgradeneeded = (event) => {
            const database = (event.target as IDBOpenDBRequest).result;
            if (!database.objectStoreNames.contains(STORE_NAME)) {
                database.createObjectStore(STORE_NAME, { keyPath: 'key' });
            }
        };
    });

    return dbPromise;
}

// Store image and return a key
export async function storeImage(dataUrl: string): Promise<string> {
    const key = `img_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
    const record: ImageRecord = { key, data: dataUrl };
    
    const database = await getDb();
    return new Promise((resolve, reject) => {
        const transaction = database.transaction(STORE_NAME, 'readwrite');
        const store = transaction.objectStore(STORE_NAME);
        const request = store.put(record);

        request.onerror = () => reject(request.error);
        request.onsuccess = () => {
            // Also cache it in-memory for sync access
            imageMemoryCache.set(key, dataUrl);
            resolve(key);
        };
    });
}

// Get image by key
export async function getImage(key: string): Promise<string | null> {
    if (imageMemoryCache.has(key)) {
        return imageMemoryCache.get(key) || null;
    }

    const database = await getDb();
    return new Promise((resolve, reject) => {
        const transaction = database.transaction(STORE_NAME, 'readonly');
        const store = transaction.objectStore(STORE_NAME);
        const request = store.get(key);

        request.onerror = () => reject(request.error);
        request.onsuccess = () => {
            if (request.result) {
                imageMemoryCache.set(key, request.result.data);
                resolve(request.result.data);
            } else {
                resolve(null);
            }
        };
    });
}

// Delete image by key
export async function deleteImage(key: string): Promise<void> {
    imageMemoryCache.delete(key);
    const database = await getDb();
    return new Promise((resolve, reject) => {
        const transaction = database.transaction(STORE_NAME, 'readwrite');
        const store = transaction.objectStore(STORE_NAME);
        const request = store.delete(key);

        request.onerror = () => reject(request.error);
        request.onsuccess = () => resolve();
    });
}

// --- In-memory cache for synchronous access ---
const imageMemoryCache = new Map<string, string>();

// Pre-populate cache on load
if (typeof window !== 'undefined') {
    getDb().then(database => {
        const transaction = database.transaction(STORE_NAME, 'readonly');
        const store = transaction.objectStore(STORE_NAME);
        const request = store.getAll();
        request.onsuccess = () => {
            const records = request.result as ImageRecord[];
            records.forEach(record => imageMemoryCache.set(record.key, record.data));
        };
    });
}

// Synchronous getter for initial render
export function getImageSync(key: string): string | null {
    return imageMemoryCache.get(key) || null;
}