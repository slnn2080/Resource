console.log('[SW-LOG INFO]: proctor-1.0.0-sw.js!');

/**
 *  install イベントのイベントハンドラ
 *
 * @see https://developer.mozilla.org/ja/docs/Web/API/ServiceWorkerGlobalScope/install_event
 */
self.addEventListener('install', function (event) {
  console.log('[LOG INFO] new ServiceWorker install', event);
  event.waitUntil(self.skipWaiting());
});

/**
 * activate イベントのイベントハンドラ
 *
 * @see https://developer.mozilla.org/ja/docs/Web/API/ServiceWorkerGlobalScope/activate_event
 */
self.addEventListener('activate', function (event) {
  clients.claim();
  console.log('[LOG INFO] activate Ready!(controllerをactivate状態にします。)', event);
});

/**
 * fetch イベントのイベントハンドラ
 *
 * @see https://developer.mozilla.org/ja/docs/Web/API/ServiceWorkerGlobalScope/onfetch
 */
self.addEventListener('fetch', function (event) {
});

/**
 * message イベントのイベントハンドラ
 *
 * @param {{
 *          data: {
 *            request: string;
 *            params: {
 *              title: string;
 *              options: {
 *                // @see https://developer.mozilla.org/ja/docs/Web/API/ServiceWorkerRegistration/showNotification
 *              }
 *            }
 *          }
 *        }} event
 *
 * @see https://developer.mozilla.org/ja/docs/Web/API/ServiceWorkerGlobalScope/message_event
 */
self.addEventListener('message', function (event) {
  console.log('message');

  var request = event.data.request
  switch (request) {
    case 'notification':
      var result = true

      var params = event.data.params
      self.registration.showNotification(params.title, params.options)
        .then(function() {
          result = true
        })
        .catch(function() {
          result = false
        })
        .finally(function() {
          console.log('message:notification_result');
          self.clients.matchAll().then(function (clients) {
            clients.forEach(function(client) {
              client.postMessage({
                request: 'notification_result',
                result: result,
              });
            })
          });
        })
      break;
  }
});

/**
 * システム通知がクリックされた時に呼び出されるイベントハンドラ
 *
 * @see https://developer.mozilla.org/ja/docs/Web/API/ServiceWorkerGlobalScope/notificationclick_event
 */
self.addEventListener('notificationclick', function(event) {
  console.log('notificationclick');
  console.log(event);
  self.clients.matchAll().then(function (clients) {
    clients.forEach(function(client) {
      client.postMessage(event.action);
    })
  });
  event.notification.close();
}, false);

/**
 * 通知をユーザーが閉じるたびに呼び出されるイベントハンドラ
 *
 * @see https://developer.mozilla.org/ja/docs/Web/API/ServiceWorkerGlobalScope/onnotificationclose
 */
self.addEventListener('notificationclose', function(event) {
  console.log('notificationclose');
  console.log(event);
}, false);

