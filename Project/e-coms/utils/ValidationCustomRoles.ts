import { ValidationRuleSchema } from 'vee-validate/dist/types/types';
import { LanguageEnum } from '@/store/enum/language';

/**
 * @see https://vee-validate.logaretm.com/v2/guide/custom-rules.html#creating-a-custom-rule
 */
interface CustomRules {
  [key: string]: ValidationRuleSchema;
}

export const customRules: CustomRules = {
  /**
   * 入力がYYYY/MM/DDの形式か検証する
   */
  data: {
    validate: (value: any, params: any) => {
      const dateRegex:RegExp = /^[0-9]{4}\/[0-9]{2}\/[0-9]{2}$/;
      return dateRegex.test(value);
    },
    message: (field: string, params: Record<string, any>) => {
      return '${filed}はYYYY/MM/DDのフォーマットで入力してください。';
    },
  },
  /**
   * 入力がIP形式か検証します
   */
  ip: {
    validate: (value: any, params: any) => {
      // @see https://www.compnet.jp/wordpress/archives/3471
      // const ipv6 = '(?:::|(?:[0-9a-fA-F]{1,4}:){1,7}:|:(?::[0-9a-fA-F]{1,4}){1,7}|(?:[0-9a-fA-F]{1,4}:){7}[0-9a-fA-F]{1,4}|(?:[0-9a-fA-F]{1,4}:){1,6}:[0-9a-fA-F]{1,4})';
      const ipv4 = '(?:(?:25[0-5]?|2[0-4][0-9]?|1[0-9]{2}|[1-9][0-9]?|0)(?:.(?:25[0-5]?|2[0-4][0-9]?|1[0-9]{2}|[1-9][0-9]?|0)){3})';
      // 先頭0許容
      // const ipv4 = '(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)(?:.(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)){3})';

      // const regex = new RegExp(`^(?:${ipv6}|${ipv4})$`);
      const regex = new RegExp(`^(?:${ipv4})$`);
      return regex.test(value);
    },
    message: (field: string, params: Record<string, any>) => {
      return `${field}はIPv4の形式でなければなりません。`;
    },
  },
  /**
   * 入力がprotocol://domainの形式か検証する
   */
  url: {
    validate: (value: any, params: any) => {
      return /https?:\/\/[\w/:%#\$&\?\(\)~\.=\+\-]+$/.test(value);
    },
    message: (field: string, params: Record<string, any>) => {
      if (field === '外部起動サービス') {
        return `起動URLはhttps://example.comの形式でなければなりません。`;
      }
      return `${field}はhttps://example.comの形式でなければなりません。`;
    },
  },
  /**
   * 入力がdomainの形式か検証する
   */
  domain: {
    validate: (value: any, params: any) => {
      // const regex = /^(?:[a-zA-Z0-9][a-zA-Z0-9-]*[a-zA-Z0-9]*\.)+[a-zA-Z]{2,}$/;
      // ラベルに使用できる文字種を限定しない
      const regex = /^(?:.{2,}\.)+.{2,}$/;
      return regex.test(value);
    },
    message: (field: string, params: Record<string, any>) => {
      return `${field}はexample.comの形式でなければなりません。`;
    },
  },
  /**
   * IPアドレスかドメインの一方が入力されているか検証する
   */
  required_ip_or_domain: {
    computesRequired: true,
    params: [
      {
        name: 'ip',
        isTarget: true,
      },
      {
        name: 'domain',
        isTarget: true,
      },
    ],
    validate: (value: any, params: any) => {
      return [params.ip, params.domain].filter(v => v !== '').length == 1;
    },
    message: (field: string, params: Record<string, any>) => {
      return `IPアドレスとドメインのいずれかを入力してください。`;
    },
  },
  /**
   * 配列要素のいずれかがtrueか検証します
   */
  some_json: {
    computesRequired: true,
    params: [
      {
        name: 'list_json',
        isTarget: true,
      },
    ],
    validate: (value: any, params: any) => {
      const list = JSON.parse(params.list_json);
      return (list as boolean[]).filter(v => !!v).length > 0;
    },
    message: (field: string, params: Record<string, any>) => {
      return '一つ以上の要素を選択してください。';
    },
  },
  /**
   * 試験団体か試験団体コードの一方が入力されているか検証する
   */
  group_or_group_code: {
    computesRequired: true,
    params: [
      {
        name: 'group',
        isTarget: true,
      },
      {
        name: 'groupCode',
        isTarget: true,
      },
    ],
    validate: (value: any, params: any) => {
      return [params.group, params.groupCode].filter(v => (v !== '' && v != null)).length <= 1;
    },
    message: (field: string, params: Record<string, any>) => {
      return `試験団体と試験団体コードのいずれかを入力してください。`;
    },
  },
  /**
   * 日時の組み合わせバリデーション
   */
  datetime_combination: {
    params: [
      {
        name: 'dateFrom',
        isTarget: true,
      },
      {
        name: 'timeFrom',
        isTarget: true,
      },
      {
        name: 'dateTo',
        isTarget: true,
      },
      {
        name: 'timeTo',
        isTarget: true,
      },
    ],
    validate: (value: any, params: any) => {
      // 組み合わせのバリデーション
      const v1 = params.dateFrom;
      const v2 = params.timeFrom;
      const v3 = params.dateTo;
      const v4 = params.timeTo;

      const r1 =
           ( v1 && !v2 && !v3 && !v4)
        || ( v1 &&  v2 && !v3 && !v4)
        || ( v1 &&  v2 &&  v3 && !v4)
        || ( v1 &&  v2 &&  v3 &&  v4)
        || (!v1 && !v2 &&  v3 &&  v4)
        || ( v1 && !v2 &&  v3 && !v4)
        || (!v1 &&  v2 && !v3 &&  v4)
        || (!v1 && !v2 && !v3 && !v4) // すべての入力が空ならok
      ;
      if (!r1) {
        return '試験日時の指定で、指定できない組み合わせがあります。';
      }

      return true;
    },
  },
};

