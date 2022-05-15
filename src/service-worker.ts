import type { Update } from './lib/types';
import { openDB } from 'idb';
import { build, files, version } from '$service-worker';

const FILES = `cache${version}`;
const to_cache = build.concat(files);
const staticAssets = new Set(to_cache);

const sw = self as unknown as ServiceWorkerGlobalScope;

sw.addEventListener('install', (event) => {
    event.waitUntil(
        caches
            .open(FILES)
            .then((cache) => cache.addAll(to_cache))
            .then(() => {
                sw.skipWaiting();
            })
    );
});

sw.addEventListener('activate', (event) => {
    event.waitUntil(
        caches.keys().then(async (keys) => {
            for (const key of keys) {
                if (key !== FILES) await caches.delete(key);
            }
            sw.clients.claim();
        })
    );
});

/**
 * Fetch the asset from the network and store it in the cache.
 * Fall back to the cache if the user is offline.
 */
async function fetchAndCache(request: Request) {
    const cache = await caches.open(`offline${version}`);

    try {
        const response = await fetch(request);
        cache.put(request, response.clone());
        return response;
    } catch (err) {
        const response = await cache.match(request);
        if (response) return response;

        throw err;
    }
}

sw.addEventListener('fetch', (event) => {
    const url = new URL(event.request.url);
    const isStaticAsset =
        url.host === self.location.host && staticAssets.has(url.pathname);

    if (isStaticAsset) {
        event.respondWith(caches.match(event.request) as Promise<Response>);
    }
});

sw.addEventListener('periodicsync', (e) => {
    (e as ExtendableEvent).waitUntil(fetchData());
});

async function fetchData() {
    const db = await openDB('db', 2, {
        upgrade(db) {
            db.createObjectStore('kv');
        },
    });
    const token: string | undefined = await db.get('kv', 'token');
    const selectedSites: number[] | undefined = await db.get('kv', 'sites');
    const lastrun: number | undefined = await db.get('kv', 'lastrun');
    if (!token || !selectedSites || !lastrun) return;
    const res = await fetch(
        `https://elearnping-go.fly.dev/api/updates?since=${Math.trunc(
            Date.now() / 1000 - 60 * 60 * 24
        )}`,
        {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        }
    );
    const updates: Update[] = await res.json();

    const newUpdates = updates.filter((update) => update.updates.length > 0);
    if (newUpdates.length > 0) {
        if (Notification.permission == 'granted') {
            await sw.registration.showNotification('elearnping update', {
                body: `có ${newUpdates.length} updates mới kể từ khoảng 24 tiếng trước`,
            });
        }
    }
}
