
"use client";

// This is a simple client-side storage for base64 images to avoid localStorage quota issues.
// In a real-world app, you'd use a cloud storage service like Firebase Storage.

const DB_NAME = 'MalkataImageStore';
const STORE_NAME = 'images';

interface DBRequest extends EventTarget {
    result: IDBDatabase;
    error?: DOMException;
}

interface OpenDBRequest extends IDBOpenDBRequest {
    target: DBRequest;
}

const openDB = (): Promise<IDBDatabase> => {
  return new Promise((resolve, reject) => {
    if (typeof window === 'undefined' || !window.indexedDB) {
        // Mock DB for SSR or unsupported environments
        const mockDB = {
            transaction: () => ({
                objectStore: () => ({
                    put: () => ({ onsuccess: null, onerror: null }),
                    get: () => ({ onsuccess: (e: any) => { e.target.result = null; }, onerror: null }),
                    delete: () => ({ onsuccess: null, onerror: null }),
                }),
                oncomplete: null,
                onerror: null,
            }),
            close: () => {}
        } as unknown as IDBDatabase;
        return resolve(mockDB);
    }
      
    const request = indexedDB.open(DB_NAME, 1) as OpenDBRequest;

    request.onupgradeneeded = (event: IDBVersionChangeEvent) => {
        const db = (event.target as any).result as IDBDatabase;
        if (!db.objectStoreNames.contains(STORE_NAME)) {
            db.createObjectStore(STORE_NAME, { keyPath: 'id', autoIncrement: true });
        }
    };
    
    request.onsuccess = (event: Event) => resolve((event.target as any).result as IDBDatabase);
    request.onerror = (event: Event) => reject((event.target as any).error);
  });
};


export async function storeImage(dataUrl: string): Promise<string> {
    if (!dataUrl.startsWith('data:image')) {
        // If it's already a regular URL, just return it
        return dataUrl;
    }
    const db = await openDB();
    return new Promise((resolve, reject) => {
        const transaction = db.transaction([STORE_NAME], 'readwrite');
        const store = transaction.objectStore(STORE_NAME);
        const imageKey = `img-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
        const request = store.put({ id: imageKey, data: dataUrl });

        request.onsuccess = () => resolve(imageKey);
        request.onerror = (event) => reject((event.target as any).error);
    });
}

// In-memory cache for synchronous access
const imageCache = new Map<string, string>();

export async function getImage(key: string): Promise<string | null> {
    if (!key || key.startsWith('http') || key.startsWith('data:')) {
        return key;
    }
    if (imageCache.has(key)) {
        return imageCache.get(key)!;
    }

    const db = await openDB();
    return new Promise((resolve, reject) => {
        const transaction = db.transaction([STORE_NAME], 'readonly');
        const store = transaction.objectStore(STORE_NAME);
        const request = store.get(key);
        
        request.onsuccess = (event) => {
            const result = (event.target as any).result;
            if (result && result.data) {
                imageCache.set(key, result.data);
                resolve(result.data);
            } else {
                // To prevent repeated DB lookups for keys that don't exist
                resolve("https://placehold.co/600x400.png"); 
            }
        };
        request.onerror = (event) => reject((event.target as any).error);
    });
}

export function getImageSync(key: string): string | null {
    if (!key || key.startsWith('http') || key.startsWith('data:')) {
        return key;
    }
    return imageCache.get(key) || null;
}


export async function deleteImage(key: string): Promise<void> {
    if (imageCache.has(key)) {
        imageCache.delete(key);
    }
    const db = await openDB();
    return new Promise((resolve, reject) => {
        const transaction = db.transaction([STORE_NAME], 'readwrite');
        const store = transaction.objectStore(STORE_NAME);
        const request = store.delete(key);
        request.onsuccess = () => resolve();
        request.onerror = (event) => reject((event.target as any).error);
    });
}

// Pre-populate cache on load
if (typeof window !== 'undefined') {
    openDB().then(db => {
        const transaction = db.transaction([STORE_NAME], 'readonly');
        const store = transaction.objectStore(STORE_NAME);
        const request = store.getAll();
        request.onsuccess = (event) => {
            const results = (event.target as any).result as {id: string, data: string}[];
            results.forEach(item => imageCache.set(item.id, item.data));
        }
    });
}
