/* ============================================================
   Myšlenkové mapy – service worker
   ------------------------------------------------------------
   1) Aplikace se otevře i bez sítě (poslední načtená verze).
      Když síť je, vždy se bere čerstvá verze – stará kopie
      se použije jen jako záloha.
   2) „Sdílet -> Myšlenkové mapy“: obrázek poslaný z galerie
      nebo ze snímku obrazovky se uloží do schránky aplikace
      (Cache „mm-shared“) a nabídne se ke vložení do mapy.
   S Google Diskem tenhle soubor nemluví vůbec.
   ============================================================ */
const VERSION = 'mm-app-v11';
const SHARED = 'mm-shared';
const SHELL = ['./', 'config.js', 'manifest.webmanifest', 'icon-192.png', 'icon-512.png', 'icon-maskable-512.png'];

self.addEventListener('install', (event) => {
  event.waitUntil((async () => {
    const cache = await caches.open(VERSION);
    /* po jednom – když některý soubor na webu chybí, zbytek se uloží i tak */
    await Promise.all(SHELL.map((u) => cache.add(new Request(u, { cache: 'reload' })).catch(() => {})));
    await self.skipWaiting();
  })());
});

self.addEventListener('activate', (event) => {
  event.waitUntil((async () => {
    const keys = await caches.keys();
    await Promise.all(keys.filter((k) => k.indexOf('mm-app-') === 0 && k !== VERSION).map((k) => caches.delete(k)));
    await self.clients.claim();
  })());
});

async function receiveShare(request) {
  let n = 0;
  try {
    const form = await request.formData();
    const files = form.getAll('images').filter((f) => f && typeof f === 'object' && f.size > 0);
    const cache = await caches.open(SHARED);
    const stamp = Date.now();
    for (const f of files.slice(0, 12)) {
      if (!/^image\//.test(f.type || '') && !/\.(png|jpe?g|webp|gif|avif|bmp)$/i.test(f.name || '')) continue;
      const key = new URL('__shared__/' + stamp + '-' + String(n).padStart(2, '0'), self.registration.scope).href;
      await cache.put(key, new Response(f, { headers: { 'Content-Type': f.type || 'image/jpeg', 'Cache-Control': 'no-store' } }));
      n++;
    }
  } catch (e) { /* nic jsme nepřijali – aplikace to uživateli řekne */ }
  return Response.redirect(new URL('./?shared=' + n, self.registration.scope).href, 303);
}

/** síť s časovým limitem; když neodpoví, vezmeme uloženou kopii */
async function networkFirst(request, isPage) {
  const cache = await caches.open(VERSION);
  const cached = async () => (await cache.match(request, { ignoreSearch: isPage })) || (isPage ? cache.match('./') : undefined);
  try {
    const fresh = await Promise.race([
      fetch(request),
      new Promise((res, rej) => setTimeout(() => rej(new Error('timeout')), isPage ? 4000 : 8000))
    ]);
    if (fresh && fresh.ok && fresh.type === 'basic') {
      cache.put(isPage ? './' : request, fresh.clone()).catch(() => {});
    }
    return fresh;
  } catch (e) {
    const old = await cached();
    if (old) return old;
    return fetch(request);
  }
}

self.addEventListener('fetch', (event) => {
  const request = event.request;
  const url = new URL(request.url);
  if (url.origin !== self.location.origin) return;                 // Google a spol. jdou mimo nás
  if (request.method === 'POST' && /\/share-target$/.test(url.pathname)) {
    event.respondWith(receiveShare(request));
    return;
  }
  if (request.method !== 'GET') return;
  if (url.pathname.indexOf('/__shared__/') >= 0) return;
  const isPage = request.mode === 'navigate';
  event.respondWith(networkFirst(request, isPage));
});
