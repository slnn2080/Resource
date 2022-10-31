export class PromiseUtils {
  /**
   * 成功するまで、処理を繰り返します
   *
   * @param {() => Promise<any>} callback
   * @param {{
   *          interval?: number,
   *          retryMax?: number,
   *          isAbort?: (e:any) => boolean | any
   *          dispose?: void | () => Promise<any>
   *        }} options
   * @return {Promise<any>}
   */
  public static repeatUntilSuccessful(
    callback: () => Promise<any>,
    options: any = {},
  ): Promise<any> {
    options = Object.assign({
      interval: 1000,
      retryMax: null,
      isAbort: (e: any) => false,
    }, options);

    return new Promise((resolve, reject) => {
      let retryCounter: number = 0;
      const run = () => {
        callback()
          .then(resolve)
          .catch((e) => {
            const reason = options.isAbort(e);
            if (reason) {
               reject(reason)
            } else {
              retryCounter ++
              if ((options.retryMax != null) && (options.retryMax < retryCounter)) {
                reject(false)
              } else {
                setTimeout(
                  () => {
                    const promise = options.dispose
                      ? (options.dispose as (() => Promise<any>))() || Promise.resolve(true)
                      : Promise.resolve(true)

                    promise
                      .then(() => run())
                  },
                  options.interval
                )
              }
            }
          })
      };

      run();
    })
  }
  
  /**
   * sleepします
   *
   * @param {number} msec
   * @return {Promise<any>}
   */
  public static sleep(msec: number) {
    return new Promise(resolve => setTimeout(resolve, msec))
  }
};

