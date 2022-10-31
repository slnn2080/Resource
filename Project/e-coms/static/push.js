/**
 * サービスワーカーをセットアップします
 *
 * @return {Promise<boolean>} このセットアップはreject()をしませんつねにresolve()のみ返します
 */
function startupServiceWorker() {
  if (!'serviceWorker' in navigator) {
    return Promise.resolve(false)
  }

  return new Promise((resolve) => {
    (new Promise(function(resolve) {
      navigator.serviceWorker.getRegistrations().then(function(registrations) {
        return resolve(Promise.all(registrations.map(function(v) { return v.unregister() })))
      })
    }))
    .finally(function() {
      navigator.serviceWorker.register('proctor-1.0.0-sw.js')
        .then(() => {
          console.log('register');
          return navigator.serviceWorker.ready;
        })
        .then((registration) => {
          console.log('ready');
          if (registration.active) {
            resolve(true);
          } else {
            resolve(false);
          }
        })
        .catch((e) => {
          console.log(e)
          return resolve(false)
        })
    })
  });
}

function clearServiceWorker() {
  return new Promise((resolve, reject) => {
    navigator.serviceWorker
      .getRegistrations()
      .then(function(registrations) {
        for (const registration of registrations) {
          registration.unregister();
        }
      })
      .then(() => {
        caches
          .keys()
          .then(function(keys) {
            const promises = [];
            // キャッシュストレージを全て削除する
            keys.forEach(function(cacheName) {
              if (cacheName) {
                console.log('[LOG INFO] cache key deleted! : ', cacheName, caches)
                promises.push(caches.delete(cacheName));
              }
            });
          })
          .finally(() => {
            resolve(true);
          });
      })
      .catch((e) => {
        console.error(e);
        reject(new Error(e));
      });
  });
}

/**
 * 通知が使用可能かチェックします
 *
 * @return {boolean} (true:使用可能, false:使用不可能)
 */
function isNotificationSupported() {
  return !!window.Notification
}

/**
 * 通知が使用可能かチェックします
 *
 * @return {Promise<boolean>} (true:使用可能, false:使用不可能)
 * @see https://developer.mozilla.org/ja/docs/Web/API/Notification
 */
function askForNPerm() {
  return new Promise((resolve) => {
    var func = function(permission) {
      console.log(permission);
      if (permission == 'denied') {
        resolve(false);
      } else if (permission == 'granted') {
        resolve(true);
      }
    };

    // TODO: iPad等、window.Notificationが対応していないデバイスをはじく
    if (!window.Notification) {
      func('denied')
      return;
    }

    if (Notification.permission === 'granted') {
      func('granted')
      return;
    }

    // TODO: iPad等、window.Notificationが対応していないデバイスをはじく
    if (!window.Notification.requestPermission) {
      func('denied')
      return;
    }

    try {
      Notification.requestPermission()
        .then(func);
    } catch (e) {
      // safariの場合、promiseに対応していないため、
      // 例外が発生したら、コールバック仕様のメソッドを試す
      Notification.requestPermission(func);
    }
  })
}

/**
 * 通常の通知
 *
 * @param {{
 *          title: string;
 *          options: object;
 *        }} params
 * @return {Promise<Notification>}
 * @see https://developer.mozilla.org/ja/docs/Web/API/Notification
 */
function showNotification(params) {
  try {
    var notification = new Notification(params.title, params.options);

    return Promise.resolve(notification)
  } catch (e) {
    return Promise.reject(e)
  }
}

/**
 * ServiceWorkerを使った通知
 *
 * @param {{
 *          title: string;
 *          options: object;
 *        }} params
 * @return {Promise<Notification>}
 * @see https://developer.mozilla.org/ja/docs/Web/API/ServiceWorkerRegistration/showNotification
 */
function showNotificationByServiceWorker(params) {
  if (!'serviceWorker' in navigator) {
    return Promise.reject('[LOG INFO] serviceWorker is not exist!')
  }
  if (!navigator.serviceWorker.controller) {
    return Promise.reject('[LOG INFO] serviceWorker controller is not exist! ')
  }

  return new Promise((resolve, reject) => {
    navigator.serviceWorker.ready.then(function(registration) {
      var afterEvent = function() {
        var timerId = null,
            init = null,
            final = null,
            handler = null;

        init = function () {
          timerId = setTimeout(function() {
            final()

            reject(new Error('[LOG INFO] Notification is not found!(reason: timeout)'))
          }, 5000)
          navigator.serviceWorker.addEventListener('message', handler);
        };
        final = function() {
          if (timerId) {
            clearTimeout(timerId)
            timerId = null
          }
          navigator.serviceWorker.removeEventListener('message', handler)
        };
        handler = function (event) {
          console.log(event)

          var request = event.data.request
          switch (request) {
            case 'notification_result':
              var result = event.data.result
              if (!result) {
                final()
                return reject(new Error('[LOG INFO] Notification is not found!'))
              }

              // 通知を検索して直前に送信したNotificationを取得する
              var options = {tag: params.options.tag}; // TODO: 通知タグはもし、使っているようであれば指定する。この通知タグはほかでも使いそうなので、
              registration.getNotifications(options).then(function(notifications) {
                var sortedNotifications = notifications
                  .slice(0)
                  .sort(function(l, r) { return - (l.timestamp - r.timestamp) })

                for (var i = 0; i < sortedNotifications.length; i ++) {
                  var v = sortedNotifications[i];
                  if (v.title === params.title) {
                    console.log('[LOG INFO] Notification is found!')
                    final()
                    return resolve(v)
                  }
                }

                final()
                return reject(new Error('[LOG INFO] Notification is not found!'))
              })
              break;
          }
        };

        init()
      };

      afterEvent()
    })
    .finally(function() {
      // ServiceWorkerに通知表示を依頼
      navigator.serviceWorker.controller.postMessage({
        request: 'notification',
        params: params,
      })
    })

  })
}

/**
 * 通知を表示します
 *
 * @param {{
 *          message: string - メッセージ
 *          url: string | null - 画像URL
 *          loginId: string - ログインID
 *          domainName: string - ドメイン名
 *        }} data
 * @return {Promise<Notification>}
 * @see front/plugins/kvs/type/sendMessageType.ts MessageObject
 */
function pushMessage(data) {
  var supportedImage = false;
  try {
    supportedImage = ('image' in Notification.prototype)
  } catch {
    // iOS Notificationオブジェクト自体が未実装
  }

  var title = data.message;
  var options = {
    requireInteraction: true,
  };
  if (data.url != null) {
    if (supportedImage) {
      options.image = data.url;
    } else {
      options.icon = data.url;
    }
  }
  var params = {title: title, options: options};

  if (/Android/i.test(navigator.userAgent)) {
    // Androidは通常のNotification()コンストラクタを実装していないので、ServiceWorkerを使う
    // @see https://developer.mozilla.org/ja/docs/Web/API/Notification/Notification
    // @see https://developer.mozilla.org/ja/docs/Web/API/ServiceWorkerRegistration/showNotification
    return showNotificationByServiceWorker(params)
  } else {
    // TODO: iPhone/iPadについては、通常のNotification()を実装していない、現在動作しない。仕様pending
    // @see https://developer.mozilla.org/ja/docs/Web/API/Notification/Notification
    return showNotification(params)
  }
}

export { startupServiceWorker, isNotificationSupported, askForNPerm, pushMessage };
