/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface Icd10Record {
  code: string;
  name: string;
  nameLower?: string;
}

const DB_NAME = 'emscps_icd10_db';
const DB_VERSION = 1;
const STORE_NAME = 'icd10_codes';
const META_STORE = 'icd10_meta';

class Icd10Service {
  private dbPromise: Promise<IDBDatabase> | null = null;

  private getDb(): Promise<IDBDatabase> {
    if (this.dbPromise) return this.dbPromise;

    this.dbPromise = new Promise((resolve, reject) => {
      const request = indexedDB.open(DB_NAME, DB_VERSION);

      request.onupgradeneeded = (event) => {
        const db = (event.target as IDBOpenDBRequest).result;
        
        if (!db.objectStoreNames.contains(STORE_NAME)) {
          const store = db.createObjectStore(STORE_NAME, { keyPath: 'code' });
          store.createIndex('nameLower', 'nameLower', { unique: false });
        }

        if (!db.objectStoreNames.contains(META_STORE)) {
          db.createObjectStore(META_STORE, { keyPath: 'key' });
        }
      };

      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });

    return this.dbPromise;
  }

  /**
   * Get total count of loaded ICD-10 codes and metadata
   */
  async getStats(): Promise<{ count: number; lastUpdated: string | null }> {
    try {
      const db = await this.getDb();
      
      const count = await new Promise<number>((resolve, reject) => {
        const tx = db.transaction(STORE_NAME, 'readonly');
        const store = tx.objectStore(STORE_NAME);
        const req = store.count();
        req.onsuccess = () => resolve(req.result);
        req.onerror = () => reject(req.error);
      });

      const meta = await new Promise<{ lastUpdated?: string } | null>((resolve) => {
        const tx = db.transaction(META_STORE, 'readonly');
        const store = tx.objectStore(META_STORE);
        const req = store.get('stats');
        req.onsuccess = () => resolve(req.result || null);
        req.onerror = () => resolve(null);
      });

      return {
        count,
        lastUpdated: meta?.lastUpdated || null
      };
    } catch (err) {
      console.warn('Error reading ICD-10 stats:', err);
      return { count: 0, lastUpdated: null };
    }
  }

  /**
   * Parse CSV line handling potential quoted commas: "A00.0","Cholera, unspecified"
   */
  private parseCsvLine(line: string): [string, string] | null {
    const trimmed = line.trim();
    if (!trimmed) return null;

    let col1 = '';
    let col2 = '';
    let inQuotes = false;
    let separatorIndex = -1;

    for (let i = 0; i < trimmed.length; i++) {
      const char = trimmed[i];
      if (char === '"') {
        inQuotes = !inQuotes;
      } else if (char === ',' && !inQuotes) {
        separatorIndex = i;
        break;
      }
    }

    if (separatorIndex === -1) {
      // Fallback: split by comma or tab
      const parts = trimmed.split(/,|\t/);
      if (parts.length >= 2) {
        col1 = parts[0].trim().replace(/^"|"$/g, '');
        col2 = parts.slice(1).join(',').trim().replace(/^"|"$/g, '');
      } else {
        return null;
      }
    } else {
      col1 = trimmed.substring(0, separatorIndex).trim().replace(/^"|"$/g, '').replace(/""/g, '"');
      col2 = trimmed.substring(separatorIndex + 1).trim().replace(/^"|"$/g, '').replace(/""/g, '"');
    }

    if (!col1 || !col2) return null;
    return [col1, col2];
  }

  /**
   * High performance chunked streaming parser and batch insert into IndexedDB
   * Supports 74,889+ rows without locking browser UI.
   */
  async importCsvFile(
    file: File,
    onProgress: (loaded: number, totalEst: number) => void
  ): Promise<{ count: number }> {
    const db = await this.getDb();
    const text = await file.text();
    const lines = text.split(/\r?\n/);

    const totalLines = lines.length;
    let startIndex = 0;

    // Check if line 0 is a header (e.g. "code", "name", "CODE", "NAME OF DISEASE")
    if (lines.length > 0) {
      const firstLine = lines[0].toLowerCase();
      if (firstLine.includes('code') || firstLine.includes('disease') || firstLine.includes('name')) {
        startIndex = 1;
      }
    }

    // Step 1: Clear existing codes before importing fresh dataset
    await this.clearAll();

    // Step 2: Ingest in batches of 5,000 records
    const BATCH_SIZE = 5000;
    let currentBatch: Icd10Record[] = [];
    let savedCount = 0;

    for (let i = startIndex; i < totalLines; i++) {
      const line = lines[i];
      const parsed = this.parseCsvLine(line);
      if (!parsed) continue;

      const [code, name] = parsed;
      currentBatch.push({
        code: code.trim().toUpperCase(),
        name: name.trim(),
        nameLower: name.trim().toLowerCase()
      });

      if (currentBatch.length >= BATCH_SIZE) {
        await this.insertBatch(db, currentBatch);
        savedCount += currentBatch.length;
        currentBatch = [];
        onProgress(savedCount, totalLines - startIndex);
        // Yield to browser event loop
        await new Promise((r) => setTimeout(r, 0));
      }
    }

    // Insert remaining batch
    if (currentBatch.length > 0) {
      await this.insertBatch(db, currentBatch);
      savedCount += currentBatch.length;
      onProgress(savedCount, savedCount);
    }

    // Save timestamp metadata
    const txMeta = db.transaction(META_STORE, 'readwrite');
    txMeta.objectStore(META_STORE).put({
      key: 'stats',
      lastUpdated: new Date().toISOString(),
      count: savedCount
    });

    await new Promise((resolve) => {
      txMeta.oncomplete = resolve;
    });

    return { count: savedCount };
  }

  private insertBatch(db: IDBDatabase, batch: Icd10Record[]): Promise<void> {
    return new Promise((resolve, reject) => {
      const tx = db.transaction(STORE_NAME, 'readwrite');
      const store = tx.objectStore(STORE_NAME);

      for (const item of batch) {
        store.put(item);
      }

      tx.oncomplete = () => resolve();
      tx.onerror = () => reject(tx.error);
    });
  }

  /**
   * Fast prefix and substring search across 74,889 codes returning top matches
   */
  async searchCodes(query: string, limit = 50): Promise<Array<{ code: string; name: string }>> {
    const q = query.trim();
    if (!q) return [];

    const db = await this.getDb();
    const qUpper = q.toUpperCase();
    const qLower = q.toLowerCase();

    const results: Array<{ code: string; name: string }> = [];

    return new Promise((resolve, reject) => {
      const tx = db.transaction(STORE_NAME, 'readonly');
      const store = tx.objectStore(STORE_NAME);

      // Strategy 1: Check code index/keyPath prefix using IDBKeyRange
      const codeRange = IDBKeyRange.bound(qUpper, qUpper + '\uffff');
      const codeReq = store.openCursor(codeRange);

      codeReq.onsuccess = (event) => {
        const cursor = (event.target as IDBRequest<IDBCursorWithValue>).result;
        if (cursor && results.length < limit) {
          results.push({
            code: cursor.value.code,
            name: cursor.value.name
          });
          cursor.continue();
        } else {
          // If code prefix filled limit, finish
          if (results.length >= limit) {
            resolve(results);
            return;
          }

          // Strategy 2: If code search didn't exhaust limit, also search disease names
          this.searchByText(db, qLower, results, limit).then(resolve).catch(reject);
        }
      };

      codeReq.onerror = () => reject(codeReq.error);
    });
  }

  private searchByText(
    db: IDBDatabase,
    qLower: string,
    existing: Array<{ code: string; name: string }>,
    limit: number
  ): Promise<Array<{ code: string; name: string }>> {
    const seenCodes = new Set(existing.map((item) => item.code));

    return new Promise((resolve, reject) => {
      const tx = db.transaction(STORE_NAME, 'readonly');
      const store = tx.objectStore(STORE_NAME);
      const req = store.openCursor();

      req.onsuccess = (event) => {
        const cursor = (event.target as IDBRequest<IDBCursorWithValue>).result;
        if (cursor && existing.length < limit) {
          const item = cursor.value;
          if (!seenCodes.has(item.code)) {
            const nameLower: string = item.nameLower || item.name.toLowerCase();
            if (nameLower.includes(qLower)) {
              existing.push({
                code: item.code,
                name: item.name
              });
              seenCodes.add(item.code);
            }
          }
          cursor.continue();
        } else {
          resolve(existing);
        }
      };

      req.onerror = () => reject(req.error);
    });
  }

  /**
   * Truncate ICD-10 store and metadata
   */
  async clearAll(): Promise<void> {
    const db = await this.getDb();
    return new Promise((resolve, reject) => {
      const tx = db.transaction([STORE_NAME, META_STORE], 'readwrite');
      tx.objectStore(STORE_NAME).clear();
      tx.objectStore(META_STORE).clear();
      tx.oncomplete = () => resolve();
      tx.onerror = () => reject(tx.error);
    });
  }
}

export const icd10Service = new Icd10Service();
