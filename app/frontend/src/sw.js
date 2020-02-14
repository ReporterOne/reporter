import {
  // CacheFirst, NetworkFirst,
  StaleWhileRevalidate,
} from 'workbox-strategies';
// import {ExpirationPlugin} from 'workbox-expiration';
// import { createHandlerForURL } from 'workbox-precaching/createHandlerForURL';
import {precacheAndRoute, createHandlerBoundToURL} from 'workbox-precaching';
import {NavigationRoute, registerRoute} from 'workbox-routing';
// import {CacheableResponsePlugin} from 'workbox-cacheable-response';
import {BroadcastUpdatePlugin} from 'workbox-broadcast-update';

precacheAndRoute(self.__WB_MANIFEST);
registerRoute(
    new RegExp('/api/'),
    new StaleWhileRevalidate({
      cacheName: 'api-cache',
      plugins: [
        new BroadcastUpdatePlugin(),
      ],
    }),
);

// registerRoute(
//   // Cache image files.
//   new RegExp("/api/v1/dates_status/reasons"),
//   // Use the cache if it's available.
//   new CacheFirst({
//     // Use a custom cache name.
//     cacheName: 'api-cache',
//     plugins: [
//       new ExpirationPlugin({
//         maxEntries: 20,
//         maxAgeSeconds: 24 * 60 * 60,
//       }),
//       new CacheableResponsePlugin({
//         statuses: [200]
//       })
//     ],
//   })
// );
// registerRoute(
//   // Cache image files.
//   new RegExp("/api/v1/users/me/allowed_users"),
//   // Use the cache if it's available.
//   new NetworkFirst({
//     // Use a custom cache name.
//     cacheName: 'api-cache',
//     plugins: [
//       new ExpirationPlugin({
//         maxEntries: 20,
//         // Cache for a maximum of a day.
//         maxAgeSeconds: 24 * 60 * 60,
//       }),
//       new CacheableResponsePlugin({
//         statuses: [200]
//       })
//     ],
//   })
// );
const handler = createHandlerBoundToURL('/index.html');
// const strategy = new NetworkFirst({
//   cacheName: 'cached-navigations',
//   plugins: [
//     // Any plugins, like `ExpirationPlugin`, etc.
//   ],
// });
const navigationRoute = new NavigationRoute(handler, {
  denylist: [
    new RegExp('/api'),
  ],
});
registerRoute(navigationRoute);


self.addEventListener('message', async (event) => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
  if (event.meta === 'workbox-broadcast-update') {
    const {cacheName, updatedUrl} = event.data.payload;

    // Do something with cacheName and updatedUrl.
    // For example, get the cached content and update
    // the content on the page.
    const cache = await caches.open(cacheName);
    const updatedResponse = await cache.match(updatedUrl);
    const updatedText = await updatedResponse.text();
    console.log(event, updatedText);
  }
});

