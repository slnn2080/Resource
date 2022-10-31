/**
 * フォーマッター
 *
 * @class
 */
export class Formatter {
  /**
   * Dateをフォーマット文字列に変換します
   *
   * @param {string} format
   * @param {Date} datetime
   * @return {string}
   */
  public static date(format: string, datetime: Date): string {
    const formatter:any = {
      _fmt: {
        hh(date: any) { return ('0' + date.getHours()).slice(-2); },
        mm(date: any) { return ('0' + date.getMinutes()).slice(-2); },
        ss(date: any) { return ('0' + date.getSeconds()).slice(-2); },
        dd(date: any) { return ('0' + date.getDate()).slice(-2); },
        yyyy(date: any) { return date.getFullYear() + ''; },
        MM(date: any) { return ('0' + (date.getMonth() + 1)).slice(-2); },
      } as any,
      _priority : ['hh', 'mm', 'ss', 'dd', 'yyyy', 'MM'],
      format(date: any, format: any) {
        return this._priority.reduce(
            (res: any, fmt: any) => {
              return res.replace(fmt, this._fmt[fmt](date));
            },
            format
        );
      },
    };

    return formatter.format(datetime, format);
  }
}

