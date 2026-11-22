// Ronron — service worker : l'appli marche hors ligne et se met à jour proprement.
// ⚠️ À CHAQUE MISE À JOUR : augmente VERSION (et VERSION_APP dans js/app.js).
const VERSION = '1.5.0';
const CACHE = 'ronron-' + VERSION;
const FICHIERS = [
  './', './index.html', './manifest.webmanifest',
  './css/app.css', './css/polices.css',
  './js/app.js', './js/chat.js', './js/donnees.js', './js/sons.js', './js/haptique.js',
  './icons/icon-192.png', './icons/icon-512.png', './icons/icon-maskable-512.png', './icons/apple-touch-icon.png', './icons/favicon-32.png',
  './fonts/fredoka-latin-500-normal.woff2', './fonts/fredoka-latin-600-normal.woff2',
  './fonts/nunito-latin-600-normal.woff2', './fonts/nunito-latin-700-normal.woff2', './fonts/nunito-latin-800-normal.woff2',
];

self.addEventListener('install', (e) => {
  e.waitUntil(caches.open(CACHE).then((c) => c.addAll(FICHIERS.map((f) => new Request(f, { cache: 'reload' })))));
});

self.addEventListener('activate', (e) => {
  e.waitUntil(
    caches.keys()
      .then((cles) => Promise.all(cles.filter((k) => k.startsWith('ronron-') && k !== CACHE).map((k) => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener('message', (e) => { if (e.data === 'activer') self.skipWaiting(); });

self.addEventListener('fetch', (e) => {
  const req = e.request;
  if (req.method !== 'GET' || new URL(req.url).origin !== location.origin) return;
  if (req.mode === 'navigate') {
    e.respondWith(caches.match('./index.html').then((r) => r || fetch(req)));
    return;
  }
  e.respondWith(caches.match(req, { ignoreSearch: true }).then((r) => r || fetch(req)));
});
