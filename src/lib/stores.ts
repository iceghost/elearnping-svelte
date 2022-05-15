import { browser } from '$app/env';
import { openDB, type IDBPDatabase } from 'idb';
import { derived, writable, type Readable, type Writable } from 'svelte/store';
import type { Site, Sites } from './types';

export let db: IDBPDatabase;
export let token = writable<string>();
export let sites: Writable<Sites> = writable();
export let lastrun: Writable<number> = writable();

let resolve: () => void;
export let correctTokenPromise = new Promise<void>((_resolve) => {
    resolve = _resolve;
});
token.subscribe(async ($token) => {
    if ($token) {
        let data = await fetch('https://elearnping-go.fly.dev/api/sites', {
            headers: {
                Authorization: `Bearer ${$token}`,
            },
        }).then((body) => body.json());
        data = Object.fromEntries(Object.entries(data).reverse())
        sites.set(data);
        resolve();
    }
});

export let selectedSites = writable<Set<number>>(undefined);
export let promise = (async () => {
    if (browser) {
        db = await openDB('db', 2, {
            upgrade(db) {
                try {
                    db.createObjectStore('kv');
                } catch (e) {
                    console.log(e)
                }
            },
        });
        const _token = await db.get('kv', 'token');
        token.set(_token);
        token.subscribe(async (token) => {
            await db.put('kv', token, 'token');
        });
        selectedSites.set(new Set((await db.get('kv', 'sites')) ?? []));
        selectedSites.subscribe(async (set) => {
            await db.put('kv', [...set], 'sites');
        });
        lastrun.set((await db.get('kv', 'lastrun')) || 0);
        lastrun.subscribe(async ($last) => {
            await db.put('kv', $last, 'lastrun');
        });
        return;
    }
    return Promise.race([]);
})();
