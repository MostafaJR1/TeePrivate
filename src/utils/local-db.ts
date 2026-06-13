"use client";

/**
 * Opens and initializes your local browser IndexedDB database [1.1.2].
 */
export function openDB(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    if (typeof window === "undefined") {
      reject(new Error("IndexedDB cannot be accessed on the server."));
      return;
    }

    const request = indexedDB.open("TeePrivateDashboardDB", 1);

    request.onupgradeneeded = () => {
      const db = request.result;
      if (!db.objectStoreNames.contains("dashboard_cache")) {
        db.createObjectStore("dashboard_cache", { keyPath: "key" });
      }
    };

    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}

/**
 * Saves dashboard metrics directly to local IndexedDB [1.1.2].
 */
export async function setLocalCache(key: string, data: any): Promise<void> {
  try {
    const db = await openDB();
    const tx = db.transaction("dashboard_cache", "readwrite");
    const store = tx.objectStore("dashboard_cache");
    store.put({ key, data, timestamp: Date.now() });
  } catch (err) {
    console.error("IndexedDB write failed:", err);
  }
}

/**
 * Retrieves cached dashboard data instantly from IndexedDB [1.1.2].
 */
export async function getLocalCache(key: string): Promise<any | null> {
  try {
    const db = await openDB();
    return new Promise((resolve) => {
      const tx = db.transaction("dashboard_cache", "readonly");
      const store = tx.objectStore("dashboard_cache");
      const request = store.get(key);
      request.onsuccess = () => resolve(request.result?.data || null);
      request.onerror = () => resolve(null);
    });
  } catch {
    return null;
  }
}